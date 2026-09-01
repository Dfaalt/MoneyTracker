# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Money Tracker

**Version:** 1.0  
**Status:** MVP  
**Platform:** Web Application  
**Design Direction:** Modern, Interactive, Simple

---

# 1. Product Overview

## 1.1 Product Name

**Money Tracker**

## 1.2 Product Description

Money Tracker adalah aplikasi web untuk mencatat dan memantau keuangan pribadi secara sederhana, cepat, dan interaktif.

Aplikasi memungkinkan pengguna mencatat pemasukan dan pengeluaran, menentukan budget bulanan, melihat riwayat transaksi, serta memahami pola pengeluaran melalui dashboard dan visualisasi data.

Produk dirancang dengan pendekatan **modern, responsive, dan user-friendly**, sehingga pengguna dapat mencatat transaksi dalam beberapa langkah tanpa proses yang rumit.

---

# 2. Product Vision

Money Tracker bertujuan menjadi aplikasi pencatatan keuangan pribadi yang:

- Simple
- Cepat
- Interaktif
- Modern
- Mudah dipahami
- Nyaman digunakan di mobile maupun desktop

Prinsip utama:

> **Track your money without making money tracking complicated.**

---

# 3. Problem Statement

Pengguna sering mengalami kesulitan dalam:

- Mengingat pengeluaran kecil.
- Mengetahui total pengeluaran bulan berjalan.
- Mengetahui kategori pengeluaran terbesar.
- Menjaga pengeluaran agar tidak melewati budget.
- Memahami pola pengeluaran.

Aplikasi harus membuat proses pencatatan terasa ringan dan memberikan feedback langsung kepada pengguna.

---

# 4. Target User

Money Tracker ditujukan untuk individu yang ingin mengelola keuangan pribadi.

Target utama:

- Mahasiswa
- Fresh graduate
- Karyawan
- Freelancer
- Pengguna yang baru mulai mencatat keuangan

User tidak diasumsikan memiliki pengetahuan mengenai financial management.

---

# 5. Product Goals

## Primary Goals

1. Memungkinkan pengguna mencatat transaksi dengan cepat.
2. Memberikan gambaran kondisi keuangan secara real-time.
3. Membantu pengguna mengontrol pengeluaran melalui budget.
4. Membantu pengguna memahami pola pengeluaran.
5. Memberikan pengalaman penggunaan yang modern dan interaktif.

---

# 6. Core Features

MVP terdiri dari enam fitur utama:

1. **Authentication**
2. **Dashboard**
3. **Transactions**
4. **Categories**
5. **Budget**
6. **Reports / Summary**

Tidak ada fitur kompleks seperti investasi, bank integration, atau AI pada MVP.

---

# 7. User Experience Principles

## 7.1 Quick

Pengguna harus dapat mencatat transaksi dengan sesedikit mungkin langkah.

## 7.2 Visual

Informasi keuangan utama ditampilkan melalui:

- Cards
- Progress bar
- Charts
- Visual indicators

## 7.3 Interactive

Elemen visual harus dapat digunakan untuk melakukan eksplorasi data.

Contoh:

> Klik kategori "Makanan" → tampilkan transaksi makanan.

## 7.4 Immediate Feedback

Setelah pengguna melakukan aksi, aplikasi memberikan feedback.

Contoh:

```text
Transaction added successfully.
```

Dashboard juga langsung memperbarui data.

## 7.5 Mobile First

Pengalaman utama harus tetap nyaman pada smartphone.

---

# 8. Feature Requirements

# 8.1 Authentication

Pengguna dapat:

- Register
- Login
- Logout

Menggunakan:

**Supabase Auth**

Setelah login:

```text
Login
 ↓
Dashboard
```

User hanya dapat mengakses data miliknya.

---

# 8.2 Dashboard

Dashboard merupakan halaman utama aplikasi.

## Financial Summary

Menampilkan:

### Income

Total pemasukan bulan berjalan.

### Expense

Total pengeluaran bulan berjalan.

### Balance

```text
Balance = Income - Expense
```

### Budget

Budget bulan berjalan.

### Remaining Budget

```text
Remaining = Budget - Expense
```

---

## Interactive Month Selector

Dashboard memiliki pemilih bulan:

```text
← July 2026 | August 2026 | September 2026 →
```

Ketika bulan berubah:

- Income berubah.
- Expense berubah.
- Balance berubah.
- Budget berubah.
- Chart berubah.
- Transaction summary berubah.

Data diperbarui tanpa reload halaman penuh.

---

# 8.3 Budget Progress

Budget ditampilkan dalam bentuk progress bar.

Contoh:

```text
August Budget

Rp1.061.850 / Rp3.000.000

████████░░░░░░░░░░

35.4% used
Rp1.938.150 remaining
```

Status:

### Safe

< 70%

### Warning

70–89%

### Critical

90–99%

### Exceeded

≥ 100%

Status ditampilkan melalui perubahan visual pada progress indicator dan pesan feedback.

---

# 8.4 Quick Add Transaction

Quick Add merupakan salah satu interaksi utama aplikasi.

Pada desktop:

```text
+ Add Transaction
```

Pada mobile:

```text
        +
```

Floating Action Button.

Ketika ditekan, modal transaksi muncul.

---

## Transaction Form

```text
Transaction

[ Expense ] [ Income ]

Amount
Rp 20.000

Category
[Makanan]

Description
Makan siang

Date
31 Aug 2026

[Save Transaction]
```

Required:

- Type
- Amount
- Category
- Date

Optional:

- Description

---

# 8.5 Quick Category

Untuk mempercepat pencatatan, form menyediakan kategori populer.

Contoh:

```text
[Makanan]
[Transportasi]
[Minuman]
[Kuota]
[Kebutuhan]
```

User dapat memilih kategori tanpa membuka dropdown panjang.

---

# 8.6 Transaction Feedback

Setelah transaksi berhasil:

1. Modal ditutup.
2. Toast notification muncul.
3. Dashboard diperbarui.
4. Total expense/income diperbarui.
5. Budget progress diperbarui.
6. Chart diperbarui.

Contoh:

```text
✓ Transaction added

Makan siang
-Rp20.000
```

---

# 8.7 Transactions

Halaman transaksi menampilkan seluruh transaksi.

Desktop:

| Date | Type | Category | Description | Amount | Action |
|---|---|---|---|---:|---|
| 31 Aug | Expense | Food | Lunch | Rp20.000 | ... |
| 30 Aug | Expense | Transport | Gojek | Rp10.000 | ... |
| 25 Aug | Income | Salary | Monthly salary | Rp5.000.000 | ... |

Mobile menggunakan card:

```text
Makan siang
Food · 31 Aug

-Rp20.000
```

---

# 8.8 Transaction Search

User dapat mencari transaksi berdasarkan:

- Description
- Category

Contoh:

```text
Search transactions...
```

Input:

```text
gojek
```

Maka transaksi yang berkaitan dengan "gojek" ditampilkan.

---

# 8.9 Transaction Filter

Filter:

- Month
- Type
- Category

Contoh:

```text
[August 2026]
[Expense]
[Food]
```

Filter dapat dikombinasikan.

---

# 8.10 Edit Transaction

User dapat mengubah:

- Type
- Amount
- Category
- Description
- Date

Setelah disimpan, seluruh summary dihitung ulang.

---

# 8.11 Delete Transaction

Saat user memilih delete:

```text
Delete transaction?

Makan siang
Rp20.000

[Cancel] [Delete]
```

Setelah delete:

- Transaction dihapus.
- Dashboard diperbarui.
- Chart diperbarui.
- Budget progress diperbarui.
- Toast ditampilkan.

---

# 8.12 Categories

Kategori digunakan untuk mengelompokkan transaksi.

## Expense Categories

- Food
- Drinks
- Transportation
- Internet / Quota
- Personal
- Household
- Other

## Income Categories

- Salary
- Bonus
- Freelance
- Other

Kategori ditampilkan menggunakan icon untuk meningkatkan visual recognition.

Contoh:

```text
🍜 Food
🚗 Transportation
🥤 Drinks
📱 Quota
🏠 Household
```

---

# 8.13 Expense Summary

Dashboard menampilkan ringkasan pengeluaran berdasarkan kategori.

Contoh:

```text
Expense by Category

Food              Rp459.150
Transportation    Rp275.600
Quota             Rp110.000
Personal          Rp150.100
Drinks             Rp67.000
```

Ditampilkan dalam **interactive donut chart**.

---

# 8.14 Interactive Category Chart

Chart harus interaktif.

Ketika user melakukan hover:

```text
Food

Rp459.150
43.2%
```

Ketika user klik kategori:

```text
Food selected
```

Sistem menampilkan transaksi yang termasuk kategori tersebut.

---

# 8.15 Daily Expense Chart

Dashboard menampilkan pengeluaran berdasarkan hari.

Contoh:

```text
Daily Expense

Rp100k ┤
 Rp80k ┤      █
 Rp60k ┤  █   █   █
 Rp40k ┤  █   █   █
 Rp20k ┤  █   █   █
       └────────────────
        24  25  26  27
```

Chart bersifat interactive.

Hover menampilkan:

```text
26 August

Expense
Rp42.900
```

Klik tanggal dapat menampilkan transaksi pada tanggal tersebut.

---

# 8.16 Budget Management

User dapat:

- Membuat budget.
- Mengubah budget.
- Melihat budget bulan berjalan.

Contoh:

```text
Monthly Budget

August 2026

Rp3.000.000

[Edit Budget]
```

Budget tersimpan berdasarkan bulan.

---

# 9. Interactive Dashboard Behavior

Dashboard harus bersifat dynamic.

Jika user menambahkan:

```text
Makan
Rp20.000
```

Maka:

```text
Expense
Rp1.061.850
        ↓
Rp1.081.850
```

Budget:

```text
Remaining
Rp1.938.150
        ↓
Rp1.918.150
```

Chart juga diperbarui.

Tidak perlu melakukan full page reload.

---

# 10. Visual Feedback

Aplikasi menggunakan feedback untuk berbagai kondisi.

### Transaction Added

```text
✓ Transaction added
```

### Transaction Updated

```text
✓ Transaction updated
```

### Transaction Deleted

```text
✓ Transaction deleted
```

### Budget Warning

```text
Your budget is almost used.
```

### Budget Exceeded

```text
You've exceeded your monthly budget.
```

---

# 11. Empty States

Jika belum ada transaksi:

```text
No transactions yet.

Start tracking your money today.

[+ Add Transaction]
```

Jika belum ada budget:

```text
No budget set for this month.

[Set Budget]
```

Empty state harus tetap menyediakan CTA yang jelas.

---

# 12. Loading States

Saat mengambil data dari Supabase:

- Skeleton loading
- Loading indicator

Contoh:

```text
┌───────────────┐
│ ███████████   │
│ ███████       │
└───────────────┘
```

Hindari halaman kosong saat data sedang dimuat.

---

# 13. Error Handling

Jika terjadi error:

```text
Something went wrong.

Please try again.

[Retry]
```

Form validation:

```text
Amount is required.
```

```text
Amount must be greater than 0.
```

---

# 14. Responsive Design

## Desktop

Layout:

```text
┌─────────┬────────────────────────────┐
│ Sidebar │ Dashboard                  │
│         │                            │
│ Home    │ Financial Summary          │
│ Trans.  │ Charts                     │
│ Budget  │ Recent Transactions        │
└─────────┴────────────────────────────┘
```

## Mobile

Layout:

```text
┌─────────────────────┐
│ Money Tracker       │
├─────────────────────┤
│ Financial Summary   │
│                     │
│ Charts              │
│                     │
│ Transactions        │
│                     │
│                  +  │
├─────────────────────┤
│ Home Trans. Budget  │
└─────────────────────┘
```

Mobile menggunakan bottom navigation dan floating action button.

---

# 15. Database

Backend menggunakan:

**Supabase PostgreSQL**

MVP menggunakan:

## transactions

| Field | Type |
|---|---|
| id | UUID |
| user_id | UUID |
| type | TEXT |
| category | TEXT |
| amount | NUMERIC |
| description | TEXT |
| transaction_date | DATE |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## budgets

| Field | Type |
|---|---|
| id | UUID |
| user_id | UUID |
| month | DATE |
| amount | NUMERIC |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

# 16. Security

Menggunakan:

**Supabase Row Level Security (RLS)**

User hanya dapat mengakses data miliknya.

Rule:

```text
auth.uid() = user_id
```

RLS wajib diterapkan pada:

- transactions
- budgets

---

# 17. Technology Stack

## Frontend

- React.js
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Recharts

## Backend

- Supabase Auth
- Supabase PostgreSQL
- Supabase RLS

---

# 18. Navigation

MVP:

```text
Dashboard
Transactions
Budget
```

Mobile:

```text
Home
Transactions
Budget
```

Quick Add tersedia melalui tombol `+`.

---

# 19. Performance Requirements

- Dashboard tidak melakukan full page reload setelah transaksi.
- UI memberikan feedback ketika request sedang diproses.
- Query hanya mengambil data yang diperlukan.
- Pagination digunakan apabila jumlah transaksi sudah besar.

---

# 20. MVP Acceptance Criteria

## Authentication

- [ ] Register berfungsi.
- [ ] Login berfungsi.
- [ ] Logout berfungsi.
- [ ] Protected route berfungsi.

## Dashboard

- [ ] Income tampil.
- [ ] Expense tampil.
- [ ] Balance tampil.
- [ ] Budget tampil.
- [ ] Remaining budget tampil.
- [ ] Budget progress tampil.
- [ ] User dapat mengganti bulan.
- [ ] Data berubah sesuai bulan.

## Transactions

- [ ] User dapat menambahkan transaksi.
- [ ] User dapat melihat transaksi.
- [ ] User dapat mengedit transaksi.
- [ ] User dapat menghapus transaksi.
- [ ] User dapat mencari transaksi.
- [ ] User dapat filter transaksi.

## Categories

- [ ] Category tersedia pada form.
- [ ] Category digunakan dalam summary.

## Reports

- [ ] Category chart tampil.
- [ ] Daily expense chart tampil.
- [ ] Chart dapat di-hover.
- [ ] Chart merespons interaksi user.

## Budget

- [ ] User dapat menentukan budget.
- [ ] Budget tersimpan berdasarkan bulan.
- [ ] Progress budget dihitung otomatis.
- [ ] Warning ditampilkan ketika budget mendekati batas.

## UX

- [ ] Toast tersedia.
- [ ] Loading state tersedia.
- [ ] Empty state tersedia.
- [ ] Error state tersedia.
- [ ] Responsive pada mobile.
- [ ] Responsive pada desktop.

## Security

- [ ] RLS aktif.
- [ ] User tidak dapat melihat data user lain.

---

# 21. Out of Scope

Tidak termasuk MVP:

- Saving goals
- Recurring transactions
- AI financial advisor
- Bank integration
- Investment tracking
- Multi-currency
- Notification system
- Export PDF
- Export Excel
- Cryptocurrency tracking

Fitur tersebut dapat ditambahkan pada versi berikutnya.

---

# 22. MVP Success Criteria

Money Tracker dianggap berhasil apabila pengguna dapat:

1. Login dengan mudah.
2. Menambahkan transaksi dengan cepat.
3. Melihat kondisi keuangan secara langsung.
4. Mengetahui jumlah pengeluaran bulan berjalan.
5. Mengetahui sisa budget.
6. Melihat kategori pengeluaran terbesar.
7. Mengeksplorasi data melalui chart.
8. Mengelola transaksi tanpa reload halaman.
9. Menggunakan aplikasi dengan nyaman di smartphone.

---

# 23. Product Experience Goal

Pengalaman yang ingin dicapai:

```text
Open App
    ↓
Immediately understand
financial condition
    ↓
Quickly add transaction
    ↓
Dashboard updates instantly
    ↓
Explore spending
    ↓
Understand spending habits
    ↓
Stay within budget
```

Money Tracker harus terasa seperti **aplikasi keuangan modern**, bukan sekadar tabel database dengan CRUD.