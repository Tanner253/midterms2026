// $MIDTERMS logo, X banner, share card and icons: a paper ballot with the oval filled in by hand.
const fs = require("node:fs");
const path = require("node:path");
const { C, HEAD, LABEL, OUT, filledOval, timing, text, contest, render } = require("./render.js");

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
  ${timing(262, 96, 500, { size: 28, gap: 28, thick: 14 })}
  <g transform="translate(142 40) scale(0.72266)">${mark()}</g>
  ${text(512, 786, 124, "MIDTERMS", { anchor: "middle", spacing: 6 })}
  ${text(512, 842, 34, "WRITE IT IN · NOV 3, 2026", { font: LABEL, weight: 700, anchor: "middle", spacing: 7 })}
  ${timing(262, 900, 500, { size: 28, gap: 28, thick: 14 })}`);
}

// The logo on its own with a transparent background, for the site's nav.
const logo = () => svg(1024, 1024, mark());

// X header, 1500x500. The avatar sits over the bottom-left, so the copy stays clear of it.
function banner() {
  const ballot = contest(960, 62, 480, {
    title: "CONTROL OF CONGRESS",
    note: "VOTE FOR ONE",
    rowH: 108,
    size: 54,
    rows: [{ label: "REPUBLICANS" }, { label: "DEMOCRATS" }, { label: "$MIDTERMS", write: true }],
  });
  return svg(1500, 500, `
  <rect width="1500" height="500" fill="${C.paper}"/>
  ${timing(30, 14, 1450)}
  ${timing(30, 474, 1450)}
  ${text(96, 88, 25, "OFFICIAL BALLOT · GENERAL ELECTION · NOVEMBER 3, 2026", { font: LABEL, weight: 700, spacing: 3 })}
  <rect x="96" y="102" width="800" height="6" fill="${C.ink}"/>
  ${text(92, 236, 140, "WHO CONTROLS")}
  ${text(92, 362, 140, "CONGRESS?", { fill: C.swing })}
  ${text(400, 426, 29, "MIDTERMS2026.FUN · ON PUMP.FUN", { font: LABEL, weight: 700, spacing: 3 })}
  ${ballot.svg}`);
}

// Share card for X / Telegram, 1200x630.
function og() {
  const ballot = contest(640, 134, 500, {
    title: "CONTROL OF CONGRESS",
    note: "VOTE FOR ONE",
    rowH: 124,
    size: 56,
    rows: [{ label: "REPUBLICANS" }, { label: "DEMOCRATS" }, { label: "$MIDTERMS", write: true }],
  });
  return svg(1200, 630, `
  <rect width="1200" height="630" fill="${C.paper}"/>
  ${timing(30, 18, 1150)}
  ${timing(30, 600, 1150)}
  ${text(60, 88, 27, "OFFICIAL BALLOT · GENERAL ELECTION · NOVEMBER 3, 2026", { font: LABEL, weight: 700, spacing: 4 })}
  <rect x="60" y="104" width="1080" height="6" fill="${C.ink}"/>
  <g transform="translate(46 118) scale(0.25)">${mark()}</g>
  ${text(306, 226, 78, "MIDTERMS")}
  ${text(306, 284, 54, "2026", { fill: C.swing })}
  ${text(60, 448, 92, "WHO CONTROLS")}
  ${text(60, 544, 92, "CONGRESS?", { fill: C.swing })}
  ${ballot.svg}`);
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
