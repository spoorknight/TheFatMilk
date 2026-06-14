# API CONTRACTS — THE FAT MILK

**Agent:** AG-02 — System Architect  
**Base URL:** `https://api.thefatmilk.vn/api`  
**Auth:** Bearer JWT (trừ public endpoints)  
**Ngày tạo:** 2026-06-13  

---

## Quy ước chung

- **Response format:** `{ "success": true, "data": {...}, "message": "..." }`
- **Error format:** `{ "success": false, "message": "...", "code": "ERR_XXX" }`
- **Pagination:** `?page=1&limit=20` → response có `meta: { total, page, limit, totalPages }`
- **Soft-delete:** Không trả record có `is_deleted = true`
- **Money:** Luôn dùng BIGINT (VND), không dùng float

---

## 1. Auth Module (`/api/auth`)

| Method | Path | Mô tả | Auth |
|--------|------|-------|------|
| POST | `/auth/register` | Đăng ký bằng SĐT | No |
| POST | `/auth/verify-otp` | Xác thực OTP đăng ký | No |
| POST | `/auth/login` | Đăng nhập SĐT + password | No |
| POST | `/auth/refresh` | Refresh access token | No (refresh token) |
| POST | `/auth/forgot-password` | Gửi OTP reset password | No |
| POST | `/auth/reset-password` | Đặt lại password bằng OTP | No |
| GET | `/auth/me` | Lấy thông tin user hiện tại | Yes |
| PUT | `/auth/me` | Cập nhật profile (tên, avatar) | Yes |

### Register Request/Response

```json
// POST /auth/register
// Request
{
  "phone": "0901234567",
  "full_name": "Nguyễn Văn A",
  "password": "minLength8chars"
}
// Response 200
{
  "success": true,
  "data": { "phone": "0901234567", "otp_sent": true },
  "message": "OTP đã gửi đến SĐT 0901234567"
}

// POST /auth/verify-otp
// Request
{ "phone": "0901234567", "otp": "123456" }
// Response 200
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "phone": "0901234567", "full_name": "Nguyễn Văn A", "role": "customer" },
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}
```

---

## 2. Branch Module (`/api/branches`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/branches` | Danh sách chi nhánh | No | — |
| GET | `/branches/:id` | Chi tiết chi nhánh | No | — |
| POST | `/branches` | Tạo chi nhánh mới | Yes | Admin |
| PUT | `/branches/:id` | Cập nhật chi nhánh | Yes | Admin |
| DELETE | `/branches/:id` | Soft-delete chi nhánh | Yes | Admin |
| GET | `/branches/nearest?lat=&lng=` | Tìm chi nhánh gần nhất | No | — |

---

## 3. Product Module (`/api/products`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/products?branch_id=&category_id=&search=` | Danh sách SP (có tồn kho) | No | — |
| GET | `/products/:id` | Chi tiết SP + gallery + allergens | No | — |
| POST | `/products` | Tạo SP mới | Yes | Admin |
| PUT | `/products/:id` | Cập nhật SP | Yes | Admin |
| DELETE | `/products/:id` | Soft-delete SP | Yes | Admin |
| POST | `/products/:id/images` | Upload ảnh SP (multipart) | Yes | Admin |
| DELETE | `/products/:id/images/:imageId` | Xóa ảnh SP | Yes | Admin |
| GET | `/categories` | Danh sách danh mục | No | — |
| POST | `/categories` | Tạo danh mục | Yes | Admin |
| PUT | `/categories/:id` | Cập nhật danh mục | Yes | Admin |

### Product Response Schema

```json
{
  "id": "uuid",
  "name": "Bánh Tiramisu",
  "slug": "banh-tiramisu",
  "sku": "TFM-CAKE-001",
  "category": { "id": "uuid", "name": "Bánh ngọt" },
  "cost_price": 25000,
  "selling_price": 55000,
  "weight": "350g",
  "ingredients": "Kem cheese, đường, trứng, cà phê, bánh lady finger",
  "allergens": "gluten,sữa,trứng",
  "expiry_days": 3,
  "storage_temp": "2-8°C",
  "is_combo": false,
  "is_seasonal": false,
  "images": [
    { "id": "uuid", "image_url": "https://s3.../cake1.jpg", "is_primary": true },
    { "id": "uuid", "image_url": "https://s3.../cake2.jpg", "is_primary": false }
  ],
  "stock": 25,
  "tier_prices": {
    "bronze": 55000, "silver": 54450, "gold": 53900, "diamond": 52250
  }
}
```

---

## 4. Inventory Module (`/api/inventory`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/inventory?branch_id=` | Tồn kho theo chi nhánh | Yes | Admin, Staff |
| PUT | `/inventory/:id` | Cập nhật tồn kho (import/adjust) | Yes | Admin |
| GET | `/inventory/:id/logs` | Lịch sử xuất-nhập-tồn | Yes | Admin |
| POST | `/inventory/transfer` | Tạo phiếu chuyển kho | Yes | Admin |
| PUT | `/inventory/transfer/:id/complete` | Hoàn tất chuyển kho | Yes | Admin |

---

## 5. CRM Module (`/api/crm`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/crm/tiers` | Danh sách hạng thành viên | Yes | All |
| PUT | `/crm/tiers/:id` | Cập nhật cấu hình hạng | Yes | Admin |
| GET | `/crm/my-tier` | Hạng hiện tại + progress bar | Yes | Customer |
| GET | `/crm/lookup?phone=` | Tra CRM khách (cho POS) | Yes | Staff, Admin |
| POST | `/crm/evaluate` | Trigger đánh giá thăng/xuống hạng | Yes | Admin |

### CRM Lookup Response (POS)

```json
{
  "user": {
    "id": "uuid", "phone": "0901234567", "full_name": "Nguyễn Văn A",
    "tier": { "name": "Gold", "discount_percent": 2.00 },
    "wallet_balance": 350000,
    "points_balance": 1500,
    "total_spent": 5200000
  }
}
```

---

## 6. Wallet Module (`/api/wallet`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/wallet` | Số dư ví hiện tại | Yes | Customer |
| GET | `/wallet/transactions?type=&page=` | Lịch sử giao dịch ví | Yes | Customer |
| POST | `/wallet/topup` | Tạo lệnh nạp tiền → QR SePay | Yes | Customer |
| POST | `/wallet/deduct` | Trừ ví (internal, cho order service) | Internal | — |
| GET | `/wallet/admin/summary` | Tổng tiền ví toàn hệ thống | Yes | Admin |
| GET | `/wallet/admin/all?page=` | Danh sách ví khách hàng | Yes | Admin |

### Topup Flow

```json
// POST /wallet/topup
// Request
{ "amount": 200000 }
// Response 200
{
  "success": true,
  "data": {
    "qr_url": "https://qr.sepay.vn/img?...",
    "qr_data": "00020101...",
    "amount": 200000,
    "content": "TFM NAPVI 0901234567",
    "expires_at": "2026-06-13T01:15:00Z"
  }
}
```

---

## 7. SePay Webhook (`/api/webhook`)

| Method | Path | Mô tả | Auth |
|--------|------|-------|------|
| POST | `/webhook/sepay` | Nhận webhook từ SePay khi CK thành công | Signature verify |

### Webhook Handler

```json
// POST /webhook/sepay  (SePay gửi)
{
  "id": "sepay_tx_123",
  "gateway": "MBBank",
  "transferAmount": 200000,
  "content": "TFM NAPVI 0901234567",
  "transferType": "in",
  "signature": "hmac_sha256_..."
}
// Response 200 (bắt buộc trả 200 để SePay không retry)
{ "success": true }
```

---

## 8. Points Module (`/api/points`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/points` | Số điểm hiện tại | Yes | Customer |
| GET | `/points/history?type=&page=` | Lịch sử tích/tiêu điểm | Yes | Customer |
| POST | `/points/preview-redeem` | Preview quy đổi (không trừ) | Yes | Customer |

---

## 9. Order Module (`/api/orders`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| POST | `/orders` | Tạo đơn hàng (PWA hoặc POS) | Yes | Customer, Staff |
| GET | `/orders?status=&page=` | Danh sách đơn (customer: own, admin: all) | Yes | All |
| GET | `/orders/:id` | Chi tiết đơn hàng | Yes | All (scoped) |
| PUT | `/orders/:id/status` | Cập nhật trạng thái đơn | Yes | Admin, Staff |
| POST | `/orders/:id/cancel` | Hủy đơn (refund nếu đã trả ví) | Yes | Customer, Admin |

### Create Order Request

```json
// POST /orders
{
  "branch_id": "uuid",
  "source": "pwa",
  "items": [
    { "product_id": "uuid", "quantity": 2, "note": "ít đường" },
    { "product_id": "uuid", "quantity": 1, "note": null }
  ],
  "delivery_method": "self_ship",
  "delivery_address": "123 Nguyễn Huệ, Q1, TP.HCM",
  "delivery_note": "Gọi trước khi giao",
  "payment_method": "wallet",
  "voucher_code": "WELCOME50K",
  "use_points": true,
  "points_amount": 1000
}
```

### Create Order Response

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "TFM-20260613-001",
      "status": "pending",
      "subtotal": 165000,
      "tier_discount": 3300,
      "voucher_discount": 50000,
      "points_discount": 10000,
      "delivery_fee": 15000,
      "total_amount": 116700,
      "payment_method": "wallet",
      "payment_status": "paid"
    }
  }
}
```

---

## 10. Voucher Module (`/api/vouchers`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/vouchers/my` | Voucher khả dụng cho customer | Yes | Customer |
| POST | `/vouchers/validate` | Kiểm tra voucher hợp lệ | Yes | Customer |
| POST | `/vouchers` | Tạo voucher mới | Yes | Admin |
| GET | `/vouchers?page=` | Danh sách voucher (admin) | Yes | Admin |
| PUT | `/vouchers/:id` | Cập nhật voucher | Yes | Admin |
| POST | `/flash-sales` | Tạo Flash Sale | Yes | Admin |
| GET | `/flash-sales/active` | Flash Sale đang diễn ra | No | — |

---

## 11. Notification Module (`/api/notifications`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/notifications?page=` | Danh sách thông báo | Yes | Customer |
| PUT | `/notifications/:id/read` | Đánh dấu đã đọc | Yes | Customer |
| PUT | `/notifications/read-all` | Đánh dấu tất cả đã đọc | Yes | Customer |
| GET | `/notifications/unread-count` | Số thông báo chưa đọc | Yes | Customer |

---

## 12. Report Module (`/api/reports`)

| Method | Path | Mô tả | Auth | Roles |
|--------|------|-------|------|-------|
| GET | `/reports/revenue?branch_id=&from=&to=` | Doanh thu theo thời gian | Yes | Admin |
| GET | `/reports/top-products?branch_id=&limit=` | SP bán chạy | Yes | Admin |
| GET | `/reports/wallet-summary` | Tổng tiền ví toàn hệ thống | Yes | Admin |
| GET | `/reports/orders-summary?branch_id=` | Tổng hợp đơn hàng | Yes | Admin |

---

## Error Codes

| Code | HTTP | Mô tả |
|------|------|-------|
| `ERR_UNAUTHORIZED` | 401 | Chưa đăng nhập hoặc token hết hạn |
| `ERR_FORBIDDEN` | 403 | Không có quyền truy cập |
| `ERR_NOT_FOUND` | 404 | Resource không tồn tại |
| `ERR_VALIDATION` | 422 | Dữ liệu đầu vào không hợp lệ |
| `ERR_DUPLICATE` | 409 | SĐT đã đăng ký, SKU trùng |
| `ERR_OTP_INVALID` | 400 | OTP sai hoặc hết hạn |
| `ERR_INSUFFICIENT_BALANCE` | 400 | Số dư ví không đủ |
| `ERR_INSUFFICIENT_POINTS` | 400 | Không đủ điểm |
| `ERR_OUT_OF_STOCK` | 400 | SP hết hàng tại chi nhánh |
| `ERR_VOUCHER_INVALID` | 400 | Voucher hết hạn/đã dùng/không đủ điều kiện |
| `ERR_SEPAY_SIGNATURE` | 400 | Webhook SePay signature không hợp lệ |
| `ERR_RATE_LIMITED` | 429 | Quá nhiều request |
| `ERR_INTERNAL` | 500 | Lỗi hệ thống nội bộ |
