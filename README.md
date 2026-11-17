# KICKORA — Smart Shopping Website

KICKORA is a modern, responsive e-commerce shopping website developed using **HTML, CSS, Vanilla JavaScript, and JSON** as part of the Web Technology I CCE-5 Mini Project.

The website allows users to explore sneakers and streetwear, search and filter products, manage their shopping cart and wishlist, and complete a simulated checkout.

## Live Website

**[View KICKORA Website](https://yashzz26.github.io/WT_CCE5_260_SmartShoppingPortal/)**

## Features

- Modern and responsive homepage
- Dynamic product listings using JSON
- Product search, filtering, and sorting
- Individual product detail pages
- Size and color selection
- Shopping cart with quantity management
- Wishlist functionality
- Persistent cart and wishlist using localStorage
- Checkout form with JavaScript validation
- Simulated order confirmation
- Hash-based Single Page Application (SPA) routing
- JavaScript-based smart shopping assistant
- Animated chatbot interface
- Mobile-friendly design

## Technologies Used

- **HTML5** — Website structure
- **CSS3** — Styling, layouts, and animations
- **JavaScript** — Website functionality and DOM manipulation
- **JSON** — Product data storage
- **Fetch API** — Dynamic product loading
- **localStorage** — Cart and wishlist persistence
- **Hash Routing** — SPA navigation
- **GitHub Pages** — Website hosting
- **GitHub Actions** — Deployment automation

## Project Structure

```text
WT_CCE5_260_SmartShoppingPortal/
│
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── components.css
│   ├── responsive.css
│   └── chatbot.css
├── js/
│   ├── app.js
│   ├── router.js
│   ├── data.js
│   ├── components.js
│   ├── cart.js
│   ├── wishlist.js
│   ├── chatbot.js
│   └── views/
│       ├── home.js
│       ├── shop.js
│       ├── product.js
│       ├── cart.js
│       ├── wishlist.js
│       ├── checkout.js
│       ├── order-success.js
│       └── notfound.js
├── data/
│   └── products.json
└── images/
```

*The structure shown is illustrative and should match the actual repository files.*

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/yashzz26/WT_CCE5_260_SmartShoppingPortal.git
```

**2. Open the project folder**

```bash
cd WT_CCE5_260_SmartShoppingPortal
```

**3. Run the website**

- Open the project in Visual Studio Code.
- Install the Live Server extension.
- Right-click `index.html`.
- Select **Open with Live Server**.

No backend, database, or API key is required.

## Application Routes

| Route | Page |
|---|---|
| `#/` | Home |
| `#/shop` | Products |
| `#/men` | Men's Collection |
| `#/women` | Women's Collection |
| `#/new-arrivals` | New Arrivals |
| `#/sale` | Sale |
| `#/product/:id` | Product Details |
| `#/cart` | Shopping Cart |
| `#/wishlist` | Wishlist |
| `#/checkout` | Checkout |
| `#/order-success` | Order Confirmation |

## Smart Shopping Assistant

KICKORA includes a JavaScript-based shopping assistant that helps users find products based on their preferences.

It supports product searches, budget-based recommendations, category filtering, and common shopping-related questions.

The assistant uses rule-based JavaScript logic and product information from JSON without requiring external AI APIs.

