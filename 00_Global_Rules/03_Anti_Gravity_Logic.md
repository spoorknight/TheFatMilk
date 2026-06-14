# THIẾT CHẾ 03: LOGIC MIỀN KINH DOANH (DOMAIN LOGIC)

> **Dự án:** THE FAT MILK — Hệ thống Quản lý Chuỗi Cửa hàng & Thương mại Điện tử Tích hợp
> **Mô hình:** 2-in-1 Omnichannel System (Quản lý nội bộ + Bán hàng đa kênh trực tuyến)
> **Ngành:** F&B / Tiệm bánh & Đồ uống (Bakery & Beverage) — Chuỗi đa chi nhánh (Multi-branch)

---

## 1. Hằng số nghiệp vụ (Business Constants)

### 1.1. Phân hạng thành viên CRM (Customer Tiering)

| Tên hằng số | Giá trị | Đơn vị | Ghi chú |
|---|---|---|---|
| TIER_BRONZE_THRESHOLD | 0 | VND | Hạng mặc định khi đăng ký tài khoản mới |
| TIER_SILVER_THRESHOLD | 2,000,000 | VND | Tổng chi tiêu tích lũy từ đơn hàng "Đã giao" |
| TIER_GOLD_THRESHOLD | 5,000,000 | VND | Tổng chi tiêu tích lũy từ đơn hàng "Đã giao" |
| TIER_DIAMOND_THRESHOLD | 10,000,000 | VND | Tổng chi tiêu tích lũy từ đơn hàng "Đã giao" |

### 1.2. Chiết khấu theo hạng thành viên

| Tên hằng số | Giá trị | Đơn vị | Ghi chú |
|---|---|---|---|
| DISCOUNT_BRONZE | 0 | % | Không có chiết khấu |
| DISCOUNT_SILVER | 1 | % | Giảm trên tổng hóa đơn |
| DISCOUNT_GOLD | 2 | % | Giảm trên tổng hóa đơn (được đề cập trong SRS) |
| DISCOUNT_DIAMOND | 5 | % | Giảm trên tổng hóa đơn |

> **Lưu ý:** Các giá trị chiết khấu (trừ Gold = 2% được ghi rõ trong SRS) là giá trị gợi ý ban đầu.
> Admin có quyền cấu hình lại phần trăm chiết khấu của từng hạng thông qua Admin Panel.

### 1.3. Điểm thưởng (Reward Points)

| Tên hằng số | Giá trị | Đơn vị | Ghi chú |
|---|---|---|---|
| POINTS_EARN_RATE | 10 | điểm / 100,000 VND | Tỷ lệ tích điểm từ hóa đơn (được đề cập trong SRS) |
| POINTS_REDEEM_RATE | 1,000 | điểm = 10,000 VND | Tỷ lệ quy đổi điểm → tiền (được đề cập trong SRS) |
| POINTS_REDEEM_VALUE | 10 | VND / điểm | Quy đổi đơn vị: 1 điểm = 10 VND |

### 1.4. Ví điện tử (E-Wallet)

| Tên hằng số | Giá trị | Đơn vị | Ghi chú |
|---|---|---|---|
| WALLET_TOPUP_METHOD | SePay | — | Nạp tiền qua mã QR động do SePay tạo |
| WALLET_TOPUP_CONFIRM_TIME | Vài giây | giây | Thời gian tự động cộng số dư sau khi SePay Webhook xác nhận |
| WALLET_MIN_BALANCE | 0 | VND | Số dư ví không được âm (tuyệt đối) |

### 1.5. Đơn hàng (Order)

| Tên hằng số | Giá trị | Đơn vị | Ghi chú |
|---|---|---|---|
| ORDER_STATUS_FLOW | Chờ duyệt → Đang giao → Đã giao → Đã hủy | — | Luồng trạng thái đơn hàng |
| ORDER_SOURCE_ONLINE | PWA/App | — | Đơn từ khách hàng trực tuyến |
| ORDER_SOURCE_OFFLINE | POS | — | Đơn từ nhân viên tại quầy |
| PAGE_LOAD_TARGET | 2 | giây | Tối ưu tốc độ tải trang PWA |

### 1.6. Phương thức thanh toán

| Tên hằng số | Giá trị | Đơn vị | Ghi chú |
|---|---|---|---|
| PAYMENT_WALLET | Ví thành viên | — | Trừ trực tiếp số dư ví |
| PAYMENT_COD | COD | — | Thanh toán khi nhận hàng |
| PAYMENT_QR | QR qua SePay | — | Tạo mã QR động qua SePay API |

---

## 2. Ràng buộc cứng (Hard Constraints)

- **HTTPS bắt buộc:** Toàn bộ hệ thống (PWA, POS, Admin) phải chạy trên giao thức HTTPS. Không chấp nhận HTTP.
- **Số dư ví không âm:** Tuyệt đối không cho phép số dư ví thành viên bị âm dù trong bất kỳ trường hợp nào (race condition, bấm nhiều lần, v.v.).
- **Database Transaction cho tài chính:** Mọi API thay đổi số dư ví hoặc điểm thưởng PHẢI sử dụng Database Transaction + Row-level Locking. Flow bắt buộc: Khóa tạm user → Kiểm tra số dư → Trừ tiền → Tạo đơn → Trả kết quả → Mở khóa.
- **Token verification:** Toàn bộ API tài chính phải được ký mã bảo mật (Token verification). Backend KHÔNG tin cậy bất kỳ dữ liệu nào truyền từ Frontend.
- **Chống over-selling:** Khi tồn kho chi nhánh = 1, các request mua cùng lúc phải được đưa vào hàng đợi (Queue). Request đến trước xử lý, request đến sau bị từ chối với thông báo "Sản phẩm đã hết hàng tại chi nhánh này".
- **Tách biệt kho theo chi nhánh:** Tồn kho quản lý riêng biệt theo `branch_id`. Không gộp kho chung.
- **Không lưu plaintext password:** Mật khẩu người dùng phải được hash (bcrypt/argon2) trước khi lưu DB.
- **Thăng hạng chỉ khi đơn "Đã giao":** Hệ thống chỉ tính `total_spent` từ các đơn hàng có trạng thái "Đã giao" (delivered). Đơn "Đã hủy" không được tính.
- **Offline Mode cho PWA:** Service Workers phải cache để cho phép xem sản phẩm ngay cả khi mất mạng.

---

## 3. Quy tắc phân quyền (Authorization Rules)

| Role | Được phép | Không được phép |
|---|---|---|
| **Admin (Chủ chuỗi)** | Quản lý tất cả chi nhánh, CRUD sản phẩm, cấu hình CRM/hạng/ví/điểm, quản lý đơn hàng toàn chuỗi, tạo voucher/flash sale, xem báo cáo doanh thu toàn bộ, phân bổ/điều phối kho giữa các chi nhánh, quản lý nhân viên | — |
| **Staff (Nhân viên chi nhánh)** | Thao tác POS tại chi nhánh được phân công, tìm kiếm sản phẩm/quét barcode, tra cứu CRM khách hàng (bằng SĐT), áp dụng voucher/ưu đãi hạng cho khách tại quầy, hỗ trợ khách tiêu điểm/trừ ví (cần mã xác nhận/QR), in hóa đơn | Truy cập POS/data chi nhánh khác, chỉnh sửa giá sản phẩm, thay đổi cấu hình hệ thống, xem báo cáo tài chính tổng |
| **Customer (Khách hàng)** | Đăng ký/đăng nhập tài khoản, xem sản phẩm (theo chi nhánh đã chọn), đặt hàng online, nạp tiền ví (VietQR), xem số dư ví + điểm thưởng, sử dụng voucher/điểm khi thanh toán, xem lịch sử đơn hàng/giao dịch ví, nhận thông báo, xem hạng thành viên + progress bar | Truy cập Admin Panel, truy cập POS, xem thông tin khách hàng khác, tự thay đổi hạng thành viên, tự cộng số dư ví/điểm |

### Quy tắc data ownership theo chi nhánh

- Nhân viên thuộc `branch_id` = X → chỉ thấy/thao tác dữ liệu POS của chi nhánh X.
- Doanh thu và xuất kho tự động tính cho chi nhánh tương ứng với nhân viên thao tác.
- Khách hàng chọn chi nhánh trước khi xem kho/mua hàng → sản phẩm hiển thị theo tồn kho của chi nhánh đó.

---

## 4. Công thức & thuật toán đặc thù domain

### 4.1. Tính tổng chi tiêu tích lũy (dùng để phân hạng)

```
total_spent = SUM(order.total_amount)
  WHERE order.customer_id = {customer_id}
  AND order.status = "Đã giao"
```

### 4.2. Tự động phân hạng thành viên

```
IF total_spent >= 10,000,000  → tier = DIAMOND
ELIF total_spent >= 5,000,000 → tier = GOLD
ELIF total_spent >= 2,000,000 → tier = SILVER
ELSE                          → tier = BRONZE
```

> Trigger: Hệ thống chạy ngầm quét và thăng hạng khi đơn hàng chuyển sang trạng thái "Đã giao".

### 4.3. Tính điểm thưởng từ đơn hàng

```
points_earned = FLOOR(order.total_amount / 100,000) × 10
```

> Ví dụ: Đơn hàng 350,000 VND → FLOOR(350,000 / 100,000) × 10 = 30 điểm

### 4.4. Quy đổi điểm thưởng thành tiền

```
discount_from_points = FLOOR(points_used / 1,000) × 10,000
```

> Ví dụ: Dùng 2,500 điểm → FLOOR(2,500 / 1,000) × 10,000 = 20,000 VND giảm giá

### 4.5. Tính tổng thanh toán (kết hợp ưu đãi)

```
subtotal           = SUM(product.price × quantity)                   # Giá gốc sản phẩm
tier_discount      = subtotal × (DISCOUNT_{tier}% / 100)             # Giảm theo hạng
voucher_discount   = voucher.value (nếu đủ điều kiện đơn hàng)      # Giảm từ voucher
points_discount    = discount_from_points (nếu khách tích chọn)     # Giảm từ điểm
─────────────────────────────────────────────────────────────────────
final_total        = subtotal - tier_discount - voucher_discount - points_discount
```

> **Ràng buộc:** `final_total >= 0`. Tổng giảm không được vượt quá subtotal.

### 4.6. Xử lý chống over-selling (Queue-based)

```
1. Request mua hàng đến → đưa vào Queue (FIFO)
2. Dequeue request → BEGIN TRANSACTION
3.   SELECT stock FROM inventory WHERE product_id = X AND branch_id = Y FOR UPDATE
4.   IF stock >= requested_quantity:
5.       UPDATE inventory SET stock = stock - requested_quantity
6.       INSERT INTO orders (...)
7.       COMMIT → Trả "Đặt hàng thành công"
8.   ELSE:
9.       ROLLBACK → Trả "Sản phẩm đã hết hàng tại chi nhánh này"
```

---

## 5. Ghi chú đặc thù lĩnh vực

### 5.1. Kiến trúc Multi-Branch (Đa chi nhánh)

- Mỗi chi nhánh vật lý có mã định danh `branch_id` riêng.
- Sản phẩm (catalog) quản lý tập trung (giá nhập, giá bán lẻ, SKU) nhưng **tồn kho tách riêng** theo chi nhánh.
- Thuộc tính sản phẩm đặc thù F&B: trọng lượng/dung tích, thành phần (ingredients), thông tin dị ứng (allergens), hạn sử dụng, nhiệt độ bảo quản.
- Hỗ trợ **phiếu chuyển kho** giữa các chi nhánh (inter-branch stock transfer).
- Khi khách truy cập PWA: yêu cầu chọn chi nhánh (hoặc gợi ý bằng geolocation) → hiển thị tồn kho đúng chi nhánh đó.

### 5.2. PWA (Progressive Web App)

- App phải hiển thị pop-up gợi ý "Thêm The Fat Milk vào màn hình chính" trên mobile.
- Sau cài đặt: chạy toàn màn hình (standalone mode), không hiển thị thanh URL.
- Tích hợp Service Workers cho caching, offline mode (xem sản phẩm khi mất mạng).
- Target load time < 2 giây.

### 5.3. Tích hợp SePay (Cổng thanh toán)

- Nạp ví và thanh toán QR đều qua **SePay API** — tạo mã QR động chứa sẵn số tiền + nội dung định danh khách hàng.
- SePay gửi **Webhook** về backend khi giao dịch chuyển khoản thành công → hệ thống tự động cộng số dư ví trong vài giây.
- Backend phải xác thực chữ ký (signature) của SePay Webhook để chống giả mạo.
- Đối soát giao dịch: Admin có thể tra cứu lịch sử giao dịch SePay để đối chiếu với biến động số dư ví.

### 5.4. POS — Kết nối phần cứng

- Hỗ trợ máy quét mã vạch (Barcode scanner) USB/Bluetooth.
- Kết nối máy in nhiệt K80/K57 để in hóa đơn.
- Hóa đơn in phải bao gồm: tên chi nhánh, hạng thành viên khách, chi tiết giảm giá (voucher/điểm), số dư tài chính mới.

### 5.5. Đặc thù ngành F&B / Tiệm bánh

- **Danh mục sản phẩm:** Bánh ngọt, Bánh mì, Đồ uống (trà sữa, cà phê, nước ép...), Topping, Combo.
- **Hạn sử dụng (Expiry):** Bánh tươi có thời hạn ngắn (trong ngày hoặc 2-3 ngày). Gắn `expiry_date` theo lô nhập kho.
- **Sản phẩm theo mùa / Giới hạn:** Limited edition (bánh Tết, Noel...) — `is_seasonal` + ngày bắt đầu/kết thúc bán.
- **Combo / Bundle:** Tạo combo nhiều sản phẩm (1 bánh + 1 đồ uống) với giá ưu đãi.
- **Ghi chú đơn hàng:** Field `order_item_note` cho từng item ("ít đường", "không đá", "thêm kem").
- **An toàn thực phẩm:** Hiển thị ingredients + cảnh báo allergens (gluten, sữa, trứng, đậu phộng...) trên trang sản phẩm.

### 5.6. Voucher & Flash Sale — Targeted Marketing

- Voucher/Flash sale có thể giới hạn **đối tượng áp dụng**: tất cả khách hàng HOẶC chỉ một/nhóm hạng thành viên cụ thể.
- Phạm vi chương trình: toàn bộ chi nhánh HOẶC chỉ chi nhánh cố định.
- Flash Sale có đồng hồ đếm ngược, hiển thị giá gốc gạch ngang + giá đã giảm.

### 5.7. Real-time Sync

- Mọi giao dịch online (PWA) và offline (POS) phải đồng bộ thời gian thực trên cùng DB.
- Đảm bảo tính chính xác tuyệt đối cho kho và ví điện tử.