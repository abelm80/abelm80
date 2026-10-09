# Made — workshop estimates

A responsive browser app for pricing 3D printed and laser made products and preparing customer estimates. Amounts are in USD.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci --cache /tmp/maker-npm-cache
npm run dev
```

Run `npm test` for pricing tests and `npm run build` for a production build. Deploy the generated `dist/` directory on a static web host.

## Pricing

All entered material, machine time, labor time, and additional costs are **per unit**. For 3D printing, material cost is grams / 1000 × cost per kg. For laser work, it is sheets used × cost per sheet; fractional sheets are supported. Waste applies to material cost only. Machine and labor rates are hourly, and minutes are converted to hours.

Selling price = (material including waste + machine + labor + extras) × (1 + markup / 100). Markup is distinct from profit margin. Quantity multiplies the selling price. The fixed estimate discount is capped at the subtotal; tax applies after the discount. Calculations use full precision and round for display.

Add products to a quote, enter customer and business details, and use **Save estimate** or **Print / PDF**. Printing uses a separate customer layout that excludes internal costs and markup. Saving an existing estimate number updates that estimate. Saved quotes stay in the current browser's local storage; they are not synchronized or backed up to a server. Save important quotes as PDF. This version does not send estimates or accept payments.
