// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (NewProject.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "New Project";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:18px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.fld{display:block;width:100%;box-sizing:border-box;min-height:44px;padding:0 12px;margin-top:6px;border-radius:12px;border:1px solid #3d6b55;background:#143026;color:#E8F1EA;font:inherit;font-size:14px;color-scheme:dark}
.lbl{font-size:13px;font-weight:600;display:block}
.btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;font-size:13px;font-weight:600}
.chip{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:#1d3f31;border:1px solid #3d6b55;font-size:12px;font-weight:600;color:#E8F1EA}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:6px;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:600;color:#E8F1EA;box-shadow:0 6px 16px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.lyr{position:absolute;overflow:visible;pointer-events:none;transition:transform .3s ease}
`;

class Logic extends DCLogic {
  state = {
    specs: { exporter: 'LionCity Fresh Imports', produce: 'Mango', qty: 30, dl: '2027-05-20', country: 'Singapore', price: '' },
    messages: [{ role: 'ai', text: 'Congratulations on the deal. Tell me what kind of farmers you want for it: where, how big, how reliable. I will pass this to the recommendation model.' }],
    input: '', last: ''
  };
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
    const { specs, messages, input, last } = this.state;
    const G = this.geo();
    const P = this.parse(last, specs);
    const crops = { Mango: '#F5B83D', Tomato: '#E4584B', Chilli: '#C95FB0', Banana: '#B6E36B', Rice: '#6CC4F0', Groundnut: '#D49A66', Broiler: '#C9A0DC' };
    const suit = { Mango: ['AP', 'KA', 'TN', 'TG', 'KL', 'MH', 'GJ', 'UP', 'BR', 'WB', 'OD'], Tomato: ['AP', 'KA', 'TN', 'TG', 'MH', 'MP', 'WB', 'HP', 'OD'], Chilli: ['AP', 'TG', 'KA', 'MH', 'MP', 'OD', 'WB'],
      Banana: ['TN', 'MH', 'KA', 'AP', 'GJ', 'KL', 'AS', 'BR'], Rice: ['AP', 'TN', 'WB', 'UP', 'PB', 'OD', 'BR', 'AS', 'CG', 'KA'], Groundnut: ['GJ', 'RJ', 'AP', 'KA', 'TN', 'MH', 'MP'], Broiler: ['AP', 'TN', 'KA', 'TG', 'MH'] };
    const C = crops[P.crop] || '#DCE96C';
    const target = P.states.length ? P.states : (suit[P.crop] || []);
    const shade = (hex, m) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * m)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const mix = (hex, a) => { const n = parseInt(hex.slice(1), 16); const bg = [26, 47, 38]; const c = [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v * a + bg[i] * (1 - a))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const states = [], tags = [];
    G.forEach((g) => {
      const on = target.includes(g.a), lift = on ? 22 : 5, top = on ? mix(C, .75) : '#1a2f26';
      states.push({ d: g.d, x: g.x, y: g.y, w: g.w, h: g.h, zMid: lift / 2, zTop: lift, fMid: shade(on ? C : '#2f5a43', .5), fTop: top, stroke: on ? C : '#0a1511', sw: on ? 1.8 : 1.2 });
      if (on && (g.w > 30 || g.h > 30)) tags.push({ x: g.cx, y: g.cy, z: lift + 4, name: g.a, dot: C });
    });
    const chips = [{ text: P.crop + ' · ' + P.qty + ' t', dot: C }, { text: specs.country + ' · by ' + specs.dl, dot: '#6CC4F0' }];
    chips.push({ text: P.maxKm ? 'Within ' + P.maxKm + ' km' : 'Any distance', dot: '#E8F1EA' });
    chips.push({ text: P.minAcres ? '≥ ' + P.minAcres + ' acres' : 'Any land size', dot: '#E8F1EA' });
    chips.push({ text: P.minTrust ? 'Trust ≥ ' + P.minTrust : 'Any trust score', dot: '#DCE96C' });
    if (P.states.length) chips.push({ text: 'States: ' + P.states.join(', '), dot: '#6FD08C' });
    const examples = ['Mango growers within 1000 km, at least 3 acres, trusted', 'Reliable tomato farmers near Chittoor', 'Chilli growers in Telangana or Andhra Pradesh'];
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const on = n[0] === 'New project'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const setS = (key, conv) => (e) => this.setState({ specs: { ...specs, [key]: conv ? conv(e.target.value) : e.target.value } });
    const reply = (text) => {
      const P2 = this.parse(text, specs);
      const bits = [P2.crop + ' growers'];
      if (P2.states.length) bits.push('in ' + P2.states.join(', '));
      if (P2.maxKm) bits.push('within ' + P2.maxKm + ' km of Chittoor');
      if (P2.minAcres) bits.push('with at least ' + P2.minAcres + ' acres');
      if (P2.minTrust) bits.push('and a trust score of ' + P2.minTrust + '+');
      return 'Got it: ' + bits.join(' ') + ' for ' + P2.qty + ' t. I will rank farmers by crop fit, distance, land and trust, then pick the best combination to cover the quantity.';
    };
    const doSend = () => {
      const text = input.trim(); if (!text) return;
      this.setState({ messages: [...messages, { role: 'me', text }, { role: 'ai', text: reply(text) }].slice(-6), input: '', last: text });
    };
    const store = (text) => { try { window.localStorage.setItem('hl_prompt', JSON.stringify({ text, specs })); } catch (e) { /* storage unavailable */ } };
    return {
      states, tags, nav, chips, specs, mapCaption: target.length ? target.length + ' states' : 'all of India',
      produceOpts: Object.keys(crops), countries: ['Singapore', 'UAE', 'Maldives', 'Sri Lanka', 'Malaysia'], input,
      messages: messages.map((m) => ({ text: m.text, just: m.role === 'me' ? 'flex-end' : 'flex-start', bg: m.role === 'me' ? '#DCE96C' : '#1d3f31', fg: m.role === 'me' ? '#14382b' : '#E8F1EA', radius: m.role === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px' })),
      suggest: examples.map((t) => ({ text: t, pick: () => this.setState({ input: t }) })),
      onEx: setS('exporter'), onProd: setS('produce'), onQty: setS('qty', Number), onDl: setS('dl'), onCountry: setS('country'), onPrice: setS('price'),
      onInput: (e) => this.setState({ input: e.target.value }), send: doSend,
      go: () => store(last || input.trim() || (specs.produce + ' growers for ' + specs.qty + ' t'))
    };
  }
}

export default function NewProjectPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1000px 620px at 40% 52%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2000px","perspectiveOrigin":"50% 30%"}}><div style={{"position":"absolute","left":"632px","top":"470px","width":"540px","height":"610px","marginLeft":"-270px","marginTop":"-305px","transformStyle":"preserve-3d","transform":"scale(.66) rotateX(48deg)"}}>{v.states.map((s, $index) => (<Fragment key={$index}><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zMid}px)`)} aria-hidden="true"><path d={s.d} fill={s.fMid} stroke="#0a1511" strokeWidth="1.2" strokeLinejoin="round" /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zTop}px)`)} aria-hidden="true"><path d={s.d} fill={s.fTop} stroke={s.stroke} strokeWidth={s.sw} strokeLinejoin="round" /></svg></Fragment>))}{v.tags.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-48deg);pointer-events:none`)}><div className="tag" style={{"border":"1px solid #2c4a3d","background":"#0f261ee6"}}><span style={css(`width:7px;height:7px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav><div style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"10px","minHeight":"44px","padding":"0 12px 0 6px","borderRadius":"999px","border":"1px solid #2c4a3d","background":"#12281f99","fontSize":"13px"}}><span style={{"width":"32px","height":"32px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700","fontSize":"12px"}}>CF</span><span><b style={{"display":"block","fontWeight":"600"}}>Chittoor Farmers FPO</b><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>Contractor</span></span></div></header><aside className="panel" style={{"left":"24px","top":"84px","width":"360px","height":"792px","display":"flex","flexDirection":"column","gap":"10px"}}><div><div className="kick">STEP 1 · THE DEAL</div><div className="hd" style={{"fontSize":"24px","marginTop":"6px","lineHeight":"1.2"}}>You landed a deal. Tell us the specs.</div></div><div><label className="lbl" htmlFor="ex">Exporter or buyer</label><input id="ex" className="fld" value={v.specs.exporter} onChange={v.onEx} /></div><div><label className="lbl" htmlFor="prod">Produce</label><select id="prod" className="fld" value={v.specs.produce} onChange={v.onProd}>{v.produceOpts.map((o, $index) => (<Fragment key={$index}><option value={o}>{o}</option></Fragment>))}</select></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div><label className="lbl" htmlFor="qty">Quantity (t)</label><input id="qty" type="number" min="1" className="fld" value={v.specs.qty} onChange={v.onQty} /></div><div><label className="lbl" htmlFor="dl">Deadline</label><input id="dl" type="date" className="fld" value={v.specs.dl} onChange={v.onDl} /></div></div><div><label className="lbl" htmlFor="country">Destination country</label><select id="country" className="fld" value={v.specs.country} onChange={v.onCountry}>{v.countries.map((o, $index) => (<Fragment key={$index}><option value={o}>{o}</option></Fragment>))}</select></div><div><label className="lbl" htmlFor="price">Agreed price (₹/kg, optional)</label><input id="price" type="number" min="0" className="fld" value={v.specs.price} onChange={v.onPrice} placeholder="e.g. 85" /></div><div className="note" style={{"marginTop":"auto"}}>Quantity and produce also guide the recommendation model. Anything you say in the chat can refine them.</div></aside><section className="panel" style={{"left":"400px","top":"742px","width":"440px","height":"134px","display":"flex","flexDirection":"column","gap":"8px"}}><div className="kick">WHAT I UNDERSTOOD</div><div style={{"display":"flex","flexWrap":"wrap","gap":"6px"}}>{v.chips.map((c, $index) => (<Fragment key={$index}><span className="chip"><span style={css(`width:8px;height:8px;border-radius:50%;background:${c.dot}`)} />{c.text}</span></Fragment>))}</div></section><div style={{"position":"absolute","left":"400px","top":"90px","width":"440px","textAlign":"center","fontSize":"13px","color":"#B9CDC0"}}>Where I will look ·{" "}<b style={{"color":"#E8F1EA"}}>{v.mapCaption}</b></div><aside className="panel" style={{"left":"860px","top":"84px","width":"556px","height":"792px","display":"flex","flexDirection":"column","gap":"12px"}}><div><div className="kick">STEP 2 · WHO DO YOU NEED?</div><div className="hd" style={{"fontSize":"24px","marginTop":"6px","lineHeight":"1.2"}}>Describe the farmers you want</div></div><div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"10px","overflow":"hidden","justifyContent":"flex-end"}} aria-live="polite">{v.messages.map((m, $index) => (<Fragment key={$index}><div style={css(`display:flex;justify-content:${m.just}`)}><div style={css(`max-width:84%;padding:12px 14px;border-radius:${m.radius};background:${m.bg};color:${m.fg};font-size:14px;line-height:1.5`)}>{m.text}</div></div></Fragment>))}</div><div style={{"display":"flex","flexWrap":"wrap","gap":"6px"}}>{v.suggest.map((s, $index) => (<Fragment key={$index}><button onClick={s.pick} style={{"minHeight":"36px","padding":"0 12px","borderRadius":"999px","border":"1px solid #3d6b55","background":"#143026","color":"#E8F1EA","fontSize":"12px"}}>{s.text}</button></Fragment>))}</div><div style={{"display":"flex","gap":"8px"}}><label htmlFor="msg" style={{"position":"absolute","width":"1px","height":"1px","overflow":"hidden","clip":"rect(0 0 0 0)"}}>Describe the farmers you need</label><input id="msg" className="fld" style={{"marginTop":"0"}} value={v.input} onChange={v.onInput} placeholder="e.g. mango growers within 500 km, at least 3 acres, trusted" /><button className="btn" onClick={v.send} style={{"background":"#143026","color":"#E8F1EA"}}>Send</button></div><Link href="/recommendations" onClick={v.go} style={{"display":"grid","placeItems":"center","minHeight":"52px","borderRadius":"14px","background":"#DCE96C","color":"#14382b","fontSize":"15px","fontWeight":"700"}}>Find the best farmers →</Link></aside></div>)} />;
}
