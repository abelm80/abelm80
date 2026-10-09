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

## Free 3D model builder

Click **3D model builder** in the sidebar. It runs entirely in your browser with no AI provider, API key, upload service, or credits.

- **Description:** create boxes/cubes, spheres, cylinders, and hollow vases/planters. A description such as `box 60 x 40 x 20 mm` sets width × depth × height. Unsupported objects are rejected with guidance; this is a limited shape parser, not a generative AI model.
- **Picture:** upload a PNG, JPEG, or WebP smaller than 10 MB to make a solid-backed relief. Bright pixels are higher; invert to raise dark pixels. Images are fitted with padding rather than cropped. A picture relief does not reconstruct the complete photographed object.
- **Text plaque:** enter lettering to create a raised-text plaque.

Set dimensions in millimeters, click **Build model**, orbit/zoom the preview, and click **Download STL**. Imported STL units should be set to millimeters. Check the result in your slicer before printing; image detail and small lettering depend on your printer's resolution. Vase walls use a nominal 2 mm thickness and a 2 mm base.

### Windows quick start

Download **Code → Download ZIP** from GitHub, extract it, and double-click `start-windows.bat` in the folder containing `package.json`. Install Node.js LTS first. The script installs dependencies if needed, then starts the app. Open `http://localhost:5173` and keep the terminal window open. If Vite reports another port, use that address. No Meshy key or paid service is needed.
