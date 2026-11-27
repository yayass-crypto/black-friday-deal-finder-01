# Deal Sleuth — Real Black Friday 2026 Deals, Checked by Hand

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/yayass-crypto/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/yayass-crypto/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

Black Friday is 27 November 2026 — and half the "deals" out there are red
stickers on ordinary prices. Deal Sleuth lists 39 real ones, each price read
at its store (or in a deals source that names the store) on the morning of
27 November 2026, with an honest verdict on every deal: NEW LOW (lowest
price ever recorded), STRONG DEAL (40% off or more), SOLID DEAL (20–39%),
or ROUTINE SALE (under 20% — listed honestly, because a small real cut
beats a big fake one).

7 of the 39 are new all-time lows. Average discount 42%. Total saving if
you bought them all: $6,353.93. Eight stores: Amazon, Best Buy, Walmart,
Ulta, Nordstrom, NuFACE, Away, and Kate Spade Outlet — every deal links to the live
listing at its store.

## Use it

Open `app/index.html` in a desktop browser (or serve `app/` with any
static server). No build step, no network requests. Search deals, filter by
category, store and discount, sort by discount / saving / price, or show
only the new lows. Every deal opens its own page with the evidence: why it
is really a deal, when its price was checked, and where it was read.

## Layout

- `main.ts` — the hand-in program (Node 22): copies `app/` and
  `screenshots/` to `/output` and writes `/output/dossier.json`.
- `app/` — the deal finder as static files (`index.html`, `style.css`,
  `main.js`, `data.js`).
- `app/data.js` — the 39 deals: product, store, category, sale price,
  usual price, store link, check time, and the source that showed the
  price.
- `screenshots/` — real renders of the site's own code: the deal board,
  a deal page, the phone layout, and the new-lows view.
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.

## Entry

Built for the [make.fun](https://make.fun/bounty/black-friday-deal-finder-01)
competition `black-friday-deal-finder-01` — "Build the best real Black
Friday deal finder" ($250, 20 paid places). MIT licensed.
