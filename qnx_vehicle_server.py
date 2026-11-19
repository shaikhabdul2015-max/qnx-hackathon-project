from collections import deque
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import random
import time

HOST = "0.0.0.0"
PORT = 8080

# ग्लोबल व्हीकल स्टेट (जिसे मोबाइल से कंट्रोल किया जा सकेगा)
vehicle_state = {
    "drive_mode": "ECO",  # ECO, SPORT, EMERGENCY_STOP
    "temp_history": deque(maxlen=5),
    "current_temp": 82.0,
    "current_speed": 60,
    "battery_v": 13.8,
}


class AdvancedQNXHandler(BaseHTTPRequestHandler):

  def _send_cors_headers(self):
    self.send_header("Access-Control-Allow-Origin", "*")
    self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    self.send_header("Access-Control-Allow-Headers", "Content-Type")

  def do_OPTIONS(self):
    self.send_response(200)
    self._send_cors_headers()
    self.end_headers()

  # मोबाइल से कमांड रिसीव करना (Two-Way Control)
  def do_POST(self):
    if self.path == "/control":
      content_length = int(self.headers["Content-Length"])
      post_data = self.rfile.read(content_length)
      command = json.loads(post_data.decode("utf-8"))

      new_mode = command.get("mode")
      if new_mode in ["ECO", "SPORT", "EMERGENCY_STOP"]:
        vehicle_state["drive_mode"] = new_mode

      self.send_response(200)
      self.send_header("Content-type", "application/json")
      self._send_cors_headers()
      self.end_headers()
      self.wfile.write(
          json.dumps({
              "status": "OK",
              "active_mode": vehicle_state["drive_mode"],
          }).encode("utf-8")
      )

  # मोबाइल को लाइव टेलीमेट्री और AI प्रेडिक्शन भेजना
  def do_GET(self):
    if self.path == "/telemetry":
      mode = vehicle_state["drive_mode"]

      # मोड के हिसाब से रियल-टाइम सेंसर फिजिक्स
      if mode == "EMERGENCY_STOP":
        vehicle_state["current_speed"] = max(
            0, vehicle_state["current_speed"] - 35
        )
        vehicle_state["current_temp"] = max(
            75.0, vehicle_state["current_temp"] - 1.5
        )
      elif mode == "SPORT":
        vehicle_state["current_speed"] = random.randint(110, 155)
        vehicle_state["current_temp"] = min(
            118.0, vehicle_state["current_temp"] + random.uniform(1.5, 3.5)
        )
      else:  # ECO Mode
        vehicle_state["current_speed"] = random.randint(45, 80)
        vehicle_state["current_temp"] = max(
            80.0, vehicle_state["current_temp"] + random.uniform(-1.5, 1.2)
        )

      vehicle_state["battery_v"] = round(random.uniform(12.1, 14.4), 1)
      temp = round(vehicle_state["current_temp"], 1)
      vehicle_state["temp_history"].append(temp)

      # Edge AI Predictive Analysis (भविष्यवाणी इंजन)
      ai_prediction = "Stable thermal profile. Optimal RTOS scheduling."
      status = "NORMAL"

      if len(vehicle_state["temp_history"]) >= 3:
        trend = (
            vehicle_state["temp_history"][-1] - vehicle_state["temp_history"][0]
        )
        if temp > 105:
          status = "CRITICAL"
          ai_prediction = (
              "CRITICAL OVERHEAT! Auto-throttling recommended immediately."
          )
        elif trend > 4.0:
          status = "WARNING"
          ai_prediction = (
              f"AI ALERT: Rapid heat rise (+{round(trend,1)}°C). Overheat"
              " predicted in 10s!"
          )

      if mode == "EMERGENCY_STOP":
        status = "CRITICAL"
        ai_prediction = (
            "EMERGENCY BRAKE ENGAGED via Mobile Remote! Halting vehicle."
        )

      data = {
          "os": "QNX Neutrino RTOS 8.0",
          "mode": mode,
          "speed_kmh": vehicle_state["current_speed"],
          "engine_temp_c": temp,
          "battery_v": vehicle_state["battery_v"],
          "status": status,
          "ai_insight": ai_prediction,
      }

      self.send_response(200)
      self.send_header("Content-type", "application/json")
      self._send_cors_headers()
      self.end_headers()
      self.wfile.write(json.dumps(data).encode("utf-8"))
    else:
      self.send_response(404)
      self.end_headers()


if __name__ == "__main__":
  server = HTTPServer((HOST, PORT), AdvancedQNXHandler)
  print(f"Advanced QNX 8.0 AI Telemetry & Control Node running on port {PORT}...")
  server.serve_forever()
