"use client";

import { useEffect, useReducer, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * Small runtime for the HarvestLink page components.
 *
 * Each page keeps its view logic in a `Logic` class (state, `setState`,
 * lifecycle methods and a `renderVals()` that returns everything the markup
 * needs). `DC` owns the instance, re-renders when state changes, and scales
 * the fixed 1440×900 canvas to fit the browser window.
 */
export class DCLogic {
  props: Record<string, unknown> = {};
  state: Record<string, unknown> = {};
  _update: (() => void) | null = null;

  setState(patch: Record<string, unknown> | ((s: Record<string, unknown>) => Record<string, unknown>)) {
    const next = typeof patch === "function" ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this._update?.();
  }

  forceUpdate() {
    this._update?.();
  }

  connect(update: (() => void) | null) {
    this._update = update;
  }

  componentDidMount?(): void;
  componentWillUnmount?(): void;
  renderVals(): Record<string, unknown> {
    return {};
  }
}

const camel = (p: string) =>
  p
    .replace(/^-webkit-/, "Webkit-")
    .replace(/^-ms-/, "ms-")
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** Parses an inline CSS declaration string (as built in the page logic) into a React style object. */
export function css(input: string): CSSProperties {
  const style: Record<string, string> = {};
  let depth = 0;
  let quote: string | null = null;
  let current = "";
  const flush = () => {
    const i = current.indexOf(":");
    if (i > 0) {
      const prop = current.slice(0, i).trim();
      style[prop.startsWith("--") ? prop : camel(prop)] = current.slice(i + 1).trim();
    }
    current = "";
  };
  for (const ch of input) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === ";" && depth === 0) {
      flush();
      continue;
    }
    current += ch;
  }
  flush();
  return style as CSSProperties;
}

const W = 1440;
const H = 900;

/** Scales the fixed-size canvas to the window and centres it. */
function Fit({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.max(0.4, Math.min(window.innerWidth / W, window.innerHeight / H)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "auto", background: "#0b1b16", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: W * scale, height: H * scale, flex: "none" }}>
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
      </div>
    </div>
  );
}

export function DC({
  Logic,
  css: pageCss,
  render,
}: {
  Logic: new () => DCLogic;
  css: string;
  render: (v: Record<string, never>) => ReactNode;
}) {
  const [instance] = useState(() => new Logic());
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    instance.connect(tick as () => void);
    instance.componentDidMount?.();
    return () => {
      instance.componentWillUnmount?.();
      instance.connect(null);
    };
  }, [instance]);

  const v = instance.renderVals() as Record<string, never>;
  return (
    <Fit>
      <style>{pageCss}</style>
      {render(v)}
    </Fit>
  );
}
