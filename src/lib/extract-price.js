// Finds the product's current price (and any "was" / list price the store claims)
// on the page. Runs inside the web page as a content script.
//
// Strategy, from most to least reliable:
//   1. JSON-LD structured data (schema.org "Product"), which most big stores include for Google
//   2. <meta> tags such as product:price:amount / og:price:amount
//   3. (TODO) per-site CSS selectors for stores that have neither

/* exported extractProductInfo */
function extractProductInfo() {
  return fromJsonLd() || fromMetaTags() || null;
}

function fromJsonLd() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    let data;
    try {
      data = JSON.parse(script.textContent);
    } catch {
      continue;
    }
    const product = findProduct(data);
    if (!product) continue;

    const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
    if (!offer) continue;

    const price = parsePrice(offer.price ?? offer.lowPrice);
    if (price == null) continue;

    return {
      name: product.name || document.title,
      price,
      currency: offer.priceCurrency || null,
      // Some stores publish the "list"/"was" price they compare against.
      claimedOriginalPrice: parsePrice(
        offer.priceSpecification?.price ?? offer.highPrice ?? null
      ),
      source: "json-ld",
    };
  }
  return null;
}

// JSON-LD can be a single object, an array, or nested inside "@graph".
function findProduct(node) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findProduct(item);
      if (found) return found;
    }
    return null;
  }
  const type = node["@type"];
  if (type === "Product" || (Array.isArray(type) && type.includes("Product"))) {
    return node;
  }
  if (node["@graph"]) return findProduct(node["@graph"]);
  return null;
}

function fromMetaTags() {
  const get = (names) => {
    for (const n of names) {
      const el =
        document.querySelector(`meta[property="${n}"]`) ||
        document.querySelector(`meta[name="${n}"]`);
      if (el?.content) return el.content;
    }
    return null;
  };

  const price = parsePrice(get(["product:price:amount", "og:price:amount"]));
  if (price == null) return null;

  return {
    name: get(["og:title"]) || document.title,
    price,
    currency: get(["product:price:currency", "og:price:currency"]),
    claimedOriginalPrice: null,
    source: "meta",
  };
}

// "$1,299.99" -> 1299.99
function parsePrice(value) {
  if (value == null) return null;
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}
