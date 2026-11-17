# KICKORA — Smart Shopping Website Portal

**WT CCE-5 · Roll No. 260 · Batch WT C3 · Web Technology 1**

## Project objective

KICKORA is a simple, responsive sneaker and streetwear shopping website built with HTML5, CSS3, vanilla JavaScript, and JSON. It demonstrates product loading, search, filters, a persistent cart, wishlist behavior, and a simulated checkout without a backend or real payments.

## Features

- Premium responsive homepage with hero, categories, benefits, promotions, and brands
- Shop catalogue with search, category, gender, brand, sale, newest, rating, and price sorting
- Individual product view with image gallery, size/color selection, quantity, and related products
- Cart saved in `localStorage` with variant-aware items and calculated totals
- Wishlist saved in `localStorage`
- Client-side checkout validation and demo order confirmation
- Hash-based SPA-style navigation with browser back/forward support
- Inline SVG icons and mobile navigation

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- JSON loaded with `fetch()`
- `localStorage` for cart, wishlist, and demo order state

## How to run

Because browsers restrict `fetch()` for local JSON files, run the project with a simple static server:

1. Open the folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Open the displayed localhost URL.

No Node.js, npm, Express, database, API key, or backend is required.

## Routing

`router.js` reads the URL hash, for example `#/shop` or `#/product/1`, and uses `history.pushState()` plus `hashchange`/`popstate` events to render pages without full reloads. `app.js` contains the reusable product cards, catalogue, product details, cart, wishlist, checkout, and informational pages.

## Project structure

```text
WT_CCE5_260_SmartShoppingPortal/
├── index.html       # Shared page shell and navigation
├── style.css        # Responsive design system and page styles
├── app.js           # Product pages, cart, wishlist, and checkout
├── router.js        # Small browser-only hash router
├── products.json    # Shared 24-product catalogue
└── README.md
```

## Testing checklist

- [ ] Home, Shop, Men, Women, New Arrivals, Collections, and Sale links work.
- [ ] Search and catalogue filters update the product grid.
- [ ] Product details, image thumbnails, size, color, and quantity work.
- [ ] Add/remove/update cart items and verify totals.
- [ ] Refresh and confirm cart and wishlist persistence.
- [ ] Add and remove wishlist items.
- [ ] Try invalid checkout details, then place a valid demo order.
- [ ] Use browser back/forward navigation.
- [ ] Check desktop, tablet, and mobile widths.

## Screenshots

Add screenshots from the running project here for the faculty demonstration.

## Future scope

- Add a real backend only if account, inventory, or payment features are required.
- Add automated browser tests.
- Replace remote demo imagery with locally hosted optimized assets.

## Viva talking points

Explain how `fetch()` loads one shared JSON catalogue, how hash routing changes views without a full reload, why cart prices are recalculated from product data, and how `localStorage` preserves cart and wishlist state.
