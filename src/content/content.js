// Runs on every page. If the page looks like a product, send its price to the
// background worker, which saves it to the price history.

(function () {
  const info = extractProductInfo(); // from src/lib/extract-price.js
  if (!info) return;

  chrome.runtime.sendMessage({
    type: "PRICE_SEEN",
    payload: { ...info, seenAt: Date.now() },
  });
})();
