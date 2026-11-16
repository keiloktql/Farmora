// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Recommendations.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';
import { describePreferences } from '@/lib/recommender/preferences';

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
.chip-x{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 6px 0 10px;border-radius:999px;background:#1d3f31;border:1px solid #3d6b55;color:#E8F1EA;font-size:12px;font-weight:600}
.chip-x span{display:grid;place-items:center;width:18px;height:18px;border-radius:50%;background:#0f261e;color:#A9C0B2;font-size:12px}
.chip-x:hover span{background:#E4584B;color:#fff}
.sugg{min-height:30px;padding:0 10px;border-radius:999px;border:1px dashed #3d6b55;background:transparent;color:#B9CDC0;font-size:12px}
.sugg:hover{border-color:#DCE96C;color:#DCE96C}
.msg{max-width:86%;padding:8px 12px;border-radius:14px;font-size:13px;line-height:1.45}
.msg.me{align-self:flex-end;background:#DCE96C;color:#14382b;border-bottom-right-radius:4px;font-weight:500}
.msg.bot{align-self:flex-start;background:#143026;border:1px solid #2c4a3d;border-bottom-left-radius:4px}
.msg.bot small{display:block;margin-top:3px;color:#A9C0B2;font-size:12px}
`;

class Logic extends DCLogic {
  state = {
    specs: { exporter: 'LionCity Fresh Imports', produce: 'Mango', qty: 30, dl: '2027-05-20', country: 'Singapore', price: '' },
    input: '', prefs: {}, msgs: [], sending: false, zoomAll: false,
    loading: true, sel: null, invited: {}, result: null, extra: 0, error: null, contract: null, saving: false, saved: null
  };
  timer = null;
  /** Ask the backend recommender (/api/recommend) using the chat's current preferences. */
  async fetchRec(prefs) {
    const k = this.state.contract;
    const { crop, qtyT, extraPlanted, ...constraints } = prefs || {};
    this.setState({ loading: true });
    try {
      const res = await fetch('/api/recommend', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ crop: k ? k.produce : (crop || this.state.specs.produce), qtyT: k ? k.qtyT : (Number(qtyT) || Number(this.state.specs.qty) || 20), contractId: k ? k.id : undefined, constraints }) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Recommender failed');
      this.setState({ result, loading: false, sel: null, error: null, saved: null });
      return result;
    } catch (e) {
      this.setState({ loading: false, error: String(e && e.message || e) });
      return null;
    }
  }
  /** One line describing what the recommender now picks, compared with the previous run. */
  summary(result, prev) {
    if (!result) return 'The recommender could not run: ' + (this.state.error || 'unknown error');
    const pick = (r) => r.options.find((x) => x.extraPlanted === this.state.extra) || r.options[0];
    const o = pick(result), n = result.shortlist.length;
    if (!n) return 'No farmers match all of these. Remove a preference above or loosen one.';
    let t = n + ' farmers qualify → lot of ' + o.farmers + ' across ' + o.regions + ' districts, ';
    t += o.feasible ? o.plannedT + ' t planned' : 'short by ' + o.shortByT + ' t';
    if (o.chance != null) {
      t += ' · ' + Math.round(o.chance * 100) + '% chance of full delivery';
      const po = prev ? pick(prev) : null;
      if (po && po.chance != null) { const d = Math.round((o.chance - po.chance) * 100); if (d) t += ' (' + (d > 0 ? '+' : '') + d + ' pts)'; }
    }
    return t;
  }
  push(...m) {
    this.setState({ msgs: [...this.state.msgs, ...m].slice(-40) });
    setTimeout(() => { const el = document.getElementById('chatlog'); if (el) el.scrollTop = el.scrollHeight; }, 30);
  }
  /** Send a chat message: the backend turns it into preferences, then the recommender re-runs with them. */
  async send(text) {
    const msg = String(text ?? this.state.input).trim();
    if (!msg || this.state.sending) return;
    this.push({ who: 'me', text: msg });
    this.setState({ input: '', sending: true });
    try {
      const res = await fetch('/api/recommend/interpret', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: msg, current: this.state.prefs }) });
      const r = await res.json();
      if (!res.ok) throw new Error(r.error || 'Could not read that');
      if (!r.understood) {
        this.push({ who: 'bot', text: 'I could not find a farmer preference in that.', sub: 'Try: ' + r.help.slice(0, 6).map((h) => '“' + h + '”').join(', ') });
        if (!this.state.result) await this.fetchRec(this.state.prefs);
      } else {
        let prefs = r.prefs, changes = r.changes;
        if (this.state.contract && (prefs.crop || prefs.qtyT)) {
          const { crop, qtyT, ...rest } = prefs; prefs = rest;
          changes = changes.filter((c) => !/^(Crop|Quantity)/.test(c));
          if (!changes.length) changes = ['Crop and quantity are fixed by ' + this.state.contract.id];
        }
        const prev = this.state.result;
        this.setState({ prefs, extra: prefs.extraPlanted ?? this.state.extra });
        const result = await this.fetchRec(prefs);
        this.push({ who: 'bot', text: '✓ ' + changes.join(' · '), sub: this.summary(result, prev) });
      }
    } catch (e) {
      this.push({ who: 'bot', text: 'Something went wrong: ' + String(e && e.message || e) });
      this.setState({ loading: false });
    }
    this.setState({ sending: false });
  }
  /** Remove one active preference (chip ×) and re-run. */
  async removePref(key, label) {
    const prefs = { ...this.state.prefs }; delete prefs[key];
    const prev = this.state.result;
    this.setState({ prefs });
    const result = await this.fetchRec(prefs);
    this.push({ who: 'bot', text: 'Removed: ' + label, sub: this.summary(result, prev) });
  }
  /** Save the lot shown (with the chat's preferences and the chosen extra planting) to the contract. */
  async allocate() {
    const k = this.state.contract; if (!k) return;
    const { crop, qtyT, extraPlanted, ...constraints } = this.state.prefs;
    this.setState({ saving: true });
    try {
      const res = await fetch('/api/contracts/' + k.id + '/allocate', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ extraPlanted: this.state.extra, constraints }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      this.setState({ saving: false, saved: data });
      this.push({ who: 'bot', text: 'Saved ✓ ' + data.allocation.lot.length + ' farmers on ' + data.id + ', with these preferences.' });
    } catch (e) { this.setState({ saving: false, error: String(e && e.message || e) }); }
  }
  async componentDidMount() {
    if (this._started) return; // dev mode mounts twice; run the opening request once
    this._started = true;
    const cid = new URLSearchParams(window.location.search).get('contract');
    if (cid) {
      try {
        const res = await fetch('/api/contracts/' + encodeURIComponent(cid));
        const k = await res.json();
        if (!res.ok) throw new Error(k.error || 'Contract not found');
        const prefs = k.constraints || {};
        const extra = k.allocation ? k.allocation.extraPlanted : 0;
        this.setState({ contract: k, prefs, extra, specs: { exporter: k.exporter, produce: k.produce, qty: k.qtyT, dl: k.deliverBy, country: k.country, price: k.pricePerKg || '' } });
        const result = await this.fetchRec(prefs);
        this.push({ who: 'bot', text: 'Picking farmers for ' + k.id + ': ' + k.produce + ' ' + k.qtyT + ' t for ' + k.exporter + '. Tell me how to choose, e.g. “no rain-fed farms” or “prefer closer farmers”.', sub: this.summary(result, null) });
      } catch (e) { this.setState({ loading: false, error: String(e && e.message || e) }); }
      return;
    }
    let text = 'I got a 30 t mango deal for Singapore. I want trusted farmers within 1000 km with at least 3 acres.';
    try {
      const raw = window.localStorage.getItem('hl_prompt');
      if (raw) { const d = JSON.parse(raw); if (d && d.text) { text = d.text; if (d.specs) this.setState({ specs: d.specs }); } }
    } catch (e) { /* storage unavailable: keep the default prompt */ }
    this.send(text);
  }
  componentWillUnmount() { clearTimeout(this.timer); }
  geo() {
    if (this._g) return this._g;
    const W = 540, H = 610;
    const pr = (p) => [(p[0] - 68) / 30 * W, (37.5 - p[1]) / 31.5 * H];
    this._pr = pr;
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
    const { specs, input, loading, sel, invited, prefs, msgs, sending } = this.state;
    const G = this.geo();
    const K0 = this.state.contract;
    const P = { crop: K0 ? K0.produce : (prefs.crop || specs.produce), qty: K0 ? K0.qtyT : (Number(prefs.qtyT) || Number(specs.qty) || 20) };
    const { result, extra, error } = this.state;
    // Shortlist and lot come from the backend recommender (src/lib/recommender, POST /api/recommend).
    const F = (result ? result.shortlist : []).map((f) => ({ id: f.id, name: f.name, st: f.state, village: f.village || f.district || '', km: f.kmFromFpo, acres: f.totalAcres,
      lat: f.lat, lon: f.lon, crops: f.crops, trust: f.trust, succ: f.onTimePct, contracts: f.pastContracts, risk: f.riskScore, flags: f.flags, reasons: f.reasons, sens: f.sensitivity }));
    const SN = {}; G.forEach((g) => { SN[g.a] = g.name; });
    const opt = result ? (result.options.find((o) => o.extraPlanted === extra) || result.options[0]) : null;
    const lotLine = (id) => (opt ? opt.lot.find((l) => l.id === id) : null);
    const label = (f) => (f.risk == null ? '—' : f.risk);
    const short = loading ? [] : F.slice(0, 10);
    const lot = opt ? opt.lot.map((l) => l.id) : [];
    const inLot = (id) => lot.includes(id);
    const cur = short.find((f) => f.id === sel) || short[0] || null;
    const C = { Mango: '#F5B83D', Tomato: '#E4584B', Chilli: '#C95FB0', Banana: '#B6E36B', Rice: '#6CC4F0', Groundnut: '#D49A66', Broiler: '#C9A0DC' }[P.crop] || '#DCE96C';
    const shade = (hex, m) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * m)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const byState = {}; short.forEach((f) => { (byState[f.st] = byState[f.st] || []).push(f); });
    // Where each shortlisted farmer sits on the map: their real location, or their state's centre if unknown.
    const GC = {}; G.forEach((g) => { GC[g.a] = g; });
    const FPO = [199.8, 470.6];
    const spot = (f) => (f.lat != null && f.lon != null ? this._pr([f.lon, f.lat]) : (GC[f.st] ? [GC[f.st].cx, GC[f.st].cy] : FPO));
    // Zoom: fit the shortlisted farmers and the FPO into view (unless "Show all India" is on).
    const pts = [FPO, ...short.map(spot)];
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
    const bw = Math.max(160, bx1 - bx0 + 130), bh = Math.max(160, by1 - by0 + 150);
    const zoomed = !this.state.zoomAll && short.length > 0;
    const zs = zoomed ? Math.max(1, Math.min(2.2, 600 / (bw * .84), 360 / (bh * .56))) : 1;
    const zx = zoomed ? 270 - (bx0 + bx1) / 2 : 0, zy = zoomed ? 305 - (by0 + by1) / 2 : 0, k = 1 / zs;
    const states = [], pins = [], tags = [];
    G.forEach((g) => {
      const list = byState[g.a] || [], on = list.length > 0, isSel = !!cur && cur.st === g.a, lift = (on ? 16 : 5) * k;
      const top = on ? '#2b6a4b' : '#1a2f26';
      states.push({ d: g.d, x: g.x, y: g.y, w: g.w, h: g.h, zMid: lift / 2, zTop: lift, fBase: shade(top, .45), fMid: shade(top, .65), fTop: top, stroke: isSel ? '#DCE96C' : '#0a1511', sw: (isSel ? 3 : 1.2) * k,
        pick: () => { if (list.length) this.setState({ sel: list[0].id }); } });
      list.forEach((f) => {
        const [px, py] = spot(f), sz = 10 * k, x = px - sz / 2, y = py - sz / 2;
        const isCur = cur && cur.id === f.id, col = isCur ? '#DCE96C' : (inLot(f.id) ? C : '#8fb7a0'), h = (isCur ? 36 : 22) * k, pick = () => this.setState({ sel: f.id });
        pins.push({ pick, css: `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${col};transform:translateZ(${lift + h}px);cursor:pointer;box-shadow:0 0 ${(isCur ? 20 : 8) * k}px ${col};` });
        pins.push({ pick, css: `left:${x}px;top:${y + sz}px;width:${sz}px;height:${h}px;background:${shade(col, .7)};transform-origin:0 0;transform:translateZ(${lift}px) rotateX(90deg);cursor:pointer;` });
        // Only the selected farmer gets a name label, so close-together farms don't pile up.
        if (isCur) tags.push({ x: px, y: py, z: lift + h + 10 * k, name: f.name + ' · ' + (f.risk == null ? 'risk —' : 'risk ' + f.risk), dot: col, border: '#DCE96C', bg: '#0f261ef2', below: false });
      });
      if (on && !zoomed && !isSel) tags.push({ x: g.cx, y: g.cy, z: lift + 40, name: g.a + ' · ' + list.length, dot: C, border: '#2c4a3d', bg: '#0f261ee6', below: false });
    });
    tags.push({ x: FPO[0], y: FPO[1], z: 34 * k, name: 'Chittoor FPO', dot: '#DCE96C', border: '#DCE96C', bg: '#0f261ef2', below: true });
    const mapTf = `scale(.84) rotateX(48deg) scale3d(${zs},${zs},${zs}) translate(${zx}px,${zy}px)`;
    const lotF = F.filter((f) => inLot(f.id));
    const lotKm = lotF.length ? Math.round(lotF.reduce((s, f) => s + f.km, 0) / lotF.length) : 0;
    const qty = result ? result.qtyT : P.qty;
    const K = this.state.contract, S = this.state.saved;
    const skins = ['#D9A47A', '#C98F63', '#8D5A3B', '#E8B98A'], shirts = ['#E4A04B', '#4F9BD9', '#E4584B', '#8E7CC3', '#4FB3A9', '#C95FB0'], caps = ['#DCE96C', '#E8F1EA', '#F2A65A', '#6CC4F0'];
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Contracts'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const isInv = cur ? !!invited[cur.id] : false;
    const names = {}; (result ? result.shortlist : []).forEach((f) => { names[f.id] = f.name; });
    const prefChips = describePreferences(prefs, names);
    return {
      profileHref: cur ? '/farmers?id=' + cur.id : '/farmers',
      backHref: K0 ? '/contracts?id=' + K0.id : '/new-project', backLabel: K0 ? 'Back to ' + K0.id : 'Back to the new project',
      states, pins, tags, nav, input, loading, mapTf, tagK: k, zoomed, canZoom: short.length > 0,
      zoomText: this.state.zoomAll ? 'Zoom to farmers' : 'Show all India', toggleZoom: () => this.setState({ zoomAll: !this.state.zoomAll }), crop: P.crop, qty: P.qty,
      chips: prefChips.length ? prefChips.map((c) => c.label) : ['No preferences yet: all ' + P.crop.toLowerCase() + ' growers'],
      prefChips: prefChips.map((c) => ({ label: c.label, remove: () => this.removePref(c.key, c.label) })),
      msgs, sending, canSend: !sending && !!input.trim(),
      prefSummary: prefChips.length ? prefChips.length + ' preference' + (prefChips.length > 1 ? 's' : '') + ' from the chat: ' + prefChips.map((c) => c.label).join(' · ') : 'No preferences yet: all ' + P.crop.toLowerCase() + ' growers considered',
      rankTitle: prefs.priority === 'distance' ? 'Ranked nearest first' : prefs.priority === 'balanced' ? 'Ranked by risk + distance' : 'Ranked by climate risk',
      suggestions: (K0 ? ['no rain-fed farms', 'prefer closer farmers', 'spread it out more', 'risk below 20', 'within 500 km'] : ['no rain-fed farms', 'prefer closer farmers', 'spread it out more', 'only Andhra and Karnataka', 'risk below 20']).map((t) => ({ text: t, pick: () => this.send(t) })),
      send: (e) => { if (e && e.preventDefault) e.preventDefault(); this.send(); },
      lotN: opt ? opt.farmers : 0, lotT: opt ? opt.plannedT.toFixed(1) : '0.0', lotAcres: opt ? opt.landAcres.toFixed(1) : '0.0', lotKm: lotKm.toLocaleString('en-IN'),
      cover: opt ? Math.min(100, opt.plannedT / qty * 100).toFixed(0) : 0,
      coverText: error ? 'Recommender unavailable: ' + error : (!opt || !opt.farmers ? 'No matching farmers yet.' : (opt.feasible
        ? 'Plans ' + opt.plannedT + ' t for the ' + qty + ' t contract across ' + opt.regions + ' regions.'
        : 'Short by ' + opt.shortByT + ' t with at most ' + Math.round((prefs.farmerCap ?? .08) * 100) + '% per farmer and ' + Math.round((prefs.regionCap ?? .25) * 100) + '% per district. Loosen a preference in the chat.')),
      chanceText: !opt ? '' : (opt.chance == null ? 'Chance of full delivery: ' + opt.chanceNote
        : Math.round(opt.chance * 100) + '% chance of full delivery · if short, typical gap ' + opt.avgShortfallWhenShortT + ' t'),
      dataNote: result && result.dataStatus.notes.length ? result.dataStatus.notes.join(' ') : '',
      contractMode: !!K, kTitle: K ? K.exporter + ' · ' + K.id : '', canAllocate: !!K && !!opt && opt.farmers > 0 && !this.state.saving,
      allocText: this.state.saving ? 'Saving…' : (K ? 'Allocate this lot to ' + K.id : ''), allocate: () => this.allocate(),
      savedText: S ? 'Saved ✓ ' + S.allocation.lot.length + ' farmers on ' + S.id : '', savedLink: S ? '/contracts?id=' + S.id : '', isSaved: !!S,
      extras: [0, 0.1].map((x) => ({ text: x ? 'Plant 10% extra' : 'Plant exactly the contract', bg: x === extra ? '#DCE96C' : '#143026', fg: x === extra ? '#14382b' : '#E8F1EA', pick: () => this.setState({ extra: x, prefs: { ...prefs, extraPlanted: x } }) })),
      rows: short.slice(0, this.state.contract ? 5 : 6).map((f, i) => ({ rank: i + 1, name: f.name, st: f.st, score: label(f), dot: inLot(f.id) ? '#6FD08C' : 'transparent', bg: cur && cur.id === f.id ? '#1d3f31' : '#143026', border: cur && cur.id === f.id ? '#DCE96C' : '#2c4a3d', pick: () => this.setState({ sel: f.id }) })),
      hasSel: !!cur, noSel: !cur && !loading,
      sName: cur ? cur.name : '', sVillage: cur ? cur.village : '', sState: cur ? (SN[cur.st] || cur.st) : '', sScore: cur && cur.risk != null ? cur.risk : 0, sScoreText: cur ? label(cur) : '—',
      sKm: cur ? cur.km.toLocaleString('en-IN') : 0, sAcres: cur ? cur.acres : 0, sTrust: cur && cur.trust != null ? cur.trust : '—',
      sPlant: cur && lotLine(cur.id) ? lotLine(cur.id).acres + ' ac' : 'Not in lot', sCrops: cur ? cur.crops : [], sContracts: cur ? cur.contracts : 0,
      sFlags: cur ? cur.flags.join(' · ') : '', sReasons: cur ? cur.reasons.join(' · ') : '',
      avSkin: cur ? skins[cur.id % 4] : '#D9A47A', avShirt: cur ? shirts[cur.id % 6] : '#4F9BD9', avCap: cur ? caps[cur.id % 4] : '#DCE96C',
      parts: cur ? [
        { name: 'Climate risk (lower is better)', v: cur.risk == null ? 0 : cur.risk, label: cur.risk == null ? 'not loaded' : cur.risk },
        { name: 'Weather sensitivity', v: Math.round(Math.min(cur.sens / 1.5, 1) * 100), label: cur.sens + '×' },
        { name: 'Share of this deal', v: opt && lotLine(cur.id) ? Math.round(lotLine(cur.id).tonnes / qty * 100 / 0.08) : 0, label: opt && lotLine(cur.id) ? (lotLine(cur.id).tonnes / qty * 100).toFixed(1) + '%' : '—' },
      ] : [],
      invText: isInv ? 'Invited · tap to undo' : 'Invite to the project', invBg: isInv ? '#143026' : '#DCE96C', invFg: isInv ? '#E8F1EA' : '#14382b',
      invite: () => { if (cur) this.setState({ invited: { ...invited, [cur.id]: !isInv } }); },
      onInput: (e) => this.setState({ input: e.target.value }),
    };
  }
}

export default function RecommendationsPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1000px 620px at 50% 55%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2200px","perspectiveOrigin":"50% 30%","clipPath":"inset(66px 372px 318px 372px round 18px)"}}><div style={{"position":"absolute","left":"720px","top":"350px","width":"540px","height":"610px","marginLeft":"-270px","marginTop":"-305px","transformStyle":"preserve-3d","transform":v.mapTf,"transition":"transform .6s ease"}}>{v.states.map((s, $index) => (<Fragment key={$index}><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(0px)`)}><path d={s.d} fill={s.fBase} stroke="#0a1511" strokeWidth="1.2" strokeLinejoin="round" style={{"pointerEvents":"all","cursor":"pointer"}} onClick={s.pick} /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zMid}px)`)} aria-hidden="true"><path d={s.d} fill={s.fMid} stroke="#0a1511" strokeWidth="1" strokeLinejoin="round" /></svg><svg className="lyr" width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} style={css(`left:${s.x}px;top:${s.y}px;transform:translateZ(${s.zTop}px)`)} aria-hidden="true"><path d={s.d} fill={s.fTop} stroke={s.stroke} strokeWidth={s.sw} strokeLinejoin="round" /></svg></Fragment>))}{v.pins.map((f, $index) => (<Fragment key={$index}><div onClick={f.pick} style={css(`position:absolute;${f.css}`)} /></Fragment>))}{v.tags.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-48deg) scale(${v.tagK});pointer-events:none`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg}${l.below ? ';transform:translate(10px,-50%)' : ''}`)}><span style={css(`width:8px;height:8px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>Farmora</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link></Fragment>))}</nav><div style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"10px","minHeight":"44px","padding":"0 12px 0 6px","borderRadius":"999px","border":"1px solid #2c4a3d","background":"#12281f99","fontSize":"13px"}}><span style={{"width":"32px","height":"32px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700","fontSize":"12px"}}>CF</span><span><b style={{"display":"block","fontWeight":"600"}}>Chittoor Farmers FPO</b><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>Contractor</span></span></div></header><div style={{"position":"absolute","left":"380px","top":"80px","width":"680px","display":"flex","alignItems":"center","gap":"10px","zIndex":"4"}}><Link href={v.backHref} aria-label={v.backLabel} style={{"display":"grid","placeItems":"center","minWidth":"40px","minHeight":"40px","borderRadius":"12px","border":"1px solid #3d6b55","background":"#143026","fontSize":"16px"}}>←</Link><div className="note" style={{"fontSize":"13px"}}>Tell the recommender how to pick farmers in the chat below. Each message adds to the preferences; tap × on a chip to drop one.</div></div>{v.canZoom && (<button className="btn" onClick={v.toggleZoom} style={{"position":"absolute","left":"914px","top":"132px","minHeight":"36px","padding":"0 12px","background":"#143026cc","color":"#E8F1EA","fontSize":"12px","zIndex":"4"}}>{v.zoomText}</button>)}{v.loading && (<><div className="pulse" style={{"position":"absolute","left":"560px","top":"360px","width":"320px","textAlign":"center","padding":"12px 18px","borderRadius":"999px","background":"#0f261ef5","border":"1px solid #DCE96C","fontSize":"14px","fontWeight":"600","zIndex":"4"}}>Running the recommendation model…</div></>)}<section className="panel" aria-label="Recommender chat" style={{"left":"380px","top":"584px","width":"680px","height":"292px","padding":"14px","display":"flex","flexDirection":"column","gap":"8px","zIndex":"4"}}><div style={{"display":"flex","alignItems":"center","gap":"8px","flexWrap":"wrap","minHeight":"28px"}}><span className="kick" style={{"marginRight":"4px"}}>PREFERENCES</span>{v.prefChips.length ? v.prefChips.map((c, $index) => (<Fragment key={$index}><button className="chip-x" onClick={c.remove} aria-label={"Remove " + c.label}>{c.label}<span aria-hidden="true">×</span></button></Fragment>)) : (<span className="note">None yet: every grower of this crop is considered.</span>)}</div><div id="chatlog" role="log" aria-live="polite" style={{"flex":"1","minHeight":"0","overflowY":"auto","display":"flex","flexDirection":"column","gap":"6px","padding":"4px 2px"}}>{v.msgs.map((m, $index) => (<Fragment key={$index}><div className={"msg " + m.who}>{m.text}{m.sub && (<small>{m.sub}</small>)}</div></Fragment>))}{v.sending && (<div className="msg bot pulse">Updating the lot…</div>)}</div><div style={{"display":"flex","gap":"6px","flexWrap":"nowrap","overflow":"hidden"}}>{v.suggestions.map((g, $index) => (<Fragment key={$index}><button className="sugg" onClick={g.pick} disabled={v.sending} style={{"whiteSpace":"nowrap"}}>{g.text}</button></Fragment>))}</div><form onSubmit={v.send} style={{"display":"flex","gap":"8px"}}><label htmlFor="q" style={{"position":"absolute","width":"1px","height":"1px","overflow":"hidden","clip":"rect(0 0 0 0)"}}>Message the recommender</label><input id="q" className="fld" autoComplete="off" value={v.input} onChange={v.onInput} placeholder="e.g. avoid Kolar, only drip farms, max 5% per farmer, prefer closer farmers…" /><button className="btn" type="submit" disabled={!v.canSend} style={{"background":"#DCE96C","color":"#14382b","whiteSpace":"nowrap","opacity": v.canSend ? 1 : .55}}>Send</button></form></section><aside className="panel" style={{"left":"24px","top":"84px","width":"340px","height":"792px","display":"flex","flexDirection":"column","gap":"10px"}}><div className="kick">{v.contractMode ? "BEST LOT · " + v.kTitle : "BEST LOT FOR THIS DEAL"}</div><div className="hd" style={{"fontSize":"22px","lineHeight":"1.2"}}>{v.crop} · {v.qty} t</div><div className="note" style={{"marginTop":"-4px","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}} title={v.chips.join(" · ")}>{v.prefSummary}</div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Farmers in lot</span><b>{v.lotN}</b></div><div className="stat"><span>Expected supply</span><b>{v.lotT} t</b></div><div className="stat"><span>Combined land</span><b>{v.lotAcres} ac</b></div><div className="stat"><span>Avg distance</span><b>{v.lotKm} km</b></div></div><div style={{"height":"8px","borderRadius":"999px","background":"#1c3a2f","overflow":"hidden"}}><div style={css(`height:100%;width:${v.cover}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div><div className="note" style={{"marginTop":"-4px"}}>{v.coverText}</div><div role="group" aria-label="Extra planted" style={{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"6px"}}>{v.extras.map((x, $index) => (<Fragment key={$index}><button onClick={x.pick} aria-pressed={x.bg === "#DCE96C"} style={css(`min-height:36px;border-radius:10px;border:1px solid #3d6b55;background:${x.bg};color:${x.fg};font-size:12px;font-weight:600`)}>{x.text}</button></Fragment>))}</div><div style={{"padding":"8px 10px","borderRadius":"10px","background":"#143026","fontSize":"12px","lineHeight":"1.45","color":"#E8F1EA"}}>{v.chanceText}</div>{v.contractMode && !v.isSaved && (<button className="btn" disabled={!v.canAllocate} onClick={v.allocate} style={{"background":"#DCE96C","color":"#14382b","opacity": v.canAllocate ? 1 : .5}}>{v.allocText}</button>)}{v.isSaved && (<Link href={v.savedLink} style={{"display":"grid","placeItems":"center","minHeight":"44px","borderRadius":"12px","background":"#1f4a33","border":"1px solid #4fbf72","color":"#8BE3A6","fontSize":"13px","fontWeight":"600"}}>{v.savedText} · View contract →</Link>)}<div className="hd" style={{"fontSize":"15px","marginTop":"2px"}}>{v.rankTitle}</div><div style={{"display":"flex","flexDirection":"column","gap":"4px"}}>{v.rows.map((r, $index) => (<Fragment key={$index}><button onClick={r.pick} style={css(`display:flex;align-items:center;gap:10px;min-height:44px;padding:0 10px;border-radius:12px;border:1px solid ${r.border};background:${r.bg};color:#E8F1EA;text-align:left;font-size:13px`)}><span style={{"width":"20px","fontWeight":"700","color":"#A9C0B2"}}>{r.rank}</span><span style={{"flex":"1","minWidth":"0"}}><b style={{"fontWeight":"600"}}>{r.name}</b>{" "}<span style={{"color":"#A9C0B2"}}>· {r.st}</span></span><span style={css(`width:8px;height:8px;border-radius:50%;background:${r.dot}`)} /><b style={{"color":"#DCE96C","width":"28px","textAlign":"right"}}>{r.score}</b></button></Fragment>))}</div><div className="note" style={{"marginTop":"auto"}} title={v.dataNote}>Green dot = in the lot · — = climate history not loaded yet.</div></aside><aside className="panel" style={{"left":"1076px","top":"84px","width":"340px","height":"792px","display":"flex","flexDirection":"column","gap":"10px"}}>{v.hasSel && (<><div style={{"display":"flex","alignItems":"center","gap":"12px"}}><span style={css(`position:relative;width:60px;height:60px;border-radius:50%;background:${v.avSkin};display:grid;place-items:end center;overflow:hidden;flex:none`)}><span style={css(`width:42px;height:26px;border-radius:18px 18px 0 0;background:${v.avShirt}`)} /><span style={css(`position:absolute;top:6px;width:36px;height:13px;border-radius:14px 14px 3px 3px;background:${v.avCap}`)} /></span><div style={{"flex":"1","minWidth":"0"}}><div className="hd" style={{"fontSize":"22px","lineHeight":"1.15"}}>{v.sName}</div><div style={{"fontSize":"13px","color":"#B9CDC0"}}>{v.sVillage}, {v.sState}</div></div></div><div style={{"display":"flex","alignItems":"center","gap":"14px","padding":"12px","borderRadius":"14px","background":"#143026"}}><div style={css(`position:relative;width:76px;height:76px;border-radius:50%;background:conic-gradient(#DCE96C ${v.sScore}%,#1c3a2f 0);display:grid;place-items:center;flex:none`)} role="img" aria-label={`Climate risk ${v.sScoreText}`}><div style={{"width":"58px","height":"58px","borderRadius":"50%","background":"#0f261e","display":"grid","placeItems":"center"}}><b className="hd" style={{"fontSize":"22px"}}>{v.sScoreText}</b></div></div><div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"6px","fontSize":"12px"}}>{v.parts.map((p, $index) => (<Fragment key={$index}><div><div style={{"display":"flex","justifyContent":"space-between","color":"#A9C0B2"}}><span>{p.name}</span><span>{p.label}</span></div><div style={{"height":"5px","borderRadius":"999px","background":"#1c3a2f","marginTop":"2px","overflow":"hidden"}}><div style={css(`height:100%;width:${p.v}%;background:#6FD08C`)} /></div></div></Fragment>))}</div></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>From the FPO</span><b>{v.sKm} km</b></div><div className="stat"><span>Land</span><b>{v.sAcres} ac</b></div><div className="stat"><span>Trust (display only)</span><b>{v.sTrust}</b></div><div className="stat"><span>Plant for this deal</span><b>{v.sPlant}</b></div></div><div style={{"display":"flex","flexWrap":"wrap","gap":"6px","alignItems":"center"}}><span className="note">Grows</span>{v.sCrops.map((c, $index) => (<Fragment key={$index}><span style={{"padding":"4px 10px","borderRadius":"999px","background":"#1d3f31","border":"1px solid #3d6b55","fontSize":"12px","fontWeight":"600"}}>{c}</span></Fragment>))}<span className="note">· {v.sContracts} past contracts</span></div>{v.sReasons && (<div className="note" style={{"color":"#D7E6DC"}}>{v.sReasons}</div>)}{v.sFlags && (<div className="note" style={{"color":"#F2C46B"}}>⚠ {v.sFlags}</div>)}<button className="btn" onClick={v.invite} style={css(`background:${v.invBg};color:${v.invFg}`)}>{v.invText}</button><Link href={v.profileHref} style={{"display":"grid","placeItems":"center","minHeight":"44px","borderRadius":"12px","border":"1px solid #3d6b55","fontSize":"13px","fontWeight":"600"}}>Open full profile →</Link></>)}{v.noSel && (<><div className="hd" style={{"fontSize":"20px"}}>No farmers match</div><div className="note" style={{"fontSize":"13px"}}>Nothing fits those constraints. Try a larger distance, fewer acres or a lower trust bar, then re-run the model.</div></>)}<div className="note" style={{"marginTop":"auto"}}>Each farmer is pinned in their state. The backend ranks by climate risk at the farm (past seasons × irrigation and practices), then builds the lot with at most 8% per farmer and 25% per district by default. The chat can change filters, ranking and these limits. Trust can filter but never changes the score.</div></aside></div>)} />;
}
