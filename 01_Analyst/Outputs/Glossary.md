# GLOSSARY — BẢNG THUẬT NGỮ THE FAT MILK

**Agent:** AG-01 — Business Analyst  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-06-13  

---

## Thuật ngữ nghiệp vụ

| Thuật ngữ | Tiếng Anh | Định nghĩa |
|-----------|-----------|-------------|
| Chi nhánh | Branch | Một cửa hàng vật lý của The Fat Milk, được định danh bằng `branch_id`. Mỗi chi nhánh có kho riêng, nhân viên riêng |
| Hạng thành viên | Customer Tier | Mức phân hạng khách hàng dựa trên tổng chi tiêu tích lũy: Bronze (Đồng) → Silver (Bạc) → Gold (Vàng) → Diamond (Kim Cương) |
| Tổng chi tiêu tích lũy | total_spent | Tổng giá trị tất cả đơn hàng có trạng thái "Đã giao" của một khách hàng. Dùng để tính hạng thành viên |
| Chiết khấu theo hạng | Tier Discount | Phần trăm giảm giá tự động trên tổng hóa đơn dựa theo hạng thành viên (VD: Gold = 2%) |
| Ví thành viên | The Fat Milk Wallet | Ví điện tử nội bộ của hệ thống. Khách nạp tiền qua SePay, dùng để thanh toán đơn hàng |
| Điểm thưởng | Reward Points | Điểm tích lũy từ đơn hàng, quy đổi được thành tiền giảm giá. Tỷ lệ tích: 10 điểm / 100.000đ. Tỷ lệ tiêu: 1.000 điểm = 10.000đ |
| Mã giảm giá | Voucher | Mã coupon giảm giá do Admin tạo, có thể giới hạn theo hạng thành viên và phạm vi chi nhánh |
| Flash Sale | Flash Sale | Chương trình giảm giá SP có thời hạn, kèm đồng hồ đếm ngược. Hiển thị giá gốc gạch ngang + giá đã giảm |
| Đơn hàng | Order | Một giao dịch mua sản phẩm, có thể từ online (PWA) hoặc offline (POS). Trạng thái: Chờ duyệt → Đang giao → Đã giao → Đã hủy |
| Ghi chú item | Order Item Note | Ghi chú tùy chỉnh cho từng sản phẩm trong đơn (VD: "ít đường", "không đá", "thêm kem") |
| Combo / Bundle | Combo / Bundle | Gói sản phẩm gồm nhiều item (VD: 1 bánh + 1 đồ uống) bán với giá ưu đãi |
| Sản phẩm theo mùa | Seasonal Product | Sản phẩm limited edition (bánh Tết, Noel...) chỉ bán trong khoảng thời gian nhất định |
| Phiếu chuyển kho | Stock Transfer | Chứng từ ghi nhận việc chuyển sản phẩm từ chi nhánh này sang chi nhánh khác |
| Thông tin dị ứng | Allergens | Cảnh báo thành phần gây dị ứng (gluten, sữa, trứng, đậu phộng...) hiển thị trên trang sản phẩm |

---

## Thuật ngữ kỹ thuật

| Thuật ngữ | Định nghĩa |
|-----------|-------------|
| PWA (Progressive Web App) | Ứng dụng web có thể cài đặt lên màn hình chính điện thoại, chạy fullscreen, hỗ trợ offline qua Service Workers |
| Service Workers | Script chạy nền trong trình duyệt, cho phép cache tài nguyên và hoạt động offline |
| SePay | Cổng thanh toán bên thứ 3 — tạo mã QR động để nhận chuyển khoản, gửi Webhook xác nhận giao dịch |
| SePay Webhook | API callback từ SePay gửi về backend khi có giao dịch chuyển khoản thành công. Backend phải xác thực chữ ký (signature) |
| POS (Point of Sale) | Hệ thống bán hàng tại quầy — giao diện cho nhân viên chi nhánh |
| Barcode Scanner | Máy quét mã vạch (USB/Bluetooth) dùng tại POS để thêm nhanh SP vào đơn |
| Máy in nhiệt K80/K57 | Máy in bill hóa đơn dùng giấy nhiệt khổ 80mm hoặc 57mm |
| Row-level Locking | Cơ chế database khóa dòng dữ liệu khi đang xử lý, chống race condition |
| Database Transaction | Nhóm các thao tác DB thành 1 đơn vị nguyên tử: hoặc tất cả thành công, hoặc rollback toàn bộ |
| Queue (FIFO) | Hàng đợi First-In First-Out — xử lý request theo thứ tự thời gian đến |
| Over-selling | Lỗi bán quá số lượng tồn kho — khi nhiều người mua cùng lúc SP còn ít |
| Race Condition | Lỗi xảy ra khi nhiều tiến trình truy cập/thay đổi cùng dữ liệu đồng thời |
| RBAC (Role-Based Access Control) | Phân quyền dựa theo vai trò: Admin, Staff, Customer |
| branch_id | Mã định danh duy nhất của mỗi chi nhánh trong hệ thống |
| SKU (Stock Keeping Unit) | Mã quản lý kho cho mỗi sản phẩm |
| COGS (Cost of Goods Sold) | Giá vốn hàng bán — chi phí sản xuất/nhập hàng |
| MoSCoW | Phương pháp ưu tiên: Must / Should / Could / Won't |
| Geolocation | Xác định vị trí người dùng qua GPS/IP để gợi ý chi nhánh gần nhất |
| Omnichannel | Mô hình bán hàng đa kênh (online + offline) trên cùng hệ thống |
