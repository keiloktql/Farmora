// @ts-nocheck
/* eslint-disable */
// New project wizard:
//   1. Bring in the order book (paste it, or add one contract by hand)
//   2. Review what the system read, then save the contracts (POST /api/orderbook/parse, POST /api/contracts)
//   3. Pick a contract and open the farmer recommender for it (/recommendations?contract=ID)
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';
import crops from '@/data/recommender/crops.json';
import { COUNTRIES } from '@/lib/contracts/standards';

export const pageTitle = "New Project";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.card{position:absolute;box-sizing:border-box;border-radius:18px;background:#0f261ee6;border:1px solid #23443a;backdrop-filter:blur(14px);box-shadow:0 18px 40px #00000040}
.kick{font-size:11px;letter-spacing:1.3px;font-weight:600;color:#8FB7A0;text-transform:uppercase}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.muted{color:#93AE9F}
.note{font-size:12px;line-height:1.5;color:#86A394}
.row{display:flex;align-items:center;gap:10px}
.sec{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.pill{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:600;white-space:nowrap}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;background:#143026;color:#E8F1EA;font-size:13px;font-weight:600}
.btn.go{background:#DCE96C;color:#14382b;border-color:#DCE96C}
.btn:disabled{opacity:.45;cursor:not-allowed}
.tab{flex:1;min-height:38px;border-radius:10px;border:0;background:transparent;color:#B9CDC0;font-size:13px;font-weight:600}
.tab.on{background:#DCE96C;color:#14382b}
.lbl{display:block;font-size:12px;font-weight:600;color:#C9D9CF}
.fld{display:block;width:100%;box-sizing:border-box;min-height:40px;padding:0 12px;margin-top:5px;border-radius:10px;border:1px solid #2f5a48;background:#132e25;color:#E8F1EA;font:inherit;font-size:13.5px;color-scheme:dark}
.ta{display:block;width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:1px solid #2f5a48;background:#0c1f19;color:#E8F1EA;font-family:var(--font-mono),ui-monospace,monospace;font-size:12.5px;line-height:1.6;resize:none}
.tbl{width:100%;border-collapse:collapse;font-size:12.5px}
.tbl th{text-align:left;font-weight:600;font-size:10.5px;letter-spacing:.6px;text-transform:uppercase;color:#8FB7A0;padding:7px 8px;border-bottom:1px solid #23443a;position:sticky;top:0;background:#0f261e}
.tbl td{padding:8px;border-bottom:1px solid #1a3a30;vertical-align:top}
.step{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:#7f9b8c}
.step b{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#1a3a2f;color:#93AE9F;font-size:12px}
.step.on{color:#E8F1EA}.step.on b{background:#DCE96C;color:#14382b}
.step.done b{background:#2f7a4c;color:#E8F1EA}
`;

const CROPS = crops.map((c) => c.name);
const fmtDate = (d) => { if (!d) return '—'; const p = d.split('-'); return Number(p[2]) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1] + ' ' + p[0]; };

class Logic extends DCLogic {
  state = {
    tab: 'paste', text: '', rows: null, include: {}, saved: [], busy: false, error: null,
    form: { exporter: '', produce: CROPS[0], qtyT: 20, country: COUNTRIES[0], pricePerKg: '', deliverBy: '', sowBy: '' },
  };
  async post(url, body) {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const responseText = await res.text();
    let data = null;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      // Framework and hosting errors are sometimes returned as HTML or an empty body.
    }
    if (!res.ok) throw new Error(data?.error || `Request failed (${res.status}). Please try again.`);
    if (!data) throw new Error(`The server returned an empty response (${res.status}). Please try again.`);
    return data;
  }
  async loadExample() {
    try { const data = await (await fetch('/api/orderbook/parse')).json(); this.setState({ text: data.example, error: null }); } catch (e) { this.setState({ error: 'Could not load the example.' }); }
  }
  async read() {
    this.setState({ busy: true, error: null });
    try {
      const data = await this.post('/api/orderbook/parse', { text: this.state.text });
      const include = {}; data.rows.forEach((r, i) => { include[i] = !!r.contract; });
      this.setState({ rows: data.rows, include, saved: [], busy: false });
    } catch (e) { this.setState({ busy: false, error: String(e.message || e) }); }
  }
  async saveRows() {
    const { rows, include } = this.state;
    const contracts = rows.filter((r, i) => r.contract && include[i]).map((r) => r.contract);
    if (!contracts.length) return;
    this.setState({ busy: true, error: null });
    try {
      const data = await this.post('/api/contracts', { contracts });
      this.setState({ saved: data.created, busy: false });
    } catch (e) { this.setState({ busy: false, error: String(e.message || e) }); }
  }
  async saveOne() {
    const f = this.state.form;
    this.setState({ busy: true, error: null });
    try {
      const data = await this.post('/api/contracts', { contracts: [{ ...f, qtyT: Number(f.qtyT), pricePerKg: f.pricePerKg === '' ? null : Number(f.pricePerKg), source: 'manual' }] });
      this.setState({ saved: data.created, rows: null, busy: false });
    } catch (e) { this.setState({ busy: false, error: String(e.message || e) }); }
  }
  renderVals() {
    const { tab, text, rows, include, saved, busy, error, form } = this.state;
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Contracts'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const step = saved.length ? 3 : rows ? 2 : 1;
    const setF = (k) => (e) => this.setState({ form: { ...form, [k]: e.target.value } });
    const chosen = rows ? rows.filter((r, i) => r.contract && include[i]).length : 0;
    return {
      nav, tab, text, busy, error, form, crops: CROPS, countries: COUNTRIES,
      steps: [['Order book', 1], ['Review contracts', 2], ['Allocate farmers', 3]].map(([t, n]) => ({ t, n, cls: n === step ? 'on' : n < step ? 'done' : '' })),
      pasteTab: () => this.setState({ tab: 'paste' }), oneTab: () => this.setState({ tab: 'one' }),
      onText: (e) => this.setState({ text: e.target.value }), example: () => this.loadExample(), read: () => this.read(),
      canRead: !!text.trim() && !busy,
      onEx: setF('exporter'), onProd: setF('produce'), onQty: setF('qtyT'), onCountry: setF('country'), onPrice: setF('pricePerKg'), onDl: setF('deliverBy'), onSow: setF('sowBy'),
      canOne: !!form.exporter.trim() && Number(form.qtyT) > 0 && !!form.deliverBy && !busy, saveOne: () => this.saveOne(),
      hasRows: !!rows && !saved.length, noRows: !rows && !saved.length, hasSaved: saved.length > 0,
      rows: (rows || []).map((r, i) => ({
        line: r.line, ok: !!r.contract, on: !!include[i], toggle: () => this.setState({ include: { ...include, [i]: !include[i] } }),
        ex: r.contract ? r.contract.exporter : r.raw, produce: r.contract ? r.contract.produce : '', qty: r.contract ? r.contract.qtyT + ' t' : '',
        country: r.contract ? r.contract.country : '', price: r.contract && r.contract.pricePerKg != null ? '₹' + r.contract.pricePerKg + '/kg' : '—',
        due: r.contract ? fmtDate(r.contract.deliverBy) : '', issues: [...r.errors.map((m) => ({ m, c: '#FFB4A6' })), ...r.warnings.map((m) => ({ m, c: '#F5C76A' }))],
        mark: !r.contract ? '✕' : r.warnings.length ? '!' : '✓', markC: !r.contract ? '#FFB4A6' : r.warnings.length ? '#F5C76A' : '#8BE3A6',
      })),
      okCount: rows ? rows.filter((r) => r.contract).length : 0, badCount: rows ? rows.filter((r) => !r.contract).length : 0, chosen,
      saveRows: () => this.saveRows(), canSave: chosen > 0 && !busy, back: () => this.setState({ rows: null, saved: [] }),
      saved: saved.map((c) => ({ id: c.id, ex: c.exporter, line: `${c.produce} · ${c.qtyT} t · ${c.country}`, due: fmtDate(c.deliverBy), value: c.valueINR != null ? '₹' + (c.valueINR / 1e5).toFixed(1) + ' L' : 'Price TBD', rec: '/recommendations?contract=' + c.id, view: '/contracts?id=' + c.id })),
      again: () => this.setState({ rows: null, saved: [], text: '' }),
    };
  }
}

export default function NewProjectPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (
    <div style={{ position: 'relative', width: 1440, height: 900, overflow: 'hidden', background: 'radial-gradient(1000px 640px at 60% 50%,#183a2d 0%,#0f261e 55%,#0a1814 100%)', fontFamily: 'var(--font-inter),system-ui,sans-serif', color: '#E8F1EA' }}>
      <header style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 64, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 5 }}>
        <div className="row"><div style={{ width: 34, height: 34, borderRadius: 11, background: '#DCE96C', display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{ fontWeight: 700, fontSize: 18 }}>Farmora</span></div>
        <nav aria-label="Workspaces" style={{ display: 'flex', gap: 2, marginLeft: 12, padding: 4, borderRadius: 999, background: '#12281f99', border: '1px solid #2c4a3d' }}>{v.nav.map((n, i) => (<Link key={i} href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link>))}</nav>
      </header>

      <div style={{ position: 'absolute', left: 24, top: 80, width: 720 }}>
        <div className="hd" style={{ fontSize: 30, lineHeight: 1.1 }}><Link href="/contracts" style={{ color: '#A9C0B2' }}>Contracts</Link><span aria-hidden="true" style={{ color: '#3d6b55', margin: '0 10px' }}>/</span>New project</div>
        <div className="note" style={{ fontSize: 13, marginTop: 6 }}>Bring in your order book, check the contracts, then let the recommender pick farmers for each one.</div>
      </div>
      <ol aria-label="Steps" style={{ position: 'absolute', left: 760, top: 92, margin: 0, padding: 0, listStyle: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
        {v.steps.map((s, i) => (<Fragment key={i}>{i > 0 && <span style={{ width: 40, height: 2, background: '#23443a' }} />}<li className={`step ${s.cls}`}><b>{s.cls === 'done' ? '✓' : s.n}</b>{s.t}</li></Fragment>))}
      </ol>

      {/* Step 1 */}
      <section className="card" style={{ left: 24, top: 156, width: 560, height: 720, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="kick">Step 1 · Your order book</div>
        <div role="tablist" className="row" style={{ gap: 4, padding: 4, borderRadius: 12, background: '#132e25', border: '1px solid #1f3d33' }}>
          <button role="tab" aria-selected={v.tab === 'paste'} className={`tab ${v.tab === 'paste' ? 'on' : ''}`} onClick={v.pasteTab}>Paste whole order book</button>
          <button role="tab" aria-selected={v.tab === 'one'} className={`tab ${v.tab === 'one' ? 'on' : ''}`} onClick={v.oneTab}>Add one contract</button>
        </div>
        {v.tab === 'paste' && (<>
          <div className="note">Paste rows from Excel, Google Sheets or a CSV. One deal per row: <b style={{ color: '#C9D9CF' }}>exporter, produce, quantity, country, price, deliver by</b> (sow by is optional). A header row is detected automatically.</div>
          <label htmlFor="ob" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Order book</label>
          <textarea id="ob" className="ta" style={{ flex: 1 }} value={v.text} onChange={v.onText} placeholder={'exporter,produce,quantity,country,price,deliver by\nLionCity Fresh Imports,Mango,30 t,Singapore,₹78/kg,2027-05-20'} />
          <div className="row">
            <button className="btn" onClick={v.example}>Load example</button>
            <button className="btn go" style={{ marginLeft: 'auto' }} disabled={!v.canRead} onClick={v.read}>{v.busy ? 'Reading…' : 'Read order book →'}</button>
          </div>
        </>)}
        {v.tab === 'one' && (<>
          <div><label className="lbl" htmlFor="ex">Exporter or buyer</label><input id="ex" className="fld" value={v.form.exporter} onChange={v.onEx} placeholder="e.g. LionCity Fresh Imports" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label className="lbl" htmlFor="pr">Produce</label><select id="pr" className="fld" value={v.form.produce} onChange={v.onProd}>{v.crops.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="lbl" htmlFor="qt">Quantity (t)</label><input id="qt" type="number" min="1" className="fld" value={v.form.qtyT} onChange={v.onQty} /></div>
            <div><label className="lbl" htmlFor="co">Destination country</label><select id="co" className="fld" value={v.form.country} onChange={v.onCountry}>{v.countries.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="lbl" htmlFor="pk">Price paid (₹/kg)</label><input id="pk" type="number" min="0" className="fld" value={v.form.pricePerKg} onChange={v.onPrice} placeholder="optional" /></div>
            <div><label className="lbl" htmlFor="db">Deliver by</label><input id="db" type="date" className="fld" value={v.form.deliverBy} onChange={v.onDl} /></div>
            <div><label className="lbl" htmlFor="sb">Sow by (optional)</label><input id="sb" type="date" className="fld" value={v.form.sowBy} onChange={v.onSow} /></div>
          </div>
          <div className="note" style={{ marginTop: 'auto' }}>The produce and quantity size the land the recommender asks farmers for.</div>
          <button className="btn go" disabled={!v.canOne} onClick={v.saveOne}>{v.busy ? 'Saving…' : 'Save contract →'}</button>
        </>)}
        {v.error && <div className="note" style={{ color: '#FFB4A6' }}>{v.error}</div>}
      </section>

      {/* Step 2 / 3 */}
      <section className="card" aria-live="polite" style={{ left: 596, top: 156, width: 820, height: 720, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {v.noRows && (<div style={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center' }}><div style={{ maxWidth: 420 }}>
          <div className="hd" style={{ fontSize: 20 }}>Your contracts will appear here</div>
          <div className="note" style={{ marginTop: 8, fontSize: 13 }}>Paste the order book on the left and press <b style={{ color: '#C9D9CF' }}>Read order book</b>. You’ll see every deal the system understood, with anything it couldn’t read flagged, before anything is saved.</div>
        </div></div>)}

        {v.hasRows && (<>
          <div className="sec"><div><div className="kick">Step 2 · Review contracts</div><div className="hd" style={{ fontSize: 20, marginTop: 4 }}>{v.okCount} contracts read{v.badCount ? `, ${v.badCount} need fixing` : ''}</div></div><button className="btn" onClick={v.back}>Edit order book</button></div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', borderRadius: 12, border: '1px solid #1f3d33' }}>
            <table className="tbl">
              <thead><tr><th style={{ width: 34 }}></th><th>Exporter</th><th>Produce</th><th>Qty</th><th>Country</th><th>Price</th><th>Deliver by</th></tr></thead>
              <tbody>{v.rows.map((r, i) => (<Fragment key={i}>
                <tr style={{ opacity: r.ok && !r.on ? .5 : 1 }}>
                  <td>{r.ok ? <input type="checkbox" checked={r.on} onChange={r.toggle} aria-label={`Include ${r.ex}`} style={{ accentColor: '#DCE96C', width: 16, height: 16 }} /> : <span style={css(`color:${r.markC};font-weight:700`)}>{r.mark}</span>}</td>
                  <td style={{ fontWeight: 600 }}>{r.ex}{r.ok && <span style={css(`margin-left:6px;color:${r.markC}`)}>{r.mark}</span>}</td><td>{r.produce}</td><td>{r.qty}</td><td>{r.country}</td><td>{r.price}</td><td>{r.due}</td>
                </tr>
                {r.issues.length > 0 && (<tr><td></td><td colSpan={6} style={{ paddingTop: 0 }}>{r.issues.map((x, j) => <div key={j} style={css(`font-size:11.5px;color:${x.c}`)}>Line {r.line}: {x.m}</div>)}</td></tr>)}
              </Fragment>))}</tbody>
            </table>
          </div>
          <div className="row"><span className="note">Untick a row to leave it out. Rows marked ✕ can’t be saved until fixed in the order book.</span><button className="btn go" style={{ marginLeft: 'auto' }} disabled={!v.canSave} onClick={v.saveRows}>{v.busy ? 'Saving…' : `Save ${v.chosen} contract${v.chosen === 1 ? '' : 's'} →`}</button></div>
        </>)}

        {v.hasSaved && (<>
          <div className="sec"><div><div className="kick">Step 3 · Allocate farmers</div><div className="hd" style={{ fontSize: 20, marginTop: 4 }}>{v.saved.length} contract{v.saved.length === 1 ? '' : 's'} saved. Pick one to staff.</div></div><button className="btn" onClick={v.again}>Add more</button></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
            {v.saved.map((c) => (<div key={c.id} className="row" style={{ padding: '12px 14px', borderRadius: 14, background: '#132e25', border: '1px solid #1f3d33' }}>
              <span className="pill" style={{ background: '#1d3f31', color: '#DCE96C' }}>{c.id}</span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{c.ex}</div><div className="muted" style={{ fontSize: 12.5 }}>{c.line} · deliver by {c.due} · {c.value}</div></div>
              <Link href={c.view} className="btn">View</Link>
              <Link href={c.rec} className="btn go">Find farmers →</Link>
            </div>))}
          </div>
          <div className="note" style={{ marginTop: 'auto' }}>The recommender ranks farmers by climate risk, spreads the lot across regions (max 8% per farmer, 25% per region) and skips land already given to other contracts. Save the lot there to attach it to the contract.</div>
        </>)}
      </section>
    </div>
  )} />;
}
