"""Render the Farmora slide illustrations to PNGs (3200x2000).

    uv run --with playwright python tools/illustrations/render.py                    # card backdrop (default) + transparent
    uv run --with playwright python tools/illustrations/render.py --bg green --out x # preview on a slide-like green
"""
import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SCENES = ["clusters", "compass", "network", "assistant"]
ROOT = HERE.parent.parent / "slide-illustrations"

ap = argparse.ArgumentParser()
ap.add_argument("--bg", choices=["card", "transparent", "green"], help="render only this background")
ap.add_argument("--out", type=Path, help="output folder (with --bg)")
args = ap.parse_args()
jobs = [(args.bg, args.out or ROOT)] if args.bg else [("card", ROOT), ("transparent", ROOT / "transparent")]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=2)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    for bg, out in jobs:
        out.mkdir(parents=True, exist_ok=True)
        for i, s in enumerate(SCENES, 1):
            page.goto((HERE / "illustrations.html").as_uri() + f"?scene={s}&bg={bg}", wait_until="networkidle")
            page.evaluate("window.ready")
            page.wait_for_timeout(400)
            path = out / f"{i}-farmora-{s}.png"
            page.locator("#canvas").screenshot(path=str(path), omit_background=bg != "green")
            print("saved", path)
    if errors:
        print("page errors:", errors)
    browser.close()
