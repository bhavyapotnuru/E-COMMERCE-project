# atelier.

A responsive shopping storefront demo built with React and Vite. Browse and filter the catalog, create a demo account, add items to your bag, place a demo order, and review order history. The admin demo includes product and inventory management, customer records, and order status updates.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run build` to create a production bundle and `npm run lint` to run ESLint.

## Demo behavior

- Storefront state is saved in this browser's `localStorage`.
- Account forms are for demonstration only: passwords are neither verified nor stored.
- Choose **Explore the admin demo** in the account dialog to open the admin dashboard.
- Checkout creates a local demo order; it does not collect payment or arrange shipping.
- Product photography is loaded from Unsplash.

This client-only demo is not a production commerce backend. Production use requires secure server-side authentication, persistent database storage, payment processing, and fulfillment integrations.
