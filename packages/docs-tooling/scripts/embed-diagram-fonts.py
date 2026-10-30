#!/usr/bin/env python3
"""Embed subset ABC Diatype faces in the SVG diagrams under /docs-assets.

The docs load diagrams with <img>, and an SVG used as an image cannot reach
the page's web fonts (or any external file). Without this, every label falls
back to the reader's system font (DejaVu Sans on Linux, Arial elsewhere),
which is wider than Diatype and makes labels collide with shapes.

For every SVG with <text>, this writes one <style id="sol-diagram-fonts">
with @font-face rules for the "Diatype" family the diagrams already name,
each a WOFF2 subset holding only the glyphs and weights that file uses
(typically 4-10 KB per weight); labels set in Arial are pointed at the same
face. Re-running replaces the block,
so it is idempotent; run it after editing or adding a diagram:

    python3 -m pip install fonttools brotli   # once
    python3 packages/docs-tooling/scripts/embed-diagram-fonts.py [--check]

--check exits 1 when a file would change (CI freshness check).
"""
from __future__ import annotations

import base64
import html
import io
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[3]
ASSETS = ROOT / "apps" / "docs" / "public" / "docs-assets"
FONTS = ROOT / "apps" / "docs" / "src" / "fonts"
FACES = {
    # weight range -> font file. 600 (the diagrams' "bold") uses Medium,
    # the weight the docs use for headings.
    "400": FONTS / "diatype" / "ABCDiatype-Regular.woff2",
    "500 700": FONTS / "diatype" / "ABCDiatype-Medium.woff2",
}
MONO = FONTS / "abcmono" / "ABCFavoritMonoVariable-Regular.woff2"
BLOCK_RE = re.compile(r'<style id="sol-diagram-fonts">.*?</style>', re.S)


def text_chars(svg: str) -> str:
    body = BLOCK_RE.sub("", svg)
    body = re.sub(r"<style[^>]*>.*?</style>", "", body, flags=re.S)
    chars: set[str] = set()
    for m in re.finditer(r"<text\b.*?</text>", body, flags=re.S):
        inner = re.sub(r"<[^>]+>", "", m.group(0))
        chars.update(html.unescape(inner))
    return "".join(sorted(c for c in chars if not c.isspace())) + " "


def subset_woff2(font_file: Path, chars: str) -> bytes:
    font = TTFont(font_file, recalcTimestamp=False)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "calt", "tnum"]
    opts.name_IDs = []
    opts.notdef_outline = True
    sub = subset.Subsetter(options=opts)
    sub.populate(text=chars)
    sub.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    return buf.getvalue()


_cache: dict[tuple[str, str], bytes] = {}


def font_block(chars: str, heavy: bool) -> str:
    rules = []
    for family in ("Diatype",):
        for weight, file in FACES.items():
            if weight != "400" and not heavy:
                continue
            key = (str(file), chars)
            if key not in _cache:
                _cache[key] = subset_woff2(file, chars)
            data = base64.b64encode(_cache[key]).decode("ascii")
            rules.append(
                f'@font-face{{font-family:"{family}";font-weight:{weight};'
                f'src:url(data:font/woff2;base64,{data}) format("woff2")}}'
            )
    return '<style id="sol-diagram-fonts">' + "".join(rules) + "</style>"


def mono_rule(chars: str) -> str:
    key = (str(MONO), chars)
    if key not in _cache:
        _cache[key] = subset_woff2(MONO, chars)
    data = base64.b64encode(_cache[key]).decode("ascii")
    return (
        '@font-face{font-family:"ABC Favorit Mono";font-weight:100 900;'
        f'src:url(data:font/woff2;base64,{data}) format("woff2")}}'
    )


def process(path: Path) -> str | None:
    svg = path.read_text(encoding="utf8")
    if "<text" not in svg:
        return None
    clean = BLOCK_RE.sub("", svg)
    # Labels set in Arial use the same face.
    clean = re.sub(r"font-family:\s*Arial", "font-family: Diatype, Arial", clean)
    heavy = bool(
        re.search(r'font-weight(="|:\s*)(5|6|7|bold)', clean)
        or "<b>" in clean
    )
    chars = text_chars(clean)
    block = font_block(chars, heavy)
    if "Favorit Mono" in clean:
        block = block.replace("</style>", mono_rule(chars) + "</style>")
    m = re.search(r"<svg\b[^>]*>", clean)
    if not m:
        return None
    return clean[: m.end()] + block + clean[m.end() :]


def main() -> int:
    check = "--check" in sys.argv[1:]
    stale = []
    for path in sorted(ASSETS.rglob("*.svg")):
        out = process(path)
        if out is None:
            continue
        if out != path.read_text(encoding="utf8"):
            stale.append(path.relative_to(ROOT))
            if not check:
                path.write_text(out, encoding="utf8")
    verb = "stale" if check else "updated"
    for p in stale:
        print(f"{verb}: {p}")
    print(f"embed-diagram-fonts: {len(stale)} file(s) {verb}")
    return 1 if check and stale else 0


if __name__ == "__main__":
    sys.exit(main())
