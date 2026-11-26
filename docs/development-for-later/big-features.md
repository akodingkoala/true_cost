# Big features (for later)

Larger pieces that make True Cost much more powerful. Rough order from most to least important.

---

## 1. Shared price database (the most important one)

Right now each person's extension only remembers prices *they* have seen. With a shared
database, every True Cost user's visits get pooled together, so history builds up much faster.

- **Free option:** Cloudflare Workers (a small server) + D1 (database). One free account covers both.
- The server also hides API keys, which must never be put inside the extension.
- Save prices by **store + product ID** (for example `target:85978609`), not the full link.
- Each saved price remembers where it came from: a user, the Wayback Machine, or an API.

## 2. Fill in past prices with the Wayback Machine (free)

archive.org saves copies of web pages over time. For a product link, ask its free CDX API for
every saved copy, then run our existing price reader on each copy to get old prices.

- Free, no key needed, but it may slow down if we send too many requests.
- Only works for pages the archive happened to save (good for popular items).
- Use one saved copy per day to avoid duplicates.

## 3. Price APIs (free tiers)

- **RetailerAPI:** free tier of 1,000 lookups a month. Covers Amazon, Walmart, Target, Best Buy, Lowe's, Home Depot and eBay. Save every answer so each product only uses up one lookup.
- **Best Buy API:** free key, gives current and regular price.
- **Open Prices:** free crowdsourced data, mostly groceries.
- Paid, if ever needed: Keepa (Amazon, about €49 a month), ShopSavvy (many stores, about $49–100 a month).

Check current prices and limits before signing up; these came from vendor pages and reviews.

## 4. Stock-market style price chart

- Line chart in the popup using Chart.js.
- Chart.js must be **downloaded into the project**, because Chrome extensions can't load code from the internet.
- Draw the store's claimed "was" price as a dotted line so fake discounts are obvious.
- Different dot styles for each data source (you, other users, archive, API).

## 5. Fashion-specific pricing

- Track the price per size and color.
- Detect banners like "Extra 40% off, applied in cart," since that discount never shows on the product page.

## 6. Alerts and badges

- Show a red badge on the extension icon when the "was" price looks fake.
- Let users watch an item and get notified when it hits its lowest price.

## 7. Publishing

- Firefox version (mostly the same code).
- Publish on the Chrome Web Store: needs icons, screenshots, a privacy policy, and a one-time developer fee.
