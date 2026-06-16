# IMPLEMENTATION PLAN: SPRINT 1 & 2 (FOUNDATION & FINANCIAL CORE)

**Kịch bản:** Scenario 1 - Greenfield (Phân rã mức Class/File/Logic)
**Agent:** AG-03 (Developer)
**Trạng thái:** Chờ PM phê duyệt

Bản kế hoạch này đã được tham chiếu chéo chắt chẽ với `Requirements_Spec.md`, `Database_Schema.md` và `API_Contracts.md` nhằm bảo đảm KHÔNG bỏ sót bất kỳ một Business Logic hay Non-functional Requirement nào (đặc biệt là Row-level locking, Idempotency, Logic hạ hạng, Mã hóa HMAC).

---

## SPRINT 1: BACKEND FOUNDATION

### 1. MODULE M-AUTH (Core, Users & Staff)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S1-M1-T00** | Infra | `docker-compose.yml`, `.env` | Setup PostgreSQL 16 & Redis 7. Đảm bảo chạy trước khi migrate. |
| **S1-M1-T01** | Core | `src/core/middlewares/error.middleware.ts` | Bắt Validation Error (Zod), JWT Error, Custom AppError -> xuất HTTP 400/401/403/404/500 tương ứng. |
| **S1-M1-T02** | DB | `prisma/schema.prisma` | Bảng `users`, `otp_codes`, `staff_branches`. Tích hợp Prisma Init & Migrate. Set `phone` UNIQUE, `is_deleted` = false. |
| **S1-M1-T03** | Domain | `src/modules/auth/domain/...` | Entity `User`. Interface `IUserRepository`, `ITokenService`, `IOtpService`. |
| **S1-M1-T04** | Infra | `src/modules/auth/infrastructure/...` | Implement JWT Service (expires), OTP Service (lưu OTP vào bảng `otp_codes` hoặc Redis với TTL 5 phút, bcrypt hash mật khẩu). |
| **S1-M1-T05** | App | `register.usecase.ts` | **Nghiệp vụ:** Nhận SĐT, Tên, Pass -> Băm pass -> Check trùng SĐT (`ERR_DUPLICATE`) -> Sinh OTP & lưu. |
| **S1-M1-T06** | App | `verify-otp.usecase.ts`, `login.usecase.ts` | **Nghiệp vụ:** So OTP -> Đổi state sang active -> Cấp Access/Refresh Token. Đăng nhập: check pass. |
| **S1-M1-T07** | App | `profile.usecase.ts`, `password.usecase.ts` | **Nghiệp vụ:** Get/Update Profile. Quên mật khẩu: Yêu cầu SĐT -> Gửi OTP -> Xác thực OTP -> Cập nhật pass mới. |
| **S1-M1-T08** | API | `auth.controller.ts`, `auth.middleware.ts` | Bọc Zod Validation. Phân quyền Role-based (`Admin`, `Staff`, `Customer`). |

---

### 2. MODULE M-BRANCH (Chi nhánh)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S1-M2-T01** | DB | `prisma/schema.prisma` | Bảng `branches` với lat, lng (DECIMAL 10,8). |
| **S1-M2-T02** | App/Infra | `branch.repository.ts`, `branch.usecase.ts` | **Nghiệp vụ:** CRUD Chi nhánh. Hàm `findNearest(lat, lng)` dùng toán tử Haversine tính khoảng cách. Chỉ trả về `is_active=true`. |
| **S1-M2-T03** | API | `branch.controller.ts` | **Nghiệp vụ:** Admin có quyền Write. Customer/PWA được quyền GET public. |

---

### 3. MODULE M-PRODUCT (Sản phẩm & Danh mục)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S1-M3-T01** | DB | `prisma/schema.prisma` | Bảng `categories`, `products`, `product_images`, `combo_products`. |
| **S1-M3-T02** | Infra | `local-storage.service.ts` | **Nghiệp vụ:** Lưu file vật lý vào `/uploads/`. Tự động tạo thư mục nếu thiếu. |
| **S1-M3-T03** | App | `upload-image.usecase.ts` | **Nghiệp vụ:** Check file size < 5MB, JPG/PNG, gọi `local-storage.service`, lưu bảng `product_images` (đặt `is_primary` nếu là ảnh đầu tiên). |
| **S1-M3-T04** | App | `product.usecase.ts` | **Nghiệp vụ:** Create/Update sản phẩm. Phải lưu các trường F&B (`allergens`, `expiry_days`, `storage_temp`). Kiểm tra SKU duy nhất (`ERR_DUPLICATE`). |
| **S1-M3-T05** | App | `combo.usecase.ts` | **Nghiệp vụ:** Validation combo: Check sản phẩm con có tồn tại và đang active không trước khi lưu vào `combo_products`. |
| **S1-M3-T06** | App | `get-products.usecase.ts` | **Nghiệp vụ:** API danh sách phải lọc theo `is_seasonal` (chỉ hiển thị nếu thời gian hiện tại nằm trong khoảng `seasonal_start` và `seasonal_end`). |
| **S1-M3-T07** | API | `product.controller.ts`, `upload.middleware.ts` | Setup `multer` middleware. Public file tĩnh `/uploads` trong Express app. |

---

### 4. MODULE M-INVENTORY (Tồn kho chống Over-selling)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S1-M4-T01** | DB | `prisma/schema.prisma` | Bảng `inventory`, `inventory_logs`, `stock_transfers`. Unique(`product_id`, `branch_id`). |
| **S1-M4-T02** | Infra | `prisma-inventory.repository.ts` | **Nghiệp vụ CỐT LÕI (Row-level Locking):** Khi trừ kho bán hàng, bắt buộc dùng Transaction + `$executeRaw` với `SELECT stock FROM inventory WHERE ... FOR UPDATE` hoặc dùng atomic update `increment`/`decrement` của Prisma để tránh Race Condition. |
| **S1-M4-T03** | App | `adjust-stock.usecase.ts` | **Nghiệp vụ:** Cập nhật kho phải đi kèm việc GHI LOG vào `inventory_logs` (loại: `import`, `export`, `sale`). Ném lỗi `ERR_OUT_OF_STOCK` nếu xuất quá tồn. |
| **S1-M4-T04** | App | `transfer.usecase.ts` | **Nghiệp vụ:** Phiếu chuyển kho. Khi status chuyển thành `completed`, hệ thống gọi Transaction để TRỪ kho A và CỘNG kho B đồng thời. Ghi log `transfer_out` và `transfer_in`. |

---

### 5. MODULE M-CRM (Phân hạng tự động)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S1-M5-T01** | DB | `prisma/seed.ts` | Bảng `customer_tiers`. Seed data: Bronze (0%), Silver (1%), Gold (2%), Diamond (5%). |
| **S1-M5-T02** | App | `evaluate-tier.usecase.ts` | **Nghiệp vụ (THĂNG/XUỐNG HẠNG):**<br>- So sánh `total_spent` của user với `min_spent` của Tiers (để thăng hạng).<br>- So sánh với `maintain_spent` (để kiểm tra xem có bị rớt hạng không).<br>- Cập nhật `tier_id` và `tier_evaluated_at` vào bảng `users`. |
| **S1-M5-T03** | App | `lookup.usecase.ts` | **Nghiệp vụ:** API Lookup cho POS (quét SĐT). Trả về tổng hợp: User Info, Tên Hạng, % Giảm giá, Số dư Ví, Số dư Điểm. |

---

## SPRINT 2: FINANCIAL CORE (Tài chính, Ví & Khuyến mãi)

### 6. MODULE M-WALLET (Ví điện tử & Idempotency)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S2-M6-T01** | DB | `prisma/schema.prisma` | Bảng `wallets`, `wallet_transactions`. Constraint: `balance >= 0`. |
| **S2-M6-T02** | Infra | `prisma-wallet.repository.ts` | **Nghiệp vụ CỐT LÕI (Idempotency & Lock):** Update balance bằng Database Transaction. Bắt buộc kiểm tra `idempotency_key` trong `wallet_transactions` để chống cộng tiền 2 lần cho cùng 1 payload. |
| **S2-M6-T03** | App | `topup-wallet.usecase.ts` | **Nghiệp vụ:** Sinh mã định danh nạp tiền (VD: `TFM NAPVI <phone>`) và tạo link QR code SePay (`https://qr.sepay.vn/img?...`). |
| **S2-M6-T04** | App | `deduct-wallet.usecase.ts` | **Nghiệp vụ:** Trừ tiền ví. Kiểm tra `balance_before >= amount`. Ném lỗi `ERR_INSUFFICIENT_BALANCE` nếu không đủ. Ghi log `wallet_transactions` (loại `payment`). |

### 7. MODULE M-SEPAY (Tích hợp Webhook tự động)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S2-M7-T01** | App | `verify-sepay-signature.service.ts` | **Nghiệp vụ (Bảo mật):** Đọc Header của SePay webhook, tạo mã băm HMAC-SHA256 với Secret Key, so sánh chữ ký. Ném `ERR_SEPAY_SIGNATURE` nếu sai. |
| **S2-M7-T02** | App | `sepay-webhook.usecase.ts` | **Nghiệp vụ:** Xử lý Payload. Parse cú pháp `TFM NAPVI <phone>` trong `content`. Tìm Wallet tương ứng -> Tạo `idempotency_key` từ `sepay_transaction_id` -> Gọi `TopupWalletUseCase` cộng tiền. |
| **S2-M7-T03** | API | `sepay.controller.ts` | Endpoint POST `/api/webhook/sepay`. Trả về `HTTP 200 OK` nhanh chóng theo tiêu chuẩn webhook. |

### 8. MODULE M-POINTS (Điểm thưởng)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S2-M8-T01** | DB | `prisma/schema.prisma` | Bảng `points_ledger`. |
| **S2-M8-T02** | App | `earn-points.usecase.ts` | **Nghiệp vụ (Tích điểm):** Nhận tham số tiền đơn hàng (VD: 500,000). Công thức: `FLOOR(500,000 / 100,000) * 10 = 50 điểm`. Cập nhật `points_balance` ở `users` và ghi `points_ledger` (loại `earn`). |
| **S2-M8-T03** | App | `redeem-points.usecase.ts` | **Nghiệp vụ (Tiêu điểm):** Công thức: `FLOOR(points / 1000) * 10,000 VND`. Trừ điểm, ghi log `redeem`. Check lỗi `ERR_INSUFFICIENT_POINTS`. |

### 9. MODULE M-VOUCHER (Khuyến mãi & Flash Sale)
| Task ID | Lớp (Layer) | File | Business Logic / Ràng buộc (Constraints) |
|---------|-------------|------|------------------------------------------|
| **S2-M9-T01** | DB | `prisma/schema.prisma` | Bảng `vouchers`, `voucher_usage`, `flash_sales`, `flash_sale_products`. |
| **S2-M9-T02** | App | `validate-voucher.usecase.ts` | **Nghiệp vụ cốt lõi:** Lọc qua 5 tầng điều kiện:<br>1. Ngày active (`start_date`, `end_date`)<br>2. `min_order` (Tổng tiền >= ngưỡng)<br>3. `usage_limit` (Đã hết lượt dùng chung chưa?)<br>4. `per_user_limit` (User này đã dùng quá số lần cho phép chưa ở `voucher_usage`?)<br>5. `target_tier` / `target_branch` có khớp không?<br>Ném `ERR_VOUCHER_INVALID` nếu vi phạm. |
| **S2-M9-T03** | App | `flash-sale.usecase.ts` | **Nghiệp vụ:** Trigger Flash Sale: Check `start_time` & `end_time`. Khi mua sản phẩm Flash Sale, sử dụng logic Row-level lock để trừ `stock_limit` (chống bán lố lượng SP sale). |

---

## KIỂM SOÁT DEPENDENCY TRƯỚC KHI CODE
* M-AUTH làm nền cho mọi module. M-BRANCH và M-PRODUCT phải có trước M-INVENTORY.
* M-WALLET phải xong phần Transaction Core thì M-SEPAY Webhook mới có thể cắm vào.
* DB Layer: Phải chạy thành công DB migration với ĐỦ 23 bảng trước khi code các module.

*(Kế hoạch này đảm bảo Dev AG-03 không bị sót bất kỳ logic bảo mật hay nghiệp vụ nào được đề ra từ AG-01 và AG-02)*
