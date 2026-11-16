// @ts-nocheck
/* eslint-disable */
// Based on the approved "HarvestLink 3D Simulation UI" design (Main.dc.html), reorganised as a SaaS-style overview:
// KPI strip on top, deals and deliveries on the left, the 3D season map in the middle, and a detailed state panel
// plus a ranked weather-risk list on the right. Deals, deliveries, pipeline value and value at risk are live
// (GET /api/portfolio); revenue and the weather panels are sample values until those feeds exist.
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';

export const pageTitle = "Overview";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.card{position:absolute;box-sizing:border-box;border-radius:18px;background:#0f261ee6;border:1px solid #23443a;backdrop-filter:blur(14px);box-shadow:0 18px 40px #00000040}
.kick{font-size:11px;letter-spacing:1.3px;font-weight:600;color:#8FB7A0;text-transform:uppercase}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.num{font-family:var(--font-space),sans-serif;font-weight:700;letter-spacing:-1px;font-variant-numeric:tabular-nums}
.muted{color:#93AE9F}
.note{font-size:11.5px;line-height:1.5;color:#86A394}
.pill{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:600;white-space:nowrap}
.up{background:#1f4a33;color:#8BE3A6}
.warn{background:#4a2320;color:#FFC2B6}
.mini{padding:8px 9px;border-radius:12px;background:#132e25;border:1px solid #1f3d33}
.mini span{display:block;font-size:11px;color:#8FB7A0;white-space:nowrap}
.mini b{display:block;font-family:var(--font-space),sans-serif;font-size:17px;font-weight:600;margin-top:1px}
.row{display:flex;align-items:center;gap:10px}
.sec{display:flex;justify-content:space-between;align-items:baseline}
.link{font-size:12px;font-weight:600;color:#DCE96C}
.riskrow{display:flex;align-items:center;gap:8px;width:100%;min-height:30px;padding:4px 8px;white-space:nowrap;border-radius:10px;border:1px solid transparent;background:transparent;color:#E8F1EA;text-align:left;font-size:12.5px}
.riskrow:hover{background:#143026}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:6px;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:600;color:#E8F1EA;box-shadow:0 6px 16px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.lyr{position:absolute;overflow:visible;pointer-events:none;transition:transform .25s ease}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes drop{to{background-position:0 28px}}
@keyframes bob{0%,100%{margin-top:0}50%{margin-top:-5px}}
@keyframes flash{0%,88%,100%{filter:brightness(1)}91%,95%{filter:brightness(2.4)}}
@keyframes drift{to{transform:translateX(24px)}}
@keyframes riskpulse{50%{stroke-opacity:.3}}
@keyframes livedot{50%{opacity:.35}}
.risk{animation:riskpulse 1.4s ease-in-out infinite}
.live{animation:livedot 1.6s ease-in-out infinite}
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
  state = { hov: null, sel: 'TN', prof: false, book: null };
  async componentDidMount() {
    if (this._started) return;
    this._started = true;
    try { const r = await fetch('/api/portfolio'); if (r.ok) this.setState({ book: await r.json() }); } catch (e) { /* keep placeholders */ }
  }
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
    // Sample state context: region, main crops this season, season rainfall vs normal (%).
    const X = {
      JK: ['North', ['Apple', 'Saffron'], -12], HP: ['North', ['Apple', 'Peas'], -8], PB: ['North', ['Wheat', 'Mustard'], -5], UK: ['North', ['Wheat', 'Rice'], -3],
      HR: ['North', ['Wheat', 'Mustard'], -6], RJ: ['West', ['Mustard', 'Gram'], -15], UP: ['North', ['Wheat', 'Sugarcane'], 2], BR: ['East', ['Paddy', 'Maize'], 6],
      SK: ['Northeast', ['Cardamom', 'Ginger'], 4], AR: ['Northeast', ['Millet', 'Paddy'], 10], NL: ['Northeast', ['Paddy', 'Maize'], 7], MN: ['Northeast', ['Paddy', 'Pulses'], 5],
      MZ: ['Northeast', ['Paddy', 'Ginger'], 3], TR: ['Northeast', ['Paddy', 'Pineapple'], 8], ML: ['Northeast', ['Potato', 'Paddy'], 12], AS: ['Northeast', ['Paddy', 'Tea'], 22],
      WB: ['East', ['Paddy', 'Potato'], 9], JH: ['East', ['Paddy', 'Pulses'], -4], OD: ['East', ['Paddy', 'Pulses'], 14], CG: ['Central', ['Paddy', 'Gram'], -2],
      MP: ['Central', ['Wheat', 'Gram'], -7], GJ: ['West', ['Cumin', 'Groundnut'], -11], MH: ['West', ['Jowar', 'Onion'], -4], TG: ['South', ['Cotton', 'Chilli'], 5],
      AP: ['South', ['Tomato', 'Chilli', 'Groundnut'], 18], KA: ['South', ['Ragi', 'Tomato'], 3], GA: ['West', ['Paddy', 'Cashew'], 6], TN: ['South', ['Paddy', 'Banana'], 24], KL: ['South', ['Banana', 'Spices'], 11]
    };
    const risks = {
      TN: { kind: 'Cyclone', pct: 90, eta: 'in 14 days', impact: 'Could disrupt Chennai port and the Chittoor to Chennai road leg for the LionCity shipment window.', action: 'Book a backup sailing or move the truck leg earlier.' },
      OD: { kind: 'Cyclone', pct: 40, eta: 'in 20 days', impact: 'Could delay paddy harvest and Paradip port loading.', action: 'No deals exposed. Keep monitoring.' },
      PB: { kind: 'Dense fog and cold wave', pct: 65, eta: 'in 6 days', impact: 'Slower trucking on highways; wheat germination watch.', action: 'No deals exposed. Keep monitoring.' },
      AS: { kind: 'Flood', pct: 55, eta: 'in 9 days', impact: 'Possible harvest losses and road closures.', action: 'No deals exposed. Keep monitoring.' },
      AP: { kind: 'Heavy rain', pct: 50, eta: 'in 10 days', impact: 'Could affect Chittoor tomato picking and drying.', action: 'Pick and dry tomatoes before the rain; clear drains in Chittoor plots.' }
    };
    // Where your own business touches a state.
    const exposure = {
      AP: ['Home base · Chittoor Farmers FPO, 42 member farms', 'All 3 active deals source here · 50 t (Chittoor, Anantapur, Kurnool)'],
      TN: ['Chennai port · export leg for LionCity 18 t']
    };
    const wxLabel = { sun: 'Sunny', rain: 'Rainy', storm: 'Stormy', cloud: 'Cloudy', fog: 'Foggy' };
    const humid = { sun: 45, rain: 86, storm: 88, cloud: 68, fog: 92 };
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
    const A = G.find((g) => g.a === active), AD = D[active], AX = X[active];
    const fx = [{ x: A.cx, y: A.cy, z: 60, cls: 'wx-' + AD[0] }];
    const rk = risks[active];
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Overview'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const bars = [['Jun', 3.2], ['Jul', 4.8], ['Aug', 6.1], ['Sep', 5.4], ['Oct', 8.3], ['Nov', 10.8]].map((b, i) => ({ m: b[0], v: b[1], h: Math.round(b[1] / 10.8 * 46), bg: i === 5 ? 'linear-gradient(#DCE96C,#6FD08C)' : '#2f7a4c' }));
    // Deals, deliveries and money come from the live contracts book (GET /api/portfolio).
    const B = this.state.book;
    const inr = (x) => (x >= 1e7 ? '₹' + (x / 1e7).toFixed(2) + ' Cr' : '₹' + (x / 1e5).toFixed(1) + ' L');
    const fmt = (d) => { const p = d.split('-'); return Number(p[2]) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1] + ' ' + p[0]; };
    const live = B ? B.timeline.slice().sort((a, b) => a.end.localeCompare(b.end)) : [];
    const deals = live.slice(0, 3).map((t) => ({ ex: t.exporter, crop: t.produce + ' · ' + t.qtyT + ' t · ' + t.country, value: t.valueINR != null ? inr(t.valueINR) : 'Price TBD', due: fmt(t.end), prog: t.progress, stage: t.status, href: '/contracts?id=' + t.id }));
    const upcoming = live.filter((t) => t.daysToDelivery >= 0);
    const deliveries = upcoming.slice(0, 3).map((t) => ({ days: t.daysToDelivery, what: t.produce + ' ' + t.qtyT + ' t · ' + t.exporter, when: fmt(t.end) + ' · ' + t.country }));
    const K = B ? B.kpis : null;
    const sevC = (p) => (p >= 75 ? '#E5654F' : p >= 50 ? '#F0A04B' : '#D8C25A');
    const riskList = Object.keys(risks).map((k) => ({ k, ...risks[k] })).sort((a, b) => b.pct - a.pct).map((r) => ({
      name: (G.find((g) => g.a === r.k) || {}).name || r.k, kind: r.kind, pct: r.pct, eta: r.eta, color: sevC(r.pct), mine: !!exposure[r.k],
      on: r.k === active, pick: () => this.setState({ sel: r.k })
    }));
    const exposed = Object.keys(risks).filter((k) => exposure[k]).length;
    const dealCount = { AP: '3 deals', TN: '1 route' };
    const rain = AX[2];
    return {
      states, tags, fx, nav, bars, deals, deliveries, riskList,
      dealsHead: K ? K.deals + ' · ' + inr(K.valueINR) : '…', delivHead: upcoming.length ? 'next ' + upcoming[Math.min(2, upcoming.length - 1)].daysToDelivery + ' days' : '',
      kpis: [
        { label: 'Pipeline value', value: K ? inr(K.valueINR) : '…', sub: K ? 'Across ' + K.deals + ' live deals · ' + K.volumeT + ' t' : 'Loading deals', pill: null },
        { label: 'Value at risk', value: K ? inr(K.valueAtRisk) : '…', sub: 'Weather risk on allocated deals', pill: B && B.stress.worst ? { text: 'Worst past season: ' + Math.round(B.stress.worst.delivered * 100) + '% supply', cls: B.stress.worst.delivered < .9 ? 'warn' : 'up' } : null },
        { label: 'Next delivery', value: upcoming[0] ? upcoming[0].daysToDelivery + ' days' : '—', sub: upcoming[0] ? upcoming[0].produce + ' ' + upcoming[0].qtyT + ' t · ' + fmt(upcoming[0].end) : 'No upcoming deliveries', pill: null },
        { label: 'Weather alerts', value: Object.keys(risks).length + ' states', sub: 'Next 3 weeks', pill: { text: exposed + ' affect your deals', cls: 'warn' } }
      ],
      stName: A.name, stCode: active, stRegion: AX[0], stTemp: AD[1], stStage: AD[2], stNote: AD[3], stageColor: stageC[AD[2]], wxLabel: wxLabel[AD[0]], wxBg: wxChip[AD[0]],
      stCrops: AX[1], stRain: (rain > 0 ? '+' : '') + rain + '%', stRainColor: rain >= 15 ? '#8fd0f5' : rain <= -10 ? '#F0A04B' : '#E8F1EA', stHumid: humid[AD[0]] + '%',
      stMode: hov ? 'Hovering' : 'Selected', stDeals: dealCount[active] || 'None',
      hasRisk: !!rk, noRisk: !rk, riskKind: rk ? rk.kind : '', riskPct: rk ? rk.pct : 0, riskEta: rk ? rk.eta : '', riskImpact: rk ? rk.impact : '', riskAction: rk ? rk.action : '', riskColor: rk ? sevC(rk.pct) : '#6FD08C',
      exposure: exposure[active] || [], noExposure: !exposure[active],
      profOpen: prof, toggleProf: () => this.setState({ prof: !prof })
    };
  }
}

const Bar = ({ pct, color, h = 6 }) => (
  <div style={{ height: h, borderRadius: 999, background: '#1c3a2f', overflow: 'hidden' }}><div style={{ height: '100%', width: pct + '%', background: color, borderRadius: 999 }} /></div>
);

export default function OverviewPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (
    <div style={{ position: 'relative', width: 1440, height: 900, overflow: 'hidden', background: 'radial-gradient(900px 600px at 50% 60%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)', fontFamily: 'var(--font-inter),system-ui,sans-serif', color: '#E8F1EA' }}>

      {/* 3D season map */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 900, perspective: '2200px', perspectiveOrigin: '50% 34%' }}>
        <div style={{ position: 'absolute', left: 720, top: 548, width: 540, height: 610, marginLeft: -270, marginTop: -305, transformStyle: 'preserve-3d', transform: 'scale(.92) rotateX(48deg)' }}>
          {v.states.map((s, i) => (<Fragment key={i}>
            <svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(0px)`)}><path d={s.d} fill={s.fBase} stroke="#0a1511" strokeWidth="1.2" strokeLinejoin="round" style={{ pointerEvents: 'all', cursor: 'pointer' }} onMouseEnter={s.enter} onMouseLeave={s.leave} onClick={s.pick} /></svg>
            <svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zMid}px)`)} aria-hidden="true"><path d={s.d} fill={s.fMid} stroke="#0a1511" strokeWidth="1" strokeLinejoin="round" /></svg>
            <svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zTop}px)`)} aria-hidden="true"><path className={s.cls} d={s.d} fill={s.fTop} stroke={s.stroke} strokeWidth={s.sw} strokeLinejoin="round" /></svg>
          </Fragment>))}
          {v.tags.map((l, i) => (<div key={i} style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-48deg);pointer-events:none`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg}`)}><span style={css(`width:7px;height:7px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div>))}
          {v.fx.map((w, i) => (<div key={i} style={css(`position:absolute;left:${w.x}px;top:${w.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${w.z}px) rotateX(-48deg);pointer-events:none`)}><div className={`wx ${w.cls}`} style={{ left: -60, top: -110 }} /></div>))}
        </div>
      </div>

      {/* Header */}
      <header style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 64, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(#0a1814ee,#0a181400)', zIndex: 5 }}>
        <div className="row"><div style={{ width: 34, height: 34, borderRadius: 11, background: '#DCE96C', display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{ fontWeight: 700, fontSize: 18 }}>Farmora</span></div>
        <nav aria-label="Workspaces" style={{ display: 'flex', gap: 2, marginLeft: 12, padding: 4, borderRadius: 999, background: '#12281f99', border: '1px solid #2c4a3d' }}>{v.nav.map((n, i) => (<Link key={i} href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link>))}</nav>
        <span className="pill" style={{ marginLeft: 'auto', background: '#12281f', border: '1px solid #2c4a3d', color: '#B9CDC0' }}><span className="live" style={{ width: 7, height: 7, borderRadius: '50%', background: '#6FD08C' }} />Deals live · weather sample</span>
        <button onClick={v.toggleProf} aria-expanded={v.profOpen} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, padding: '0 12px 0 6px', borderRadius: 999, border: '1px solid #2c4a3d', background: '#12281f99', color: '#E8F1EA', fontSize: 13 }}><span style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8BC7C', color: '#4a3420', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>CF</span><span style={{ textAlign: 'left' }}><b style={{ display: 'block', fontWeight: 600 }}>Chittoor Farmers FPO</b><span style={{ display: 'block', fontSize: 12, color: '#A9C0B2' }}>Andhra Pradesh</span></span></button>
      </header>
      {v.profOpen && (<div className="card" style={{ right: 24, left: 'auto', top: 70, width: 300, padding: 18, zIndex: 6, display: 'flex', flexDirection: 'column', gap: 10, background: '#0f261ef7' }}><div className="row" style={{ gap: 12 }}><span style={{ width: 52, height: 52, borderRadius: '50%', background: '#E8BC7C', color: '#4a3420', display: 'grid', placeItems: 'center', fontWeight: 700 }}>CF</span><div><div className="hd" style={{ fontSize: 18 }}>Chittoor Farmers FPO</div><div className="note">Your FPO profile · sample</div></div></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}><div className="mini"><span>Members</span><b>42</b></div><div className="mini"><span>Since</span><b>2019</b></div><div className="mini"><span>Trust</span><b>4.6</b></div></div></div>)}

      {/* KPI strip */}
      <section className="card" aria-label="Revenue year to date" style={{ left: 24, top: 76, width: 380, height: 104, padding: '14px 16px', display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}><div className="kick">Revenue YTD</div><div className="num" style={{ fontSize: 34, lineHeight: 1.1, marginTop: 6 }}>₹38.6 L</div><span className="pill up" style={{ marginTop: 6 }}>▲ +30% vs last month</span></div>
        <div style={{ width: 168, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 62 }}>{v.bars.map((b, i) => (<div key={i} title={`${b.m}: ₹${b.v} L`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2, height: '100%' }}><span style={{ fontSize: 9.5, color: '#93AE9F' }}>{b.v}</span><div style={css(`width:100%;height:${b.h}px;border-radius:5px 5px 2px 2px;background:${b.bg}`)} /></div>))}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>{v.bars.map((b, i) => (<span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: '#86A394' }}>{b.m}</span>))}</div>
        </div>
      </section>
      {v.kpis.map((k, i) => (
        <section key={i} className="card" style={{ left: 416 + i * 253, top: 76, width: 241, height: 104, padding: '14px 16px' }}>
          <div className="kick">{k.label}</div>
          <div className="num" style={{ fontSize: 28, lineHeight: 1.15, marginTop: 6 }}>{k.value}</div>
          <div className="row" style={{ marginTop: 6, gap: 8 }}>{k.pill ? <span className={`pill ${k.pill.cls}`}>{k.pill.text}</span> : <span className="note" style={{ fontSize: 12 }}>{k.sub}</span>}</div>
        </section>
      ))}

      {/* Left: deals and deliveries */}
      <aside className="card" style={{ left: 24, top: 192, width: 340, height: 684, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="sec"><span className="hd" style={{ fontSize: 16 }}>Active deals</span><span className="muted" style={{ fontSize: 12 }}>{v.dealsHead}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{v.deals.map((d, i) => (
          <Link key={i} href={d.href} style={{ display: 'block', color: '#E8F1EA', padding: '11px 12px', borderRadius: 14, background: '#132e25', border: '1px solid #1f3d33' }}>
            <div className="sec" style={{ fontSize: 13.5, fontWeight: 600 }}><span>{d.ex}</span><span className="num" style={{ fontSize: 15, letterSpacing: '-.3px' }}>{d.value}</span></div>
            <div className="muted" style={{ fontSize: 12, margin: '2px 0 9px' }}>{d.crop}</div>
            <Bar pct={d.prog} color="linear-gradient(90deg,#4fbf72,#DCE96C)" />
            <div className="sec" style={{ fontSize: 11.5, marginTop: 6 }}><span className="muted">{d.stage} · {d.prog}%</span><span className="muted">Due {d.due}</span></div>
          </Link>))}</div>
        <div style={{ height: 1, background: '#23443a', margin: '4px 0' }} />
        <div className="sec"><span className="hd" style={{ fontSize: 16 }}>Upcoming deliveries</span><span className="muted" style={{ fontSize: 12 }}>{v.delivHead}</span></div>
        <ol style={{ listStyle: 'none', margin: 0, padding: '0 0 0 14px', borderLeft: '2px solid #23443a', display: 'flex', flexDirection: 'column', gap: 12 }}>{v.deliveries.map((u, i) => (
          <li key={i} style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: -21, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#DCE96C' : '#0f261e', border: '2px solid #DCE96C' }} />
            <div className="sec"><b style={{ fontSize: 13, fontWeight: 600 }}>{u.what}</b><span className="pill" style={{ background: '#1d3f31', color: '#DCE96C' }}>{u.days} d</span></div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{u.when}</div>
          </li>))}</ol>
        <Link href="/contracts" className="link" style={{ marginTop: 'auto' }}>View all contracts →</Link>
      </aside>

      {/* Right: state details */}
      <aside className="card" aria-live="polite" style={{ left: 1076, top: 192, width: 340, height: 474, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div className="sec"><span className="kick">State details</span><span className="pill" style={{ background: '#132e25', color: '#93AE9F' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DCE96C' }} />{v.stMode}</span></div>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}><div className="hd" style={{ fontSize: 24, lineHeight: 1.1 }}>{v.stName}</div><div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{v.stRegion} India · {v.stCode}</div></div>
          <span className="pill" style={css(`background:${v.wxBg};color:#E8F1EA;padding:5px 11px;font-size:12px`)}>{v.wxLabel} · {v.stTemp}°C</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
          <div className="mini"><span>Rain vs normal</span><b style={css(`color:${v.stRainColor}`)}>{v.stRain}</b></div>
          <div className="mini"><span>Humidity</span><b>{v.stHumid}</b></div>
          <div className="mini"><span>Your deals</span><b style={{ fontSize: 15 }}>{v.stDeals}</b></div>
        </div>
        <div style={{ padding: '9px 11px', borderRadius: 12, background: '#132e25', border: '1px solid #1f3d33' }}>
          <div className="row" style={{ gap: 8 }}><span style={css(`width:10px;height:10px;border-radius:3px;background:${v.stageColor};flex:none`)} /><span style={{ fontSize: 12.5, flex: 1 }}><b style={{ fontWeight: 600 }}>{v.stStage} season</b> · {v.stNote}</span></div>
          <div className="row" style={{ gap: 5, flexWrap: 'wrap', marginTop: 7 }}><span className="note">Main crops</span>{v.stCrops.map((c, i) => (<span key={i} className="pill" style={{ background: '#1d3f31', border: '1px solid #2f5a48', color: '#E8F1EA', padding: '2px 8px' }}>{c}</span>))}</div>
        </div>
        {v.hasRisk && (<div style={{ padding: '10px 12px', borderRadius: 12, background: '#3a1f1c', border: '1px solid #8a3a2e' }}>
          <div className="sec" style={{ fontSize: 13.5, fontWeight: 700, color: '#FFD3CB' }}><span>{v.riskKind}</span><span style={{ fontSize: 12, fontWeight: 600 }}>{v.riskEta}</span></div>
          <div className="row" style={{ margin: '6px 0 5px' }}><div style={{ flex: 1 }}><Bar pct={v.riskPct} color={v.riskColor} /></div><b className="num" style={{ fontSize: 15, color: '#FFD3CB' }}>{v.riskPct}%</b></div>
          <div style={{ fontSize: 12, lineHeight: 1.45, color: '#F2C4BC' }}>{v.riskImpact}</div>
          <div style={{ fontSize: 12, lineHeight: 1.45, color: '#FFE7A8', marginTop: 5 }}>→ {v.riskAction}</div>
        </div>)}
        {v.noRisk && (<div className="row" style={{ padding: '10px 12px', borderRadius: 12, background: '#132e25', border: '1px solid #1f3d33', fontSize: 12.5, color: '#B9CDC0' }}><span style={{ color: '#6FD08C' }}>●</span>No weather risk predicted in the next 3 weeks.</div>)}
        <div>
          <div className="kick" style={{ marginBottom: 4 }}>Your exposure</div>
          {v.exposure.map((e, i) => (<div key={i} className="row" style={{ fontSize: 12.5, lineHeight: 1.45, alignItems: 'flex-start', gap: 8 }}><span style={{ color: '#DCE96C' }}>◆</span><span>{e}</span></div>))}
          {v.noExposure && (<div className="note" style={{ fontSize: 12.5 }}>No active deals, members or routes in this state.</div>)}
        </div>
      </aside>

      {/* Right: ranked weather risks */}
      <aside className="card" style={{ left: 1076, top: 678, width: 340, height: 198, padding: '12px 10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="sec" style={{ padding: '0 6px 4px' }}><span className="hd" style={{ fontSize: 15 }}>Weather risks</span><span className="muted" style={{ fontSize: 11.5 }}><span style={{ color: '#DCE96C' }}>◆</span> your deals · next 3 weeks</span></div>
        {v.riskList.map((r, i) => (
          <button key={i} className="riskrow" onClick={r.pick} style={r.on ? { background: '#143026', borderColor: '#3d6b55' } : undefined}>
            <span style={css(`width:8px;height:8px;border-radius:50%;background:${r.color};flex:none`)} />
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }} title={`${r.name} · ${r.kind}`}><b style={{ fontWeight: 600 }}>{r.name}</b> <span className="muted">· {r.kind}</span></span>
            {r.mine && <span title="Affects your deals" aria-label="Affects your deals" style={{ color: '#DCE96C', fontSize: 11, flex: 'none' }}>◆</span>}
            <b className="num" style={css(`font-size:13px;color:${r.color};width:34px;text-align:right`)}>{r.pct}%</b>
            <span className="muted" style={{ fontSize: 11, width: 58, textAlign: 'right', flex: 'none' }}>{r.eta}</span>
          </button>))}
      </aside>

      {/* Map legend */}
      <div style={{ position: 'absolute', left: 386, top: 836, width: 668, boxSizing: 'border-box', padding: '9px 16px', borderRadius: 999, background: '#0f261ed9', border: '1px solid #23443a', display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, color: '#B9CDC0' }}>
        {[['Sowing', '#DCE96C'], ['Growing', '#6FD08C'], ['Harvest', '#F5B83D'], ['Fallow', '#7d8d84']].map((l, i) => (<span key={i} className="row" style={{ gap: 6 }}><span style={css(`width:9px;height:9px;border-radius:50%;background:${l[1]}`)} />{l[0]}</span>))}
        <span className="row" style={{ gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 3, border: '2px solid #D9604C' }} />Predicted risk</span>
        <span className="muted">Fill = today’s weather</span>
      </div>
    </div>
  )} />;
}
