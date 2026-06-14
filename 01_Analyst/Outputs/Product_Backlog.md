# PRODUCT BACKLOG — THE FAT MILK

**Agent:** AG-01 — Business Analyst  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-06-13  

---

## Hướng dẫn đọc

- **Priority:** Must > Should > Could > Won't (MoSCoW)
- **Effort:** S (1-2 ngày) / M (3-5 ngày) / L (1-2 tuần) / XL (> 2 tuần)
- **Module:** Nhóm chức năng liên quan
- **Ref:** Tham chiếu đến mã requirement trong Requirements_Spec.md

---

## EPIC 1: Xác thực & Phân quyền (Auth & RBAC)

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-001 | As a **khách hàng**, I want to **đăng ký tài khoản bằng SĐT/email**, so that **tôi có thể mua hàng và tích điểm** | Must | M | REQ-F-051 |
| US-002 | As a **khách hàng**, I want to **đăng nhập / quên mật khẩu**, so that **tôi truy cập lại tài khoản khi cần** | Must | M | REQ-F-051 |
| US-003 | As a **admin**, I want to **phân quyền nhân viên theo chi nhánh**, so that **mỗi nhân viên chỉ thao tác trên dữ liệu chi nhánh mình** | Must | M | REQ-F-050, REQ-F-052 |

---

## EPIC 2: PWA App — Giao diện & Trải nghiệm

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-004 | As a **khách hàng**, I want to **cài PWA lên màn hình chính**, so that **truy cập nhanh như app native** | Must | M | REQ-F-001, REQ-F-002 |
| US-005 | As a **khách hàng**, I want to **xem sản phẩm khi mất mạng**, so that **tôi vẫn duyệt menu được** | Must | L | REQ-F-003 |
| US-006 | As a **khách hàng**, I want to **chọn chi nhánh gần tôi**, so that **xem đúng tồn kho và giá tại chi nhánh đó** | Must | M | REQ-F-005 |
| US-007 | As a **khách hàng**, I want to **xem banner khuyến mãi trên trang chủ**, so that **biết được ưu đãi mới nhất** | Should | S | REQ-F-006 |
| US-008 | As a **khách hàng**, I want to **thấy hạng thành viên của tôi ngay trên trang chủ**, so that **cảm nhận được sự cá nhân hóa** | Should | S | REQ-F-007 |
| US-009 | As a **khách hàng**, I want to **xem Flash Sale với đếm ngược**, so that **nắm bắt cơ hội mua giá rẻ** | Should | M | REQ-F-008 |
| US-010 | As a **khách hàng**, I want to **xem danh mục nhanh bằng icon tròn**, so that **tìm đúng loại bánh/đồ uống nhanh hơn** | Must | S | REQ-F-009 |
| US-011 | As a **khách hàng**, I want to **duyệt sản phẩm dạng lưới 2 cột với giá theo hạng**, so that **thấy giá thực tế tôi phải trả** | Must | M | REQ-F-010 |
| US-012 | As a **khách hàng**, I want to **xem thông tin allergens trên card sản phẩm**, so that **tránh mua món gây dị ứng** | Should | S | REQ-F-010 |

---

## EPIC 3: PWA App — Tài khoản & Tài chính

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-013 | As a **khách hàng**, I want to **xem trang cá nhân với progress bar hạng thành viên**, so that **biết cần chi thêm bao nhiêu để lên hạng** | Must | S | REQ-F-014 |
| US-014 | As a **khách hàng**, I want to **nạp tiền vào ví bằng QR code qua SePay**, so that **chuẩn bị sẵn tiền mua hàng** | Must | L | REQ-F-015, REQ-F-016 |
| US-015 | As a **khách hàng**, I want to **xem số dư ví + lịch sử nạp/trừ**, so that **kiểm soát tài chính cá nhân** | Must | M | REQ-F-015 |
| US-016 | As a **khách hàng**, I want to **xem điểm thưởng + lịch sử tích/dùng**, so that **biết tôi có bao nhiêu điểm sử dụng** | Must | S | REQ-F-017 |
| US-017 | As a **khách hàng**, I want to **nhận thông báo về đơn hàng, ví, và ưu đãi**, so that **không bỏ lỡ thông tin quan trọng** | Must | M | REQ-F-013 |
| US-018 | As a **khách hàng**, I want to **xem lịch sử đơn hàng + lọc theo trạng thái**, so that **theo dõi đơn dễ dàng** | Must | M | REQ-F-018 |
| US-019 | As a **khách hàng**, I want to **xem kho voucher cá nhân**, so that **biết tôi có mã giảm giá nào** | Should | S | REQ-F-019 |

---

## EPIC 4: Giỏ hàng & Thanh toán

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-020 | As a **khách hàng**, I want to **thêm/sửa/xóa sản phẩm trong giỏ hàng**, so that **quản lý đơn trước khi thanh toán** | Must | M | REQ-F-020 |
| US-021 | As a **khách hàng**, I want to **giá tự động giảm theo hạng thành viên**, so that **hưởng ưu đãi VIP** | Must | M | REQ-F-021 |
| US-022 | As a **khách hàng**, I want to **áp dụng mã voucher**, so that **giảm thêm chi phí** | Must | M | REQ-F-022 |
| US-023 | As a **khách hàng**, I want to **dùng điểm thưởng để giảm giá**, so that **tận dụng điểm đã tích** | Must | M | REQ-F-023 |
| US-024 | As a **khách hàng**, I want to **ghi chú cho từng item (ít đường, không đá...)**, so that **nhận đúng sản phẩm mong muốn** | Should | S | REQ-F-024 |
| US-025 | As a **khách hàng**, I want to **thanh toán bằng Ví / COD / QR SePay**, so that **chọn phương thức thuận tiện nhất** | Must | L | REQ-F-025/26/27 |

---

## EPIC 5: POS — Bán hàng tại quầy

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-026 | As a **nhân viên**, I want to **tìm kiếm nhanh / quét barcode sản phẩm**, so that **tạo đơn nhanh cho khách** | Must | M | REQ-F-028, REQ-F-029 |
| US-027 | As a **nhân viên**, I want to **tra CRM khách bằng SĐT**, so that **biết hạng + ví + điểm để áp ưu đãi** | Must | M | REQ-F-030 |
| US-028 | As a **nhân viên**, I want to **hệ thống tự động áp chiết khấu theo hạng**, so that **không cần tính tay** | Must | S | REQ-F-031 |
| US-029 | As a **nhân viên**, I want to **hỗ trợ khách trừ ví / tiêu điểm bằng mã xác nhận hoặc QR**, so that **khách thanh toán nhanh tại quầy** | Must | L | REQ-F-032 |
| US-030 | As a **nhân viên**, I want to **in hóa đơn nhiệt K80/K57 đầy đủ thông tin**, so that **khách có chứng từ mua hàng** | Must | M | REQ-F-033 |

---

## EPIC 6: Admin — Quản lý sản phẩm & Kho

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-031 | As a **admin**, I want to **CRUD chi nhánh (địa chỉ, SĐT, trạng thái)**, so that **quản lý chuỗi linh hoạt** | Must | M | REQ-F-034 |
| US-032 | As a **admin**, I want to **CRUD sản phẩm với thuộc tính F&B**, so that **quản lý menu bánh & đồ uống** | Must | L | REQ-F-035 |
| US-033 | As a **admin**, I want to **tạo SP theo mùa / limited edition**, so that **bán bánh lễ Tết, Noel** | Could | S | REQ-F-036 |
| US-034 | As a **admin**, I want to **tạo Combo/Bundle**, so that **bán kèm bánh + đồ uống giá ưu đãi** | Should | M | REQ-F-037 |
| US-035 | As a **admin**, I want to **phân bổ tồn kho theo chi nhánh + xem lịch sử xuất-nhập-tồn**, so that **kiểm soát hàng hóa** | Must | L | REQ-F-038 |
| US-036 | As a **admin**, I want to **tạo phiếu chuyển kho giữa chi nhánh**, so that **điều phối hàng linh hoạt** | Should | M | REQ-F-039 |

---

## EPIC 7: Admin — CRM, Ví, Điểm, Voucher

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-037 | As a **admin**, I want to **cấu hình ngưỡng thăng hạng + % chiết khấu**, so that **tùy chỉnh chương trình VIP** | Must | M | REQ-F-041 |
| US-038 | As a **admin**, I want to **hệ thống tự động thăng hạng khi đơn "Đã giao"**, so that **không cần thao tác thủ công** | Must | M | REQ-F-042 |
| US-039 | As a **admin**, I want to **đối soát giao dịch SePay + biến động ví**, so that **kiểm soát tài chính** | Must | L | REQ-F-043 |
| US-040 | As a **admin**, I want to **cấu hình tỷ lệ tích/tiêu điểm**, so that **điều chỉnh chính sách loyalty** | Must | S | REQ-F-044 |
| US-041 | As a **admin**, I want to **tạo voucher targeted (theo hạng, theo chi nhánh)**, so that **marketing phân khúc** | Must | L | REQ-F-045 |
| US-042 | As a **admin**, I want to **tạo Flash Sale với đối tượng + phạm vi**, so that **kích cầu hiệu quả** | Should | M | REQ-F-046 |

---

## EPIC 8: Admin — Báo cáo

| ID | User Story | Priority | Effort | Ref |
|----|-----------|----------|--------|-----|
| US-043 | As a **admin**, I want to **xem biểu đồ doanh thu/lợi nhuận theo chi nhánh**, so that **đánh giá hiệu quả kinh doanh** | Must | L | REQ-F-047 |
| US-044 | As a **admin**, I want to **xem thống kê SP bán chạy**, so that **biết món nào hot** | Should | M | REQ-F-048 |
| US-045 | As a **admin**, I want to **xem tổng tiền khách giữ trong ví**, so that **đối soát tài chính tổng** | Must | M | REQ-F-049 |

---

## Tổng hợp

| Priority | Số lượng | % |
|----------|---------|---|
| Must | 34 | 75.6% |
| Should | 9 | 20.0% |
| Could | 2 | 4.4% |
| **Tổng** | **45** | **100%** |
