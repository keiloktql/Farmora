// @ts-nocheck
/* eslint-disable */
// Generated from the approved "HarvestLink 3D Simulation UI" design (Contracts.dc.html).
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';

export const pageTitle = "Contracts";

const CSS = `
body{margin:0;background:#0b1b16}
button{font-family:inherit;cursor:pointer}
a{text-decoration:none}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;padding:18px;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:12px;letter-spacing:1.2px;font-weight:600;color:#DCE96C}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.stat{padding:10px;border-radius:12px;background:#143026}
.stat span{display:block;font-size:12px;color:#A9C0B2}
.stat b{display:block;font-family:var(--font-space),sans-serif;font-size:20px;font-weight:600;margin-top:2px}
.btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #3d6b55;font-size:13px;font-weight:600}
.note{font-size:12px;line-height:1.5;color:#A9C0B2}
.fld{display:block;width:100%;box-sizing:border-box;min-height:44px;padding:0 12px;margin-top:6px;border-radius:12px;border:1px solid #3d6b55;background:#143026;color:#E8F1EA;font:inherit;font-size:14px;color-scheme:dark}
.lbl{font-size:13px;font-weight:600;display:block}
.tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;display:flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:600;color:#E8F1EA;box-shadow:0 8px 24px #00000066;font-family:var(--font-inter),sans-serif;pointer-events:none}
.mv{transition:left 1s ease,top 1s ease,width 1s ease,height 1s ease,transform 1s ease}
@keyframes ring{0%{transform:scale(.3);opacity:.9}100%{transform:scale(2.2);opacity:0}}
@keyframes conf{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(540deg);opacity:0}}
.ring{animation:ring 1.3s ease-out infinite}
.conf{animation:conf 1.6s ease-out infinite}
`;

class Logic extends DCLogic {
  state = { cat: 'Vegetables', form: { ex: '', crop: 'Tomato', country: 'Singapore', qty: 10, dl: '2027-03-15' }, created: [], msg: '',
    sel: 0, stage: 'idle', log: ['LionCity Fresh Imports is online', 'Tirupati Fresh Co. joined the room'] };
  timers = [];
  componentWillUnmount() { this.timers.forEach(clearTimeout); }
  renderVals() {
    const { cat, form, created, msg, sel, stage, log } = this.state;
    const DATA = {
      Vegetables: { crops: ['Tomato', 'Chilli', 'Onion', 'Brinjal'], ongoing: [
        { ex: 'LionCity Fresh Imports', crop: 'Tomato 18 t', country: 'Singapore', value: '₹4.3 L', due: '20 Mar 2027', prog: 62, stage: 'Plots growing' },
        { ex: 'Spice Route Exporters', crop: 'Chilli 12 t', country: 'Sri Lanka', value: '₹11.4 L', due: '5 Apr 2027', prog: 35, stage: 'Farmers being matched' }],
        sugg: [['Tirupati Fresh Co.', 'Tirupati', 70, 92, '#E4A04B'], ['Coromandel Agro Exports', 'Chennai', 150, 88, '#4F9BD9'], ['Southern Fresh Traders', 'Bengaluru', 240, 81, '#8E7CC3']] },
      Grains: { crops: ['Rice', 'Ragi', 'Maize', 'Sorghum'], ongoing: [
        { ex: 'Coastal Grain Traders', crop: 'Rice 40 t', country: 'Maldives', value: '₹14.0 L', due: '15 Jan 2027', prog: 70, stage: 'Harvest in progress' }],
        sugg: [['Nellore Grain Hub', 'Nellore', 170, 90, '#E4A04B'], ['Chennai Cereal Exports', 'Chennai', 150, 85, '#4F9BD9'], ['Hosur Mills', 'Hosur', 190, 78, '#8E7CC3']] },
      Fruits: { crops: ['Mango', 'Banana', 'Papaya', 'Guava'], ongoing: [
        { ex: 'Gulf Fruit Link', crop: 'Mango 30 t', country: 'UAE', value: '₹21.0 L', due: '20 Apr 2027', prog: 25, stage: 'Orchards flowering' }],
        sugg: [['Chittoor Mango Exports', 'Chittoor', 30, 94, '#E4A04B'], ['Tirupati Fruit Co.', 'Tirupati', 70, 87, '#4F9BD9'], ['Bengaluru Orchard Exports', 'Bengaluru', 240, 80, '#8E7CC3']] },
      'Poultry / Meat': { crops: ['Broiler chicken', 'Eggs', 'Mutton', 'Goat meat'], ongoing: [
        { ex: 'Island Foods', crop: 'Broiler 8 t', country: 'Maldives', value: '₹9.6 L', due: '12 Mar 2027', prog: 45, stage: 'Flocks on feed' }],
        sugg: [['Coastal Poultry Co.', 'Nellore', 170, 89, '#E4A04B'], ['Chennai Halal Exports', 'Chennai', 150, 84, '#4F9BD9'], ['Hosur Meat Traders', 'Hosur', 190, 76, '#8E7CC3']] }
    };
    const D = DATA[cat];
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
    const k = 2;
    const person = (o) => {
      const c = 'mv', f = o.face;
      box({ x: o.x + k, y: o.y + 2 * k, w: 6 * k, d: 6 * k, h: 14 * k, top: '#26362e', cls: c });
      box({ x: o.x + 9 * k, y: o.y + 2 * k, w: 6 * k, d: 6 * k, h: 14 * k, top: '#26362e', cls: c });
      box({ x: o.x, y: o.y, w: 16 * k, d: 10 * k, z: 14 * k, h: 18 * k, top: o.shirt, cls: c });
      box({ x: o.x + 2 * k, y: o.y - k, w: 12 * k, d: 12 * k, z: 32 * k, h: 12 * k, top: o.skin, cls: c });
      box({ x: o.x + 1.5 * k, y: o.y - 1.5 * k, w: 13 * k, d: 13 * k, z: 42 * k, h: 4 * k, top: o.cap, cls: c });
      const ex = f > 0 ? o.x + 14 * k : o.x + k;
      box({ x: ex, y: o.y + 1.5 * k, w: k, d: 2.4 * k, z: 36 * k, h: 2.4 * k, top: '#1a1a1a', cls: c });
      box({ x: ex, y: o.y + 6.5 * k, w: k, d: 2.4 * k, z: 36 * k, h: 2.4 * k, top: '#1a1a1a', cls: c });
      box({ x: f > 0 ? o.x + 16 * k : o.x - o.arm, y: o.y + 3 * k, w: o.arm, d: 5 * k, z: 24 * k, h: 5 * k, top: o.shirt, cls: c });
    };
    box({ x: 0, y: 0, w: 560, d: 320, z: -18, h: 18, top: '#10261e', south: '#07130f', east: '#0a1a14',
      topCss: 'background-image:linear-gradient(#DCE96C10 1px,transparent 1px),linear-gradient(90deg,#DCE96C10 1px,transparent 1px);background-size:40px 40px;' });
    const near = stage !== 'idle', shake = stage === 'shake' || stage === 'done';
    const arm = shake ? 62 : 10, hy = 130;
    const fpoX = near ? 170 : 50;
    person({ x: fpoX, y: hy, face: 1, shirt: '#3f9a5c', skin: '#D9A47A', cap: '#DCE96C', arm });
    labels.push({ x: fpoX + 16, y: hy + 10, z: 140, name: 'Chittoor FPO', sub: 'you', dot: '#DCE96C', border: '#DCE96C', bg: '#0f261ef0', fg: '#E8F1EA' });
    const rowsY = [30, 130, 230];
    D.sugg.forEach((s, i) => {
      const isSel = sel === i && near;
      const ey = isSel ? hy : rowsY[i], ex = isSel ? 314 : 440;
      person({ x: ex, y: ey, face: -1, shirt: s[4], skin: ['#E8B98A', '#C98F63', '#8D5A3B'][i], cap: '#E8F1EA', arm: isSel ? arm : 10 });
      labels.push({ x: ex + 16, y: ey + 10, z: 140, name: s[0].split(' ').slice(0, 2).join(' '), sub: s[2] + ' km', dot: '#6CC4F0', border: '#2c4a3d', bg: '#0f261ef0', fg: '#E8F1EA' });
    });
    if (shake) {
      faces.push({ cls: 'mv', css: `left:${fpoX + 32 + 54}px;top:${hy + 5}px;width:14px;height:14px;background:#D9A47A;transform:translateZ(${24 * k + 16}px);` });
      labels.push({ x: 262 + 16, y: hy + 10, z: 190, name: stage === 'done' ? 'Deal finalised' : 'Shaking hands', sub: D.sugg[sel][0].split(' ')[0], dot: '#14382b', border: '#DCE96C', bg: '#DCE96C', fg: '#14382b' });
    }
    if (stage === 'shake') {
      fx.push({ x: 276, y: hy + 12, z: 24 * k + 8, cls: 'ring', ox: -30, oy: -30, s: 60, r: '50%', bg: 'transparent', border: '3px solid #DCE96C', dx: 0, dy: 0, delay: 0 });
      const cc = ['#DCE96C', '#6CC4F0', '#F2A65A', '#6FD08C', '#E8F1EA'];
      for (let n = 0; n < 12; n++) { const a = n / 12 * Math.PI * 2; fx.push({ x: 276, y: hy + 12, z: 24 * k + 14, cls: 'conf', ox: 0, oy: 0, s: 8, r: '2px', bg: cc[n % 5], border: '0', dx: Math.round(Math.cos(a) * 80), dy: Math.round(Math.sin(a) * 80 - 30), delay: (n % 4) * 0.15 }); }
    }
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['New project', '/new-project'], ['Farmer DB', '/farmers'], ['Allocation', '/allocation'], ['Buyers', '/buyers'], ['Results', '/results'], ['Shipments', '/shipments']]
      .map((n) => { const on = n[0] === 'Contracts'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const setCat = (c) => () => { this.timers.forEach(clearTimeout); this.setState({ cat: c, stage: 'idle', form: { ...form, crop: DATA[c].crops[0] } }); };
    const setF = (key, conv) => (e) => this.setState({ form: { ...form, [key]: conv ? conv(e.target.value) : e.target.value } });
    const invite = (i) => () => {
      if (stage === 'meet' || stage === 'shake') return;
      this.timers.forEach(clearTimeout);
      const nm = D.sugg[i][0];
      this.setState({ sel: i, stage: 'meet', log: ['You invited ' + nm, ...log].slice(0, 4) });
      this.timers.push(setTimeout(() => this.setState({ stage: 'shake' }), 1100));
      this.timers.push(setTimeout(() => this.setState({ stage: 'done', log: ['Handshake with ' + nm + ' (sample deal)', ...this.state.log].slice(0, 4) }), 3400));
    };
    const fmtDue = (d) => { const p = d.split('-'); const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1]; return Number(p[2]) + ' ' + m + ' ' + p[0]; };
    const mine = created.filter((c) => c.cat === cat).map((c) => ({ ex: c.ex || 'New exporter', crop: c.crop + ' ' + c.qty + ' t', country: c.country, value: 'Value TBD', due: fmtDue(c.dl), prog: 5, stage: 'Draft · finding farmers' }));
    const ongoing = [...mine, ...D.ongoing].slice(0, 3);
    return {
      faces, labels, fx, nav, log, msg, form, catName: cat, count: mine.length + D.ongoing.length, ongoing,
      cats: Object.keys(DATA).map((c) => ({ name: c, on: c === cat, bg: c === cat ? '#DCE96C' : 'transparent', fg: c === cat ? '#14382b' : '#B9CDC0', pick: setCat(c) })),
      cropOpts: D.crops, countries: ['Singapore', 'UAE', 'Maldives', 'Sri Lanka', 'Malaysia'],
      onEx: setF('ex'), onCrop: setF('crop'), onCountry: setF('country'), onQty: setF('qty', Number), onDl: setF('dl'),
      create: () => {
        if (!form.ex.trim()) { this.setState({ msg: 'Add the exporter’s name first.' }); return; }
        this.setState({ created: [{ ...form, cat }, ...created], msg: 'Project created. Looking for matching farmers…', form: { ...form, ex: '' } });
      },
      sugg: D.sugg.map((s, i) => ({ name: s[0], where: s[1], km: s[2], match: s[3], color: s[4], ini: s[0].split(' ').map((w) => w[0]).slice(0, 2).join(''),
        status: sel === i && near ? 'In talks' : 'Online', dot: '#6FD08C', bg: sel === i && near ? '#1d3f31' : '#143026', border: sel === i && near ? '#DCE96C' : '#2c4a3d',
        btn: sel === i && stage === 'done' ? 'Deal finalised · invite again' : (sel === i && near ? 'Meeting…' : 'Invite to deal'), invite: invite(i) }))
    };
  }
}

export default function ContractsPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (<div style={{"position":"relative","width":"1440px","height":"900px","overflow":"hidden","background":"radial-gradient(1000px 620px at 50% 45%,#1a3d30 0%,#0f261e 55%,#0a1814 100%)","fontFamily":"var(--font-inter),system-ui,sans-serif","color":"#E8F1EA"}}><div style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"640px","perspective":"2600px","perspectiveOrigin":"50% 40%"}}><div style={{"position":"absolute","left":"720px","top":"400px","width":"560px","height":"320px","marginLeft":"-280px","marginTop":"-160px","transformStyle":"preserve-3d","transform":"scale(.86) rotateX(58deg) rotateZ(38deg)"}}>{v.faces.map((f, $index) => (<Fragment key={$index}><div className={f.cls} style={css(`position:absolute;${f.css}`)} /></Fragment>))}{v.fx.map((c, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${c.x}px;top:${c.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${c.z}px) rotateZ(-38deg) rotateX(-58deg);pointer-events:none`)}><div className={c.cls} style={css(`position:absolute;left:${c.ox}px;top:${c.oy}px;width:${c.s}px;height:${c.s}px;border-radius:${c.r};background:${c.bg};border:${c.border};--dx:${c.dx}px;--dy:${c.dy}px;animation-delay:${c.delay}s`)} /></div></Fragment>))}{v.labels.map((l, $index) => (<Fragment key={$index}><div style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:0;height:0;transform-style:preserve-3d;transform:translateZ(${l.z}px) rotateZ(-38deg) rotateX(-58deg)`)}><div className="tag" style={css(`border:1px solid ${l.border};background:${l.bg};color:${l.fg}`)}><span style={css(`width:9px;height:9px;border-radius:50%;background:${l.dot}`)} /><span>{l.name}</span><span style={{"opacity":".75","fontWeight":"500"}}>{l.sub}</span></div></div></Fragment>))}</div></div><header style={{"position":"absolute","left":"0","top":"0","width":"1440px","height":"64px","boxSizing":"border-box","padding":"0 24px","display":"flex","alignItems":"center","gap":"16px","background":"linear-gradient(#0a1814ee,#0a181400)","zIndex":"5"}}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><div style={{"width":"34px","height":"34px","borderRadius":"11px","background":"#DCE96C","display":"grid","placeItems":"center","transform":"rotate(-6deg)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{"fontWeight":"700","fontSize":"18px"}}>HarvestLink</span></div><nav aria-label="Workspaces" style={{"display":"flex","gap":"2px","marginLeft":"12px","padding":"4px","borderRadius":"999px","background":"#12281f99","border":"1px solid #2c4a3d"}}>{v.nav.map((n, $index) => (<Fragment key={$index}><Link href={n.href} style={css(`padding:8px 12px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}</Link></Fragment>))}</nav><div style={{"marginLeft":"auto","display":"flex","alignItems":"center","gap":"10px","minHeight":"44px","padding":"0 12px 0 6px","borderRadius":"999px","border":"1px solid #2c4a3d","background":"#12281f99","fontSize":"13px"}}><span style={{"width":"32px","height":"32px","borderRadius":"50%","background":"#E8BC7C","color":"#4a3420","display":"grid","placeItems":"center","fontWeight":"700","fontSize":"12px"}}>CF</span><span><b style={{"display":"block","fontWeight":"600"}}>Chittoor Farmers FPO</b><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>Contractor profile</span></span></div></header><div style={{"position":"absolute","left":"24px","right":"24px","top":"72px","height":"48px","display":"flex","alignItems":"center","gap":"16px","zIndex":"4"}}><div role="tablist" aria-label="Category" style={{"display":"flex","gap":"4px","padding":"4px","borderRadius":"999px","background":"#12281fcc","border":"1px solid #2c4a3d"}}>{v.cats.map((c, $index) => (<Fragment key={$index}><button role="tab" aria-selected={c.on} onClick={c.pick} style={css(`min-height:40px;padding:0 18px;border-radius:999px;border:0;font-size:14px;font-weight:600;background:${c.bg};color:${c.fg}`)}>{c.name}</button></Fragment>))}</div><div style={{"marginLeft":"auto","display":"flex","gap":"4px","padding":"4px","borderRadius":"999px","background":"#12281fcc","border":"1px solid #2c4a3d"}}><Link href="/contracts" aria-current="page" style={{"display":"grid","placeItems":"center","minHeight":"40px","padding":"0 18px","borderRadius":"999px","background":"#DCE96C","color":"#14382b","fontSize":"14px","fontWeight":"600"}}>Contractor</Link><Link href="/contracts/farmers" style={{"display":"grid","placeItems":"center","minHeight":"40px","padding":"0 18px","borderRadius":"999px","color":"#B9CDC0","fontSize":"14px","fontWeight":"600"}}>Farmers</Link></div></div><aside className="panel" style={{"left":"24px","top":"132px","width":"340px","height":"744px","display":"flex","flexDirection":"column","gap":"10px"}}><div><div className="kick">NEW PROJECT</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>Start a deal with an exporter</div></div><div><label className="lbl" htmlFor="ex">Exporter</label><input id="ex" className="fld" value={v.form.ex} onChange={v.onEx} placeholder="e.g. LionCity Fresh Imports" /></div><div><label className="lbl" htmlFor="crop">Crop</label><select id="crop" className="fld" value={v.form.crop} onChange={v.onCrop}>{v.cropOpts.map((o, $index) => (<Fragment key={$index}><option value={o}>{o}</option></Fragment>))}</select></div><div><label className="lbl" htmlFor="country">Country</label><select id="country" className="fld" value={v.form.country} onChange={v.onCountry}>{v.countries.map((o, $index) => (<Fragment key={$index}><option value={o}>{o}</option></Fragment>))}</select></div><div style={{"display":"grid","gridTemplateColumns":"repeat(2,minmax(0,1fr))","gap":"8px"}}><div><label className="lbl" htmlFor="qty">Quantity (t)</label><input id="qty" type="number" min="1" className="fld" value={v.form.qty} onChange={v.onQty} /></div><div><label className="lbl" htmlFor="dl">Deadline</label><input id="dl" type="date" className="fld" value={v.form.dl} onChange={v.onDl} /></div></div><button className="btn" onClick={v.create} style={{"background":"#DCE96C","color":"#14382b","marginTop":"4px"}}>Create project</button><Link href="/new-project" style={{"display":"grid","placeItems":"center","minHeight":"44px","borderRadius":"12px","border":"1px solid #3d6b55","color":"#E8F1EA","fontSize":"13px","fontWeight":"600"}}>Or describe it to the assistant →</Link><div style={{"fontSize":"13px","color":"#B9CDC0","minHeight":"20px"}}>{v.msg}</div><div className="note" style={{"marginTop":"auto"}}>Creating a project opens it in your ongoing list and asks the recommendation model for farmers. Confirmed demand stays separate from forecast demand.</div></aside><aside className="panel" style={{"left":"1076px","top":"132px","width":"340px","height":"744px","display":"flex","flexDirection":"column","gap":"10px"}}><div><div className="kick">LIVE TRADE DESK</div><div className="hd" style={{"fontSize":"22px","marginTop":"6px","lineHeight":"1.2"}}>Exporters near you</div></div><div className="note">Who is in the room now. Invite one to see the deal come together.</div><div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>{v.sugg.map((s, $index) => (<Fragment key={$index}><div style={css(`padding:12px;border-radius:14px;background:${s.bg};border:1px solid ${s.border}`)}><div style={{"display":"flex","alignItems":"center","gap":"10px"}}><span style={css(`position:relative;width:38px;height:38px;border-radius:50%;background:${s.color};display:grid;place-items:center;font-size:12px;font-weight:700;color:#10201a`)}>{s.ini}<span style={css(`position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;background:${s.dot};border:2px solid #0f261e`)} /></span><span style={{"flex":"1","minWidth":"0"}}><span style={{"display":"block","fontSize":"14px","fontWeight":"600"}}>{s.name}</span><span style={{"display":"block","fontSize":"12px","color":"#A9C0B2"}}>{s.where} · {s.km} km · {s.status}</span></span><span style={{"fontSize":"12px","fontWeight":"700","color":"#DCE96C"}}>{s.match}%</span></div><button className="btn" onClick={s.invite} style={{"width":"100%","marginTop":"10px","background":"#143026","color":"#E8F1EA"}}>{s.btn}</button></div></Fragment>))}</div><div style={{"borderTop":"1px solid #2c4a3d","paddingTop":"10px"}}><div className="kick">ACTIVITY</div><ul style={{"listStyle":"none","margin":"8px 0 0","padding":"0","display":"flex","flexDirection":"column","gap":"6px"}}>{v.log.map((e, $index) => (<Fragment key={$index}><li style={{"fontSize":"12px","lineHeight":"1.4","color":"#C9D9CF"}}>{e}</li></Fragment>))}</ul></div><div className="note" style={{"marginTop":"auto"}}>Exporter names, distances and match scores are sample values.</div></aside><section className="panel" style={{"left":"380px","top":"640px","width":"680px","height":"236px","display":"flex","flexDirection":"column","gap":"10px"}}><div style={{"display":"flex","justifyContent":"space-between","alignItems":"baseline"}}><span className="hd" style={{"fontSize":"18px"}}>Ongoing contracts · {v.catName}</span><span className="note">{v.count} active</span></div><div style={{"display":"flex","gap":"10px","overflow":"hidden"}}>{v.ongoing.map((o, $index) => (<Fragment key={$index}><div style={{"flex":"1","minWidth":"0","padding":"12px","borderRadius":"14px","background":"#143026","display":"flex","flexDirection":"column","gap":"4px"}}><span style={{"fontSize":"14px","fontWeight":"600","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{o.ex}</span><span style={{"fontSize":"12px","color":"#A9C0B2"}}>{o.crop} · {o.country}</span><span style={{"fontSize":"13px","fontWeight":"600"}}>{o.value}{" "}<span style={{"color":"#A9C0B2","fontWeight":"500"}}>· due {o.due}</span></span><div style={{"height":"8px","borderRadius":"999px","background":"#1c3a2f","marginTop":"6px","overflow":"hidden"}}><div style={css(`height:100%;width:${o.prog}%;background:linear-gradient(90deg,#4fbf72,#DCE96C)`)} /></div><span style={{"fontSize":"12px","color":"#A9C0B2"}}>{o.stage}</span></div></Fragment>))}</div></section></div>)} />;
}
