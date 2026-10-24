# Ni & Di storefront — free starter website

This is a static HTML/CSS/JavaScript storefront designed for free static hosting. It includes:
- Responsive homepage and product catalogue
- Product search and category filters
- Shopping cart with quantity controls and subtotal
- WhatsApp checkout message
- Contact form that opens the visitor's email app
- Basic page title and SEO description

## Important limitations
This is a frontend starter website, not a complete secure ecommerce backend.
- It does not take card/UPI payments automatically.
- It does not create customer accounts or secure admin login.
- Products are edited in `script.js` and require changing the source files and re-publishing.
- Cart state is in memory and resets when the page reloads.
- Contact form uses `mailto:` and depends on the visitor having an email app configured.
- Do not collect passwords, card data, or sensitive personal information in this static site.

## Before publishing

1. Open `script.js`.
2. Replace `919XXXXXXXXX` with your business WhatsApp number in international format (India: `91` followed by your 10-digit mobile number, digits only).
3. Replace `your-email@example.com` with your business contact email.
4. Edit the `PRODUCTS` array with your real products, categories, prices and descriptions.
5. Replace the decorative placeholder artwork with product photos if you have them. To do this, replace the `.product-placeholder` element in `script.js` with an image element using your image path, for example `<img src="images/product-1.jpg" alt="Product name">`, and add your images to an `images` folder. Make sure the `alt` text accurately describes each product.
6. Test cart totals and WhatsApp order messages on your phone before sharing the website.

## Free publishing with GitHub Pages

1. Create/sign in to a GitHub account at https://github.com/.
2. Create a new **public** repository named `ni-di-store`.
3. Upload `index.html`, `styles.css`, `script.js`, and `README.md` to the repository root.
4. In the repository, open **Settings → Pages**.
5. Under the build/deployment section, choose **Deploy from a branch**, select branch `main` and folder `/ (root)`, then save.
6. Wait for deployment. GitHub Pages will show the published address, usually like `https://YOUR-USERNAME.github.io/ni-di-store/`.
7. Open the published URL on mobile and laptop and test the site.

GitHub Pages availability and terms can change; it is designed for static sites. Never put secret API keys or private customer data in this repository.

## How to edit products

In `script.js`, update entries inside `PRODUCTS`, e.g.

```js
{ id: 1, name: "Cotton Tote Bag", category: "Bags", price: 399, description: "Reusable cotton tote bag.", label: "BAG 01" }
```

Each product needs a unique numeric `id`. After editing, upload/commit the changed file to GitHub; GitHub Pages will redeploy.

## Payments, login and admin dashboard later

To add secure customer accounts, a real admin dashboard, persistent orders and online payment verification, use a backend/database and a compliant payment gateway. Do not put private API keys in frontend JavaScript. Those features can have provider fees or other costs, so they may not be possible at a strict ₹0 budget.
