import { useState, useRef, useEffect } from "react";

// ─── PASSWORD ────────────────────────────────────────────────────────────────
const ACCESS_PASSWORD = "wpsecure2024";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const G = {
  bg: "#070a0e", panel: "#0c0f15", border: "#1a2030",
  accent: "#00e5a0", accent2: "#ff6b35", accent3: "#7c6af7", warn: "#f5c842",
  danger: "#ff3b5c", text: "#c0ccd8", muted: "#3a4a5a", mid: "#5a6a7a",
};

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
function CodeBlock({ lang, code, color }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ background: "#050710", border: `1px solid ${G.border}`, borderRadius: 10, overflow: "hidden", margin: "12px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${G.border}` }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: color || G.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ background: "none", border: `1px solid ${G.border}`, borderRadius: 4, color: copied ? G.accent : G.muted, fontFamily: "monospace", fontSize: 10, padding: "2px 10px", cursor: "pointer" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: 12, lineHeight: 1.9, color: "#7dd3a8", overflowX: "auto", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{code}</pre>
    </div>
  );
}

function Alert({ type, children }) {
  const s = { tip: [G.accent, "💡"], warn: [G.warn, "⚠️"], danger: [G.danger, "🚨"], info: [G.accent3, "ℹ️"] }[type] || [G.accent3, "ℹ️"];
  return (
    <div style={{ display: "flex", gap: 10, padding: "12px 15px", borderRadius: 9, background: `${s[0]}10`, border: `1px solid ${s[0]}35`, color: s[0], fontSize: 13, lineHeight: 1.7, margin: "10px 0" }}>
      <span style={{ flexShrink: 0, fontSize: 15 }}>{s[1]}</span><div>{children}</div>
    </div>
  );
}

function SectionTitle({ children, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "26px 0 14px" }}>
      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: color || G.accent, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: G.border }} />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 11, padding: "16px 18px", marginBottom: 12 }}>
      {title && <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 8 }}>{title}</div>}
      <div style={{ fontSize: 13, color: G.text, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: G.panel, border: `1.5px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: G.accent, flexShrink: 0, marginTop: 3 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 700, color: "#fff", fontSize: 13, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: G.text, lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

function CheckList({ items }) {
  const [checked, setChecked] = useState({});
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} onClick={() => setChecked(p => ({ ...p, [i]: !p[i] }))}
          style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 4px", borderBottom: `1px solid rgba(255,255,255,0.04)`, cursor: "pointer", fontSize: 13, color: checked[i] ? G.muted : G.text, textDecoration: checked[i] ? "line-through" : "none", transition: "color 0.2s" }}>
          <span style={{ width: 18, height: 18, border: checked[i] ? "none" : `1.5px solid ${G.border}`, borderRadius: 4, background: checked[i] ? G.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000", flexShrink: 0, marginTop: 1, transition: "all 0.2s" }}>{checked[i] ? "✓" : ""}</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function Quiz({ q, options, correctIdx, explanation }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 12, padding: "20px 18px", marginTop: 24 }}>
      <div style={{ fontFamily: "monospace", fontSize: 10, color: G.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>🧠 Knowledge Check</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.5 }}>{q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt, i) => {
          let border = G.border, bg = "transparent", color = G.text;
          if (selected !== null) {
            if (i === correctIdx) { border = G.accent; bg = `${G.accent}12`; color = G.accent; }
            else if (i === selected) { border = G.danger; bg = `${G.danger}10`; color = "#ff8099"; }
          }
          return (
            <div key={i} onClick={() => selected === null && setSelected(i)}
              style={{ padding: "11px 14px", borderRadius: 8, border: `1px solid ${border}`, background: bg, color, fontSize: 13, cursor: selected === null ? "pointer" : "default", display: "flex", gap: 10, transition: "all 0.2s" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700, flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
            </div>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: selected === correctIdx ? `${G.accent}10` : `${G.danger}10`, border: `1px solid ${selected === correctIdx ? G.accent : G.danger}35`, color: selected === correctIdx ? G.accent : "#ff8099", fontSize: 13, lineHeight: 1.65 }}>
          {selected === correctIdx ? "✅ " : "❌ "}{explanation}
        </div>
      )}
    </div>
  );
}

// ─── SIMULATORS ───────────────────────────────────────────────────────────────
function WordfenceSimulator() {
  const [wafMode, setWafMode] = useState("basic");
  const [learning, setLearning] = useState(true);
  const [attempts, setAttempts] = useState(10);
  const [lockout, setLockout] = useState(5);
  const [alertSpam, setAlertSpam] = useState(true);
  const score = (wafMode === "extended" ? 30 : 0) + (!learning ? 20 : 0) + (attempts <= 5 ? 20 : 0) + (lockout >= 20 ? 15 : 0) + (!alertSpam ? 15 : 0);
  const grade = score >= 85 ? ["🏆 Excellent", G.accent] : score >= 60 ? ["✅ Good", G.accent3] : score >= 40 ? ["⚠️ Needs Work", G.warn] : ["🚨 Vulnerable", G.danger];

  return (
    <div style={{ background: "#050710", border: `1px solid ${G.border}`, borderRadius: 12, overflow: "hidden", margin: "14px 0" }}>
      <div style={{ padding: "12px 16px", background: `${G.accent}08`, borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: G.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>🔥 Wordfence Config Simulator</span>
        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: grade[1] }}>Score: {score}/100 — {grade[0]}</span>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* WAF Mode */}
        <div>
          <div style={{ fontSize: 12, color: G.mid, marginBottom: 8, fontWeight: 600 }}>WAF Protection Mode</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["basic", "⚠️ Basic"], ["extended", "✅ Extended"]].map(([v, l]) => (
              <button key={v} onClick={() => setWafMode(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: `1.5px solid ${wafMode === v ? G.accent : G.border}`, background: wafMode === v ? `${G.accent}12` : "transparent", color: wafMode === v ? G.accent : G.muted, fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: wafMode === "extended" ? G.accent : G.warn, marginTop: 5 }}>
            {wafMode === "extended" ? "✅ Loads before WordPress core — maximum protection." : "⚠️ Loads after WordPress — some attacks slip through before firewall activates."}
          </div>
        </div>
        {/* Firewall Status */}
        <div>
          <div style={{ fontSize: 12, color: G.mid, marginBottom: 8, fontWeight: 600 }}>Firewall Status</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["learning", "⏳ Learning Mode"], ["active", "🛡️ Enabled & Protecting"]].map(([v, l]) => (
              <button key={v} onClick={() => setLearning(v === "learning")} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: `1.5px solid ${(v === "learning") === learning ? (v === "learning" ? G.warn : G.accent) : G.border}`, background: (v === "learning") === learning ? (v === "learning" ? `${G.warn}10` : `${G.accent}10`) : "transparent", color: (v === "learning") === learning ? (v === "learning" ? G.warn : G.accent) : G.muted, fontWeight: 600, fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}>{l}</button>
            ))}
          </div>
          {learning && <div style={{ fontSize: 11, color: G.warn, marginTop: 5 }}>⚠️ Learning Mode passes ALL traffic — never leave on permanently.</div>}
        </div>
        {/* Attempts slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.mid, marginBottom: 6, fontWeight: 600 }}>
            <span>Max Failed Login Attempts</span>
            <span style={{ fontFamily: "monospace", color: attempts <= 5 ? G.accent : attempts <= 8 ? G.warn : G.danger }}>{attempts} {attempts <= 5 ? "✅" : attempts <= 8 ? "⚠️" : "🚨"}</span>
          </div>
          <input type="range" min={2} max={20} value={attempts} onChange={e => setAttempts(+e.target.value)} style={{ width: "100%", accentColor: attempts <= 5 ? G.accent : attempts <= 8 ? G.warn : G.danger }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: G.muted, fontFamily: "monospace" }}><span>2</span><span>Recommended: 4–5</span><span>20</span></div>
        </div>
        {/* Lockout slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.mid, marginBottom: 6, fontWeight: 600 }}>
            <span>Lockout Duration (minutes)</span>
            <span style={{ fontFamily: "monospace", color: lockout >= 20 ? G.accent : lockout >= 10 ? G.warn : G.danger }}>{lockout} min {lockout >= 20 ? "✅" : lockout >= 10 ? "⚠️" : "🚨"}</span>
          </div>
          <input type="range" min={1} max={60} value={lockout} onChange={e => setLockout(+e.target.value)} style={{ width: "100%", accentColor: lockout >= 20 ? G.accent : lockout >= 10 ? G.warn : G.danger }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: G.muted, fontFamily: "monospace" }}><span>1 min</span><span>Recommended: 20+</span><span>60 min</span></div>
        </div>
        {/* Alert level */}
        <div>
          <div style={{ fontSize: 12, color: G.mid, marginBottom: 8, fontWeight: 600 }}>Email Alert Level</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["true", "📧 All Events"], ["false", "🎯 Critical Only"]].map(([v, l]) => (
              <button key={v} onClick={() => setAlertSpam(v === "true")} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: `1.5px solid ${String(alertSpam) === v ? (v === "true" ? G.warn : G.accent) : G.border}`, background: String(alertSpam) === v ? (v === "true" ? `${G.warn}10` : `${G.accent}10`) : "transparent", color: String(alertSpam) === v ? (v === "true" ? G.warn : G.accent) : G.muted, fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>{l}</button>
            ))}
          </div>
          {alertSpam && <div style={{ fontSize: 11, color: G.warn, marginTop: 5 }}>⚠️ Too many emails causes alert fatigue — you'll start ignoring critical ones.</div>}
        </div>
      </div>
    </div>
  );
}

function LoginLab() {
  const [hideLogin, setHideLogin] = useState(false);
  const [limitAttempts, setLimitAttempts] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [attack, setAttack] = useState("bruteforce");
  const attacks = {
    bruteforce: ["🤖 Automated Brute Force", "Bot hammering wp-login.php with hundreds of attempts per minute."],
    credential: ["🎭 Credential Stuffing", "Attacker uses leaked passwords from other data breaches."],
    targeted: ["🎯 Targeted Manual Attack", "Human attacker who knows your username and login URL."],
  };
  const getResult = () => {
    if (attack === "bruteforce") {
      if (hideLogin && limitAttempts) return ["🛡️ Blocked", "Bot can't find the URL AND gets locked out. Full stop.", G.accent];
      if (hideLogin) return ["✅ Mostly Safe", "Bot can't find the login URL. But if it ever leaks, no rate limiting backs you up.", G.accent3];
      if (limitAttempts) return ["⚠️ Slowed", "Bot gets locked out but is still hammering your visible wp-login.php, generating server load.", G.warn];
      return ["🚨 Under Attack", "Bot freely hammering your site with unlimited attempts. Server load spiking.", G.danger];
    }
    if (attack === "credential") {
      if (twoFA) return ["🛡️ Blocked", "Even with a correct password from a breach, 2FA stops them cold.", G.accent];
      if (limitAttempts) return ["⚠️ Slowed", "Rate limiting slows the attack but a valid leaked password will eventually get through.", G.warn];
      return ["🚨 HIGH RISK", "Attacker has your real password from a data breach. No 2FA = they're in. This is how most WP sites are compromised.", G.danger];
    }
    if (attack === "targeted") {
      if (twoFA) return ["🛡️ Blocked", "Even knowing your URL and username, 2FA makes the password useless alone.", G.accent];
      if (hideLogin && limitAttempts) return ["⚠️ Significantly Slowed", "Rate limiting throttles guesses but a persistent human attacker will keep trying.", G.warn];
      return ["🚨 Vulnerable", "A determined attacker with your username can guess passwords indefinitely. Add 2FA.", G.danger];
    }
  };
  const result = getResult();
  return (
    <div style={{ background: "#050710", border: `1px solid ${G.border}`, borderRadius: 12, overflow: "hidden", margin: "14px 0" }}>
      <div style={{ padding: "12px 16px", background: `${G.accent2}08`, borderBottom: `1px solid ${G.border}` }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: G.accent2, letterSpacing: "0.1em", textTransform: "uppercase" }}>🔑 Login Defense Scenario Lab</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, color: G.text, marginBottom: 14 }}>Toggle defenses on/off, then pick an attack type to see how they interact.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 14 }}>
          {[["👻 Hide Login URL", hideLogin, setHideLogin], ["⛔ Limit Attempts", limitAttempts, setLimitAttempts], ["📱 2FA Enabled", twoFA, setTwoFA]].map(([label, state, set], i) => (
            <div key={i} onClick={() => set(!state)} style={{ padding: "12px 14px", borderRadius: 9, border: `1.5px solid ${state ? G.accent2 : G.border}`, background: state ? `${G.accent2}10` : "transparent", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: state ? "#ff9d73" : G.mid }}>{label}</div>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: state ? G.accent2 : G.muted, marginTop: 4 }}>{state ? "ON" : "OFF"}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: G.mid, marginBottom: 8, fontWeight: 600 }}>Simulate Attack</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {Object.entries(attacks).map(([k, [label, desc]]) => (
            <div key={k} onClick={() => setAttack(k)} style={{ padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${attack === k ? G.accent2 : G.border}`, background: attack === k ? `${G.accent2}10` : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: attack === k ? "#ff9d73" : G.mid }}>{label}</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: `${result[2]}12`, border: `1.5px solid ${result[2]}40` }}>
          <div style={{ fontFamily: "monospace", fontWeight: 700, color: result[2], marginBottom: 6, fontSize: 14 }}>{result[0]}</div>
          <div style={{ fontSize: 13, color: G.text, lineHeight: 1.65 }}>{result[1]}</div>
        </div>
      </div>
    </div>
  );
}

function PermissionsGame() {
  const files = [
    { path: "/ (WordPress root)", correct: "755", hint: "Directories need execute to be traversed. Owner full, others read+execute." },
    { path: "wp-config.php", correct: "600", hint: "Crown jewel — DB password lives here. Only the owner reads/writes it. Nobody else." },
    { path: "wp-content/uploads/", correct: "755", hint: "Needs write access for image uploads but keep it as restrictive as possible." },
    { path: ".htaccess", correct: "644", hint: "WP writes to this for permalinks. Others should only read." },
    { path: "wp-includes/ files", correct: "644", hint: "Core files — owner writes, others read. PHP files never need the execute bit." },
    { path: "wp-admin/index.php", correct: "644", hint: "PHP runs via web server, not as a shell script — so no execute bit needed." },
  ];
  const options = ["400", "600", "644", "755", "775", "777"];
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(null);
  const select = (i, val) => { if (revealed[i]) return; setAnswers(a => ({ ...a, [i]: val })); setRevealed(r => ({ ...r, [i]: true })); };
  return (
    <div style={{ background: "#050710", border: `1px solid ${G.border}`, borderRadius: 12, overflow: "hidden", margin: "14px 0" }}>
      <div style={{ padding: "12px 16px", background: `${G.warn}08`, borderBottom: `1px solid ${G.border}` }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: G.warn, letterSpacing: "0.1em", textTransform: "uppercase" }}>⚙️ File Permissions Challenge</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, color: G.text, marginBottom: 14 }}>Pick the correct chmod for each WordPress file. Click to reveal the answer.</div>
        {files.map((f, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7, flexWrap: "wrap", gap: 6 }}>
              <code style={{ fontFamily: "monospace", fontSize: 12, color: "#7dd3a8", background: G.panel, padding: "4px 10px", borderRadius: 6 }}>{f.path}</code>
              {revealed[i] && <span style={{ fontSize: 11, fontFamily: "monospace", color: answers[i] === f.correct ? G.accent : "#ff8099", fontWeight: 700 }}>{answers[i] === f.correct ? "✅ Correct!" : `❌ Answer: ${f.correct}`}</span>}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {options.map(opt => {
                let border = G.border, bg = "transparent", color = G.muted;
                if (revealed[i]) {
                  if (opt === f.correct) { border = G.accent; bg = `${G.accent}12`; color = G.accent; }
                  else if (opt === answers[i]) { border = G.danger; bg = `${G.danger}10`; color = "#ff8099"; }
                  else { color = "#1e2530"; border = "#111820"; }
                } else if (answers[i] === opt) { border = G.warn; bg = `${G.warn}10`; color = G.warn; }
                return <button key={opt} onClick={() => select(i, opt)} style={{ padding: "5px 14px", borderRadius: 6, border: `1.5px solid ${border}`, background: bg, color, fontFamily: "monospace", fontSize: 12, fontWeight: 700, cursor: revealed[i] ? "default" : "pointer", transition: "all 0.2s" }}>{opt}</button>;
              })}
            </div>
            {revealed[i] && <div style={{ fontSize: 11, color: G.muted, marginTop: 5 }}>💡 {f.hint}</div>}
          </div>
        ))}
        {files.every((_, i) => answers[i]) && score === null && (
          <button onClick={() => setScore(files.filter((f, i) => answers[i] === f.correct).length)} style={{ marginTop: 6, padding: "10px 22px", background: `${G.warn}15`, border: `1px solid ${G.warn}`, borderRadius: 8, color: G.warn, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>See My Score</button>
        )}
        {score !== null && (
          <div style={{ marginTop: 10, padding: "12px 16px", borderRadius: 9, background: score >= 5 ? `${G.accent}10` : `${G.danger}10`, border: `1px solid ${score >= 5 ? G.accent : G.danger}35`, color: score >= 5 ? G.accent : "#ff8099", fontFamily: "monospace", fontWeight: 700, fontSize: 14 }}>
            {score}/{files.length} {score === files.length ? "🏆 Perfect!" : score >= 4 ? "✅ Good!" : "📚 Review and retry — permissions are critical!"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODULE PAGES ─────────────────────────────────────────────────────────────
function Module0() {
  return (
    <div>
      <SectionTitle color={G.accent}>01 — WAF Firewall Rules</SectionTitle>
      <Card title="🧱 Extended vs Basic Protection">
        <strong style={{ color: G.accent }}>Extended Protection</strong> loads the WAF as a must-use plugin — <em>before WordPress core boots</em>. Attacks are killed before your database, theme, or plugins are even touched.<br /><br />
        <strong style={{ color: G.accent2 }}>Basic Protection</strong> loads with WordPress, meaning a plugin vulnerability exploit can run before the firewall activates.
      </Card>
      <Alert type="warn">Go to <strong>Wordfence → Firewall → Manage WAF</strong> → click <em>"Optimize the Wordfence Firewall"</em> and follow the wizard to enable Extended Protection.</Alert>
      <WordfenceSimulator />
      <SectionTitle color={G.accent}>02 — Rate Limiting</SectionTitle>
      <Card title="🚦 What Rate Limiting Prevents">
        Rate limiting throttles IPs making too many requests. It stops DDoS attacks, content scraping, vulnerability scanning, and XML-RPC brute force multicall attacks.
      </Card>
      <CodeBlock lang="Wordfence Rate Limiting Settings" code={`Wordfence → All Options → Rate Limiting\n\nHuman page views:   240/min  ✅\nCrawlers:            60/min  ✅\nIf 404 rate exceeds: 240/min → Throttle\nEnable: Block IPs running known scanners ✅\nEnable: Block IPs with invalid User-Agent ✅`} />
      <SectionTitle color={G.accent}>03 — What Wordfence Scans For</SectionTitle>
      <CheckList items={[
        "<strong>Core file integrity</strong> — every WP file compared to official WordPress checksums",
        "<strong>Malware signatures</strong> — known malicious code patterns in plugins and themes",
        "<strong>Backdoors & webshells</strong> — PHP files hidden in uploads that accept remote commands",
        "<strong>Exposed sensitive files</strong> — wp-config.php, .env, backup files visible to the web",
        "<strong>Outdated software</strong> — plugins/themes/core with published CVEs",
        "<strong>Database injection</strong> — malicious URLs or encoded payloads in posts/comments",
        "<strong>Admin account issues</strong> — admin using email as username, weak passwords",
      ]} />
      <SectionTitle color={G.accent}>04 — Alert Configuration</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <div style={{ background: `${G.accent}08`, border: `1px solid ${G.accent}25`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontWeight: 700, color: G.accent, fontSize: 13, marginBottom: 10 }}>✅ ENABLE</div>
          {["Critical severity threats", "New admin user created", "Malware / backdoor found", "Plugin/core updates (daily digest)", "WAF turned off remotely"].map(t => <div key={t} style={{ fontSize: 12, color: G.text, padding: "4px 0" }}>• {t}</div>)}
        </div>
        <div style={{ background: `${G.danger}08`, border: `1px solid ${G.danger}25`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontWeight: 700, color: "#ff8099", fontSize: 13, marginBottom: 10 }}>❌ DISABLE</div>
          {["Someone was locked out", "New user registered (open reg)", "Every scan summary", "All failed login attempts", "All 404 notifications"].map(t => <div key={t} style={{ fontSize: 12, color: G.text, padding: "4px 0" }}>• {t}</div>)}
        </div>
      </div>
      <Quiz q="Wordfence has been in Learning Mode for 3 months. What's the security risk?"
        options={["It uses more server resources over time", "Learning Mode passes ALL traffic — it's essentially the firewall being off", "It only blocks known bad IPs", "It disables email alerts"]}
        correctIdx={1} explanation="Learning Mode is designed for ~1 week to map traffic patterns, then you switch to Enabled & Protecting. Leaving it on for months means zero attack blocking." />
    </div>
  );
}

function Module1() {
  return (
    <div>
      <SectionTitle color={G.accent3}>01 — SSL Installation</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 12 }}>
        <Card title="🆓 Let's Encrypt">Free, auto-renews every 90 days. Available in cPanel AutoSSL. Identical browser trust to paid certs for most sites.</Card>
        <Card title="💳 Paid SSL">OV/EV certs show company name in browser bar. Wildcard covers all subdomains. Needed for enterprise trust signals.</Card>
      </div>
      <Step n="1" title="Install cert at your host">cPanel → SSL/TLS → Install Certificate, or use one-click Let's Encrypt. Verify by visiting https://yoursite.com — padlock should appear.</Step>
      <Step n="2" title="Update WordPress URLs (most missed step)">Settings → General → change <em>both</em> WordPress Address and Site Address from http:// to https://. Skipping this causes redirect loops.</Step>
      <Step n="3" title="Force HTTPS in .htaccess">
        <CodeBlock lang=".htaccess" color={G.accent3} code={`RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n# HSTS — tells browsers to always use HTTPS for 1 year\nHeader always set Strict-Transport-Security "max-age=31536000; includeSubDomains"`} />
      </Step>
      <Alert type="info">Enable HSTS <strong>only after</strong> SSL is confirmed working. HSTS mistakes are hard to undo — browsers will refuse HTTP connections for up to a year.</Alert>
      <SectionTitle color={G.accent3}>02 — Mixed Content Types</SectionTitle>
      <Card title="🔍 Passive vs Active Mixed Content">
        <strong style={{ color: G.warn }}>Passive</strong> — images/video over HTTP. Browser shows broken padlock but doesn't block content.<br /><br />
        <strong style={{ color: G.danger }}>Active</strong> — scripts/stylesheets/iframes over HTTP. Browser <em>blocks these entirely</em> — your site can break.
      </Card>
      <SectionTitle color={G.accent3}>03 — The Fix Workflow</SectionTitle>
      <Step n="1" title="Find errors with Chrome DevTools">F12 → Console → filter by 'mixed content'. Note every HTTP URL flagged.</Step>
      <Step n="2" title="Run Better Search Replace">
        Install Better Search Replace plugin. Run a <strong>dry run first</strong>. Search <code>http://yourdomain.com</code> → replace <code>https://yourdomain.com</code> across ALL tables.
        <Alert type="warn">Always back up your database before running search-replace on all tables.</Alert>
      </Step>
      <Step n="3" title="Fix hard-coded URLs in plugins/themes">Check DevTools to identify which plugin serves HTTP resources. Update the plugin or self-host the resource.</Step>
      <Step n="4" title="Purge ALL caches">Server cache, CDN (Cloudflare: Purge Everything), WP Rocket/W3TC/LiteSpeed. Cached HTTP pages are the #1 reason fixed errors persist.</Step>
      <Step n="5" title="Add CSP upgrade header as a safety net">
        <CodeBlock lang=".htaccess" color={G.accent3} code={`Header always set Content-Security-Policy "upgrade-insecure-requests"`} />
      </Step>
      <Quiz q="After fixing mixed content, Chrome still shows a broken padlock but DevTools shows no errors. What's most likely happening?"
        options={["SSL certificate has expired", "WordPress URLs weren't updated in Settings → General", "A caching plugin is still serving old HTTP pages — purge all caches and test in incognito", "The theme doesn't support HTTPS"]}
        correctIdx={2} explanation="If DevTools shows no errors but the padlock is broken, cached pages are the culprit. Old cached versions still contain HTTP resources. Purge everything and test in incognito (which bypasses browser cache)." />
    </div>
  );
}

function Module2() {
  return (
    <div>
      <Alert type="danger">The default WordPress install has <strong>zero login attempt limits</strong>. A bot can try millions of passwords indefinitely with no protection unless you add it.</Alert>
      <SectionTitle color={G.accent2}>01 — Limit Login Attempts Reloaded</SectionTitle>
      <Card title="⚙️ Recommended Settings">Install from the plugin repo (2M+ installs). These settings balance security with usability:</Card>
      <CheckList items={[
        "<strong>Allowed Retries: 4</strong> — gives real users who mistype a couple of chances",
        "<strong>Lockout Duration: 20 minutes</strong> — stops bots, short enough not to frustrate users",
        "<strong>Increase to 24 hours after: 4 lockouts</strong> — escalating penalty for persistent attackers",
        "<strong>Block invalid usernames: ON</strong> — any attempt as 'admin' is always a bot",
        "<strong>GDPR compliance (mask IPs): ON</strong> — required for EU users",
        "<strong>IP origin: X-Forwarded-For</strong> — CRITICAL if you use Cloudflare or any CDN/proxy",
      ]} />
      <Alert type="tip">Without the correct IP origin setting behind Cloudflare, ALL visitors appear to come from Cloudflare's IPs. One lockout would lock out all users sharing that edge node.</Alert>
      <SectionTitle color={G.accent2}>02 — WPS Hide Login</SectionTitle>
      <Card title="👻 What It Actually Does">
        WPS Hide Login intercepts all requests and only allows login if the URL matches your secret slug. Anyone hitting <code>/wp-login.php</code> gets redirected. This eliminates <strong style={{ color: G.accent }}>100% of automated bots</strong> that blindly hammer the standard URL.
      </Card>
      <Step n="1" title="Set your slug">Settings → WPS Hide Login. Choose something unguessable: NOT <code>/login</code>, <code>/admin</code>. YES: <code>/sunrise-panel</code>, <code>/staffaccess-2024</code>.</Step>
      <Step n="2" title="Write it down immediately">Save the URL in your password manager and bookmark it. Forgetting it locks you out of your own site.</Step>
      <Step n="3" title="Block xmlrpc.php too">
        <CodeBlock lang=".htaccess" color={G.accent2} code={`# Block direct access to wp-login.php\n<Files "wp-login.php">\n  Order Deny,Allow\n  Deny from all\n</Files>\n\n# Block xmlrpc.php (another brute force vector)\n<Files "xmlrpc.php">\n  Order Deny,Allow\n  Deny from all\n</Files>`} />
      </Step>
      <Alert type="danger">If you lock wp-login.php by IP and your IP changes (most home connections are dynamic), you're locked out. Always keep SFTP/cPanel access as your master key.</Alert>
      <LoginLab />
      <SectionTitle color={G.accent2}>03 — Two-Factor Authentication</SectionTitle>
      <Card title="📱 Why 2FA Is Non-Negotiable for Admins">Even a strong unique password can appear in a data breach. 2FA means the password alone is never enough — attackers also need your phone.</Card>
      <CheckList items={[
        "Use <strong>TOTP app</strong> (Authy, Bitwarden Authenticator) — more secure than email OTP",
        "<strong>Enforce for Administrator and Editor roles</strong> at minimum",
        "<strong>Save backup codes</strong> — generated during setup, single-use, store securely",
        "Use <strong>Authy</strong> not Google Authenticator — supports encrypted cloud backup if you lose your phone",
        "<strong>Test 2FA in incognito</strong> before logging out of your current session",
      ]} />
      <Quiz q="A client forgot their custom login URL from WPS Hide Login AND lost their 2FA backup codes. What's the recovery path?"
        options={["They're permanently locked out", "Access via SFTP/cPanel → rename the wps-hide-login plugin folder → log in via /wp-login.php → set up 2FA again", "Email the hosting provider to reset the password", "Use wp-cli to delete and recreate the admin user"]}
        correctIdx={1} explanation="SFTP/cPanel bypasses all WordPress-layer security. Rename the plugin folder in wp-content/plugins/ to disable WPS Hide Login, then log in normally via wp-login.php. This is why hosting-level access is your master key — never lose it." />
    </div>
  );
}

function Module3() {
  return (
    <div>
      <SectionTitle color={G.warn}>01 — Understanding chmod</SectionTitle>
      <Card title="📖 Reading Permission Numbers">
        Three groups: <strong style={{ color: G.warn }}>Owner · Group · Others</strong><br /><br />
        Each digit = sum of: <strong>4</strong> read + <strong>2</strong> write + <strong>1</strong> execute<br /><br />
        <code>755</code> = Owner full (7), Group read+execute (5), Others read+execute (5)<br />
        <code>644</code> = Owner read+write (6), Group read (4), Others read (4)<br />
        <code>600</code> = Owner read+write only — nobody else can touch it
      </Card>
      <Alert type="danger"><strong>Never use 777.</strong> World-writable means any process on the server — including injected malicious scripts and other shared hosting users — can write to your files.</Alert>
      <PermissionsGame />
      <SectionTitle color={G.warn}>02 — Set Permissions via SSH</SectionTitle>
      <CodeBlock lang="bash — Set Correct Permissions" color={G.warn} code={`# Run from your WordPress root\n\n# All directories to 755\nfind /path/to/wordpress/ -type d -exec chmod 755 {} \\;\n\n# All files to 644\nfind /path/to/wordpress/ -type f -exec chmod 644 {} \\;\n\n# Lock down wp-config.php\nchmod 600 /path/to/wordpress/wp-config.php\n\n# Verify\nls -la /path/to/wordpress/wp-config.php\n# Should show: -rw------- (600)`} />
      <SectionTitle color={G.warn}>03 — wp-config.php Hardening</SectionTitle>
      <Card title="🔐 What's at Stake">wp-config.php holds your <strong style={{ color: G.danger }}>database hostname, username, and password</strong>. If an attacker reads it, they have full access to all site data and can run arbitrary SQL.</Card>
      <CodeBlock lang="wp-config.php — Security Constants" color={G.warn} code={`/* 1. Disable in-browser theme/plugin code editor */\ndefine('DISALLOW_FILE_EDIT', true);\n\n/* 2. Force SSL on all admin & login pages */\ndefine('FORCE_SSL_ADMIN', true);\n\n/* 3. Change table prefix from default wp_ */\n$table_prefix = 'xk7_'; // Set during install\n\n/* 4. Disable debug output on production */\ndefine('WP_DEBUG', false);\ndefine('WP_DEBUG_LOG', false);\ndefine('WP_DEBUG_DISPLAY', false);\n\n/* 5. Regenerate security keys (do after any breach) */\n// Generate at: https://api.wordpress.org/secret-key/1.1/salt/\ndefine('AUTH_KEY', 'unique-string-here');\ndefine('SECURE_AUTH_KEY', 'unique-string-here');\n// ... (8 keys total from generator)`} />
      <Alert type="warn"><strong>DISALLOW_FILE_EDIT vs DISALLOW_FILE_MODS:</strong> FILE_EDIT blocks the in-browser code editor only. FILE_MODS also blocks plugin/theme installation AND auto-updates. Only use FILE_MODS if you deploy via SFTP/Git.</Alert>
      <SectionTitle color={G.warn}>04 — .htaccess Security Rules</SectionTitle>
      <CodeBlock lang=".htaccess — Full Security Ruleset" color={G.warn} code={`# Block wp-config.php\n<Files "wp-config.php">\n  Order Allow,Deny\n  Deny from all\n</Files>\n\n# Block .htaccess itself\n<Files ".htaccess">\n  Order Allow,Deny\n  Deny from all\n</Files>\n\n# Block PHP execution in uploads (CRITICAL)\n<Directory "/wp-content/uploads">\n  <FilesMatch "\\.(php|php3|php5|phtml)$">\n    Order Deny,Allow\n    Deny from all\n  </FilesMatch>\n</Directory>\n\n# Disable directory listing\nOptions -Indexes\n\n# Block readme/license info-leaking files\n<FilesMatch "^(readme|license)\\.(html|txt)$">\n  Order Allow,Deny\n  Deny from all\n</FilesMatch>`} />
      <Alert type="tip">Blocking PHP execution in /uploads neutralizes the most common attack after a file upload vulnerability. An attacker uploads shell.php — it exists on disk but can never execute. One rule, entire attack class eliminated.</Alert>
      <Quiz q="An attacker uploads 'image.php' to /wp-content/uploads/. Your .htaccess has the PHP execution block. They visit the URL. What happens?"
        options={["PHP executes and gives server access", "WordPress auto-deletes the file", "Server returns 403 Forbidden — PHP is blocked in that directory", "Wordfence blocks the request"]}
        correctIdx={2} explanation="The FilesMatch rule in the uploads directory tells the web server not to execute PHP there. The file exists on disk but accessing it returns 403 Forbidden. The webshell is dead on arrival." />
    </div>
  );
}

function SummaryPage({ completed }) {
  const allDone = Object.keys(completed).length === 4;
  const modules = [
    { id: 0, icon: "🔥", title: "Wordfence Deep Dive", color: G.accent, points: ["Extended Protection WAF mode enabled", "Learning Mode disabled after 1 week", "Brute force: max 4–5 attempts, 20+ min lockout", "Rate limiting configured for crawlers and 404s", "Alerts set to critical-only, no spam"] },
    { id: 1, icon: "🔒", title: "SSL & Mixed Content", color: G.accent3, points: ["SSL certificate installed and verified", "WordPress URLs updated to https://", "HTTPS redirect in .htaccess", "Mixed content found and fixed via Better Search Replace", "All caches purged after fixing", "CSP upgrade-insecure-requests header added"] },
    { id: 2, icon: "🔑", title: "Login Hardening", color: G.accent2, points: ["Limit Login Attempts: 4 retries, 20 min lockout", "IP origin set correctly for CDN/Cloudflare", "WPS Hide Login: custom URL set and saved", "xmlrpc.php blocked via .htaccess", "2FA enabled for admin and editor roles", "2FA backup codes saved securely"] },
    { id: 3, icon: "⚙️", title: "File Permissions", color: G.warn, points: ["All directories set to 755", "All files set to 644", "wp-config.php set to 600", "DISALLOW_FILE_EDIT = true added", "FORCE_SSL_ADMIN = true added", "PHP execution blocked in /uploads", "Directory listing disabled"] },
  ];
  return (
    <div>
      <div style={{ textAlign: "center", padding: "20px 0 30px" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{allDone ? "🏆" : "📋"}</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>{allDone ? "Training Complete!" : "Training Summary"}</h2>
        <p style={{ fontSize: 14, color: G.mid, margin: 0 }}>{allDone ? "You've covered all four WordPress security pillars." : `${Object.keys(completed).length}/4 modules completed so far.`}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 28 }}>
        {modules.map(m => (
          <div key={m.id} style={{ background: G.panel, border: `1px solid ${completed[m.id] ? m.color + "40" : G.border}`, borderRadius: 12, padding: "16px 18px", opacity: completed[m.id] ? 1 : 0.45 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{ fontWeight: 700, color: completed[m.id] ? m.color : G.muted, fontSize: 14 }}>{m.title}</span>
              {completed[m.id] && <span style={{ marginLeft: "auto", fontSize: 12, color: m.color }}>✓ Done</span>}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {m.points.map((p, i) => (
                <li key={i} style={{ fontSize: 12, color: completed[m.id] ? G.text : G.muted, padding: "3px 0", display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: completed[m.id] ? m.color : G.muted, flexShrink: 0, marginTop: 1 }}>•</span>{p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: G.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>🔗 Essential Resources</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
          {[
            ["Wordfence Documentation", "wordfence.com/help"],
            ["SSL Labs Test", "ssllabs.com/ssltest"],
            ["Have I Been Pwned", "haveibeenpwned.com"],
            ["WP Security Keys Generator", "api.wordpress.org/secret-key/1.1/salt"],
            ["WP-CLI Commands", "wp-cli.org/commands"],
            ["CVE for WordPress Plugins", "wpscan.com/wordpress-security-scanner"],
          ].map(([title, url]) => (
            <div key={title} style={{ background: "#0a0d14", border: `1px solid ${G.border}`, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: G.muted }}>{url}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MODULE CONFIG ────────────────────────────────────────────────────────────
const MODULES = [
  { id: 0, icon: "🔥", title: "Wordfence Deep Dive", sub: "Firewall · Scans · Alerts", color: G.accent, badge: "MODULE 01" },
  { id: 1, icon: "🔒", title: "SSL & Mixed Content", sub: "HTTPS · Errors · Fixes", color: G.accent3, badge: "MODULE 02" },
  { id: 2, icon: "🔑", title: "Login Hardening", sub: "Limits · Hide Login · 2FA", color: G.accent2, badge: "MODULE 03" },
  { id: 3, icon: "⚙️", title: "File Permissions", sub: "chmod · wp-config · .htaccess", color: G.warn, badge: "MODULE 04" },
  { id: 4, icon: "📋", title: "Summary", sub: "Review & Resources", color: "#a0b0c0", badge: "SUMMARY" },
];
const DESCS = [
  "Master Wordfence's WAF, scan engine, rate limiting, and alert configuration.",
  "Install SSL correctly and permanently eliminate mixed content errors.",
  "Layer your login defenses: rate limiting, URL obscurity, and 2FA.",
  "Set correct file permissions, harden wp-config.php, and add critical .htaccess rules.",
  "Review everything you've learned and access key security resources.",
];
const CONTENT = [<Module0 />, <Module1 />, <Module2 />, <Module3 />];

// ─── LOCK SCREEN ─────────────────────────────────────────────────────────────
function LockScreen({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const submit = () => {
    if (pw === ACCESS_PASSWORD) { onUnlock(); }
    else {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2500);
      setPw("");
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,229,160,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.025) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 420, animation: shake ? "shake 0.4s ease" : "none" }}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 70, height: 70, borderRadius: 18, background: `linear-gradient(135deg,${G.accent},${G.accent3})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>🛡️</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "0.02em" }}>WP Security Training</h1>
          <p style={{ fontSize: 13, color: G.muted, margin: 0 }}>Enter the access password to continue</p>
        </div>
        <div style={{ background: G.panel, border: `1px solid ${error ? G.danger + "60" : G.border}`, borderRadius: 14, padding: 28, transition: "border-color 0.3s" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: G.mid, fontWeight: 600, display: "block", marginBottom: 8 }}>Password</label>
            <input
              type="password" value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Enter access password"
              style={{ width: "100%", background: "#080b10", border: `1px solid ${error ? G.danger + "60" : G.border}`, borderRadius: 9, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box", transition: "border-color 0.3s" }}
              autoFocus
            />
            {error && <div style={{ fontSize: 12, color: G.danger, marginTop: 7 }}>❌ Incorrect password. Try again.</div>}
          </div>
          <button onClick={submit} style={{ width: "100%", padding: "13px 0", background: `linear-gradient(135deg,${G.accent},#00c887)`, color: "#000", fontWeight: 800, fontSize: 14, border: "none", borderRadius: 9, cursor: "pointer", letterSpacing: "0.04em" }}>
            Unlock Training →
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: G.muted, marginTop: 16 }}>Contact your trainer if you need the access password.</p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainRef = useRef(null);

  // On mobile, default sidebar closed
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  if (!unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />;

  const switchModule = (idx) => {
    setActive(idx);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const complete = (idx) => {
    setCompleted(p => ({ ...p, [idx]: true }));
    if (idx < 3) setTimeout(() => switchModule(idx + 1), 600);
    else setTimeout(() => switchModule(4), 600);
  };

  const doneCount = Object.keys(completed).length;
  const progress = (doneCount / 4) * 100;
  const mod = MODULES[active];

  return (
    <div style={{ display: "flex", height: "100vh", background: G.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden", position: "relative" }}>

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, display: window.innerWidth < 768 ? "block" : "none" }} />
      )}

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 262 : 0, minWidth: sidebarOpen ? 262 : 0,
        background: "#090c12", borderRight: `1px solid ${G.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
        overflowY: "auto", overflowX: "hidden",
        transition: "width 0.3s ease, min-width 0.3s ease",
        position: window.innerWidth < 768 ? "fixed" : "relative",
        top: 0, left: 0, height: "100vh", zIndex: 50,
      }}>
        <div style={{ minWidth: 262 }}>
          {/* Header */}
          <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${G.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${G.accent},${G.accent3})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🛡️</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>WP Security</div>
                <div style={{ fontSize: 10, color: G.muted, fontFamily: "monospace" }}>Training Program</div>
              </div>
            </div>
            <div style={{ background: G.border, borderRadius: 4, height: 4, overflow: "hidden", marginBottom: 5 }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg,${G.accent},${G.accent3})`, borderRadius: 4, width: `${progress}%`, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: G.muted }}>{doneCount}/4 modules complete</div>
          </div>
          {/* Nav */}
          <div style={{ padding: "10px 10px" }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#2a3a4a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 10px 5px" }}>Modules</div>
            {MODULES.map(m => (
              <div key={m.id} onClick={() => switchModule(m.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 11px", borderRadius: 9, cursor: "pointer", marginBottom: 2, border: `1.5px solid ${active === m.id ? m.color + "35" : "transparent"}`, background: active === m.id ? m.color + "10" : "transparent", transition: "all 0.2s" }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: m.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: active === m.id ? m.color : "#6a7a8a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                  <div style={{ fontSize: 10, color: G.muted, fontFamily: "monospace" }}>{m.sub}</div>
                </div>
                {m.id < 4 && (
                  <div style={{ width: 17, height: 17, borderRadius: "50%", border: `1.5px solid ${completed[m.id] ? m.color : G.border}`, background: completed[m.id] ? m.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#000", flexShrink: 0, fontWeight: 900, transition: "all 0.3s" }}>
                    {completed[m.id] ? "✓" : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: `1px solid ${G.border}`, background: G.panel, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 36, height: 36, borderRadius: 8, background: "transparent", border: `1px solid ${G.border}`, color: G.mid, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.title}</div>
            <div style={{ fontSize: 10, color: G.muted, fontFamily: "monospace" }}>{mod.badge}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {MODULES.slice(0, 4).map(m => (
              <div key={m.id} onClick={() => switchModule(m.id)} title={m.title} style={{ width: 8, height: 8, borderRadius: "50%", background: active === m.id ? m.color : completed[m.id] ? m.color + "60" : G.border, cursor: "pointer", transition: "all 0.2s" }} />
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={mainRef} style={{ flex: 1, overflowY: "auto", padding: "24px 20px 60px" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>

            {/* Module header */}
            {active < 4 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: mod.color + "12", border: `1px solid ${mod.color}35`, fontSize: 10, fontFamily: "monospace", color: mod.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                  {mod.icon} {mod.badge}
                </div>
                <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.1 }}>{mod.title}</h1>
                <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.7, margin: 0 }}>{DESCS[active]}</p>
              </div>
            )}

            {/* Content */}
            {active < 4 ? CONTENT[active] : <SummaryPage completed={completed} />}

            {/* Complete button */}
            {active < 4 && (
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${G.border}` }}>
                {!completed[active] ? (
                  <button onClick={() => complete(active)} style={{ padding: "13px 26px", background: `linear-gradient(135deg,${mod.color},${mod.color}cc)`, color: "#000", fontWeight: 800, fontSize: 14, border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    ✓ Mark Complete {active < 3 ? "→ Next Module" : "→ View Summary"}
                  </button>
                ) : (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", background: `${G.accent}08`, border: `1px solid ${G.accent}25`, borderRadius: 10, color: G.accent, fontWeight: 700, fontSize: 13 }}>
                    ✅ Module Complete! <span style={{ color: G.muted, fontWeight: 400 }}>Use the sidebar to navigate.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}