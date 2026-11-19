# QNX 8.0 Smart Vehicle AI Cockpit & Real-Time Telemetry Core

A full-stack, cross-platform automotive telemetry, two-way remote control, and predictive Edge AI diagnostics system engineered for **QNX Neutrino RTOS 8.0**.

## Key Innovations & Architecture
1. **QNX Native C++ Real-Time Core (`qnx_rtos_core.cpp`):** Implements POSIX Real-Time Round-Robin priority thread scheduling (`SCHED_RR`) for deterministic safety monitoring and logs high-speed vehicle telemetry to a Black-Box recorder (`qnx_blackbox.csv`).
2. **Edge AI Telemetry & Two-Way Control Bridge (`qnx_vehicle_server.py`):** Serves live vehicle metrics (Speed, Engine Temp, Battery Voltage), performs thermal trend analysis to predict overheating before failure, and executes real-time mode commands (`ECO`, `SPORT`, `EMERGENCY_STOP`).
3. **Mobile AI Cockpit Dashboard (`index.html`):** A responsive HTML5 Canvas dashboard featuring live waveform telemetry graphs, two-way remote vehicle controls, and automated Text-to-Speech voice warnings for critical safety alerts.

## How to Build & Run on QNX 8.0
1. Compile the Native C++ RTOS Core:
   ```bash
   g++ qnx_rtos_core.cpp -o qnx_rtos_core -lpthread && ./qnx_rtos_core
   ```
2. Start the Telemetry & Control Node:
   ```bash
   python3 qnx_vehicle_server.py
   ```
3. Open `index.html` on any mobile browser, enter the QNX node URL, and tap **LINK**.
