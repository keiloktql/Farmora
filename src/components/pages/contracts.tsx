// @ts-nocheck
/* eslint-disable */
// Contracts workspace: every ongoing deal with exporters, filterable by exporter, with full details per deal
// (produce, quantity, destination standards, price, deadlines, allocated farmers and deal risk).
// Data comes from the contracts backend (src/lib/contracts, GET /api/contracts).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';

export const pageTitle = "Contracts";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.card{position:absolute;box-sizing:border-box;border-radius:18px;background:#0f261ee6;border:1px solid #23443a;backdrop-filter:blur(14px);box-shadow:0 18px 40px #00000040}
.kick{font-size:11px;letter-spacing:1.3px;font-weight:600;color:#8FB7A0;text-transform:uppercase}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.num{font-family:var(--font-space),sans-serif;font-weight:700;letter-spacing:-.8px;font-variant-numeric:tabular-nums}
.muted{color:#93AE9F}
.note{font-size:11.5px;line-height:1.5;color:#86A394}
.pill{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:600;white-space:nowrap}
.row{display:flex;align-items:center;gap:10px}
.sec{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.tile{padding:12px 14px;border-radius:14px;background:#132e25;border:1px solid #1f3d33}
.tile .kick{font-size:10.5px}
.chip{min-height:34px;padding:0 14px;border-radius:999px;border:1px solid #2c4a3d;background:#12281f;color:#C9D9CF;font-size:12.5px;font-weight:600;white-space:nowrap}
.chip.on{background:#DCE96C;color:#14382b;border-color:#DCE96C}
.deal{display:block;width:100%;text-align:left;padding:13px 14px;border-radius:14px;border:1px solid #1f3d33;background:#132e25;color:#E8F1EA}
.deal:hover{border-color:#3d6b55}
.deal.on{border-color:#DCE96C;background:#183a2e}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;font-size:13px;font-weight:600}
.tbl{width:100%;border-collapse:collapse;font-size:12.5px}
.tbl th{text-align:left;font-weight:600;font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:#8FB7A0;padding:7px 8px;border-bottom:1px solid #23443a;position:sticky;top:0;background:#0f261e}
.tbl td{padding:8px;border-bottom:1px solid #1a3a30}
.tbl td.r,.tbl th.r{text-align:right}
`;

const RISK = {
  Low: { bg: '#1f4a33', fg: '#8BE3A6' }, Medium: { bg: '#4a3a1c', fg: '#F5C76A' }, High: { bg: '#4a2320', fg: '#FFB4A6' },
  Provisional: { bg: '#203a4a', fg: '#9CCFEA' }, Unassessed: { bg: '#26352f', fg: '#A9C0B2' },
};
const STATUS = { Draft: '#7d8d84', 'Matching farmers': '#9CCFEA', Allocated: '#DCE96C', Growing: '#6FD08C', Harvest: '#F5B83D', Shipped: '#B9CDC0' };
const lakh = (v) => (v == null ? 'Price TBD' : '₹' + (v / 1e5).toFixed(1) + ' L');
const fmtDate = (d) => { if (!d) return '—'; const p = d.split('-'); return Number(p[2]) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1] + ' ' + p[0]; };

class Logic extends DCLogic {
  state = { data: null, filter: null, sel: null, error: null };
  async componentDidMount() {
    const want = new URLSearchParams(window.location.search).get('id');
    try {
      const res = await fetch('/api/contracts');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load contracts');
      this.setState({ data, sel: want && data.contracts.some((c) => c.id === want) ? want : (data.contracts[0] || {}).id || null });
    } catch (e) {
      this.setState({ error: String(e && e.message || e) });
    }
  }
  renderVals() {
    const { data, filter, sel, error } = this.state;
    const all = data ? data.contracts : [];
    const list = filter ? all.filter((c) => c.exporter === filter) : all;
    const cur = list.find((c) => c.id === sel) || list[0] || null;
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Contracts'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const totalValue = all.reduce((s, c) => s + (c.valueINR || 0), 0);
    const totalT = all.reduce((s, c) => s + c.qtyT, 0);
    const needFarmers = all.filter((c) => !c.allocation || !c.allocation.feasible).length;
    const a = cur && cur.allocation;
    return {
      nav, error, loading: !data && !error,
      kpis: [
        { label: 'Ongoing deals', value: String(all.length), sub: (data ? data.exporters.length : 0) + ' exporters' },
        { label: 'Contract value', value: lakh(totalValue), sub: 'Agreed prices × quantity' },
        { label: 'Volume', value: totalT.toLocaleString('en-IN') + ' t', sub: 'Across all deals' },
        { label: 'Need farmers', value: String(needFarmers), sub: 'Unallocated or short', warn: needFarmers > 0 },
      ],
      chips: [{ name: 'All exporters', count: all.length, on: !filter, pick: () => this.setState({ filter: null }) }]
        .concat((data ? data.exporters : []).map((e) => ({ name: e.name, count: e.count, on: filter === e.name, pick: () => this.setState({ filter: e.name, sel: null }) }))),
      rows: list.map((c) => ({
        id: c.id, ex: c.exporter, line: `${c.produce} · ${c.qtyT} t · ${c.country}`, value: lakh(c.valueINR), due: fmtDate(c.deliverBy), days: c.daysToDelivery,
        status: c.status, statusC: STATUS[c.status] || '#B9CDC0', risk: c.risk.level, riskBg: RISK[c.risk.level].bg, riskFg: RISK[c.risk.level].fg,
        prog: c.progress, on: cur && cur.id === c.id, pick: () => this.setState({ sel: c.id }),
      })),
      empty: data && !list.length,
      has: !!cur,
      d: cur ? {
        id: cur.id, ex: cur.exporter, source: cur.source === 'seed' ? 'Existing deal' : cur.source === 'orderbook' ? 'From order book' : 'Added manually',
        status: cur.status, statusC: STATUS[cur.status] || '#B9CDC0', stage: cur.stageNote || '',
        produce: cur.produce, qty: cur.qtyT + ' t', price: cur.pricePerKg != null ? '₹' + cur.pricePerKg + '/kg' : 'Not agreed yet', value: lakh(cur.valueINR),
        deliver: fmtDate(cur.deliverBy), days: cur.daysToDelivery >= 0 ? cur.daysToDelivery + ' days left' : 'Due date passed', sow: cur.sowBy ? 'Sow by ' + fmtDate(cur.sowBy) : 'No sow-by date',
        country: cur.country, authority: cur.standards.authority, rules: cur.standards.rules,
        risk: cur.risk.level, riskBg: RISK[cur.risk.level].bg, riskFg: RISK[cur.risk.level].fg, riskScore: cur.risk.score == null ? '—' : cur.risk.score, reasons: cur.risk.reasons,
        coverPct: a ? Math.min(100, Math.round(a.plannedT / cur.qtyT * 100)) : 0, coverText: a ? `${a.plannedT} of ${cur.qtyT} t planned` + (a.extraPlanted ? ' (+10% extra)' : '') : 'No lot yet',
        chance: a && a.chance != null ? Math.round(a.chance * 100) + '%' : '—',
        farmers: a ? a.lot.map((l) => ({ name: l.name, place: l.district ? l.district + ', ' + l.state : l.state, t: l.tonnes.toFixed(2), ac: l.acres.toFixed(2), risk: l.riskScore == null ? '—' : l.riskScore })) : [],
        lotSummary: a ? `${a.lot.length} farmers · ${a.regions} regions · ${a.landAcres} ac` : '',
        allocated: !!(a && a.lot.length), recLink: '/recommendations?contract=' + cur.id,
        recText: a && a.lot.length ? 'Re-run allocation' : 'Allocate farmers',
      } : null,
    };
  }
}

export default function ContractsPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (
    <div style={{ position: 'relative', width: 1440, height: 900, overflow: 'hidden', background: 'radial-gradient(1000px 640px at 60% 50%,#183a2d 0%,#0f261e 55%,#0a1814 100%)', fontFamily: 'var(--font-inter),system-ui,sans-serif', color: '#E8F1EA' }}>
      <header style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 64, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 5 }}>
        <div className="row"><div style={{ width: 34, height: 34, borderRadius: 11, background: '#DCE96C', display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{ fontWeight: 700, fontSize: 18 }}>Farmora</span></div>
        <nav aria-label="Workspaces" style={{ display: 'flex', gap: 2, marginLeft: 12, padding: 4, borderRadius: 999, background: '#12281f99', border: '1px solid #2c4a3d' }}>{v.nav.map((n, i) => (<Link key={i} href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link>))}</nav>
        <div className="row" style={{ marginLeft: 'auto', minHeight: 44, padding: '0 12px 0 6px', borderRadius: 999, border: '1px solid #2c4a3d', background: '#12281f99', fontSize: 13 }}><span style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8BC7C', color: '#4a3420', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>CF</span><span><b style={{ display: 'block', fontWeight: 600 }}>Chittoor Farmers FPO</b><span style={{ display: 'block', fontSize: 12, color: '#A9C0B2' }}>Contracts</span></span></div>
      </header>

      {/* Title + KPIs */}
      <div style={{ position: 'absolute', left: 24, top: 80, width: 300 }}>
        <div className="hd" style={{ fontSize: 30, lineHeight: 1.1 }}>Contracts</div>
        <div className="note" style={{ fontSize: 13, marginTop: 6 }}>Every ongoing deal with exporters: standards, farmers and risk.</div>
      </div>
      {v.kpis.map((k, i) => (
        <section key={i} className="card" style={{ left: 336 + i * 222, top: 76, width: 210, height: 84, padding: '12px 14px' }}>
          <div className="kick">{k.label}</div>
          <div className="num" style={css(`font-size:26px;line-height:1.15;margin-top:5px;color:${k.warn ? '#F5C76A' : '#E8F1EA'}`)}>{k.value}</div>
          <div className="note">{k.sub}</div>
        </section>
      ))}
      <Link href="/new-project" className="btn" style={{ position: 'absolute', left: 1236, top: 76, width: 180, height: 84, boxSizing: 'border-box', flexDirection: 'column', gap: 2, background: '#DCE96C', color: '#14382b', borderColor: '#DCE96C', borderRadius: 18, fontSize: 15 }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>＋</span>New project
      </Link>

      {/* Exporter filter */}
      <div role="group" aria-label="Filter by exporter" style={{ position: 'absolute', left: 24, top: 174, width: 1392, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {v.chips.map((c, i) => (<button key={i} className={`chip ${c.on ? 'on' : ''}`} aria-pressed={c.on} onClick={c.pick}>{c.name} <span style={{ opacity: .7, marginLeft: 4 }}>{c.count}</span></button>))}
      </div>

      {/* Deal list */}
      <aside className="card" style={{ left: 24, top: 222, width: 470, height: 654, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
        {v.loading && <div className="note" style={{ padding: 10 }}>Loading contracts…</div>}
        {v.error && <div className="note" style={{ padding: 10, color: '#FFB4A6' }}>{v.error}</div>}
        {v.empty && <div className="note" style={{ padding: 10 }}>No contracts for this exporter.</div>}
        {v.rows.map((r) => (
          <button key={r.id} className={`deal ${r.on ? 'on' : ''}`} onClick={r.pick} aria-pressed={r.on}>
            <div className="sec"><b style={{ fontSize: 14, fontWeight: 600 }}>{r.ex}</b><span className="num" style={{ fontSize: 15 }}>{r.value}</span></div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>{r.line}</div>
            <div className="row" style={{ marginTop: 9, gap: 8 }}>
              <span className="pill" style={css(`background:#1b3a2f;color:${r.statusC}`)}><span style={css(`width:6px;height:6px;border-radius:50%;background:${r.statusC}`)} />{r.status}</span>
              <span className="pill" style={css(`background:${r.riskBg};color:${r.riskFg}`)}>Risk · {r.risk}</span>
              <span className="muted" style={{ fontSize: 11.5, marginLeft: 'auto' }}>Due {r.due} · {r.days} d</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: '#1c3a2f', marginTop: 9, overflow: 'hidden' }}><div style={css(`height:100%;width:${r.prog}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div>
          </button>
        ))}
      </aside>

      {/* Deal detail */}
      <section className="card" aria-live="polite" style={{ left: 506, top: 222, width: 910, height: 654, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!v.has && !v.loading && <div className="note">Select a contract.</div>}
        {v.has && (<>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ gap: 8 }}><span className="kick">{v.d.id}</span><span className="note">· {v.d.source}</span></div>
              <div className="hd" style={{ fontSize: 26, marginTop: 2 }}>{v.d.ex}</div>
              <div className="row" style={{ gap: 8, marginTop: 6 }}><span className="pill" style={css(`background:#1b3a2f;color:${v.d.statusC}`)}><span style={css(`width:6px;height:6px;border-radius:50%;background:${v.d.statusC}`)} />{v.d.status}</span><span className="muted" style={{ fontSize: 12.5 }}>{v.d.stage}</span></div>
            </div>
            <div style={css(`text-align:right;padding:10px 14px;border-radius:14px;background:${v.d.riskBg};min-width:150px`)}>
              <div className="kick" style={css(`color:${v.d.riskFg};opacity:.85`)}>Deal risk</div>
              <div className="num" style={css(`font-size:24px;color:${v.d.riskFg};margin-top:2px`)}>{v.d.risk}</div>
              <div style={css(`font-size:11.5px;color:${v.d.riskFg};opacity:.8`)}>score {v.d.riskScore} · delivery chance {v.d.chance}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 1.4fr', gap: 10 }}>
            <div className="tile"><div className="kick">Produce</div><div className="hd" style={{ fontSize: 20, marginTop: 4 }}>{v.d.produce}</div></div>
            <div className="tile"><div className="kick">Quantity</div><div className="hd" style={{ fontSize: 20, marginTop: 4 }}>{v.d.qty}</div></div>
            <div className="tile"><div className="kick">Price paid</div><div className="hd" style={{ fontSize: 20, marginTop: 4 }}>{v.d.price}</div><div className="note">Contract value {v.d.value}</div></div>
            <div className="tile"><div className="kick">Deadlines</div><div className="hd" style={{ fontSize: 18, marginTop: 4 }}>Deliver by {v.d.deliver}</div><div className="note">{v.d.days} · {v.d.sow}</div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="tile">
              <div className="sec"><span className="kick">Destination standards</span><span className="pill" style={{ background: '#1d3f31', color: '#E8F1EA' }}>{v.d.country}</span></div>
              <div style={{ fontSize: 13, fontWeight: 600, margin: '8px 0 6px' }}>{v.d.authority}</div>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'grid', gap: 4, fontSize: 12, lineHeight: 1.45, color: '#C9D9CF' }}>{v.d.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
              <div className="note" style={{ marginTop: 6 }}>Summary only: confirm exact requirements with the exporter.</div>
            </div>
            <div className="tile">
              <div className="kick">Supply and risk</div>
              <div className="sec" style={{ marginTop: 8, fontSize: 12.5 }}><span>{v.d.coverText}</span><b className="num" style={{ fontSize: 15 }}>{v.d.coverPct}%</b></div>
              <div style={{ height: 7, borderRadius: 999, background: '#1c3a2f', margin: '6px 0 10px', overflow: 'hidden' }}><div style={css(`height:100%;width:${v.d.coverPct}%;background:${v.d.coverPct >= 100 ? 'linear-gradient(90deg,#4fbf72,#DCE96C)' : '#F0A04B'}`)} /></div>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'grid', gap: 4, fontSize: 12, lineHeight: 1.45, color: '#C9D9CF' }}>{v.d.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="sec" style={{ marginBottom: 6 }}>
              <span className="row" style={{ gap: 8 }}><span className="hd" style={{ fontSize: 16 }}>Allocated farmers</span><span className="muted" style={{ fontSize: 12 }}>{v.d.lotSummary}</span></span>
              <Link href={v.d.recLink} className="btn" style={css(`min-height:34px;background:${v.d.allocated ? '#143026' : '#DCE96C'};color:${v.d.allocated ? '#E8F1EA' : '#14382b'}`)}>{v.d.recText} →</Link>
            </div>
            {v.d.allocated ? (
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', borderRadius: 12, border: '1px solid #1f3d33' }}>
                <table className="tbl">
                  <thead><tr><th>Farmer</th><th>Location</th><th className="r">Tonnes</th><th className="r">Acres to plant</th><th className="r">Climate risk</th></tr></thead>
                  <tbody>{v.d.farmers.map((f, i) => (<tr key={i}><td style={{ fontWeight: 600 }}>{f.name}</td><td className="muted">{f.place}</td><td className="r">{f.t}</td><td className="r">{f.ac}</td><td className="r">{f.risk}</td></tr>))}</tbody>
                </table>
              </div>
            ) : (
              <div className="tile" style={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center' }}><div><div className="hd" style={{ fontSize: 16 }}>No farmers allocated yet</div><div className="note" style={{ marginTop: 4 }}>Run the recommender to pick a spread-out lot for this deal.</div></div></div>
            )}
          </div>
        </>)}
      </section>
    </div>
  )} />;
}
