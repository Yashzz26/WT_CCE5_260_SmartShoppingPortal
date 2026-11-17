const app = document.querySelector("#app");
const storageKeys = { cart: "kickora_cart", wishlist: "kickora_wishlist", order: "kickora_last_order" };
const state = { products: [], cart: [], wishlist: [], shopLimit: 12, chatReady: false };
const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
const iconPaths = {
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
  heart: '<path d="M20.8 8.6c0 5.4-8.8 10.1-8.8 10.1S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.5Z"></path>',
  bag: '<path d="M5 8h14l1 13H4L5 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"></path>',
  close: '<path d="m6 6 12 12M18 6 6 18"></path>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"></path>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"></path>',
  plus: '<path d="M12 5v14M5 12h14"></path>',
  minus: '<path d="M5 12h14"></path>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"></path>',
  check: '<path d="m5 12 4 4L19 6"></path>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM19 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>',
  shield: '<path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"></path><path d="m9 12 2 2 4-4"></path>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="5"></rect><circle cx="12" cy="12" r="3"></circle><path d="M17.5 6.5h.01"></path>',
  x: '<path d="m5 5 14 14M19 5 5 19"></path>',
};
const icon = (name) => `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.arrow}</svg>`;
const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
document.querySelectorAll("[data-icon]").forEach((element) => {
  element.innerHTML = icon(element.dataset.icon);
});
const readStorage = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};
const product = (id) => state.products.find((item) => item.id === Number(id));
const selectedCount = () => state.cart.reduce((total, item) => total + item.qty, 0);
const saveState = () => {
  localStorage.setItem(storageKeys.cart, JSON.stringify(state.cart));
  localStorage.setItem(storageKeys.wishlist, JSON.stringify(state.wishlist));
  updateBadges();
};
const toast = (message, type = "success") => {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.dataset.type = type;
  element.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => element.classList.remove("show"), 2800);
};
const updateBadges = () => {
  document.querySelector("[data-cart-count]").textContent = selectedCount();
  document.querySelector("[data-wishlist-count]").textContent = state.wishlist.length;
};
const discount = (item) => item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
const isWishlisted = (id) => state.wishlist.includes(Number(id));
const addToCart = (id, size, color, quantity = 1) => {
  const item = product(id);
  if (!item) return;
  const chosenSize = size || item.sizes?.[0];
  if (!chosenSize) {
    toast("Please select a size first", "error");
    return;
  }
  const variant = state.cart.find((entry) => entry.id === item.id && entry.size === String(chosenSize) && entry.color === (color || item.colors?.[0]));
  const safeQty = Math.max(1, Math.min(10, Number(quantity) || 1));
  if (variant) variant.qty = Math.min(10, variant.qty + safeQty);
  else state.cart.push({ id: item.id, size: String(chosenSize), color: color || item.colors?.[0] || "", qty: safeQty });
  saveState();
  toast(`${item.name} added to bag`);
};
const toggleWishlist = (id) => {
  const numberId = Number(id);
  if (isWishlisted(numberId)) {
    state.wishlist = state.wishlist.filter((item) => item !== numberId);
    toast("Removed from wishlist");
  } else {
    state.wishlist.push(numberId);
    toast("Added to wishlist");
  }
  saveState();
};
const cartTotals = () => {
  const subtotal = state.cart.reduce((total, entry) => total + (product(entry.id)?.price || 0) * entry.qty, 0);
  const discountTotal = state.cart.reduce((total, entry) => {
    const item = product(entry.id);
    return total + (item?.originalPrice ? item.originalPrice - item.price : 0) * entry.qty;
  }, 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  return { subtotal, discount: discountTotal, shipping, total: subtotal + shipping };
};
const productCard = (item) => `
  <article class="product-card">
    <div class="product-image-wrap">
      <a class="product-image" href="/product/${item.id}" data-link>
        <img src="${safe(item.image)}" alt="${safe(item.name)}" loading="lazy" />
        ${item.newArrival ? '<span class="product-label">New</span>' : ""}
        ${discount(item) ? `<span class="discount-label">${discount(item)}% off</span>` : ""}
      </a>
      <button class="wishlist-button ${isWishlisted(item.id) ? "active" : ""}" data-action="wishlist" data-id="${item.id}" aria-label="${isWishlisted(item.id) ? "Remove from" : "Add to"} wishlist">
        ${icon("heart")}
      </button>
    </div>
    <div class="product-info">
      <p class="product-brand">${safe(item.brand)} · ${safe(item.category)}</p>
      <h3><a href="/product/${item.id}" data-link>${safe(item.name)}</a></h3>
      <div class="product-rating">${"★".repeat(Math.round(item.rating))}<span>${item.rating} (${item.reviews})</span></div>
      <div class="product-meta"><div><strong>${money(item.price)}</strong>${item.originalPrice ? `<del>${money(item.originalPrice)}</del>` : ""}</div>
        <button class="text-button" data-action="add-card" data-id="${item.id}">Add to bag ${icon("arrow")}</button>
      </div>
    </div>
  </article>`;
const productGrid = (items) => items.length ? items.map(productCard).join("") : '<div class="empty-state"><span class="empty-icon">' + icon("search") + '</span><h2>No products found</h2><p>Try a different search or clear your filters.</p></div>';
const pageIntro = (eyebrow, title, copy) => `<div class="page-intro"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${copy}</p></div>`;
const benefits = () => `<section class="benefits"><div><span class="feature-icon">${icon("truck")}</span><strong>Free shipping</strong><small>On orders over ₹999</small></div><div><span class="feature-icon">${icon("arrow")}</span><strong>Easy returns</strong><small>30-day return policy</small></div><div><span class="feature-icon">${icon("shield")}</span><strong>Authentic products</strong><small>Curated for quality</small></div><div><span class="feature-icon">${icon("mail")}</span><strong>Customer support</strong><small>We are here to help</small></div></section>`;
const renderHome = () => {
  const featured = state.products.filter((item) => item.featured).slice(0, 8);
  const categories = ["Running", "Lifestyle", "Basketball", "Training", "Skateboarding", "Streetwear"];
  app.innerHTML = `
    <section class="hero"><div class="hero-content"><p class="eyebrow">New season / New energy</p><h1>STEP UP<br />YOUR STYLE</h1><p>Discover the latest sneakers and streetwear designed for comfort and confidence.</p><div class="hero-actions"><a class="btn" href="/shop" data-link>Shop now ${icon("arrow")}</a><a class="btn btn-light" href="/collections" data-link>Explore collection</a></div></div><div class="hero-image"></div></section>
    ${benefits()}
    <section class="section container"><div class="section-heading"><div><p class="eyebrow">Find your lane</p><h2>Shop by category</h2></div><a class="text-link" href="/shop" data-link>View all ${icon("arrow")}</a></div><div class="category-grid">${categories.map((category, index) => `<a class="category-tile category-${index + 1}" href="/shop?category=${category}" data-link><span>${category}</span><small>Shop now ${icon("arrow")}</small></a>`).join("")}</div></section>
    <section class="section section-muted"><div class="container"><div class="section-heading"><div><p class="eyebrow">The latest rotation</p><h2>Featured products</h2></div><a class="text-link" href="/shop" data-link>Shop all ${icon("arrow")}</a></div><div class="product-grid">${productGrid(featured)}</div></div></section>
    <section class="promo-grid container"><a class="promo-card promo-sale" href="/sale" data-link><p class="eyebrow">Limited time sale</p><h2>Fresh fits.<br />Better prices.</h2><span class="btn btn-light">Shop sale ${icon("arrow")}</span></a><a class="promo-card promo-new" href="/new-arrivals" data-link><p class="eyebrow">Exclusive collection</p><h2>New drops<br />every week.</h2><span class="btn btn-dark">Explore now ${icon("arrow")}</span></a></section>
    <section class="brand-strip"><div class="container"><p class="eyebrow">Made for your rotation</p><div><span>RUN CLUB</span><span>COURT LINE</span><span>STREET LAB</span><span>EVERYDAY CO.</span><span>FORM / FUNCTION</span></div></div></section>`;
};
const filteredProducts = (query, source = state.products) => {
  const search = (query.get("q") || "").trim().toLowerCase();
  const category = query.get("category") || "All";
  const gender = query.get("gender") || "All";
  const brand = query.get("brand") || "All";
  const newOnly = query.get("new") === "true";
  const saleOnly = query.get("sale") === "true";
  const maxPrice = Number(query.get("max") || 5000);
  const minPrice = Number(query.get("min") || 0);
  const sort = query.get("sort") || "featured";
  let items = source.filter((item) => {
    const searchable = `${item.name} ${item.brand} ${item.category} ${item.description}`.toLowerCase();
    return (!search || searchable.includes(search)) && (category === "All" || item.category === category) && (gender === "All" || item.gender === gender || item.gender === "Unisex") && (brand === "All" || item.brand === brand) && (!newOnly || item.newArrival) && (!saleOnly || item.originalPrice > item.price) && item.price >= minPrice && item.price <= maxPrice;
  });
  if (sort === "price-low") items.sort((a, b) => a.price - b.price);
  if (sort === "price-high") items.sort((a, b) => b.price - a.price);
  if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
  if (sort === "newest") items.sort((a, b) => Number(b.newArrival) - Number(a.newArrival) || b.id - a.id);
  return items;
};
const filterOptions = (query) => {
  const categories = ["All", ...new Set(state.products.map((item) => item.category))];
  const brands = ["All", ...new Set(state.products.map((item) => item.brand))];
  return `<div class="filter-row"><label>Search<input data-filter="q" value="${safe(query.get("q") || "")}" placeholder="Search products..." /></label><label>Category<select data-filter="category">${categories.map((item) => `<option ${item === (query.get("category") || "All") ? "selected" : ""}>${item}</option>`).join("")}</select></label><label>Gender<select data-filter="gender">${["All", "Men", "Women", "Unisex"].map((item) => `<option ${item === (query.get("gender") || "All") ? "selected" : ""}>${item}</option>`).join("")}</select></label><label>Brand<select data-filter="brand">${brands.map((item) => `<option ${item === (query.get("brand") || "All") ? "selected" : ""}>${item}</option>`).join("")}</select></label><label>Sort<select data-filter="sort"><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top rated</option><option value="newest">Newest</option></select></label><button class="text-button clear-filters" data-action="clear-filters">Clear all</button></div>`;
};
const renderShop = (query, title = "Shop all products", copy = "Build your everyday rotation with premium sneakers and streetwear.") => {
  const items = filteredProducts(query);
  app.innerHTML = `<section class="container shop-page">${pageIntro("The KICKORA edit", title, copy)}${filterOptions(query)}<div class="catalog-toolbar"><span>${items.length} products</span><span>Showing ${Math.min(state.shopLimit, items.length)} of ${items.length}</span></div><div class="product-grid">${productGrid(items.slice(0, state.shopLimit))}</div>${items.length > state.shopLimit ? '<button class="btn btn-outline-dark load-more" data-action="load-more">Load more products</button>' : ""}</section>`;
  const sort = app.querySelector('[data-filter="sort"]');
  if (sort) sort.value = query.get("sort") || "featured";
};
const renderSearch = (query) => renderShop(query, `Search results${query.get("q") ? ` for “${safe(query.get("q"))}”` : ""}`, "Find the pieces that fit your style.");
const renderProduct = (id) => {
  const item = product(id);
  if (!item) return renderNotFound("Product not found", "That product may have moved or is no longer available.");
  const gallery = item.images?.length ? item.images : [item.image];
  app.innerHTML = `<section class="container product-page"><div class="breadcrumbs"><a href="/shop" data-link>Shop</a><span>/</span><span>${safe(item.name)}</span></div><div class="product-detail"><div class="gallery"><div class="thumbs">${gallery.map((image, index) => `<button class="${index === 0 ? "active" : ""}" data-action="gallery" data-image="${safe(image)}"><img src="${safe(image)}" alt="${safe(item.name)} view ${index + 1}" /></button>`).join("")}</div><div class="main-product-image"><img src="${safe(gallery[0])}" alt="${safe(item.name)}" data-main-image /></div></div><div class="product-copy"><p class="product-brand">${safe(item.brand)} / ${safe(item.category)}</p><h1>${safe(item.name)}</h1><div class="product-rating large">${"★".repeat(Math.round(item.rating))}<span>${item.rating} · ${item.reviews} reviews</span></div><div class="detail-price"><strong>${money(item.price)}</strong>${item.originalPrice ? `<del>${money(item.originalPrice)}</del><span>${discount(item)}% off</span>` : ""}</div><p class="detail-description">${safe(item.description)}</p><div class="choice-group"><strong>Color</strong><div class="choice-list">${item.colors.map((color, index) => `<button class="choice color-choice ${index === 0 ? "selected" : ""}" data-choice-color="${safe(color)}">${safe(color)}</button>`).join("")}</div></div><div class="choice-group"><strong>Size <span class="muted" data-selected-size></span></strong><div class="choice-list">${item.sizes.map((size) => `<button class="choice size-choice" data-choice-size="${safe(size)}">${safe(size)}</button>`).join("")}</div></div><div class="buy-row"><div class="quantity-control"><button data-action="quantity" data-change="-1" aria-label="Decrease quantity">${icon("minus")}</button><span data-detail-quantity>1</span><button data-action="quantity" data-change="1" aria-label="Increase quantity">${icon("plus")}</button></div><button class="btn btn-dark grow" data-action="detail-add" data-id="${item.id}">Add to bag ${icon("bag")}</button><button class="icon-button detail-wishlist ${isWishlisted(item.id) ? "active" : ""}" data-action="wishlist" data-id="${item.id}" aria-label="Toggle wishlist">${icon("heart")}</button></div><div class="shipping-note"><span>${icon("truck")}</span><p><strong>Free delivery over ₹999</strong><br />Easy 30-day returns on unused items.</p></div></div></div><div class="detail-tabs"><button class="active">Description</button><button>Materials</button><button>Size & Fit</button><button>Shipping & Returns</button></div><div class="detail-tab-content"><p>${safe(item.description)} Crafted for regular wear with considered materials and an easy-to-style silhouette.</p><p><strong>Material:</strong> ${safe(item.material)}. <strong>Stock:</strong> ${item.stock} available.</p></div></section><section class="section container"><div class="section-heading"><div><p class="eyebrow">Complete the look</p><h2>You may also like</h2></div><a class="text-link" href="/shop" data-link>View all ${icon("arrow")}</a></div><div class="product-grid">${productGrid(state.products.filter((entry) => entry.id !== item.id).slice(0, 4))}</div></section>`;
};
const renderCart = () => {
  const totals = cartTotals();
  if (!state.cart.length) {
    app.innerHTML = `<section class="empty-state page-empty"><span class="empty-icon">${icon("bag")}</span><h1>Your bag is empty</h1><p>Great style starts with a great find.</p><a class="btn btn-dark" href="/shop" data-link>Continue shopping ${icon("arrow")}</a></section>`;
    return;
  }
  app.innerHTML = `<section class="container"><div class="page-intro compact"><p class="eyebrow">Your selection</p><h1>Shopping bag</h1></div><div class="cart-layout"><div class="cart-items">${state.cart.map((entry, index) => { const item = product(entry.id); return item ? `<article class="cart-item"><img src="${safe(item.image)}" alt="${safe(item.name)}" /><div class="cart-item-info"><p class="product-brand">${safe(item.brand)}</p><h2>${safe(item.name)}</h2><p>Color: ${safe(entry.color)} · Size: ${safe(entry.size)}</p><strong>${money(item.price)}</strong></div><div class="cart-item-actions"><div class="quantity-control"><button data-action="cart-quantity" data-index="${index}" data-change="-1" aria-label="Decrease quantity">${icon("minus")}</button><span>${entry.qty}</span><button data-action="cart-quantity" data-index="${index}" data-change="1" aria-label="Increase quantity">${icon("plus")}</button></div><button class="text-button danger" data-action="remove-cart" data-index="${index}">${icon("trash")} Remove</button></div></article>` : ""; }).join("")}<button class="text-button danger clear-cart" data-action="clear-cart">${icon("trash")} Clear bag</button></div>${summaryMarkup(totals)}</div></section>`;
};
const summaryMarkup = (totals, checkout = false) => `<aside class="summary-card"><h2>Order summary</h2><div><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>${totals.discount ? `<div class="saving"><span>Catalog savings</span><strong>-${money(totals.discount)}</strong></div>` : ""}<div><span>Shipping</span><strong>${totals.shipping ? money(totals.shipping) : "Free"}</strong></div><hr /><div class="summary-total"><span>Total</span><strong>${money(totals.total)}</strong></div>${checkout ? "" : `<a class="btn btn-dark full-width" href="/checkout" data-link>Proceed to checkout ${icon("arrow")}</a>`}</aside>`;
const renderWishlist = () => {
  const items = state.wishlist.map((id) => product(id)).filter(Boolean);
  app.innerHTML = `<section class="container"><div class="page-intro compact"><p class="eyebrow">Saved for later</p><h1>Wishlist</h1><p>${items.length} saved ${items.length === 1 ? "item" : "items"}</p></div>${items.length ? `<div class="product-grid">${productGrid(items)}</div>` : `<div class="empty-state"><span class="empty-icon">${icon("heart")}</span><h2>Your wishlist is waiting</h2><p>Save the pieces you want to come back to.</p><a class="btn btn-dark" href="/shop" data-link>Explore products ${icon("arrow")}</a></div>`}</section>`;
};
const renderCheckout = () => {
  if (!state.cart.length) return renderCart();
  app.innerHTML = `<section class="container checkout-page"><div class="page-intro compact"><p class="eyebrow">Almost there</p><h1>Checkout</h1><p>Demo checkout only. No payment is collected.</p></div><div class="checkout-layout"><form class="checkout-form" data-checkout-form><h2>Shipping details</h2><div class="form-grid"><label>Full name<input name="name" required minlength="3" autocomplete="name" /></label><label>Email address<input name="email" type="email" required autocomplete="email" /></label><label>Phone number<input name="phone" inputmode="numeric" pattern="[6-9][0-9]{9}" required placeholder="10-digit mobile" /></label><label>PIN code<input name="pin" inputmode="numeric" pattern="[0-9]{6}" required placeholder="6-digit PIN" /></label></div><label>Street address<input name="address" required minlength="8" autocomplete="street-address" /></label><div class="form-grid"><label>City<input name="city" required /></label><label>State<input name="state" required /></label></div><h2>Payment method</h2><div class="payment-options"><label><input type="radio" name="payment" value="cod" checked /> Cash on Delivery <small>Demo</small></label><label><input type="radio" name="payment" value="upi" /> UPI <small>Demo</small></label><label><input type="radio" name="payment" value="card" /> Card <small>Demo</small></label></div><p class="form-error" data-checkout-error></p><button class="btn btn-dark" type="submit">Place demo order ${icon("check")}</button></form>${summaryMarkup(cartTotals(), true)}</div></section>`;
};
const renderOrderSuccess = () => {
  const order = readStorage(storageKeys.order, null);
  app.innerHTML = `<section class="empty-state page-empty success-page"><span class="success-mark">${icon("check")}</span><p class="eyebrow">Thank you for shopping with KICKORA</p><h1>Order confirmed</h1><p>${order ? `Your demo order <strong>${safe(order.number)}</strong> for <strong>${money(order.total)}</strong> is confirmed.` : "Your demo checkout is complete."}</p><p>No real payment or shipment will take place.</p><a class="btn btn-dark" href="/shop" data-link>Continue shopping ${icon("arrow")}</a></section>`;
};
const renderCollections = () => {
  app.innerHTML = `<section class="collection-hero"><div class="container"><p class="eyebrow">Curated for the everyday</p><h1>The KICKORA collections</h1><p>Explore focused edits for every pace, place and personal style.</p></div></section><section class="section container collection-list">${["Running", "Lifestyle", "Streetwear", "Basketball"].map((category, index) => `<a class="collection-row collection-row-${index + 1}" href="/shop?category=${category}" data-link><div><p class="eyebrow">Collection 0${index + 1}</p><h2>${category}</h2><span class="text-link">Explore ${icon("arrow")}</span></div></a>`).join("")}</section>`;
};
const renderAbout = () => {
  app.innerHTML = `<section class="split-hero"><div class="split-image"></div><div class="split-copy"><p class="eyebrow">About KICKORA</p><h1>Built for the way you move.</h1><p>KICKORA is a college-built smart shopping experience for people who want everyday sneakers and streetwear that work harder and look better.</p><p>We keep the catalogue focused, the interface clear, and every interaction honest. This project is an academic demo: products, checkout and payments are simulated.</p><a class="btn btn-dark" href="/shop" data-link>Explore the edit ${icon("arrow")}</a></div></section>${benefits()}`;
};
const renderContact = () => {
  app.innerHTML = `<section class="container contact-page">${pageIntro("Need a hand?", "Contact KICKORA", "Our demo support team is ready to help with products, orders and project feedback.")}<div class="contact-grid"><div class="contact-card"><span class="feature-icon">${icon("mail")}</span><h2>Email us</h2><p>hello@kickora.demo</p><small>Replies are simulated for this academic project.</small></div><div class="contact-card"><span class="feature-icon">${icon("truck")}</span><h2>Shipping help</h2><p>Free over ₹999</p><small>Delivery and returns are demo policies.</small></div><form class="contact-card contact-form" data-contact-form><h2>Send a message</h2><label>Name<input name="name" required /></label><label>Email<input name="email" type="email" required /></label><label>Message<textarea name="message" rows="4" required></textarea></label><p class="form-message" data-contact-message></p><button class="btn btn-dark" type="submit">Send message ${icon("arrow")}</button></form></div></section>`;
};
const renderNotFound = (title = "Page not found", copy = "The page you are looking for does not exist.") => {
  app.innerHTML = `<section class="empty-state page-empty"><span class="empty-icon">${icon("search")}</span><h1>${safe(title)}</h1><p>${safe(copy)}</p><a class="btn btn-dark" href="/" data-link>Back to home ${icon("arrow")}</a></section>`;
};
const loadProducts = async () => {
  for (const path of ["data/products.json", "products.json"]) {
    try {
      const response = await fetch(path);
      if (response.ok) return response.json();
    } catch {
      continue;
    }
  }
  throw new Error("Could not load the product catalogue");
};
const renderRoute = ({ path, query }) => {
  document.querySelector("[data-nav]").classList.remove("open");
  document.querySelectorAll("[data-nav-route]").forEach((link) => link.classList.toggle("active", path === link.dataset.navRoute || (link.dataset.navRoute === "/shop" && ["/shop", "/search"].includes(path))));
  state.shopLimit = 12;
  if (path === "/") renderHome();
  else if (path === "/shop") renderShop(query);
  else if (path === "/search") renderSearch(query);
  else if (path === "/men") renderShop(new URLSearchParams({ gender: "Men" }), "Men's collection", "Performance and street essentials built for every day.");
  else if (path === "/women") renderShop(new URLSearchParams({ gender: "Women" }), "Women's collection", "A confident edit of sneakers and streetwear.");
  else if (path === "/new-arrivals") renderShop(new URLSearchParams({ sort: "newest" }), "New arrivals", "Fresh silhouettes and new-season layers.");
  else if (path === "/sale") renderShop(new URLSearchParams({ sort: "price-low", max: "3000" }), "The sale edit", "Better prices on pieces made to stay in rotation.");
  else if (path === "/collections") renderCollections();
  else if (path === "/product" || path.startsWith("/product/")) renderProduct(path.split("/")[2]);
  else if (path === "/cart") renderCart();
  else if (path === "/wishlist") renderWishlist();
  else if (path === "/checkout") renderCheckout();
  else if (path === "/order-success") renderOrderSuccess();
  else if (path === "/about") renderAbout();
  else if (path === "/contact") renderContact();
  else renderNotFound();
  updateBadges();
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.focus({ preventScroll: true });
};
const readFilters = () => {
  const params = new URLSearchParams();
  app.querySelectorAll("[data-filter]").forEach((field) => {
    if (field.value && field.value !== "All" && field.value !== "featured") params.set(field.dataset.filter, field.value);
  });
  return params;
};
const setupEvents = () => {
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const name = action.dataset.action;
    if (name === "wishlist") toggleWishlist(action.dataset.id);
    if (name === "add-card") addToCart(action.dataset.id);
    if (name === "clear-cart") { state.cart = []; saveState(); renderCart(); }
    if (name === "remove-cart") { state.cart.splice(Number(action.dataset.index), 1); saveState(); renderCart(); }
    if (name === "cart-quantity") { const entry = state.cart[Number(action.dataset.index)]; entry.qty = Math.max(1, Math.min(10, entry.qty + Number(action.dataset.change))); saveState(); renderCart(); }
    if (name === "quantity") { const display = app.querySelector("[data-detail-quantity]"); display.textContent = Math.max(1, Math.min(10, Number(display.textContent) + Number(action.dataset.change))); }
    if (name === "gallery") { app.querySelector("[data-main-image]").src = action.dataset.image; app.querySelectorAll(".thumbs button").forEach((button) => button.classList.remove("active")); action.classList.add("active"); }
    if (name === "detail-add") { const size = app.querySelector("[data-choice-size].selected")?.dataset.choiceSize; const color = app.querySelector("[data-choice-color].selected")?.dataset.choiceColor; addToCart(action.dataset.id, size, color, app.querySelector("[data-detail-quantity]").textContent); }
    if (name === "load-more") { state.shopLimit += 12; renderShop(KickoraRouter.readLocation().query); }
    if (name === "clear-filters") { window.history.replaceState({}, "", `${window.location.pathname}#/shop`); renderShop(new URLSearchParams()); }
  });
  app.addEventListener("click", (event) => {
    const size = event.target.closest("[data-choice-size]");
    const color = event.target.closest("[data-choice-color]");
    if (size) { app.querySelectorAll("[data-choice-size]").forEach((button) => button.classList.remove("selected")); size.classList.add("selected"); app.querySelector("[data-selected-size]").textContent = `· ${size.dataset.choiceSize}`; }
    if (color) { app.querySelectorAll("[data-choice-color]").forEach((button) => button.classList.remove("selected")); color.classList.add("selected"); }
  });
  app.addEventListener("input", (event) => {
    if (!event.target.matches("[data-filter]")) return;
    const params = readFilters();
    window.history.replaceState({}, "", `${window.location.pathname}#/${params.toString() ? `shop?${params}` : "shop"}`);
    renderShop(params);
  });
  document.addEventListener("submit", (event) => {
    if (event.target.matches("[data-search-form]")) { event.preventDefault(); const value = new FormData(event.target).get("q").toString().trim(); KickoraRouter.navigate(`/search${value ? `?q=${encodeURIComponent(value)}` : ""}`); document.querySelector("[data-search-form]").classList.add("hidden"); }
    if (event.target.matches("[data-newsletter]")) { event.preventDefault(); const message = document.querySelector("[data-newsletter-message]"); message.textContent = event.target.checkValidity() ? "Thanks — newsletter signup is a demo." : "Enter a valid email address."; message.className = "form-message visible"; if (event.target.checkValidity()) event.target.reset(); }
    if (event.target.matches("[data-contact-form]")) { event.preventDefault(); event.target.querySelector("[data-contact-message]").textContent = "Thanks — your demo message has been received."; event.target.reset(); }
    if (event.target.matches("[data-checkout-form]")) { event.preventDefault(); const form = event.target; const values = Object.fromEntries(new FormData(form)); const error = !form.checkValidity() ? "Please complete all fields with valid details." : !/^[6-9][0-9]{9}$/.test(values.phone) ? "Enter a valid 10-digit Indian phone number." : !/^[0-9]{6}$/.test(values.pin) ? "Enter a valid six-digit PIN code." : ""; if (error) { form.querySelector("[data-checkout-error]").textContent = error; return; } const totals = cartTotals(); const order = { number: `KO${Date.now().toString().slice(-8)}`, total: totals.total, name: values.name.trim(), items: state.cart }; localStorage.setItem(storageKeys.order, JSON.stringify(order)); state.cart = []; saveState(); KickoraRouter.navigate("/order-success"); }
  });
  document.querySelector("[data-menu-toggle]").addEventListener("click", () => document.querySelector("[data-nav]").classList.toggle("open"));
  document.querySelector("[data-search-toggle]").addEventListener("click", () => { const search = document.querySelector("[data-search-form]"); search.classList.toggle("hidden"); if (!search.classList.contains("hidden")) search.querySelector("input").focus(); });
};
const init = async () => {
  state.cart = readStorage(storageKeys.cart, []).filter((item) => item && product(item.id) !== undefined);
  state.wishlist = readStorage(storageKeys.wishlist, []).map(Number).filter((id) => product(id) !== undefined);
  setupEvents();
  try {
    state.products = await loadProducts();
    state.cart = readStorage(storageKeys.cart, []).filter((item) => product(item.id));
    state.wishlist = readStorage(storageKeys.wishlist, []).map(Number).filter((id) => product(id));
    KickoraRouter.start(renderRoute);
    window.KickoraChatbot?.init(() => state.products);
  } catch (error) {
    app.innerHTML = `<section class="empty-state page-empty"><h1>Products could not load</h1><p>Open this project with VS Code Live Server so the JSON catalogue can be fetched.</p></section>`;
    console.error(error);
  }
};
init();
