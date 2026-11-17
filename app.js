const app = document.querySelector("#app");
let products = [];
let selectedSize = "";
const money = (n) => "₹" + n.toLocaleString("en-IN");
const getCart = () => JSON.parse(localStorage.getItem("kickora_cart") || "[]");
const saveCart = (c) => {
  localStorage.setItem("kickora_cart", JSON.stringify(c));
  updateCount();
};
const updateCount = () =>
  (document.querySelector("#cartCount").textContent = getCart().reduce(
    (n, i) => n + i.qty,
    0,
  ));
const product = (id) => products.find((p) => p.id === Number(id));
const toast = (message) => {
  let el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2300);
};
function add(id, size, qty = 1) {
  const p = product(id);
  if (!p) return;
  if (!size) {
    toast("Please select a size first");
    return;
  }
  let cart = getCart(),
    row = cart.find((x) => x.id === p.id && x.size === size);
  if (row) row.qty += qty;
  else cart.push({ id: p.id, size, qty });
  saveCart(cart);
  toast("Added to cart!");
}
function card(p) {
  return `<article class="product"><a class="product-img" href="#/product/${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="tag">NEW</span></a><div class="product-body"><h3>${p.name}</h3><p>${p.category} · ${p.color}</p><div class="rating">★★★★★ <span style="color:#777">${p.rating}</span></div><div class="product-bottom"><span class="price">${money(p.price)}</span><a class="smallbtn" href="#/product/${p.id}">VIEW →</a></div></div></article>`;
}
function home() {
  app.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow">NEW SEASON / NEW ENERGY</div><h1>STEP UP<br>YOUR STYLE.</h1><p>Fresh sneakers. Timeless streetwear.<br>Find your next everyday essential.</p><p><a class="btn" href="#/shop">SHOP NOW →</a><a class="btn btn-outline" href="#/shop?category=Sneakers">EXPLORE SNEAKERS</a></p></div></section><section class="perks"><div>♧ FREE SHIPPING<small>Orders over ₹2,999</small></div><div>↻ EASY RETURNS<small>30-day return policy</small></div><div>◇ QUALITY FIRST<small>Carefully curated styles</small></div><div>☏ CUSTOMER SUPPORT<small>We're here to help</small></div></section><section class="container"><div class="sectionhead"><h2>SHOP BY CATEGORY</h2><a class="textlink" href="#/shop">VIEW ALL →</a></div><div class="categories"><a class="category" href="#/shop?category=Sneakers"><img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" alt="Sneakers"><div>SNEAKERS<small>Shop now →</small></div></a><a class="category" href="#/shop?category=Clothing"><img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" alt="Hoodies"><div>HOODIES<small>Shop now →</small></div></a><a class="category" href="#/shop?category=Clothing"><img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" alt="Streetwear"><div>STREETWEAR<small>Shop now →</small></div></a></div></section><section class="container"><div class="sectionhead"><h2>FEATURED DROPS</h2><a class="textlink" href="#/shop">VIEW ALL PRODUCTS →</a></div><div class="products">${products.slice(0, 4).map(card).join("")}</div></section><section class="container promo"><div class="promo-box"><span class="eyebrow">LIMITED TIME OFFER</span><h2>FRESH FITS. BETTER PRICES.</h2><a class="btn" href="#/shop">SHOP THE COLLECTION →</a></div><div class="promo-box"><span class="eyebrow">EXCLUSIVE COLLECTION</span><h2>NEW DROPS EVERY WEEK</h2><a class="btn btn-dark" href="#/shop">EXPLORE NOW →</a></div></section><section class="container"><div class="sectionhead"><h2>MORE TO EXPLORE</h2></div><div class="products">${products.slice(4).map(card).join("")}</div></section>`;
}
function shop() {
  let params = new URLSearchParams(location.hash.split("?")[1] || "");
  app.innerHTML = `<section class="container"><h1 class="page-title">SHOP ALL PRODUCTS</h1><p>Discover your next favorite fit.</p><div class="toolbar"><input id="filterSearch" placeholder="Search products..." aria-label="Search"><select id="filterCategory" aria-label="Category"><option value="All">All categories</option><option>Sneakers</option><option>Clothing</option></select><select id="sort" aria-label="Sort"><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="name">Name A–Z</option></select></div><p id="resultCount"></p><div class="products" id="shopGrid"></div></section>`;
  document.querySelector("#filterCategory").value =
    params.get("category") || "All";
  const render = () => {
    let q = document.querySelector("#filterSearch").value.toLowerCase(),
      cat = document.querySelector("#filterCategory").value,
      sort = document.querySelector("#sort").value;
    let arr = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        p.name.toLowerCase().includes(q),
    );
    if (sort === "low") arr.sort((a, b) => a.price - b.price);
    if (sort === "high") arr.sort((a, b) => b.price - a.price);
    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    document.querySelector("#resultCount").textContent =
      arr.length + " products";
    document.querySelector("#shopGrid").innerHTML = arr.length
      ? arr.map(card).join("")
      : "<p>No products found.</p>";
  };
  ["filterSearch", "filterCategory", "sort"].forEach((id) =>
    document
      .getElementById(id)
      .addEventListener(id === "filterSearch" ? "input" : "change", render),
  );
  render();
}
function detail(id) {
  let p = product(id);
  if (!p) {
    app.innerHTML =
      '<section class="container">Product not found. <a href="#/shop">Back to shop</a></section>';
    return;
  }
  selectedSize = "";
  app.innerHTML = `<section class="container"><p><a href="#/shop">Shop</a> / ${p.category} / ${p.name}</p><div class="detail"><img class="detail-img" src="${p.image}" alt="${p.name}"><div><span class="eyebrow">NEW ARRIVAL</span><h1>${p.name}</h1><div class="rating">★★★★★ ${p.rating} / 5</div><div class="price">${money(p.price)}</div><p>Designed for everyday comfort and standout style. Premium-inspired details, versatile fit and a clean modern look.</p><hr style="border:0;border-top:1px solid #eee"><p><strong>Color:</strong> ${p.color}</p><p><strong>Select size:</strong> <span id="chosenSize">None</span></p><div class="sizes">${p.sizes.map((s) => `<button class="size" data-size="${s}">${s}</button>`).join("")}</div><div class="detail-actions"><input type="number" id="detailQty" value="1" min="1" max="10" aria-label="Quantity"><button class="btn btn-dark" id="addToCart">♧ ADD TO CART</button></div><p>✓ Easy returns &nbsp; ✓ Secure demo checkout &nbsp; ✓ Free shipping over ₹2,999</p></div></div></section><section class="container"><div class="sectionhead"><h2>YOU MAY ALSO LIKE</h2><a href="#/shop">VIEW ALL →</a></div><div class="products">${products
    .filter((x) => x.id !== p.id)
    .slice(0, 4)
    .map(card)
    .join("")}</div></section>`;
  document.querySelectorAll(".size").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll(".size")
          .forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        selectedSize = b.dataset.size;
        document.querySelector("#chosenSize").textContent = selectedSize;
      }),
  );
  document.querySelector("#addToCart").onclick = () =>
    add(
      p.id,
      selectedSize,
      Math.max(
        1,
        Math.min(10, Number(document.querySelector("#detailQty").value) || 1),
      ),
    );
}
function totals() {
  let subtotal = getCart().reduce(
    (s, x) => s + (product(x.id)?.price || 0) * x.qty,
    0,
  );
  return {
    subtotal,
    shipping: subtotal >= 2999 || subtotal === 0 ? 0 : 99,
    total: subtotal + (subtotal >= 2999 || subtotal === 0 ? 0 : 99),
  };
}
function summary(checkout = false) {
  let t = totals();
  return `<aside class="summary"><h2>ORDER SUMMARY</h2><div class="summary-line"><span>Subtotal</span><b>${money(t.subtotal)}</b></div><div class="summary-line"><span>Shipping</span><b>${t.shipping ? money(t.shipping) : "FREE"}</b></div><hr><div class="summary-line"><strong>Total</strong><strong>${money(t.total)}</strong></div>${checkout ? "" : `<a class="btn btn-dark" href="#/checkout">PROCEED TO CHECKOUT →</a>`}</aside>`;
}
function cart() {
  let c = getCart();
  if (!c.length) {
    app.innerHTML =
      '<section class="empty"><h2>YOUR CART IS EMPTY</h2><p>Great style starts with a great find.</p><a class="btn btn-dark" href="#/shop">CONTINUE SHOPPING</a></section>';
    return;
  }
  app.innerHTML = `<section class="container"><h1 class="page-title">YOUR SHOPPING CART</h1><div class="cart-layout"><div>${c
    .map((x, i) => {
      let p = product(x.id);
      return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>Size: ${x.size}</p><p>${money(p.price)} each</p><button class="smallbtn" data-remove="${i}">Remove</button></div><div><strong>${money(p.price * x.qty)}</strong><p><input class="qty" data-qty="${i}" type="number" min="1" max="10" value="${x.qty}" aria-label="Quantity for ${p.name}"></p></div></div>`;
    })
    .join("")}</div>${summary()}</div></section>`;
  document.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        let a = getCart();
        a.splice(Number(b.dataset.remove), 1);
        saveCart(a);
        cart();
      }),
  );
  document.querySelectorAll("[data-qty]").forEach(
    (input) =>
      (input.onchange = () => {
        let a = getCart();
        a[Number(input.dataset.qty)].qty = Math.max(
          1,
          Math.min(10, Number(input.value) || 1),
        );
        saveCart(a);
        cart();
      }),
  );
}
function checkout() {
  if (!getCart().length) {
    location.hash = "#/cart";
    return;
  }
  app.innerHTML = `<section class="container"><h1 class="page-title">CHECKOUT</h1><div class="checkout-layout"><form id="checkoutForm" novalidate><h2>SHIPPING DETAILS</h2><div class="formgrid"><label class="field">Full name<input name="name" required minlength="3" autocomplete="name"></label><label class="field">Email<input name="email" type="email" required autocomplete="email"></label></div><div class="formgrid"><label class="field">Phone number<input name="phone" inputmode="numeric" required pattern="[0-9]{10}" placeholder="10-digit mobile"></label><label class="field">PIN code<input name="pin" inputmode="numeric" required pattern="[0-9]{6}" placeholder="6-digit PIN"></label></div><label class="field">Street address<input name="address" required minlength="8" autocomplete="street-address"></label><div class="formgrid"><label class="field">City<input name="city" required></label><label class="field">State<input name="state" required></label></div><h2>PAYMENT METHOD</h2><label class="field">Payment<select name="payment"><option value="cod">Cash on Delivery (demo)</option><option value="upi">UPI (simulated — no payment)</option></select></label><p class="error" id="formError" role="alert"></p><button class="btn btn-dark" type="submit">PLACE DEMO ORDER →</button><p style="font-size:12px;color:#777">This is an academic demo. No payment is collected and order details are not sent to a server.</p></form>${summary(true)}</div></section>`;
  document.querySelector("#checkoutForm").onsubmit = (e) => {
    e.preventDefault();
    let f = e.currentTarget,
      values = Object.fromEntries(new FormData(f));
    let error = "";
    if (values.name.trim().length < 3)
      error = "Enter your full name (at least 3 characters).";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      error = "Enter a valid email address.";
    else if (!/^[0-9]{10}$/.test(values.phone))
      error = "Enter a valid 10-digit phone number.";
    else if (!/^[0-9]{6}$/.test(values.pin))
      error = "Enter a valid 6-digit PIN code.";
    else if (
      values.address.trim().length < 8 ||
      !values.city.trim() ||
      !values.state.trim()
    )
      error = "Complete your shipping address.";
    if (error) {
      document.querySelector("#formError").textContent = error;
      return;
    }
    let order = {
      number: "KO" + Date.now().toString().slice(-8),
      total: totals().total,
      name: values.name.trim(),
    };
    sessionStorage.setItem("kickora_last_order", JSON.stringify(order));
    saveCart([]);
    location.hash = "#/success";
  };
}
function success() {
  let order = JSON.parse(
    sessionStorage.getItem("kickora_last_order") || "null",
  );
  app.innerHTML = `<section class="empty"><div style="font-size:60px">✓</div><h2>ORDER PLACED!</h2><p>${order ? `Thanks, ${order.name.replace(/[<>&"']/g, "")}! Your demo order <strong>${order.number}</strong> for <strong>${money(order.total)}</strong> is confirmed.` : "Your demo checkout is complete."}</p><p>No real payment or shipment will take place.</p><a class="btn btn-dark" href="#/shop">KEEP SHOPPING →</a></section>`;
}
function route() {
  document.querySelector("nav").classList.remove("open");
  let path = location.hash.slice(1).split("?")[0] || "/";
  if (path === "/") home();
  else if (path === "/shop") shop();
  else if (path.startsWith("/product/")) detail(path.split("/")[2]);
  else if (path === "/cart") cart();
  else if (path === "/checkout") checkout();
  else if (path === "/success") success();
  else
    app.innerHTML =
      '<section class="empty"><h2>PAGE NOT FOUND</h2><a href="#/">GO HOME</a></section>';
  updateCount();
  window.scrollTo(0, 0);
}
document.querySelector("#menuToggle").onclick = () =>
  document.querySelector("nav").classList.toggle("open");
document.querySelector("#searchToggle").onclick = () => {
  document.querySelector("#searchBar").classList.toggle("hidden");
  document.querySelector("#globalSearch").focus();
};
document.querySelector("#globalSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    location.hash = "#/shop";
    setTimeout(() => {
      let input = document.querySelector("#filterSearch");
      if (input) {
        input.value = e.target.value;
        input.dispatchEvent(new Event("input"));
      }
    }, 30);
  }
});
window.addEventListener("hashchange", route);
async function init() {
  try {
    let response = await fetch("products.json");
    if (!response.ok) throw Error("Could not load products");
    products = await response.json();
    route();
  } catch (e) {
    app.innerHTML =
      '<section class="empty"><h2>PRODUCTS COULD NOT LOAD</h2><p>Please run this project with VS Code Live Server (not file://).</p></section>';
    console.error(e);
  }
}
init();
