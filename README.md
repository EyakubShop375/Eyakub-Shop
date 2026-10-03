# Eyakub Shop

Static ecommerce frontend using GitHub Pages + Supabase.

## 1. Supabase
Your project URL is already placed in `app.js` and `admin.js`.

Replace only:
`PASTE_YOUR_SB_PUBLISHABLE_KEY_HERE`

with your **Publishable key** (`sb_publishable_...`).

Never put an `sb_secret_...` key in these files or in GitHub.

## 2. Database
Run all of `schema.sql` in Supabase SQL Editor.

Create an admin user in Supabase Authentication → Users. Then create/update the matching row in `public.profiles` with role `admin`.

## 3. Storage
A public bucket named `product-images` is expected. The SQL includes admin-only upload/update/delete policies.

## 4. GitHub Pages
Upload these files to the repository root. Enable GitHub Pages from Settings → Pages → Deploy from branch → main/root.

## 5. Features
- Responsive home page
- Categories
- Product search
- Flash sale
- Product detail + order form
- Supabase orders/order items
- Admin login
- Product add/edit/delete
- Image upload to Supabase Storage
- Facebook and WhatsApp links

The demo fallback products are only sample data. Real products come from the Supabase `products` table.
