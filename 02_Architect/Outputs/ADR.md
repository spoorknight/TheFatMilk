# ARCHITECTURE DECISION RECORDS (ADR) — THE FAT MILK

**Agent:** AG-02 — System Architect  
**Ngày tạo:** 2026-06-13  

---

## ADR-001: Chọn Node.js + Express thay vì Python/FastAPI

**Vấn đề:** Chọn runtime & framework cho Backend API  
**Lựa chọn:**
- A) Python + FastAPI
- B) Node.js + Express.js ✅
- C) .NET 8

**Quyết định:** Node.js + Express.js  
**Lý do:**
- Fullstack JS (Next.js frontend + Node.js backend) → 1 ngôn ngữ, ít context switch
- Async I/O native, phù hợp real-time sync (POS ↔ PWA)
- Ecosystem lớn (npm), nhiều adapter cho SePay, thermal printer
- Prisma ORM hoạt động tốt với cả Next.js và Express

**Trade-off:** Python có type hinting tốt hơn, nhưng Prisma + TypeScript bù đắp được

---

## ADR-002: PostgreSQL thay vì MongoDB

**Vấn đề:** Chọn database engine  
**Lựa chọn:**
- A) PostgreSQL ✅
- B) MongoDB

**Quyết định:** PostgreSQL 16  
**Lý do:**
- **ACID transaction bắt buộc** cho ví điện tử, điểm thưởng, kho (RISK-001, 002)
- **Row-level locking** (SELECT FOR UPDATE) — core requirement cho chống race condition
- Relational model phù hợp: quan hệ rõ ràng giữa orders ↔ products ↔ inventory ↔ wallets
- JSONB cho dữ liệu linh hoạt (raw webhook data) khi cần

**Trade-off:** MongoDB linh hoạt hơn cho schema biến đổi, nhưng ứng dụng tài chính cần ACID

---

## ADR-003: JWT (Access + Refresh) thay vì Session-based

**Vấn đề:** Cơ chế xác thực cho multi-client (PWA, POS, Admin)  
**Lựa chọn:**
- A) JWT access + refresh ✅
- B) Session cookie + Redis
- C) OAuth2 / OpenID Connect

**Quyết định:** JWT  
**Lý do:**
- Stateless — không cần tra cứu session store cho mỗi request
- Multi-client: PWA, POS, Admin dùng chung API, mỗi nơi lưu token riêng
- Access token TTL ngắn (15 phút), refresh token dài (7 ngày) → balance giữa security và UX

**Trade-off:** Không revoke được access token ngay lập tức (phải đợi hết TTL hoặc dùng blacklist)

---

## ADR-004: Monolith trước, microservice sau

**Vấn đề:** Architecture pattern — monolith hay microservice?  
**Lựa chọn:**
- A) Modular Monolith ✅
- B) Microservices từ đầu

**Quyết định:** Modular Monolith  
**Lý do:**
- Hiện tại chỉ 1 chi nhánh, team nhỏ → microservice quá phức tạp
- Clean Architecture đã tách rõ module → dễ extract thành microservice khi cần scale
- Single DB → transaction consistency đơn giản (quan trọng cho ví + kho)
- Deploy đơn giản hơn (Docker Compose), chi phí vận hành thấp

**Trade-off:** Khi scale > 10 chi nhánh với traffic cao, có thể cần tách M-ORDER + M-WALLET thành service riêng

---

## ADR-005: Queue-based processing cho Order + Wallet

**Vấn đề:** Chống race condition trên kho và ví  
**Lựa chọn:**
- A) Optimistic locking (version column)
- B) Pessimistic locking (SELECT FOR UPDATE) + DB Transaction ✅
- C) Message Queue (RabbitMQ/Redis Queue)

**Quyết định:** Pessimistic locking + DB Transaction (trong giai đoạn 1)  
**Lý do:**
- Đơn giản nhất, không cần thêm infrastructure (MQ server)
- PostgreSQL hỗ trợ native SELECT FOR UPDATE → row-level lock tức thì
- Phù hợp traffic hiện tại (1 chi nhánh)
- Nếu cần scale → chuyển sang Redis Queue sau

**Trade-off:** Có thể bottleneck nếu nhiều request concurrent trên cùng 1 row. Chấp nhận vì traffic ban đầu thấp

---

## ADR-006: Next.js App Router cho cả PWA, POS, Admin

**Vấn đề:** Frontend architecture — separate apps hay shared codebase?  
**Lựa chọn:**
- A) 3 app riêng biệt
- B) 1 Next.js app, route-based separation ✅

**Quyết định:** 1 Next.js app, shared codebase  
**Lý do:**
- Shared components (ProductCard, CartWidget, CRM panel)
- 1 lần deploy, 1 build pipeline
- Route groups: `/` (PWA), `/pos/*` (POS), `/admin/*` (Admin)
- RBAC middleware kiểm soát truy cập theo role

**Trade-off:** Bundle size lớn hơn nếu không code-split cẩn thận. Dùng Next.js dynamic imports để mitigate

---

## ADR-007: SePay Webhook + Signature Verification

**Vấn đề:** Xác nhận giao dịch nạp ví từ SePay  
**Lựa chọn:**
- A) Polling SePay API định kỳ
- B) Webhook + Signature verify ✅

**Quyết định:** Webhook + HMAC Signature  
**Lý do:**
- Real-time: cộng ví ngay khi SePay xác nhận, không delay polling
- SePay hỗ trợ webhook native
- HMAC signature chống giả mạo → bảo mật cao
- Idempotency key (sepay_transaction_id) chống duplicate processing

**Trade-off:** Cần handle webhook retry (SePay gửi lại nếu backend không response 200)

---

## ADR-008: Prisma ORM thay vì raw SQL

**Vấn đề:** Database access layer  
**Lựa chọn:**
- A) Prisma ✅
- B) Knex.js (Query Builder)
- C) Raw SQL

**Quyết định:** Prisma  
**Lý do:**
- Type-safe queries (TypeScript integration)
- Auto migration, schema introspection
- Relation queries đơn giản (include, select)
- Vẫn hỗ trợ raw SQL cho complex queries (SELECT FOR UPDATE)

**Trade-off:** Overhead nhẹ so với raw SQL. Complex aggregation phải dùng `$queryRaw`

---

## ADR-009: Local Disk cho File Storage thay vì S3

**Vấn đề:** Lưu trữ ảnh sản phẩm (gallery, multi-image)  
**Lựa chọn:**
- A) Local disk (server) ✅
- B) S3-compatible (AWS S3 / MinIO)

**Quyết định:** Local Disk (server có sẵn)  
**Lý do:**
- Server local đã có sẵn, không cần thêm infrastructure
- Chi phí bằng 0, không phụ thuộc cloud provider
- Đơn giản: Express.js serve static files qua `/uploads/*`
- Nginx reverse proxy serve ảnh tĩnh → hiệu năng cao
- Dung lượng ảnh F&B nhỏ → disk server dư sức chứa

**Trade-off:** Không có CDN và auto-backup bởi cloud. Cần tự backup thư mục `/uploads` định kỳ. Nếu scale multi-server trong tương lai → cân nhắc chuyển sang S3

