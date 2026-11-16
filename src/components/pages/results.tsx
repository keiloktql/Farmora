// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Results.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Harvest and Sale Results";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:20px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.stat{padding:10px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:12px;color:#A9C0B2}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:20px;font-weight:600;margin-top:2px}
.btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;font-size:13px;font-weight:600}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;font-size:12px;font-weight:600;color:#E8F1EA;box-shadow:0 8px 24px #00000066;font-family:var(--font-inter),sans-serif;border:1px solid #2c4a3d;background:#0f261ef0}
.mv{transition:left .5s linear,top .5s linear,width .5s linear,height .5s linear,transform .5s linear,background .4s}
`;

class Logic extends DCLogic {
  state = { p: 40, playing: false };
  componentWillUnmount() { clearInterval(this.iv); }
  stop() { clearInterval(this.iv); this.setState({ playing: false }); }
  renderVals() {
    const { p, playing } = this.state;
    const faces = [], labels = [];
    const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const box = (o) => {
      const z = o.z || 0, c = o.cls || '';
      faces.push({ cls: c, css: `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.d}px;background:${o.top};transform:translateZ(${z + o.h}px);${o.topCss || ''}` });
      if (o.h > 0) {
        faces.push({ cls: c, css: `left:${o.x}px;top:${o.y + o.d}px;width:${o.w}px;height:${o.h}px;background:${o.south || shade(o.top, .75)};transform-origin:0 0;transform:translateZ(${z}px) rotateX(90deg);` });
        faces.push({ cls: c, css: `left:${o.x + o.w}px;top:${o.y}px;width:${o.h}px;height:${o.d}px;background:${o.east || shade(o.top, .55)};transform-origin:0 0;transform:translateZ(${z}px) rotateY(-90deg);` });
      }
    };
    const worker = (x, y, face, shirt) => {
      const k = 1.6, c = 'mv';
      box({ x: x + k, y: y + 2 * k, w: 6 * k, d: 6 * k, h: 14 * k, top: '#26362e', cls: c });
      box({ x: x + 9 * k, y: y + 2 * k, w: 6 * k, d: 6 * k, h: 14 * k, top: '#26362e', cls: c });
      box({ x, y, w: 16 * k, d: 10 * k, z: 14 * k, h: 18 * k, top: shirt, cls: c });
      box({ x: x + 2 * k, y: y - k, w: 12 * k, d: 12 * k, z: 32 * k, h: 12 * k, top: '#D9A47A', cls: c });
      box({ x: x + 1.5 * k, y: y - 1.5 * k, w: 13 * k, d: 13 * k, z: 42 * k, h: 4 * k, top: '#F2E36B', cls: c });
      box({ x: face > 0 ? x + 16 * k : x - 10, y: y + 3 * k, w: 10, d: 5 * k, z: 24 * k, h: 5 * k, top: shirt, cls: c });
    };
    box({ x: 0, y: 0, w: 800, d: 520, z: -18, h: 18, top: '#1a2a1e', south: '#0b140e', east: '#0e1a11',
      topCss: 'background-image:linear-gradient(#DCE96C0d 1px,transparent 1px),linear-gradient(90deg,#DCE96C0d 1px,transparent 1px);background-size:40px 40px;' });
    const farmers = ['Asha D.', 'Kumar R.', 'Lakshmi B.', 'Ravi N.', 'Suresh B.', 'Meena K.'];
    const H = Math.floor(p / 100 * 30);
    for (let i = 0; i < 6; i++) {
      const px = 30 + (i % 3) * 250, py = 40 + Math.floor(i / 3) * 190;
      box({ x: px, y: py, w: 210, d: 150, h: 6, top: i === 5 ? '#2d2a22' : '#3a2f22', south: '#1d1812', east: '#150f0b' });
      let rowsDone = 0;
      if (i < 5) {
        for (let r = 0; r < 6; r++) {
          const g = i * 6 + r;
          const done = g < H, cur = g === H;
          if (done) rowsDone++;
          box({ x: px + 10, y: py + 10 + r * 22, w: 190, d: 14, z: 6, h: done ? 3 : 34, top: done ? '#6b5a3e' : (cur ? '#DCE96C' : '#7BD88F'),
            south: done ? '#4d4030' : (cur ? '#a8b34a' : '#3f9a5c'), east: done ? '#3a3024' : (cur ? '#7a8332' : '#2b7a46'),
            topCss: done ? '' : 'background-image:repeating-linear-gradient(90deg,#ffffff22 0 8px,transparent 8px 16px);' });
        }
      }
      labels.push({ x: px + 105, y: py + 75, z: i === 5 ? 20 : 56, name: farmers[i], sub: i === 5 ? 'fallow' : rowsDone + '/6', dot: i === 5 ? '#7d8d84' : '#6FD08C' });
    }
    // workers
    const g0 = Math.min(29, H), pl = Math.floor(g0 / 6), rw = g0 % 6;
    const wx = 30 + (pl % 3) * 250, wy = 40 + Math.floor(pl / 3) * 190 + 10 + rw * 22;
    if (p < 100) {
      worker(wx - 44, wy - 4, 1, '#E4A04B');
      worker(wx + 214, wy - 4, -1, '#4F9BD9');
    } else {
      worker(40, 470, 1, '#E4A04B'); worker(120, 470, 1, '#4F9BD9');
    }
    // crates
    for (let i = 0; i < H; i++) {
      box({ x: 40 + (i % 12) * 26, y: 420, z: Math.floor(i / 12) * 14, w: 22, d: 22, h: 12, top: '#E4584B', south: '#b8443a', east: '#8f332b' });
    }
    labels.push({ x: 190, y: 420, z: 56, name: 'Crate stack', sub: H + ' crates', dot: '#E4584B' });
    // truck
    const tx = p >= 100 ? 700 : 560;
    box({ x: tx, y: 430, z: 2, w: 90, d: 44, h: 40, top: '#f2f5ee', cls: 'mv' });
    box({ x: tx + 90, y: 430, z: 2, w: 30, d: 44, h: 28, top: '#DCE96C', cls: 'mv' });
    labels.push({ x: tx + 60, y: 450, z: 70, name: p >= 100 ? 'Leaving for collection centre' : 'Pickup truck', sub: '', dot: '#DCE96C' });
    const picked = 22.8 * p / 100, accT = 19.6 * p / 100, downT = picked - accT;
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const a = n[0] === 'Results'; return { name: n[0], href: n[1], bg: a ? '#DCE96C' : 'transparent', fg: a ? '#14382b' : '#B9CDC0', fw: a ? 600 : 500 }; });
    return {
      faces, labels, nav, p, rows: H, picked: picked.toFixed(1),
      revenue: '₹' + Math.round(accT * 1000 * 24).toLocaleString('en-IN'),
      acc: accT.toFixed(1), down: downT.toFixed(1),
      accW: picked > 0 ? (accT / 22.8 * 100).toFixed(1) : 0, downW: (downT / 22.8 * 100).toFixed(1),
      playText: playing ? 'Pause' : (p >= 100 ? 'Replay' : 'Play harvest'),
      onP: (e) => { this.stop(); this.setState({ p: Number(e.target.value) }); },
      reset: () => { this.stop(); this.setState({ p: 0 }); },
      toggle: () => {
        if (playing) { this.stop(); return; }
        if (p >= 100) this.setState({ p: 0 });
        this.setState({ playing: true });
        this.iv = setInterval(() => { const n = this.state.p + 1; if (n >= 100) { this.setState({ p: 100 }); this.stop(); } else this.setState({ p: n }); }, 200);
      }
    };
  }
}

export default function ResultsPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1100px 640px at 50% 56%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2600px","perspectiveOrigin":"50% 40%"}}><div style={{"position":"absolute","left":"720px","top":"500px","width":"800px","height":"520px","marginLeft":"-400px","marginTop":"-260px","transformStyle":"preserve-3d","transform":"scale(.82) rotateX(58deg) rotateZ(38deg)"}}>{v.faces.map((f, $index) => (<Fragment key={$index}><div className={f.cls} style={css(`position:absolute;${f.css}`)} /></Fragment>))}{v.labels.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateZ(-38deg) rotateX(-58deg)`)}><div className="tag"><span style={css(`width:8px;height:8px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span><span style={{"color":"#A9C0B2","fontWeight":"500"}}>{l.sub}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav></header><aside className="panel" style={{"left":"24px","top":"88px","width":"304px","display":"flex","flexDirection":"column","gap":"14px"}}><div><div className="kick">STEP 05 · CLOSE THE LOOP</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>Replay the harvest</div></div><div style={{"display":"flex","gap":"8px"}}><button className="btn" onClick={v.toggle} style={{"flex":"1","background":"#DCE96C","color":"#14382b"}}>{v.playText}</button><button className="btn" onClick={v.reset} style={{"background":"#143026","color":"#E8F1EA"}}>Reset</button></div><div><label htmlFor="day" style={{"fontSize":"13px","fontWeight":"600"}}>Harvest progress · {v.p}%</label><input id="day" type="range" min="0" max="100" step="1" value={v.p} onChange={v.onP} style={{"width":"100%","margin":"10px 0 0","accentColor":"#DCE96C"}} /></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Rows picked</span><b>{v.rows} / 30</b></div><div className="stat"><span>Crates stacked</span><b>{v.rows}</b></div><div className="stat"><span>Picked so far</span><b>{v.picked} t</b></div><div className="stat"><span>Planned supply</span><b>18.2 t</b></div></div><div style={{"display":"flex","flexDirection":"column","gap":"8px","fontSize":"12px","color":"#B9CDC0"}}><span style={{"display":"flex","alignItems":"center","gap":"8px"}}><span style={{"width":"14px","height":"14px","borderRadius":"3px","background":"#6FD08C"}} />Standing tomato rows</span><span style={{"display":"flex","alignItems":"center","gap":"8px"}}><span style={{"width":"14px","height":"14px","borderRadius":"3px","background":"#DCE96C"}} />Row being picked now</span><span style={{"display":"flex","alignItems":"center","gap":"8px"}}><span style={{"width":"14px","height":"14px","borderRadius":"3px","background":"#6b5a3e"}} />Picked · bare soil</span></div></aside><aside className="panel" style={{"left":"1112px","top":"88px","width":"304px","display":"flex","flexDirection":"column","gap":"12px"}}><div className="kick">SEASON RESULT · SAMPLE INPUTS</div><div style={{"display":"flex","alignItems":"baseline","gap":"8px"}}><span className="hd" style={{"fontSize":"40px","fontWeight":"700","lineHeight":"1"}}>{v.revenue}</span></div><div className="note" style={{"marginTop":"-6px"}}>Sale value so far = accepted tonnes × ₹24/kg</div><div><div style={{"display":"flex","height":"14px","borderRadius":"999px","overflow":"hidden","background":"#1c3a2f"}}><div style={css(`width:${v.accW}%;background:#6FD08C`)} /><div style={css(`width:${v.downW}%;background:#F2A65A`)} /></div><div style={{"display":"flex","justifyContent":"space-between","fontSize":"12px","color":"#A9C0B2","marginTop":"6px"}}><span>Accepted {v.acc} t</span><span>Downgraded {v.down} t</span></div></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Actual harvest</span><b>22.8 t</b></div><div className="stat"><span>Accepted grade</span><b>19.6 t</b></div><div className="stat"><span>Realised price</span><b>₹24/kg</b></div><div className="stat"><span>Downgrade reason</span><b style={{"fontSize":"15px","lineHeight":"1.3"}}>Size variation</b></div></div><div style={{"padding":"12px","borderRadius":"12px","background":"#143026","fontSize":"13px","lineHeight":"1.5","color":"#D4E2D9"}}><span className="kick">BUYER FEEDBACK</span><br />“Good colour and firmness; improve size uniformity.”</div><div className="note">Meena Kumari’s plot stays fallow (declined). The replay is an illustration of recorded totals, not field telemetry.</div></aside></div>)} />;
}
