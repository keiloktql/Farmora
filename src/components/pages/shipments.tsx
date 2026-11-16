// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Route.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Shipment Tracking";

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
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:8px;padding:7px 13px;border-radius:999px;font-size:13px;font-weight:600;color:#E8F1EA;box-shadow:0 8px 24px #00000066;font-family:var(--font-inter),sans-serif;background:#0f261ef0}
@keyframes ping{0%{opacity:.6;transform:scale(.6)}100%{opacity:0;transform:scale(2.4)}}
.ping{transform-origin:center;transform-box:fill-box;animation:ping 1.6s ease-out infinite}
`;

class Logic extends DCLogic {
  state = { p: 46, view: 'corr', playing: false };
  componentWillUnmount() { clearInterval(this.iv); }
  stop() { clearInterval(this.iv); this.setState({ playing: false }); }
  renderVals() {
    const { p, view, playing } = this.state;
    const B = view === 'corr' ? { lon0: 74, lon1: 106, lat0: -1, lat1: 21 } : { lon0: 78.6, lon1: 81.0, lat0: 12.3, lat1: 14.0 };
    const W = 1360, H = 880;
    const P = (q) => [(q[0] - B.lon0) / (B.lon1 - B.lon0) * W, (B.lat1 - q[1]) / (B.lat1 - B.lat0) * H];
    const poly = (pts) => 'M' + pts.map((q) => P(q).map((v) => v.toFixed(1)).join(' ')).join(' L') + ' Z';
    const line = (px) => 'M' + px.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L');
    const india = [[72, 23], [72, 21.5], [73, 20], [73.2, 17], [74.4, 15], [75.3, 12.6], [76.3, 10], [77.3, 8.1], [78.3, 8.9], [79.2, 9.6], [79.9, 10.5], [79.8, 11.9], [80.3, 13.1], [80.2, 15.8], [81.8, 16.6], [83.5, 18], [85, 19.5], [87, 21.3], [88.5, 21.7], [90, 22], [91.5, 22.5], [92, 22.5], [92, 23]];
    const lanka = [[79.9, 9.4], [80.6, 9.8], [81.8, 7.6], [81.2, 6.2], [80.2, 5.9], [79.8, 6.9]];
    const seasia = [[92, 23], [92, 21], [93.5, 19.3], [94.4, 16.2], [97.6, 16.6], [97.7, 14.5], [98.5, 12], [98.6, 9.5], [98.3, 8], [99.8, 6.5], [100.3, 5], [100.8, 3.5], [101.8, 2.4], [103.5, 1.35], [104.2, 1.4], [103.6, 3], [103.4, 4.5], [102.5, 6], [101.2, 6.8], [100.3, 7], [100.1, 9], [99.3, 10.5], [100, 13], [102, 12], [103.5, 10.5], [105, 8.7], [106, 9], [106, 23]];
    const sumatra = [[95.3, 5.6], [97.7, 5.1], [100.2, 2.6], [102.3, 1.2], [104, -0.5], [104.5, -1.5], [104.5, -2], [98, -2], [96, 2], [95.2, 4.5]];
    const andaman = [[92.6, 13.6], [93, 13.4], [93.2, 11.8], [92.8, 11.8]];
    const landD = [india, lanka, seasia, sumatra, andaman].map(poly).join(' ');
    const fills = ['#14261d', '#1a3326', '#20402f', '#264d38', '#2c5a43', '#35684f'];
    const layers = fills.map((f, i) => ({ z: i * 4, d: landD, fill: f, stroke: i === 5 ? '#DCE96C55' : '#0a1511' }));
    const roadLL = [[79.10, 13.22], [79.33, 12.93], [79.95, 12.97], [80.30, 13.09]];
    const seaLL = [[80.30, 13.10], [82.5, 11.8], [85, 10.3], [89, 8.4], [92.5, 7.3], [94.8, 6.4], [97.5, 5.9], [98.6, 4.9], [99.9, 3.6], [101.2, 2.6], [102.5, 1.75], [103.7, 1.2]];
    const road = roadLL.map(P), sea = seaLL.map(P);
    const cum = (px) => { const c = [0]; for (let i = 1; i < px.length; i++) c.push(c[i - 1] + Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1])); return c; };
    const upTo = (px, t) => {
      const c = cum(px), tot = c[c.length - 1], target = Math.max(0, Math.min(1, t)) * tot;
      const out = [px[0]];
      for (let i = 1; i < px.length; i++) {
        if (c[i] <= target) out.push(px[i]);
        else { const f = (target - c[i - 1]) / (c[i] - c[i - 1] || 1); out.push([px[i - 1][0] + (px[i][0] - px[i - 1][0]) * f, px[i - 1][1] + (px[i][1] - px[i - 1][1]) * f]); break; }
      }
      return out;
    };
    let done, mk;
    if (p <= 12) { done = upTo(road, p / 12); }
    else if (p <= 18) { done = road.slice(); }
    else { done = road.concat(upTo(sea, (p - 18) / 82)); }
    mk = done[done.length - 1];
    const A = road[0], Bp = road[road.length - 1], Cp = sea[sea.length - 1];
    const inside = (q) => q[0] > 40 && q[0] < W - 40 && q[1] > 40 && q[1] < H - 40;
    const labels = [];
    labels.push({ x: A[0], y: A[1], name: 'Chittoor', sub: 'collection centre', dot: '#6FD08C', border: '#2c4a3d' });
    labels.push({ x: Bp[0], y: Bp[1], name: 'Chennai port', sub: 'hand-off', dot: '#6CC4F0', border: '#2c4a3d' });
    if (inside(Cp)) labels.push({ x: Cp[0], y: Cp[1], name: 'Singapore', sub: 'LionCity Fresh Imports', dot: '#6CC4F0', border: '#2c4a3d' });
    if (inside(mk) && p > 0 && p < 100) labels.push({ x: mk[0], y: mk[1] - 22, name: p < 12 ? 'Reefer truck' : (p < 18 ? 'At port' : 'Vessel'), sub: 'in transit', dot: '#DCE96C', border: '#DCE96C' });
    const defs = [['Collected & packed', 'Chittoor collection centre', 0], ['Road to Chennai', '≈150 km by reefer truck', 4], ['Port hand-off', 'Chennai export port', 12], ['Vessel to Singapore', 'Bay of Bengal, Strait of Malacca', 18], ['Delivered', 'Window 10–20 March 2027', 100]];
    let cur = 0; defs.forEach((d, i) => { if (p >= d[2]) cur = i; });
    const steps = defs.map((d, i) => { const dn = i < cur, now = i === cur; return { name: d[0], note: d[1], mark: dn ? '✓' : String(i + 1), bg: now ? '#1d3f31' : 'transparent', fg: dn || now ? '#E8F1EA' : '#A9C0B2', dotBg: dn ? '#6FD08C' : (now ? '#DCE96C' : '#1c3a2f'), dotFg: dn || now ? '#14382b' : '#A9C0B2' }; });
    const texts = ['Tomatoes are graded and packed at the collection centre.', 'The lot is on the road to Chennai. The pilot records this; it does not dispatch.', 'Containers wait at Chennai for the export hand-off.', 'Sailing across the Bay of Bengal, then through the Strait of Malacca.', 'Delivered to the buyer in Singapore.'];
    const roadKm = 150 * Math.min(1, p / 12), seaKm = p <= 18 ? 0 : 2900 * (p - 18) / 82;
    const tab = (on) => (on ? ['#DCE96C', '#14382b'] : ['transparent', '#B9CDC0']);
    const t1 = tab(view === 'corr'), t2 = tab(view === 'reg');
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const a = n[0] === 'Shipments'; return { name: n[0], href: n[1], bg: a ? '#DCE96C' : 'transparent', fg: a ? '#14382b' : '#B9CDC0', fw: a ? 600 : 500 }; });
    return {
      layers, labels, nav, steps, p,
      roadD: line(road), seaD: line(sea), doneD: line(done),
      cx: mk[0].toFixed(1), cy: mk[1].toFixed(1), aX: A[0].toFixed(1), aY: A[1].toFixed(1), bX: Bp[0].toFixed(1), bY: Bp[1].toFixed(1), cX: Cp[0].toFixed(1), cY: Cp[1].toFixed(1),
      gridX: Math.round(W / (B.lon1 - B.lon0) * (view === 'corr' ? 4 : 0.5)), gridY: Math.round(H / (B.lat1 - B.lat0) * (view === 'corr' ? 4 : 0.5)),
      nowTitle: defs[cur][0], nowText: texts[cur], stageName: defs[cur][0],
      left: Math.max(0, Math.round(3050 - roadKm - seaKm)).toLocaleString('en-IN'),
      playText: playing ? 'Pause' : (p >= 100 ? 'Replay' : 'Play'),
      onP: (e) => { this.stop(); this.setState({ p: Number(e.target.value) }); },
      toggle: () => {
        if (playing) { this.stop(); return; }
        if (p >= 100) this.setState({ p: 0 });
        this.setState({ playing: true });
        this.iv = setInterval(() => { const n = this.state.p + 1; if (n >= 100) { this.setState({ p: 100 }); this.stop(); } else this.setState({ p: n }); }, 160);
      },
      setCorr: () => this.setState({ view: 'corr' }), setReg: () => this.setState({ view: 'reg' }),
      isCorr: view === 'corr', isReg: view === 'reg', corrBg: t1[0], corrFg: t1[1], regBg: t2[0], regFg: t2[1]
    };
  }
}

export default function ShipmentsPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1100px 640px at 55% 58%,#143a3a 0%,#0e2622 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2400px","perspectiveOrigin":"50% 30%"}}><div style={{"position":"absolute","left":"720px","top":"480px","width":"1360px","height":"880px","marginLeft":"-680px","marginTop":"-440px","transformStyle":"preserve-3d","transform":"scale(.78) rotateX(48deg)"}}><div style={css(`position:absolute;left:0;top:0;width:1360px;height:880px;border-radius:8px;background-color:#0f3347;background-image:radial-gradient(900px 500px at 55% 45%,#14506a 0%,#0f3347 70%),linear-gradient(#6CC4F014 1px,transparent 1px),linear-gradient(90deg,#6CC4F014 1px,transparent 1px);background-size:auto,${v.gridY}px ${v.gridY}px,${v.gridX}px ${v.gridX}px;box-shadow:0 0 0 1px #2c6a80`)} />{v.layers.map((l, $index) => (<Fragment key={$index}><svg width="1360" height="880" viewBox="0 0 1360 880" style={css(`position:absolute;left:0;top:0;transform:translateZ(${l.z}px)`)} aria-hidden="true"><path d={l.d} fill={l.fill} stroke={l.stroke} strokeWidth="2" strokeLinejoin="round" /></svg></Fragment>))}<svg width="1360" height="880" viewBox="0 0 1360 880" style={{"position":"absolute","left":"0","top":"0","transform":"translateZ(26px)"}} role="img" aria-label="Route from Chittoor to Chennai port to Singapore"><path d={v.roadD} fill="none" stroke="#ffffff55" strokeWidth="4" strokeDasharray="3 9" strokeLinecap="round" /><path d={v.seaD} fill="none" stroke="#6CC4F0aa" strokeWidth="4" strokeDasharray="3 9" strokeLinecap="round" /><path d={v.doneD} fill="none" stroke="#DCE96C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{"filter":"drop-shadow(0 0 8px #DCE96C)"}} /><circle cx={v.cx} cy={v.cy} r="14" fill="#DCE96C" className="ping" /><circle cx={v.cx} cy={v.cy} r="9" fill="#DCE96C" stroke="#0b1b16" strokeWidth="3" /><circle cx={v.aX} cy={v.aY} r="7" fill="#6FD08C" stroke="#0b1b16" strokeWidth="3" /><circle cx={v.bX} cy={v.bY} r="7" fill="#6CC4F0" stroke="#0b1b16" strokeWidth="3" /><circle cx={v.cX} cy={v.cY} r="7" fill="#6CC4F0" stroke="#0b1b16" strokeWidth="3" /></svg>{v.labels.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(34px) rotateX(-48deg)`)}><div className="tag" style={css(`border:1px solid ${l.border}`)}><span style={css(`width:10px;height:10px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span><span style={{"color":"#A9C0B2","fontWeight":"500"}}>{l.sub}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav></header><aside className="panel" style={{"left":"24px","top":"88px","width":"304px"}}><div className="kick">SAMPLE LOT · TOMATO</div><div className="hd" style={{"fontSize":"22px","margin":"6px 0 14px","lineHeight":"1.2"}}>Farm gate to Singapore</div><ol style={{"listStyle":"none","margin":"0","padding":"0","display":"flex","flexDirection":"column","gap":"6px"}}>{v.steps.map((s, $index) => (<Fragment key={$index}><li style={css(`display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:12px;background:${s.bg}`)}><span style={css(`width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:${s.dotBg};color:${s.dotFg}`)}>{s.mark}</span><span style={{"flex":"1"}}><span style={css(`display:block;font-size:14px;font-weight:600;color:${s.fg}`)}>{s.name}</span><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>{s.note}</span></span></li></Fragment>))}</ol></aside><aside className="panel" style={{"left":"1112px","top":"88px","width":"304px","display":"flex","flexDirection":"column","gap":"12px"}}><div className="kick">NOW</div><div className="hd" style={{"fontSize":"24px","lineHeight":"1.15"}}>{v.nowTitle}</div><div className="note" style={{"fontSize":"13px"}}>{v.nowText}</div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Lot volume</span><b>18.2 t</b></div><div className="stat"><span>Journey</span><b>{v.p}%</b></div><div className="stat"><span>Distance left</span><b>≈{v.left} km</b></div><div className="stat"><span>Sea leg</span><b>≈5 days</b></div></div><div className="note">Stylised map, not live positions. Distances and timings are rounded illustrations. Real dispatch and logistics are outside the current pilot.</div></aside><section className="panel" style={{"left":"258px","top":"791px","width":"840px","padding":"14px 20px","display":"flex","alignItems":"center","gap":"18px","position":"absolute"}}><button className="btn" onClick={v.toggle} style={{"minWidth":"104px","background":"#DCE96C","color":"#14382b"}}>{v.playText}</button><div style={{"flex":"1"}}><label htmlFor="prog" style={{"fontSize":"13px","fontWeight":"600"}}>Simulate the shipment · {v.stageName}</label><input id="prog" type="range" min="0" max="100" step="1" value={v.p} onChange={v.onP} style={{"width":"100%","margin":"8px 0 0","accentColor":"#DCE96C"}} /></div><div role="group" aria-label="Map view" style={{"display":"flex","gap":"4px","padding":"4px","borderRadius":"999px","background":"#12281f","border":"1px solid #2c4a3d"}}><button onClick={v.setCorr} aria-pressed={v.isCorr} style={css(`border:0;min-height:36px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;background:${v.corrBg};color:${v.corrFg}`)}>Corridor</button><button onClick={v.setReg} aria-pressed={v.isReg} style={css(`border:0;min-height:36px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;background:${v.regBg};color:${v.regFg}`)}>Road leg</button></div></section></div>)} />;
}
