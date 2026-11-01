# $MIDTERMS brand kit

Draws every brand image from SVG with the site's fonts. Run from this folder after `npm ci`:

```bash
node midterms.js   # seal, PFP, X banner, share card and icons, into out/
node xpost.js '{"burned":"1.2M","pct":"0.12%","mcap":"$120K","vol":"$40K","holders":"1,204","coins":"28","lead":"LEADING COIN: $PAXTON · ECOSYSTEM $900K"}'
```

`render.js` holds the shared helpers. Use live numbers in posts. The fonts have no emoji, so emoji go in captions, not images.
