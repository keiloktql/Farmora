// @ts-nocheck
/* eslint-disable */
// Progress: every live project against its season timeline, using the progress reports farmers send
// (WhatsApp in production). Expected = where the crop calendar says the project should be today;
// reported = where farmers say they are (weighted by planned tonnes). Data: GET /api/progress.
'use client';

import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';
import { CROP_C, SKIN, SHIRT, CAP, shade, voxels } from '@/lib/voxel';

export const pageTitle = "Progress";

const CSS = `
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:11px;letter-spacing:1.6px;font-weight:700;color:#8FB7A0;text-transform:uppercase}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.note{font-size:12px;line-height:1.45;color:#86A394}
.pj{display:block;width:100%;padding:11px 12px;border-radius:14px;border:1px solid #23443a;background:#132e25;color:#E8F1EA;text-align:left}
.pj:hover{border-color:#3d6b55}
.pj.on{border-color:#DCE96C;background:#1d3f31}
.pill{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap}
.chip{min-height:28px;padding:0 10px;white-space:nowrap;border-radius:999px;border:1px solid #2f5a48;background:transparent;color:#B9CDC0;font-size:12px;font-weight:600}
.chip.on{background:#DCE96C;border-color:#DCE96C;color:#14382b}
.msg{display:flex;gap:10px;padding:9px 6px;border-bottom:1px solid #1a3a30;border-radius:8px}
.msg:hover{background:#143026}
.head{position:relative;flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:end center;overflow:hidden}
.stat{padding:9px 11px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:11px;color:#93AE9F}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:18px;font-weight:600;margin-top:1px}
.scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:#2f5a48 transparent}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.rise{animation:rise .35s ease both}
@keyframes flag{0%,100%{transform:translateZ(0)}50%{transform:translateZ(3px)}}
@media (prefers-reduced-motion:reduce){.rise{animation:none}}
`;

const HEALTH = { 'On track': ['#1f4a33', '#8BE3A6'], Watch: ['#4a4220', '#F2D06B'], Behind: ['#4a2320', '#FFC2B6'] };
const SEV = { low: '#F2D06B', medium: '#F2A65A', high: '#E4584B' };
const fmt = (d) => { if (!d) return '—'; const p = d.split('-'); return Number(p[2]) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1]; };
const ago = (days) => (days == null ? 'never' : days === 0 ? 'today' : days === 1 ? 'yesterday' : days + ' days ago');
const short = (d) => (d && d.length > 14 ? d.split(' ').pop() : d);

class Logic extends DCLogic {
  state = { data: null, error: null, sel: null, filter: 'all', hov: null };
  async componentDidMount() {
    if (this._started) return;
    this._started = true;
    try {
      const res = await fetch('/api/progress');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load progress');
      const want = new URLSearchParams(window.location.search).get('contract');
      const started = data.projects.filter((p) => p.expected > 0);
      this.setState({ data, sel: (data.projects.find((p) => p.id === want) || started[0] || data.projects[0] || {}).id || null });
    } catch (e) { this.setState({ error: String(e && e.message || e) }); }
  }
  renderVals() {
    const S = this.state, P = S.data;
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'Progress'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    if (!P) return { nav, ready: false, error: S.error };
    if (!P.projects.length) return { nav, ready: true, empty: true, waiting: P.unallocated.length };
    const today = new Date(P.today + 'T00:00:00').getTime() / 86400000;

    const projects = P.projects.slice().sort((a, b) => (b.expected > 0) - (a.expected > 0) || a.daysToDelivery - b.daysToDelivery).map((p) => {
      const notStarted = p.expected <= 0;
      return { id: p.id, title: p.produce + ' ' + p.qtyT + ' t', sub: p.exporter + ' · ' + p.country, col: CROP_C[p.produce] || '#8fb7a0',
        exp: Math.round(p.expected * 100), rep: Math.round(p.reported * 100), hb: HEALTH[p.health][0], hf: HEALTH[p.health][1], health: notStarted ? 'Not started' : p.health,
        due: notStarted ? 'starts ' + fmt(p.start) : 'due in ' + p.daysToDelivery + ' d', notStarted, on: p.id === S.sel, pick: () => this.setState({ sel: p.id, hov: null, filter: 'all' }) };
    });

    const J = P.projects.find((p) => p.id === S.sel) || P.projects[0];
    const col = CROP_C[J.produce] || '#8fb7a0', notStarted = J.expected <= 0;
    const stages = [];
    J.stages.forEach((s, i, a) => {
      // Drop a label lower when it sits close to the previous one (and that one wasn't dropped) so names don't collide.
      const close = i > 0 && s.frac - a[i - 1].frac < .14;
      stages.push({ name: s.name, date: fmt(s.date), left: s.frac * 100, done: J.reported >= s.frac, due: J.expected >= s.frac, drop: close && !stages[i - 1].drop ? 30 : 0 });
    });

    // Diorama: one plot per farmer, drawn at the stage they last reported.
    const faces = [];
    const { box } = voxels(faces);
    faces.push({ css: 'left:0;top:0;width:760px;height:430px;border-radius:28px;background:linear-gradient(#1d4a39,#143528);box-shadow:0 0 0 2px #2c4a3d,0 0 60px #00000055;transform:translateZ(0px);' });
    const n = J.farmers.length, cols = Math.min(6, Math.max(3, Math.ceil(n / 3))), rowsN = Math.ceil(n / cols), pw = 96, pd = 80, gx = 18, gy = 18;
    const x0 = (760 - (cols * pw + (cols - 1) * gx)) / 2, y0 = (430 - (rowsN * pd + (rowsN - 1) * gy)) / 2;
    const broiler = J.produce === 'Broiler';
    J.farmers.forEach((f, i) => {
      const cx = x0 + (i % cols) * (pw + gx), cy = y0 + Math.floor(i / cols) * (pd + gy), hl = S.hov === f.farmerId, quiet = f.silent, fr = f.frac;
      const soil = quiet ? '#3d3a35' : hl ? '#7a5a36' : '#5a3b25';
      box({ x: cx, y: cy, z: 0, w: pw, d: pd, h: 6, c: soil, pat: quiet ? undefined : 'repeating-linear-gradient(90deg,#6b4a2e 0 10px,#4f3320 10px 15px)' });
      const spots = [[.2, .28], [.5, .28], [.8, .28], [.2, .72], [.5, .72], [.8, .72]];
      if (broiler) {
        box({ x: cx + 10, y: cy + 10, z: 6, w: pw - 20, d: pd - 30, h: 18, c: '#C9B48A' });
        box({ x: cx + 6, y: cy + 6, z: 24, w: pw - 12, d: pd - 22, h: 4, c: '#8B5A2B' });
        const birds = fr <= 0 ? 0 : Math.max(1, Math.round(fr * 8));
        for (let b = 0; b < birds; b++) box({ x: cx + 10 + (b % 4) * 20, y: cy + pd - 18 + Math.floor(b / 4) * -8, z: 6, w: 7 + fr * 5, d: 7 + fr * 5, h: 6 + fr * 5, c: '#F4F1E8' });
      } else if (fr >= .85) {
        [[.25, .5], [.55, .5]].forEach(([fx, fy]) => { const x = cx + fx * pw, y = cy + fy * pd; box({ x: x - 12, y: y - 12, z: 6, w: 24, d: 24, h: 16, c: '#B07A3E', pat: 'repeating-linear-gradient(0deg,#B07A3E 0 4px,#8E5E2C 4px 6px)' }); box({ x: x - 8, y: y - 8, z: 22, w: 16, d: 16, h: 4, c: col }); });
      } else if (fr > 0) {
        const ph = 4 + Math.min(1, fr / .6) * 26, leaf = quiet ? '#6b7a70' : '#4fbf72';
        spots.forEach(([fx, fy]) => {
          const x = cx + fx * pw, y = cy + fy * pd;
          box({ x: x - 2, y: y - 2, z: 6, w: 4, d: 4, h: ph, c: quiet ? '#5b6a60' : '#3f8f4f' });
          if (fr >= .12) box({ x: x - 7, y: y - 7, z: 6 + ph, w: 14, d: 14, h: 3, c: leaf });
          if (fr >= .45 && fr < .6) box({ x: x - 3, y: y - 3, z: 9 + ph, w: 6, d: 6, h: 4, c: '#F4F1E8' });
          if (fr >= .6) box({ x: x - 3.5, y: y - 3.5, z: 9 + ph, w: 7, d: 7, h: 7, c: quiet ? '#7a7a70' : col });
        });
      }
      if (f.issue) { box({ x: cx + pw - 10, y: cy + 6, z: 6, w: 2, d: 2, h: 40, c: '#d9d2bf' }); box({ x: cx + pw - 8, y: cy + 6, z: 34, w: 14, d: 1, h: 10, c: SEV[f.issue.severity] }); }
      if (hl) faces.push({ css: `left:${cx - 4}px;top:${cy - 4}px;width:${pw + 8}px;height:${pd + 8}px;border-radius:10px;border:2px solid #DCE96C;box-sizing:border-box;transform:translateZ(7px);` });
    });

    const byId = Object.fromEntries(J.farmers.map((f) => [f.farmerId, f]));
    const head = (id) => ({ skin: SKIN[id % 4], shirt: SHIRT[id % 6], cap: CAP[id % 4] });
    const feed = S.filter === 'quiet'
      ? J.farmers.filter((f) => f.silent).map((f) => ({ key: 'q' + f.farmerId, id: f.farmerId, name: f.name, when: 'last heard ' + ago(f.daysSince), stage: f.stage, note: f.lastReport ? 'Last update: ' + f.stage.toLowerCase() + ' on ' + fmt(f.lastReport) + '. No report for over two weeks.' : 'Has not sent a report yet.', issue: null, quiet: true, ...head(f.farmerId) }))
      : J.feed.filter((r) => S.filter !== 'issues' || r.issue).map((r) => ({ key: r.id, id: r.farmerId, name: r.name, when: ago(Math.round(today - new Date(r.date + 'T00:00:00').getTime() / 86400000)), stage: r.stage, note: r.note, issue: r.issue ? { text: r.issue.text, c: SEV[r.issue.severity], sev: r.issue.severity } : null, quiet: false, ...head(r.farmerId) }));
    const feedOut = feed.slice(0, 40).map((m) => ({ ...m, place: byId[m.id] ? short(byId[m.id].district) : '', enter: () => this.setState({ hov: m.id }), leave: () => this.setState({ hov: null }), href: '/farmers?id=' + m.id }));
    const filters = [['all', 'All', J.feed.length], ['issues', 'Issues', J.feed.filter((r) => r.issue).length], ['quiet', 'Quiet', J.silent]].map(([k, t, c]) => ({ k, t, c, on: S.filter === k, pick: () => this.setState({ filter: k }) }));
    const gap = Math.round((J.expected - J.reported) * 100);

    return {
      nav, ready: true, projects, stages, faces, feed: feedOut, filters, waiting: P.unallocated.length,
      j: {
        id: J.id, title: J.produce + ' ' + J.qtyT + ' t for ' + J.exporter, sub: J.country + ' · ' + J.farmers.length + ' farmers · ' + fmt(J.start) + ' → deliver ' + fmt(J.deliverBy), col, href: '/contracts?id=' + J.id,
        hb: HEALTH[J.health][0], hf: HEALTH[J.health][1], health: notStarted ? 'Not started' : J.health, notStarted,
        exp: J.expected * 100, rep: J.reported * 100, expText: Math.round(J.expected * 100) + '%', repText: Math.round(J.reported * 100) + '%',
        summary: notStarted ? 'Season starts ' + fmt(J.start) + '. Reports begin once farmers sow.' : 'Should be at ' + J.expectedStage.toLowerCase() + ' · farmers report ' + J.reportedStage.toLowerCase() + (gap > 2 ? ' · ' + gap + ' pts behind' : gap < -2 ? ' · ahead of plan' : ' · on plan'),
        reporting: J.reporting + ' / ' + J.farmers.length, issues: J.issues, forecast: J.forecastT + ' / ' + J.qtyT + ' t', forecastCol: J.forecastT >= J.qtyT * .98 ? '#8BE3A6' : J.forecastT >= J.qtyT * .9 ? '#F2D06B' : '#F29A8B',
        sample: J.sample,
      },
    };
  }
}

export default function ProgressPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (
    <div style={{ position: 'relative', width: 1440, height: 900, overflow: 'hidden', background: 'radial-gradient(760px 560px at 50% 60%,#1f4a39 0%,#0f261e 58%,#0a1814 100%)', fontFamily: 'var(--font-inter),system-ui,sans-serif', color: '#E8F1EA' }}>
      {v.ready && !v.empty && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 900, perspective: 2200, perspectiveOrigin: '50% 34%' }}>
          <div style={{ position: 'absolute', left: 720, top: 580, width: 760, height: 430, marginLeft: -380, marginTop: -215, transformStyle: 'preserve-3d', transform: 'scale(.94) rotateX(52deg)' }}>
            {v.faces.map((f, i) => (<div key={i} style={css(`position:absolute;${f.css}`)} />))}
          </div>
        </div>
      )}

      <header style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 64, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(#0a1814ee,#0a181400)', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: '#DCE96C', display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{ fontWeight: 700, fontSize: 18 }}>Farmora</span></div>
        <nav aria-label="Workspaces" style={{ display: 'flex', gap: 2, marginLeft: 12, padding: 4, borderRadius: 999, background: '#12281f99', border: '1px solid #2c4a3d' }}>{v.nav.map((n, i) => (<Link key={i} href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link>))}</nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, padding: '0 12px 0 6px', borderRadius: 999, border: '1px solid #2c4a3d', background: '#12281f99', fontSize: 13 }}><span style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8BC7C', color: '#4a3420', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>CF</span><span><b style={{ display: 'block', fontWeight: 600 }}>Chittoor Farmers FPO</b><span style={{ display: 'block', fontSize: 12, color: '#A9C0B2' }}>Project progress</span></span></div>
      </header>

      {!v.ready && (<div className="note" style={{ position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', fontSize: 14 }}>{v.error ? 'Could not load: ' + v.error : 'Loading project progress…'}</div>)}
      {v.empty && (<div className="note" style={{ position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', fontSize: 14 }}>No projects with farmers yet. {v.waiting} contracts are waiting for farmer allocation in Contracts.</div>)}

      {v.ready && !v.empty && (<>
        {/* Left: projects */}
        <aside className="panel" style={{ left: 24, top: 80, width: 312, height: 796, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div><div className="kick" style={{ color: '#DCE96C' }}>Projects</div><div className="note" style={{ marginTop: 4 }}>Bar = farmers&apos; reports · white tick = where the timeline says you should be</div></div>
          <div className="scroll" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {v.projects.map((p) => (<button key={p.id} className={'pj' + (p.on ? ' on' : '')} onClick={p.pick} aria-current={p.on}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={css(`width:10px;height:10px;border-radius:3px;background:${p.col}`)} /><b style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{p.title}</b><span className="pill" style={css(`background:${p.notStarted ? '#1a3a2f' : p.hb};color:${p.notStarted ? '#B9CDC0' : p.hf}`)}>{p.health}</span></span>
              <span style={{ display: 'block', fontSize: 11.5, color: '#86A394', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.sub}</span>
              <span style={{ position: 'relative', display: 'block', height: 8, borderRadius: 999, background: '#1c3a2f', marginTop: 9 }}>
                <span style={css(`position:absolute;left:0;top:0;bottom:0;width:${p.rep}%;border-radius:999px;background:${p.col}`)} />
                {!p.notStarted && (<span style={css(`position:absolute;left:calc(${p.exp}% - 1px);top:-3px;width:2px;height:14px;border-radius:1px;background:#F4F1E8`)} />)}
              </span>
              <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#86A394', marginTop: 5 }}><span>{p.notStarted ? 'waiting to sow' : p.rep + '% reported · ' + p.exp + '% due'}</span><span>{p.due}</span></span>
            </button>))}
          </div>
          {v.waiting > 0 && (<Link href="/contracts" className="note" style={{ color: '#DCE96C', fontWeight: 600 }}>{v.waiting} contracts still need farmers →</Link>)}
        </aside>

        {/* Top: project and season timeline */}
        <div key={'t' + v.j.id} className="rise" style={{ position: 'absolute', left: 356, top: 80, width: 728 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div><div className="kick">{v.j.id} · season timeline</div><div className="hd" style={{ fontSize: 26, marginTop: 4 }}>{v.j.title}</div><div className="note" style={{ fontSize: 12.5 }}>{v.j.sub}</div></div>
            <div style={{ textAlign: 'right' }}><span className="pill" style={css(`background:${v.j.notStarted ? '#1a3a2f' : v.j.hb};color:${v.j.notStarted ? '#B9CDC0' : v.j.hf};font-size:12px;padding:4px 10px`)}>{v.j.health}</span><div><Link href={v.j.href} style={{ fontSize: 12, fontWeight: 600, color: '#DCE96C' }}>Open contract →</Link></div></div>
          </div>
          <div style={{ position: 'relative', height: 92, marginTop: 14, padding: '0 10px' }}>
            <div style={{ position: 'absolute', left: 10, right: 10, top: 34, height: 6, borderRadius: 999, background: '#1c3a2f' }} />
            <div style={css(`position:absolute;left:10px;top:34px;height:6px;width:calc((100% - 20px) * ${v.j.exp / 100});border-radius:999px;background:repeating-linear-gradient(90deg,#F4F1E855 0 6px,transparent 6px 10px)`)} />
            <div style={css(`position:absolute;left:10px;top:34px;height:6px;width:calc((100% - 20px) * ${v.j.rep / 100});border-radius:999px;background:${v.j.col};box-shadow:0 0 12px ${v.j.col}88`)} />
            {v.stages.map((s, i) => (<div key={i} style={css(`position:absolute;left:calc(10px + (100% - 20px) * ${s.left / 100});top:30px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;width:86px`)}>
              <span style={css(`width:14px;height:14px;border-radius:50%;box-sizing:border-box;border:2px solid ${s.done ? v.j.col : s.due ? '#F4F1E8' : '#3d6b55'};background:${s.done ? v.j.col : '#0f261e'}`)} />
              {s.drop > 0 && (<span style={css(`width:1px;height:${s.drop}px;background:#3d6b55;margin-top:2px`)} />)}<span style={css(`margin-top:${s.drop ? 2 : 6}px;font-size:11px;font-weight:600;text-align:center;line-height:1.2;color:${s.done ? '#E8F1EA' : s.due ? '#E9DDB4' : '#86A394'}`)}>{s.name}</span>
              <span style={{ fontSize: 10.5, color: '#86A394' }}>{s.date}</span>
            </div>))}
            {!v.j.notStarted && (<>
              <div style={css(`position:absolute;left:calc(10px + (100% - 20px) * ${v.j.exp / 100});top:0;transform:translateX(-50%);font-size:10.5px;font-weight:700;color:#14382b;background:#F4F1E8;padding:1px 7px;border-radius:999px;white-space:nowrap`)}>Today · {v.j.expText}</div>
              <div style={css(`position:absolute;left:calc(10px + (100% - 20px) * ${v.j.rep / 100});top:14px;transform:translateX(-50%);font-size:10.5px;font-weight:700;color:#14382b;background:${v.j.col};padding:1px 7px;border-radius:999px;white-space:nowrap`)}>Farmers · {v.j.repText}</div>
            </>)}
          </div>
          <div style={{ fontSize: 13, color: '#C9D9CF', marginTop: 34, textAlign: 'center' }}>{v.j.summary}</div>
        </div>
        <div className="note" style={{ position: 'absolute', left: 356, top: 848, width: 728, textAlign: 'center' }}>Each plot is one farmer at the stage they last reported. Flags = reported problems · grey = no report for 2+ weeks.</div>

        {/* Right: reports */}
        <aside key={'r' + v.j.id} className="panel" style={{ left: 1104, top: 80, width: 312, height: 796, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="stat"><span>Reported vs due</span><b>{v.j.repText} <span style={{ fontSize: 12, color: '#86A394', fontWeight: 500 }}>/ {v.j.expText}</span></b></div>
            <div className="stat"><span>Reporting (2 wks)</span><b>{v.j.reporting}</b></div>
            <div className="stat"><span>Open issues</span><b style={{ color: v.j.issues ? '#F2A65A' : '#E8F1EA' }}>{v.j.issues}</b></div>
            <div className="stat"><span>Harvest forecast</span><b style={css(`color:${v.j.forecastCol};font-size:15px`)}>{v.j.forecast}</b></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div className="kick" style={{ color: '#DCE96C' }}>Farmer reports</div><span className="note" style={{ fontSize: 11 }}>via WhatsApp</span></div>
          <div role="group" aria-label="Filter reports" style={{ display: 'flex', gap: 5 }}>{v.filters.map((f) => (<button key={f.k} className={'chip' + (f.on ? ' on' : '')} aria-pressed={f.on} onClick={f.pick}>{f.t} <span style={{ opacity: .6 }}>{f.c}</span></button>))}</div>
          <div className="scroll" style={{ flex: 1, minHeight: 0 }}>
            {v.feed.map((m) => (<Link key={m.key} href={m.href} className="msg" onMouseEnter={m.enter} onMouseLeave={m.leave} onFocus={m.enter} onBlur={m.leave}>
              <span className="head" style={css(`background:${m.skin};${m.quiet ? 'filter:grayscale(1)' : ''}`)}><span style={css(`width:20px;height:12px;border-radius:10px 10px 0 0;background:${m.shirt}`)} /><span style={css(`position:absolute;top:3px;width:18px;height:7px;border-radius:9px 9px 2px 2px;background:${m.cap}`)} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><b style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</b><span style={{ fontSize: 11, color: '#86A394', whiteSpace: 'nowrap' }}>{m.when}</span></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}><span className="pill" style={{ background: '#1d3f31', color: '#C9D9CF', fontWeight: 600 }}>{m.stage}</span><span style={{ fontSize: 10.5, color: '#86A394' }}>{m.place}</span></span>
                <span style={{ display: 'block', fontSize: 12, color: '#C9D9CF', marginTop: 4, lineHeight: 1.4 }}>{m.note}</span>
                {m.issue && (<span className="pill" style={css(`margin-top:5px;background:${m.issue.c}22;color:${m.issue.c};border:1px solid ${m.issue.c}66`)}>⚑ {m.issue.text} · {m.issue.sev}</span>)}
              </span>
            </Link>))}
            {!v.feed.length && (<div className="note" style={{ padding: 12 }}>{v.j.notStarted ? 'No reports yet: the season hasn’t started.' : 'Nothing here.'}</div>)}
          </div>
          {v.j.sample && (<div className="note" style={{ fontSize: 11 }}>Sample reports until farmers&apos; WhatsApp updates are connected (POST /api/progress/reports).</div>)}
        </aside>
      </>)}
    </div>
  )} />;
}
