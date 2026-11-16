// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (ContractsFarmers.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';

export const pageTitle = "Contracts with Farmers";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:18px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;color:#E8F1EA;box-shadow:0 6px 16px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.lyr{position:absolute;overflow:visible;pointer-events:none;transition:transform .25s ease}
`;

class Logic extends DCLogic {
  state = { cat: 'Vegetables', sel: 'AP' };
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
    const { cat, sel } = this.state;
    const G = this.geo();
    const F = [
      ['Asha Devi', 'AP', 25, 4.0, 96, ['Vegetables', 'Fruits']], ['Lakshmi Bai', 'AP', 40, 3.2, 93, ['Vegetables']], ['Ravi Naidu', 'AP', 55, 5.5, 90, ['Vegetables', 'Grains']],
      ['Suresh Babu', 'AP', 35, 2.0, 91, ['Poultry / Meat']], ['Mohan Gowda', 'KA', 210, 6.0, 86, ['Vegetables', 'Fruits']], ['Selvam Raj', 'TN', 150, 4.8, 84, ['Vegetables', 'Grains']],
      ['Meena Pillai', 'TN', 190, 3.0, 82, ['Fruits', 'Poultry / Meat']], ['Venkat Rao', 'TG', 520, 8.5, 79, ['Grains', 'Vegetables']], ['Savitri Kamble', 'MH', 900, 7.0, 74, ['Grains', 'Fruits']],
      ['Gurpreet Singh', 'PB', 2100, 12, 70, ['Grains']], ['Biju Thomas', 'KL', 480, 2.5, 77, ['Fruits', 'Poultry / Meat']]
    ];
    const SN = {}; G.forEach((g) => { SN[g.a] = g.name; });
    const catColor = { Vegetables: '#E4584B', Grains: '#E6C75A', Fruits: '#F5B83D', 'Poultry / Meat': '#C9A0DC' };
    const crop = { Vegetables: 'Tomato', Grains: 'Rice', Fruits: 'Mango', 'Poultry / Meat': 'Broiler' }[cat];
    const list = F.filter((f) => f[5].includes(cat));
    const count = {}; list.forEach((f) => { count[f[1]] = (count[f[1]] || 0) + 1; });
    const C = catColor[cat];
    const shade = (hex, m) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * m)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const states = [], pillars = [], tags = [];
    G.forEach((g) => {
      const n = count[g.a] || 0, on = n > 0, lift = on ? 16 : 5, isSel = sel === g.a;
      const top = on ? '#2b6a4b' : '#1a2f26';
      states.push({ d: g.d, x: g.x, y: g.y, w: g.w, h: g.h, zMid: lift / 2, zTop: lift, fBase: shade(top, .45), fMid: shade(top, .65), fTop: top, stroke: isSel ? '#DCE96C' : '#0a1511', sw: isSel ? 3 : 1.2, pick: () => this.setState({ sel: g.a }) });
      if (on) {
        const ph = 20 + n * 22, x = g.cx - 12, y = g.cy - 12;
        pillars.push({ css: `left:${x}px;top:${y}px;width:24px;height:24px;background:${C};transform:translateZ(${lift + ph}px);box-shadow:0 0 22px ${C}aa;pointer-events:none;` });
        pillars.push({ css: `left:${x}px;top:${y + 24}px;width:24px;height:${ph}px;background:${shade(C, .72)};transform-origin:0 0;transform:translateZ(${lift}px) rotateX(90deg);pointer-events:none;` });
        pillars.push({ css: `left:${x + 24}px;top:${y}px;width:${ph}px;height:24px;background:${shade(C, .5)};transform-origin:0 0;transform:translateZ(${lift}px) rotateY(-90deg);pointer-events:none;` });
        tags.push({ x: g.cx, y: g.cy, z: lift + ph + 20, name: g.a + ' · ' + n, dot: C, border: isSel ? '#DCE96C' : '#2c4a3d', bg: '#0f261ef2' });
      }
    });
    tags.push({ x: 199.8, y: 470.6, z: 14, name: 'Chittoor FPO', dot: '#DCE96C', border: '#DCE96C', bg: '#0f261ef2' });
    const rec = list.filter((f) => f[1] === sel).map((f) => ({ name: f[0], state: SN[f[1]] || f[1], km: f[2].toLocaleString('en-IN'), acres: f[3], match: f[4], ini: f[0].split(' ').map((w) => w[0]).join(''), color: ['#E8BC7C', '#8fd0f5', '#E4A04B', '#B8F0C8', '#D9A47A'][f[0].length % 5] })).slice(0, 4);
    const sts = [['Delivering', '#1f5a3b', '#B8F0C8'], ['Growing', '#2b4a6a', '#BFE0FA'], ['Signed', '#4a4a1e', '#F3F0A8'], ['Awaiting reply', '#4a3a1e', '#F7DDA8']];
    const contracts = list.slice(0, 4).map((f, i) => ({ name: f[0], crop, acres: f[3], state: f[1], status: sts[i % 4][0], chipBg: sts[i % 4][1], chipFg: sts[i % 4][2], prog: [78, 55, 30, 8][i % 4] }));
    const upd = [['Photo', '#B8F0C8', 'Flowering started on plot 2. Watering twice a day.'], ['Text', '#BFE0FA', 'Light rain last night. No damage seen in the rows.'], ['Voice note', '#F3F0A8', 'Need a call about staking before the next fruit set.']];
    const updates = list.slice(0, 3).map((f, i) => ({ name: f[0], ago: [2, 5, 9][i] + ' h ago', kind: upd[i][0], bg: upd[i][1], text: upd[i][2] }));
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Contracts'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    return {
      states, pillars, tags, nav, rec, contracts, updates, catName: cat, stName: SN[sel] || sel,
      cats: Object.keys(catColor).map((c) => ({ name: c, on: c === cat, bg: c === cat ? '#DCE96C' : 'transparent', fg: c === cat ? '#14382b' : '#B9CDC0', pick: () => this.setState({ cat: c }) }))
    };
  }
}

export default function ContractsFarmersPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1000px 620px at 50% 45%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"700px","perspective":"2200px","perspectiveOrigin":"50% 30%"}}><div style={{"position":"absolute","left":"720px","top":"410px","width":"540px","height":"610px","marginLeft":"-270px","marginTop":"-305px","transformStyle":"preserve-3d","transform":"scale(.88) rotateX(48deg)"}}>{v.states.map((s, $index) => (<Fragment key={$index}><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(0px)`)}><path d={s.d} fill={s.fBase} stroke="#0a1511" strokeWidth="1.2" strokeLinejoin="round" style={{"pointerEvents":"all","cursor":"pointer"}} onClick={s.pick} /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zMid}px)`)} aria-hidden="true"><path d={s.d} fill={s.fMid} stroke="#0a1511" strokeWidth="1" strokeLinejoin="round" /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zTop}px)`)} aria-hidden="true"><path d={s.d} fill={s.fTop} stroke={s.stroke} strokeWidth={s.sw} strokeLinejoin="round" /></svg></Fragment>))}{v.pillars.map((f, $index) => (<Fragment key={$index}><div style={css(`position:absolute;${f.css}`)} /></Fragment>))}{v.tags.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-48deg);pointer-events:none`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg}`)}><span style={css(`width:8px;height:8px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>Farmora</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link></Fragment>))}</nav><div style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"10px","minHeight":"44px","padding":"0 12px 0 6px","borderRadius":"999px","border":"1px solid #2c4a3d","background":"#12281f99","fontSize":"13px"}}><span style={{"width":"32px","height":"32px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700","fontSize":"12px"}}>CF</span><span><b style={{"display":"block","fontWeight":"600"}}>Chittoor Farmers FPO</b><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>Farmers profile</span></span></div></header><div style={{"position":"absolute","left":"24px","right":"24px","top":"72px","height":"48px","display":"flex","alignItems":"center","gap":"16px","zIndex":"4"}}><div role="tablist" aria-label="Category" style={{"display":"flex","gap":"4px","padding":"4px","borderRadius":"999px","background":"#12281fcc","border":"1px solid #2c4a3d"}}>{v.cats.map((c, $index) => (<Fragment key={$index}><button role="tab" aria-selected={c.on} onClick={c.pick} style={css(`min-height:40px;padding:0 18px;border-radius:999px;border:0;font-size:14px;font-weight:600;background:${c.bg};color:${c.fg}`)}>{c.name}</button></Fragment>))}</div><div style={{"marginLeft":"auto","display":"flex","gap":"4px","padding":"4px","borderRadius":"999px","background":"#12281fcc","border":"1px solid #2c4a3d"}}><Link href="/contracts" style={{"display":"grid","placeItems":"center","minHeight":"40px","padding":"0 18px","borderRadius":"999px","color":"#B9CDC0","fontSize":"14px","fontWeight":"600"}}>Contractor</Link><Link href="/contracts/farmers" aria-current="page" style={{"display":"grid","placeItems":"center","minHeight":"40px","padding":"0 18px","borderRadius":"999px","background":"#DCE96C","color":"#14382b","fontSize":"14px","fontWeight":"600"}}>Farmers</Link></div></div><aside className="panel" style={{"left":"24px","top":"132px","width":"340px","height":"744px","display":"flex","flexDirection":"column","gap":"10px"}}><div><div className="kick">ONGOING WITH FARMERS</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>{v.catName} contracts</div></div><div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>{v.contracts.map((c, $index) => (<Fragment key={$index}><div style={{"padding":"12px","borderRadius":"14px","background":"#143026"}}><div style={{"display":"flex","justifyContent":"space-between","gap":"8px","fontSize":"14px","fontWeight":"600"}}><span>{c.name}</span><span style={css(`font-size:12px;padding:3px 10px;border-radius:999px;background:${c.chipBg};color:${c.chipFg}`)}>{c.status}</span></div><div style={{"fontSize":"12px","color":"#A9C0B2","marginTop":"2px"}}>{c.crop} · {c.acres} acres · {c.state}</div><div style={{"height":"8px","borderRadius":"999px","background":"#1c3a2f","marginTop":"10px","overflow":"hidden"}}><div style={css(`height:100%;width:${c.prog}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div></div></Fragment>))}</div><div className="note" style={{"marginTop":"auto"}}>Sample contracts. Progress comes from updates farmers send on WhatsApp.</div></aside><aside className="panel" style={{"left":"1076px","top":"132px","width":"340px","height":"744px","display":"flex","flexDirection":"column","gap":"10px"}}><div><div className="kick">RECOMMENDATION MODEL</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>Farmers to reach out to · {v.stName}</div></div><div className="note">Ranked by crop fit, distance from the FPO and available land. Click a highlighted state on the map.</div><div style={{"display":"flex","flexDirection":"column","gap":"8px","overflow":"hidden"}}>{v.rec.map((r, $index) => (<Fragment key={$index}><Link href="/farmers" style={{"display":"flex","alignItems":"center","gap":"12px","padding":"12px","borderRadius":"14px","background":"#143026","border":"1px solid #2c4a3d"}}><span style={css(`width:44px;height:44px;border-radius:50%;background:${r.color};display:grid;place-items:center;font-size:14px;font-weight:700;color:#10201a`)}>{r.ini}</span><span style={{"flex":"1","minWidth":"0"}}><span style={{"display":"block","fontSize":"14px","fontWeight":"600"}}>{r.name}</span><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>{r.state} · {r.km} km from FPO · {r.acres} ac</span></span><span style={{"textAlign":"center"}}><b className="hd" style={{"display":"block","fontSize":"20px","color":"#DCE96C","lineHeight":"1"}}>{r.match}</b><span style={{"fontSize":"12px","color":"#A9C0B2"}}>match</span></span></Link></Fragment>))}</div><div className="note" style={{"marginTop":"auto"}}>Sample model output. Open a farmer to see their full profile.</div></aside><section className="panel" style={{"left":"380px","top":"690px","width":"680px","height":"186px","display":"flex","flexDirection":"column","gap":"8px"}}><div style={{"display":"flex","justifyContent":"space-between","alignItems":"baseline"}}><span className="hd" style={{"fontSize":"16px"}}>Updates from farmers</span><span className="note">via WhatsApp · sample</span></div><div style={{"display":"flex","gap":"10px"}}>{v.updates.map((u, $index) => (<Fragment key={$index}><div style={{"flex":"1","minWidth":"0","display":"flex","gap":"10px","padding":"10px","borderRadius":"14px","background":"#143026"}}><div style={css(`width:56px;height:56px;flex:none;border-radius:10px;background:${u.bg};display:grid;place-items:center;font-size:12px;font-weight:600;color:#14231a;text-align:center;line-height:1.2`)}>{u.kind}</div><div style={{"minWidth":"0"}}><div style={{"fontSize":"13px","fontWeight":"600"}}>{u.name}{" "}<span style={{"color":"#A9C0B2","fontWeight":"500"}}>· {u.ago}</span></div><div style={{"fontSize":"12px","lineHeight":"1.4","color":"#C9D9CF","marginTop":"2px"}}>{u.text}</div></div></div></Fragment>))}</div></section></div>)} />;
}
