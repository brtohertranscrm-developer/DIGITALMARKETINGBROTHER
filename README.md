# Brothers Trans Marketing Dashboard

Dashboard internal untuk monitoring performa sosial media, reporting tim konten, campaign, lead, dan KPI marketing Brothers Trans.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js credentials login
- Recharts-ready untuk visualisasi dashboard

## Quick Start Lokal

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

App berjalan di `http://localhost:3000`.

Jika Docker tersedia:

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Akun awal setelah seed:

- Email: `admin@brotherstrans.id`
- Password: `BrotherTrans123!`

## Deploy ke Vercel

1. Push repository ke GitHub/GitLab.
2. Import project di Vercel.
3. Set Root Directory ke root repo.
4. Tambahkan PostgreSQL production, misalnya Neon, Supabase, atau Vercel Postgres.
5. Isi Environment Variables:
   - `DATABASE_URL` = connection string PostgreSQL production
   - `AUTH_SECRET` = secret acak, contoh generate dengan `openssl rand -base64 32`
   - `NEXTAUTH_SECRET` = isi sama dengan `AUTH_SECRET` jika diperlukan kompatibilitas Auth.js
   - `AUTH_URL` = `https://digitalmarketingbrother-web.vercel.app`
   - `NEXTAUTH_URL` = isi sama dengan `AUTH_URL` jika diperlukan kompatibilitas Auth.js
6. Build Command: `npm run vercel-build`
7. Install Command: `npm install`

Vercel build akan otomatis menjalankan migration dan seed lewat `npm run vercel-build`. Jika ingin menjalankan manual dari lokal:

```bash
DATABASE_URL="PASTE_DATABASE_URL_NEON" npm run db:deploy
DATABASE_URL="PASTE_DATABASE_URL_NEON" npm run db:seed
```

Catatan penting:

- Pakai `db:deploy` untuk production/Vercel.
- Pakai `db:migrate` hanya untuk development lokal.
- `postinstall` otomatis menjalankan Prisma generate agar Vercel build bisa menemukan Prisma Client.

## Modul MVP

- Login admin dan proteksi dashboard.
- Content Calendar CRUD dasar.
- Campaign CRUD dengan budget, objective, jumlah konten, lead, dan potential value.
- Lead Tracking untuk input prospek, source channel, campaign, value, dan status follow-up.
- Dashboard overview berbasis data database.
- Campaign, Team KPI, dan Reports sebagai halaman fondasi.
- Prisma schema untuk user, role, social accounts, campaigns, content metrics, social metrics, dan leads.
