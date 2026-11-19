import json
import random
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

# यह QNX 8.0 पर चलने वाला रियल-टाइम टेलीमेट्री सर्वर है
HOST = "0.0.0.0"
PORT = 8080


class QNXTelemetryHandler(BaseHTTPRequestHandler):

  def do_GET(self):
    if self.path == "/telemetry":
      # CORS हेडर्स ताकि मोबाइल ब्राउज़र डेटा पढ़ सके
      self.send_response(200)
      self.send_header("Content-type", "application/json")
      self.send_header("Access-Control-Allow-Origin", "*")
      self.end_headers()

      # गाड़ी का रियल-टाइम सेंसर डेटा तैयार करना
      speed = random.randint(40, 125)
      engine_temp = random.randint(75, 115)
      battery_voltage = round(random.uniform(11.8, 14.4), 1)

      # स्थिति की जांच (Diagnostics Logic)
      status = "NORMAL"
      alert_msg = "All vehicle systems operating normally on QNX 8.0."

      if engine_temp > 105:
        status = "CRITICAL"
        alert_msg = "WARNING: High Engine Temperature! Slow down immediately."
      elif battery_voltage < 12.2:
        status = "WARNING"
        alert_msg = "CAUTION: Low Battery Voltage detected."

      data = {
          "os": "QNX Neutrino RTOS 8.0",
          "speed_kmh": speed,
          "engine_temp_c": engine_temp,
          "battery_v": battery_voltage,
          "status": status,
          "message": alert_msg,
      }

      self.wfile.write(json.dumps(data).encode("utf-8"))
    else:
      self.send_response(404)
      self.end_headers()


if __name__ == "__main__":
  server = HTTPServer((HOST, PORT), QNXTelemetryHandler)
  print(f"QNX 8.0 Vehicle Telemetry Server running on port {PORT}...")
  try:
    server.serve_forever()
  except KeyboardInterrupt:
    print("\nServer stopped.")
    server.server_close()
