// Popup shown when you click the extension icon. Looks up the current tab's
// product and compares today's price with what we've recorded before.

const content = document.getElementById("content");

(async function () {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const history = await chrome.runtime.sendMessage({ type: "GET_HISTORY", url: tab.url });

  if (!history || history.points.length === 0) {
    content.innerHTML = `<p>No price recorded for this page yet.</p>
      <p class="muted">Visit product pages and True Cost will start building their history.</p>`;
    return;
  }

  const points = history.points;
  const current = points[points.length - 1];
  const prices = points.map((p) => p.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const fmt = (n) => (n == null ? "—" : `${history.currency || "$"} ${n.toFixed(2)}`);

  // The key check: is the store's "original" price higher than anything we've actually seen?
  let verdict = "";
  if (current.claimedOriginalPrice && current.claimedOriginalPrice > highest) {
    verdict = `<div class="verdict warn">Store claims it was ${fmt(current.claimedOriginalPrice)},
      but the highest price we've seen is ${fmt(highest)}.</div>`;
  } else if (current.price <= lowest) {
    verdict = `<div class="verdict good">Lowest price we've recorded.</div>`;
  }

  content.innerHTML = `
    <p><strong>${escapeHtml(history.name)}</strong></p>
    <div class="row"><span>Current</span><span>${fmt(current.price)}</span></div>
    <div class="row"><span>First seen</span><span>${fmt(history.firstSeen.price)}</span></div>
    <div class="row"><span>Lowest seen</span><span>${fmt(lowest)}</span></div>
    <div class="row"><span>Highest seen</span><span>${fmt(highest)}</span></div>
    <div class="row"><span>Store's "was" price</span><span>${fmt(current.claimedOriginalPrice)}</span></div>
    ${verdict}
    <p class="muted">Tracking since ${new Date(history.firstSeen.at).toLocaleDateString()} · ${points.length} data points</p>
  `;
})();

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
