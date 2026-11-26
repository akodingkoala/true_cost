# Hard stores (for later)

These stores are popular and full of fake "original" prices, which makes them great
targets for True Cost. They're also harder to read than normal stores, so we're
saving them until the regular stores work.

The URL formats below are from memory. Check them on a real product page before coding.

---

## Temu

**Why it's worth it:** Huge strikethrough "was" prices on almost everything, plus countdown timers that push you to buy fast.

**Why it's hard:**
- Prices change very often and can differ from person to person or visit to visit.
- The page is built by JavaScript after it loads, so the price may not be there when our script first runs.
- Strong anti-bot protection. We should only read the page the user is already looking at, never fetch pages ourselves.

**Ideas:**
- Wait for the price to appear on the page (watch for page changes) before reading it.
- Product ID is probably the `goods_id` in the URL.
- Record the countdown/"limited time" text too, to show how often the "deal" comes back.

---

## Shein

**Why it's worth it:** Constant flash sales and "extra % off" codes, so it's hard to know the real price.

**Why it's hard:**
- Prices change often and differ by country and currency.
- The page is built by JavaScript.
- Different prices for different sizes and colors.

**Ideas:**
- Product ID is probably the number in the URL (something like `-p-12345678.html`).
- Save the currency with every price so US and other prices don't get mixed.
- Track per color, since each color is often its own product.

---

## TikTok Shop

**Why it's worth it:** Very common to see big crossed-out "original" prices, and lots of impulse buying.

**Why it's hard:**
- Most shopping happens inside the **phone app**, and a browser extension can't see inside apps.
- Web pages exist on `shop.tiktok.com`, but TikTok says the web version may differ from the app, and it's unclear whether you can buy on desktop.

**Ideas:**
- First test: open a TikTok Shop product on a laptop and see if True Cost already picks up a price.
- If the web pages work, treat it like any other store.
- Bigger dream: a separate phone app or a share-a-link feature ("paste a TikTok Shop link, see its price history"), which would need the shared database from [big-features.md](big-features.md).

---

## AliExpress

**Why it's worth it:** A famous pattern of raising prices right before big sales (11.11, Black Friday) and then "discounting" them.

**Why it's hard:**
- The same item is sold by many different sellers at different prices.
- Prices depend on the variant (color/size), shipping country and currency.
- "Choice" items and coupons change the final price.
- The page is built by JavaScript.

**Ideas:**
- Product ID is probably the number in `/item/123456789.html`.
- Save variant, currency and ship-to country with each price.
- Show "price before the sale event vs. during" since that's the usual trick.

---

## Shared tasks for all four

- [ ] Code that waits for JavaScript-built pages to finish loading before reading the price
- [ ] Save currency and country with every price
- [ ] Track the price per size/color
- [ ] Never send automated requests to these sites. Only read what the user is already viewing.
