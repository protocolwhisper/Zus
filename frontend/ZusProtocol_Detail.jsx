import { useState, useEffect, useRef } from "react";

/* ─── tokens ─── */
const CYAN     = "#00ffc8";
const CYAN_DIM = "#00ddb0";
const CYAN_MID = "#00c49a";
const BG       = "#020d0f";
const MUTED    = "#3a6660";
const MUTED2   = "#2a5550";
const TEXT     = "#cce8e4";
const MONO     = "'Share Tech Mono', monospace";
const BORDER   = "rgba(0,255,200,.08)";

/* ─── pixel cat ─── */
function PixelCat() {
  const [hov, setHov] = useState(false);
  const pixels = [
    "0011011100","0111111110","1111111111",
    "1010110101","1111111111","0111111110",
    "0101000101","0101000101",
  ];
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ cursor:"pointer", display:"inline-block", transition:"transform .2s",
        transform: hov ? "scale(1.3) translateY(-2px)" : "scale(1)" }} title="=^._.^=">
      {pixels.map((row, ri) => (
        <div key={ri} style={{ display:"flex" }}>
          {row.split("").map((px, ci) => (
            <div key={ci} style={{
              width:3, height:3,
              background: px==="1" ? (hov ? CYAN : CYAN_MID) : "transparent",
              boxShadow: px==="1" && hov ? "0 0 4px rgba(0,255,200,.6)" : "none",
              transition:"background .2s, box-shadow .2s",
            }}/>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── nav link ─── */
function NavLink({ label, active }) {
  const [hov, setHov] = useState(false);
  return (
    <span onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:MONO, fontSize:10, letterSpacing:2,
        color: active ? TEXT : hov ? TEXT : MUTED,
        borderBottom:`2px solid ${active ? CYAN : "transparent"}`,
        paddingBottom:4, cursor:"pointer", transition:"color .2s, border-color .2s",
      }}>{label}</span>
  );
}

/* ─── wallet button ─── */
function WalletBtn() {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:MONO, fontSize:9, letterSpacing:2, lineHeight:1.5,
        color: hov ? BG : CYAN, border:`1px solid ${CYAN}`,
        padding:"7px 16px", cursor:"pointer", textAlign:"center",
        background: hov ? CYAN : "transparent",
        boxShadow: hov ? "0 0 20px rgba(0,255,200,.5)" : "0 0 10px rgba(0,255,200,.15)",
        transition:"all .25s",
      }}>WALLET_<br/>CONNECTED</div>
  );
}

/* ─── animated donut chart ─── */
function Donut({ pct }) {
  const [progress, setProgress] = useState(0);
  const size = 140, stroke = 9, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  useEffect(() => {
    const t = setTimeout(() => setProgress(pct), 600);
    return () => clearTimeout(t);
  }, [pct]);
  const offset = circ - (progress / 100) * circ;
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        {/* track */}
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(0,255,200,.07)" strokeWidth={stroke}/>
        {/* fill */}
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={CYAN} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)",
            filter:"drop-shadow(0 0 6px rgba(0,255,200,.7))" }}/>
      </svg>
      {/* center label */}
      <div style={{
        position:"absolute", inset:0, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center",
      }}>
        <div style={{ fontFamily:MONO, fontSize:22, color:CYAN,
          textShadow:"0 0 14px rgba(0,255,200,.7)" }}>{progress}%</div>
        <div style={{ fontFamily:MONO, fontSize:7, color:MUTED2, letterSpacing:1.5, marginTop:3 }}>
          THRESHOLD_REACHED
        </div>
      </div>
    </div>
  );
}

/* ─── typewriter ─── */
function Typewriter({ text, speed=20, delay=0, style: s }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0, alive = true;
    const t = setTimeout(function tick() {
      if (!alive) return;
      if (i <= text.length) { setOut(text.slice(0, i)); i++; setTimeout(tick, speed); }
      else setDone(true);
    }, delay);
    return () => { alive = false; clearTimeout(t); };
  }, [text]);
  return (
    <span style={s}>
      {out}
      {!done && <span style={{ animation:"cur .7s steps(1) infinite", color:CYAN }}>▋</span>}
    </span>
  );
}

/* ─── counter animation ─── */
function AnimCounter({ target, duration=1400, delay=700 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start, raf, alive = true;
    const t = setTimeout(() => {
      const step = (ts) => {
        if (!alive) return;
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * target));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { alive = false; clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

/* ─── protocol section card ─── */
function ProtoCard({ label, title, desc, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderLeft:`2px solid ${hov ? CYAN : MUTED2}`,
        paddingLeft:14, marginBottom:28,
        transition:"border-color .3s",
        animation:`fadeUp .6s ${delay}ms both`,
      }}>
      <div style={{ fontFamily:MONO, fontSize:9, color: hov ? CYAN : CYAN_DIM,
        letterSpacing:2, marginBottom:8, transition:"color .3s" }}>{label}</div>
      <div style={{ fontFamily:MONO, fontSize:9, color:MUTED, lineHeight:1.9, letterSpacing:.5 }}>{desc}</div>
    </div>
  );
}

/* ─── glitch title ─── */
function GlitchTitle({ children }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setOn(true); setTimeout(() => setOn(false), 120); },
      4500 + Math.random() * 2500);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ animation: on ? "glitch .12s steps(2) both" : "none", display:"inline-block" }}>
      {children}
    </span>
  );
}

/* ─── claim button ─── */
function ClaimBtn() {
  const [hov, setHov] = useState(false);
  const [claimed, setClaimed] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => !claimed && setClaimed(true)}
      style={{
        fontFamily:MONO, fontSize:11, letterSpacing:3,
        color: claimed ? CYAN_DIM : hov ? BG : CYAN,
        border:`1px solid ${claimed ? CYAN_DIM : CYAN}`,
        padding:"14px 48px", cursor: claimed ? "default" : "pointer",
        background: claimed ? "rgba(0,255,200,.06)" : hov ? CYAN : "transparent",
        boxShadow: hov && !claimed ? "0 0 28px rgba(0,255,200,.6), 0 0 56px rgba(0,255,200,.2)" : "0 0 12px rgba(0,255,200,.15)",
        transition:"all .25s",
        display:"inline-block",
        userSelect:"none",
      }}>
      {claimed ? "CLAIMED ✓" : "CLAIM"}
    </div>
  );
}

/* ─── back link ─── */
function BackLink() {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:MONO, fontSize:8, letterSpacing:2,
        color: hov ? CYAN : MUTED2,
        textDecoration: hov ? "underline" : "none",
        cursor:"pointer", transition:"color .2s",
        marginBottom:40,
      }}>
      {"<<"} BACK TO CAMPAIGN OVERVIEW
    </div>
  );
}

/* ─── scanline ─── */
function Scanline() {
  return (
    <div style={{
      position:"absolute", left:0, right:0, height:2, pointerEvents:"none",
      background:"linear-gradient(180deg,transparent,rgba(0,255,200,.05),transparent)",
      animation:"scanline 7s linear infinite",
    }}/>
  );
}

/* ─── main ─── */
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:${BG}; margin:0; font-family:${MONO}; overflow-x:hidden; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:${BG}; }
        ::-webkit-scrollbar-thumb { background:#00806a; }
        @keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes glitch {
          0%  { clip-path:inset(20% 0 60% 0); transform:translate(-2px,0); }
          33% { clip-path:inset(60% 0 10% 0); transform:translate(2px,0); filter:hue-rotate(20deg); }
          66% { clip-path:inset(40% 0 40% 0); transform:translate(-1px,0); }
          100%{ clip-path:none; transform:translate(0); }
        }
        @keyframes scanline {
          0%   { top:-2px; }
          100% { top:100%; }
        }
        @keyframes pulse {
          0%,100% { box-shadow:0 0 5px ${CYAN},0 0 12px rgba(0,255,200,.3); }
          50%     { box-shadow:0 0 10px ${CYAN},0 0 24px rgba(0,255,200,.55); }
        }
        @keyframes verifiedPop {
          0%   { transform:scale(.7); opacity:0; }
          70%  { transform:scale(1.15); }
          100% { transform:scale(1); opacity:1; }
        }
        @keyframes returnFadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative" }}>

        {/* bg ambience */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
          background:"radial-gradient(ellipse 60% 45% at 75% 25%, rgba(0,255,200,.04) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 20% 75%, rgba(0,180,140,.025) 0%, transparent 60%)" }}/>
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
          backgroundImage:"linear-gradient(rgba(0,255,200,.014) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,.014) 1px,transparent 1px)",
          backgroundSize:"55px 55px",
          maskImage:"radial-gradient(ellipse at 70% 20%, black 15%, transparent 65%)" }}/>

        {/* ── HEADER ── */}
        <header style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 40px", height:56,
          borderBottom:`1px solid ${BORDER}`,
          background:"rgba(2,13,15,.88)", backdropFilter:"blur(10px)",
          position:"sticky", top:0, zIndex:50,
          animation:"fadeUp .5s both",
        }}>
          <span style={{ fontFamily:MONO, fontSize:13, color:CYAN, letterSpacing:3,
            textShadow:"0 0 14px rgba(0,255,200,.5)" }}>ZUS_PROTOCOL</span>
          <div style={{ display:"flex", gap:32, alignItems:"center" }}>
            {["Campaigns","Analytics","Vault","Protocols"].map(t => (
              <NavLink key={t} label={t} active={t==="Protocols"} />
            ))}
          </div>
          <WalletBtn />
        </header>

        {/* ── BODY ── */}
        <div style={{ flex:1, display:"grid", gridTemplateColumns:"320px 1fr",
          position:"relative", zIndex:1 }}>

          {/* ── LEFT PANEL ── */}
          <aside style={{
            borderRight:`1px solid ${BORDER}`,
            padding:"40px 28px",
            background:"rgba(4,20,24,.5)",
            position:"relative", overflow:"hidden",
            animation:"slideLeft .6s .1s both",
          }}>
            <Scanline />

            <BackLink />

            <div style={{ fontFamily:MONO, fontSize:8, color:MUTED2, letterSpacing:2, marginBottom:14 }}>
              PROTOCOL_DEFINITION
            </div>
            <h2 style={{ fontFamily:MONO, fontSize:18, color:TEXT, letterSpacing:2, lineHeight:1.25, marginBottom:36,
              animation:"fadeUp .6s .2s both" }}>
              NODE_INTEGRITY<br/>REWARDS_SCHEMA
            </h2>

            <ProtoCard
              label="ZK-PROOFS"
              desc="Zero-knowledge proof validation ensures transaction validity without revealing underlying data architecture. Mandatory for all Tier-1 reward distributions."
              delay={250}
            />
            <ProtoCard
              label="STEALTH_ADDRESSES"
              desc="One-time destination keys generated per-transaction to maintain protocol anonymity and prevent correlation of validator rewards."
              delay={380}
            />

            {/* timestamp / block */}
            <div style={{ position:"absolute", bottom:28, left:28, right:28,
              display:"flex", gap:32, animation:"fadeIn .6s .8s both" }}>
              <div>
                <div style={{ fontFamily:MONO, fontSize:7, color:MUTED2, letterSpacing:1.5, marginBottom:3 }}>TIMESTAMP:</div>
                <div style={{ fontFamily:MONO, fontSize:8, color:MUTED }}>2024.11.12_04:22:11</div>
              </div>
              <div>
                <div style={{ fontFamily:MONO, fontSize:7, color:MUTED2, letterSpacing:1.5, marginBottom:3 }}>BLOCK:</div>
                <div style={{ fontFamily:MONO, fontSize:8, color:MUTED }}>#19,233,404</div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT PANEL ── */}
          <main style={{ padding:"40px 44px", animation:"slideRight .6s .15s both" }}>

            {/* badge + id */}
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16,
              animation:"fadeUp .5s .3s both" }}>
              <div style={{
                fontFamily:MONO, fontSize:8, letterSpacing:1.5, color:CYAN,
                border:`1px solid rgba(0,255,200,.35)`,
                padding:"3px 10px", background:"rgba(0,255,200,.06)",
              }}>ACTIVE_CAMPAIGN</div>
              <div style={{ fontFamily:MONO, fontSize:8, color:MUTED2, letterSpacing:1 }}>ID: WLP_772</div>
            </div>

            {/* campaign title */}
            <h1 style={{ fontFamily:MONO, fontSize:"clamp(22px,3.5vw,38px)", color:TEXT,
              letterSpacing:3, marginBottom:24, lineHeight:1.1,
              animation:"fadeUp .6s .4s both",
              borderBottom:`1px solid ${BORDER}`, paddingBottom:20 }}>
              <GlitchTitle>WINTER_LIQUIDITY_PULSE</GlitchTitle>
            </h1>

            {/* stats card */}
            <div style={{
              border:`1px solid ${BORDER}`,
              background:"rgba(4,20,24,.7)",
              padding:24, marginBottom:28,
              position:"relative", overflow:"hidden",
              animation:"fadeUp .6s .5s both",
            }}>
              {/* top-left corner mark */}
              <div style={{ position:"absolute", top:0, left:0, width:12, height:12,
                borderTop:`2px solid ${CYAN}`, borderLeft:`2px solid ${CYAN}` }}/>
              <div style={{ position:"absolute", bottom:0, right:0, width:12, height:12,
                borderBottom:`2px solid ${MUTED2}`, borderRight:`2px solid ${MUTED2}` }}/>

              <div style={{ display:"flex", alignItems:"flex-start", gap:32 }}>
                {/* left: recipients */}
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:MONO, fontSize:8, color:MUTED2, letterSpacing:2, marginBottom:10 }}>
                    RECIPIENTS_PARTICIPATING
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:"clamp(36px,5vw,58px)", color:TEXT,
                    lineHeight:1, textShadow:"0 0 20px rgba(0,255,200,.12)" }}>
                    <AnimCounter target={1420} />
                  </div>

                  {/* eligibility badge */}
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    border:`1px solid rgba(0,255,200,.2)`,
                    background:"rgba(0,255,200,.04)",
                    padding:"8px 14px", marginTop:20,
                    animation:"verifiedPop .5s .9s both",
                  }}>
                    <div style={{ width:16, height:16, borderRadius:"50%",
                      background:CYAN_DIM, display:"flex", alignItems:"center",
                      justifyContent:"center", fontSize:9, color:BG, fontWeight:700,
                      boxShadow:`0 0 8px rgba(0,255,200,.5)`,
                      animation:"pulse 2s ease-in-out infinite",
                    }}>✓</div>
                    <div>
                      <div style={{ fontFamily:MONO, fontSize:7, color:MUTED2, letterSpacing:1.5 }}>ELIGIBILTY_VERIFIED</div>
                      <div style={{ fontFamily:MONO, fontSize:10, color:CYAN, letterSpacing:1 }}>TRUE</div>
                    </div>
                  </div>
                </div>

                {/* right: donut */}
                <div style={{ flexShrink:0 }}>
                  <Donut pct={75} />
                </div>
              </div>
            </div>

            {/* expected return */}
            <div style={{ marginBottom:32, animation:"fadeUp .6s .65s both" }}>
              <div style={{ fontFamily:MONO, fontSize:8, color:MUTED2, letterSpacing:2, marginBottom:10 }}>
                EXPECTED RETURN
              </div>
              <div style={{ fontFamily:MONO, fontSize:"clamp(26px,4vw,42px)", color:TEXT, letterSpacing:2, marginBottom:6 }}>
                4.201 <span style={{ color:CYAN }}>ETH</span>
              </div>
              <div style={{ fontFamily:MONO, fontSize:14, color:CYAN_DIM, letterSpacing:2,
                textShadow:"0 0 10px rgba(0,255,200,.3)",
                animation:"returnFadeUp .6s .85s both" }}>
                +2,500 $ZUS
              </div>
            </div>

            {/* claim */}
            <div style={{ animation:"fadeUp .6s .8s both" }}>
              <ClaimBtn />
            </div>

          </main>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop:`1px solid ${BORDER}`,
          padding:"14px 40px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          fontFamily:MONO, fontSize:8, color:MUTED2, letterSpacing:1,
          background:"rgba(2,13,15,.8)",
          position:"relative", zIndex:1,
        }}>
          <div>
            <div style={{ color:CYAN, marginBottom:4 }}>ZUS_PROTOCOL_CORE</div>
            <div style={{ color:"#1a4040", lineHeight:1.9 }}>
              © 2026 ZUS PROTOCOL. CATS ARE AMAZING!<br/>
              BUILD_2984-X | NODE_STABLE | UPTIME_99.9%
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#1a5550", fontSize:7, letterSpacing:2 }}>i like cats</span>
            <PixelCat />
          </div>
          <div style={{ display:"flex", gap:24 }}>
            {["X_FEED","DISCORD_SERVER","GITHUB_REPO","PRIVACY_POLICY","NEWSLETTER_SUB"].map(l => (
              <span key={l} style={{ color:MUTED2, cursor:"pointer", transition:"color .2s", letterSpacing:1.5 }}
                onMouseEnter={e => e.target.style.color = CYAN}
                onMouseLeave={e => e.target.style.color = MUTED2}>{l}</span>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}
