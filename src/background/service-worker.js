// Background service worker: owns the price-history database.
//
// Storage shape (chrome.storage.local):
//   "history:<url>" -> {
//     name, currency,
//     firstSeen: { price, at },
//     points: [{ price, claimedOriginalPrice, at }, ...]
//   }

const MIN_GAP_MS = 6 * 60 * 60 * 1000; // record at most one point every 6h per product, unless price changed

// Products are keyed by the tab URL without query string or #hash
// (strips most tracking params), so the popup can look up the same key.
function productKey(rawUrl) {
  const url = new URL(rawUrl);
  url.search = "";
  url.hash = "";
  return url.toString();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PRICE_SEEN") {
    const url = productKey(sender.tab.url);
    recordPrice({ ...msg.payload, url }).then(() => sendResponse({ ok: true }));
    return true; // keep the channel open for the async response
  }
  if (msg.type === "GET_HISTORY") {
    getHistory(productKey(msg.url)).then(sendResponse);
    return true;
  }
});

async function recordPrice({ url, name, price, currency, claimedOriginalPrice, seenAt }) {
  const key = `history:${url}`;
  const { [key]: existing } = await chrome.storage.local.get(key);

  const entry = existing || {
    name,
    currency,
    firstSeen: { price, at: seenAt },
    points: [],
  };

  const last = entry.points[entry.points.length - 1];
  const priceChanged = !last || last.price !== price;
  const longEnough = !last || seenAt - last.at > MIN_GAP_MS;

  if (priceChanged || longEnough) {
    entry.points.push({ price, claimedOriginalPrice, at: seenAt });
    entry.name = name;
    await chrome.storage.local.set({ [key]: entry });
  }
}

async function getHistory(url) {
  const key = `history:${url}`;
  const { [key]: entry } = await chrome.storage.local.get(key);
  return entry || null;
}
