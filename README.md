# KICKORA — Smart Shopping Website Portal

**WT CCE-5 | Roll No. 260 | Batch WT C3 | Web Technology 1**

## Problem statement
Build a responsive e-commerce front-end with SPA-style navigation, JSON-loaded products, localStorage cart, and a validated simulated checkout.

## Features
- Responsive homepage, shop, product details, cart, checkout and confirmation
- Hash-based client-side routing without full page reloads
- Products loaded dynamically with `fetch()` from `products.json`
- Search, category filters and price sorting
- Size selection and quantity management
- Persistent cart using `localStorage`
- Checkout validation for name, email, mobile, PIN and address
- Simulated order confirmation; no real payment processing

## How to run
1. Open the folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Browse products, add items, test cart and checkout.

Do not open `index.html` directly via `file://` because browsers restrict `fetch()` of local JSON files.

## File structure
- `index.html` — layout shell, navigation, footer
- `style.css` — responsive styling
- `app.js` — routing, dynamic rendering, cart, validation
- `products.json` — product catalog

## Test cases
| Test | Expected result |
|---|---|
| Navigate Home → Shop | View changes without page reload |
| Filter Sneakers | Only sneakers shown |
| Search hoodie | Matching product(s) shown |
| Add item without size | Warning shown |
| Add item with size | Cart count increases |
| Refresh browser | Cart items persist |
| Change quantity | Totals update |
| Invalid email / phone / PIN | Checkout rejected with message |
| Valid checkout | Order success and cart cleared |
| Narrow viewport | Responsive cards and mobile menu |

## Screenshots
Add your own screenshots here after running the project for your faculty demo.

## GitHub repository
Suggested repository name: `WT_CCE5_260_SmartShoppingPortal`

## Note
Academic demonstration only. Product imagery is remotely hosted via Unsplash and needs an internet connection. No real payments, accounts, or shipping.
