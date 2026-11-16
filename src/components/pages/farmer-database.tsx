// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (FarmerProfile.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Farmer Database";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:18px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.stat{padding:10px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:12px;color:#A9C0B2}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:20px;font-weight:600;margin-top:2px}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;font-size:12px;font-weight:600;color:#E8F1EA;box-shadow:0 8px 24px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
@keyframes spin{to{transform:rotateZ(360deg)}}
.spin{animation:spin 18s linear infinite}
@media (prefers-reduced-motion:reduce){.spin{animation:none}}
`;

class Logic extends DCLogic {
  state = { sel: 0 };
  renderVals() {
    const { sel } = this.state;
    const cropC = { Tomato: '#E4584B', Mango: '#F5B83D', Chilli: '#C95FB0', Rice: '#E6C75A', Broiler: '#C9A0DC' };
    // name, state, km, acres, trust, success, contracts, since, title, crops[[name, lakh]], skin, shirt, cap
    const F = [
      ['Asha Devi', 'Andhra Pradesh', 25, 4.0, 92, 88, 7, 2019, 'Reliable grower, always on time', [['Tomato', 4.1], ['Mango', 2.7]], '#D9A47A', '#E4A04B', '#DCE96C'],
      ['Lakshmi Bai', 'Andhra Pradesh', 40, 3.2, 88, 84, 6, 2020, 'Quality-first vegetable grower', [['Tomato', 3.9], ['Chilli', 1.4]], '#C98F63', '#E4584B', '#E8F1EA'],
      ['Ravi Naidu', 'Andhra Pradesh', 55, 5.5, 74, 70, 5, 2021, 'Large plots, improving punctuality', [['Tomato', 2.6], ['Rice', 2.2]], '#8D5A3B', '#8E7CC3', '#F2A65A'],
      ['Suresh Babu', 'Andhra Pradesh', 35, 2.0, 85, 82, 4, 2021, 'Steady poultry supplier', [['Broiler', 3.2]], '#E8B98A', '#4FB3A9', '#DCE96C'],
      ['Mohan Gowda', 'Karnataka', 210, 6.0, 81, 79, 4, 2022, 'Orchard and vegetable mix', [['Tomato', 3.0], ['Mango', 3.4]], '#C98F63', '#4F9BD9', '#F2E36B'],
      ['Selvam Raj', 'Tamil Nadu', 150, 4.8, 77, 73, 5, 2020, 'Paddy specialist', [['Rice', 3.8], ['Tomato', 1.1]], '#8D5A3B', '#6FD08C', '#E8F1EA'],
      ['Meena Pillai', 'Tamil Nadu', 190, 3.0, 69, 65, 3, 2023, 'New to export-grade supply', [['Mango', 1.9], ['Broiler', 1.0]], '#D9A47A', '#C95FB0', '#DCE96C'],
      ['Venkat Rao', 'Telangana', 520, 8.5, 72, 68, 3, 2023, 'High volume, long distance', [['Rice', 4.4], ['Tomato', 0.9]], '#C98F63', '#E4A04B', '#6CC4F0']
    ];
    const f = F[sel];
    const total = f[9].reduce((s, c) => s + c[1], 0), max = Math.max(...f[9].map((c) => c[1]));
    const faces = [], tags = [];
    const shade = (hex, m) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * m)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const box = (o) => {
      const z = o.z || 0;
      faces.push({ css: `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.d}px;background:${o.top};transform:translateZ(${z + o.h}px);${o.topCss || ''}` });
      if (o.h > 0) {
        faces.push({ css: `left:${o.x}px;top:${o.y + o.d}px;width:${o.w}px;height:${o.h}px;background:${o.south || shade(o.top, .75)};transform-origin:0 0;transform:translateZ(${z}px) rotateX(90deg);` });
        faces.push({ css: `left:${o.x + o.w}px;top:${o.y}px;width:${o.h}px;height:${o.d}px;background:${o.east || shade(o.top, .55)};transform-origin:0 0;transform:translateZ(${z}px) rotateY(-90deg);` });
      }
    };
    // plinth discs
    faces.push({ css: 'left:20px;top:20px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,#2f6a50 0%,#1d4a39 60%,#143528 100%);box-shadow:0 0 0 3px #DCE96C66,0 0 60px #DCE96C44;transform:translateZ(4px);' });
    faces.push({ css: 'left:50px;top:50px;width:300px;height:300px;border-radius:50%;border:2px dashed #DCE96C55;box-sizing:border-box;transform:translateZ(5px);' });
    const k = 3.2, px = 200 - 8 * k, py = 190;
    box({ x: px + k, y: py + 2 * k, w: 6 * k, d: 6 * k, z: 5, h: 14 * k, top: '#26362e' });
    box({ x: px + 9 * k, y: py + 2 * k, w: 6 * k, d: 6 * k, z: 5, h: 14 * k, top: '#26362e' });
    box({ x: px, y: py, w: 16 * k, d: 10 * k, z: 5 + 14 * k, h: 18 * k, top: f[11] });
    box({ x: px + 2 * k, y: py - k, w: 12 * k, d: 12 * k, z: 5 + 32 * k, h: 12 * k, top: f[10] });
    box({ x: px + 1.5 * k, y: py - 1.5 * k, w: 13 * k, d: 13 * k, z: 5 + 42 * k, h: 4 * k, top: f[12] });
    box({ x: px + 14 * k, y: py + 1.5 * k, w: k, d: 2.4 * k, z: 5 + 36 * k, h: 2.4 * k, top: '#1a1a1a' });
    box({ x: px + 14 * k, y: py + 6.5 * k, w: k, d: 2.4 * k, z: 5 + 36 * k, h: 2.4 * k, top: '#1a1a1a' });
    box({ x: px + 16 * k, y: py + 3 * k, w: 8 * k, d: 5 * k, z: 5 + 24 * k, h: 5 * k, top: f[11] });
    // crate in hand of main crop
    const main = f[9].slice().sort((a, b) => b[1] - a[1])[0][0];
    box({ x: px + 24 * k, y: py + 1 * k, w: 9 * k, d: 9 * k, z: 5 + 22 * k, h: 7 * k, top: cropC[main] });
    // crop blocks around plinth
    f[9].forEach((c, i) => {
      const a = (i / f[9].length) * Math.PI * 2 + 0.8, cx = 200 + Math.cos(a) * 140 - 22, cy = 200 + Math.sin(a) * 140 - 22;
      const h = 14 + c[1] / max * 40;
      box({ x: cx, y: cy, w: 44, d: 44, z: 5, h, top: cropC[c[0]] });
    });
    // badges
    const badges = [];
    if (f[5] >= 80) badges.push('Reliable deliveries');
    if (total >= 5) badges.push('Top earner');
    if (f[6] >= 6) badges.push('Veteran member');
    if (f[4] >= 90) badges.push('Gold trust');
    badges.forEach((b, i) => tags.push({ x: 200 + (i - (badges.length - 1) / 2) * 120, y: 130, z: 240 + (i % 2) * 24, name: b, dot: '#DCE96C', border: '#DCE96C', bg: '#0f261ef2' }));
    const lakh = (v) => '₹' + v.toFixed(1) + ' L';
    const recent = f[9].concat(f[9]).slice(0, 3).map((c, i) => { const ok = (i * 17 + f[5]) % 100 < f[5]; return { crop: c[0], outcome: ok ? 'On time' : 'Late', dot: ok ? '#6FD08C' : '#F2A65A', rev: lakh(c[1] / (i < f[9].length ? 2 : 3)) }; });
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const on = n[0] === 'Farmer DB'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    return {
      faces, tags, nav, badges, noBadge: badges.length ? '' : 'No badges yet',
      name: f[0], title: f[8], state: f[1], km: f[2], acres: f[3], since: f[7], trust: f[4], succ: f[5], contracts: f[6], revenue: lakh(total),
      crops: f[9].map((c) => ({ name: c[0], rev: lakh(c[1]), w: Math.round(c[1] / max * 100), color: cropC[c[0]] })), recent,
      rows: F.map((r, i) => ({ name: r[0], state: r[1].split(' ').map((w) => w[0]).join('').slice(0, 2), km: r[2], acres: r[3], trust: r[4], skin: r[10], shirt: r[11], cap: r[12],
        on: i === sel, bg: i === sel ? '#1d3f31' : '#143026', border: i === sel ? '#DCE96C' : '#2c4a3d', chipBg: r[4] >= 85 ? '#DCE96C' : (r[4] >= 75 ? '#8fd0f5' : '#F2A65A'), pick: () => this.setState({ sel: i }) }))
    };
  }
}

export default function FarmerDatabasePage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(900px 620px at 50% 55%,#1f4a39 0%,#0f261e 58%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2400px","perspectiveOrigin":"50% 35%"}}><div style={{"position":"absolute","left":"720px","top":"520px","width":"400px","height":"400px","marginLeft":"-200px","marginTop":"-200px","transformStyle":"preserve-3d","transform":"scale(1.35) rotateX(58deg)"}}><div className="spin" style={{"position":"absolute","left":"0","top":"0","width":"400px","height":"400px","transformStyle":"preserve-3d"}}>{v.faces.map((f, $index) => (<Fragment key={$index}><div style={css(`position:absolute;${f.css}`)} /></Fragment>))}</div>{v.tags.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateX(-58deg);pointer-events:none`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg}`)}><span style={css(`width:8px;height:8px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav><div style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"10px","minHeight":"44px","padding":"0 12px 0 6px","borderRadius":"999px","border":"1px solid #2c4a3d","background":"#12281f99","fontSize":"13px"}}><span style={{"width":"32px","height":"32px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700","fontSize":"12px"}}>CF</span><span><b style={{"display":"block","fontWeight":"600"}}>Chittoor Farmers FPO</b><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>Farmer database</span></span></div></header><aside className="panel" style={{"left":"24px","top":"84px","width":"320px","height":"792px","display":"flex","flexDirection":"column","gap":"10px"}}><div><div className="kick">FARMER DATABASE</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>Everyone you work with</div></div><div style={{"display":"flex","flexDirection":"column","gap":"4px"}}>{v.rows.map((r, $index) => (<Fragment key={$index}><button onClick={r.pick} aria-pressed={r.on} style={css(`display:flex;align-items:center;gap:10px;min-height:56px;padding:0 10px;border-radius:14px;border:1px solid ${r.border};background:${r.bg};color:#E8F1EA;text-align:left`)}><span style={css(`position:relative;width:38px;height:38px;border-radius:50%;background:${r.skin};display:grid;place-items:end center;overflow:hidden`)}><span style={css(`width:26px;height:16px;border-radius:12px 12px 0 0;background:${r.shirt}`)} /><span style={css(`position:absolute;top:3px;width:22px;height:8px;border-radius:10px 10px 2px 2px;background:${r.cap}`)} /></span><span style={{"flex":"1","minWidth":"0"}}><span style={{"display":"block","fontSize":"14px","fontWeight":"600"}}>{r.name}</span><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>{r.state} · {r.km} km · {r.acres} ac</span></span><span style={css(`font-size:12px;font-weight:700;padding:3px 9px;border-radius:999px;background:${r.chipBg};color:#14231a`)}>{r.trust}</span></button></Fragment>))}</div><div className="note" style={{"marginTop":"auto"}}>Sample records. Trust score combines delivery record, quality and responsiveness.</div></aside><section className="panel" style={{"left":"372px","top":"84px","width":"680px","display":"flex","alignItems":"center","gap":"16px","padding":"14px 20px"}}><div style={{"flex":"1","minWidth":"0"}}><div className="hd" style={{"fontSize":"30px","lineHeight":"1.1"}}>{v.name}</div><div style={{"fontSize":"14px","color":"#B9CDC0","marginTop":"4px"}}>{v.title}</div></div><div style={{"display":"flex","gap":"8px","flexWrap":"wrap","justifyContent":"flex-end"}}><span style={{"padding":"6px 12px","borderRadius":"999px","background":"#143026","fontSize":"12px"}}>{v.state}</span><span style={{"padding":"6px 12px","borderRadius":"999px","background":"#143026","fontSize":"12px"}}>{v.km} km from FPO</span><span style={{"padding":"6px 12px","borderRadius":"999px","background":"#143026","fontSize":"12px"}}>{v.acres} acres</span><span style={{"padding":"6px 12px","borderRadius":"999px","background":"#143026","fontSize":"12px"}}>Member since {v.since}</span></div></section><section className="panel" style={{"left":"372px","top":"800px","width":"680px","height":"76px","display":"flex","alignItems":"center","gap":"10px","padding":"0 20px"}}><span className="kick">BADGES</span>{v.badges.map((b, $index) => (<Fragment key={$index}><span style={{"display":"flex","alignItems":"center","gap":"8px","padding":"8px 14px","borderRadius":"999px","background":"#3a3014","border":"1px solid #DCE96C66","fontSize":"13px","fontWeight":"600","color":"#F3E9A8"}}><span style={{"width":"10px","height":"10px","background":"#DCE96C","transform":"rotate(45deg)"}} />{b}</span></Fragment>))}<span style={{"fontSize":"12px","color":"#A9C0B2"}}>{v.noBadge}</span></section><aside className="panel" style={{"left":"1068px","top":"84px","width":"348px","height":"792px","display":"flex","flexDirection":"column","gap":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"16px"}}><div style={css(`position:relative;width:104px;height:104px;border-radius:50%;background:conic-gradient(#DCE96C ${v.trust}%,#1c3a2f 0);display:grid;place-items:center`)} role="img" aria-label={`Trust score ${v.trust} out of 100`}><div style={{"width":"80px","height":"80px","borderRadius":"50%","background":"#0f261e","display":"grid","placeItems":"center"}}><div style={{"textAlign":"center"}}><b className="hd" style={{"display":"block","fontSize":"30px","lineHeight":"1"}}>{v.trust}</b><span style={{"fontSize":"12px","color":"#A9C0B2"}}>trust</span></div></div></div><div style={{"flex":"1"}}><div className="kick">SUCCESSFUL DELIVERIES</div><div className="hd" style={{"fontSize":"30px","lineHeight":"1.1","marginTop":"4px"}}>{v.succ}%</div><div style={{"height":"8px","borderRadius":"999px","background":"#1c3a2f","marginTop":"8px","overflow":"hidden"}}><div style={css(`height:100%;width:${v.succ}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div></div></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Contracts joined</span><b>{v.contracts}</b></div><div className="stat"><span>Total revenue</span><b>{v.revenue}</b></div></div><div className="hd" style={{"fontSize":"16px","marginTop":"4px"}}>Revenue by crop</div><div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>{v.crops.map((c, $index) => (<Fragment key={$index}><div><div style={{"display":"flex","justifyContent":"space-between","fontSize":"13px"}}><span style={{"display":"flex","alignItems":"center","gap":"8px"}}><span style={css(`width:10px;height:10px;border-radius:3px;background:${c.color}`)} />{c.name}</span><span style={{"color":"#A9C0B2"}}>{c.rev}</span></div><div style={{"height":"8px","borderRadius":"999px","background":"#1c3a2f","marginTop":"5px","overflow":"hidden"}}><div style={css(`height:100%;width:${c.w}%;background:${c.color}`)} /></div></div></Fragment>))}</div><div className="hd" style={{"fontSize":"16px","marginTop":"4px"}}>Recent deliveries</div><ul style={{"listStyle":"none","margin":"0","padding":"0","display":"flex","flexDirection":"column","gap":"6px"}}>{v.recent.map((d, $index) => (<Fragment key={$index}><li style={{"display":"flex","alignItems":"center","gap":"10px","padding":"10px 12px","borderRadius":"12px","background":"#143026","fontSize":"13px"}}><span style={css(`width:9px;height:9px;border-radius:50%;background:${d.dot}`)} /><span style={{"flex":"1"}}>{d.crop}</span><span style={{"color":"#A9C0B2"}}>{d.outcome}</span><b style={{"fontWeight":"600"}}>{d.rev}</b></li></Fragment>))}</ul></aside></div>)} />;
}
