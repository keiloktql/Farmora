// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Buyers.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Buyers and Exporters";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:20px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.stat{padding:10px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:12px;color:#A9C0B2}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:20px;font-weight:600;margin-top:2px}
.btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;font-size:13px;font-weight:600}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:600;color:#E8F1EA;box-shadow:0 8px 24px #00000066;font-family:var(--font-inter),sans-serif}
.mv{transition:left 1s ease,top 1s ease,width 1s ease,height 1s ease,transform 1s ease}
@keyframes conf{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(540deg);opacity:0}}
@keyframes ring{0%{transform:scale(.3);opacity:.9}100%{transform:scale(2.2);opacity:0}}
.conf{animation:conf 1.6s ease-out infinite}
.ring{animation:ring 1.3s ease-out infinite}
`;

class Logic extends DCLogic {
  state = { sel: 0, tick: 0, stages: ['talk', 'talk', 'talk'], prices: [24, 95, 60],
    log: ['Chittoor FPO and LionCity Fresh Imports are in talks', 'Kurnool Growers FPO joined the room', 'Coastal Retail Co. joined the room'] };
  timers = [];
  componentDidMount() { this.iv = setInterval(() => this.setState({ tick: this.state.tick + 1 }), 2200); }
  componentWillUnmount() { clearInterval(this.iv); this.timers.forEach(clearTimeout); }
  setStage(i, s) { const st = this.state.stages.slice(); st[i] = s; this.setState({ stages: st }); }
  addLog(t) { this.setState({ log: [t, ...this.state.log].slice(0, 4) }); }
  renderVals() {
    const { sel, tick, stages, prices, log } = this.state;
    const deals = [
      { fpo: 'Chittoor FPO', buyer: 'LionCity Fresh Imports', crop: 'Tomato', vol: 18, a: 'Same-day pickup, 18 t?', b: 'Grade A and residue report?' },
      { fpo: 'Kurnool Growers FPO', buyer: 'Spice Route Exporters', crop: 'Chilli', vol: 12, a: '12 t ready in April', b: 'Can we meet at a lower price?' },
      { fpo: 'Anantapur Farmers FPO', buyer: 'Coastal Retail Co.', crop: 'Groundnut', vol: 20, a: '20 t ready to ship', b: 'Need clean, dry pods' }
    ];
    const shirts = [['#3f9a5c', '#4F9BD9'], ['#3f9a5c', '#E4A04B'], ['#3f9a5c', '#8E7CC3']];
    const skins = [['#E8B98A', '#C98F63'], ['#C98F63', '#E8B98A'], ['#8D5A3B', '#D9A47A']];
    const faces = [], labels = [], fx = [];
    const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f)))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    const box = (o) => {
      const z = o.z || 0, c = o.cls || '';
      faces.push({ cls: c, css: `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.d}px;background:${o.top};transform:translateZ(${z + o.h}px);${o.topCss || ''}` });
      if (o.h > 0) {
        faces.push({ cls: c, css: `left:${o.x}px;top:${o.y + o.d}px;width:${o.w}px;height:${o.h}px;background:${o.south || shade(o.top, .75)};transform-origin:0 0;transform:translateZ(${z}px) rotateX(90deg);` });
        faces.push({ cls: c, css: `left:${o.x + o.w}px;top:${o.y}px;width:${o.h}px;height:${o.d}px;background:${o.east || shade(o.top, .55)};transform-origin:0 0;transform:translateZ(${z}px) rotateY(-90deg);` });
      }
    };
    const K = 2.4;
    const person = (o) => {
      const k = K, f = o.face, c = 'mv';
      box({ x: o.x + 1 * k, y: o.y + 2 * k, w: 6 * k, d: 6 * k, h: 14 * k, top: o.pants, cls: c });
      box({ x: o.x + 9 * k, y: o.y + 2 * k, w: 6 * k, d: 6 * k, h: 14 * k, top: o.pants, cls: c });
      box({ x: o.x, y: o.y, w: 16 * k, d: 10 * k, z: 14 * k, h: 18 * k, top: o.shirt, cls: c });
      box({ x: o.x + 2 * k, y: o.y - 1 * k, w: 12 * k, d: 12 * k, z: 32 * k, h: 12 * k, top: o.skin, cls: c });
      box({ x: o.x + 1.5 * k, y: o.y - 1.5 * k, w: 13 * k, d: 13 * k, z: 42 * k, h: 4 * k, top: o.cap, cls: c });
      const ex = f > 0 ? o.x + 14 * k : o.x + 1 * k;
      box({ x: ex, y: o.y + 1.5 * k, w: 1 * k, d: 2.4 * k, z: 36 * k, h: 2.4 * k, top: '#1a1a1a', cls: c });
      box({ x: ex, y: o.y + 6.5 * k, w: 1 * k, d: 2.4 * k, z: 36 * k, h: 2.4 * k, top: '#1a1a1a', cls: c });
      const ax = f > 0 ? o.x + 16 * k : o.x - o.arm;
      box({ x: ax, y: o.y + 3 * k, w: o.arm, d: 5 * k, z: 24 * k, h: 5 * k, top: o.shirt, cls: c });
    };
    box({ x: 0, y: 0, w: 760, d: 440, z: -18, h: 18, top: '#10261e', south: '#07130f', east: '#0a1a14',
      topCss: 'background-image:linear-gradient(#DCE96C10 1px,transparent 1px),linear-gradient(90deg,#DCE96C10 1px,transparent 1px);background-size:40px 40px;' });
    deals.forEach((d, i) => {
      const st = stages[i], y = 60 + i * 140;
      const near = st !== 'talk';
      const arm = (st === 'shake' || st === 'done') ? 86 : 10;
      const isSel = sel === i;
      box({ x: 40, y: y - 34, w: 680, d: 96, z: 0, h: 2, top: isSel ? '#DCE96C1c' : '#ffffff0a', south: '#0000', east: '#0000', topCss: `box-shadow:0 0 0 1px ${isSel ? '#DCE96C' : '#2c4a3d'};` });
      const fx0 = near ? 300 : 110, bx0 = near ? 500 : 640;
      person({ x: fx0, y, face: 1, shirt: shirts[i][0], pants: '#26362e', skin: skins[i][0], cap: '#DCE96C', arm });
      person({ x: bx0, y, face: -1, shirt: shirts[i][1], pants: '#26362e', skin: skins[i][1], cap: '#E8F1EA', arm });
      if (st === 'shake' || st === 'done') box({ x: 414, y: y + 3 * K - 1, w: 12, d: 14, z: 24 * K - 2, h: 14, top: skins[i][0], cls: 'mv' });
      const sp = tick % 2 === 0;
      const pick = () => this.setState({ sel: i });
      const headZ = 46 * K + 16;
      labels.push({ x: fx0 + 8 * K, y: y + 5, z: headZ + 10, name: d.fpo, sub: 'FPO', dot: '#6FD08C', border: isSel ? '#DCE96C' : '#2c4a3d', bg: '#0f261ef0', fg: '#E8F1EA', aria: d.fpo, pick });
      labels.push({ x: bx0 + 8 * K, y: y + 5, z: headZ + 10, name: d.buyer, sub: 'Buyer', dot: '#6CC4F0', border: isSel ? '#DCE96C' : '#2c4a3d', bg: '#0f261ef0', fg: '#E8F1EA', aria: d.buyer, pick });
      if (st === 'talk') {
        labels.push({ x: sp ? fx0 + 8 * K : bx0 + 8 * K, y: y + 5, z: headZ + 52, name: sp ? d.a : d.b, sub: sp ? '₹' + prices[i] + '/kg' : '', dot: sp ? '#DCE96C' : '#6CC4F0', border: '#E8F1EA', bg: '#E8F1EA', fg: '#14231a', aria: 'Speech', pick });
      }
      if (st === 'meet') labels.push({ x: 400, y: y + 5, z: headZ + 52, name: 'Meeting at the table…', sub: '', dot: '#DCE96C', border: '#DCE96C', bg: '#0f261ef0', fg: '#E8F1EA', aria: 'Meeting', pick });
      if (st === 'shake' || st === 'done') {
        labels.push({ x: 420, y: y + 5, z: headZ + 52, name: 'Deal finalised', sub: '₹' + prices[i] + '/kg · ' + d.vol + ' t', dot: '#14382b', border: '#DCE96C', bg: '#DCE96C', fg: '#14382b', aria: 'Deal finalised', pick });
      }
      if (st === 'shake') {
        fx.push({ x: 420, y: y + 12, z: 24 * K + 4, cls: 'ring', ox: -30, oy: -30, s: 60, r: '50%', bg: 'transparent', border: '3px solid #DCE96C', dx: 0, dy: 0, delay: 0 });
        const cc = ['#DCE96C', '#6CC4F0', '#F2A65A', '#6FD08C', '#E8F1EA'];
        for (let n = 0; n < 14; n++) {
          const a = n / 14 * Math.PI * 2;
          fx.push({ x: 420, y: y + 12, z: 24 * K + 10, cls: 'conf', ox: 0, oy: 0, s: 8, r: '2px', bg: cc[n % 5], border: '0', dx: Math.round(Math.cos(a) * 90), dy: Math.round(Math.sin(a) * 90 - 40), delay: (n % 4) * 0.15 });
        }
      }
    });
    const D = deals[sel], st = stages[sel];
    const chip = { talk: ['Negotiating', '#4a4a1e', '#F3F0A8'], meet: ['Meeting', '#2b4a6a', '#BFE0FA'], shake: ['Shaking hands', '#1f5a3b', '#B8F0C8'], done: ['Finalised', '#1f5a3b', '#B8F0C8'] }[st];
    const people = [];
    deals.forEach((d, i) => {
      const s = stages[i] === 'done' || stages[i] === 'shake' ? 'Deal finalised' : (stages[i] === 'meet' ? 'Meeting' : 'In talks');
      const bgc = sel === i ? '#1d3f31' : 'transparent';
      people.push({ name: d.fpo, role: 'FPO', status: s, color: shirts[i][0], ini: d.fpo.split(' ').map((w) => w[0]).slice(0, 2).join(''), dot: stages[i] === 'done' ? '#DCE96C' : '#6FD08C', bg: bgc, pick: () => this.setState({ sel: i }) });
      people.push({ name: d.buyer, role: 'Buyer', status: s, color: shirts[i][1], ini: d.buyer.split(' ').map((w) => w[0]).slice(0, 2).join(''), dot: stages[i] === 'done' ? '#DCE96C' : '#6FD08C', bg: bgc, pick: () => this.setState({ sel: i }) });
    });
    const busy = st !== 'talk';
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const a = n[0] === 'Buyers'; return { name: n[0], href: n[1], bg: a ? '#DCE96C' : 'transparent', fg: a ? '#14382b' : '#B9CDC0', fw: a ? 600 : 500 }; });
    return {
      faces, labels, fx, nav, people, log,
      dealNo: sel + 1, fpo: D.fpo, buyer: D.buyer, crop: D.crop, vol: D.vol + ' t', price: prices[sel],
      value: '₹' + (D.vol * 1000 * prices[sel]).toLocaleString('en-IN'),
      chipText: chip[0], chipBg: chip[1], chipFg: chip[2], actOp: busy ? 0.4 : 1,
      counter: () => { if (busy) return; const p = prices.slice(); p[sel] += 1; this.setState({ prices: p }); this.addLog(D.buyer + ' countered at ₹' + p[sel] + '/kg'); },
      finalise: () => {
        if (busy) return;
        this.setStage(sel, 'meet'); this.addLog(D.fpo + ' and ' + D.buyer + ' agreed. Meeting to sign');
        this.timers.push(setTimeout(() => this.setStage(sel, 'shake'), 1100));
        this.timers.push(setTimeout(() => { this.setStage(sel, 'done'); this.addLog('Handshake: ' + D.fpo + ' × ' + D.buyer + ' finalised at ₹' + this.state.prices[sel] + '/kg'); }, 3400));
      },
      reset: () => { this.timers.forEach(clearTimeout); this.setStage(sel, 'talk'); this.addLog(D.fpo + ' and ' + D.buyer + ' reopened talks'); }
    };
  }
}

export default function BuyersPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1100px 640px at 50% 56%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"900px","perspective":"2600px","perspectiveOrigin":"50% 40%"}}><div style={{"position":"absolute","left":"720px","top":"510px","width":"760px","height":"440px","marginLeft":"-380px","marginTop":"-220px","transformStyle":"preserve-3d","transform":"scale(.9) rotateX(58deg) rotateZ(38deg)"}}>{v.faces.map((f, $index) => (<Fragment key={$index}><div className={f.cls} style={css(`position:absolute;${f.css}`)} /></Fragment>))}{v.fx.map((c, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${c.x}px;top:${c.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${c.z}px) rotateZ(-38deg) rotateX(-58deg)`)}><div className={c.cls} style={css(`position:absolute;left:${c.ox}px;top:${c.oy}px;width:${c.s}px;height:${c.s}px;border-radius:${c.r};background:${c.bg};border:${c.border};--dx:${c.dx}px;--dy:${c.dy}px;animation-delay:${c.delay}s`)} /></div></Fragment>))}{v.labels.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateZ(-38deg) rotateX(-58deg)`)}><button onClick={l.pick} aria-label={l.aria} className="tag" style={css(`border:1px solid ${l.border};background:${l.bg};color:${l.fg}`)}><span style={css(`width:9px;height:9px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span><span style={{"opacity":".75","fontWeight":"500"}}>{l.sub}</span></button></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav><div style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"8px","fontSize":"13px","color":"#B9CDC0"}}><span style={{"width":"8px","height":"8px","borderRadius":"50%","background":"#6FD08C","boxShadow":"0 0 0 3px #6FD08C33"}} />Live room · 6 online</div></header><aside className="panel" style={{"left":"24px","top":"88px","width":"304px","display":"flex","flexDirection":"column","gap":"12px"}}><div><div className="kick">TRADE DESK · LIVE</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>Who is in the room</div></div><div style={{"display":"flex","flexDirection":"column","gap":"4px"}}>{v.people.map((p, $index) => (<Fragment key={$index}><button onClick={p.pick} style={css(`display:flex;align-items:center;gap:10px;min-height:48px;padding:0 10px;border-radius:12px;border:0;background:${p.bg};color:#E8F1EA;text-align:left`)}><span style={css(`position:relative;width:32px;height:32px;border-radius:50%;background:${p.color};display:grid;place-items:center;font-size:12px;font-weight:700;color:#10201a`)}>{p.ini}<span style={css(`position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:${p.dot};border:2px solid #0f261e`)} /></span><span style={{"flex":"1","minWidth":"0"}}><span style={{"display":"block","fontSize":"13px","fontWeight":"600"}}>{p.name}</span><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>{p.role} · {p.status}</span></span></button></Fragment>))}</div><div style={{"borderTop":"1px solid #2c4a3d","paddingTop":"10px"}}><div className="kick">ACTIVITY</div><ul style={{"listStyle":"none","margin":"8px 0 0","padding":"0","display":"flex","flexDirection":"column","gap":"6px"}}>{v.log.map((e, $index) => (<Fragment key={$index}><li style={{"fontSize":"12px","lineHeight":"1.4","color":"#C9D9CF"}}>{e}</li></Fragment>))}</ul></div></aside><aside className="panel" style={{"left":"1112px","top":"88px","width":"304px","display":"flex","flexDirection":"column","gap":"12px"}}><div className="kick">DEAL {v.dealNo} OF 3</div><div className="hd" style={{"fontSize":"22px","lineHeight":"1.2"}}>{v.fpo} × {v.buyer}</div><span style={css(`align-self:flex-start;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600;background:${v.chipBg};color:${v.chipFg}`)}>{v.chipText}</span><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div className="stat"><span>Crop</span><b>{v.crop}</b></div><div className="stat"><span>Volume</span><b>{v.vol}</b></div><div className="stat"><span>Price</span><b>₹{v.price}/kg</b></div><div className="stat"><span>Value</span><b>{v.value}</b></div></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><button className="btn" onClick={v.counter} style={css(`background:#143026;color:#E8F1EA;opacity:${v.actOp}`)}>Counter +₹1</button><button className="btn" onClick={v.finalise} style={css(`background:#DCE96C;color:#14382b;opacity:${v.actOp}`)}>Finalise deal</button></div><button className="btn" onClick={v.reset} style={{"background":"transparent","color":"#B9CDC0"}}>Reset this deal</button><div className="note">Sample parties and prices for illustration, except the LionCity pilot contract. Finalising here only animates the scene; it does not create a real contract.</div></aside></div>)} />;
}
