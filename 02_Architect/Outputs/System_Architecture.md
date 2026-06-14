# SYSTEM ARCHITECTURE — THE FAT MILK

**Agent:** AG-02 — System Architect  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-06-13  

---

## 1. C4 Model

### Level 1 — System Context

```
┌─────────────┐         ┌──────────────────────────┐         ┌─────────────┐
│  Customer    │◄───────►│  THE FAT MILK SYSTEM     │◄───────►│   SePay     │
│  (PWA App)   │  HTTPS  │                          │Webhook  │ (Payment)   │
└─────────────┘         │  ┌────────┐ ┌──────────┐ │         └─────────────┘
                        │  │Frontend│ │ Backend  │ │
┌─────────────┐         │  │Next.js │ │ Node.js  │ │         ┌─────────────┐
│   Staff      │◄───────►│  └────────┘ └──────────┘ │◄───────►│ OTP Service │
│  (POS Web)   │  HTTPS  │       ┌──────────┐       │  SMS    │ (Twilio/    │
└─────────────┘         │       │PostgreSQL│       │         │  Firebase)  │
                        │       └──────────┘       │         └─────────────┘
┌─────────────┐         │                          │
│   Admin      │◄───────►│                          │
│ (Admin Web)  │  HTTPS  └──────────────────────────┘
└─────────────┘
```

**Actors:** Customer (PWA), Staff (POS), Admin (Admin Panel)  
**External Systems:** SePay (Payment Gateway), OTP Service (SMS verification)

### Level 2 — Container Diagram

| Container | Công nghệ | Mô tả |
|-----------|-----------|-------|
| **PWA Frontend** | Next.js 14 + Tailwind CSS | Mobile-first PWA, Service Workers, offline mode |
| **Admin/POS Frontend** | Next.js 14 + Tailwind CSS | Shared codebase với PWA, route-based separation |
| **Backend API** | Node.js + Express.js | RESTful API, Clean Architecture, JWT auth |
| **Database** | PostgreSQL 16 | RDBMS chính — ACID transactions, row-level locking |
| **Cache** | Redis 7 | Session store, OTP temp storage, rate limiting |
| **File Storage** | Local Disk (server) | Lưu ảnh sản phẩm (gallery), avatar — serve qua Nginx static |
| **Reverse Proxy** | Nginx | SSL termination, load balancing, static file serving |

### Level 3 — Component (Backend)

```
┌─────────────────────────────────────────────────┐
│                 BACKEND API                      │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ PRESENTATION (Controllers / Routes)        │  │
│  │  AuthController · ProductController ·      │  │
│  │  OrderController · WalletController ·      │  │
│  │  CRMController · AdminController ·         │  │
│  │  WebhookController · DeliveryController    │  │
│  └────────────────┬───────────────────────────┘  │
│                   │                              │
│  ┌────────────────▼───────────────────────────┐  │
│  │ APPLICATION (Use Cases / Services)         │  │
│  │  AuthService · ProductService ·            │  │
│  │  OrderService · WalletService ·            │  │
│  │  PointsService · CRMService ·              │  │
│  │  VoucherService · ReportService ·          │  │
│  │  DeliveryService · NotificationService     │  │
│  └────────────────┬───────────────────────────┘  │
│                   │                              │
│  ┌────────────────▼───────────────────────────┐  │
│  │ DOMAIN (Entities / Value Objects)          │  │
│  │  User · Product · Order · OrderItem ·      │  │
│  │  Wallet · WalletTransaction · Points ·     │  │
│  │  Branch · Inventory · Voucher ·            │  │
│  │  CustomerTier · FlashSale · Delivery       │  │
│  └────────────────┬───────────────────────────┘  │
│                   │                              │
│  ┌────────────────▼───────────────────────────┐  │
│  │ INFRASTRUCTURE (Repositories / Adapters)   │  │
│  │  PostgresUserRepo · PostgresOrderRepo ·    │  │
│  │  PostgresInventoryRepo · RedisSessionStore │  │
│  │  SepayAdapter · OTPAdapter · FileAdapter ·  │  │
│  │  ThermalPrinterAdapter                     │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 2. Tech Stack Quyết Định

| Layer | Lựa chọn | Lý do |
|-------|----------|-------|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS | SSR/SSG cho SEO, PWA support, React ecosystem, responsive mobile-first |
| **Backend** | Node.js 20 LTS + Express.js | JS fullstack consistency, async I/O tốt cho real-time, ecosystem lớn |
| **ORM** | Prisma | Type-safe, auto migration, hỗ trợ PostgreSQL tốt |
| **Database** | PostgreSQL 16 | ACID, row-level locking (FOR UPDATE), JSONB, mature |
| **Cache** | Redis 7 | OTP temp store (TTL), session, rate limiting |
| **Auth** | JWT (access + refresh token) | Stateless, phù hợp multi-client (PWA + POS + Admin) |
| **OTP** | Twilio / Firebase Auth | SMS verification cho đăng ký SĐT |
| **Payment** | SePay API | QR động, webhook xác nhận, đối soát |
| **File Storage** | Local Disk (Nginx static) | Gallery ảnh sản phẩm, avatar — `/uploads/` |
| **Deployment** | Docker + Docker Compose | Consistent env, dễ scale |
| **CI/CD** | GitHub Actions | Auto test, build, deploy |

---

## 3. Design Patterns Áp Dụng

| Pattern | Áp dụng tại | Mục đích |
|---------|------------|----------|
| **Clean Architecture** | Backend toàn bộ | Separation of Concerns, Dependency Inversion |
| **Repository Pattern** | Infrastructure layer | Abstract DB access, dễ test |
| **Service Pattern** | Application layer | Orchestrate business logic |
| **Queue-based Processing** | Order + Wallet APIs | Chống race condition, over-selling |
| **Observer/Event** | Sau khi đơn "Đã giao" | Trigger: tích điểm, thăng hạng, thông báo |
| **Adapter Pattern** | SePay, OTP, Printer, FileStorage | Wrap external services, dễ swap |
| **Middleware Chain** | Auth, RBAC, Rate Limit | Cross-cutting concerns |
| **DTO Pattern** | Controller ↔ Service | Validate input, shape output |

---

## 4. Security Architecture

| Concern | Giải pháp |
|---------|----------|
| **Authentication** | JWT access token (15 phút) + refresh token (7 ngày). SĐT + OTP để đăng ký |
| **Authorization** | RBAC middleware: Admin → full access, Staff → branch-scoped, Customer → own data |
| **API Security** | Rate limiting (Redis), CORS whitelist, Helmet headers, input validation (Zod) |
| **Wallet Security** | DB Transaction + SELECT FOR UPDATE (row-level lock). Idempotency key mỗi giao dịch |
| **SePay Webhook** | Signature verification (HMAC). IP whitelist. Idempotent processing |
| **Password** | bcrypt (cost=12). Không log, không return plaintext |
| **Transport** | HTTPS only (Nginx SSL termination). HSTS header |
| **Data** | Soft-delete (is_deleted + deleted_at). Audit log cho giao dịch tài chính |

---

## 5. Scalability Considerations

- **Hiện tại:** 1 chi nhánh (The Fat Milk), monolith deployment
- **Tương lai:** Thêm chi nhánh → chỉ cần INSERT vào bảng `branches`, toàn bộ data đã tách theo `branch_id`
- **Database:** Horizontal read replica nếu cần. Index trên `branch_id` mọi bảng
- **Caching:** Redis cho session + OTP. Product catalog cache nếu traffic cao
- **File:** Local disk, Nginx serve static. Nếu multi-server → cân nhắc S3
