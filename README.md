# True Cost

A browser extension that tracks product prices over time so you can see whether a
"70% off!" sale is real, or whether the store inflated the "original" price.

## Project layout

```
manifest.json                  Extension config: permissions, which scripts run where
src/
  lib/extract-price.js         Reads price + claimed "was" price from a product page
  content/content.js           Runs on each page; sends the price to the background worker
  background/service-worker.js Stores price history in chrome.storage.local
  popup/                       The window that opens when you click the extension icon
    popup.html / popup.css / popup.js
```

How data flows: **page → content script → background worker (saves) → popup (reads & compares)**.

## Run it locally (Chrome / Edge / Brave)

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and choose this folder
4. Visit a product page, then click the True Cost icon in the toolbar

After editing code, click the reload ↻ icon on the extension's card in `chrome://extensions`.

## Limitations / roadmap

- History only starts when *you* first visit a product. To know the price from when an
  item was first listed, we need outside data: e.g. a shared backend where users'
  extensions pool observations, or APIs like Keepa (Amazon).
- Price extraction uses structured data (JSON-LD / meta tags). Some stores need
  site-specific selectors.
- Ideas: price chart in the popup, badge on the icon when a "was" price looks fake,
  Firefox support.
