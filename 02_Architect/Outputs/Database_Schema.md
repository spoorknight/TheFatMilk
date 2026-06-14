# DATABASE SCHEMA — THE FAT MILK

**Agent:** AG-02 — System Architect  
**Database:** PostgreSQL 16  
**ORM:** Prisma  
**Ngày tạo:** 2026-06-13  

---

## Quy ước chung

- **Primary Key:** UUID v4 (`id`)
- **Timestamps:** `created_at`, `updated_at` (auto)
- **Soft Delete:** `is_deleted` (boolean, default false) + `deleted_at` (nullable timestamp)
- **Naming:** snake_case cho tất cả table & column
- **Index:** Tự động trên PK + FK. Thêm index tùy chỉnh cho query thường dùng

---

## 1. Entity List

| # | Table | Mô tả | Liên kết chính |
|---|-------|-------|----------------|
| 1 | `users` | Tài khoản (Customer, Staff, Admin) | — |
| 2 | `branches` | Chi nhánh | — |
| 3 | `categories` | Danh mục sản phẩm | — |
| 4 | `products` | Sản phẩm (bánh, đồ uống, topping) | → categories |
| 5 | `product_images` | Gallery ảnh sản phẩm | → products |
| 6 | `combo_products` | SP con trong combo | → products (parent + child) |
| 7 | `inventory` | Tồn kho theo chi nhánh | → products, branches |
| 8 | `inventory_logs` | Lịch sử xuất-nhập-tồn | → inventory |
| 9 | `stock_transfers` | Phiếu chuyển kho | → branches (from, to) |
| 10 | `customer_tiers` | Cấu hình hạng thành viên | — |
| 11 | `wallets` | Ví điện tử khách hàng | → users |
| 12 | `wallet_transactions` | Lịch sử giao dịch ví | → wallets |
| 13 | `points_ledger` | Lịch sử tích/tiêu điểm | → users |
| 14 | `orders` | Đơn hàng | → users, branches |
| 15 | `order_items` | Chi tiết đơn hàng | → orders, products |
| 16 | `vouchers` | Mã giảm giá | — |
| 17 | `voucher_usage` | Lịch sử sử dụng voucher | → vouchers, users, orders |
| 18 | `flash_sales` | Chương trình Flash Sale | — |
| 19 | `flash_sale_products` | SP trong Flash Sale | → flash_sales, products |
| 20 | `notifications` | Thông báo khách hàng | → users |
| 21 | `sepay_transactions` | Log giao dịch SePay | → wallets |
| 22 | `otp_codes` | Mã OTP tạm (Redis backup) | → users |
| 23 | `staff_branches` | Phân quyền nhân viên - chi nhánh | → users, branches |

---

## 2. SQL DDL

### 2.1. users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(15) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    role            VARCHAR(20) NOT NULL DEFAULT 'customer',  -- 'admin', 'staff', 'customer'
    tier_id         UUID REFERENCES customer_tiers(id),
    total_spent     BIGINT NOT NULL DEFAULT 0,                -- VND, tích lũy từ đơn "Đã giao"
    points_balance  INT NOT NULL DEFAULT 0,                   -- Điểm thưởng hiện có
    tier_evaluated_at TIMESTAMP,                              -- Lần cuối đánh giá hạng
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone) WHERE is_deleted = FALSE;
CREATE INDEX idx_users_role ON users(role) WHERE is_deleted = FALSE;
CREATE INDEX idx_users_tier ON users(tier_id);
```

### 2.2. branches

```sql
CREATE TABLE branches (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,           -- "The Fat Milk"
    address     VARCHAR(500) NOT NULL,
    phone       VARCHAR(15),
    latitude    DECIMAL(10, 8),
    longitude   DECIMAL(11, 8),
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2.3. categories

```sql
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,           -- "Bánh ngọt", "Đồ uống"...
    slug        VARCHAR(100) UNIQUE NOT NULL,
    icon_url    VARCHAR(500),
    sort_order  INT NOT NULL DEFAULT 0,
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2.4. products

```sql
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID NOT NULL REFERENCES categories(id),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    description     TEXT,
    sku             VARCHAR(50) UNIQUE NOT NULL,
    cost_price      BIGINT NOT NULL DEFAULT 0,        -- Giá nhập (VND)
    selling_price   BIGINT NOT NULL DEFAULT 0,        -- Giá bán lẻ (VND)
    weight          VARCHAR(50),                       -- "500g", "350ml"
    ingredients     TEXT,                               -- Thành phần nguyên liệu
    allergens       VARCHAR(500),                      -- "gluten,sữa,trứng"
    expiry_days     INT,                               -- Số ngày HSD từ khi nhập
    storage_temp    VARCHAR(50),                        -- "2-8°C", "Nhiệt độ phòng"
    is_combo        BOOLEAN NOT NULL DEFAULT FALSE,
    combo_price     BIGINT,                            -- Giá combo ưu đãi
    is_seasonal     BOOLEAN NOT NULL DEFAULT FALSE,
    seasonal_start  DATE,
    seasonal_end    DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_seasonal ON products(is_seasonal, seasonal_start, seasonal_end) WHERE is_seasonal = TRUE;
```

### 2.5. product_images

```sql
CREATE TABLE product_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
```

### 2.6. combo_products

```sql
CREATE TABLE combo_products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combo_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id),
    quantity    INT NOT NULL DEFAULT 1,
    UNIQUE(combo_id, product_id)
);
```

### 2.7. inventory

```sql
CREATE TABLE inventory (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id),
    branch_id   UUID NOT NULL REFERENCES branches(id),
    stock       INT NOT NULL DEFAULT 0,
    min_stock   INT NOT NULL DEFAULT 5,            -- Ngưỡng cảnh báo hết hàng
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, branch_id)
);

CREATE INDEX idx_inventory_branch ON inventory(branch_id);
CREATE INDEX idx_inventory_product_branch ON inventory(product_id, branch_id);
```

### 2.8. inventory_logs

```sql
CREATE TABLE inventory_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id    UUID NOT NULL REFERENCES inventory(id),
    change_type     VARCHAR(20) NOT NULL,          -- 'import', 'export', 'sale', 'transfer_in', 'transfer_out', 'adjustment'
    quantity_change INT NOT NULL,                   -- +/- giá trị
    stock_after     INT NOT NULL,
    reference_id    UUID,                           -- order_id hoặc stock_transfer_id
    note            TEXT,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inv_logs_inventory ON inventory_logs(inventory_id);
CREATE INDEX idx_inv_logs_created ON inventory_logs(created_at);
```

### 2.9. stock_transfers

```sql
CREATE TABLE stock_transfers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_branch_id  UUID NOT NULL REFERENCES branches(id),
    to_branch_id    UUID NOT NULL REFERENCES branches(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    quantity        INT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'completed', 'cancelled'
    note            TEXT,
    created_by      UUID NOT NULL REFERENCES users(id),
    completed_at    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2.10. customer_tiers

```sql
CREATE TABLE customer_tiers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(50) NOT NULL,       -- 'Bronze', 'Silver', 'Gold', 'Diamond'
    slug                VARCHAR(50) UNIQUE NOT NULL,
    min_spent           BIGINT NOT NULL,             -- Ngưỡng thăng hạng (VND)
    maintain_spent      BIGINT NOT NULL DEFAULT 0,   -- Ngưỡng duy trì hạng (VND/kỳ)
    discount_percent    DECIMAL(5,2) NOT NULL,       -- 0.00, 1.00, 2.00, 5.00
    sort_order          INT NOT NULL DEFAULT 0,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed data
INSERT INTO customer_tiers (name, slug, min_spent, maintain_spent, discount_percent, sort_order) VALUES
('Bronze', 'bronze', 0, 0, 0.00, 1),
('Silver', 'silver', 2000000, 1000000, 1.00, 2),
('Gold', 'gold', 5000000, 3000000, 2.00, 3),
('Diamond', 'diamond', 10000000, 7000000, 5.00, 4);
```

### 2.11. wallets

```sql
CREATE TABLE wallets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID UNIQUE NOT NULL REFERENCES users(id),
    balance     BIGINT NOT NULL DEFAULT 0,         -- VND, KHÔNG BAO GIỜ ÂM
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT wallet_balance_positive CHECK (balance >= 0)
);
```

### 2.12. wallet_transactions

```sql
CREATE TABLE wallet_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id       UUID NOT NULL REFERENCES wallets(id),
    type            VARCHAR(20) NOT NULL,          -- 'topup', 'payment', 'refund'
    amount          BIGINT NOT NULL,               -- Luôn dương
    balance_before  BIGINT NOT NULL,
    balance_after   BIGINT NOT NULL,
    reference_type  VARCHAR(30),                   -- 'sepay', 'order', 'admin_adjust'
    reference_id    VARCHAR(100),                  -- sepay_transaction_id hoặc order_id
    idempotency_key VARCHAR(100) UNIQUE,           -- Chống duplicate
    note            TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_tx_idempotency ON wallet_transactions(idempotency_key);
```

### 2.13. points_ledger

```sql
CREATE TABLE points_ledger (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    type            VARCHAR(20) NOT NULL,          -- 'earn', 'redeem'
    points          INT NOT NULL,                  -- Luôn dương
    balance_before  INT NOT NULL,
    balance_after   INT NOT NULL,
    reference_type  VARCHAR(30),                   -- 'order', 'admin_adjust'
    reference_id    UUID,
    note            TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_points_user ON points_ledger(user_id);
```

### 2.14. orders

```sql
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number    VARCHAR(20) UNIQUE NOT NULL,    -- "TFM-20260613-001"
    user_id         UUID NOT NULL REFERENCES users(id),
    branch_id       UUID NOT NULL REFERENCES branches(id),
    source          VARCHAR(10) NOT NULL,           -- 'pwa', 'pos'
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'delivering', 'delivered', 'cancelled'
    
    -- Delivery
    delivery_method VARCHAR(20) NOT NULL DEFAULT 'pickup',  -- 'pickup', 'self_ship', 'external_ship'
    delivery_address TEXT,
    delivery_note   TEXT,
    
    -- Pricing
    subtotal        BIGINT NOT NULL,
    tier_discount   BIGINT NOT NULL DEFAULT 0,
    voucher_discount BIGINT NOT NULL DEFAULT 0,
    points_discount BIGINT NOT NULL DEFAULT 0,
    delivery_fee    BIGINT NOT NULL DEFAULT 0,
    total_amount    BIGINT NOT NULL,
    
    -- Payment
    payment_method  VARCHAR(20) NOT NULL,           -- 'wallet', 'cod', 'qr_sepay'
    payment_status  VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'paid', 'refunded'
    
    -- References
    voucher_id      UUID REFERENCES vouchers(id),
    points_used     INT NOT NULL DEFAULT 0,
    
    -- Staff (POS)
    staff_id        UUID REFERENCES users(id),      -- NULL nếu online
    
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_branch ON orders(branch_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_status ON orders(status) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at);
```

### 2.15. order_items

```sql
CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id),
    quantity    INT NOT NULL,
    unit_price  BIGINT NOT NULL,               -- Giá tại thời điểm mua
    subtotal    BIGINT NOT NULL,               -- quantity × unit_price
    note        VARCHAR(500),                  -- "ít đường", "không đá"
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### 2.16. vouchers

```sql
CREATE TABLE vouchers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) UNIQUE NOT NULL,
    type            VARCHAR(20) NOT NULL,           -- 'percent', 'fixed'
    value           BIGINT NOT NULL,                 -- % hoặc VND
    min_order       BIGINT NOT NULL DEFAULT 0,       -- Đơn tối thiểu
    max_discount    BIGINT,                          -- Giảm tối đa (cho type=percent)
    target_tier     VARCHAR(50),                     -- NULL = tất cả, 'gold,diamond' = chỉ hạng đó
    target_branch   UUID REFERENCES branches(id),    -- NULL = toàn chuỗi
    usage_limit     INT NOT NULL DEFAULT 1,          -- Tổng lượt sử dụng
    used_count      INT NOT NULL DEFAULT 0,
    per_user_limit  INT NOT NULL DEFAULT 1,
    start_date      TIMESTAMP NOT NULL,
    end_date        TIMESTAMP NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_vouchers_dates ON vouchers(start_date, end_date) WHERE is_active = TRUE;
```

### 2.17. voucher_usage

```sql
CREATE TABLE voucher_usage (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id  UUID NOT NULL REFERENCES vouchers(id),
    user_id     UUID NOT NULL REFERENCES users(id),
    order_id    UUID NOT NULL REFERENCES orders(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(voucher_id, user_id, order_id)
);
```

### 2.18. flash_sales & flash_sale_products

```sql
CREATE TABLE flash_sales (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    target_tier     VARCHAR(50),                     -- NULL = tất cả
    target_branch   UUID REFERENCES branches(id),    -- NULL = toàn chuỗi
    start_time      TIMESTAMP NOT NULL,
    end_time        TIMESTAMP NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE flash_sale_products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flash_sale_id   UUID NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id),
    original_price  BIGINT NOT NULL,
    sale_price      BIGINT NOT NULL,
    stock_limit     INT,                             -- NULL = không giới hạn
    sold_count      INT NOT NULL DEFAULT 0,
    UNIQUE(flash_sale_id, product_id)
);
```

### 2.19. notifications

```sql
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
    type        VARCHAR(30) NOT NULL,              -- 'order_status', 'wallet_topup', 'tier_change', 'promotion'
    title       VARCHAR(200) NOT NULL,
    body        TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    reference_type VARCHAR(30),
    reference_id   UUID,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

### 2.20. sepay_transactions

```sql
CREATE TABLE sepay_transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sepay_transaction_id VARCHAR(100) UNIQUE NOT NULL,  -- ID từ SePay
    wallet_id           UUID REFERENCES wallets(id),
    amount              BIGINT NOT NULL,
    content             VARCHAR(500),                    -- Nội dung CK
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'confirmed', 'failed'
    raw_webhook         JSONB,                           -- Lưu nguyên webhook data
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2.21. staff_branches

```sql
CREATE TABLE staff_branches (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
    branch_id   UUID NOT NULL REFERENCES branches(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, branch_id)
);
```

---

## 3. Quan hệ tóm tắt (Cardinality)

```
users 1──N wallets (1 user = 1 wallet)
users 1──N orders
users 1──N points_ledger
users N──N branches (qua staff_branches, cho Staff)
users N──1 customer_tiers

products N──1 categories
products 1──N product_images
products 1──N inventory (mỗi branch 1 record)
products N──N products (qua combo_products)

orders 1──N order_items
orders N──1 users
orders N──1 branches
orders N──1 vouchers (nullable)

wallets 1──N wallet_transactions
wallets 1──N sepay_transactions

vouchers 1──N voucher_usage
flash_sales 1──N flash_sale_products
```
