document.addEventListener("DOMContentLoaded", () => {
    const panel = document.createElement("div");
    panel.style.cssText = "width:92%;max-width:800px;margin:15px auto;padding:12px;box-sizing:border-box;overflow-x:auto;background:#0f172a;border:1px solid #334155;border-radius:10px;color:#e2e8f0;font-family:monospace;text-align:left;";
    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:12px;">
            <strong style="color:#38bdf8;">⚡ QNX ADAPTIVE PARTITIONING (APS) & V2X TELEMETRY</strong>
            <a href="qnx_blackbox.csv" download="QNX_Blackbox_Report.csv" style="background:#0284c7;color:white;padding:5px 12px;border-radius:5px;text-decoration:none;font-size:12px;">📥 EXPORT BLACKBOX CSV</a>
        </div>
        <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                <span>🛡️ Safety Kernel Partition (Prio 9u): <b id="aps-safe-txt">40%</b></span>
                <span>🎵 Infotainment / Non-Critical: <b id="aps-info-txt">60%</b></span>
            </div>
            <div style="width:100%;height:14px;background:#1e293b;border-radius:7px;overflow:hidden;display:flex;">
                <div id="aps-safe-bar" style="width:40%;background:#10b981;transition:0.4s;"></div>
                <div id="aps-info-bar" style="width:60%;background:#64748b;transition:0.4s;"></div>
            </div>
        </div>
        <div style="background:#020617;padding:10px;border-radius:6px;font-size:12px;border-left:3px solid #38bdf8;" id="v2x-box">
            📡 <b>V2X BSM Broadcast:</b> STANDBY (Monitoring CAN-Bus...)
        </div>
    `;
    document.body.appendChild(panel);

    const origSend = window.sendCommand;
    window.sendCommand = function(mode) {
        if (typeof origSend === "function") origSend(mode);
        const safeBar = document.getElementById("aps-safe-bar");
        const infoBar = document.getElementById("aps-info-bar");
        const safeTxt = document.getElementById("aps-safe-txt");
        const infoTxt = document.getElementById("aps-info-txt");
        const v2x = document.getElementById("v2x-box");

        if (mode === "INJECT_FAULT" || mode === "EMERGENCY_STOP") {
            safeBar.style.width = "90%"; safeBar.style.background = "#ef4444";
            infoBar.style.width = "10%";
            safeTxt.innerText = "90% (LOCKED)"; infoTxt.innerText = "10% (THROTTLED)";
            v2x.style.borderLeftColor = "#ef4444";
            v2x.innerHTML = `🚨 <b>V2X EMERGENCY BSM SENT:</b> {"msg":"${mode}","ham_recovery":"ACTIVE","mttr":"11.4ms","tx":"5.9GHz_DSRC"}`;
        } else if (mode === "SPORT") {
            safeBar.style.width = "65%"; safeBar.style.background = "#f59e0b";
            infoBar.style.width = "35%";
            safeTxt.innerText = "65%"; infoTxt.innerText = "35%";
            v2x.style.borderLeftColor = "#f59e0b";
            v2x.innerHTML = `📡 <b>V2X Telemetry:</b> {"mode":"SPORT","powertrain_prio":"HIGH","jitter":"0.03ms"}`;
        } else {
            safeBar.style.width = "40%"; safeBar.style.background = "#10b981";
            infoBar.style.width = "60%";
            safeTxt.innerText = "40%"; infoTxt.innerText = "60%";
            v2x.style.borderLeftColor = "#38bdf8";
            v2x.innerHTML = `📡 <b>V2X BSM Broadcast:</b> NORMAL_HEARTBEAT (All Microkernel Services Healthy)`;
        }
    };
});

// --- PRO UPGRADE: 3D Digital Twin + AI Voice Co-Pilot + Live Kernel Logs ---
document.addEventListener("DOMContentLoaded", () => {
    const proPanel = document.createElement("div");
    proPanel.style.cssText = "width:92%;max-width:800px;margin:15px auto;padding:14px;background:#0f172a;border:1px solid #334155;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;";
    proPanel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;">
            <strong style="color:#a855f7;">🚘 3D DIGITAL TWIN & QNX KERNEL RING BUFFER</strong>
            <span id="voice-badge" style="background:#1e293b;color:#38bdf8;padding:3px 8px;border-radius:4px;font-size:11px;">🔊 AI VOICE: READY</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
            <canvas id="twinCanvas" width="260" height="130" style="background:#020617;border:1px solid #1e293b;border-radius:8px;flex:1;min-width:240px;"></canvas>
            <div id="kernel-logs" style="background:#020617;border:1px solid #1e293b;border-radius:8px;padding:8px;height:114px;overflow-y:auto;font-size:11px;flex:1.4;min-width:250px;text-align:left;color:#94a3b8;">
                <div>[00.001] QNX Neutrino Microkernel 8.0 Booted...</div>
                <div>[00.014] HAM Guardian attached to PID 6734</div>
            </div>
        </div>
    `;
    document.body.appendChild(proPanel);

    const canvas = document.getElementById("twinCanvas");
    const ctx = canvas.getContext("2d");
    let modeState = "ECO", offset = 0;

    function addLog(tag, msg, color="#38bdf8") {
        const box = document.getElementById("kernel-logs");
        const t = new Date().toISOString().split("T").slice(0, -1);
        box.innerHTML += `<div style="color:${color};">[${t}] <b>[${tag}]</b> ${msg}</div>`;
        box.scrollTop = box.scrollHeight;
    }

    function speakAlert(text) {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.rate = 1.05;
            window.speechSynthesis.speak(u);
        }
    }

    function drawTwin() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Moving Road Grid
        const speedMult = modeState === "SPORT" ? 6 : (modeState === "EMERGENCY_STOP" || modeState === "INJECT_FAULT" ? 0 : 2.5);
        offset = (offset + speedMult) % 30;
        ctx.strokeStyle = "#1e293b";
        for (let x = -offset; x < canvas.width; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 105); ctx.lineTo(x - 15, 128); ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(0, 105); ctx.lineTo(canvas.width, 105); ctx.stroke();

        // Wireframe Car Chassis
        const carColor = modeState === "INJECT_FAULT" ? "#ef4444" : (modeState === "SPORT" ? "#f59e0b" : "#38bdf8");
        ctx.strokeStyle = carColor; ctx.lineWidth = 2;
        ctx.strokeRect(65, 65, 130, 28);
        ctx.beginPath(); ctx.moveTo(85, 65); ctx.lineTo(105, 42); ctx.lineTo(160, 42); ctx.lineTo(180, 65); ctx.stroke();

        // Wheels
        ctx.fillStyle = "#0f172a"; ctx.strokeStyle = "#94a3b8";
        [90, 170].forEach(wx => { ctx.beginPath(); ctx.arc(wx, 95, 11, 0, Math.PI*2); ctx.fill(); ctx.stroke(); });

        // Thermal Core Indicator
        ctx.fillStyle = modeState === "INJECT_FAULT" ? "rgba(239,68,68,0.8)" : "rgba(16,185,129,0.5)";
        ctx.fillRect(105, 72, 50, 14);
        ctx.fillStyle = "#fff"; ctx.font = "9px monospace";
        ctx.fillText(modeState === "INJECT_FAULT" ? "CORE OVERHEAT" : "BATT OK", 108, 82);

        requestAnimationFrame(drawTwin);
    }
    drawTwin();

    const prevSend = window.sendCommand;
    window.sendCommand = function(mode) {
        if (typeof prevSend === "function") prevSend(mode);
        modeState = mode;
        if (mode === "INJECT_FAULT") {
            addLog("HAM_CRIT", "Thermal anomaly isolated! Failover in 11.4ms", "#ef4444");
            speakAlert("Warning! Thermal fault detected. QNX Self Healing active.");
        } else if (mode === "EMERGENCY_STOP") {
            addLog("ADAS_BRK", "Emergency ABS override engaged. Speed 0 km/h", "#f87171");
            speakAlert("Emergency braking engaged.");
        } else if (mode === "SPORT") {
            addLog("APS_SCHED", "Powertrain partition boosted to 65% CPU", "#f59e0b");
            speakAlert("Sport mode active.");
        } else {
            addLog("KERN_OK", "System restored to ECO nominal state", "#4ade80");
        }
    };
});

// --- LEVEL-4 UPGRADE: Autonomous Obstacle Avoidance (AEB) & Auto-Link ---
document.addEventListener("DOMContentLoaded", () => {
    // Auto-fill 8080 server URL so you don't have to paste it after refresh
    const urlInput = document.querySelector("input");
    if (urlInput) {
        urlInput.value = window.location.origin.replace("-8000.", "-8080.");
    }

    // Add Autonomous Obstacle Test Button
    const badge = document.getElementById("voice-badge");
    if (badge) {
        const obsBtn = document.createElement("button");
        obsBtn.innerText = "🚧 TEST AUTO-AEB";
        obsBtn.style.cssText = "background:#e11d48;color:white;border:none;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:8px;";
        badge.parentNode.insertBefore(obsBtn, badge);

        obsBtn.onclick = () => {
            const logs = document.getElementById("kernel-logs");
            const t = new Date().toISOString().split("T").slice(0, -1);
            logs.innerHTML += `<div style="color:#facc15;">[${t}] <b>[RADAR_L4]</b> Object detected at 14.2m! Closing fast...</div>`;
            logs.scrollTop = logs.scrollHeight;

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Obstacle detected ahead. Autonomous emergency braking engaged."));
            }

            setTimeout(() => {
                if (typeof window.sendCommand === "function") window.sendCommand("EMERGENCY_STOP");
                logs.innerHTML += `<div style="color:#f87171;">[${t}] <b>[QNX_AEB]</b> Collision avoided! Zero-latency brake lock in 3.2ms.</div>`;
                logs.scrollTop = logs.scrollHeight;
            }, 600);
        };
    }
});

// --- CYBER-DEFENSE & OTA HYPERVISOR UPGRADE ---
document.addEventListener("DOMContentLoaded", () => {
    const cyberPanel = document.createElement("div");
    cyberPanel.style.cssText = "width:92%;max-width:800px;margin:15px auto;padding:14px;background:#0f172a;border:1px solid #334155;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;";
    cyberPanel.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:8px;">
            <strong style="color:#10b981;">🛡️ QNX HYPERVISOR CYBER-SHIELD & OTA MANAGER</strong>
            <div>
                <button id="btn-cyber" style="background:#9333ea;color:white;border:none;padding:5px 10px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:6px;">👾 SIMULATE CAN SPOOF</button>
                <button id="btn-ota" style="background:#0284c7;color:white;border:none;padding:5px 10px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">☁️ OTA LIVE PATCH</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
            <div style="flex:1;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:left;font-size:11px;">
                <div style="color:#94a3b8;margin-bottom:6px;"><b>🔐 CRYPTO-CAN FIREWALL STATUS:</b> <span id="fw-state" style="color:#4ade80;">VERIFIED (HMAC-SHA256)</span></div>
                <div style="color:#94a3b8;margin-bottom:6px;"><b>📦 BLOCKED SPOOF FRAMES:</b> <span id="spoof-cnt" style="color:#38bdf8;">0</span></div>
                <div style="color:#94a3b8;"><b>💿 KERNEL FIRMWARE:</b> <span id="ota-ver" style="color:#facc15;">QNX-SDP-8.0.1-REL</span></div>
            </div>
            <canvas id="jitterCanvas" width="260" height="85" style="background:#020617;border:1px solid #1e293b;border-radius:8px;flex:1;min-width:240px;"></canvas>
        </div>
    `;
    document.body.appendChild(cyberPanel);

    // Live Microsecond Jitter Oscilloscope
    const jCanvas = document.getElementById("jitterCanvas");
    const jCtx = jCanvas.getContext("2d");
    const jPoints = Array(40).fill(42);
    setInterval(() => {
        jPoints.shift();
        jPoints.push(35 + Math.random() * 18);
        jCtx.clearRect(0, 0, jCanvas.width, jCanvas.height);
        jCtx.strokeStyle = "#10b981"; jCtx.lineWidth = 1.5;
        jCtx.beginPath();
        jPoints.forEach((y, i) => {
            const x = (i / 39) * jCanvas.width;
            i === 0 ? jCtx.moveTo(x, y) : jCtx.lineTo(x, y);
        });
        jCtx.stroke();
        jCtx.fillStyle = "#64748b"; jCtx.font = "10px monospace";
        jCtx.fillText("RTOS DETERMINISTIC JITTER (<10us)", 8, 14);
    }, 150);

    let blockedCount = 0;
    const logs = document.getElementById("kernel-logs");

    // Cyber Attack Simulation
    document.getElementById("btn-cyber").onclick = () => {
        blockedCount += 14;
        document.getElementById("spoof-cnt").innerText = blockedCount + " PKTS DROPPED";
        const fw = document.getElementById("fw-state");
        fw.innerText = "INTRUSION ISOLATED!"; fw.style.color = "#ef4444";
        const t = new Date().toISOString().split("T").slice(0, -1);
        if (logs) {
            logs.innerHTML += `<div style="color:#c084fc;">[${t}] <b>[IDS_SEC]</b> Unauthorized CAN ID 0x7DF blocked! Hypervisor sandbox intact.</div>`;
            logs.scrollTop = logs.scrollHeight;
        }
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance("Cyber intrusion detected on CAN bus. Malicious packets isolated by QNX Hypervisor."));
        }
        setTimeout(() => { fw.innerText = "VERIFIED (HMAC-SHA256)"; fw.style.color = "#4ade80"; }, 4000);
    };

    // Zero-Downtime OTA Kernel Patching
    document.getElementById("btn-ota").onclick = () => {
        const ver = document.getElementById("ota-ver");
        ver.innerText = "PATCHING LIVE (0ms DOWNTIME)..."; ver.style.color = "#38bdf8";
        const t = new Date().toISOString().split("T").slice(0, -1);
        if (logs) {
            logs.innerHTML += `<div style="color:#38bdf8;">[${t}] <b>[OTA_MGR]</b> Swapping microkernel A/B memory bank...</div>`;
            logs.scrollTop = logs.scrollHeight;
        }
        setTimeout(() => {
            ver.innerText = "QNX-SDP-8.0.2-SEC-PATCHED"; ver.style.color = "#4ade80";
            if (logs) {
                logs.innerHTML += `<div style="color:#4ade80;">[${t}] <b>[OTA_OK]</b> Live firmware upgraded without reboot!</div>`;
                logs.scrollTop = logs.scrollHeight;
            }
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Over the air security patch applied with zero system downtime."));
            }
        }, 1200);
    };
});
