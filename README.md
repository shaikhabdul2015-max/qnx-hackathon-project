# QNX 8.0 Smart Vehicle Telemetry & Mobile Companion

A real-time cross-platform automotive telemetry and diagnostics bridge designed for **QNX Neutrino RTOS 8.0** and mobile web companions.

## Overview
This project demonstrates real-time vehicle sensor processing on QNX 8.0 paired with an instant mobile monitoring dashboard. It is built for the **Automotive & Mobility** track of the QNX Global Hackathon.

## Architecture
1. **QNX 8.0 Telemetry Node (`qnx_vehicle_server.py`):** Runs natively on QNX 8.0 using standard Python libraries to simulate and serve real-time vehicle metrics (Speed, Engine Temperature, Battery Voltage) and perform safety diagnostics over HTTP.
2. **Mobile Companion App (`index.html`):** A responsive web dashboard accessible on Android/iOS browsers that fetches live telemetry from the QNX node every 2 seconds and displays critical safety alerts.

## How to Run on QNX 8.0
1. Boot your QNX 8.0 target (Raspberry Pi or QEMU simulator) with network access enabled.
2. Transfer `qnx_vehicle_server.py` to the QNX environment.
3. Run the server:
   ```bash
   python3 qnx_vehicle_server.py
   ```
4. Open `index.html` on your mobile browser, enter the QNX IP address (e.g., `http://<QNX-IP>:8080/telemetry`), and tap **Connect**.
# qnx-hackathon-project
