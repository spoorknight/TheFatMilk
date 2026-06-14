# MODULE BREAKDOWN — THE FAT MILK

**Agent:** AG-02 — System Architect  
**Ngày tạo:** 2026-06-13  

---

## 1. Danh sách Module

| # | Module ID | Tên Module | Mô tả | Layer |
|---|-----------|-----------|-------|-------|
| 1 | **M-AUTH** | Auth & Users | Đăng ký SĐT+OTP, đăng nhập JWT, RBAC | Backend + Frontend |
| 2 | **M-BRANCH** | Branch Management | CRUD chi nhánh, geolocation | Backend + Admin |
| 3 | **M-PRODUCT** | Product Catalog | CRUD sản phẩm, danh mục, gallery ảnh, combo, seasonal | Backend + Admin + PWA |
| 4 | **M-INVENTORY** | Inventory Control | Tồn kho theo branch, xuất-nhập-tồn, chuyển kho | Backend + Admin |
| 5 | **M-CRM** | CRM & Tiers | Hạng thành viên, thăng/xuống hạng, chiết khấu | Backend + Admin |
| 6 | **M-WALLET** | E-Wallet | Ví điện tử, nạp/trừ, idempotency, row-level lock | Backend + PWA |
| 7 | **M-SEPAY** | SePay Integration | QR động, webhook, signature verify, đối soát | Backend |
| 8 | **M-POINTS** | Reward Points | Tích/tiêu điểm, quy đổi, ledger | Backend + PWA |
| 9 | **M-ORDER** | Order Management | Tạo/quản lý đơn hàng, chống over-selling | Backend + PWA + POS |
| 10 | **M-DELIVERY** | Delivery | Phương thức giao: pickup, self-ship, external | Backend + PWA |
| 11 | **M-VOUCHER** | Voucher & Flash Sale | Tạo/áp dụng voucher, flash sale, targeted marketing | Backend + Admin + PWA |
| 12 | **M-POS** | Point of Sale | POS UI, barcode scan, in hóa đơn, CRM tại quầy | Frontend (POS) |
| 13 | **M-NOTIF** | Notifications | Thông báo đơn hàng, ví, hạng, promotion | Backend + PWA |
| 14 | **M-REPORT** | Reports & Analytics | Doanh thu, SP bán chạy, ví tổng, biểu đồ | Backend + Admin |
| 15 | **M-PWA** | PWA Shell & UI | App shell, service workers, bottom nav, homepage | Frontend (PWA) |
| 16 | **M-ADMIN** | Admin Panel | Admin dashboard, responsive mobile | Frontend (Admin) |

---

## 2. Dependency Graph

```
                        ┌──────────┐
                        │ M-AUTH   │ ← Foundation
                        └────┬─────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐   ┌──────────┐
        │M-BRANCH  │  │M-PRODUCT │   │ M-CRM    │
        └────┬─────┘  └────┬─────┘   └────┬─────┘
             │              │              │
             ▼              ▼              │
        ┌──────────┐  ┌──────────┐         │
        │M-INVENTORY│  │M-VOUCHER │         │
        └────┬─────┘  └────┬─────┘         │
             │              │              │
             └──────┬───────┘              │
                    ▼                      ▼
              ┌──────────┐          ┌──────────┐
              │ M-ORDER  │◄─────────│M-WALLET  │
              └────┬─────┘          └────┬─────┘
                   │                     │
                   ▼                     ▼
             ┌──────────┐          ┌──────────┐
             │M-DELIVERY│          │ M-SEPAY  │
             └────┬─────┘          └──────────┘
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
   ┌──────────┐ ┌──────┐ ┌──────────┐
   │M-POINTS  │ │M-NOTIF│ │M-REPORT  │
   └──────────┘ └──────┘ └──────────┘
         
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │ M-PWA    │  │ M-POS    │  │ M-ADMIN  │
         └──────────┘  └──────────┘  └──────────┘
               ↑ Frontend — consumes all Backend modules
```

---

## 3. Thứ tự Implement (cho AG-03)

### Sprint 1 — Foundation (Backend Core)

| Thứ tự | Module | Task | Effort | Dependencies |
|--------|--------|------|--------|-------------|
| 1.1 | M-AUTH | Setup project, DB schema, User entity, JWT, OTP | XL | — |
| 1.2 | M-BRANCH | Branch CRUD, geolocation | S | M-AUTH |
| 1.3 | M-PRODUCT | Product CRUD, Category, Gallery upload, Combo | L | M-AUTH, M-BRANCH |
| 1.4 | M-INVENTORY | Inventory CRUD, stock by branch, logs | M | M-PRODUCT, M-BRANCH |
| 1.5 | M-CRM | Tier config, thăng/xuống hạng engine | M | M-AUTH |

### Sprint 2 — Financial Core

| Thứ tự | Module | Task | Effort | Dependencies |
|--------|--------|------|--------|-------------|
| 2.1 | M-WALLET | Wallet entity, topup/deduct, row-level lock | L | M-AUTH |
| 2.2 | M-SEPAY | SePay adapter, QR generate, webhook handler | L | M-WALLET |
| 2.3 | M-POINTS | Points ledger, earn/redeem logic | M | M-AUTH |
| 2.4 | M-VOUCHER | Voucher CRUD, validation, usage tracking | M | M-AUTH, M-PRODUCT |

### Sprint 3 — Order Pipeline

| Thứ tự | Module | Task | Effort | Dependencies |
|--------|--------|------|--------|-------------|
| 3.1 | M-ORDER | Order creation, queue-based processing, status flow | XL | M-INVENTORY, M-WALLET, M-POINTS, M-VOUCHER, M-CRM |
| 3.2 | M-DELIVERY | Delivery method, address, fee calculation | M | M-ORDER |
| 3.3 | M-NOTIF | Notification service, event-driven | M | M-ORDER, M-WALLET, M-CRM |

### Sprint 4 — Frontend

| Thứ tự | Module | Task | Effort | Dependencies |
|--------|--------|------|--------|-------------|
| 4.1 | M-PWA | PWA shell, homepage, product listing, cart, checkout | XL | All backend |
| 4.2 | M-POS | POS UI, barcode, CRM lookup, receipt printing | L | All backend |
| 4.3 | M-ADMIN | Admin dashboard, product/branch/order management | XL | All backend |

### Sprint 5 — Reports & Polish

| Thứ tự | Module | Task | Effort | Dependencies |
|--------|--------|------|--------|-------------|
| 5.1 | M-REPORT | Revenue charts, top products, wallet summary | L | M-ORDER, M-WALLET |
| 5.2 | M-VOUCHER | Flash Sale UI (countdown, pricing) | M | M-VOUCHER |
| 5.3 | — | Testing, security hardening, performance | L | All |

---

## 4. API Module Mapping

| Module | API Prefix | Auth Required | Roles |
|--------|-----------|---------------|-------|
| M-AUTH | `/api/auth/*` | No (public) | — |
| M-BRANCH | `/api/branches/*` | Yes | Admin (write), All (read) |
| M-PRODUCT | `/api/products/*` | Yes | Admin (write), All (read) |
| M-INVENTORY | `/api/inventory/*` | Yes | Admin, Staff |
| M-CRM | `/api/crm/*` | Yes | Admin (config), Customer (read own) |
| M-WALLET | `/api/wallet/*` | Yes | Customer (own), Admin (view all) |
| M-SEPAY | `/api/webhook/sepay` | No (signature verify) | — |
| M-POINTS | `/api/points/*` | Yes | Customer (own), Admin (view all) |
| M-ORDER | `/api/orders/*` | Yes | All (scoped) |
| M-DELIVERY | `/api/orders/*/delivery` | Yes | Customer, Staff |
| M-VOUCHER | `/api/vouchers/*` | Yes | Admin (write), Customer (read/apply) |
| M-NOTIF | `/api/notifications/*` | Yes | Customer (own) |
| M-REPORT | `/api/reports/*` | Yes | Admin |
