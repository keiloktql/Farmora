// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Recommendations.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Recommended Farmers";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:18px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.stat{padding:10px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:12px;color:#A9C0B2}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:20px;font-weight:600;margin-top:2px}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;font-size:13px;font-weight:600}
.fld{display:block;width:100%;box-sizing:border-box;min-height:44px;padding:0 14px;border-radius:12px;border:1px solid #3d6b55;background:#143026;color:#E8F1EA;font:inherit;font-size:14px}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;color:#E8F1EA;box-shadow:0 6px 16px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.lyr{position:absolute;overflow:visible;pointer-events:none;transition:transform .3s ease}
@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
.pulse{animation:pulse 1s ease-in-out infinite}
`;

class Logic extends DCLogic {
  state = {
    specs: { exporter: 'LionCity Fresh Imports', produce: 'Mango', qty: 30, dl: '2027-05-20', country: 'Singapore', price: '' },
    input: 'I got a 30 t mango deal for Singapore. I want trusted farmers within 1000 km with at least 3 acres.',
    applied: 'I got a 30 t mango deal for Singapore. I want trusted farmers within 1000 km with at least 3 acres.',
    loading: false, sel: null, invited: {}
  };
  timer = null;
  componentDidMount() {
    try {
      const raw = window.localStorage.getItem('hl_prompt');
      if (raw) { const d = JSON.parse(raw); if (d && d.text) { this.setState({ input: d.text, applied: d.text, specs: d.specs || this.state.specs }); } }
    } catch (e) { /* storage unavailable: keep the default prompt */ }
  }
  componentWillUnmount() { clearTimeout(this.timer); }
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
  parse(text, specs) {
    const t = (text || '').toLowerCase();
    const CR = ['mango', 'tomato', 'chilli', 'banana', 'rice', 'groundnut', 'broiler'];
    const found = CR.find((c) => t.includes(c));
    const crop = found ? found[0].toUpperCase() + found.slice(1) : specs.produce;
    const SM = { 'andhra': 'AP', 'tamil nadu': 'TN', 'karnataka': 'KA', 'telangana': 'TG', 'kerala': 'KL', 'maharashtra': 'MH', 'gujarat': 'GJ', 'punjab': 'PB', 'uttar pradesh': 'UP', 'bihar': 'BR', 'west bengal': 'WB', 'odisha': 'OD' };
    const states = Object.keys(SM).filter((k) => t.includes(k)).map((k) => SM[k]);
    const num = (re) => { const m = t.match(re); return m ? Number(m[1]) : null; };
    const minAcres = num(/(\d+(?:\.\d+)?)\s*(?:acres?|ac)\b/);
    let maxKm = num(/(?:within|under|less than|up to)\s*(\d+)\s*km/);
    if (!maxKm && /nearby|close|local|near /.test(t)) maxKm = 300;
    let minTrust = num(/trust(?:ed|\s*score)?\s*(?:above|over|of|>=?)?\s*(\d+)/);
    if (!minTrust && /trusted|reliable|dependable/.test(t)) minTrust = 80;
    const qty = num(/(\d+(?:\.\d+)?)\s*(?:t|tons?|tonnes?)\b/) || Number(specs.qty) || 20;
    return { crop, states, minAcres, maxKm, minTrust, qty };
  }
  renderVals() {
    const { specs, input, applied, loading, sel, invited } = this.state;
    const G = this.geo();
    const P = this.parse(applied, specs);
    const F = [
      ['Asha Devi', 'AP', 'Puthalapattu', 25, 4.0, ['Tomato', 'Mango'], 92, 88, 7], ['Lakshmi Bai', 'AP', 'Pakala', 40, 3.2, ['Tomato', 'Chilli'], 88, 84, 6],
      ['Ravi Naidu', 'AP', 'Thavanampalle', 55, 5.5, ['Mango', 'Rice'], 74, 70, 5], ['Suresh Babu', 'AP', 'Chinnagottigallu', 35, 2.0, ['Broiler', 'Banana'], 85, 82, 4],
      ['Rajeshwari Reddy', 'AP', 'Nuzvid', 380, 12, ['Mango', 'Chilli'], 90, 87, 6], ['Kumar Reddy', 'AP', 'Gurramkonda', 60, 6.5, ['Mango'], 81, 77, 3],
      ['Mohan Gowda', 'KA', 'Srinivaspur', 210, 6.0, ['Tomato', 'Mango'], 81, 79, 4], ['Anitha Shetty', 'KA', 'Kolar', 190, 9.0, ['Mango'], 86, 84, 5],
      ['Basavaraj Patil', 'KA', 'Dharwad', 520, 15, ['Mango', 'Groundnut'], 73, 69, 3], ['Selvam Raj', 'TN', 'Krishnagiri', 150, 4.8, ['Mango', 'Rice'], 77, 73, 5],
      ['Meena Pillai', 'TN', 'Salem', 280, 3.0, ['Mango', 'Broiler'], 69, 65, 3], ['Karthik Subramani', 'TN', 'Dindigul', 420, 7.5, ['Banana', 'Mango'], 83, 80, 4],
      ['Venkat Rao', 'TG', 'Mahbubnagar', 520, 8.5, ['Rice', 'Mango'], 72, 68, 3], ['Sridevi Goud', 'TG', 'Nizamabad', 650, 11, ['Mango', 'Chilli'], 79, 75, 4],
      ['Biju Thomas', 'KL', 'Thrissur', 480, 2.5, ['Banana', 'Mango'], 77, 74, 3], ['Savitri Kamble', 'MH', 'Ratnagiri', 900, 7.0, ['Mango'], 84, 81, 5],
      ['Prakash Jadhav', 'MH', 'Nashik', 1100, 10, ['Banana', 'Mango'], 70, 66, 2], ['Hasmukh Patel', 'GJ', 'Kutch', 1500, 18, ['Mango', 'Groundnut'], 88, 85, 6],
      ['Imran Ansari', 'UP', 'Malihabad', 1900, 9.0, ['Mango'], 82, 79, 4], ['Gurpreet Singh', 'PB', 'Hoshiarpur', 2100, 12, ['Rice', 'Mango'], 70, 68, 2],
      ['Sunita Yadav', 'BR', 'Muzaffarpur', 1700, 5.0, ['Mango', 'Banana'], 75, 71, 3], ['Debasish Roy', 'WB', 'Malda', 1500, 8.0, ['Mango', 'Rice'], 80, 76, 4],
      ['Manoj Nayak', 'OD', 'Ganjam', 900, 6.0, ['Mango', 'Rice'], 78, 74, 3], ['Lalitha Devi', 'AP', 'Anantapur', 290, 14, ['Groundnut', 'Tomato'], 83, 80, 5]
    ].map((f, i) => ({ id: i, name: f[0], st: f[1], village: f[2], km: f[3], acres: f[4], crops: f[5], trust: f[6], succ: f[7], contracts: f[8] }));
    const yld = { Mango: 3, Tomato: 8, Chilli: 1.2, Banana: 12, Rice: 2.5, Groundnut: 0.9, Broiler: 1 }[P.crop] || 2;
    const SN = {}; G.forEach((g) => { SN[g.a] = g.name; });
    const parts = (f) => ({ fit: f.crops[0] === P.crop ? 100 : 80, dist: Math.round((1 - Math.min(f.km / 2500, 1)) * 100), land: Math.round(Math.min(f.acres / 12, 1) * 100), trust: f.trust });
    const score = (f) => { const p = parts(f); return Math.round(.4 * p.fit + .25 * p.dist + .2 * p.land + .15 * p.trust); };
    const cand = F.filter((f) => f.crops.includes(P.crop) && (!P.maxKm || f.km <= P.maxKm) && (!P.minAcres || f.acres >= P.minAcres) && (!P.minTrust || f.trust >= P.minTrust) && (!P.states.length || P.states.includes(f.st)))
      .map((f) => ({ ...f, score: score(f) })).sort((a, b) => b.score - a.score);
    const short = loading ? [] : cand.slice(0, 10);
    const lot = []; let sum = 0;
    short.forEach((f) => { if (sum < P.qty) { lot.push(f.id); sum += f.acres * 0.4 * yld * 0.8; } });
    const inLot = (id) => lot.includes(id);
    const cur = short.find((f) => f.id === sel) || short[0] || null;
    const C = { Mango: '#F5B83D', Tomato: '#E4584B', Chilli: '#C95FB0', Banana: '#B6E36B', Rice: '#6CC4F0', Groundnut: '#D49A66', Broiler: '#C9A0DC' }[P.crop] || '#DCE96C';
    const shade = (hex, m) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * m)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const byState = {}; short.forEach((f) => { (byState[f.st] = byState[f.st] || []).push(f); });
    const states = [], pins = [], tags = [];
    G.forEach((g) => {
      const list = byState[g.a] || [], on = list.length > 0, isSel = !!cur && cur.st === g.a, lift = on ? 16 : 5;
      const top = on ? '#2b6a4b' : '#1a2f26';
      states.push({ d: g.d, x: g.x, y: g.y, w: g.w, h: g.h, zMid: lift / 2, zTop: lift, fBase: shade(top, .45), fMid: shade(top, .65), fTop: top, stroke: isSel ? '#DCE96C' : '#0a1511', sw: isSel ? 3 : 1.2,
        pick: () => { if (list.length) this.setState({ sel: list[0].id }); } });
      list.forEach((f, i) => {
        const a = (i / list.length) * Math.PI * 2, r = list.length > 1 ? 14 : 0, x = g.cx + Math.cos(a) * r - 6, y = g.cy + Math.sin(a) * r - 6;
        const isCur = cur && cur.id === f.id, col = isCur ? '#DCE96C' : (inLot(f.id) ? C : '#8fb7a0'), h = isCur ? 36 : 22, pick = () => this.setState({ sel: f.id });
        pins.push({ pick, css: `left:${x}px;top:${y}px;width:12px;height:12px;background:${col};transform:translateZ(${lift + h}px);cursor:pointer;box-shadow:0 0 ${isCur ? 20 : 8}px ${col};` });
        pins.push({ pick, css: `left:${x}px;top:${y + 12}px;width:12px;height:${h}px;background:${shade(col, .7)};transform-origin:0 0;transform:translateZ(${lift}px) rotateX(90deg);cursor:pointer;` });
        if (isSel) tags.push({ x: x + 6, y: y + 6, z: lift + h + 16, name: f.name.split(' ')[0] + ' · ' + f.score, dot: col, border: isCur ? '#DCE96C' : '#2c4a3d', bg: '#0f261ef2' });
      });
      if (on && !isSel) tags.push({ x: g.cx, y: g.cy, z: lift + 40, name: g.a + ' · ' + list.length, dot: C, border: '#2c4a3d', bg: '#0f261ee6' });
    });
    tags.push({ x: 199.8, y: 470.6, z: 10, name: 'Chittoor FPO', dot: '#DCE96C', border: '#DCE96C', bg: '#0f261ef2' });
    const lotF = short.filter((f) => inLot(f.id));
    const lotAcres = lotF.reduce((s, f) => s + f.acres, 0), lotT = lotF.reduce((s, f) => s + f.acres * 0.4 * yld * 0.8, 0);
    const lotKm = lotF.length ? Math.round(lotF.reduce((s, f) => s + f.km, 0) / lotF.length) : 0;
    const skins = ['#D9A47A', '#C98F63', '#8D5A3B', '#E8B98A'], shirts = ['#E4A04B', '#4F9BD9', '#E4584B', '#8E7CC3', '#4FB3A9', '#C95FB0'], caps = ['#DCE96C', '#E8F1EA', '#F2A65A', '#6CC4F0'];
    const pp = cur ? parts(cur) : { fit: 0, dist: 0, land: 0, trust: 0 };
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const on = n[0] === 'New project'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const isInv = cur ? !!invited[cur.id] : false;
    return {
      states, pins, tags, nav, input, loading, crop: P.crop, qty: P.qty,
      chips: [P.maxKm ? 'Within ' + P.maxKm + ' km' : 'Any distance', P.minAcres ? '≥ ' + P.minAcres + ' acres' : 'Any land size', P.minTrust ? 'Trust ≥ ' + P.minTrust : 'Any trust', ...(P.states.length ? [P.states.join(', ')] : [])],
      lotN: lotF.length, lotT: lotT.toFixed(1), lotAcres: lotAcres.toFixed(1), lotKm: lotKm.toLocaleString('en-IN'),
      cover: Math.min(100, lotT / P.qty * 100).toFixed(0),
      coverText: short.length ? (lotT >= P.qty ? 'This lot covers the ' + P.qty + ' t demand.' : 'Short by ' + (P.qty - lotT).toFixed(1) + ' t. Widen the search to fill it.') : 'No matching farmers yet.',
      rows: short.slice(0, 8).map((f, i) => ({ rank: i + 1, name: f.name, st: f.st, score: f.score, dot: inLot(f.id) ? '#6FD08C' : 'transparent', bg: cur && cur.id === f.id ? '#1d3f31' : '#143026', border: cur && cur.id === f.id ? '#DCE96C' : '#2c4a3d', pick: () => this.setState({ sel: f.id }) })),
      hasSel: !!cur, noSel: !cur && !loading,
      sName: cur ? cur.name : '', sVillage: cur ? cur.village : '', sState: cur ? (SN[cur.st] || cur.st) : '', sScore: cur ? cur.score : 0,
      sKm: cur ? cur.km.toLocaleString('en-IN') : 0, sAcres: cur ? cur.acres : 0, sTrust: cur ? cur.trust : 0, sSucc: cur ? cur.succ : 0, sCrops: cur ? cur.crops : [], sContracts: cur ? cur.contracts : 0,
      avSkin: cur ? skins[cur.id % 4] : '#D9A47A', avShirt: cur ? shirts[cur.id % 6] : '#4F9BD9', avCap: cur ? caps[cur.id % 4] : '#DCE96C',
      parts: [{ name: 'Crop fit', v: pp.fit }, { name: 'Distance', v: pp.dist }, { name: 'Land', v: pp.land }, { name: 'Trust', v: pp.trust }],
      invText: isInv ? 'Invited · tap to undo' : 'Invite to the project', invBg: isInv ? '#143026' : '#DCE96C', invFg: isInv ? '#E8F1EA' : '#14382b',
      invite: () => { if (cur) this.setState({ invited: { ...invited, [cur.id]: !isInv } }); },
      onInput: (e) => this.setState({ input: e.target.value }),
      run: () => { clearTimeout(this.timer); this.setState({ loading: true }); this.timer = setTimeout(() => this.setState({ applied: this.state.input, loading: false, sel: null }), 900); }
    };
  }
}

export default function RecommendationsPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1000px 620px at 50% 55%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2200px","perspectiveOrigin":"50% 30%"}}><div style={{"position":"absolute","left":"720px","top":"510px","width":"540px","height":"610px","marginLeft":"-270px","marginTop":"-305px","transformStyle":"preserve-3d","transform":"scale(.98) rotateX(48deg)"}}>{v.states.map((s, $index) => (<Fragment key={$index}><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(0px)`)}><path d={s.d} fill={s.fBase} stroke="#0a1511" strokeWidth="1.2" strokeLinejoin="round" style={{"pointerEvents":"all","cursor":"pointer"}} onClick={s.pick} /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zMid}px)`)} aria-hidden="true"><path d={s.d} fill={s.fMid} stroke="#0a1511" strokeWidth="1" strokeLinejoin="round" /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zTop}px)`)} aria-hidden="true"><path d={s.d} fill={s.fTop} stroke={s.stroke} strokeWidth={s.sw} strokeLinejoin="round" /></svg></Fragment>))}{v.pins.map((f, $index) => (<Fragment key={$index}><div onClick={f.pick} style={css(`position:absolute;${f.css}`)} /></Fragment>))}{v.tags.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-48deg);pointer-events:none`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg}`)}><span style={css(`width:8px;height:8px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav><div style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"10px","minHeight":"44px","padding":"0 12px 0 6px","borderRadius":"999px","border":"1px solid #2c4a3d","background":"#12281f99","fontSize":"13px"}}><span style={{"width":"32px","height":"32px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700","fontSize":"12px"}}>CF</span><span><b style={{"display":"block","fontWeight":"600"}}>Chittoor Farmers FPO</b><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>Contractor</span></span></div></header><div style={{"position":"absolute","left":"380px","top":"76px","width":"680px","display":"flex","gap":"8px","zIndex":"4"}}><Link href="/new-project" aria-label="Back to the deal specs" style={{"display":"grid","placeItems":"center","minWidth":"44px","minHeight":"44px","borderRadius":"12px","border":"1px solid #3d6b55","background":"#143026","fontSize":"16px"}}>←</Link><label htmlFor="q" style={{"position":"absolute","width":"1px","height":"1px","overflow":"hidden","clip":"rect(0 0 0 0)"}}>Refine what you need</label><input id="q" className="fld" value={v.input} onChange={v.onInput} placeholder="Describe the farmers you need" /><button className="btn" onClick={v.run} style={{"background":"#DCE96C","color":"#14382b","whiteSpace":"nowrap"}}>Re-run model</button></div>{v.loading && (<><div className="pulse" style={{"position":"absolute","left":"560px","top":"470px","width":"320px","textAlign":"center","padding":"14px 18px","borderRadius":"999px","background":"#0f261ef5","border":"1px solid #DCE96C","fontSize":"14px","fontWeight":"600","zIndex":"4"}}>Running the recommendation model…</div></>)}<aside className="panel" style={{"left":"24px","top":"84px","width":"340px","height":"792px","display":"flex","flexDirection":"column","gap":"10px"}}><div className="kick">BEST LOT FOR THIS DEAL</div><div className="hd" style={{"fontSize":"22px","lineHeight":"1.2"}}>{v.crop} · {v.qty} t</div><div style={{"display":"flex","flexWrap":"wrap","gap":"6px"}}>{v.chips.map((c, $index) => (<Fragment key={$index}><span style={{"padding":"5px 10px","borderRadius":"999px","background":"#1d3f31","border":"1px solid #3d6b55","fontSize":"12px","fontWeight":"600"}}>{c}</span></Fragment>))}</div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Farmers in lot</span><b>{v.lotN}</b></div><div className="stat"><span>Expected supply</span><b>{v.lotT} t</b></div><div className="stat"><span>Combined land</span><b>{v.lotAcres} ac</b></div><div className="stat"><span>Avg distance</span><b>{v.lotKm} km</b></div></div><div style={{"height":"8px","borderRadius":"999px","background":"#1c3a2f","overflow":"hidden"}}><div style={css(`height:100%;width:${v.cover}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div><div className="note" style={{"marginTop":"-4px"}}>{v.coverText}</div><div className="hd" style={{"fontSize":"15px","marginTop":"2px"}}>Ranked shortlist</div><div style={{"display":"flex","flexDirection":"column","gap":"4px"}}>{v.rows.map((r, $index) => (<Fragment key={$index}><button onClick={r.pick} style={css(`display:flex;align-items:center;gap:10px;min-height:44px;padding:0 10px;border-radius:12px;border:1px solid ${r.border};background:${r.bg};color:#E8F1EA;text-align:left;font-size:13px`)}><span style={{"width":"20px","fontWeight":"700","color":"#A9C0B2"}}>{r.rank}</span><span style={{"flex":"1","minWidth":"0"}}><b style={{"fontWeight":"600"}}>{r.name}</b>{" "}<span style={{"color":"#A9C0B2"}}>· {r.st}</span></span><span style={css(`width:8px;height:8px;border-radius:50%;background:${r.dot}`)} /><b style={{"color":"#DCE96C","width":"28px","textAlign":"right"}}>{r.score}</b></button></Fragment>))}</div><div className="note" style={{"marginTop":"auto"}}>Sample model output. Green dot = part of the best lot.</div></aside><aside className="panel" style={{"left":"1076px","top":"84px","width":"340px","height":"792px","display":"flex","flexDirection":"column","gap":"10px"}}>{v.hasSel && (<><div style={{"display":"flex","alignItems":"center","gap":"12px"}}><span style={css(`position:relative;width:60px;height:60px;border-radius:50%;background:${v.avSkin};display:grid;place-items:end center;overflow:hidden;flex:none`)}><span style={css(`width:42px;height:26px;border-radius:18px 18px 0 0;background:${v.avShirt}`)} /><span style={css(`position:absolute;top:6px;width:36px;height:13px;border-radius:14px 14px 3px 3px;background:${v.avCap}`)} /></span><div style={{"flex":"1","minWidth":"0"}}><div className="hd" style={{"fontSize":"22px","lineHeight":"1.15"}}>{v.sName}</div><div style={{"fontSize":"13px","color":"#B9CDC0"}}>{v.sVillage}, {v.sState}</div></div></div><div style={{"display":"flex","alignItems":"center","gap":"14px","padding":"12px","borderRadius":"14px","background":"#143026"}}><div style={css(`position:relative;width:76px;height:76px;border-radius:50%;background:conic-gradient(#DCE96C ${v.sScore}%,#1c3a2f 0);display:grid;place-items:center;flex:none`)} role="img" aria-label={`Match score ${v.sScore} out of 100`}><div style={{"width":"58px","height":"58px","borderRadius":"50%","background":"#0f261e","display":"grid","placeItems":"center"}}><b className="hd" style={{"fontSize":"22px"}}>{v.sScore}</b></div></div><div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"6px","fontSize":"12px"}}>{v.parts.map((p, $index) => (<Fragment key={$index}><div><div style={{"display":"flex","justifyContent":"space-between","color":"#A9C0B2"}}><span>{p.name}</span><span>{p.v}</span></div><div style={{"height":"5px","borderRadius":"999px","background":"#1c3a2f","marginTop":"2px","overflow":"hidden"}}><div style={css(`height:100%;width:${p.v}%;background:#6FD08C`)} /></div></div></Fragment>))}</div></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>From the FPO</span><b>{v.sKm} km</b></div><div className="stat"><span>Land</span><b>{v.sAcres} ac</b></div><div className="stat"><span>Trust score</span><b>{v.sTrust}</b></div><div className="stat"><span>On-time deliveries</span><b>{v.sSucc}%</b></div></div><div style={{"display":"flex","flexWrap":"wrap","gap":"6px","alignItems":"center"}}><span className="note">Grows</span>{v.sCrops.map((c, $index) => (<Fragment key={$index}><span style={{"padding":"4px 10px","borderRadius":"999px","background":"#1d3f31","border":"1px solid #3d6b55","fontSize":"12px","fontWeight":"600"}}>{c}</span></Fragment>))}<span className="note">· {v.sContracts} past contracts</span></div><button className="btn" onClick={v.invite} style={css(`background:${v.invBg};color:${v.invFg}`)}>{v.invText}</button><Link href="/farmers" style={{"display":"grid","placeItems":"center","minHeight":"44px","borderRadius":"12px","border":"1px solid #3d6b55","fontSize":"13px","fontWeight":"600"}}>Open full profile →</Link></>)}{v.noSel && (<><div className="hd" style={{"fontSize":"20px"}}>No farmers match</div><div className="note" style={{"fontSize":"13px"}}>Nothing fits those constraints. Try a larger distance, fewer acres or a lower trust bar, then re-run the model.</div></>)}<div className="note" style={{"marginTop":"auto"}}>Each farmer is pinned in their state. Click a pin or a state to inspect profiles. Match score weights crop fit 40%, distance 25%, land 20% and trust 15%.</div></aside></div>)} />;
}
