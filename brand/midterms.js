// $MIDTERMS logo, X banner, share card and icons: a paper ballot with the oval filled in by hand.
const fs = require("node:fs");
const path = require("node:path");
const { C, HEAD, LABEL, OUT, filledOval, scribble, text, render } = require("./render.js");

const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

// The mark: the filled oval with an M knocked out of it, in a 1024 box.
function mark() {
  return `
  ${filledOval(512, 512, 480, 318, { outline: false })}
  <text x="512" y="686" font-family="${HEAD}" font-weight="900" font-size="500" text-anchor="middle" fill="${C.paper}">M</text>`;
}

// PFP. X crops it to a circle, so everything stays well inside the corners.
function pfp() {
  return svg(1024, 1024, `
  <rect width="1024" height="1024" fill="${C.paper}"/>
  <g transform="translate(142 63) scale(0.72266)">${mark()}</g>
  ${text(512, 821, 150, "MIDTERMS", { anchor: "middle", spacing: 6 })}`);
}

// The logo on its own with a transparent background, for the site's nav.
const logo = () => svg(1024, 1024, mark());

// The two pens across a whole canvas: red into purple into blue, with hand-drawn edges.
function penField(w, h) {
  const rx = w * 0.7;
  const ry = h * 0.86;
  const cx = w / 2;
  const cy = h / 2;
  return `
  <rect width="${cx}" height="${h}" fill="${C.red}"/>
  <rect x="${cx}" width="${cx}" height="${h}" fill="${C.blue}"/>
  ${scribble(cx, cy, rx, ry, { from: 0.42, to: 0.58, color: C.swing, passes: 26, seed: 47 })}`;
}

// X header, 1500x500. The avatar sits over the bottom-left, so the word stays above it.
function banner() {
  return svg(1500, 500, `
  ${penField(1500, 500)}
  ${text(750, 338, 250, "MIDTERMS", { anchor: "middle", fill: C.paper, spacing: 6 })}`);
}

// Share card for X / Telegram, 1200x630.
function og() {
  return svg(1200, 630, `
  ${penField(1200, 630)}
  ${text(600, 372, 236, "MIDTERMS", { anchor: "middle", fill: C.paper, spacing: 6 })}
  ${text(600, 440, 34, "MIDTERMS2026.FUN", { font: LABEL, weight: 700, anchor: "middle", fill: C.paper, spacing: 8 })}`);
}

// Tiny favicons (16-48px): just the two-colour oval, drawn solid so it holds up.
function favicon() {
  return svg(1024, 1024, `
  <defs><clipPath id="f"><ellipse cx="512" cy="512" rx="490" ry="350"/></clipPath></defs>
  <g clip-path="url(#f)">
    <rect x="0" y="0" width="512" height="1024" fill="${C.red}"/>
    <rect x="512" y="0" width="512" height="1024" fill="${C.blue}"/>
    <polygon points="430,0 610,0 594,1024 414,1024" fill="${C.swing}"/>
  </g>
  <ellipse cx="512" cy="512" rx="490" ry="350" fill="none" stroke="${C.ink}" stroke-width="44"/>`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "midterms-pfp.svg"), pfp());
  fs.writeFileSync(path.join(OUT, "midterms-banner.svg"), banner());
  for (const w of [1024, 400]) render(pfp(), `midterms-pfp-${w}.png`, w);
  render(banner(), "midterms-banner-1500x500.png", 1500);
  render(banner(), "midterms-banner-1200x400.png", 1200);
  render(banner(), "midterms-banner-600x200.png", 600);
  render(logo(), "logo.png", 512);
  render(og(), "og.png", 1200);
  render(pfp(), "icon.png", 512);
  render(pfp(), "apple-icon.png", 180);
  const small = [16, 32, 48].map((w) => render(favicon(), `favicon-${w}.png`, w));
  fs.writeFileSync(path.join(OUT, "favicon.ico"), await require("png-to-ico")(small));
  console.log("rendered");
}
if (require.main === module) main();

module.exports = { mark, svg };
