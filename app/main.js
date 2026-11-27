import { deals, CHECKED_AT } from "./data.js";

const $ = (s) => document.querySelector(s);
const grid = $("#grid");
const detail = $("#detail");
const countEl = $("#count");
const qEl = $("#q");
const storeEl = $("#store");
const minoffEl = $("#minoff");
const sortEl = $("#sort");
const lowsEl = $("#lows");
const catsEl = $("#cats");

const money = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const pct = (d) => Math.round((1 - d.price / d.was) * 100);
const saved = (d) => d.was - d.price;

function verdict(d) {
  const p = pct(d);
  if (d.low) return { cls: "v-low", label: "NEW LOW", why: "Lowest price ever recorded for this model, confirmed by the source." };
  if (p >= 40) return { cls: "v-strong", label: "STRONG DEAL", why: p + "% off — a deep, genuine cut." };
  if (p >= 20) return { cls: "v-solid", label: "SOLID DEAL", why: p + "% off — a real saving, not a sticker trick." };
  return { cls: "v-routine", label: "ROUTINE SALE", why: "Only " + p + "% off — a real cut, but a small one. Buy it if you need it now." };
}

function checkedLine(d) {
  const t = new Date(d.checked);
  const s = t.toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false,
  });
  return "Checked " + s + " UTC · Source: " + d.source;
}

// ---- stats bar ----
(function stats() {
  const totalSave = deals.reduce((a, d) => a + saved(d), 0);
  const avgOff = Math.round(deals.reduce((a, d) => a + pct(d), 0) / deals.length);
  const lows = deals.filter((d) => d.low).length;
  const stores = new Set(deals.map((d) => d.store)).size;
  $("#stats").innerHTML = [
    [deals.length, "verified deals"],
    [lows, "new all-time lows"],
    [avgOff + "%", "average discount"],
    [money(totalSave), "total savings if you bought them all"],
    [stores, "stores"],
  ].map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join("");
})();

// ---- filter controls ----
const categories = [...new Set(deals.map((d) => d.category))].sort();
const stores = [...new Set(deals.map((d) => d.store))].sort();
let activeCat = "";
catsEl.innerHTML = ["", ...categories].map((c) =>
  `<button class="chip" data-cat="${c}" aria-pressed="${c === ""}">${c || "All categories"}</button>`).join("");
storeEl.innerHTML = `<option value="">All stores</option>` +
  stores.map((s) => `<option>${s}</option>`).join("");
catsEl.addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  activeCat = b.dataset.cat;
  catsEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
  render();
});

function filtered() {
  const q = qEl.value.trim().toLowerCase();
  const min = Number(minoffEl.value);
  let list = deals.filter((d) =>
    (!activeCat || d.category === activeCat) &&
    (!storeEl.value || d.store === storeEl.value) &&
    pct(d) >= min &&
    (!lowsEl.checked || d.low) &&
    (!q || (d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)));
  const s = sortEl.value;
  list = [...list].sort((a, b) =>
    s === "off" ? pct(b) - pct(a) || saved(b) - saved(a)
    : s === "save" ? saved(b) - saved(a)
    : s === "price" ? a.price - b.price
    : b.price - a.price);
  return list;
}

function card(d) {
  const v = verdict(d);
  return `<article class="card">
    <span class="v ${v.cls}" title="${v.why}">${v.label}</span>
    <h3><a href="#/deal/${d.id}">${d.title}</a></h3>
    <p class="meta">${d.store} &middot; ${d.category}</p>
    <p class="price-row"><span class="price">${money(d.price)}</span>
      <span class="was">${money(d.was)}</span>
      <span class="save">Save ${money(saved(d))} (${pct(d)}%)</span></p>
    <p class="blurb">${d.blurb}</p>
    <p class="checked">${checkedLine(d)}</p>
    <a class="shop" href="${d.url}" target="_blank" rel="noopener">View at ${d.store} &rarr;</a>
  </article>`;
}

function render() {
  const list = filtered();
  countEl.textContent = list.length === deals.length
    ? `Showing all ${deals.length} verified deals — sorted by ${sortEl.selectedOptions[0].text.toLowerCase()}.`
    : `Showing ${list.length} of ${deals.length} deals.`;
  grid.innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="empty"><strong>No deals match.</strong><br>Try clearing the search or lowering the discount filter.</div>`;
}

function showDetail(id) {
  const d = deals.find((x) => x.id === id);
  if (!d) { detail.hidden = true; grid.hidden = false; countEl.hidden = false; return; }
  const v = verdict(d);
  grid.hidden = true;
  countEl.hidden = true;
  detail.hidden = false;
  detail.innerHTML = `
    <a class="back" href="#/">&larr; All deals</a>
    <h2>${d.title}</h2>
    <p><span class="v ${v.cls}">${v.label}</span></p>
    <p class="price-row"><span class="price">${money(d.price)}</span>
      <span class="was">${money(d.was)}</span>
      <span class="save">Save ${money(saved(d))} (${pct(d)}%)</span></p>
    <p>${d.blurb}</p>
    <dl>
      <dt>Store</dt><dd>${d.store}</dd>
      <dt>Category</dt><dd>${d.category}</dd>
      <dt>Why it is really a deal</dt><dd>${v.why}</dd>
      <dt>Price checked</dt><dd>${checkedLine(d)}</dd>
      <dt>Store link</dt><dd><a href="${d.url}" target="_blank" rel="noopener">Open the live listing at ${d.store} &rarr;</a></dd>
    </dl>
    <a class="shop" href="${d.url}" target="_blank" rel="noopener">View at ${d.store} &rarr;</a>`;
  window.scrollTo(0, 0);
}

function route() {
  const m = location.hash.match(/^#\/deal\/([\w-]+)$/);
  if (m) showDetail(m[1]);
  else { detail.hidden = true; grid.hidden = false; countEl.hidden = false; render(); }
}

[qEl, storeEl, minoffEl, sortEl, lowsEl].forEach((el) =>
  el.addEventListener("input", () => { if (!detail.hidden) location.hash = "#/"; render(); }));
window.addEventListener("hashchange", route);

// Screenshot staging: ?shot=lows shows only the new lows; ?shot=deal opens
// the featured deal page. Both are plain renders of the site's own code.
const shot = new URLSearchParams(location.search).get("shot");
if (shot === "lows") { lowsEl.checked = true; sortEl.value = "off"; }
if (shot === "deal") { location.hash = "#/deal/airpods-pro-3"; }
route();
