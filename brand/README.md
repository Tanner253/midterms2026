# $MIDTERMS brand kit

The brand is a paper ballot: ballot stock, black ink, scanner timing marks, and an oval filled in with a red pen and a blue pen, purple where they cross. $MIDTERMS is the write-in. It draws every image from SVG with the site's fonts.

Run from this folder after `npm ci`:

```bash
node midterms.js   # logo, PFP, X banner, share card and icons, into out/
node xpost.js '{"burned":"1.2M","pct":"0.12%","mcap":"$120K","vol":"$40K","holders":"1,204","coins":"28","lead":"LEADING COIN: $PAXTON · ECOSYSTEM $900K"}'
```

`render.js` holds the palette and shared helpers. Use live numbers in posts. The fonts have no emoji, so emoji go in captions, not images.

After changing the art, copy the new files from `out/` into `public/brand/`, `public/og.png` and `src/app/`, and bump the version in `src/lib/og.ts` so X picks up the new share card.
