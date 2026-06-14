# REQUIREMENTS SPECIFICATION — THE FAT MILK

**Dự án:** Hệ thống Quản lý Chuỗi Tiệm Bánh & Đồ uống — TMĐT Tích hợp  
**Agent:** AG-01 — Business Analyst  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-06-13  
**Cập nhật:** 2026-06-13 — Giải quyết toàn bộ Pending Issues theo xác nhận PM  

---

## I. PHẠM VI HỆ THỐNG (SCOPE)

### IN-SCOPE

| # | Phân hệ | Mô tả |
|---|---------|-------|
| 1 | **PWA App (Khách hàng)** | Ứng dụng di động dạng Progressive Web App: xem sản phẩm, đặt hàng, ví điện tử, điểm thưởng, CRM phân hạng |
| 2 | **POS (Nhân viên chi nhánh)** | Giao diện bán hàng tại quầy: quét barcode, tra CRM, áp dụng ưu đãi, in hóa đơn |
| 3 | **Admin Panel (Chủ chuỗi)** | Quản trị trung tâm: sản phẩm, kho, đơn hàng, CRM, voucher, báo cáo |
| 4 | **Hệ thống CRM phân hạng** | Tự động phân hạng Bronze → Silver → Gold → Diamond theo tổng chi tiêu |
| 5 | **Ví điện tử thành viên** | Nạp tiền qua SePay, trừ ví khi thanh toán, đối soát |
| 6 | **Điểm thưởng (Reward Points)** | Tích điểm từ đơn hàng, quy đổi điểm → giảm giá |
| 7 | **Quản lý kho đa chi nhánh** | Tồn kho riêng theo branch_id, chuyển kho, xuất-nhập-tồn |
| 8 | **Tích hợp SePay** | Webhook xác nhận chuyển khoản, tạo QR động, đối soát giao dịch |
| 9 | **Giao hàng (Delivery)** | Ship tự giao bởi quán hoặc book ship bên ngoài (Grab, AhaMove...) |

### OUT-OF-SCOPE

- Quản lý nguyên vật liệu & sản xuất (tạm bỏ theo yêu cầu PM)
- Kế toán / sổ sách / hóa đơn điện tử VAT
- Quản lý đội ngũ shipper nội bộ (chỉ gán đơn, không quản lý chi tiết route)
- Ứng dụng Native (iOS/Android) — chỉ dùng PWA
- Chatbot / Live chat hỗ trợ khách hàng
- Loyalty program liên kết đối tác bên ngoài

---

## II. FUNCTIONAL REQUIREMENTS

### Module 1: PWA App — Trang chủ & Giao diện

| Mã | Tên | Mô tả | MoSCoW |
|----|-----|-------|--------|
| REQ-F-001 | Cài đặt PWA | Hiển thị pop-up gợi ý "Thêm The Fat Milk vào màn hình chính" trên thiết bị di động | Must |
| REQ-F-002 | Standalone Mode | Sau cài đặt, app chạy toàn màn hình (không hiển thị thanh URL trình duyệt) | Must |
| REQ-F-003 | Service Workers | Tích hợp Service Workers để cache, tối ưu tải trang < 2s, cho phép xem sản phẩm offline | Must |
| REQ-F-004 | Header cố định | Logo The Fat Milk, thanh tìm kiếm nhanh, icon giỏ hàng (hiển thị số lượng SP) | Must |
| REQ-F-005 | Chọn chi nhánh | Hiển thị chi nhánh hiện tại, cho phép thay đổi. Gợi ý bằng geolocation | Must |
| REQ-F-006 | Banner Slider | Ảnh trượt: chiến dịch marketing, sản phẩm mới ra lò, bánh theo mùa lễ, chương trình nạp ví | Should |
| REQ-F-007 | Thẻ VIP Quick View | Hiển thị nhanh tên khách + tag hạng thành viên trên trang chủ | Should |
| REQ-F-008 | Flash Sale | Đồng hồ đếm ngược + danh sách SP giảm giá (giá gốc gạch ngang + giá đã giảm) | Should |
| REQ-F-009 | Danh mục nhanh | Icon tròn liên kết nhanh đến từng danh mục (Bánh ngọt, Bánh mì, Đồ uống, Topping, Combo) | Must |
| REQ-F-010 | Product Feed | Lưới sản phẩm 2 cột, giá cá nhân hóa theo hạng thành viên, hiển thị tag allergens | Must |

### Module 2: PWA App — Điều hướng & Cá nhân

| Mã | Tên | Mô tả | MoSCoW |
|----|-----|-------|--------|
| REQ-F-011 | Bottom Navigation | 4 tab cố định: Trang chủ, Danh mục, Thông báo, Cá nhân | Must |
| REQ-F-012 | Trang Danh mục | Cây danh mục phân loại toàn bộ sản phẩm | Must |
| REQ-F-013 | Thông báo | Tin nhắn tự động: trạng thái đơn, biến động ví, ưu đãi thăng hạng | Must |
| REQ-F-014 | Trang Cá nhân | Ảnh đại diện, tên, hạng thành viên + progress bar (tiến trình lên hạng) | Must |
| REQ-F-015 | Ví thành viên | Hiển thị số dư, nút "Nạp tiền" tạo QR động qua SePay (có sẵn số tiền + mã định danh) | Must |
| REQ-F-016 | Nạp ví tự động | Sau chuyển khoản thành công, SePay Webhook → cộng số dư ví tự động trong vài giây | Must |
| REQ-F-017 | Điểm thưởng | Hiển thị số điểm, lịch sử tích/trừ điểm | Must |
| REQ-F-018 | Quản lý đơn hàng | Lịch sử mua sắm, bộ lọc trạng thái (Chờ duyệt → Đang giao → Đã giao → Đã hủy) | Must |
| REQ-F-019 | Kho Voucher | Lưu trữ và hiển thị mã giảm giá cá nhân | Should |

### Module 3: PWA App — Giỏ hàng & Thanh toán

| Mã | Tên | Mô tả | MoSCoW |
|----|-----|-------|--------|
| REQ-F-020 | Giỏ hàng | Thêm/sửa/xóa sản phẩm, hiển thị giá đã giảm theo hạng | Must |
| REQ-F-021 | Giảm giá theo hạng | Giá SP tự động giảm theo hạng thành viên (Bronze 0%, Silver 1%, Gold 2%, Diamond 5%) — Admin cấu hình được, tạm dùng giá trị này | Must |
| REQ-F-022 | Áp dụng Voucher | Nhập mã voucher từ kho voucher, kiểm tra điều kiện đơn hàng | Must |
| REQ-F-059 | Chọn phương thức giao hàng | Chọn: Tự đến lấy (Pick-up) / Ship quán giao / Book ship ngoài (Grab, AhaMove...) | Must |
| REQ-F-060 | Ghi chú giao hàng | Nhập địa chỉ giao, ghi chú cho shipper | Must |
| REQ-F-023 | Dùng điểm thưởng | Tích chọn "Dùng điểm để giảm giá", quy đổi 1.000 điểm = 10.000đ | Must |
| REQ-F-024 | Ghi chú đơn hàng | Ghi chú cho từng item: "ít đường", "không đá", "thêm kem", "giao lạnh" | Should |
| REQ-F-025 | Thanh toán Ví | Trừ trực tiếp số dư ví thành viên | Must |
| REQ-F-026 | Thanh toán COD | Thanh toán khi nhận hàng | Must |
| REQ-F-027 | Thanh toán QR | Tạo mã QR động qua SePay API để khách chuyển khoản | Must |

### Module 4: POS — Bán hàng tại quầy

| Mã | Tên | Mô tả | MoSCoW |
|----|-----|-------|--------|
| REQ-F-028 | Giao diện POS | Một màn hình chuyên dụng cho nhân viên, tối ưu thao tác nhanh | Must |
| REQ-F-029 | Tìm kiếm SP | Tìm kiếm nhanh hoặc quét Barcode để thêm SP vào đơn | Must |
| REQ-F-030 | Tra CRM khách | Nhập SĐT → hiển thị Tên, Hạng, Số dư ví, Điểm thưởng | Must |
| REQ-F-031 | Ưu đãi tại quầy | Tự động áp chiết khấu theo hạng lên hóa đơn + cho phép nhập voucher | Must |
| REQ-F-032 | Tiêu ví/điểm tại quầy | Hỗ trợ trừ ví hoặc tiêu điểm (yêu cầu mã xác nhận / quét QR ví trên app khách) | Must |
| REQ-F-033 | In hóa đơn | Kết nối máy in nhiệt K80/K57, in đầy đủ: chi nhánh, hạng khách, voucher/điểm, số dư mới | Must |

### Module 5: Admin Panel — Quản lý chuỗi

| Mã | Tên | Mô tả | MoSCoW |
|----|-----|-------|--------|
| REQ-F-034 | Quản lý chi nhánh | CRUD chi nhánh: địa chỉ, SĐT, trạng thái hoạt động | Must |
| REQ-F-035 | Quản lý sản phẩm | CRUD sản phẩm: giá nhập, giá bán, SKU, danh mục, thuộc tính F&B (trọng lượng, thành phần, allergens, hạn sử dụng, nhiệt độ bảo quản). **Hỗ trợ nhiều ảnh sản phẩm** (gallery) | Must |
| REQ-F-036 | Sản phẩm theo mùa | Hỗ trợ SP limited edition (is_seasonal, ngày bắt đầu/kết thúc bán) | Could |
| REQ-F-037 | Combo/Bundle | Tạo combo nhiều SP (1 bánh + 1 đồ uống) với giá ưu đãi | Should |
| REQ-F-038 | Quản lý tồn kho | Phân bổ tồn kho riêng theo chi nhánh, lịch sử xuất-nhập-tồn | Must |
| REQ-F-039 | Chuyển kho | Phiếu chuyển kho giữa các chi nhánh | Should |
| REQ-F-040 | Quản lý đơn hàng | Bộ lọc: theo chi nhánh, theo nguồn đơn (Online PWA / Offline POS) | Must |
| REQ-F-041 | Cấu hình CRM | Thiết lập ngưỡng chi tiêu thăng hạng + % chiết khấu mỗi hạng | Must |
| REQ-F-042 | Thăng/xuống hạng tự động | Hệ thống chạy ngầm: thăng hạng khi đơn "Đã giao" đủ ngưỡng, **xuống hạng** nếu không đạt ngưỡng duy trì trong kỳ đánh giá | Must |
| REQ-F-043 | Cấu hình Ví | Quản lý biến động số dư, đối soát giao dịch SePay | Must |
| REQ-F-044 | Cấu hình Điểm | Cài đặt tỷ lệ tích điểm + tỷ lệ quy đổi điểm → tiền | Must |
| REQ-F-045 | Tạo Voucher | Tạo mã giảm giá: đối tượng áp dụng (tất cả / theo hạng), phạm vi (toàn chuỗi / chi nhánh) | Must |
| REQ-F-046 | Flash Sale | Tạo chương trình giảm giá SP: đối tượng + phạm vi chi nhánh | Should |
| REQ-F-047 | Báo cáo doanh thu | Biểu đồ doanh thu, lợi nhuận theo từng chi nhánh | Must |
| REQ-F-048 | Thống kê SP bán chạy | Báo cáo top sản phẩm bán chạy | Should |
| REQ-F-049 | Báo cáo ví tổng | Tổng số tiền khách đang giữ trong ví thành viên (đối soát tài chính) | Must |
| REQ-F-050 | Quản lý nhân viên | Phân quyền nhân viên theo chi nhánh | Must |

### Module 6: Hệ thống nền (Core System)

| Mã | Tên | Mô tả | MoSCoW |
|----|-----|-------|--------|
| REQ-F-051 | Đăng ký / Đăng nhập | Đăng ký bằng **SĐT + OTP xác thực**. Đăng nhập bằng SĐT + mật khẩu. Quên mật khẩu qua OTP | Must |
| REQ-F-052 | Phân quyền RBAC | 3 role: Admin, Staff, Customer — data ownership theo branch_id | Must |
| REQ-F-053 | Tính total_spent | SUM(order.total_amount) WHERE status = "Đã giao" → dùng để phân hạng | Must |
| REQ-F-054 | Tính điểm thưởng | FLOOR(order_amount / 100,000) × 10 điểm | Must |
| REQ-F-055 | Quy đổi điểm | FLOOR(points_used / 1,000) × 10,000đ giảm giá | Must |
| REQ-F-056 | Tổng thanh toán | subtotal - tier_discount - voucher_discount - points_discount (final ≥ 0) | Must |
| REQ-F-057 | Chống over-selling | Queue-based: request FIFO → DB Transaction + Row-level Locking trên kho chi nhánh | Must |
| REQ-F-058 | Bảo mật ví | DB Transaction + Row-level Locking cho mọi API thay đổi số dư ví/điểm | Must |

---

## III. NON-FUNCTIONAL REQUIREMENTS

| Mã | Loại | Mô tả | MoSCoW |
|----|------|-------|--------|
| REQ-NF-001 | Bảo mật | Toàn bộ hệ thống chạy trên HTTPS. Không chấp nhận HTTP | Must |
| REQ-NF-002 | Bảo mật | Mật khẩu người dùng hash bằng bcrypt/argon2. Không lưu plaintext | Must |
| REQ-NF-003 | Bảo mật | Token verification cho toàn bộ API tài chính. Backend không tin cậy Frontend | Must |
| REQ-NF-004 | Bảo mật | SePay Webhook phải xác thực chữ ký (signature) chống giả mạo | Must |
| REQ-NF-005 | Hiệu năng | Thời gian tải trang PWA < 2 giây | Must |
| REQ-NF-006 | Hiệu năng | Nạp ví qua SePay Webhook xử lý trong vài giây | Must |
| REQ-NF-007 | Khả dụng | Service Workers cho phép xem sản phẩm khi mất mạng (Offline Mode) | Must |
| REQ-NF-008 | Đồng bộ | Real-time sync giữa PWA (online) và POS (offline) trên cùng DB | Must |
| REQ-NF-009 | Toàn vẹn dữ liệu | Số dư ví KHÔNG BAO GIỜ được âm, trong mọi trường hợp race condition | Must |
| REQ-NF-010 | Tương thích | PWA tương thích iOS Safari + Android Chrome | Must |
| REQ-NF-011 | Phần cứng | POS hỗ trợ máy quét Barcode (USB/Bluetooth) + máy in nhiệt K80/K57 | Must |
| REQ-NF-012 | Thiết kế | Mobile-First, cuộn dọc, responsive. **Admin Panel cũng phải responsive trên mobile** | Must |
| REQ-NF-013 | Mở rộng | Kiến trúc multi-branch — dễ mở rộng thêm chi nhánh mới | Should |

---

## IV. PENDING ISSUES — ĐÃ GIẢI QUYẾT ✅

| # | Vấn đề | Quyết định PM (2026-06-13) |
|---|--------|----------------------------|
| 1 | Chiết khấu Bronze/Silver/Diamond | ✅ **Tạm dùng 0%/1%/2%/5%** — Admin cấu hình, sửa sau |
| 2 | Phương thức giao hàng | ✅ **Ship quán giao hoặc book ship ngoài** (Grab, AhaMove...) → Thêm REQ-F-059, REQ-F-060 |
| 3 | Số lượng chi nhánh ban đầu | ✅ **1 chi nhánh**, tên quán: **The Fat Milk** |
| 4 | Đăng ký tài khoản | ✅ **Đăng ký bằng SĐT + OTP xác thực** → Cập nhật REQ-F-051 |
| 5 | Ảnh sản phẩm | ✅ **Nhiều ảnh (gallery)** → Cập nhật REQ-F-035 |
| 6 | Admin Panel responsive | ✅ **Cần responsive mobile** → Cập nhật REQ-NF-012 |
| 7 | Xuống hạng thành viên | ✅ **Có thể xuống hạng** nếu không đạt ngưỡng duy trì → Cập nhật REQ-F-042 |
