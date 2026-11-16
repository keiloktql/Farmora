// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Allocation.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Crop Allocation";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none}
button:focus-visible,a:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:20px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.stat{padding:10px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:12px;color:#A9C0B2}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:20px;font-weight:600;margin-top:2px}
.btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;font-size:13px;font-weight:600}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;color:#E8F1EA;box-shadow:0 6px 16px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.lyr{position:absolute;overflow:visible;pointer-events:none;transition:transform .3s ease}
@keyframes glow{0%,100%{opacity:.8}50%{opacity:1}}
.glow{animation:glow 2.2s ease-in-out infinite}
`;

class Logic extends DCLogic {
  state = { crop: 'Mango', sel: 'AP', alloc: { Mango: ['AP', 'MH'], Tomato: ['AP', 'KA'], Banana: ['TN'], Groundnut: ['GJ'], Chilli: ['TG'], Rice: ['WB'] } };
  geo() {
    if (this._g) return this._g;
    const W = 540, H = 610;
    const pr = (p) => [(p[0] - 68) / 30 * W, (37.5 - p[1]) / 31.5 * H];
    const OUT = [[68.2, 23.7], [69.0, 22.6], [69.7, 21.7], [70.4, 20.9], [71.0, 20.7], [72.0, 21.1], [72.2, 21.8], [72.7, 21.2], [72.9, 20.4], [72.8, 19.1], [73.0, 17.9], [73.3, 16.9], [73.8, 15.5], [74.2, 14.6], [74.8, 13.0], [75.4, 12.0], [75.9, 11.2], [76.4, 9.9], [76.9, 8.5], [77.5, 8.1], [78.2, 8.7], [78.9, 9.2], [79.3, 9.3], [79.85, 10.6], [79.9, 11.9], [80.3, 13.1], [80.1, 14.4], [80.3, 15.5], [81.1, 16.0], [82.3, 16.9], [83.3, 17.7], [84.5, 18.9], [85.8, 19.8], [86.9, 20.8], [87.2, 21.5], [88.0, 21.6], [88.9, 21.9], [89.0, 22.5], [88.9, 23.4], [88.3, 24.4], [88.5, 25.3], [88.3, 26.3], [89.0, 26.2], [89.8, 25.9], [90.6, 25.2], [91.9, 25.2], [92.4, 24.2], [92.2, 23.0], [92.7, 22.3], [93.2, 22.7], [93.5, 23.9], [94.3, 24.0], [94.7, 25.1], [95.2, 26.0], [95.9, 26.8], [96.6, 27.3], [97.2, 27.9], [97.4, 28.3], [96.6, 28.7], [96.0, 29.4], [95.0, 29.3], [94.1, 29.3], [93.1, 28.6], [92.1, 28.2], [91.6, 27.8], [91.8, 26.85], [90.5, 26.8], [89.0, 26.75], [88.9, 27.3], [88.1, 27.9], [88.0, 27.2], [87.3, 26.4], [86.0, 26.6], [84.8, 27.0], [83.6, 27.4], [82.6, 27.8], [81.9, 28.3], [81.0, 28.8], [80.2, 28.9], [80.5, 29.7], [80.3, 30.4], [81.0, 30.2], [79.9, 30.9], [79.0, 31.1], [78.8, 31.8], [78.7, 32.6], [79.3, 32.9], [79.6, 33.5], [79.4, 34.4], [78.5, 35.4], [77.6, 35.5], [76.5, 35.9], [75.5, 36.7], [74.6, 37.0], [73.8, 36.6], [73.0, 35.5], [74.1, 34.6], [74.0, 33.6], [74.3, 32.9], [74.6, 32.3], [74.6, 31.8], [74.6, 31.0], [74.2, 30.4], [73.5, 29.9], [72.8, 29.0], [71.9, 28.0], [70.9, 27.6], [70.2, 26.7], [70.0, 25.4], [70.2, 24.5], [69.6, 24.2], [68.9, 24.3]];
    const ST = { JK: ['Jammu & Kashmir', 75.5, 34.2, 12], HP: ['Himachal Pradesh', 77.3, 31.9, .64], PB: ['Punjab', 75.4, 30.9, 1], UK: ['Uttarakhand', 79.2, 30.1, 1], HR: ['Haryana', 76.1, 29.2, .64], RJ: ['Rajasthan', 73.8, 26.6, 16], UP: ['Uttar Pradesh', 80.9, 26.8, 11], BR: ['Bihar', 85.6, 25.7, 2.5], SK: ['Sikkim', 88.5, 27.6, .1], AR: ['Arunachal Pradesh', 94.5, 28.0, 2.2], NL: ['Nagaland', 94.4, 26.1, .1], MN: ['Manipur', 93.9, 24.7, .25], MZ: ['Mizoram', 92.8, 23.3, .25], TR: ['Tripura', 91.7, 23.7, .16], ML: ['Meghalaya', 91.3, 25.5, .36], AS: ['Assam', 92.8, 26.4, 2.2], WB: ['West Bengal', 87.9, 23.6, 3.2], JH: ['Jharkhand', 85.4, 23.7, 1.7], OD: ['Odisha', 84.4, 20.5, 5.8], CG: ['Chhattisgarh', 82.0, 21.3, 4], MP: ['Madhya Pradesh', 78.2, 23.5, 13.7], GJ: ['Gujarat', 71.5, 22.4, 10], MH: ['Maharashtra', 75.8, 19.4, 13], TG: ['Telangana', 79.1, 17.9, 3.6], AP: ['Andhra Pradesh', 79.6, 15.6, 6.8], KA: ['Karnataka', 76.3, 14.9, 6.2], GA: ['Goa', 74.0, 15.3, .1], TN: ['Tamil Nadu', 78.3, 10.9, 4.4], KL: ['Kerala', 76.4, 10.3, .8] };
    const clip = (poly, a, b, c) => {
      const out = [];
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i], q = poly[(i + 1) % poly.length], fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c;
        if (fp <= 0) out.push(p);
        if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
      }
      return out;
    };
    const keys = Object.keys(ST);
    this._g = keys.map((a) => {
      const [name, xi, yi, wi] = ST[a];
      let poly = OUT.slice();
      for (const b of keys) {
        if (b === a) continue;
        const [, xj, yj, wj] = ST[b];
        poly = clip(poly, xj - xi, yj - yi, ((xj * xj + yj * yj) - (xi * xi + yi * yi) + wi - wj) / 2);
        if (poly.length < 3) break;
      }
      const px = poly.map(pr);
      const xs = px.map((p) => p[0]), ys = px.map((p) => p[1]);
      const minx = Math.min(...xs), miny = Math.min(...ys), maxx = Math.max(...xs), maxy = Math.max(...ys);
      let A = 0, cx = 0, cy = 0;
      for (let i = 0; i < px.length; i++) { const p = px[i], q = px[(i + 1) % px.length], f = p[0] * q[1] - q[0] * p[1]; A += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f; }
      A /= 2; if (Math.abs(A) > 1) { cx /= 6 * A; cy /= 6 * A; } else { cx = (minx + maxx) / 2; cy = (miny + maxy) / 2; }
      const d = 'M' + px.map((p) => (p[0] - minx).toFixed(1) + ' ' + (p[1] - miny).toFixed(1)).join('L') + 'Z';
      return { a, name, d, x: minx, y: miny, w: Math.max(2, maxx - minx), h: Math.max(2, maxy - miny), cx, cy };
    });
    return this._g;
  }
  renderVals() {
    const { crop, sel, alloc } = this.state;
    const G = this.geo();
    const defs = {
      Mango: { color: '#F5B83D', yld: 3, demand: 12000, suit: ['AP', 'KA', 'TN', 'MH', 'UP', 'BR', 'GJ', 'TG', 'OD', 'WB', 'KL'] },
      Tomato: { color: '#E4584B', yld: 8, demand: 32000, suit: ['AP', 'KA', 'TN', 'TG', 'MH', 'MP', 'WB', 'HP', 'OD'] },
      Banana: { color: '#B6E36B', yld: 12, demand: 48000, suit: ['TN', 'MH', 'KA', 'AP', 'GJ', 'KL', 'AS', 'BR'] },
      Groundnut: { color: '#D49A66', yld: 0.9, demand: 3600, suit: ['GJ', 'RJ', 'AP', 'KA', 'TN', 'MH', 'MP'] },
      Chilli: { color: '#C95FB0', yld: 1.2, demand: 4800, suit: ['AP', 'TG', 'KA', 'MH', 'MP', 'OD', 'WB'] },
      Rice: { color: '#6CC4F0', yld: 2.5, demand: 10000, suit: ['AP', 'TN', 'WB', 'UP', 'PB', 'OD', 'BR', 'AS', 'CG', 'KA'] }
    };
    const C = defs[crop];
    const shade = (hex, m) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * m)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const mix = (hex, a) => { const n = parseInt(hex.slice(1), 16); const bg = [26, 47, 38]; const c = [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v * a + bg[i] * (1 - a))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const states = [], plants = [], tags = [];
    const isAl = (a, cr) => (alloc[cr] || []).includes(a);
    G.forEach((g) => {
      const suit = C.suit.includes(g.a), on = isAl(g.a, crop), isSel = sel === g.a;
      const lift = on ? 30 : (suit ? 14 : 5);
      const top = on ? C.color : (suit ? mix(C.color, .4) : '#1a2f26');
      states.push({ d: g.d, x: g.x, y: g.y, w: g.w, h: g.h, zMid: lift / 2, zTop: lift, fBase: shade(on ? C.color : '#2f5a43', .35), fMid: shade(on ? C.color : '#2f5a43', .55), fTop: top,
        stroke: isSel ? '#DCE96C' : (suit && !on ? C.color : '#0a1511'), sw: isSel ? 3 : (suit && !on ? 1.6 : 1.2), dash: suit && !on && !isSel ? '5 4' : '0', cls: on ? 'glow' : '', glow: on ? `drop-shadow(0 0 14px ${C.color})` : 'none',
        pick: () => this.setState({ sel: g.a }) });
      if (on) {
        [[-14, -6], [2, 4], [-4, 14]].forEach((o) => {
          const x = g.cx + o[0], y = g.cy + o[1], h = 18;
          plants.push({ css: `left:${x}px;top:${y}px;width:10px;height:10px;background:#ffffffcc;transform:translateZ(${lift + h}px);pointer-events:none;` });
          plants.push({ css: `left:${x}px;top:${y + 10}px;width:10px;height:${h}px;background:#ffffff88;transform-origin:0 0;transform:translateZ(${lift}px) rotateX(90deg);pointer-events:none;` });
        });
      }
      if (suit || on || isSel) tags.push({ x: g.cx, y: g.cy, z: lift + (on ? 34 : 6), name: g.a, dot: on ? C.color : (suit ? C.color : '#7d8d84'), border: isSel ? '#DCE96C' : '#2c4a3d', bg: '#0f261ee6', op: 1 });
    });
    const acres = (cr) => (alloc[cr] || []).length * 2000;
    const tons = acres(crop) * C.yld;
    const A = G.find((g) => g.a === sel);
    const selSuit = C.suit.includes(sel), selOn = isAl(sel, crop);
    const toggle = () => {
      if (!selSuit && !selOn) return;
      const cur = alloc[crop] || [];
      this.setState({ alloc: { ...alloc, [crop]: selOn ? cur.filter((x) => x !== sel) : [...cur, sel] } });
    };
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const on = n[0] === 'Allocation'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    return {
      states, plants, tags, nav,
      crops: Object.keys(defs).map((k) => ({ name: k, color: defs[k].color, states: (alloc[k] || []).length, on: k === crop, bg: k === crop ? '#1d3f31' : '#143026', border: k === crop ? defs[k].color : '#2c4a3d', pick: () => this.setState({ crop: k }) })),
      tons: tons.toLocaleString('en-IN'), cropName: crop, cropColor: C.color, cover: Math.min(100, tons / C.demand * 100).toFixed(0),
      coverText: 'Covers ' + Math.min(100, tons / C.demand * 100).toFixed(0) + '% of a sample ' + C.demand.toLocaleString('en-IN') + ' t demand at ' + C.yld + ' t/acre.',
      selName: A.name,
      chipText: selOn ? 'Allocated to ' + crop : (selSuit ? 'Suited for ' + crop : 'Not suited for ' + crop),
      chipBg: selOn ? C.color : (selSuit ? '#4a4a1e' : '#3a4841'), chipFg: selOn ? '#14231a' : (selSuit ? '#F3F0A8' : '#C9D6CE'),
      selTons: (selSuit || selOn ? 2000 * C.yld : 0).toLocaleString('en-IN'),
      toggle, cantToggle: !selSuit && !selOn, btnText: selOn ? 'Remove from ' + crop : 'Allocate ' + crop + ' here',
      btnBg: selOn ? '#143026' : '#DCE96C', btnFg: selOn ? '#E8F1EA' : '#14382b', btnOp: (!selSuit && !selOn) ? 0.45 : 1,
      summary: Object.keys(defs).map((k) => ({ name: k, color: defs[k].color, text: (alloc[k] || []).length + ' states · ' + acres(k).toLocaleString('en-IN') + ' ac' }))
    };
  }
}

export default function AllocationPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1000px 620px at 50% 52%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2200px","perspectiveOrigin":"50% 30%"}}><div style={{"position":"absolute","left":"720px","top":"500px","width":"540px","height":"610px","marginLeft":"-270px","marginTop":"-305px","transformStyle":"preserve-3d","transform":"scale(1.08) rotateX(48deg)"}}>{v.states.map((s, $index) => (<Fragment key={$index}><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(0px)`)}><path d={s.d} fill={s.fBase} stroke="#0a1511" strokeWidth="1.2" strokeLinejoin="round" style={{"pointerEvents":"all","cursor":"pointer"}} onClick={s.pick} /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zMid}px)`)} aria-hidden="true"><path d={s.d} fill={s.fMid} stroke="#0a1511" strokeWidth="1" strokeLinejoin="round" /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zTop}px)`)} aria-hidden="true"><path className={s.cls} d={s.d} fill={s.fTop} stroke={s.stroke} strokeWidth={s.sw} strokeDasharray={s.dash} strokeLinejoin="round" style={css(`filter:${s.glow}`)} /></svg></Fragment>))}{v.plants.map((f, $index) => (<Fragment key={$index}><div style={css(`position:absolute;${f.css}`)} /></Fragment>))}{v.tags.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-48deg);pointer-events:none`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg};opacity:${l.op}`)}><span style={css(`width:8px;height:8px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav></header><aside className="panel" style={{"left":"24px","top":"88px","width":"304px","display":"flex","flexDirection":"column","gap":"14px"}}><div><div className="kick">CROP ALLOCATION</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>Pick a crop, then paint states</div></div><div role="group" aria-label="Crop" style={{"display":"flex","flexDirection":"column","gap":"6px"}}>{v.crops.map((c, $index) => (<Fragment key={$index}><button onClick={c.pick} aria-pressed={c.on} style={css(`display:flex;align-items:center;gap:10px;min-height:44px;padding:0 12px;border-radius:12px;border:1px solid ${c.border};background:${c.bg};color:#E8F1EA;font-size:14px;font-weight:600;text-align:left`)}><span style={css(`width:14px;height:14px;border-radius:4px;background:${c.color}`)} /><span style={{"flex":"1"}}>{c.name}</span><span style={{"fontSize":"12px","color":"#A9C0B2","fontWeight":"500"}}>{c.states} states</span></button></Fragment>))}</div><div style={{"borderTop":"1px solid #2c4a3d","paddingTop":"12px"}}><div style={{"display":"flex","alignItems":"baseline","gap":"8px"}}><span className="hd" style={{"fontSize":"32px","fontWeight":"700"}}>{v.tons}</span><span style={{"fontSize":"13px","color":"#A9C0B2"}}>t expected · {v.cropName}</span></div><div style={{"height":"10px","borderRadius":"999px","background":"#1c3a2f","marginTop":"10px","overflow":"hidden"}}><div style={css(`height:100%;width:${v.cover}%;background:${v.cropColor}`)} /></div><div className="note" style={{"marginTop":"6px"}}>{v.coverText}</div></div></aside><aside className="panel" style={{"left":"1112px","top":"88px","width":"304px","display":"flex","flexDirection":"column","gap":"14px"}}><div className="kick">STATE</div><div className="hd" style={{"fontSize":"26px","lineHeight":"1.1"}}>{v.selName}</div><span style={css(`align-self:flex-start;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600;background:${v.chipBg};color:${v.chipFg}`)}>{v.chipText}</span><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Block size</span><b>2,000 ac</b></div><div className="stat"><span>Expected</span><b>{v.selTons} t</b></div></div><button className="btn" onClick={v.toggle} disabled={v.cantToggle} style={css(`background:${v.btnBg};color:${v.btnFg};opacity:${v.btnOp}`)}>{v.btnText}</button><div className="note">Suitability and yields are illustrative sample values, and state borders are approximate. Local agronomy review is needed before a real allocation.</div><div style={{"borderTop":"1px solid #2c4a3d","paddingTop":"12px","display":"flex","flexDirection":"column","gap":"6px"}}><div className="kick">ALL CROPS</div>{v.summary.map((s, $index) => (<Fragment key={$index}><div style={{"display":"flex","alignItems":"center","gap":"8px","fontSize":"13px"}}><span style={css(`width:10px;height:10px;border-radius:3px;background:${s.color}`)} /><span style={{"flex":"1"}}>{s.name}</span><span style={{"color":"#A9C0B2"}}>{s.text}</span></div></Fragment>))}</div></aside></div>)} />;
}
