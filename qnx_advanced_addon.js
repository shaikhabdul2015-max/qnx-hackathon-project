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
