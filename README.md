# Eyakub Shop — Free GitHub + Supabase E-commerce

এই প্রজেক্টটি আপনার দেওয়া **Eyakub Shop** ডিজাইন রেফারেন্সের মতো সবুজ/ডার্ক-নেভি, বাংলা e-commerce UI দিয়ে তৈরি। প্রথমে ৩০০ জোড়া জুতার seed inventory দেওয়া আছে (৩০টি product × ১০ stock = ৩০০ pairs)। পরে Admin Panel থেকে নতুন category/product যোগ করা যাবে।

## কী কী আছে
- Responsive professional storefront
- Home hero, category strip, Flash Sale, popular products
- Product search ও category filtering
- Product detail page + related products
- Size, color, stock, old price, current price, rating
- Cart + quantity control
- Bangladesh delivery/order form: নাম, ফোন, email, জেলা, উপজেলা/থানা, পোস্ট কোড, সম্পূর্ণ ঠিকানা, নোট
- Order database + WhatsApp confirmation
- আপনার WhatsApp: `966567225245`
- Facebook: `https://www.facebook.com/profile.php?id=61594226919156`
- Secure Admin login (Supabase Auth)
- Admin: product add/edit/delete, stock, price, old price, size, color, SKU, description, rating, image upload
- Admin: order list + order status
- Supabase Row Level Security (RLS), so customers cannot read admin orders or write products
- GitHub Pages compatible via HashRouter

## গুরুত্বপূর্ণ কথা
**GitHub Pages একা database/auth/file-upload সহ পূর্ণ e-commerce backend চালাতে পারে না।** তাই frontend GitHub Pages-এ এবং free Supabase project-এ database/auth/storage রাখা হয়েছে। দুটির free tier দিয়ে শুরু করা যায়; provider-এর বর্তমান limits/terms অনুযায়ী ব্যবহার করবেন।

---

# 1) Supabase তৈরি করুন

1. Supabase-এ নতুন project খুলুন।
2. Project-এর **SQL Editor** খুলুন।
3. `supabase/schema.sql` পুরোটা copy/paste করে Run করুন।
4. এরপর `supabase/seed.sql` copy/paste করে Run করুন। এতে ৩০টি sample shoe product এবং মোট ৩০০ stock seed হবে।
5. **Authentication → Users → Add user** থেকে Admin user তৈরি করুন:
   - Email: `admin@eyakub-shop.local`
   - Password: আপনার শক্তিশালী password
   - Email confirmation প্রয়োজন না রাখলে সহজ হবে।
6. তৈরি করা user-এর UUID কপি করুন।
7. SQL Editor-এ চালান:

```sql
insert into public.profiles (id, username, role)
values ('YOUR_AUTH_USER_UUID', 'admin', 'admin');
```

`YOUR_AUTH_USER_UUID`-এর জায়গায় আপনার Auth user UUID বসাবেন।

### Admin login
ওয়েবসাইটে `/admin` route-এ username হিসেবে `admin` এবং Supabase-এ দেওয়া password ব্যবহার করবেন। কোডটি `admin`-কে internally `admin@eyakub-shop.local` credential হিসেবে ব্যবহার করে। চাইলে username/email field-এ পুরো email-ও ব্যবহার করা যায়।

---

# 2) Supabase API keys নিন

Supabase project → **Project Settings → API** থেকে:
- Project URL
- anon/public key

নিন। তারপর project root-এ `.env` নামে file বানিয়ে লিখুন:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_WHATSAPP_NUMBER=966567225245
VITE_FACEBOOK_URL=https://www.facebook.com/profile.php?id=61594226919156
```

**Service role key কখনো GitHub/browser code-এ দেবেন না।** শুধু anon/public key ব্যবহার করবেন।

---

# 3) Local computer-এ রান

Node.js 18+ ইনস্টল থাকা ভালো। তারপর project folder-এ:

```bash
npm install
npm run dev
```

Browser-এ Vite যে address দেখাবে সেটি খুলুন।

Production build test:

```bash
npm run build
```

---

# 4) GitHub-এ upload/push

GitHub-এ নতুন repository বানান, যেমন `eyakub-shop`। তারপর:

```bash
git init
git add .
git commit -m "Initial Eyakub Shop e-commerce site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eyakub-shop.git
git push -u origin main
```

তারপর GitHub → **Settings → Pages**:
- Source: **GitHub Actions**

এই project-এর `.github/workflows/deploy.yml` workflow automatically build/deploy করবে।

## GitHub Actions-এ Supabase secret

GitHub repository → Settings → Secrets and variables → Actions → New repository secret:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_WHATSAPP_NUMBER`
- `VITE_FACEBOOK_URL`

তারপর Actions workflow আবার run করুন।

---

# 5) Admin Panel থেকে product manage

`/#/admin` খুলে login করলে:

- Product add
- Product edit
- Product delete
- Stock
- Current price
- Previous price
- SKU
- Category
- Size
- Color
- Description
- Rating/review count
- **Choose File** দিয়ে gallery থেকে product photo upload
- Orders দেখা
- Order status বদলানো

সব product image `product-images` Supabase Storage bucket-এ যাবে।

---

# 6) নিজের ৩০০ জোড়া inventory বসানো

`supabase/seed.sql` শুধু শুরু করার sample data। আপনার আসল জুতার নাম, ছবি, size, color, দাম এবং stock Admin Panel থেকেই edit করতে পারবেন। বর্তমানে ৩০টি sample product-এর stock ১০ করে দেওয়া হয়েছে, অর্থাৎ মোট ৩০০ pairs।

## WhatsApp order

Customer checkout করলে order database-এ save হবে এবং WhatsApp-এ pre-filled order message খুলবে। নম্বরটি বর্তমানে:

`966567225245`

যদি Saudi number হলেও আপনার ব্যবসা Bangladesh delivery দেয়, WhatsApp link ঠিক থাকবে; তবে delivery/payment policy আপনার ব্যবসার বাস্তব নিয়ম অনুযায়ী পরিবর্তন করুন।

---

## নিরাপত্তা

- Public customer শুধু active products দেখতে পারে।
- Customer orders insert করতে পারে, কিন্তু অন্য order read করতে পারে না।
- শুধু `profiles.role = admin` user product CRUD এবং order read/update করতে পারে।
- Admin link public header/footer থেকে intentionally দেখানো হয়নি।
- GitHub-এ `.env` commit করবেন না।

## Custom domain

GitHub Pages-এ পরে নিজের domain বসাতে পারবেন। Domain provider-এর DNS এবং GitHub Pages-এর Custom domain settings ব্যবহার করুন।
