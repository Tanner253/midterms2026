// Shared drawing helpers for the $MIDTERMS brand: a paper ballot, filled in by hand.
const { Resvg } = require("@resvg/resvg-js");
const fs = require("node:fs");
const path = require("node:path");

const OUT = path.join(__dirname, "out");
const FONTS = ["BigShouldersDisplay-Black.ttf", "BigShouldersDisplay-ExtraBold.ttf", "ArchivoNarrow-Bold.ttf", "PermanentMarker-Regular.ttf"].map((f) => path.join(__dirname, "fonts", f));

// Ballot stock, black ink, and the red and blue pens that make purple where they overlap.
const C = { paper: "#f2f4ee", stock: "#e3e8dc", rule: "#c9d1c0", ink: "#12151a", red: "#d8232a", blue: "#1d4ed8", swing: "#6b2fbf" };

const HEAD = "Big Shoulders Display";
const LABEL = "Archivo Narrow";
const HAND = "Permanent Marker";

// Repeatable pseudo-random numbers, so every render comes out the same.
function rng(seed = 7) {
  let v = seed;
  return () => (v = (v * 16807) % 2147483647) / 2147483647;
}

// One pen's zig-zag across the part of an oval between fractions `from` and `to` of its width.
// Each pass overshoots the edge a little, the way a real marked ballot does.
function scribble(cx, cy, rx, ry, { from = 0, to = 1, passes = 30, color, seed = 3 }) {
  const r = rng(seed);
  const width = ((2 * ry) / passes) * 1.7;
  let d = "";
  for (let i = 0; i <= passes; i++) {
    const y = cy - ry * 0.93 + (i * (ry * 1.86)) / passes;
    const half = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / (ry * 1.02)) ** 2));
    const left = cx - rx + 2 * rx * from + (r() - 0.5) * rx * 0.06;
    const right = cx - rx + 2 * rx * to + (r() - 0.5) * rx * 0.06;
    const x0 = Math.max(cx - half * (0.97 + r() * 0.05), left);
    const x1 = Math.min(cx + half * (0.97 + r() * 0.05), right);
    if (x1 <= x0) continue;
    const [p, q] = i % 2 ? [x1, x0] : [x0, x1];
    d += `${d ? "L" : "M"}${p.toFixed(1)},${(y + ry * 0.02).toFixed(1)} L${q.toFixed(1)},${(y - ry * 0.02).toFixed(1)} `;
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width.toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// The ballot oval, filled in with the red pen and the blue pen, purple where they cross.
function filledOval(cx, cy, rx, ry, { outline = true, passes = 30 } = {}) {
  return `
  ${outline ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.paper}" stroke="${C.ink}" stroke-width="${Math.max(2, ry * 0.05).toFixed(1)}"/>` : ""}
  ${scribble(cx, cy, rx, ry, { from: 0, to: 0.56, color: C.red, passes, seed: 11 })}
  ${scribble(cx, cy, rx, ry, { from: 0.44, to: 1, color: C.blue, passes, seed: 29 })}
  ${scribble(cx, cy, rx, ry, { from: 0.4, to: 0.6, color: C.swing, passes, seed: 47 })}`;
}

// An empty ballot oval.
const emptyOval = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.paper}" stroke="${C.ink}" stroke-width="3.5"/>`;

// The black timing marks a ballot scanner reads, along the edge of the sheet.
function timing(x, y, length, { size = 22, gap = 22, thick = 12, vertical = false } = {}) {
  let s = "";
  for (let p = 0; p + size <= length; p += size + gap)
    s += vertical
      ? `<rect x="${x}" y="${y + p}" width="${thick}" height="${size}" fill="${C.ink}"/>`
      : `<rect x="${x + p}" y="${y}" width="${size}" height="${thick}" fill="${C.ink}"/>`;
  return s;
}

const text = (x, y, size, str, { font = HEAD, fill = C.ink, weight = 900, anchor = "start", spacing = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-weight="${weight}" font-size="${size}" letter-spacing="${spacing}" fill="${fill}" text-anchor="${anchor}">${str}</text>`;

// A contest box from the ballot: black header bar, then rows of oval + choice.
function contest(x, y, w, { title, note, rows, rowH = 70, size = 40 }) {
  const head = 64;
  const h = head + rows.length * rowH;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>
  <rect x="${x}" y="${y}" width="${w}" height="${head}" fill="${C.ink}"/>
  ${text(x + 18, y + 30, 25, title, { font: LABEL, weight: 700, fill: C.paper, spacing: 3 })}
  ${text(x + 18, y + 52, 17, note, { font: LABEL, weight: 700, fill: C.rule, spacing: 2.5 })}`;
  rows.forEach((r, i) => {
    const ry = y + head + i * rowH;
    const cy = ry + rowH / 2;
    if (i) s += `<line x1="${x}" y1="${ry}" x2="${x + w}" y2="${ry}" stroke="${C.ink}" stroke-width="2"/>`;
    s += r.write
      ? `${filledOval(x + 52, cy, 28, 17, { passes: 11 })}
         ${text(x + 98, cy + 7, 15, "WRITE-IN", { font: LABEL, weight: 700, spacing: 2 })}
         <line x1="${x + 176}" y1="${cy + 16}" x2="${x + w - 22}" y2="${cy + 16}" stroke="${C.ink}" stroke-width="2"/>
         <g transform="rotate(-3 ${x + 190} ${cy + 10})">${text(x + 184, cy + 12, (w - 206) / 6.4, r.label, { font: HAND, weight: 400, fill: C.ink })}</g>`
      : `${emptyOval(x + 52, cy, 28, 17)}${text(x + 98, cy + size * 0.36, size, r.label, { weight: 800 })}`;
  });
  return { svg: s, h };
}

function render(svg, file, width) {
  fs.mkdirSync(OUT, { recursive: true });
  const r = new Resvg(svg, {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: LABEL },
    fitTo: { mode: "width", value: width },
  });
  const png = r.render().asPng();
  fs.writeFileSync(path.join(OUT, file), png);
  return png;
}

module.exports = { C, HEAD, LABEL, HAND, OUT, scribble, filledOval, emptyOval, timing, text, contest, render };
