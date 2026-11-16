// @ts-nocheck
/* eslint-disable */
// Buyers (Farmora Pro): the exporter network. Exporters who want to buy from FPOs, what crops they buy, how
// much, at what price and when. Your Pro plan covers crop packs; exporters buying only crops outside your plan
// stay locked (the API never sends their identity or contact). Data: GET /api/buyers, POST /api/buyers/deal.
'use client';

import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';
import { CROP_C, shade, voxels, buyer as buildBuyer } from '@/lib/voxel';

export const pageTitle = "Buyers";

const CSS = `
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:11px;letter-spacing:1.6px;font-weight:700;color:#8FB7A0;text-transform:uppercase}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.note{font-size:12px;line-height:1.45;color:#86A394}
.fld{box-sizing:border-box;min-height:36px;padding:0 10px;border-radius:10px;border:1px solid #2f5a48;background:#132e25;color:#E8F1EA;font:inherit;font-size:13px;color-scheme:dark}
.chip{display:inline-flex;align-items:center;gap:5px;min-height:28px;padding:0 10px;border-radius:999px;border:1px solid #2f5a48;background:transparent;color:#B9CDC0;font-size:12px;font-weight:600;white-space:nowrap}
.chip.on{background:#DCE96C;border-color:#DCE96C;color:#14382b}
.ex{display:flex;align-items:center;gap:10px;width:100%;min-height:54px;padding:0 10px;border-radius:14px;border:1px solid transparent;background:transparent;color:#E8F1EA;text-align:left}
.ex:hover{background:#143026}
.ex.on{background:#1d3f31;border-color:#DCE96C}
.ex.locked{opacity:.6}
.buy{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:9px 10px;border-radius:12px;background:#132e25;border:1px solid #23443a}
.buy.locked{background:repeating-linear-gradient(135deg,#132e25 0 8px,#112821 8px 16px)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;background:#143026;color:#E8F1EA;font-size:13px;font-weight:700}
.btn.go{background:#DCE96C;color:#14382b;border-color:#DCE96C}
.btn.gold{background:linear-gradient(135deg,#FFE58A,#F5B83D 55%,#E8932F);color:#3a2a06;border-color:#F5B83D}
.btn:disabled{opacity:.45;cursor:not-allowed}
.scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:#2f5a48 transparent}
@keyframes spin{to{transform:rotateZ(360deg)}}
.spin{animation:spin 26s linear infinite}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.rise{animation:rise .35s ease both}
@media (prefers-reduced-motion:reduce){.spin,.rise{animation:none}}
`;

const FLAG = { Singapore: '🇸🇬', 'Sri Lanka': '🇱🇰', UAE: '🇦🇪', Malaysia: '🇲🇾', Maldives: '🇲🇻', Oman: '🇴🇲', Qatar: '🇶🇦', Bangladesh: '🇧🇩' };
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const Lock = ({ c = '#F5B83D', s = 12 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);

class Logic extends DCLogic {
  state = { data: null, error: null, sel: null, crop: '', country: '', q: '', form: null, busy: false, created: null };
  async load() {
    try {
      const res = await fetch('/api/buyers');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load the exporter network');
      this.setState({ data, error: null });
      if (!this.state.sel) this.pick(data.exporters.find((e) => e.unlocked) || data.exporters[0]);
    } catch (e) { this.setState({ error: String(e && e.message || e) }); }
  }
  pick(e) {
    if (!e) return;
    const b = e.buys.find((x) => x.inPlan);
    const due = new Date(Date.now() + 150 * 86400000).toISOString().slice(0, 10);
    this.setState({ sel: e.id, created: null, form: b ? { crop: b.crop, qtyT: Math.max(e.minOrderT, Math.min(Math.round(b.tonnesPerYear / 6), Math.floor(b.yourCapacityT))), price: Math.round((b.price[0] + b.price[1]) / 2), deliverBy: due } : null });
  }
  async startDeal() {
    const e = this.state.data.exporters.find((x) => x.id === this.state.sel), f = this.state.form;
    this.setState({ busy: true });
    try {
      const res = await fetch('/api/buyers/deal', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ exporterId: e.id, crop: f.crop, qtyT: f.qtyT, pricePerKg: f.price, deliverBy: f.deliverBy }) });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || 'Could not create the deal');
      this.setState({ busy: false, created: out.contract });
      this.load();
    } catch (err) { this.setState({ busy: false, error: String(err && err.message || err) }); }
  }
  componentDidMount() { if (this._started) return; this._started = true; this.load(); }

  renderVals() {
    const S = this.state, P = S.data;
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Buyers'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    if (!P) return { nav, ready: false, error: S.error };

    const q = S.q.trim().toLowerCase();
    const shown = P.exporters.filter((e) => (!S.crop || e.buys.some((b) => b.crop === S.crop)) && (!S.country || e.country === S.country)
      && (!q || [e.name, e.country, e.city, e.type].some((x) => x.toLowerCase().includes(q))));
    const list = shown.slice().sort((a, b) => (b.unlocked - a.unlocked) || (S.crop ? (b.buys.find((x) => x.crop === S.crop)?.tonnesPerYear ?? 0) - (a.buys.find((x) => x.crop === S.crop)?.tonnesPerYear ?? 0) : b.demandT - a.demandT))
      .map((e) => {
        const focus = S.crop ? e.buys.find((b) => b.crop === S.crop) : null;
        return { id: e.id, name: e.name, sub: (FLAG[e.country] || '') + ' ' + e.city + ' · ' + e.type, locked: !e.unlocked, verified: e.verified, partner: e.partner,
          crops: e.buys.map((b) => ({ c: CROP_C[b.crop] || '#8fb7a0', locked: !b.inPlan })),
          right: focus ? focus.tonnesPerYear + ' t/yr' : e.demandT.toLocaleString('en-IN') + ' t/yr', on: e.id === S.sel, pick: () => this.pick(e),
          ini: e.unlocked ? e.name.split(' ').map((w) => w[0]).slice(0, 2).join('') : '', bg: e.unlocked ? ['#2E3A55', '#3B3F46', '#4A3B5C', '#24474A'][hash(e.id) % 4] : '#1a2a24' };
      });
    const cropChips = [{ crop: '', label: 'All crops', n: P.exporters.length, inPlan: true }, ...P.crops.map((c) => ({ crop: c.crop, label: c.crop, n: c.exporters, inPlan: c.inPlan }))]
      .map((c) => ({ ...c, on: S.crop === c.crop, pick: () => this.setState({ crop: c.crop }) }));

    const E = P.exporters.find((e) => e.id === S.sel) || P.exporters[0];
    const faces = [];
    let d = null;
    if (E) {
      const { box, V } = voxels(faces);
      const glow = E.unlocked ? '#DCE96C' : '#F5B83D';
      faces.push({ css: `left:20px;top:20px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,#2f6a50 0%,#1d4a39 60%,#143528 100%);box-shadow:0 0 0 3px ${glow}66,0 0 70px ${glow}44;transform:translateZ(4px);` });
      faces.push({ css: `left:50px;top:50px;width:300px;height:300px;border-radius:50%;border:2px dashed ${glow}55;box-sizing:border-box;transform:translateZ(5px);` });
      faces.push({ css: 'left:150px;top:160px;width:100px;height:80px;border-radius:50%;background:radial-gradient(closest-side,#00000066,#0000);transform:translateZ(5.5px);' });
      buildBuyer(V, hash(E.id));
      // One crate stack per crop they buy: taller = more tonnes a year.
      const maxT = Math.max(...E.buys.map((b) => b.tonnesPerYear));
      E.buys.forEach((b, i) => {
        const a = (i / E.buys.length) * Math.PI * 2 + 0.6, cx = 200 + Math.cos(a) * 132, cy = 200 + Math.sin(a) * 132, layers = 1 + Math.round(b.tonnesPerYear / maxT * 4), cc = CROP_C[b.crop] || '#8fb7a0';
        for (let k = 0; k < layers; k++) {
          [[-16, -16], [4, -16], [-16, 4], [4, 4]].forEach(([dx, dy], j) => {
            box({ x: cx + dx, y: cy + dy, z: 5 + k * 16, w: 18, d: 18, h: 13, c: '#B07A3E', pat: 'repeating-linear-gradient(0deg,#B07A3E 0 4px,#8E5E2C 4px 6px)' });
            if (k === layers - 1) box({ x: cx + dx + 3, y: cy + dy + 3, z: 18 + k * 16, w: 12, d: 12, h: 4, c: b.inPlan ? shade(cc, [1, .92, 1.06, .97][j]) : '#55605a' });
          });
        }
      });
      const f = S.form;
      d = {
        id: E.id, locked: !E.unlocked, name: E.name, place: (FLAG[E.country] || '') + ' ' + E.city + ', ' + E.country, type: E.type, verified: E.verified, partner: E.partner,
        since: 'Buying since ' + E.since, reply: 'Replies in ~' + E.responseHrs + ' h',
        buys: E.buys.map((b) => ({ crop: b.crop, col: CROP_C[b.crop] || '#8fb7a0', locked: !b.inPlan, t: b.tonnesPerYear + ' t/yr', price: '₹' + b.price[0] + '–' + b.price[1] + '/kg', months: b.months,
          cap: b.yourCapacityT >= b.tonnesPerYear ? 'You could cover all of it (' + Math.round(b.yourCapacityT) + ' t free)' : 'You could cover ~' + Math.round(b.yourCapacityT / b.tonnesPerYear * 100) + '% (' + Math.round(b.yourCapacityT) + ' t free)',
          past: b.yourPastPrice != null ? 'your past price ₹' + b.yourPastPrice : '' })),
        needs: E.needs, payment: E.payment, minOrder: E.minOrderT + ' t minimum order',
        contact: E.contact, about: E.about, deals: E.deals.map((x) => ({ href: '/contracts?id=' + x.id, t: x.id + ' · ' + x.produce + ' ' + x.qtyT + ' t · ' + x.status })),
        lockedCrops: E.buys.filter((b) => !b.inPlan).map((b) => b.crop), addOn: '₹' + P.plan.addOnPricePerCropINR.toLocaleString('en-IN') + '/yr per crop',
        form: f ? {
          crops: E.buys.filter((b) => b.inPlan).map((b) => b.crop), crop: f.crop, qtyT: f.qtyT, price: f.price, deliverBy: f.deliverBy,
          value: '₹' + (f.qtyT * 1000 * f.price / 1e5).toFixed(1) + ' L',
          set: (k) => (ev) => this.setState({ form: { ...f, [k]: k === 'crop' || k === 'deliverBy' ? ev.target.value : Number(ev.target.value) } }),
        } : null,
        submit: () => this.startDeal(), busy: S.busy, created: S.created ? { id: S.created.id, alloc: '/recommendations?contract=' + S.created.id, view: '/contracts?id=' + S.created.id } : null,
      };
    }

    return {
      nav, ready: true, error: S.error, list, cropChips, faces, d,
      countries: P.countries, country: S.country, q: S.q,
      onCountry: (e) => this.setState({ country: e.target.value }), onQ: (e) => this.setState({ q: e.target.value }),
      planLine: P.plan.tier + ' · ' + P.plan.crops.length + ' crop packs · renews ' + new Date(P.plan.renewsOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      head: P.exporters.length + ' exporters · ' + P.countries.length + ' countries', count: list.length + ' shown · ' + P.exporters.filter((e) => !e.unlocked).length + ' locked',
    };
  }
}

export default function BuyersPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (
    <div style={{ position: 'relative', width: 1440, height: 900, overflow: 'hidden', background: 'radial-gradient(760px 560px at 50% 52%,#1f4a39 0%,#0f261e 58%,#0a1814 100%)', fontFamily: 'var(--font-inter),system-ui,sans-serif', color: '#E8F1EA' }}>
      {v.d && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 900, perspective: 2400, perspectiveOrigin: '50% 35%', filter: v.d.locked ? 'grayscale(.85) brightness(.55)' : 'none', transition: 'filter .3s' }}>
          <div style={{ position: 'absolute', left: 720, top: 478, width: 400, height: 400, marginLeft: -200, marginTop: -200, transformStyle: 'preserve-3d', transform: 'scale(1.25) rotateX(58deg)' }}>
            <div className="spin" style={{ position: 'absolute', left: 0, top: 0, width: 400, height: 400, transformStyle: 'preserve-3d' }}>{v.faces.map((f, i) => (<div key={i} style={css(`position:absolute;${f.css}`)} />))}</div>
          </div>
        </div>
      )}

      <header style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 64, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(#0a1814ee,#0a181400)', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: '#DCE96C', display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{ fontWeight: 700, fontSize: 18 }}>Farmora</span></div>
        <nav aria-label="Workspaces" style={{ display: 'flex', gap: 2, marginLeft: 12, padding: 4, borderRadius: 999, background: '#12281f99', border: '1px solid #2c4a3d' }}>{v.nav.map((n, i) => (<Link key={i} href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link>))}</nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, padding: '0 12px 0 6px', borderRadius: 999, border: '1px solid #2c4a3d', background: '#12281f99', fontSize: 13 }}><span style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8BC7C', color: '#4a3420', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>CF</span><span><b style={{ display: 'block', fontWeight: 600 }}>Chittoor Farmers FPO</b><span style={{ display: 'block', fontSize: 12, color: '#F5C96A' }}>{v.ready ? v.planLine : 'Farmora Pro'}</span></span></div>
      </header>

      {!v.ready && (<div className="note" style={{ position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', fontSize: 14 }}>{v.error ? 'Could not load: ' + v.error : 'Loading the exporter network…'}</div>)}

      {v.ready && (<>
        {/* Left: the network */}
        <aside className="panel" style={{ left: 24, top: 80, width: 344, height: 796, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="kick" style={{ color: '#DCE96C' }}>Exporter network</span><ProBadge size="md" /></div><div className="hd" style={{ fontSize: 19, marginTop: 6 }}>{v.head}</div></div>
          <div role="group" aria-label="Crop" style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {v.cropChips.map((c, i) => (<button key={i} className={'chip' + (c.on ? ' on' : '')} aria-pressed={c.on} onClick={c.pick} title={c.inPlan ? '' : 'Not in your plan'}>{!c.inPlan && <Lock c={c.on ? '#3a2a06' : '#F5B83D'} s={11} />}{c.label} <span style={{ opacity: .6, fontWeight: 500 }}>{c.n}</span></button>))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input aria-label="Search exporters" className="fld" style={{ flex: 1, minWidth: 0 }} value={v.q} onChange={v.onQ} placeholder="Search name, city, type" />
            <select aria-label="Country" className="fld" value={v.country} onChange={v.onCountry}><option value="">All countries</option>{v.countries.map((c) => (<option key={c} value={c}>{c}</option>))}</select>
          </div>
          <div className="scroll" style={{ flex: 1, minHeight: 0, margin: '0 -6px', padding: '0 6px' }}>
            {v.list.map((e) => (<button key={e.id} className={'ex' + (e.on ? ' on' : '') + (e.locked ? ' locked' : '')} onClick={e.pick} aria-current={e.on}>
              <span style={css(`flex:none;width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:${e.bg};border:1px solid #2c4a3d;font-weight:800;font-size:12px;color:#E8F1EA`)}>{e.locked ? <Lock s={15} /> : e.ini}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><b style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</b>{e.verified && !e.locked && <span title="Verified by Farmora" style={{ color: '#6CC4F0', fontSize: 12 }}>✔</span>}{e.partner && <span style={{ fontSize: 10, padding: '0 6px', borderRadius: 999, background: '#1f4a33', color: '#8BE3A6', fontWeight: 700 }}>partner</span>}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#86A394', marginTop: 2 }}>{e.crops.map((c, i) => (<span key={i} style={css(`flex:none;width:7px;height:7px;border-radius:2px;background:${c.locked ? '#55605a' : c.c}`)} />))}<span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.sub}</span></span>
              </span>
              <b style={{ fontSize: 12, fontWeight: 600, color: '#C9D9CF', whiteSpace: 'nowrap' }}>{e.right}</b>
            </button>))}
          </div>
          <div className="note">{v.count}</div>
        </aside>

        {v.d && (<>
          {/* Name plate */}
          <div key={'n' + v.d.id} className="rise" style={{ position: 'absolute', left: 384, top: 88, width: 672, textAlign: 'center' }}>
            <div className="kick">{v.d.type}</div>
            <div className="hd" style={{ fontSize: 34, marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 10 }}>{v.d.locked && <Lock s={24} />}{v.d.name}{v.d.verified && !v.d.locked && <span title="Verified by Farmora" style={{ color: '#6CC4F0', fontSize: 20 }}>✔</span>}</div>
            <div style={{ fontSize: 14, color: '#C9D9CF', marginTop: 4 }}>{v.d.place} · {v.d.since} · {v.d.reply}</div>
          </div>
          <div style={{ position: 'absolute', left: 384, top: 770, width: 672, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {v.d.buys.map((b, i) => (<span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999, background: '#0f261ee6', border: '1px solid #2c4a3d', fontSize: 13, fontWeight: 600 }}>{b.locked ? <Lock s={11} /> : <span style={css(`width:10px;height:10px;border-radius:3px;background:${b.col}`)} />}{b.crop} · {b.t}</span>))}
          </div>
          <div className="note" style={{ position: 'absolute', left: 384, top: 820, width: 672, textAlign: 'center' }}>Crate stacks = what they buy each year (taller = more tonnes).{v.d.about ? ' ' + v.d.about : ''}</div>

          {/* Right: buying profile, needs, contact, deal */}
          <aside key={'r' + v.d.id} className="panel rise" style={{ left: 1072, top: 80, width: 344, height: 796, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <section>
              <div className="kick" style={{ color: '#DCE96C', marginBottom: 8 }}>What they buy</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {v.d.buys.map((b, i) => (<div key={i} className={'buy' + (b.locked ? ' locked' : '')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600 }}>{b.locked ? <Lock s={12} /> : <span style={css(`width:9px;height:9px;border-radius:2px;background:${b.col}`)} />}{b.crop}</span>
                  <b className="hd" style={{ fontSize: 14, textAlign: 'right' }}>{b.price}</b>
                  <span style={{ fontSize: 11.5, color: '#86A394' }}>{b.t} · {b.months}</span>
                  <span style={{ fontSize: 11.5, color: '#86A394', textAlign: 'right' }}>{b.past}</span>
                  <span style={{ gridColumn: '1 / span 2', fontSize: 11.5, color: b.locked ? '#F5C96A' : '#8BE3A6' }}>{b.locked ? 'Not in your plan' : b.cap}</span>
                </div>))}
              </div>
            </section>
            <section>
              <div className="kick" style={{ marginBottom: 6 }}>What they need</div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.5, color: '#C9D9CF' }}>{v.d.needs.map((n, i) => (<li key={i}>{n}</li>))}</ul>
              <div className="note" style={{ marginTop: 4 }}>{v.d.payment} · {v.d.minOrder}</div>
            </section>

            {v.d.locked ? (<section style={{ marginTop: 'auto', padding: 14, borderRadius: 14, border: '1px solid #F5B83D66', background: 'linear-gradient(160deg,#2a2410,#13261e)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ProBadge size="md" /><b style={{ fontSize: 13.5 }}>Unlock this exporter</b></div>
              <div style={{ fontSize: 12.5, color: '#E9DDB4', marginTop: 8, lineHeight: 1.45 }}>Add the {v.d.lockedCrops.join(' or ')} pack to see who they are, their contact and start deals. {v.d.addOn}.</div>
              <button className="btn gold" style={{ width: '100%', marginTop: 10 }} disabled title="Plan changes aren't wired up in this prototype">Add {v.d.lockedCrops[0]} pack</button>
            </section>) : (<>
              <section>
                <div className="kick" style={{ marginBottom: 6 }}>Contact</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{v.d.contact.person} <span style={{ fontWeight: 400, color: '#86A394' }}>· {v.d.contact.role}</span></div>
                <a href={'mailto:' + v.d.contact.email} style={{ fontSize: 12.5, color: '#DCE96C' }}>{v.d.contact.email}</a>
                {v.d.deals.length > 0 && (<div style={{ marginTop: 6 }}>{v.d.deals.map((x, i) => (<Link key={i} href={x.href} style={{ display: 'block', fontSize: 12, color: '#8BE3A6' }}>↳ {x.t}</Link>))}</div>)}
              </section>
              <section style={{ marginTop: 'auto' }}>
                <div className="kick" style={{ marginBottom: 8 }}>Start a deal</div>
                {v.d.created ? (<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: '10px 12px', borderRadius: 12, background: '#1f4a33', border: '1px solid #4fbf72', color: '#B8F0C8', fontSize: 13, fontWeight: 600 }}>✓ Contract {v.d.created.id} created</div>
                  <Link href={v.d.created.alloc} className="btn go">Allocate farmers →</Link>
                  <Link href={v.d.created.view} className="btn">View contract</Link>
                </div>) : v.d.form ? (<>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <label style={{ fontSize: 11.5, color: '#93AE9F' }}>Crop<select className="fld" style={{ width: '100%', marginTop: 3 }} value={v.d.form.crop} onChange={v.d.form.set('crop')}>{v.d.form.crops.map((c) => (<option key={c}>{c}</option>))}</select></label>
                    <label style={{ fontSize: 11.5, color: '#93AE9F' }}>Tonnes<input className="fld" type="number" min="1" style={{ width: '100%', marginTop: 3 }} value={v.d.form.qtyT} onChange={v.d.form.set('qtyT')} /></label>
                    <label style={{ fontSize: 11.5, color: '#93AE9F' }}>Price ₹/kg<input className="fld" type="number" min="1" style={{ width: '100%', marginTop: 3 }} value={v.d.form.price} onChange={v.d.form.set('price')} /></label>
                    <label style={{ fontSize: 11.5, color: '#93AE9F' }}>Deliver by<input className="fld" type="date" style={{ width: '100%', marginTop: 3 }} value={v.d.form.deliverBy} onChange={v.d.form.set('deliverBy')} /></label>
                  </div>
                  <button className="btn go" style={{ width: '100%', marginTop: 10 }} onClick={v.d.submit} disabled={v.d.busy}>{v.d.busy ? 'Creating…' : 'Create contract · ' + v.d.form.value}</button>
                </>) : (<div className="note">None of the crops they buy are in your plan.</div>)}
              </section>
            </>)}
          </aside>
        </>)}
      </>)}
    </div>
  )} />;
}
