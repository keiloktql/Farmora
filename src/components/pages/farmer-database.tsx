// @ts-nocheck
/* eslint-disable */
// Farmer database as a character screen: roster on the left, the farmer as a 3D voxel character in the middle,
// and a game-style character sheet (stats, perks, quests, season record) on the right.
// Data: GET /api/farmers (roster) and GET /api/farmers/:id (profile + climate history + contracts).
'use client';

import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';
import { CROP_C, SKIN, SHIRT, CAP, shade, voxels, farmer as buildFarmer } from '@/lib/voxel';

export const pageTitle = "Farmer Database";

const CSS = `
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:11px;letter-spacing:1.6px;font-weight:700;color:#8FB7A0;text-transform:uppercase}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.note{font-size:12px;line-height:1.5;color:#86A394}
.fld{box-sizing:border-box;min-height:38px;padding:0 10px;border-radius:10px;border:1px solid #2f5a48;background:#132e25;color:#E8F1EA;font:inherit;font-size:13px;color-scheme:dark}
.ro{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;padding:0 10px;border-radius:14px;border:1px solid transparent;background:transparent;color:#E8F1EA;text-align:left}
.ro:hover{background:#143026}
.ro.on{background:#1d3f31;border-color:#DCE96C}
.head{position:relative;flex:none;border-radius:50%;display:grid;place-items:end center;overflow:hidden}
.shield{flex:none;display:grid;place-items:center;width:34px;height:38px;font-weight:800;font-size:12.5px;clip-path:polygon(50% 0,100% 16%,100% 58%,50% 100%,0 58%,0 16%)}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:7px;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#F3E9A8;background:#2a2a12f0;border:1px solid #DCE96C88;box-shadow:0 8px 24px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.stat{display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:4px 10px}
.stat .ic{grid-row:span 2;width:28px;height:28px;border-radius:9px;display:grid;place-items:center}
.stat .nm{font-size:11px;letter-spacing:1.2px;font-weight:700;text-transform:uppercase;color:#C9D9CF}
.stat .val{font-family:var(--font-space),sans-serif;font-size:15px;font-weight:700;text-align:right}
.seg{grid-column:2 / span 2;display:grid;grid-template-columns:repeat(10,1fr);gap:3px}
.seg i{height:8px;border-radius:2px;background:#1c3a2f}
.perk{display:flex;flex-direction:column;align-items:center;gap:5px;padding:9px 4px;border-radius:12px;border:1px solid #2c4a3d;background:#143026;font-size:10.5px;font-weight:600;text-align:center;line-height:1.2}
.perk.off{opacity:.32;filter:grayscale(1)}
.ctab{min-height:26px;padding:0 10px;border-radius:999px;border:1px solid #2f5a48;background:transparent;color:#B9CDC0;font-size:11.5px;font-weight:600}
.ctab.on{background:#E8F1EA;color:#14382b;border-color:#E8F1EA}
.scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:#2f5a48 transparent}
@keyframes spin{to{transform:rotateZ(360deg)}}
.spin{animation:spin 24s linear infinite}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.rise{animation:rise .35s ease both}
@media (prefers-reduced-motion:reduce){.spin,.rise{animation:none}}
`;

const IRR = { rainfed: 'Rain-fed', canal: 'Canal', borewell: 'Borewell', borewell_drip: 'Drip' };
const WATER = { rainfed: 25, canal: 55, borewell: 68, borewell_drip: 90 };
const shieldCol = (s) => (s == null ? ['#2a3a33', '#93AE9F'] : s >= 80 ? ['#3f8f5a', '#E9FFE9'] : s >= 60 ? ['#9a8a2a', '#FFF8D6'] : ['#9a3f35', '#FFE4DE']);
const I = {
  shield: <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />,
  drop: <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z" />,
  land: <><path d="M3 18h18" /><path d="M7 18v-5M12 18V8M17 18v-7" /></>,
  pin: <><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2" /></>,
  hand: <path d="M4 12l4-4 4 3 4-3 4 4-8 7z" />,
};
const Icon = ({ k, c }) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[k]}</svg>);

class Logic extends DCLogic {
  state = { q: '', crop: '', sort: 'risk', list: null, totals: null, facets: null, loading: true, error: null, sel: null, detail: null, cropTab: null };
  timer = null;
  async load() {
    const { q, crop, sort } = this.state;
    const qs = new URLSearchParams({ sort });
    if (q) qs.set('q', q); if (crop) qs.set('crop', crop);
    this.setState({ loading: true });
    try {
      const res = await fetch('/api/farmers?' + qs.toString());
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Could not load farmers');
      this.setState({ list: d.farmers, totals: d.totals, facets: d.facets, loading: false, error: null });
      if (this.state.sel == null && d.farmers.length) this.pick(d.farmers[0].id);
    } catch (e) { this.setState({ loading: false, error: String(e && e.message || e) }); }
  }
  async pick(id) {
    this.setState({ sel: id });
    try {
      const res = await fetch('/api/farmers/' + id);
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Could not load farmer');
      if (this.state.sel !== id) return;
      const best = d.climate.filter((c) => c.riskScore != null).sort((a, b) => a.riskScore - b.riskScore)[0];
      const tab = this.state.crop && d.crops.includes(this.state.crop) ? this.state.crop : (best ? best.crop : d.crops[0]);
      this.setState({ detail: d, cropTab: tab });
    } catch (e) { this.setState({ error: String(e && e.message || e) }); }
  }
  set(patch, debounce) { this.setState(patch); clearTimeout(this.timer); this.timer = setTimeout(() => this.load(), debounce ? 250 : 0); }
  componentDidMount() {
    if (this._started) return;
    this._started = true;
    const id = Number(new URLSearchParams(window.location.search).get('id'));
    if (id) this.pick(id);
    this.load();
  }
  componentWillUnmount() { clearTimeout(this.timer); }

  renderVals() {
    const S = this.state, T = S.totals, D = S.detail;
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Farmer DB'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });

    const roster = (S.list || []).map((f) => {
      const sh = f.shownRisk == null ? null : 100 - f.shownRisk, [sb, sf] = shieldCol(sh);
      return { id: f.id, name: f.name, sub: (f.district || f.state) + ' · ' + f.kmFromFpo.toLocaleString('en-IN') + ' km', skin: SKIN[f.id % 4], shirt: SHIRT[f.id % 6], cap: CAP[f.id % 4],
        crops: f.crops.map((c) => CROP_C[c] || '#8fb7a0'), shield: sh == null ? '—' : sh, sb, sf, on: f.id === S.sel, busy: f.contracts > 0, pick: () => this.pick(f.id) };
    });
    const cropOpts = S.facets ? Object.keys(S.facets.crops).sort().map((c) => ({ v: c, t: c + ' (' + S.facets.crops[c] + ')' })) : [];

    let d = null;
    const faces = [];
    if (D) {
      const cl = D.climate.find((c) => c.crop === S.cropTab) || D.climate[0];
      const shieldOf = (c) => (c && c.riskScore != null ? 100 - c.riskScore : null);
      const sh = shieldOf(cl);
      const water = Math.min(100, (WATER[D.irrigation] ?? 40) + (D.irrigation !== 'rainfed' && D.irrigationReliable ? 8 : 0) - (D.waterlogging === 'often' ? 10 : 0));
      const land = Math.min(100, Math.round(D.freeNowAcres / 8 * 100));
      const reach = Math.max(4, Math.round(100 - D.kmFromFpo / 25));
      const trust = D.trust ?? 0;
      const statDefs = [
        { k: 'shield', nm: 'Climate shield', v: sh, val: sh == null ? '—' : sh, c: '#7FE0A0', why: cl && cl.riskScore != null ? cl.crop + ': worst seasons about ' + Math.round(cl.tailLoss * 100) + '% below normal' : 'No climate history yet' },
        { k: 'drop', nm: 'Water', v: water, val: water, c: '#6CC4F0', why: (IRR[D.irrigation] || 'Unknown') + (D.irrigation === 'rainfed' ? '' : D.irrigationReliable ? ' · lasts the dry months' : ' · runs short in dry months') },
        { k: 'land', nm: 'Free land', v: land, val: D.freeNowAcres + ' ac', c: '#DCE96C', why: D.totalAcres + ' ac total · ' + D.committedAcres + ' ac on contracts' },
        { k: 'pin', nm: 'Reach', v: reach, val: reach, c: '#F2A65A', why: D.kmFromFpo.toLocaleString('en-IN') + ' km from the FPO' },
        { k: 'hand', nm: 'Trust', v: trust, val: trust || '—', c: '#C9A0DC', why: 'Shown only. Never changes who gets picked' },
      ];
      const stats = statDefs.map((s) => ({ ...s, segs: Array.from({ length: 10 }, (_, i) => (s.v != null && i < Math.round(s.v / 10) ? s.c : null)) }));
      const scored = [sh, water, land, reach].filter((x) => x != null);
      const power = Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
      const grade = power >= 80 ? 'S' : power >= 65 ? 'A' : power >= 50 ? 'B' : 'C';
      const gradeC = { S: '#DCE96C', A: '#7FE0A0', B: '#6CC4F0', C: '#F2A65A' }[grade];

      const pr = D.practices || [];
      const perks = [
        { t: 'Drip line', on: D.irrigation === 'borewell_drip', c: '#6CC4F0' },
        { t: 'Year-round water', on: D.irrigation !== 'rainfed' && !!D.irrigationReliable, c: '#6CC4F0' },
        { t: 'Mulching', on: pr.includes('mulching'), c: '#D49A66' },
        { t: 'Raised beds', on: pr.includes('raised_beds'), c: '#B6E36B' },
        { t: 'Shade net', on: pr.includes('shade_net'), c: '#7FE0A0' },
        { t: 'Never floods', on: D.waterlogging === 'never', c: '#F5B83D' },
      ];

      const lvl = 1 + (D.pastContracts || 0);
      const xp = D.onTimePct ?? 0;
      const main = (D.climate.filter((c) => c.riskScore != null).sort((a, b) => a.riskScore - b.riskScore)[0] || { crop: D.crops[0] }).crop;
      const klass = (D.irrigation === 'borewell_drip' ? 'Drip ' : D.irrigation === 'rainfed' ? 'Rain-fed ' : '') + main + ' ' + (main === 'Broiler' ? 'Rearer' : 'Grower');

      const seasons = cl && cl.seasons ? cl.seasons.map((s) => ({ c: s.farm >= -0.05 ? '#3f8f5a' : s.farm >= -0.15 ? '#9a8a2a' : '#9a3f35', tip: s.season + '–' + String(s.season + 1).slice(2) + ': ' + (s.farm >= 0 ? '+' : '') + Math.round(s.farm * 100) + '% vs normal' })) : [];
      const won = cl && cl.seasons ? cl.seasons.filter((s) => s.farm >= -0.05).length : 0;
      const worst = cl && cl.worst ? cl.worst[0] : null;

      d = {
        name: D.name, klass, where: (D.district || '—') + ', ' + D.stateName, lvl, xp, grade, gradeC, power,
        crops: D.crops.map((c) => ({ c, col: CROP_C[c] || '#8fb7a0' })),
        stats, perks,
        exportLand: (() => {
          const tot = D.totalAcres || 0, exp = Math.min(tot, D.committedAcres || 0), free = Math.min(tot - exp, D.freeNowAcres || 0), own = Math.max(0, tot - exp - free);
          const pc = (x) => (tot ? x / tot * 100 : 0), r = (x) => Math.round(x * 100) / 100;
          return {
            pct: tot ? Math.round(pc(exp)) + '%' : '—', text: r(exp) + ' of ' + tot + ' ac on export contracts',
            parts: [
              { k: 'Export', ac: r(exp), w: pc(exp), c: '#DCE96C' },
              { k: 'Free', ac: r(free), w: pc(free), c: '#6FD08C' },
              { k: 'Own use', ac: r(own), w: pc(own), c: '#3d6b55' },
            ],
          };
        })(),
        tabs: D.climate.map((c) => ({ c: c.crop, on: cl && c.crop === cl.crop, pick: () => this.setState({ cropTab: c.crop }) })),
        seasons, record: seasons.length ? won + ' won · ' + (seasons.length - won) + ' lost' : 'No season history',
        worst: worst ? 'Toughest: ' + worst.season + '–' + String(worst.season + 1).slice(2) + ' (' + Math.round(worst.farm * 100) + '%)' : '',
        src: cl && cl.source ? (cl.source === 'yield records' ? 'Govt yield records' : 'NASA weather') : '',
        quests: D.commitments.map((q) => ({ href: '/contracts?id=' + q.contractId, t: q.produce + ' for ' + q.exporter, s: q.tonnes + ' t · ' + q.acres + ' ac · ' + q.status, col: CROP_C[q.produce] || '#8fb7a0' })),
        noQuests: D.commitments.length === 0,
      };

      // 3D voxel farmer on a plinth (shared builder in lib/voxel), with a crop bed per crop (taller plants = safer crop).
      const { box, V } = voxels(faces);
      faces.push({ css: 'left:20px;top:20px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,#2f6a50 0%,#1d4a39 60%,#143528 100%);box-shadow:0 0 0 3px ' + gradeC + '66,0 0 70px ' + gradeC + '44;transform:translateZ(4px);' });
      faces.push({ css: 'left:50px;top:50px;width:300px;height:300px;border-radius:50%;border:2px dashed ' + gradeC + '55;box-sizing:border-box;transform:translateZ(5px);' });
      faces.push({ css: 'left:150px;top:160px;width:100px;height:80px;border-radius:50%;background:radial-gradient(closest-side,#00000066,#0000);transform:translateZ(5.5px);' });
      buildFarmer(V, D.id, main);

      D.climate.forEach((c, i) => {
        const a = (i / D.climate.length) * Math.PI * 2 + 0.8, cx = 200 + Math.cos(a) * 136, cy = 200 + Math.sin(a) * 136;
        const s = shieldOf(c), ph = 6 + (s == null ? 6 : s / 100 * 28), col = CROP_C[c.crop] || '#8fb7a0';
        box({ x: cx - 27, y: cy - 27, z: 5, w: 54, d: 54, h: 8, c: '#5a3b25', pat: 'repeating-linear-gradient(90deg,#6b4a2e 0 9px,#4f3320 9px 13px)' });
        [[-12, -12], [12, -12], [-12, 12], [12, 12]].forEach(([dx, dy]) => {
          box({ x: cx + dx - 2.5, y: cy + dy - 2.5, z: 13, w: 5, d: 5, h: ph, c: '#3f8f4f' });
          box({ x: cx + dx - 7, y: cy + dy - 7, z: 13 + ph, w: 14, d: 14, h: 4, c: '#4fbf72' });
          box({ x: cx + dx - 3.5, y: cy + dy - 3.5, z: 17 + ph, w: 7, d: 7, h: 7, c: col });
        });
      });
    }

    return {
      nav, roster, cropOpts, d, faces,
      q: S.q, crop: S.crop, sort: S.sort, loading: S.loading, error: S.error,
      head: T ? T.farmers + ' farmers · ' + T.freeAcres.toLocaleString('en-IN') + ' ac free' : 'Loading…',
      count: S.list ? S.list.length + ' shown' : '',
      onQ: (e) => this.set({ q: e.target.value }, true),
      onCrop: (e) => this.set({ crop: e.target.value }),
      onSort: (e) => this.set({ sort: e.target.value }),
    };
  }
}

export default function FarmerDatabasePage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (
    <div style={{ position: 'relative', width: 1440, height: 900, overflow: 'hidden', background: 'radial-gradient(760px 560px at 49% 50%,#1f4a39 0%,#0f261e 58%,#0a1814 100%)', fontFamily: 'var(--font-inter),system-ui,sans-serif', color: '#E8F1EA' }}>
      {/* 3D stage */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 900, perspective: 2400, perspectiveOrigin: '49% 35%' }}>
        <div style={{ position: 'absolute', left: 708, top: 486, width: 400, height: 400, marginLeft: -200, marginTop: -200, transformStyle: 'preserve-3d', transform: 'scale(1.3) rotateX(58deg)' }}>
          <div className="spin" style={{ position: 'absolute', left: 0, top: 0, width: 400, height: 400, transformStyle: 'preserve-3d' }}>{v.faces.map((f, i) => (<div key={i} style={css(`position:absolute;${f.css}`)} />))}</div>
          
        </div>
      </div>

      <header style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 64, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(#0a1814ee,#0a181400)', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: '#DCE96C', display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{ fontWeight: 700, fontSize: 18 }}>Farmora</span></div>
        <nav aria-label="Workspaces" style={{ display: 'flex', gap: 2, marginLeft: 12, padding: 4, borderRadius: 999, background: '#12281f99', border: '1px solid #2c4a3d' }}>{v.nav.map((n, i) => (<Link key={i} href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link>))}</nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, padding: '0 12px 0 6px', borderRadius: 999, border: '1px solid #2c4a3d', background: '#12281f99', fontSize: 13 }}><span style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8BC7C', color: '#4a3420', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>CF</span><span><b style={{ display: 'block', fontWeight: 600 }}>Chittoor Farmers FPO</b><span style={{ display: 'block', fontSize: 12, color: '#A9C0B2' }}>Farmer database</span></span></div>
      </header>

      {/* Roster */}
      <aside className="panel" aria-label="Farmers" style={{ left: 24, top: 80, width: 320, height: 796, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div><div className="kick" style={{ color: '#DCE96C' }}>Roster</div><div className="hd" style={{ fontSize: 20, marginTop: 4 }}>{v.head}</div></div>
        <label htmlFor="fq" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Search farmers</label>
        <input id="fq" className="fld" value={v.q} onChange={v.onQ} placeholder="Search name or place" autoComplete="off" />
        <div style={{ display: 'flex', gap: 8 }}>
          <select aria-label="Crop" className="fld" style={{ flex: 1, minWidth: 0 }} value={v.crop} onChange={v.onCrop}><option value="">All crops</option>{v.cropOpts.map((o) => (<option key={o.v} value={o.v}>{o.t}</option>))}</select>
          <select aria-label="Sort" className="fld" style={{ flex: 1, minWidth: 0 }} value={v.sort} onChange={v.onSort}><option value="risk">Strongest shield</option><option value="km">Nearest</option><option value="free">Most free land</option><option value="name">Name</option></select>
        </div>
        <div className="scroll" style={{ flex: 1, minHeight: 0, margin: '0 -6px', padding: '0 6px', opacity: v.loading ? .6 : 1 }}>
          {v.roster.map((r) => (
            <button key={r.id} className={'ro' + (r.on ? ' on' : '')} onClick={r.pick} aria-current={r.on}>
              <span className="head" style={css(`width:36px;height:36px;background:${r.skin}`)}><span style={css(`width:24px;height:14px;border-radius:12px 12px 0 0;background:${r.shirt}`)} /><span style={css(`position:absolute;top:3px;width:21px;height:8px;border-radius:10px 10px 2px 2px;background:${r.cap}`)} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><b style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</b>{r.crops.map((c, i) => (<span key={i} style={css(`flex:none;width:7px;height:7px;border-radius:2px;background:${c}`)} />))}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: '#86A394', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}{r.busy ? ' · on a quest' : ''}</span>
              </span>
              <span className="shield" style={css(`background:${r.sb};color:${r.sf}`)} title="Climate shield (100 = safest)">{r.shield}</span>
            </button>
          ))}
          {v.error && (<div className="note" style={{ color: '#F29A8B', padding: 8 }}>{v.error}</div>)}
        </div>
        <div className="note" style={{ display: 'flex', justifyContent: 'space-between' }}><span>{v.count}</span><span>Shield = 100 − climate risk</span></div>
      </aside>

      {v.d && (<>
        {/* Level and rank */}
        <div key={'n' + v.d.name} className="rise" style={{ position: 'absolute', left: 368, top: 86, width: 680, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 54, height: 54, borderRadius: 14, background: '#0f261ee6', border: '1px solid #2c4a3d' }}><span className="kick" style={{ fontSize: 9, letterSpacing: 1 }}>LVL</span><b className="hd" style={{ fontSize: 22, lineHeight: 1, marginTop: -6 }}>{v.d.lvl}</b></span>
            <div style={{ width: 150 }}><div className="kick" style={{ fontSize: 10 }}>On-time XP</div><div style={{ height: 8, borderRadius: 999, background: '#1c3a2f', marginTop: 6, overflow: 'hidden' }}><div style={css(`height:100%;width:${v.d.xp}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div><div className="note" style={{ fontSize: 11, marginTop: 3 }}>{v.d.xp}% · shown only</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} title={'Overall ' + v.d.power + ' / 100 from shield, water, land and reach'}>
            <div style={{ textAlign: 'right' }}><div className="kick" style={{ fontSize: 10 }}>Rank</div><div className="note" style={{ fontSize: 11 }}>{v.d.power} power</div></div>
            <span className="hd" style={css(`display:grid;place-items:center;width:54px;height:54px;border-radius:14px;font-size:30px;color:#14382b;background:${v.d.gradeC};box-shadow:0 0 30px ${v.d.gradeC}66`)}>{v.d.grade}</span>
          </div>
        </div>
        {/* Name plate */}
        <div key={'p' + v.d.name} className="rise" style={{ position: 'absolute', left: 368, top: 742, width: 680, textAlign: 'center' }}>
          <div className="hd" style={{ fontSize: 38, lineHeight: 1 }}>{v.d.name}</div>
          <div style={{ marginTop: 8, fontSize: 14, color: '#C9D9CF' }}><b style={{ color: '#DCE96C', fontWeight: 700 }}>{v.d.klass}</b> · {v.d.where}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>{v.d.crops.map((c, i) => (<span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: '#0f261ee6', border: '1px solid #2c4a3d', fontSize: 12, fontWeight: 600 }}><span style={css(`width:9px;height:9px;border-radius:2px;background:${c.col}`)} />{c.c}</span>))}</div>
        </div>

        {/* Character sheet */}
        <aside className="panel" aria-label="Character sheet" style={{ left: 1072, top: 80, width: 344, height: 796, padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <section key={'s' + v.d.name} className="rise">
            <div className="kick" style={{ color: '#DCE96C', marginBottom: 12 }}>Stats</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {v.d.stats.map((s, i) => (<div key={i} className="stat" title={s.why}>
                <span className="ic" style={css(`background:${s.c}22`)}><Icon k={s.k} c={s.c} /></span>
                <span className="nm">{s.nm}</span><span className="val" style={css(`color:${s.c}`)}>{s.val}</span>
                <span className="seg">{s.segs.map((g, j) => (<i key={j} style={g ? css(`background:${g};box-shadow:0 0 6px ${g}88`) : undefined} />))}</span>
              </div>))}
            </div>
          </section>
          <section aria-label="Export land">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div className="kick">Export land</div>
              <span><b className="hd" style={{ fontSize: 22, color: '#DCE96C' }}>{v.d.exportLand.pct}</b> <span className="note" style={{ fontSize: 11 }}>of total land</span></span>
            </div>
            <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', gap: 2, marginTop: 6, background: '#1c3a2f' }} role="img" aria-label={v.d.exportLand.text}>
              {v.d.exportLand.parts.filter((x) => x.w > 0).map((x, i) => (<span key={i} title={x.k + ': ' + x.ac + ' ac'} style={css(`width:${x.w}%;background:${x.c}`)} />))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
              {v.d.exportLand.parts.map((x, i) => (<span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#C9D9CF', whiteSpace: 'nowrap' }}><span style={css(`width:8px;height:8px;border-radius:2px;background:${x.c}`)} />{x.k} <b style={{ fontWeight: 600 }}>{x.ac} ac</b></span>))}
            </div>
          </section>
          <section>
            <div className="kick" style={{ marginBottom: 8 }}>Perks</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {v.d.perks.map((p, i) => (<div key={i} className={'perk' + (p.on ? '' : ' off')} title={p.on ? 'Unlocked' : 'Locked'}><span style={css(`width:14px;height:14px;transform:rotate(45deg);border-radius:3px;background:${p.c};box-shadow:0 0 10px ${p.c}`)} />{p.t}</div>))}
            </div>
          </section>
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><div className="kick" style={{ marginRight: 'auto' }}>Season record</div>{v.d.tabs.length > 1 && v.d.tabs.map((t, i) => (<button key={i} className={'ctab' + (t.on ? ' on' : '')} aria-pressed={t.on} onClick={t.pick}>{t.c}</button>))}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15,1fr)', gap: 3 }} role="img" aria-label={v.d.record}>{v.d.seasons.map((s, i) => (<span key={i} title={s.tip} style={css(`height:22px;border-radius:4px;background:${s.c}`)} />))}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}><b style={{ fontWeight: 600 }}>{v.d.record}</b><span className="note">{v.d.worst}</span></div>
            <div className="note" style={{ fontSize: 11 }}>Last 15 seasons at this farm · {v.d.src}</div>
          </section>
          <section style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="kick" style={{ marginBottom: 8 }}>Active quests</div>
            <div className="scroll" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {v.d.quests.map((q, i) => (<Link key={i} href={q.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, background: '#143026', border: '1px solid #2c4a3d' }}><span style={css(`width:10px;height:10px;transform:rotate(45deg);background:${q.col}`)} /><span style={{ flex: 1, minWidth: 0 }}><b style={{ display: 'block', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.t}</b><span style={{ fontSize: 11.5, color: '#86A394' }}>{q.s}</span></span><span style={{ color: '#86A394' }}>→</span></Link>))}
              {v.d.noQuests && (<div className="note" style={{ padding: '10px 12px', borderRadius: 12, border: '1px dashed #2f5a48' }}>No quests yet: free for the next order.</div>)}
            </div>
          </section>
        </aside>
      </>)}
    </div>
  )} />;
}
