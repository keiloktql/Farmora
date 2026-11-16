// @ts-nocheck
/* eslint-disable */
// WhatsApp: the farmer's side of Farmora, shown through the two product reels (onboarding, then an export
// order from offer to payment). One large player with custom controls and chapter thumbnails that seek.
// Videos live in public/whatsapp (MP4 + WebM, posters and chapter stills).
'use client';

import Link from 'next/link';
import { DC, DCLogic, css } from '@/lib/dc';
import { ProBadge } from '@/components/ui/pro-badge';

export const pageTitle = "WhatsApp";

const CSS = `
button{font-family:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
button:focus-visible,a:focus-visible{outline:2px solid #DCE96C;outline-offset:2px}
.panel{position:absolute;box-sizing:border-box;border-radius:20px;background:#0f261ed9;border:1px solid #2c4a3d;backdrop-filter:blur(14px)}
.kick{font-size:11px;letter-spacing:1.6px;font-weight:700;color:#8FB7A0;text-transform:uppercase}
.hd{font-family:var(--font-space),sans-serif;font-weight:600;letter-spacing:-.4px}
.note{font-size:12px;line-height:1.45;color:#86A394}
.jr{display:flex;gap:12px;width:100%;padding:10px;border-radius:16px;border:1px solid #23443a;background:#132e25;color:#E8F1EA;text-align:left;align-items:center}
.jr:hover{border-color:#3d6b55}
.jr.on{border-color:#25D366;background:#163a2b;box-shadow:0 0 0 1px #25D36655,0 10px 30px #00000040}
.ch{position:relative;flex:1;min-width:0;padding:0;border-radius:14px;border:1px solid #23443a;background:#132e25;color:#E8F1EA;text-align:left;overflow:hidden}
.ch:hover{border-color:#3d6b55}
.ch.on{border-color:#25D366}
.ctl{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;border:1px solid #ffffff22;background:#0b1b16cc;color:#E8F1EA;backdrop-filter:blur(8px)}
.feat{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #1a3a30}
.feat i{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:9px;background:#25D36622;font-style:normal;font-size:15px}
@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
.live{animation:pulse 1.6s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.live{animation:none}}
`;

const JOURNEYS = [
  { id: 'onboarding', n: 1, title: 'Joining Farmora', sub: 'A farmer signs up in their own language: by text, voice notes or a phone call.', dur: 20.5,
    chapters: [[0, 'Hello, in any language'], [2.8, 'Text or call?'], [6.55, 'Tap, speak, share'], [10.75, 'Doubts, answered'], [13.95, 'Rather talk?'], [17.2, 'Profile ready']] },
  { id: 'opportunity', n: 2, title: 'Growing an export order', sub: 'An order arrives, the farmer says yes, then gets a plan, rules and check-ins until they are paid.', dur: 21.5,
    chapters: [[0, 'From order to Singapore'], [2.65, 'The order arrives'], [6.75, 'Land, then a plan'], [10.35, 'Singapore rules'], [13.85, 'Checked every step'], [17.5, 'Delivered and paid']] },
];
const FEATURES = [
  ['🗣️', '9 Indian languages', 'Hindi, Telugu, Tamil, Kannada, Marathi and more'],
  ['🎙️', 'Voice first', 'Big buttons, voice notes that transcribe, or a call with an AI agent'],
  ['📱', 'No app to install', 'Works on any phone with WhatsApp, even on 2G'],
  ['🌦️', 'With them all season', 'Plans, reminders, weather alerts, check-ins and payment updates'],
];
const fmt = (s) => '0:' + String(Math.floor(s)).padStart(2, '0');

class Logic extends DCLogic {
  state = { j: 0, t: 0, playing: true };
  video() { return document.getElementById('wa-video'); }
  go(j, at = 0) {
    this.setState({ j, t: at, playing: true });
    setTimeout(() => { const v = this.video(); if (v) { v.currentTime = at; v.play().catch(() => this.setState({ playing: false })); } }, 30);
  }
  renderVals() {
    const { j, t, playing } = this.state;
    const nav = [['Overview', '/'], ['Contracts', '/contracts'], ['Farmer DB', '/farmers'], ['Buyers', '/buyers'], ['Progress', '/progress'], ['WhatsApp', '/whatsapp']]
      .map((n) => { const on = n[0] === 'WhatsApp'; return { name: n[0], href: n[1], bg: on ? '#DCE96C' : 'transparent', fg: on ? '#14382b' : '#B9CDC0', fw: on ? 600 : 500 }; });
    const J = JOURNEYS[j];
    let cur = 0; J.chapters.forEach((c, i) => { if (t >= c[0]) cur = i; });
    return {
      nav, j: J,
      src: { mp4: '/whatsapp/' + J.id + '.mp4', webm: '/whatsapp/' + J.id + '.webm', poster: '/whatsapp/' + J.id + '-poster.jpg' },
      journeys: JOURNEYS.map((x, i) => ({ ...x, on: i === j, thumb: '/whatsapp/' + x.id + '-poster.jpg', len: fmt(x.dur), prog: i === j ? Math.min(100, t / x.dur * 100) : i < j ? 100 : 0, pick: () => this.go(i) })),
      chapters: J.chapters.map((c, i) => {
        const end = i + 1 < J.chapters.length ? J.chapters[i + 1][0] : J.dur;
        return { n: String(i).padStart(2, '0'), title: c[1], at: fmt(c[0]), sec: c[0], thumb: '/whatsapp/' + J.id + '-ch' + i + '.jpg', on: i === cur,
          fill: t >= end ? 100 : t <= c[0] ? 0 : (t - c[0]) / (end - c[0]) * 100, pick: () => this.go(j, c[0] + 0.05) };
      }),
      features: FEATURES, playing, time: fmt(t) + ' / ' + fmt(J.dur), progress: t / J.dur * 100,
      onTime: (e) => this.setState({ t: e.currentTarget.currentTime }),
      onEnded: () => this.go((j + 1) % JOURNEYS.length),
      onPlay: () => this.setState({ playing: true }), onPause: () => this.setState({ playing: false }),
      toggle: () => { const v = this.video(); if (!v) return; if (v.paused) v.play(); else v.pause(); },
      restart: () => this.go(j, 0),
      seekBar: (e) => { const r = e.currentTarget.getBoundingClientRect(); const f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); const v = this.video(); if (v) v.currentTime = f * J.dur; },
      full: () => { const v = this.video(); if (v && v.requestFullscreen) v.requestFullscreen(); },
    };
  }
}

const Play = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>);
const Pause = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>);
const Replay = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>);
const Full = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);
const WaIcon = ({ s = 18 }) => (<svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" /><path fill="#fff" d="M9.2 7.2c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.4.2-.4v-.4l-.7-1.9z" /></svg>);

export default function WhatsAppPage() {
  return <DC Logic={Logic} css={CSS} render={(v) => (
    <div style={{ position: 'relative', width: 1440, height: 900, overflow: 'hidden', background: 'radial-gradient(900px 600px at 62% 42%,#1f4a39 0%,#0f261e 58%,#0a1814 100%)', fontFamily: 'var(--font-inter),system-ui,sans-serif', color: '#E8F1EA' }}>
      <header style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 64, boxSizing: 'border-box', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: '#DCE96C', display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14382b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 20h10M12 20v-9" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z" /></svg></div><span className="hd" style={{ fontWeight: 700, fontSize: 18 }}>Farmora</span></div>
        <nav aria-label="Workspaces" style={{ display: 'flex', gap: 2, marginLeft: 12, padding: 4, borderRadius: 999, background: '#12281f99', border: '1px solid #2c4a3d' }}>{v.nav.map((n, i) => (<Link key={i} href={n.href} style={css(`padding:8px 14px;border-radius:999px;background:${n.bg};color:${n.fg};font-size:13px;font-weight:${n.fw}`)}>{n.name}{n.name === 'Buyers' && <ProBadge />}</Link>))}</nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, padding: '0 12px 0 6px', borderRadius: 999, border: '1px solid #2c4a3d', background: '#12281f99', fontSize: 13 }}><span style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8BC7C', color: '#4a3420', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>CF</span><span><b style={{ display: 'block', fontWeight: 600 }}>Chittoor Farmers FPO</b><span style={{ display: 'block', fontSize: 12, color: '#A9C0B2' }}>The farmer&apos;s side</span></span></div>
      </header>

      {/* Left: story */}
      <aside className="panel" style={{ left: 24, top: 80, width: 340, height: 796, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><WaIcon /><span className="kick" style={{ color: '#25D366' }}>The farmer&apos;s side</span></div>
          <div className="hd" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 8 }}>Farmora lives in their WhatsApp</div>
          <div style={{ fontSize: 13, color: '#C9D9CF', marginTop: 8, lineHeight: 1.5 }}>Farmers never open a dashboard. They join, take orders and report progress in a chat, in their own language.</div>
        </div>
        <div>
          <div className="kick" style={{ marginBottom: 8 }}>Two journeys</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {v.journeys.map((x) => (<button key={x.id} className={'jr' + (x.on ? ' on' : '')} onClick={x.pick} aria-pressed={x.on}>
              <span style={{ position: 'relative', flex: 'none', width: 112, height: 63, borderRadius: 10, overflow: 'hidden', background: '#0b1b16' }}>
                <img src={x.thumb} alt="" width="112" height="63" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', left: 6, bottom: 5, fontSize: 10.5, fontWeight: 700, padding: '1px 6px', borderRadius: 6, background: '#000000aa' }}>{x.len}</span>
                <span style={css(`position:absolute;left:0;bottom:0;height:3px;width:${x.prog}%;background:#25D366`)} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="kick" style={{ fontSize: 10, color: x.on ? '#25D366' : '#8FB7A0' }}>{x.on ? (<><span className="live" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#25D366', marginRight: 5 }} />Playing</>) : 'Journey ' + x.n}</span>
                <b style={{ display: 'block', fontSize: 14, fontWeight: 600, marginTop: 2 }}>{x.title}</b>
                <span style={{ display: 'block', fontSize: 11.5, color: '#86A394', marginTop: 2, lineHeight: 1.35 }}>{x.sub}</span>
              </span>
            </button>))}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <div className="kick" style={{ marginBottom: 4 }}>Built for farmers</div>
          {v.features.map((f, i) => (<div key={i} className="feat"><i aria-hidden="true">{f[0]}</i><span><b style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>{f[1]}</b><span style={{ fontSize: 12, color: '#86A394' }}>{f[2]}</span></span></div>))}
        </div>
      </aside>

      {/* Player */}
      <section aria-label={'Video: ' + v.j.title} style={{ position: 'absolute', left: 384, top: 80, width: 1032, height: 581, borderRadius: 22, overflow: 'hidden', background: '#0b1b16', border: '1px solid #2c4a3d', boxShadow: '0 0 0 1px #25D36622, 0 30px 80px #00000066, 0 0 120px #25D36622' }}>
        <video key={v.j.id} id="wa-video" autoPlay muted playsInline preload="auto" poster={v.src.poster} onTimeUpdate={v.onTime} onEnded={v.onEnded} onPlay={v.onPlay} onPause={v.onPause} onClick={v.toggle}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}>
          <source src={v.src.webm} type="video/webm" />
          <source src={v.src.mp4} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '28px 16px 14px', background: 'linear-gradient(transparent,#06110dcc)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="ctl" onClick={v.toggle} aria-label={v.playing ? 'Pause' : 'Play'}>{v.playing ? <Pause /> : <Play />}</button>
          <button className="ctl" onClick={v.restart} aria-label="Replay from the start"><Replay /></button>
          <div role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v.progress)} tabIndex={0} onClick={v.seekBar} style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: '100%', height: 5, borderRadius: 999, background: '#ffffff26' }}>
              <div style={css(`position:absolute;left:0;top:0;bottom:0;width:${v.progress}%;border-radius:999px;background:#25D366`)} />
              {v.chapters.map((c, i) => i > 0 && (<span key={i} style={css(`position:absolute;top:-2px;width:2px;height:9px;background:#0b1b16;left:${c.sec / v.j.dur * 100}%`)} />))}
            </div>
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: '#E8F1EA', minWidth: 74, textAlign: 'right' }}>{v.time}</span>
          <button className="ctl" onClick={v.full} aria-label="Full screen"><Full /></button>
        </div>
      </section>

      {/* Chapters */}
      <div style={{ position: 'absolute', left: 384, top: 676, width: 1032 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div><span className="kick" style={{ color: '#DCE96C' }}>Journey {v.j.n}</span> <b className="hd" style={{ fontSize: 17, marginLeft: 6 }}>{v.j.title}</b></div>
          <span className="note">Tap a chapter to jump to it · plays the next journey when this one ends</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {v.chapters.map((c, i) => (<button key={i} className={'ch' + (c.on ? ' on' : '')} onClick={c.pick} aria-current={c.on}>
            <img src={c.thumb} alt="" width="160" height="90" loading="lazy" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', opacity: c.on ? 1 : .72 }} />
            <span style={{ display: 'block', padding: '7px 9px 9px' }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: c.on ? '#25D366' : '#8FB7A0' }}><span>{c.n}</span><span>{c.at}</span></span>
              <b style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</b>
            </span>
            <span style={css(`position:absolute;left:0;bottom:0;height:3px;width:${c.fill}%;background:#25D366`)} />
          </button>))}
        </div>
      </div>
    </div>
  )} />;
}
