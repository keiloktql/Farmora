// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Main.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Overview";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:18px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.stat{padding:10px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:12px;color:#A9C0B2}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:20px;font-weight:600;margin-top:2px}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:6px;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:600;color:#E8F1EA;box-shadow:0 6px 16px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.lyr{position:absolute;overflow:visible;pointer-events:none;transition:transform .25s ease}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes drop{to{background-position:0 28px}}
@keyframes bob{0%,100%{margin-top:0}50%{margin-top:-5px}}
@keyframes flash{0%,88%,100%{filter:brightness(1)}91%,95%{filter:brightness(2.4)}}
@keyframes drift{to{transform:translateX(24px)}}
@keyframes riskpulse{50%{stroke-opacity:.3}}
.risk{animation:riskpulse 1.4s ease-in-out infinite}
.wx{position:absolute;width:120px;height:110px;pointer-events:none}
.wx::before,.wx::after{content:'';position:absolute}
.wx-sun::before{left:30px;top:22px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,#FFF2A8 0 38%,#FFC24A 39% 100%);box-shadow:0 0 44px #FFC24Acc}
.wx-sun::after{left:8px;top:0;width:104px;height:104px;border-radius:50%;background:repeating-conic-gradient(#FFC24Acc 0 7deg,transparent 7deg 30deg);-webkit-mask:radial-gradient(circle,transparent 52%,#000 54%);mask:radial-gradient(circle,transparent 52%,#000 54%);animation:spin 9s linear infinite}
.wx-rain::before,.wx-storm::before{left:8px;top:4px;width:104px;height:42px;border-radius:30px;background:#c9d9e6;box-shadow:inset 0 -8px 14px #9fb4c4}
.wx-storm::before{background:#6c7893;box-shadow:inset 0 -8px 14px #4a5470;animation:flash 3s linear infinite}
.wx-rain::after,.wx-storm::after{left:18px;top:46px;width:84px;height:64px;background-image:repeating-linear-gradient(108deg,#8fd0f5 0 2px,transparent 2px 11px);animation:drop .45s linear infinite;-webkit-mask-image:linear-gradient(#000,transparent);mask-image:linear-gradient(#000,transparent)}
.wx-cloud::before{left:8px;top:28px;width:104px;height:44px;border-radius:30px;background:#dbe6ee;box-shadow:inset 0 -8px 14px #a9bccb;animation:bob 3.5s ease-in-out infinite}
.wx-cloud::after{left:42px;top:12px;width:48px;height:36px;border-radius:50%;background:#e8f0f6;animation:bob 3.5s ease-in-out infinite}
.wx-fog::before{left:0;top:26px;width:120px;height:60px;background:repeating-linear-gradient(#ffffff55 0 9px,transparent 9px 21px);border-radius:12px;animation:drift 3s ease-in-out infinite alternate}
`;

class Logic extends DCLogic {
  state = { hov: null, sel: 'TN', prof: false };
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
    const { hov, sel, prof } = this.state;
    const G = this.geo();
    // abbr: weather, temp, stage, note
    const D = {
      JK: ['cloud', 8, 'Fallow', 'Winter rest, apple storage'], PB: ['fog', 11, 'Sowing', 'Wheat sowing'], HP: ['cloud', 9, 'Growing', 'Winter vegetables'], HR: ['fog', 12, 'Sowing', 'Wheat and mustard sowing'],
      UK: ['cloud', 12, 'Sowing', 'Wheat sowing'], RJ: ['sun', 22, 'Sowing', 'Mustard and gram sowing'], UP: ['fog', 15, 'Sowing', 'Wheat sowing, cane harvest'], BR: ['fog', 17, 'Harvest', 'Late paddy harvest'],
      SK: ['cloud', 10, 'Harvest', 'Cardamom harvest'], AR: ['cloud', 14, 'Harvest', 'Millet harvest'], GJ: ['sun', 27, 'Sowing', 'Cumin and wheat sowing'], MP: ['sun', 25, 'Sowing', 'Wheat and gram sowing'],
      CG: ['sun', 26, 'Harvest', 'Paddy harvest'], JH: ['sun', 24, 'Harvest', 'Paddy harvest'], WB: ['cloud', 24, 'Harvest', 'Aman paddy harvest'], AS: ['rain', 24, 'Harvest', 'Sali paddy harvest'],
      NL: ['cloud', 18, 'Harvest', 'Paddy harvest'], MH: ['sun', 29, 'Sowing', 'Rabi jowar and gram sowing'], TG: ['sun', 28, 'Harvest', 'Cotton picking'], AP: ['cloud', 28, 'Growing', 'Tomato and chilli growing'],
      OD: ['cloud', 27, 'Harvest', 'Kharif paddy harvest'], ML: ['rain', 20, 'Harvest', 'Potato and paddy'], MN: ['sun', 22, 'Harvest', 'Paddy harvest'], GA: ['sun', 31, 'Harvest', 'Paddy harvest'],
      KA: ['cloud', 27, 'Growing', 'Ragi and vegetables growing'], TN: ['rain', 27, 'Sowing', 'Samba paddy and vegetable sowing'], TR: ['cloud', 25, 'Harvest', 'Paddy harvest'], MZ: ['cloud', 21, 'Harvest', 'Paddy harvest'], KL: ['rain', 28, 'Growing', 'Spices and banana growing']
    };
    const risks = {
      TN: { kind: 'Cyclone', pct: 90, eta: 'in 14 days', impact: 'Could disrupt Chennai port and the Chittoor to Chennai road leg for the LionCity shipment window.' },
      OD: { kind: 'Cyclone', pct: 40, eta: 'in 20 days', impact: 'Could delay paddy harvest and Paradip port loading.' },
      PB: { kind: 'Dense fog and cold wave', pct: 65, eta: 'in 6 days', impact: 'Slower trucking on highways; wheat germination watch.' },
      AS: { kind: 'Flood', pct: 55, eta: 'in 9 days', impact: 'Possible harvest losses and road closures.' },
      AP: { kind: 'Heavy rain', pct: 50, eta: 'in 10 days', impact: 'Could affect Chittoor tomato picking and drying.' }
    };
    const wxLabel = { sun: 'Sunny', rain: 'Rainy', storm: 'Stormy', cloud: 'Cloudy', fog: 'Foggy' };
    const wxTop = { sun: '#7a6320', rain: '#1f4a6b', storm: '#3b3f66', cloud: '#33505a', fog: '#4a5a58' };
    const wxChip = { sun: '#8a6e1d', rain: '#1f5c85', storm: '#4b4f84', cloud: '#3d6070', fog: '#586c69' };
    const stageC = { Sowing: '#DCE96C', Growing: '#6FD08C', Harvest: '#F5B83D', Fallow: '#7d8d84' };
    const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const active = hov || sel;
    const states = [], tags = [];
    G.forEach((g) => {
      const [w, , st] = D[g.a];
      const lift = g.a === active ? 22 : 10;
      const top = wxTop[w], risk = risks[g.a];
      states.push({ d: g.d, x: g.x, y: g.y, w: g.w, h: g.h, zMid: lift / 2, zTop: lift, fBase: shade(top, .45), fMid: shade(top, .6), fTop: top,
        stroke: sel === g.a ? '#DCE96C' : (risk ? '#D9604C' : '#0a1511'), sw: (sel === g.a || risk) ? 3 : 1.2, cls: risk && sel !== g.a ? 'risk' : '',
        enter: () => this.setState({ hov: g.a }), leave: () => this.setState({ hov: null }), pick: () => this.setState({ sel: g.a }) });
      if (g.w > 14 || g.h > 14) tags.push({ x: g.cx, y: g.cy, z: lift + 4, name: g.a, dot: stageC[st], border: risk ? '#D9604C' : '#2c4a3d', bg: '#0f261ee6' });
    });
    const A = G.find((g) => g.a === active), AD = D[active];
    const fx = [{ x: A.cx, y: A.cy, z: 60, cls: 'wx-' + AD[0] }];
    const rk = risks[active];
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const on = n[0] === 'Overview'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const bars = [['Jun', 3.2], ['Jul', 4.8], ['Aug', 6.1], ['Sep', 5.4], ['Oct', 8.3], ['Nov', 10.8]].map((b, i) => ({ m: b[0], v: b[1], h: Math.round(b[1] / 10.8 * 120), bg: i === 5 ? 'linear-gradient(#DCE96C,#6FD08C)' : '#3f9a5c' }));
    return {
      states, tags, fx, nav, bars,
      deals: [
        { ex: 'LionCity Fresh Imports', crop: 'Tomato · 18 t · Singapore', value: '₹4.3 L', due: '10–20 Mar 2027', prog: 62, stage: 'Plots growing' },
        { ex: 'Spice Route Exporters', crop: 'Chilli · 12 t · sample', value: '₹11.4 L', due: '5 Apr 2027', prog: 35, stage: 'Farmers being matched' },
        { ex: 'Coastal Retail Co.', crop: 'Groundnut · 20 t · sample', value: '₹12.0 L', due: '28 Feb 2027', prog: 80, stage: 'Harvest in progress' }
      ],
      deliveries: [
        { days: 104, what: 'Groundnut 20 t · Coastal Retail', when: '28 Feb 2027 · Anantapur' },
        { days: 114, what: 'Tomato 18 t · LionCity Fresh Imports', when: '10–20 Mar 2027 · Chittoor' },
        { days: 140, what: 'Chilli 12 t · Spice Route Exporters', when: '5 Apr 2027 · Kurnool' }
      ],
      stName: A.name, stTemp: AD[1], stStage: AD[2], stNote: AD[3], stageColor: stageC[AD[2]], wxLabel: wxLabel[AD[0]], wxBg: wxChip[AD[0]],
      hasRisk: !!rk, noRisk: !rk, riskKind: rk ? rk.kind : '', riskPct: rk ? rk.pct : '', riskEta: rk ? rk.eta : '', riskImpact: rk ? rk.impact : '',
      profOpen: prof, toggleProf: () => this.setState({ prof: !prof })
    };
  }
}

export default function OverviewPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1000px 620px at 50% 52%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2200px","perspectiveOrigin":"50% 30%"}}><div style={{"position":"absolute","left":"720px","top":"492px","width":"540px","height":"610px","marginLeft":"-270px","marginTop":"-305px","transformStyle":"preserve-3d","transform":"scale(1.02) rotateX(48deg)"}}>{v.states.map((s, $index) => (<Fragment key={$index}><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(0px)`)}><path d={s.d} fill={s.fBase} stroke="#0a1511" strokeWidth="1.2" strokeLinejoin="round" style={{"pointerEvents":"all","cursor":"pointer"}} onMouseEnter={s.enter} onMouseLeave={s.leave} onClick={s.pick} /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zMid}px)`)} aria-hidden="true"><path d={s.d} fill={s.fMid} stroke="#0a1511" strokeWidth="1" strokeLinejoin="round" /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zTop}px)`)} aria-hidden="true"><path className={s.cls} d={s.d} fill={s.fTop} stroke={s.stroke} strokeWidth={s.sw} strokeLinejoin="round" /></svg></Fragment>))}{v.tags.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-48deg);pointer-events:none`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg}`)}><span style={css(`width:7px;height:7px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div></Fragment>))}{v.fx.map((w, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${w.x}px;top:${w.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${w.z}px) rotateX(-48deg);pointer-events:none`)}><div className={`wx ${w.cls}`} style={{"left":"-60px","top":"-110px"}} /></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav><button onClick={v.toggleProf} aria-expanded={v.profOpen} style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"10px","minHeight":"44px","padding":"0 12px 0 6px","borderRadius":"999px","border":"1px solid #2c4a3d","background":"#12281f99","color":"#E8F1EA","fontSize":"13px"}}><span style={{"width":"32px","height":"32px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700","fontSize":"12px"}}>CF</span><span style={{"textAlign":"left"}}><b style={{"display":"block","fontWeight":"600"}}>Chittoor Farmers FPO</b><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>Andhra Pradesh</span></span></button></header>{v.profOpen && (<><div style={{"position":"absolute","right":"24px","top":"70px","width":"300px","boxSizing":"border-box","padding":"18px","borderRadius":"20px","background":"#0f261ef5","border":"1px solid #3d6b55","zIndex":"6","display":"flex","flexDirection":"column","gap":"10px"}}><div style={{"display":"flex","alignItems":"center","gap":"12px"}}><span style={{"width":"52px","height":"52px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700"}}>CF</span><div><div className="hd" style={{"fontSize":"18px"}}>Chittoor Farmers FPO</div><div className="note">Your FPO profile · sample</div></div></div><div style={{"display":"grid","gridTemplateColumns":"repeat(3,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Members</span><b>42</b></div><div className="stat"><span>Since</span><b>2019</b></div><div className="stat"><span>Trust</span><b>4.6</b></div></div></div></>)}<aside className="panel" style={{"left":"24px","top":"84px","width":"360px","height":"792px","display":"flex","flexDirection":"column","gap":"12px"}}><div className="kick">OVERVIEW · RABI 2026–27</div><div style={{"display":"grid","gridTemplateColumns":"repeat(3,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Active deals</span><b>3</b></div><div className="stat"><span>Long-term</span><b>4</b></div><div className="stat"><span>Revenue YTD</span><b>₹38.6 L</b></div></div><div className="hd" style={{"fontSize":"16px","marginTop":"4px"}}>Ongoing deals with exporters</div><div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>{v.deals.map((d, $index) => (<Fragment key={$index}><div style={{"padding":"12px","borderRadius":"14px","background":"#143026"}}><div style={{"display":"flex","justifyContent":"space-between","gap":"8px","fontSize":"14px","fontWeight":"600"}}><span>{d.ex}</span><span>{d.value}</span></div><div style={{"fontSize":"12px","color":"#A9C0B2","marginTop":"2px"}}>{d.crop} · due {d.due}</div><div style={{"height":"8px","borderRadius":"999px","background":"#1c3a2f","marginTop":"10px","overflow":"hidden"}}><div style={css(`height:100%;width:${d.prog}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div><div style={{"display":"flex","justifyContent":"space-between","fontSize":"12px","color":"#A9C0B2","marginTop":"6px"}}><span>{d.stage}</span><span>{d.prog}%</span></div></div></Fragment>))}</div><div className="hd" style={{"fontSize":"16px","marginTop":"4px"}}>Upcoming deliveries</div><ul style={{"listStyle":"none","margin":"0","padding":"0","display":"flex","flexDirection":"column","gap":"6px"}}>{v.deliveries.map((u, $index) => (<Fragment key={$index}><li style={{"display":"flex","alignItems":"center","gap":"12px","padding":"10px 12px","borderRadius":"12px","background":"#143026"}}><span style={{"minWidth":"52px","textAlign":"center","padding":"6px 0","borderRadius":"10px","background":"#1d3f31"}}><b className="hd" style={{"display":"block","fontSize":"18px","lineHeight":"1"}}>{u.days}</b><span style={{"fontSize":"12px","color":"#A9C0B2"}}>days</span></span><span style={{"flex":"1"}}><span style={{"display":"block","fontSize":"13px","fontWeight":"600"}}>{u.what}</span><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>{u.when}</span></span></li></Fragment>))}</ul></aside><aside className="panel" style={{"left":"1056px","top":"84px","width":"360px","display":"flex","flexDirection":"column","gap":"10px"}}><div className="kick">STATE · HOVER THE MAP</div><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div className="hd" style={{"fontSize":"24px","flex":"1","lineHeight":"1.15"}}>{v.stName}</div><span style={css(`padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600;background:${v.wxBg};color:#E8F1EA;white-space:nowrap`)}>{v.wxLabel} · {v.stTemp}°C</span></div><div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"10px 12px","borderRadius":"12px","background":"#143026"}}><span style={css(`width:12px;height:12px;border-radius:3px;background:${v.stageColor};flex:none`)} /><span style={{"fontSize":"13px"}}><b style={{"fontWeight":"600"}}>{v.stStage} season</b>{" "}· {v.stNote}</span></div>{v.hasRisk && (<><div style={{"padding":"12px","borderRadius":"12px","background":"#4a2320","border":"1px solid #D9604C"}}><div style={{"display":"flex","justifyContent":"space-between","fontSize":"14px","fontWeight":"700","color":"#FFD3CB"}}><span>{v.riskKind} risk · {v.riskPct}%</span><span>{v.riskEta}</span></div><div style={{"fontSize":"12px","lineHeight":"1.5","color":"#F2C4BC","marginTop":"4px"}}>{v.riskImpact}</div></div></>)}{v.noRisk && (<><div style={{"padding":"12px","borderRadius":"12px","background":"#143026","fontSize":"13px","color":"#B9CDC0"}}>No weather risk predicted for this state in the next 3 weeks.</div></>)}<div className="note">Sample values. Weather comes from a live feed and risks from the predictive model once connected.</div></aside><aside className="panel" style={{"left":"1056px","top":"502px","width":"360px","height":"374px","display":"flex","flexDirection":"column","gap":"8px"}}><div style={{"display":"flex","justifyContent":"space-between","alignItems":"baseline"}}><span className="kick">REVENUE DASHBOARD</span><span className="note">₹ lakh · sample</span></div><div style={{"display":"flex","alignItems":"baseline","gap":"8px"}}><span className="hd" style={{"fontSize":"36px","fontWeight":"700"}}>₹38.6 L</span><span style={{"fontSize":"13px","color":"#6FD08C"}}>+30% vs last month</span></div><div style={{"display":"flex","alignItems":"flex-end","gap":"12px","height":"150px","paddingTop":"8px"}}>{v.bars.map((b, $index) => (<Fragment key={$index}><div style={{"flex":"1","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"flex-end","gap":"4px","height":"100%"}}><span style={{"fontSize":"12px","color":"#A9C0B2"}}>{b.v}</span><div style={css(`width:100%;height:${b.h}px;border-radius:8px 8px 3px 3px;background:${b.bg}`)} /></div></Fragment>))}</div><div style={{"display":"flex","gap":"12px"}}>{v.bars.map((b, $index) => (<Fragment key={$index}><span style={{"flex":"1","textAlign":"center","fontSize":"12px","color":"#A9C0B2"}}>{b.m}</span></Fragment>))}</div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px","marginTop":"4px"}}><div className="stat"><span>Pipeline value</span><b>₹27.7 L</b></div><div className="stat"><span>Long-term renewals</span><b>2 due</b></div></div></aside><div style={{"position":"absolute","left":"400px","top":"828px","width":"640px","boxSizing":"border-box","padding":"10px 16px","borderRadius":"999px","background":"#0f261ed9","border":"1px solid #2c4a3d","display":"flex","justifyContent":"center","gap":"14px","fontSize":"12px","color":"#B9CDC0","flexWrap":"wrap"}}><span style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","borderRadius":"50%","background":"#DCE96C"}} />Sowing</span><span style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","borderRadius":"50%","background":"#6FD08C"}} />Growing</span><span style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","borderRadius":"50%","background":"#F5B83D"}} />Harvest</span><span style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","borderRadius":"50%","background":"#7d8d84"}} />Fallow</span><span style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","borderRadius":"3px","border":"2px solid #D9604C"}} />Predicted risk</span><span>State borders are approximate</span></div></div>)} />;
}
