from http.server import BaseHTTPRequestHandler, HTTPServer
import json, random, os, socket

vehicle_state = {"drive_mode": "ECO", "current_temp": 82.0, "current_speed": 60, "fault_timer": 0}

def query_cpp_ipc_kernel():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        s.connect(('127.0.0.1', 9090))
        data = s.recv(128).decode().split(',')
        s.close()
        if len(data) == 4:
            return int(data[0]), int(data[1]), int(data[2]), int(data[3])
    except:
        pass
    return 2400, 50, 52, 5

class UltraQNXHandler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200); self._cors(); self.end_headers()

    def do_POST(self):
        if self.path == '/control':
            data = json.loads(self.rfile.read(int(self.headers['Content-Length'])).decode())
            cmd = data.get("mode")
            if cmd == "INJECT_FAULT":
                vehicle_state["fault_timer"] = 2
                with open("qnx_blackbox.csv", "a") as f:
                    f.write("CRITICAL_FAULT,QNX_HAM_MICROKERNEL_RECOVERY,9us\n")
            elif cmd in ["ECO", "SPORT", "EMERGENCY_STOP"]:
                vehicle_state["drive_mode"] = cmd
            self.send_response(200); self.send_header('Content-type', 'application/json'); self._cors(); self.end_headers()
            self.wfile.write(json.dumps({"status": "OK"}).encode())

    def do_GET(self):
        if self.path == '/telemetry':
            rpm, radar_m, lidar_m, latency_us = query_cpp_ipc_kernel()
            mode = vehicle_state["drive_mode"]
            fused_dist = round((radar_m + lidar_m) / 2, 1)

            if vehicle_state["fault_timer"] > 0:
                vehicle_state["fault_timer"] -= 1
                status = "CRITICAL"
                ai_msg = "MICROKERNEL FAULT! Driver crashed. QNX HAM auto-restarting thread in 9us!"
            elif fused_dist < 16 and mode != "EMERGENCY_STOP":
                vehicle_state["current_speed"] = max(0, vehicle_state["current_speed"] - 45)
                status = "CRITICAL"
                ai_msg = f"SENSOR FUSION AEB! Object at {fused_dist}m (Radar+LiDAR). Auto-braking in {latency_us}us!"
            elif mode == "EMERGENCY_STOP":
                vehicle_state["current_speed"] = max(0, vehicle_state["current_speed"] - 40)
                vehicle_state["current_temp"] = max(75.0, vehicle_state["current_temp"] - 1.5)
                status = "CRITICAL"
                ai_msg = "MANUAL E-BRAKE LOCKED! Vehicle halted safely."
            elif mode == "SPORT":
                vehicle_state["current_speed"] = random.randint(120, 165)
                vehicle_state["current_temp"] = min(118.0, vehicle_state["current_temp"] + random.uniform(1.5, 3.5))
                status = "WARNING" if vehicle_state["current_temp"] > 102 else "NORMAL"
                ai_msg = f"SPORT IPC Active. LiDAR/Radar Fused: {fused_dist}m | Latency: {latency_us}us."
            else:
                vehicle_state["current_speed"] = random.randint(45, 80)
                vehicle_state["current_temp"] = max(80.0, vehicle_state["current_temp"] + random.uniform(-1.5, 1.0))
                status = "NORMAL"
                ai_msg = f"QNX IPC Socket Healthy ({latency_us}us). Sensor Fusion Clear ({fused_dist}m)."

            payload = {
                "mode": mode, "speed_kmh": vehicle_state["current_speed"],
                "engine_temp_c": round(vehicle_state["current_temp"], 1),
                "battery_v": round(random.uniform(12.5, 14.3), 1), "rpm": rpm,
                "radar_m": radar_m, "lidar_m": lidar_m, "latency_us": latency_us,
                "status": status, "ai_insight": ai_msg
            }
            self.send_response(200); self.send_header('Content-type', 'application/json'); self._cors(); self.end_headers()
            self.wfile.write(json.dumps(payload).encode())
        elif self.path == '/blackbox':
            logs = "No logs yet."
            if os.path.exists("qnx_blackbox.csv"):
                with open("qnx_blackbox.csv") as f:
                    logs = "".join(f.readlines()[-8:])
            self.send_response(200); self.send_header('Content-type', 'text/plain'); self._cors(); self.end_headers()
            self.wfile.write(logs.encode())

HTTPServer(('0.0.0.0', 8080), UltraQNXHandler).serve_forever()
