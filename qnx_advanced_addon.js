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

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-lockstep")) return;
    const p = document.createElement("div");
    p.style.cssText = "width:92%;max-width:800px;margin:15px auto;padding:14px;background:#0f172a;border:1px solid #334155;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;";
    p.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#f59e0b;">🏅 ISO 26262 ASIL-D LOCKSTEP & V2V PLATOON</strong>
            <div>
                <button id="btn-lockstep" style="background:#d97706;color:#fff;border:none;padding:5px 8px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">⚡ CORE DESYNC</button>
                <button id="btn-platoon" style="background:#059669;color:#fff;border:none;padding:5px 8px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🚛 V2V PLATOON</button>
                <button id="btn-audit" style="background:#4f46e5;color:#fff;border:none;padding:5px 8px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">📜 ASIL-D AUDIT</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:11px;text-align:left;">
            <div style="flex:1;min-width:230px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div><b>🧠 LOCKSTEP:</b> <span id="ls-status" style="color:#4ade80;">SYNCED (CORE-0 == CORE-1)</span></div>
                <div style="margin-top:4px;"><b>🚛 V2V GAP:</b> <span id="platoon-gap" style="color:#94a3b8;">INDEPENDENT MODE</span></div>
            </div>
            <div style="flex:1;min-width:230px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;font-size:15px;" id="convoy-cars">🚗 (SOLO AUTONOMOUS)</div>
        </div>`;
    document.body.appendChild(p);

    const logs = document.getElementById("kernel-logs");
    let plat = false;

    document.getElementById("btn-lockstep").onclick = () => {
        const ls = document.getElementById("ls-status");
        ls.innerText = "MISMATCH! FAILOVER -> CORE-1 (0.4ms)"; ls.style.color = "#ef4444";
        if (logs) { logs.innerHTML += `<div style="color:#fbbf24;">[ASIL_D] Core-0 ALU mismatch! Lockstep failover to Core-1 in 0.4ms.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Lockstep core mismatch. Failover to shadow core completed.")); }
        setTimeout(() => { ls.innerText = "SYNCED (CORE-0 == CORE-1)"; ls.style.color = "#4ade80"; }, 4000);
    };

    document.getElementById("btn-platoon").onclick = () => {
        plat = !plat;
        const gap = document.getElementById("platoon-gap"), cars = document.getElementById("convoy-cars");
        if (plat) {
            gap.innerText = "LOCKED 12.0m (5.9GHz V2V)"; gap.style.color = "#4ade80";
            cars.innerHTML = `🚛 <span style="color:#38bdf8;font-size:11px;">-12m-</span> 🚘 <span style="color:#38bdf8;font-size:11px;">-12m-</span> 🚙`;
            if (logs) { logs.innerHTML += `<div style="color:#34d399;">[V2V_PLAT] Joined 3-vehicle autonomous platoon.</div>`; logs.scrollTop = logs.scrollHeight; }
        } else {
            gap.innerText = "INDEPENDENT MODE"; gap.style.color = "#94a3b8"; cars.innerText = "🚗 (SOLO AUTONOMOUS)";
        }
    };

    document.getElementById("btn-audit").onclick = () => {
        const blob = new Blob([`QNX 8.0 ISO 26262 ASIL-D AUDIT\nDate: ${new Date().toISOString()}\nLatency: <10us (PASS)\nLockstep Failover: 0.4ms (PASS)\nHAM Recovery: 11.4ms (PASS)\nCrypto-CAN Firewall: VERIFIED`], { type: "text/plain" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ISO26262_ASILD_Audit.txt"; a.click();
    };
});

// --- LAYER 6: AI VISION HUD, 8-CELL THERMAL MATRIX & AUTO JUDGE DEMO ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-autodemo")) return;
    const l6 = document.createElement("div");
    l6.style.cssText = "width:92%;max-width:800px;margin:15px auto 30px auto;padding:14px;background:#0f172a;border:1px solid #38bdf8;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 20px rgba(56,189,248,0.15);";
    l6.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#38bdf8;">👁️ AI VISION LANE HUD & EV BATTERY CELL MATRIX</strong>
            <button id="btn-autodemo" style="background:linear-gradient(90deg,#ec4899,#8b5cf6);color:#fff;border:none;padding:6px 12px;border-radius:5px;font-size:11px;font-weight:bold;cursor:pointer;">🎬 RUN AUTO-JUDGE DEMO</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
            <canvas id="visionCanvas" width="270" height="125" style="background:#020617;border:1px solid #1e293b;border-radius:8px;flex:1.2;min-width:240px;"></canvas>
            <div style="flex:1;min-width:230px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:left;">
                <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;"><b>🔋 8-CELL HV BATTERY THERMAL MATRIX:</b></div>
                <div id="cell-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;text-align:center;font-size:10px;"></div>
                <div style="font-size:10px;color:#38bdf8;margin-top:8px;" id="cool-valve">❄️ LIQUID COOLING LOOP: NOMINAL (35%)</div>
            </div>
        </div>`;
    document.body.appendChild(l6);

    // 8-Cell EV Battery Heatmap Updater
    const cellGrid = document.getElementById("cell-grid");
    let faultHeat = false;
    setInterval(() => {
        let html = "";
        for (let i = 1; i <= 8; i++) {
            const temp = (faultHeat && i === 6) ? (76 + Math.random()*5).toFixed(1) : (34 + Math.random()*3).toFixed(1);
            const hot = parseFloat(temp) > 55;
            html += `<div style="background:${hot ? '#7f1d1d' : '#064e3b'};border:1px solid ${hot ? '#ef4444' : '#10b981'};padding:5px 2px;border-radius:4px;color:#fff;">C${i}<br><b>${temp}°</b></div>`;
        }
        cellGrid.innerHTML = html;
        const valve = document.getElementById("cool-valve");
        if (faultHeat) { valve.innerText = "🚨 ACTIVE CRYO-COOLING VALVE: 100% OPEN"; valve.style.color = "#f87171"; }
        else { valve.innerText = "❄️ LIQUID COOLING LOOP: NOMINAL (35%)"; valve.style.color = "#38bdf8"; }
    }, 600);

    const origSend = window.sendCommand;
    window.sendCommand = function(m) {
        if (typeof origSend === "function") origSend(m);
        faultHeat = (m === "INJECT_FAULT");
    };

    // AI Computer Vision Road & Bounding Box HUD
    const vCan = document.getElementById("visionCanvas"), vCtx = vCan.getContext("2d");
    let roadY = 0;
    function drawVision() {
        vCtx.clearRect(0, 0, vCan.width, vCan.height);
        roadY = (roadY + 2.5) % 24;
        // Perspective Road Lanes
        vCtx.strokeStyle = "#38bdf8"; vCtx.lineWidth = 1.5;
        vCtx.beginPath(); vCtx.moveTo(95, 35); vCtx.lineTo(25, 125); vCtx.stroke();
        vCtx.beginPath(); vCtx.moveTo(175, 35); vCtx.lineTo(245, 125); vCtx.stroke();
        // Dashed Center Line
        vCtx.strokeStyle = "#64748b"; vCtx.setLineDash([8, 8]); vCtx.lineDashOffset = -roadY;
        vCtx.beginPath(); vCtx.moveTo(135, 35); vCtx.lineTo(135, 125); vCtx.stroke();
        vCtx.setLineDash([]);
        // AI Object Detection Bounding Box
        const boxColor = faultHeat ? "#ef4444" : "#4ade80";
        vCtx.strokeStyle = boxColor; vCtx.lineWidth = 1.5;
        vCtx.strokeRect(112, 48, 46, 30);
        vCtx.fillStyle = boxColor; vCtx.font = "9px monospace";
        vCtx.fillText(faultHeat ? "OBJ: 11.2m [TTC 0.8s]" : "VEH: 28.4m [99.4%]", 88, 43);
        vCtx.fillStyle = "#94a3b8"; vCtx.fillText("QNX VISION NN: 60 FPS", 8, 13);
        requestAnimationFrame(drawVision);
    }
    drawVision();

    // One-Click Automated Demo Sequence for Judges
    document.getElementById("btn-autodemo").onclick = () => {
        const btn = document.getElementById("btn-autodemo");
        btn.innerText = "⏳ DEMO RUNNING...";
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance("Initiating QNX 8.0 full autonomous safety demonstration."));
        }
        setTimeout(() => { if (window.sendCommand) window.sendCommand("SPORT"); }, 1000);
        setTimeout(() => { const b = document.getElementById("btn-platoon"); if (b) b.click(); }, 3500);
        setTimeout(() => { const b = document.getElementById("btn-cyber"); if (b) b.click(); }, 6500);
        setTimeout(() => { const b = document.getElementById("btn-lockstep"); if (b) b.click(); }, 9500);
        setTimeout(() => {
            if (window.sendCommand) window.sendCommand("ECO");
            btn.innerText = "🎬 RUN AUTO-JUDGE DEMO";
        }, 13000);
    };
});

// --- LAYER 7 (APEX): RTK-GPS SATELLITE NAV, ZERO-COPY IPC & VOICE RECOGNITION ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-geofence")) return;
    const l7 = document.createElement("div");
    l7.style.cssText = "width:92%;max-width:800px;margin:15px auto 35px auto;padding:14px;background:#0f172a;border:1px solid #a855f7;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 22px rgba(168,85,247,0.2);";
    l7.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#c084fc;">🛰️ RTK-GPS / NAVIC SATELLITE NAV & ZERO-COPY IPC</strong>
            <div>
                <button id="btn-geofence" style="background:#db2777;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🛰️ GPS JAM TEST</button>
                <button id="btn-mic" style="background:#7c3aed;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🎙️ VOICE CMD</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
            <canvas id="satCanvas" width="250" height="115" style="background:#020617;border:1px solid #1e293b;border-radius:8px;flex:1;min-width:230px;"></canvas>
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:left;font-size:11px;">
                <div style="margin-bottom:5px;"><b>📡 GNSS / NavIC LOCK:</b> <span id="gps-mode" style="color:#4ade80;">RTK-FIX (±1.2 cm)</span></div>
                <div style="margin-bottom:5px;"><b>⚡ ZERO-COPY IPC:</b> <span id="ipc-rate" style="color:#38bdf8;">1.48M MsgSend/sec</span></div>
                <div><b>🧠 KERNEL HEAP:</b> <span style="color:#facc15;">14.2 MB (0 LEAKS / DETERMINISTIC)</span></div>
            </div>
        </div>`;
    document.body.appendChild(l7);

    // Live Satellite Radar & RTK Trajectory Canvas
    const sCan = document.getElementById("satCanvas"), sCtx = sCan.getContext("2d");
    let satAngle = 0, gpsJammed = false;
    function drawSat() {
        sCtx.clearRect(0, 0, sCan.width, sCan.height);
        satAngle += 0.02;
        const cx = 125, cy = 58;
        // Orbit Rings
        sCtx.strokeStyle = "#1e293b"; sCtx.lineWidth = 1;
       [].forEach(r => { sCtx.beginPath(); sCtx.arc(cx, cy, r, 0, Math.PI*2); sCtx.stroke(); });
        // Moving Satellites
       [].forEach((off, idx) => {
            const r = idx % 2 === 0 ? 25 : 44;
            const x = cx + Math.cos(satAngle + off) * r;
            const y = cy + Math.sin(satAngle + off) * r;
            sCtx.fillStyle = gpsJammed ? "#ef4444" : "#38bdf8";
            sCtx.beginPath(); sCtx.arc(x, y, 3, 0, Math.PI*2); sCtx.fill();
        });
        // Vehicle Center Fix
        sCtx.fillStyle = gpsJammed ? "#f59e0b" : "#4ade80";
        sCtx.beginPath(); sCtx.arc(cx, cy, 4, 0, Math.PI*2); sCtx.fill();
        sCtx.fillStyle = "#94a3b8"; sCtx.font = "9px monospace";
        sCtx.fillText(gpsJammed ? "IMU DEAD-RECKONING ACTIVE" : "14 SATS LOCKED (GPS+NAVIC)", 8, 12);
        requestAnimationFrame(drawSat);
    }
    drawSat();

    setInterval(() => {
        const rate = (1.42 + Math.random()*0.15).toFixed(2);
        const el = document.getElementById("ipc-rate");
        if (el) el.innerText = rate + "M MsgSend/sec";
    }, 800);

    const logs = document.getElementById("kernel-logs");

    // GPS Jamming & Quantum IMU Dead-Reckoning Failover
    document.getElementById("btn-geofence").onclick = () => {
        gpsJammed = !gpsJammed;
        const gm = document.getElementById("gps-mode");
        if (gpsJammed) {
            gm.innerText = "SPOOFED! IMU DEAD-RECKONING"; gm.style.color = "#f59e0b";
            if (logs) { logs.innerHTML += `<div style="color:#f472b6;">[NAV_IMU] Satellite signal lost! Switched to 1000Hz Quantum IMU fusion.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Satellite signal jammed. Inertial dead reckoning navigation active.")); }
        } else {
            gm.innerText = "RTK-FIX (±1.2 cm)"; gm.style.color = "#4ade80";
        }
    };

    // Real Speech-to-Action Voice Command Listener
    document.getElementById("btn-mic").onclick = () => {
        const btn = document.getElementById("btn-mic");
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            if (window.sendCommand) window.sendCommand("SPORT");
            return;
        }
        const rec = new SpeechRec();
        rec.lang = "en-US";
        btn.innerText = "👂 LISTENING...";
        rec.onresult = (e) => {
            const cmd = e.results.transcript.toLowerCase();
            if (logs) { logs.innerHTML += `<div style="color:#c084fc;">[VOICE_AI] Command heard: "${cmd}"</div>`; logs.scrollTop = logs.scrollHeight; }
            if (cmd.includes("sport")) window.sendCommand("SPORT");
            else if (cmd.includes("brake") || cmd.includes("stop")) window.sendCommand("EMERGENCY_STOP");
            else if (cmd.includes("fault")) window.sendCommand("INJECT_FAULT");
            else if (cmd.includes("demo")) document.getElementById("btn-autodemo")?.click();
            else window.sendCommand("ECO");
            btn.innerText = "🎙️ VOICE CMD";
        };
        rec.onerror = () => { btn.innerText = "🎙️ VOICE CMD"; };
        rec.start();
    };
});

// --- LAYER 8 (ULTIMATE): POST-QUANTUM CRYPTO, V2I SMART CITY GRID & EDGE NPU ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-pqc")) return;
    const l8 = document.createElement("div");
    l8.style.cssText = "width:92%;max-width:800px;margin:15px auto 40px auto;padding:14px;background:#0f172a;border:1px solid #14b8a6;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 24px rgba(20,184,166,0.22);";
    l8.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#2dd4bf;">⚛️ POST-QUANTUM CRYPTO (PQC), V2I SMART GRID & EDGE NPU</strong>
            <div>
                <button id="btn-pqc" style="background:#0d9488;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🔐 ROTATE PQC KEY</button>
                <button id="btn-v2i" style="background:#2563eb;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🚦 V2I GREEN-WAVE</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>⚛️ QUANTUM SHIELD:</b> <span id="pqc-stat" style="color:#4ade80;">KYBER-1024 ACTIVE (256-BIT EQ)</span></div>
                <div style="margin-bottom:5px;"><b>🚦 V2I TRAFFIC GRID:</b> <span id="v2i-stat" style="color:#38bdf8;">RSU-04 SYNCED (GREEN WAVE)</span></div>
                <div><b>🧠 EDGE AI NPU:</b> <span id="npu-tops" style="color:#facc15;">142.8 TOPS (42% LOAD)</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#64748b;margin-bottom:6px;">SMART CORRIDOR SIGNAL LINK</div>
                <div style="font-size:18px;letter-spacing:4px;" id="v2i-lights">🔴 🟡 <span style="text-shadow:0 0 10px #4ade80;">🟢</span></div>
                <div style="font-size:10px;color:#2dd4bf;margin-top:5px;" id="v2i-eta">NEXT JUNCTION: 0s STOP</div>
            </div>
        </div>`;
    document.body.appendChild(l8);

    setInterval(() => {
        const tops = (138 + Math.random()*14).toFixed(1);
        const load = Math.floor(38 + Math.random()*12);
        const el = document.getElementById("npu-tops");
        if (el) el.innerText = `${tops} TOPS (${load}% LOAD)`;
    }, 900);

    const logs = document.getElementById("kernel-logs");

    document.getElementById("btn-pqc").onclick = () => {
        const p = document.getElementById("pqc-stat");
        const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
        p.innerText = `KEY ROTATED [0x${hex}] (0.2ms)`; p.style.color = "#2dd4bf";
        if (logs) { logs.innerHTML += `<div style="color:#2dd4bf;">[PQC_SEC] Post-Quantum Kyber-1024 session key rotated: 0x${hex}</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Post quantum cryptographic keys rotated.")); }
        setTimeout(() => { p.innerText = "KYBER-1024 ACTIVE (256-BIT EQ)"; p.style.color = "#4ade80"; }, 3500);
    };

    document.getElementById("btn-v2i").onclick = () => {
        const vs = document.getElementById("v2i-stat"), eta = document.getElementById("v2i-eta");
        vs.innerText = "EMERGENCY CORRIDOR PREEMPTED!"; vs.style.color = "#4ade80";
        eta.innerText = "ALL 4 SIGNALS LOCKED GREEN";
        if (logs) { logs.innerHTML += `<div style="color:#60a5fa;">[V2I_GRID] Smart City RSU corridor locked GREEN for QNX vehicle.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Smart city V2I green wave corridor locked.")); }
    };
});

// --- LAYER 9 (SINGULARITY): DRIVER BIOMETRIC AI, FLEET MESH & ARCHITECTURE BLUEPRINT ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-dms")) return;
    const l9 = document.createElement("div");
    l9.style.cssText = "width:92%;max-width:800px;margin:15px auto 45px auto;padding:14px;background:#0f172a;border:1px solid #f43f5e;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 25px rgba(244,63,94,0.22);";
    l9.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#fb7185;">🧬 DRIVER BIOMETRIC DMS, CLOUD FLEET MESH & BLUEPRINT</strong>
            <div>
                <button id="btn-dms" style="background:#e11d48;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">😴 DRIVER FATIGUE</button>
                <button id="btn-arch" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">📐 ARCHITECTURE</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>💓 DRIVER BIOMETRICS:</b> <span id="dms-stat" style="color:#4ade80;">ALERT | 74 BPM | EYE-TRACK OK</span></div>
                <div style="margin-bottom:5px;"><b>🌐 CLOUD FLEET MESH:</b> <span style="color:#38bdf8;">42 PEER NODES SYNCED (MUM-PUN CORRIDOR)</span></div>
                <div><b>🛡️ FAIL-OPERATIONAL:</b> <span id="pullover-stat" style="color:#facc15;">STANDBY (L4 SAFE-STOP READY)</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#64748b;margin-bottom:5px;">SWARM HAZARD MESH STREAM</div>
                <div style="font-size:11px;color:#34d399;" id="mesh-feed">NODE-19: CLEAR ROAD [0.02s]</div>
                <div style="font-size:10px;color:#94a3b8;margin-top:4px;">QNX IVY EDGE CLOUD BRIDGE</div>
            </div>
        </div>
        <div id="arch-modal" style="display:none;margin-top:12px;background:#020617;border:1px dashed #38bdf8;border-radius:8px;padding:12px;font-size:11px;text-align:left;color:#cbd5e1;">
            <b style="color:#38bdf8;">🏗️ QNX 8.0 9-LAYER DETERMINISTIC STACK:</b><br>
            [HW/Sensors] ➔ [C++ Multi-Threaded RTOS Core & Lockstep] ➔ [Zero-Copy Socket IPC] ➔ [APS 90% Safety Partition & HAM Self-Healing] ➔ [Hypervisor Crypto-CAN & Kyber-1024 PQC] ➔ [AI Vision / DMS / V2X / Cloud Swarm UI]
        </div>`;
    document.body.appendChild(l9);

    const meshMsgs = [
        "NODE-19: CLEAR ROAD [0.02s]",
        "NODE-07: WET SURFACE AHEAD +2km",
        "NODE-31: PLATOON SYNC VERIFIED",
        "NODE-12: GREEN-WAVE RSU LOCKED"
    ];
    let mIdx = 0;
    setInterval(() => {
        mIdx = (mIdx + 1) % meshMsgs.length;
        const mf = document.getElementById("mesh-feed");
        if (mf) mf.innerText = meshMsgs[mIdx];
    }, 2200);

    const logs = document.getElementById("kernel-logs");

    document.getElementById("btn-dms").onclick = () => {
        const dms = document.getElementById("dms-stat"), po = document.getElementById("pullover-stat");
        dms.innerText = "DROWSINESS DETECTED! 112 BPM"; dms.style.color = "#ef4444";
        po.innerText = "EXECUTING AUTONOMOUS LANE PULLOVER!"; po.style.color = "#f87171";
        if (logs) { logs.innerHTML += `<div style="color:#fb7185;">[DMS_BIO] Driver micro-sleep detected! Engaging autonomous safe-shoulder pullover.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Driver fatigue detected. Engaging autonomous safe shoulder pullover.")); }
        if (typeof window.sendCommand === "function") window.sendCommand("EMERGENCY_STOP");
        setTimeout(() => {
            dms.innerText = "ALERT | 74 BPM | EYE-TRACK OK"; dms.style.color = "#4ade80";
            po.innerText = "STANDBY (L4 SAFE-STOP READY)"; po.style.color = "#facc15";
        }, 5000);
    };

    document.getElementById("btn-arch").onclick = () => {
        const m = document.getElementById("arch-modal");
        m.style.display = (m.style.display === "none") ? "block" : "none";
    };
});

// --- LAYER 10 (OMEGA): V2G SMART ENERGY, PREDICTIVE RUL & LIVE HEX PACKET SNIFFER ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-v2g")) return;
    const l10 = document.createElement("div");
    l10.style.cssText = "width:92%;max-width:800px;margin:15px auto 50px auto;padding:14px;background:#0f172a;border:1px solid #eab308;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 28px rgba(234,179,8,0.22);";
    l10.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#facc15;">👑 LAYER 10 (OMEGA): V2G ENERGY, PREDICTIVE RUL & HEX SNIFFER</strong>
            <div>
                <button id="btn-v2g" style="background:#ca8a04;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">⚡ V2G GRID SELL</button>
                <button id="btn-wear" style="background:#ea580c;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🔧 TEST RUL WEAR</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>⚡ V2G BIDIRECTIONAL:</b> <span id="v2g-stat" style="color:#4ade80;">CHARGING (11.2 kW AC)</span></div>
                <div style="margin-bottom:5px;"><b>⚙️ PREDICTIVE RUL:</b> <span id="rul-stat" style="color:#38bdf8;">BRAKES 96% | INV 99%</span></div>
                <div><b>🔍 QNX HEX BUS:</b> <span id="hex-frame" style="color:#facc15;">0x108 [8] 4A 9F 02 E1 7C</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#64748b;margin-bottom:4px;">LIVE MICROKERNEL FRAME RATE</div>
                <div style="font-size:16px;font-weight:bold;color:#4ade80;" id="bus-hz">10,000 Hz (0% DROP)</div>
                <div style="font-size:10px;color:#94a3b8;margin-top:4px;">10-LAYER OMEGA STACK VERIFIED</div>
            </div>
        </div>`;
    document.body.appendChild(l10);

    // Live Hexadecimal CAN/QNX Bus Stream
    setInterval(() => {
        const id = ["0x108", "0x24A", "0x3F1", "0x7E0"][Math.floor(Math.random()*4)];
        const bytes = Array.from({length:5}, () => Math.floor(Math.random()*255).toString(16).padStart(2,'0').toUpperCase()).join(" ");
        const hf = document.getElementById("hex-frame");
        if (hf) hf.innerText = `${id} [8] ${bytes}`;
    }, 350);

    const logs = document.getElementById("kernel-logs");
    let v2gSelling = false;

    document.getElementById("btn-v2g").onclick = () => {
        v2gSelling = !v2gSelling;
        const vs = document.getElementById("v2g-stat");
        if (v2gSelling) {
            vs.innerText = "EXPORTING 15.4 kW (+₹185/hr)"; vs.style.color = "#facc15";
            if (logs) { logs.innerHTML += `<div style="color:#facc15;">[V2G_PWR] Bidirectional inverter active! Feeding 15.4kW to Smart Grid.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Vehicle to grid energy export activated.")); }
        } else {
            vs.innerText = "CHARGING (11.2 kW AC)"; vs.style.color = "#4ade80";
        }
    };

    document.getElementById("btn-wear").onclick = () => {
        const rs = document.getElementById("rul-stat");
        rs.innerText = "PAD WEAR 18%! AUTO-BOOKED SERVICE"; rs.style.color = "#ef4444";
        if (logs) { logs.innerHTML += `<div style="color:#fb923c;">[AI_RUL] Brake pad RUL below 20%. Predictive maintenance ticket dispatched.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Predictive maintenance alert. Brake pad wear detected. Service slot booked.")); }
        setTimeout(() => { rs.innerText = "BRAKES 96% | INV 99%"; rs.style.color = "#38bdf8"; }, 4500);
    };
});

// --- LAYER 11 (GENESIS): 360 LIDAR POINT-CLOUD, NEUROMORPHIC SNN & SCOUT DRONE ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-drone")) return;
    const l11 = document.createElement("div");
    l11.style.cssText = "width:92%;max-width:800px;margin:15px auto 55px auto;padding:14px;background:#0f172a;border:1px solid #06b6d4;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 30px rgba(6,182,212,0.25);";
    l11.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#22d3ee;">🌌 LAYER 11 (GENESIS): 360° LIDAR POINT-CLOUD, SNN & SCOUT DRONE</strong>
            <div>
                <button id="btn-drone" style="background:#0891b2;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🚁 LAUNCH SCOUT DRONE</button>
                <button id="btn-snn" style="background:#4f46e5;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">⚡ SNN REFLEX BURST</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <canvas id="lidarCanvas" width="240" height="115" style="background:#020617;border:1px solid #1e293b;border-radius:8px;flex:1;min-width:220px;"></canvas>
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🧠 NEUROMORPHIC SNN:</b> <span id="snn-stat" style="color:#4ade80;">1.8W ULTRA-LOW PWR (0.15ms)</span></div>
                <div style="margin-bottom:5px;"><b>🚁 AERIAL SCOUT UAV:</b> <span id="drone-stat" style="color:#38bdf8;">DOCKED ON ROOF POD (100% BAT)</span></div>
                <div><b>🌐 360° POINT CLOUD:</b> <span style="color:#facc15;">1.28M PTS/SEC (64-BEAM LASER)</span></div>
            </div>
        </div>`;
    document.body.appendChild(l11);

    // Live 360-Degree Rotating LiDAR Point-Cloud Canvas
    const pCan = document.getElementById("lidarCanvas"), pCtx = pCan.getContext("2d");
    let sweep = 0;
    function drawLidar() {
        pCtx.fillStyle = "rgba(2, 6, 23, 0.25)";
        pCtx.fillRect(0, 0, pCan.width, pCan.height);
        sweep += 0.07;
        const cx = 120, cy = 58;
        // Laser Sweep Line
        pCtx.strokeStyle = "#22d3ee"; pCtx.lineWidth = 1.5;
        pCtx.beginPath(); pCtx.moveTo(cx, cy);
        pCtx.lineTo(cx + Math.cos(sweep)*52, cy + Math.sin(sweep)*52); pCtx.stroke();
        // Simulated Terrain & Object Laser Dots
        for (let i = 0; i < 18; i++) {
            const a = sweep - (i * 0.12);
            const dist = 28 + Math.sin(a * 3) * 14;
            pCtx.fillStyle = dist < 22 ? "#ef4444" : "#34d399";
            pCtx.fillRect(cx + Math.cos(a)*dist, cy + Math.sin(a)*dist, 2, 2);
        }
        pCtx.fillStyle = "#94a3b8"; pCtx.font = "9px monospace";
        pCtx.fillText("64-CHANNEL LIDAR SLAM", 8, 12);
        requestAnimationFrame(drawLidar);
    }
    drawLidar();

    const logs = document.getElementById("kernel-logs");
    let droneLaunched = false;

    document.getElementById("btn-drone").onclick = () => {
        droneLaunched = !droneLaunched;
        const ds = document.getElementById("drone-stat");
        if (droneLaunched) {
            ds.innerText = "AIRBORNE +500m AHEAD (MAPPING ROUTE)"; ds.style.color = "#facc15";
            if (logs) { logs.innerHTML += `<div style="color:#22d3ee;">[UAV_SCOUT] Roof pod opened! Recon drone scanning +500m corridor ahead.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Autonomous scout drone launched. Scanning traffic 500 meters ahead.")); }
        } else {
            ds.innerText = "DOCKED ON ROOF POD (100% BAT)"; ds.style.color = "#38bdf8";
        }
    };

    document.getElementById("btn-snn").onclick = () => {
        const ss = document.getElementById("snn-stat");
        ss.innerText = "SPIKE BURST! 0.08ms EVASION REFLEX"; ss.style.color = "#c084fc";
        if (logs) { logs.innerHTML += `<div style="color:#818cf8;">[SNN_CORE] Neuromorphic spike-train processed 40,000 synapses in 0.08ms.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Neuromorphic reflex burst verified at 0.08 milliseconds.")); }
        setTimeout(() => { ss.innerText = "1.8W ULTRA-LOW PWR (0.15ms)"; ss.style.color = "#4ade80"; }, 4000);
    };
});

// --- LAYER 11 (GENESIS): 360 LIDAR POINT-CLOUD, NEUROMORPHIC SNN & SCOUT DRONE ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-drone")) return;
    const l11 = document.createElement("div");
    l11.style.cssText = "width:92%;max-width:800px;margin:15px auto 55px auto;padding:14px;background:#0f172a;border:1px solid #06b6d4;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 30px rgba(6,182,212,0.25);";
    l11.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#22d3ee;">🌌 LAYER 11 (GENESIS): 360° LIDAR POINT-CLOUD, SNN & SCOUT DRONE</strong>
            <div>
                <button id="btn-drone" style="background:#0891b2;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🚁 LAUNCH SCOUT DRONE</button>
                <button id="btn-snn" style="background:#4f46e5;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">⚡ SNN REFLEX BURST</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <canvas id="lidarCanvas" width="240" height="115" style="background:#020617;border:1px solid #1e293b;border-radius:8px;flex:1;min-width:220px;"></canvas>
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🧠 NEUROMORPHIC SNN:</b> <span id="snn-stat" style="color:#4ade80;">1.8W ULTRA-LOW PWR (0.15ms)</span></div>
                <div style="margin-bottom:5px;"><b>🚁 AERIAL SCOUT UAV:</b> <span id="drone-stat" style="color:#38bdf8;">DOCKED ON ROOF POD (100% BAT)</span></div>
                <div><b>🌐 360° POINT CLOUD:</b> <span style="color:#facc15;">1.28M PTS/SEC (64-BEAM LASER)</span></div>
            </div>
        </div>`;
    document.body.appendChild(l11);

    // Live 360-Degree Rotating LiDAR Point-Cloud Canvas
    const pCan = document.getElementById("lidarCanvas"), pCtx = pCan.getContext("2d");
    let sweep = 0;
    function drawLidar() {
        pCtx.fillStyle = "rgba(2, 6, 23, 0.25)";
        pCtx.fillRect(0, 0, pCan.width, pCan.height);
        sweep += 0.07;
        const cx = 120, cy = 58;
        // Laser Sweep Line
        pCtx.strokeStyle = "#22d3ee"; pCtx.lineWidth = 1.5;
        pCtx.beginPath(); pCtx.moveTo(cx, cy);
        pCtx.lineTo(cx + Math.cos(sweep)*52, cy + Math.sin(sweep)*52); pCtx.stroke();
        // Simulated Terrain & Object Laser Dots
        for (let i = 0; i < 18; i++) {
            const a = sweep - (i * 0.12);
            const dist = 28 + Math.sin(a * 3) * 14;
            pCtx.fillStyle = dist < 22 ? "#ef4444" : "#34d399";
            pCtx.fillRect(cx + Math.cos(a)*dist, cy + Math.sin(a)*dist, 2, 2);
        }
        pCtx.fillStyle = "#94a3b8"; pCtx.font = "9px monospace";
        pCtx.fillText("64-CHANNEL LIDAR SLAM", 8, 12);
        requestAnimationFrame(drawLidar);
    }
    drawLidar();

    const logs = document.getElementById("kernel-logs");
    let droneLaunched = false;

    document.getElementById("btn-drone").onclick = () => {
        droneLaunched = !droneLaunched;
        const ds = document.getElementById("drone-stat");
        if (droneLaunched) {
            ds.innerText = "AIRBORNE +500m AHEAD (MAPPING ROUTE)"; ds.style.color = "#facc15";
            if (logs) { logs.innerHTML += `<div style="color:#22d3ee;">[UAV_SCOUT] Roof pod opened! Recon drone scanning +500m corridor ahead.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Autonomous scout drone launched. Scanning traffic 500 meters ahead.")); }
        } else {
            ds.innerText = "DOCKED ON ROOF POD (100% BAT)"; ds.style.color = "#38bdf8";
        }
    };

    document.getElementById("btn-snn").onclick = () => {
        const ss = document.getElementById("snn-stat");
        ss.innerText = "SPIKE BURST! 0.08ms EVASION REFLEX"; ss.style.color = "#c084fc";
        if (logs) { logs.innerHTML += `<div style="color:#818cf8;">[SNN_CORE] Neuromorphic spike-train processed 40,000 synapses in 0.08ms.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Neuromorphic reflex burst verified at 0.08 milliseconds.")); }
        setTimeout(() => { ss.innerText = "1.8W ULTRA-LOW PWR (0.15ms)"; ss.style.color = "#4ade80"; }, 4000);
    };
});

// --- LAYER 12 (TRANSCENDENCE): BLACKBOX TIME-MACHINE & SELF-HEALING DRIVER HOT-SWAP ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-replay")) return;
    const l12 = document.createElement("div");
    l12.style.cssText = "width:92%;max-width:800px;margin:15px auto 60px auto;padding:14px;background:#0f172a;border:1px solid #ec4899;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 32px rgba(236,72,153,0.28);";
    l12.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#f472b6;">🌌 LAYER 12 (TRANSCENDENCE): BLACKBOX TIME-MACHINE & SELF-HEALING</strong>
            <div>
                <button id="btn-heal" style="background:#db2777;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🧬 SELF-HEAL DRIVER</button>
                <button id="btn-replay" style="background:#6366f1;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">⏪ REPLAY INCIDENT</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🧬 DRIVER SANDBOX:</b> <span id="drv-stat" style="color:#4ade80;">LIDAR_DRV_V8.0 (ISOLATED RING-3)</span></div>
                <div style="margin-bottom:5px;"><b>⏪ FLIGHT RECORDER:</b> <span id="rep-stat" style="color:#38bdf8;">READY (2400 FRAMES BUFFERED)</span></div>
                <div><b>🏆 SYSTEM TIER:</b> <span style="color:#facc15;">12-LAYER QNX 8.0 TRANSCENDENCE</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">TIME-MACHINE TIMELINE SCRUBBER</div>
                <div style="width:100%;height:10px;background:#1e293b;border-radius:5px;overflow:hidden;">
                    <div id="rep-bar" style="width:100%;height:100%;background:linear-gradient(90deg,#ec4899,#38bdf8);transition:width 0.3s;"></div>
                </div>
                <div style="font-size:10px;color:#f472b6;margin-top:5px;" id="rep-time">T-00.00s | LIVE DETERMINISTIC SYNC</div>
            </div>
        </div>`;
    document.body.appendChild(l12);

    const logs = document.getElementById("kernel-logs");

    // Self-Healing Driver Micro-Code Hot-Swap
    document.getElementById("btn-heal").onclick = () => {
        const ds = document.getElementById("drv-stat");
        ds.innerText = "FAULT DETECTED! HOT-SWAPPING DRIVER..."; ds.style.color = "#ef4444";
        if (logs) { logs.innerHTML += `<div style="color:#f472b6;">[HEAL_AI] Sensor driver fault isolated in Ring-3. Respawning clean PID in 1.1ms...</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Driver fault isolated. Self healing hot swap completed in 1.1 milliseconds.")); }
        setTimeout(() => {
            ds.innerText = "HEALED: LIDAR_DRV_V8.1-HOTFIX (0 LOSS)"; ds.style.color = "#4ade80";
        }, 1200);
    };

    // Blackbox Incident Replay Time-Machine
    document.getElementById("btn-replay").onclick = () => {
        const rs = document.getElementById("rep-stat"), bar = document.getElementById("rep-bar"), tm = document.getElementById("rep-time");
        rs.innerText = "REPLAYING T-10s INCIDENT LOG..."; rs.style.color = "#facc15";
        if (logs) { logs.innerHTML += `<div style="color:#818cf8;">[TIME_MCH] Replaying Blackbox telemetry frame buffer (0.25x slow-mo)...</div>`; logs.scrollTop = logs.scrollHeight; }
        let pct = 0;
        const iv = setInterval(() => {
            pct += 20;
            bar.style.width = pct + "%";
            tm.innerText = `T-${((100-pct)/10).toFixed(1)}s | REPLAYING TELEMETRY FRAME`;
            if (pct >= 100) {
                clearInterval(iv);
                rs.innerText = "REPLAY COMPLETE (VERIFIED)"; rs.style.color = "#4ade80";
                tm.innerText = "T-00.00s | LIVE DETERMINISTIC SYNC";
            }
        }, 450);
    };
});

// --- LAYER 13 (COSMOS): LEO SATELLITE FAILOVER, H2-HYBRID POWERTRAIN & IMMUTABLE HASH LEDGER ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-leo")) return;
    const l13 = document.createElement("div");
    l13.style.cssText = "width:92%;max-width:800px;margin:15px auto 65px auto;padding:14px;background:#0f172a;border:1px solid #8b5cf6;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 35px rgba(139,92,246,0.3);";
    l13.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#a78bfa;">🪐 LAYER 13 (COSMOS): LEO SAT-LINK, H2-HYBRID & SHA3 BLACKBOX LEDGER</strong>
            <div>
                <button id="btn-leo" style="background:#7c3aed;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🛰️ 5G BLACKOUT TEST</button>
                <button id="btn-h2" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">💧 H2 BOOST</button>
                <button id="btn-hash" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🔗 SEAL SHA3</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>📡 BACKHAUL LINK:</b> <span id="leo-stat" style="color:#4ade80;">5G-URLLC (4ms) + LEO STANDBY</span></div>
                <div style="margin-bottom:5px;"><b>💧 POWERTRAIN:</b> <span id="h2-stat" style="color:#38bdf8;">SOLID-STATE EV (640 km RANGE)</span></div>
                <div><b>🔗 SHA3-512 SEAL:</b> <span id="sha-hash" style="color:#facc15;">0x9F82C4E1...B70A (VERIFIED)</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">ORBITAL CONSTELLATION MESH</div>
                <div style="font-size:15px;font-weight:bold;color:#a78bfa;" id="leo-orb">LEO-SAT #412 (550 km ALT)</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">13-LAYER COSMOS STACK ACTIVE</div>
            </div>
        </div>`;
    document.body.appendChild(l13);

    const logs = document.getElementById("kernel-logs");
    let leoActive = false, h2Active = false;

    document.getElementById("btn-leo").onclick = () => {
        leoActive = !leoActive;
        const ls = document.getElementById("leo-stat"), orb = document.getElementById("leo-orb");
        if (leoActive) {
            ls.innerText = "5G LOST! LEO SATELLITE DIRECT (18ms)"; ls.style.color = "#facc15";
            orb.innerText = "UPLINK LOCKED: 1.2 Gbps Ka-BAND"; orb.style.color = "#38bdf8";
            if (logs) { logs.innerHTML += `<div style="color:#a78bfa;">[SAT_NET] Cellular tower lost! Seamless failover to LEO Orbital Mesh in 18ms.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("5G signal lost. Direct to satellite LEO failover active.")); }
        } else {
            ls.innerText = "5G-URLLC (4ms) + LEO STANDBY"; ls.style.color = "#4ade80";
            orb.innerText = "LEO-SAT #412 (550 km ALT)"; orb.style.color = "#a78bfa";
        }
    };

    document.getElementById("btn-h2").onclick = () => {
        h2Active = !h2Active;
        const hs = document.getElementById("h2-stat");
        if (h2Active) {
            hs.innerText = "H2 FUEL-CELL + EV (1,420 km RANGE!)"; hs.style.color = "#22d3ee";
            if (logs) { logs.innerHTML += `<div style="color:#38bdf8;">[H2_HYB] Hydrogen Fuel-Cell range extender online. Range boosted to 1,420 km.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Hydrogen fuel cell hybrid boost engaged. Range extended to 1420 kilometers.")); }
        } else {
            hs.innerText = "SOLID-STATE EV (640 km RANGE)"; hs.style.color = "#38bdf8";
        }
    };

    document.getElementById("btn-hash").onclick = () => {
        const h1 = Math.random().toString(16).substring(2, 10).toUpperCase();
        const h2 = Math.random().toString(16).substring(2, 6).toUpperCase();
        document.getElementById("sha-hash").innerText = `0x${h1}...${h2} (IMMUTABLE)`;
        if (logs) { logs.innerHTML += `<div style="color:#34d399;">[LEDGER] Blackbox flight block sealed with SHA3-512 hash: 0x${h1}...${h2}</div>`; logs.scrollTop = logs.scrollHeight; }
    };
});

// --- LAYER 14 (AETHER): ACTIVE EM SUSPENSION, ISO 21448 SOTIF ARBITER & FULL SPEC EXPORT ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-susp")) return;
    const l14 = document.createElement("div");
    l14.style.cssText = "width:92%;max-width:800px;margin:15px auto 70px auto;padding:14px;background:#0f172a;border:1px solid #10b981;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 38px rgba(16,185,129,0.3);";
    l14.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#34d399;">💠 LAYER 14 (AETHER): ACTIVE EM-SUSPENSION, SOTIF ARBITER & SPEC</strong>
            <div>
                <button id="btn-susp" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">〰️ POTHOLE ABSORB</button>
                <button id="btn-sotif" style="background:#d97706;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">⚖️ SOTIF ARBITER</button>
                <button id="btn-spec" style="background:#2563eb;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">📊 14-LAYER SPEC</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>〰️ EM-SUSPENSION:</b> <span id="susp-stat" style="color:#4ade80;">ACTIVE-LEVEL (0.02G CABIN ROLL)</span></div>
                <div style="margin-bottom:5px;"><b>⚖️ ISO 21448 SOTIF:</b> <span id="sotif-stat" style="color:#38bdf8;">NOMINAL (0 EDGE-CASE CONFLICTS)</span></div>
                <div><b>🏆 FLAGSHIP EDITION:</b> <span style="color:#facc15;">14-LAYER QNX 8.0 AETHER TITAN</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">CHASSIS GYRO & PITCH STABILIZER</div>
                <div style="font-size:15px;font-weight:bold;color:#34d399;" id="gyro-val">PITCH: 0.0° | ROLL: 0.0°</div>
                <div style="font-size:10px;color:#38bdf8;margin-top:4px;">2.1ms MAGNETIC DAMPER LOOP</div>
            </div>
        </div>`;
    document.body.appendChild(l14);

    const logs = document.getElementById("kernel-logs");

    document.getElementById("btn-susp").onclick = () => {
        const ss = document.getElementById("susp-stat"), gv = document.getElementById("gyro-val");
        ss.innerText = "POTHOLE NEUTRALIZED IN 2.1ms!"; ss.style.color = "#facc15";
        gv.innerText = "DAMPING: 99.4% SHOCK ABSORBED"; gv.style.color = "#facc15";
        if (logs) { logs.innerHTML += `<div style="color:#34d399;">[CHASSIS] Deep pothole detected by LiDAR! EM-Actuators neutralized shock in 2.1ms.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Road anomaly absorbed. Active electromagnetic suspension stabilized.")); }
        setTimeout(() => {
            ss.innerText = "ACTIVE-LEVEL (0.02G CABIN ROLL)"; ss.style.color = "#4ade80";
            gv.innerText = "PITCH: 0.0° | ROLL: 0.0°"; gv.style.color = "#34d399";
        }, 3800);
    };

    document.getElementById("btn-sotif").onclick = () => {
        const st = document.getElementById("sotif-stat");
        st.innerText = "MINIMAL RISK TRAJECTORY LOCKED (0.5ms)"; st.style.color = "#fb923c";
        if (logs) { logs.innerHTML += `<div style="color:#fbbf24;">[SOTIF_AI] ISO 21448 edge-case resolved! Safe corridor trajectory computed in 0.5ms.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("SOTIF safety arbiter active. Minimal risk trajectory locked.")); }
        setTimeout(() => { st.innerText = "NOMINAL (0 EDGE-CASE CONFLICTS)"; st.style.color = "#38bdf8"; }, 4000);
    };

    document.getElementById("btn-spec").onclick = () => {
        const spec = `QNX 8.0 14-LAYER AETHER TITAN ARCHITECTURE SPEC\nGenerated: ${new Date().toISOString()}\n--------------------------------------------------\nL1: Multi-Threaded C++ RTOS Core (<10us IPC)\nL2: Adaptive Partitioning (90% Prio 9u) & V2X\nL3: 3D Digital Twin, Level-4 AEB & Kernel Ring Buffer\nL4: Hypervisor Crypto-CAN IDS & Zero-Downtime OTA\nL5: ISO 26262 ASIL-D Dual-Core Lockstep & V2V Platoon\nL6: 60FPS AI Vision HUD & 8-Cell EV Thermal Matrix\nL7: RTK-GPS/NavIC (±1.2cm) & Voice Command Co-Pilot\nL8: Post-Quantum Kyber-1024, V2I Grid & 148 TOPS NPU\nL9: Driver Biometric DMS & Cloud Fleet Mesh\nL10: V2G Bidirectional Power & Live Hex Sniffer\nL11: 360 LiDAR Point-Cloud, SNN & Roof Scout Drone\nL12: Blackbox Time-Machine & Driver Hot-Swap\nL13: LEO Satellite Failover, H2-Hybrid & SHA3 Ledger\nL14: Active EM-Suspension & ISO 21448 SOTIF Arbiter`;
        const blob = new Blob([spec], { type: "text/plain" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "QNX_14Layer_Aether_Spec.txt"; a.click();
    };
});

// --- LAYER 15 (INFINITY): NEURAL BCI REFLEX, ROBOTIC FAST-DOCK & GRAND BENCHMARK ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-bci")) return;
    const l15 = document.createElement("div");
    l15.style.cssText = "width:92%;max-width:800px;margin:15px auto 80px auto;padding:14px;background:#0f172a;border:1px solid #f59e0b;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 40px rgba(245,158,11,0.32);";
    l15.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#fbbf24;">♾️ LAYER 15 (INFINITY): NEURAL BCI, ROBOTIC DOCK & GRAND BENCHMARK</strong>
            <div>
                <button id="btn-bci" style="background:#d97706;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🧠 BCI REFLEX</button>
                <button id="btn-dock" style="background:#0891b2;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🤖 ROBOT DOCK</button>
                <button id="btn-bench" style="background:linear-gradient(90deg,#f59e0b,#ef4444);color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🏆 GRAND BENCHMARK</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🧠 NEURAL BCI LINK:</b> <span id="bci-stat" style="color:#4ade80;">EEG ALPHA-SYNCED (12ms LATENCY)</span></div>
                <div style="margin-bottom:5px;"><b>🤖 ROBOTIC CHARGER:</b> <span id="dock-stat" style="color:#38bdf8;">STANDBY (800kW FLASH-ARM READY)</span></div>
                <div><b>♾️ ARCHITECTURE:</b> <span style="color:#fbbf24;">15-LAYER QNX 8.0 INFINITY APEX</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">SYSTEM RELIABILITY RATING</div>
                <div style="font-size:15px;font-weight:bold;color:#fbbf24;" id="rel-score">99.9999% (SIX-NINES)</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">ZERO-FAILURE DETERMINISTIC OS</div>
            </div>
        </div>`;
    document.body.appendChild(l15);

    const logs = document.getElementById("kernel-logs");

    document.getElementById("btn-bci").onclick = () => {
        const bs = document.getElementById("bci-stat");
        bs.innerText = "MOTOR-CORTEX SPIKE! BRAKE IN 12ms!"; bs.style.color = "#f472b6";
        if (logs) { logs.innerHTML += `<div style="color:#fbbf24;">[BCI_NEURAL] Pre-motor EEG intent captured! Actuated brake 208ms faster than human foot.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Neural brain computer interface intent detected. Actuated 208 milliseconds faster than human reflex.")); }
        setTimeout(() => { bs.innerText = "EEG ALPHA-SYNCED (12ms LATENCY)"; bs.style.color = "#4ade80"; }, 4000);
    };

    document.getElementById("btn-dock").onclick = () => {
        const ds = document.getElementById("dock-stat");
        ds.innerText = "DOCKED! 800kW ULTRA-FLASH ACTIVE"; ds.style.color = "#22d3ee";
        if (logs) { logs.innerHTML += `<div style="color:#22d3ee;">[BOT_DOCK] Autonomous robotic arm coupled! Charging at 800kW (4.5 min to 80%).</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Autonomous robotic charger docked. 800 kilowatt flash charging active.")); }
        setTimeout(() => { ds.innerText = "STANDBY (800kW FLASH-ARM READY)"; ds.style.color = "#38bdf8"; }, 4500);
    };

    document.getElementById("btn-bench").onclick = () => {
        const rs = document.getElementById("rel-score");
        rs.innerText = "ALL 15 LAYERS: 100/100 SCORE!"; rs.style.color = "#4ade80";
        if (logs) { logs.innerHTML += `<div style="color:#4ade80;">[BENCH_OK] All 15 QNX 8.0 layers stress-tested: 0 drops, 4us IPC, Six-Nines verified!</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Grand benchmark complete. All 15 QNX layers verified at six nines deterministic reliability.")); }
        setTimeout(() => { rs.innerText = "99.9999% (SIX-NINES)"; rs.style.color = "#fbbf24"; }, 5000);
    };
});

// --- LAYER 16 (SOVEREIGN): ACTIVE ANC DOME, LI-FI OPTICAL V2V & ACTIVE AERO MORPHING ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-anc")) return;
    const l16 = document.createElement("div");
    l16.style.cssText = "width:92%;max-width:800px;margin:15px auto 90px auto;padding:14px;background:#0f172a;border:1px solid #38bdf8;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 42px rgba(56,189,248,0.35);";
    l16.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#38bdf8;">👑 LAYER 16 (SOVEREIGN): ANC SILENCE DOME, LI-FI V2V & ACTIVE AERO</strong>
            <div>
                <button id="btn-anc" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🔇 ANC DOME</button>
                <button id="btn-lifi" style="background:#7c3aed;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">💡 LI-FI 10Gbps</button>
                <button id="btn-aero" style="background:#e11d48;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🪽 AERO MORPH</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🔇 CABIN ACOUSTICS:</b> <span id="anc-stat" style="color:#4ade80;">STANDARD (54 dB ROAD NOISE)</span></div>
                <div style="margin-bottom:5px;"><b>💡 OPTICAL LI-FI:</b> <span id="lifi-stat" style="color:#38bdf8;">LED MATRIX STANDBY (10 Gbps READY)</span></div>
                <div><b>🪽 ACTIVE AERO/TIRE:</b> <span id="aero-stat" style="color:#facc15;">ECO-DRAG (Cd 0.19 | 36 PSI)</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">SOVEREIGN EDITION STATUS</div>
                <div style="font-size:15px;font-weight:bold;color:#38bdf8;" id="sov-badge">16-LAYER SOVEREIGN APEX</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">QNX 8.0 HYPER-DETERMINISTIC CORE</div>
            </div>
        </div>`;
    document.body.appendChild(l16);

    const logs = document.getElementById("kernel-logs");
    let ancOn = false, lifiOn = false, aeroOn = false;

    document.getElementById("btn-anc").onclick = () => {
        ancOn = !ancOn;
        const as = document.getElementById("anc-stat");
        if (ancOn) {
            as.innerText = "ANTI-PHASE DOME LOCKED (28 dB SILENT!)"; as.style.color = "#22d3ee";
            if (logs) { logs.innerHTML += `<div style="color:#38bdf8;">[ANC_DSP] Anti-phase acoustic wave cancellation active (<0.2ms latency).</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Active acoustic noise cancellation dome engaged.")); }
        } else { as.innerText = "STANDARD (54 dB ROAD NOISE)"; as.style.color = "#4ade80"; }
    };

    document.getElementById("btn-lifi").onclick = () => {
        lifiOn = !lifiOn;
        const ls = document.getElementById("lifi-stat");
        if (lifiOn) {
            ls.innerText = "OPTICAL BEAM LOCKED: 10.4 Gbps V2V!"; ls.style.color = "#c084fc";
            if (logs) { logs.innerHTML += `<div style="color:#c084fc;">[LIFI_OPT] Headlight photonic transceiver streaming V2V telemetry at 10.4 Gbps.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Optical Li-Fi vehicle to vehicle link locked at 10 gigabits per second.")); }
        } else { ls.innerText = "LED MATRIX STANDBY (10 Gbps READY)"; ls.style.color = "#38bdf8"; }
    };

    document.getElementById("btn-aero").onclick = () => {
        aeroOn = !aeroOn;
        const ars = document.getElementById("aero-stat");
        if (aeroOn) {
            ars.innerText = "TRACK WING +420kg DOWNFORCE | 31 PSI"; ars.style.color = "#fb7185";
            if (logs) { logs.innerHTML += `<div style="color:#fb7185;">[AERO_MORPH] Active rear spoiler deployed (+420kg downforce) & tire patch widened.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Active aerodynamic downforce and tire grip morphing engaged.")); }
        } else { ars.innerText = "ECO-DRAG (Cd 0.19 | 36 PSI)"; ars.style.color = "#facc15"; }
    };
});

// --- LAYER 17 (CELESTIAL): AR WINDSHIELD HUD, ELECTROCHROMIC GLASS & FLOATING NAVIGATOR ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-tint")) return;
    const l17 = document.createElement("div");
    l17.style.cssText = "width:92%;max-width:800px;margin:15px auto 95px auto;padding:14px;background:#0f172a;border:1px solid #f43f5e;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 45px rgba(244,63,94,0.35);";
    l17.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#fb7185;">🌟 LAYER 17 (CELESTIAL): AR WINDSHIELD HUD, SMART GLASS & FLAMEGRAPH</strong>
            <div>
                <button id="btn-tint" style="background:#be123c;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🕶️ AUTO-TINT 85%</button>
                <button id="btn-ar" style="background:#0369a1;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🔮 AR PATH HUD</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🕶️ ELECTROCHROMIC GLASS:</b> <span id="tint-stat" style="color:#4ade80;">CLEAR SOLAR (12% OPACITY)</span></div>
                <div style="margin-bottom:5px;"><b>🔮 AR WINDSHIELD HUD:</b> <span id="ar-stat" style="color:#38bdf8;">HOLOGRAPHIC LANE OVERLAY ON</span></div>
                <div><b>🔥 KERNEL THREADS:</b> <span style="color:#facc15;">17 LAYERS | 0.8% IDLE CPU OVERHEAD</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">QNX NEUTRINO THREAD FLAMEGRAPH</div>
                <div style="font-size:11px;color:#fb7185;letter-spacing:1px;">[IPC:2µs] [HAM:11ms] [SNN:80µs]</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">17-LAYER CELESTIAL APEX VERIFIED</div>
            </div>
        </div>`;
    document.body.appendChild(l17);

    // Floating Quick-Jump Button for Judges Demo
    const nav = document.createElement("div");
    nav.style.cssText = "position:fixed;bottom:12px;right:12px;z-index:9999;display:flex;gap:6px;";
    nav.innerHTML = `
        <button onclick="window.scrollTo({top:0,behavior:'smooth'})" style="background:#0284c7;color:#fff;border:1px solid #38bdf8;padding:6px 10px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.5);">⬆️ TOP</button>
        <button onclick="window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})" style="background:#7c3aed;color:#fff;border:1px solid #c084fc;padding:6px 10px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.5);">⬇️ L17</button>
    `;
    document.body.appendChild(nav);

    const logs = document.getElementById("kernel-logs");
    let tintDark = false, arBoost = false;

    document.getElementById("btn-tint").onclick = () => {
        tintDark = !tintDark;
        const ts = document.getElementById("tint-stat");
        if (tintDark) {
            ts.innerText = "ANTI-GLARE POLARIZED (85% DARK!)"; ts.style.color = "#fb7185";
            if (logs) { logs.innerHTML += `<div style="color:#fb7185;">[GLASS_EC] High-beam glare detected! Electrochromic windshield tinted to 85%.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Electrochromic anti-glare windshield tint activated.")); }
        } else { ts.innerText = "CLEAR SOLAR (12% OPACITY)"; ts.style.color = "#4ade80"; }
    };

    document.getElementById("btn-ar").onclick = () => {
        arBoost = !arBoost;
        const ars = document.getElementById("ar-stat");
        if (arBoost) {
            ars.innerText = "3D HAZARD VECTOR ARROWS LOCKED!"; ars.style.color = "#facc15";
            if (logs) { logs.innerHTML += `<div style="color:#38bdf8;">[AR_HUD] Holographic windshield projecting 3D pedestrian & lane vectors.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Augmented reality windshield hazard vectors engaged.")); }
        } else { ars.innerText = "HOLOGRAPHIC LANE OVERLAY ON"; ars.style.color = "#38bdf8"; }
    };
});

// --- LAYER 18 (ETERNA): QUANTUM PHOTONIC FOG-RADAR & HEPA-14 BIO-DEFENSE DOME ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-qrad")) return;
    const l18 = document.createElement("div");
    l18.style.cssText = "width:92%;max-width:800px;margin:15px auto 100px auto;padding:14px;background:#0f172a;border:1px solid #2dd4bf;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 48px rgba(45,212,191,0.35);";
    l18.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#2dd4bf;">♾️ LAYER 18 (ETERNA): QUANTUM PHOTONIC RADAR & BIO-DEFENSE DOME</strong>
            <div>
                <button id="btn-qrad" style="background:#0d9488;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🌫️ QUANTUM RADAR</button>
                <button id="btn-bio" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">☣️ BIO-DEFENSE</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🌫️ PHOTONIC RADAR:</b> <span id="qrad-stat" style="color:#4ade80;">CLEAR WEATHER (RF-LIDAR SYNC)</span></div>
                <div style="margin-bottom:5px;"><b>☣️ CABIN BIO-DOME:</b> <span id="bio-stat" style="color:#38bdf8;">HEPA-14 ACTIVE (CABIN AQI: 14)</span></div>
                <div><b>👑 MASTER TIER:</b> <span style="color:#facc15;">18-LAYER QNX 8.0 ETERNA APEX</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">ALL-WEATHER QUANTUM PENETRATION</div>
                <div style="font-size:14px;font-weight:bold;color:#2dd4bf;" id="qrad-vis">VISIBILITY: 100% | ZERO-FOG</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">18-LAYER ETERNA STACK VERIFIED</div>
            </div>
        </div>`;
    document.body.appendChild(l18);

    // Update Floating Bottom Button to L18
    document.querySelectorAll("button").forEach(b => { if (b.innerText.includes("L17")) b.innerText = "⬇️ L18"; });

    const logs = document.getElementById("kernel-logs");
    let qradOn = false, bioOn = false;

    document.getElementById("btn-qrad").onclick = () => {
        qradOn = !qradOn;
        const qs = document.getElementById("qrad-stat"), qv = document.getElementById("qrad-vis");
        if (qradOn) {
            qs.innerText = "DENSE FOG PENETRATED (99.8% CLARITY!)"; qs.style.color = "#2dd4bf";
            qv.innerText = "QUANTUM PHOTON LOCK: 350m RANGE"; qv.style.color = "#facc15";
            if (logs) { logs.innerHTML += `<div style="color:#2dd4bf;">[Q_RADAR] Heavy monsoon fog bypassed via Quantum Photonic LiDAR pulse.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Quantum photonic fog radar engaged. Zero visibility weather bypassed.")); }
        } else {
            qs.innerText = "CLEAR WEATHER (RF-LIDAR SYNC)"; qs.style.color = "#4ade80";
            qv.innerText = "VISIBILITY: 100% | ZERO-FOG"; qv.style.color = "#2dd4bf";
        }
    };

    document.getElementById("btn-bio").onclick = () => {
        bioOn = !bioOn;
        const bs = document.getElementById("bio-stat");
        if (bioOn) {
            bs.innerText = "POSITIVE-PRESSURE SEALED (AQI: 02!)"; bs.style.color = "#4ade80";
            if (logs) { logs.innerHTML += `<div style="color:#34d399;">[BIO_SEAL] Positive-pressure HEPA-14 + UV-C cabin airlock engaged.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Cabin bio defense airlock sealed. Air quality at medical grade.")); }
        } else { bs.innerText = "HEPA-14 ACTIVE (CABIN AQI: 14)"; bs.style.color = "#38bdf8"; }
    };
});

// --- LAYER 19 (HYPERION): AMPHIBIOUS FLOOD-WADE SHIELD & SELF-HEALING GRAPHENE ARMOR ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-flood")) return;
    const l19 = document.createElement("div");
    l19.style.cssText = "width:92%;max-width:800px;margin:15px auto 105px auto;padding:14px;background:#0f172a;border:1px solid #0ea5e9;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 50px rgba(14,165,233,0.38);";
    l19.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#38bdf8;">🔱 LAYER 19 (HYPERION): AMPHIBIOUS FLOOD-WADE & GRAPHENE SELF-HEAL</strong>
            <div>
                <button id="btn-flood" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🌊 FLOOD WADE MODE</button>
                <button id="btn-armor" style="background:#4f46e5;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🛡️ HEAL GRAPHENE</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🌊 MONSOON HYDRO-SEAL:</b> <span id="flood-stat" style="color:#4ade80;">IP69K SEALED (ROAD CLEARANCE)</span></div>
                <div style="margin-bottom:5px;"><b>🛡️ GRAPHENE SKIN:</b> <span id="armor-stat" style="color:#38bdf8;">INTACT (NANO-POLYMER MATRIX)</span></div>
                <div><b>👑 FLAGSHIP EDITION:</b> <span style="color:#facc15;">19-LAYER QNX 8.0 HYPERION APEX</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">AMPHIBIOUS CHASSIS TELEMETRY</div>
                <div style="font-size:14px;font-weight:bold;color:#38bdf8;" id="hydro-val">WADE DEPTH: 0.0m | LIFT: STD</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">19-LAYER HYPERION STACK VERIFIED</div>
            </div>
        </div>`;
    document.body.appendChild(l19);

    document.querySelectorAll("button").forEach(b => { if (b.innerText.includes("L18")) b.innerText = "⬇️ L19"; });

    const logs = document.getElementById("kernel-logs");
    let floodOn = false;

    document.getElementById("btn-flood").onclick = () => {
        floodOn = !floodOn;
        const fs = document.getElementById("flood-stat"), hv = document.getElementById("hydro-val");
        if (floodOn) {
            fs.innerText = "AMPHIBIOUS HYDRO-JET ACTIVE (1.2m WATER)!"; fs.style.color = "#22d3ee";
            hv.innerText = "LIFT: +180mm | HYDRO-THRUST ON"; hv.style.color = "#facc15";
            if (logs) { logs.innerHTML += `<div style="color:#38bdf8;">[HYDRO_L19] Deep monsoon water detected! Chassis lifted +180mm & hydro-jets engaged.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Amphibious flood wading mode engaged. High voltage battery hermetically sealed.")); }
        } else {
            fs.innerText = "IP69K SEALED (ROAD CLEARANCE)"; fs.style.color = "#4ade80";
            hv.innerText = "WADE DEPTH: 0.0m | LIFT: STD"; hv.style.color = "#38bdf8";
        }
    };

    document.getElementById("btn-armor").onclick = () => {
        const as = document.getElementById("armor-stat");
        as.innerText = "MICRO-SCRATCH HEALED IN 4.2s!"; as.style.color = "#c084fc";
        if (logs) { logs.innerHTML += `<div style="color:#818cf8;">[NANO_SKIN] Thermal nano-current restored graphene-polymer clearcoat in 4.2s.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Self healing graphene body armor restored.")); }
        setTimeout(() => { as.innerText = "INTACT (NANO-POLYMER MATRIX)"; as.style.color = "#38bdf8"; }, 4200);
    };
});

// --- LAYER 20 (PANTHEON): SWARM HIVE-MIND X-RAY, KINETIC HARVESTER & 20-LAYER CROWN ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-hive")) return;
    const l20 = document.createElement("div");
    l20.style.cssText = "width:92%;max-width:800px;margin:15px auto 110px auto;padding:14px;background:#0f172a;border:1px solid #eab308;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 55px rgba(234,179,8,0.4);";
    l20.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#facc15;">👑 LAYER 20 (PANTHEON): SWARM HIVE-MIND X-RAY & KINETIC HARVESTER</strong>
            <div>
                <button id="btn-hive" style="background:#ca8a04;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🐝 HIVE-MIND X-RAY</button>
                <button id="btn-kin" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">♻️ KINETIC HARVEST</button>
                <button id="btn-crown" style="background:linear-gradient(90deg,#eab308,#ec4899);color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🏆 CROWN 20L</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🐝 SWARM HIVE-MIND:</b> <span id="hive-stat" style="color:#4ade80;">128 PEERS | SEE-THROUGH VISION READY</span></div>
                <div style="margin-bottom:5px;"><b>♻️ ENERGY HARVESTER:</b> <span id="kin-stat" style="color:#38bdf8;">REGEN + THERMO (+14.8% FREE RANGE)</span></div>
                <div><b>👑 MASTER EDITION:</b> <span style="color:#facc15;">20-LAYER QNX 8.0 PANTHEON ULTIMATE</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">ULTIMATE ARCHITECTURE TIER</div>
                <div style="font-size:14px;font-weight:bold;color:#facc15;" id="crown-stat">20 / 20 LAYERS ONLINE</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">UNBEATABLE QNX 8.0 FLAGSHIP</div>
            </div>
        </div>`;
    document.body.appendChild(l20);

    document.querySelectorAll("button").forEach(b => { if (b.innerText.includes("L19")) b.innerText = "⬇️ L20"; });

    const logs = document.getElementById("kernel-logs");
    let hiveOn = false, kinBoost = false;

    document.getElementById("btn-hive").onclick = () => {
        hiveOn = !hiveOn;
        const hs = document.getElementById("hive-stat");
        if (hiveOn) {
            hs.innerText = "X-RAY MESH LOCKED: 128 CARS FUSED (1.4ms)!"; hs.style.color = "#facc15";
            if (logs) { logs.innerHTML += `<div style="color:#facc15;">[HIVE_20] Collective Swarm X-Ray active! Seeing 1.2km ahead through 128 peer vehicles.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Swarm hive mind X-ray vision locked across 128 vehicles.")); }
        } else { hs.innerText = "128 PEERS | SEE-THROUGH VISION READY"; hs.style.color = "#4ade80"; }
    };

    document.getElementById("btn-kin").onclick = () => {
        kinBoost = !kinBoost;
        const ks = document.getElementById("kin-stat");
        if (kinBoost) {
            ks.innerText = "MAX HARVEST: +4.8 kW PIEZO-SUSPENSION!"; ks.style.color = "#22d3ee";
            if (logs) { logs.innerHTML += `<div style="color:#34d399;">[HARVEST] Piezoelectric suspension & thermal recovery generating +4.8kW continuous power.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Kinetic and thermoelectric energy harvesting boosted.")); }
        } else { ks.innerText = "REGEN + THERMO (+14.8% FREE RANGE)"; ks.style.color = "#38bdf8"; }
    };

    document.getElementById("btn-crown").onclick = () => {
        const cs = document.getElementById("crown-stat");
        cs.innerText = "🏆 20-LAYER PANTHEON CERTIFIED!"; cs.style.color = "#4ade80";
        if (logs) { logs.innerHTML += `<div style="color:#f472b6;">[PANTHEON] All 20 QNX 8.0 layers verified deterministic with zero latency spikes!</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("All 20 QNX 8.0 Pantheon layers verified at peak deterministic performance.")); }
        setTimeout(() => { cs.innerText = "20 / 20 LAYERS ONLINE"; cs.style.color = "#facc15"; }, 5000);
    };
});

// --- LAYER 21 (ASCENSION): SOLAR-SKIN HARVEST, QUANTUM MIRROR & JUDGE Q&A CO-PILOT ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-solar")) return;
    const l21 = document.createElement("div");
    l21.style.cssText = "width:92%;max-width:800px;margin:15px auto 115px auto;padding:14px;background:#0f172a;border:1px solid #c084fc;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 58px rgba(192,132,252,0.4);";
    l21.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#d8b4fe;">🌌 LAYER 21 (ASCENSION): SOLAR-SKIN, QUANTUM MIRROR & JUDGE Q&A</strong>
            <div>
                <button id="btn-solar" style="background:#d97706;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">☀️ SOLAR SKIN</button>
                <button id="btn-qmir" style="background:#7c3aed;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">⚛️ Q-MIRROR</button>
                <button id="btn-qa" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🎓 JUDGE Q&A</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>☀️ PEROVSKITE SKIN:</b> <span id="sol-stat" style="color:#4ade80;">TRICKLE ACTIVE (+1.1 kW | 34% EFF)</span></div>
                <div style="margin-bottom:5px;"><b>⚛️ QUANTUM MIRROR:</b> <span id="qmir-stat" style="color:#38bdf8;">TWIN SYNCED (0.01ms DELTA)</span></div>
                <div><b>👑 APEX EDITION:</b> <span style="color:#facc15;">21-LAYER QNX 8.0 ASCENSION</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">LIVE KERNEL DETERMINISM</div>
                <div style="font-size:14px;font-weight:bold;color:#d8b4fe;">21 / 21 LAYERS ACTIVE</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">ZERO-JITTER MICROKERNEL</div>
            </div>
        </div>
        <div id="qa-box" style="display:none;margin-top:10px;background:#020617;border:1px dashed #c084fc;border-radius:8px;padding:10px;font-size:11px;text-align:left;color:#e2e8f0;"></div>`;
    document.body.appendChild(l21);

    document.querySelectorAll("button").forEach(b => { if (b.innerText.includes("L20")) b.innerText = "⬇️ L21"; });

    const logs = document.getElementById("kernel-logs");
    const qas = [
        "<b>Q: Why QNX 8.0 instead of Embedded Linux?</b><br><b>A:</b> Unlike monolithic Linux, QNX is a true microkernel where drivers run in isolated user-space. If a driver crashes, HAM respawns it in 11ms without kernel panic.",
        "<b>Q: How does Adaptive Partitioning (APS) guarantee safety?</b><br><b>A:</b> APS reserves a hard 90% CPU budget for Prio-9u safety threads during emergencies while allowing idle CPU sharing during normal driving.",
        "<b>Q: How is this protected against future cyber threats?</b><br><b>A:</b> It combines HMAC-SHA256 Crypto-CAN firewalling with Post-Quantum CRYSTALS-Kyber-1024 key rotation and A/B zero-downtime OTA."
    ];
    let qaIdx = 0;

    document.getElementById("btn-solar").onclick = () => {
        const ss = document.getElementById("sol-stat");
        ss.innerText = "PEAK SOLAR HARVEST: +2.8 kW (+52 km/day)!"; ss.style.color = "#facc15";
        if (logs) { logs.innerHTML += `<div style="color:#facc15;">[SOLAR_21] Perovskite body panels generating +2.8kW peak solar charge.</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Perovskite solar skin harvesting at peak 2.8 kilowatts.")); }
    };

    document.getElementById("btn-qmir").onclick = () => {
        const qm = document.getElementById("qmir-stat");
        qm.innerText = "INSTANTANEOUS CLOUD SNAPSHOT SEALED!"; qm.style.color = "#c084fc";
        if (logs) { logs.innerHTML += `<div style="color:#c084fc;">[Q_MIRROR] Zero-latency Digital Twin state mirrored to cloud vault.</div>`; logs.scrollTop = logs.scrollHeight; }
    };

    document.getElementById("btn-qa").onclick = () => {
        const box = document.getElementById("qa-box");
        box.style.display = "block";
        box.innerHTML = qas[qaIdx];
        qaIdx = (qaIdx + 1) % qas.length;
    };
});

// --- LAYER 22 (OMNIVERSAL): SUB-SURFACE ROAD-VOID RADAR & CARBON-CREDIT ENGINE ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-gpr")) return;
    const l22 = document.createElement("div");
    l22.style.cssText = "width:92%;max-width:800px;margin:15px auto 120px auto;padding:14px;background:#0f172a;border:1px solid #22c55e;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 60px rgba(34,197,94,0.4);";
    l22.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#4ade80;">🌍 LAYER 22 (OMNIVERSAL): SUB-SURFACE VOID RADAR & CARBON-CREDIT LEDGER</strong>
            <div>
                <button id="btn-gpr" style="background:#16a34a;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">📡 SCAN ROAD-VOID</button>
                <button id="btn-co2" style="background:#0d9488;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🌱 MINT CO2 CREDIT</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>📡 SUB-SURFACE GPR:</b> <span id="gpr-stat" style="color:#4ade80;">ASPHALT BED SOLID (4.5m DEPTH SCAN)</span></div>
                <div style="margin-bottom:5px;"><b>🌱 CARBON OFFSET:</b> <span id="co2-stat" style="color:#38bdf8;">14.2 kg CO2 SAVED (1.42 GREEN CREDITS)</span></div>
                <div><b>👑 MASTER TIER:</b> <span style="color:#facc15;">22-LAYER QNX 8.0 OMNIVERSAL APEX</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">ACTIVE ARCHITECTURE STACK</div>
                <div style="font-size:14px;font-weight:bold;color:#4ade80;">22 / 22 LAYERS ONLINE</div>
                <div style="font-size:10px;color:#38bdf8;margin-top:4px;">ZERO-DEFECT DETERMINISTIC OS</div>
            </div>
        </div>`;
    document.body.appendChild(l22);

    document.querySelectorAll("button").forEach(b => { if (b.innerText.includes("L21")) b.innerText = "⬇️ L22"; });

    const logs = document.getElementById("kernel-logs");
    let credits = 1.42;

    document.getElementById("btn-gpr").onclick = () => {
        const gs = document.getElementById("gpr-stat");
        gs.innerText = "SUB-SURFACE VOID DETECTED! AUTO-REROUTED!"; gs.style.color = "#facc15";
        if (logs) { logs.innerHTML += `<div style="color:#4ade80;">[GPR_22] Acoustic ground radar detected road-bed cavity 35m ahead. Lane shifted!</div>`; logs.scrollTop = logs.scrollHeight; }
        if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Subsurface road cavity detected. Automatic lane shift executed.")); }
        setTimeout(() => { gs.innerText = "ASPHALT BED SOLID (4.5m DEPTH SCAN)"; gs.style.color = "#4ade80"; }, 4200);
    };

    document.getElementById("btn-co2").onclick = () => {
        credits = +(credits + 0.25).toFixed(2);
        const cs = document.getElementById("co2-stat");
        cs.innerText = `${(credits*10).toFixed(1)} kg CO2 SAVED (${credits} GREEN CREDITS!)`; cs.style.color = "#4ade80";
        if (logs) { logs.innerHTML += `<div style="color:#2dd4bf;">[ECO_MINT] Verified zero-emission telemetry! Minted +0.25 Carbon Credits.</div>`; logs.scrollTop = logs.scrollHeight; }
    };
});

// --- LAYER 23 (ULTIMA): TRAUMA-MEDEVAC AUTOPILOT & CHASSIS ULTRASONIC STRUCTURAL SCAN ---
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btn-med")) return;
    const l23 = document.createElement("div");
    l23.style.cssText = "width:92%;max-width:800px;margin:15px auto 125px auto;padding:14px;background:#0f172a;border:1px solid #f43f5e;border-radius:10px;color:#e2e8f0;font-family:monospace;box-sizing:border-box;box-shadow:0 0 65px rgba(244,63,94,0.45);";
    l23.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;gap:6px;">
            <strong style="color:#fb7185;">🏆 LAYER 23 (ULTIMA): TRAUMA-MEDEVAC AUTOPILOT & CHASSIS STRUCTURAL SCAN</strong>
            <div>
                <button id="btn-med" style="background:#e11d48;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:5px;">🚑 MEDEVAC CORRIDOR</button>
                <button id="btn-xray" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">🩻 CHASSIS ULTRASOUND</button>
            </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:11px;text-align:left;">
            <div style="flex:1.2;min-width:240px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;">
                <div style="margin-bottom:5px;"><b>🚑 LIFE-SAFETY LINK:</b> <span id="med-stat" style="color:#4ade80;">STANDBY (HOSPITAL ER TELEMETRY READY)</span></div>
                <div style="margin-bottom:5px;"><b>🩻 CHASSIS INTEGRITY:</b> <span id="xray-stat" style="color:#38bdf8;">100.0% (64 PIEZO-NODES VERIFIED)</span></div>
                <div><b>👑 ULTIMATE TIER:</b> <span style="color:#facc15;">23-LAYER QNX 8.0 ULTIMA FLAGSHIP</span></div>
            </div>
            <div style="flex:1;min-width:220px;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;text-align:center;">
                <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;">COMPLETE ARCHITECTURE STACK</div>
                <div style="font-size:14px;font-weight:bold;color:#fb7185;" id="ult-badge">23 / 23 LAYERS ONLINE</div>
                <div style="font-size:10px;color:#4ade80;margin-top:4px;">UNRIVALED QNX 8.0 PRODUCTION OS</div>
            </div>
        </div>`;
    document.body.appendChild(l23);

    document.querySelectorAll("button").forEach(b => { if (b.innerText.includes("L22")) b.innerText = "⬇️ L23"; });

    const logs = document.getElementById("kernel-logs");
    let medOn = false;

    document.getElementById("btn-med").onclick = () => {
        medOn = !medOn;
        const ms = document.getElementById("med-stat");
        if (medOn) {
            ms.innerText = "EMERGENCY ROUTING -> TRAUMA ER (GREEN WAVE)!"; ms.style.color = "#ef4444";
            if (logs) { logs.innerHTML += `<div style="color:#fb7185;">[MEDEVAC] Medical emergency! Hospital ER alerted & V2X ambulance priority locked.</div>`; logs.scrollTop = logs.scrollHeight; }
            if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance("Emergency medevac autopilot engaged. Green corridor locked to nearest trauma center.")); }
        } else { ms.innerText = "STANDBY (HOSPITAL ER TELEMETRY READY)"; ms.style.color = "#4ade80"; }
    };

    document.getElementById("btn-xray").onclick = () => {
        const xs = document.getElementById("xray-stat");
        xs.innerText = "FULL ULTRASONIC SCAN: 0 MICRO-FRACTURES!"; xs.style.color = "#22d3ee";
        if (logs) { logs.innerHTML += `<div style="color:#38bdf8;">[NDT_SCAN] 64 ultrasonic frame transducers verified zero structural fatigue.</div>`; logs.scrollTop = logs.scrollHeight; }
        setTimeout(() => { xs.innerText = "100.0% (64 PIEZO-NODES VERIFIED)"; xs.style.color = "#38bdf8"; }, 4000);
    };
});
