from http.server import BaseHTTPRequestHandler, HTTPServer
import json, random, os, time

vehicle_state = {"drive_mode": "ECO", "current_temp": 82.0, "current_speed": 60, "fault_recovery_timer": 0}

def read_cpp_rtos_pipe():
    if os.path.exists("rtos_live_pipe.txt"):
        try:
            with open("rtos_live_pipe.txt", "r") as f:
                parts = f.read().strip().split(",")
                if len(parts) == 3:
                    return int(parts), int(parts), int(parts)
        except:
            pass
    return 2400, 50, 6

class ProQNXHandler(BaseHTTPRequestHandler):
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
                vehicle_state["fault_recovery_timer"] = 2
                with open("qnx_blackbox.csv", "a") as f:
                    f.write("FAULT_DETECTED,MICROKERNEL_HAM_RESTART,12us\n")
            elif cmd in ["ECO", "SPORT", "EMERGENCY_STOP"]:
                vehicle_state["drive_mode"] = cmd
            self.send_response(200); self.send_header('Content-type', 'application/json'); self._cors(); self.end_headers()
            self.wfile.write(json.dumps({"status": "OK"}).encode())

    def do_GET(self):
        if self.path == '/telemetry':
            rpm, radar_m, latency_us = read_cpp_rtos_pipe()
            mode = vehicle_state["drive_mode"]

            # Self-Healing Microkernel Logic
            if vehicle_state["fault_recovery_timer"] > 0:
                vehicle_state["fault_recovery_timer"] -= 1
                status = "CRITICAL"
                ai_msg = "MICROKERNEL FAULT! Sensor driver crashed. QNX HAM auto-restarting process in 12us..."
            elif radar_m < 14 and mode != "EMERGENCY_STOP":
                vehicle_state["current_speed"] = max(0, vehicle_state["current_speed"] - 40)
                status = "CRITICAL"
                ai_msg = f"ADAS AUTO-BRAKE! Obstacle at {radar_m}m. QNX C++ Core intervened in {latency_us}us!"
            elif mode == "EMERGENCY_STOP":
                vehicle_state["current_speed"] = max(0, vehicle_state["current_speed"] - 35)
                vehicle_state["current_temp"] = max(75.0, vehicle_state["current_temp"] - 1.5)
                status = "CRITICAL"
                ai_msg = "MANUAL E-BRAKE ENGAGED! Halting vehicle safely."
            elif mode == "SPORT":
                vehicle_state["current_speed"] = random.randint(115, 160)
                vehicle_state["current_temp"] = min(118.0, vehicle_state["current_temp"] + random.uniform(1.5, 3.5))
                status = "WARNING" if vehicle_state["current_temp"] > 102 else "NORMAL"
                ai_msg = f"SPORT Telemetry active. RTOS Latency: {latency_us}us."
            else:
                vehicle_state["current_speed"] = random.randint(45, 80)
                vehicle_state["current_temp"] = max(80.0, vehicle_state["current_temp"] + random.uniform(-1.5, 1.0))
                status = "NORMAL"
                ai_msg = f"Microkernel Healthy ({latency_us}us). Radar clear ({radar_m}m)."

            payload = {
                "mode": mode, "speed_kmh": vehicle_state["current_speed"],
                "engine_temp_c": round(vehicle_state["current_temp"], 1),
                "battery_v": round(random.uniform(12.4, 14.3), 1), "rpm": rpm,
                "radar_m": radar_m, "latency_us": latency_us, "status": status, "ai_insight": ai_msg
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

HTTPServer(('0.0.0.0', 8080), ProQNXHandler).serve_forever()
