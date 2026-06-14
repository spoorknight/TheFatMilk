# RISK REGISTER — THE FAT MILK

**Agent:** AG-01 — Business Analyst  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-06-13  

---

## Bảng rủi ro

| ID | Rủi ro | Mô tả | Xác suất | Ảnh hưởng | Severity | Giảm thiểu (Mitigation) |
|----|--------|-------|----------|-----------|----------|------------------------|
| RISK-001 | **Race Condition trên Ví điện tử** | Nhiều request trừ ví đồng thời có thể khiến số dư âm hoặc trùng giao dịch | Cao | Critical | 🔴 Critical | Bắt buộc DB Transaction + Row-level Locking. Idempotency key cho mỗi giao dịch. Rate limiting trên API thanh toán |
| RISK-002 | **Over-selling sản phẩm** | Nhiều người mua cùng lúc SP có tồn kho thấp → bán quá số lượng | Cao | High | 🔴 Critical | Queue-based processing (FIFO). SELECT FOR UPDATE trên bảng tồn kho. Kiểm tra stock trong transaction |
| RISK-003 | **SePay Webhook bị giả mạo** | Kẻ tấn công giả mạo webhook để cộng tiền ví bất hợp pháp | Trung bình | Critical | 🔴 Critical | Xác thực signature của SePay Webhook. Whitelist IP SePay. Đối soát tự động định kỳ |
| RISK-004 | **SePay downtime** | Cổng thanh toán SePay gặp sự cố → khách không nạp ví / thanh toán QR được | Thấp | High | 🟡 High | Cung cấp phương thức thanh toán dự phòng (COD). Hiển thị thông báo rõ ràng khi SePay không khả dụng. Retry mechanism |
| RISK-005 | **Mất đồng bộ kho giữa online/offline** | POS bán SP tại quầy nhưng PWA chưa cập nhật → khách online đặt hàng SP đã hết | Trung bình | High | 🟡 High | Real-time sync trên cùng DB. Không dùng cache cho dữ liệu tồn kho. Kiểm tra stock tại thời điểm checkout |
| RISK-006 | **Rò rỉ thông tin tài chính** | API ví/điểm bị khai thác nếu không có bảo mật đủ mạnh | Trung bình | Critical | 🔴 Critical | HTTPS bắt buộc. Token verification cho mọi API tài chính. Backend KHÔNG tin cậy dữ liệu từ Frontend. Rate limiting |
| RISK-007 | **PWA không tương thích iOS Safari** | iOS Safari có nhiều giới hạn với PWA (push notification, background sync...) | Trung bình | Medium | 🟡 High | Test kỹ trên iOS Safari. Dùng workaround cho các API không hỗ trợ. Cung cấp fallback UI |
| RISK-008 | **Kết nối phần cứng POS không ổn định** | Máy in nhiệt K80/K57 hoặc barcode scanner gặp lỗi kết nối | Trung bình | Medium | 🟡 High | Hỗ trợ cả USB và Bluetooth. Cơ chế retry khi in thất bại. Cho phép in lại hóa đơn từ lịch sử |
| RISK-009 | **Khách lạm dụng hệ thống điểm** | Khách tạo nhiều tài khoản để tích điểm gian lận, hoặc exploit quy đổi điểm | Thấp | Medium | 🟢 Medium | Giới hạn 1 SĐT = 1 tài khoản. Xác thực OTP khi đăng ký. Audit log cho mọi giao dịch điểm |
| RISK-010 | **Phức tạp vận hành đa chi nhánh** | Nhiều chi nhánh → khó kiểm soát tồn kho, doanh thu, nhân viên nếu báo cáo không rõ ràng | Trung bình | Medium | 🟢 Medium | Dashboard báo cáo tách biệt theo chi nhánh. Alert tự động khi tồn kho thấp. Phân quyền chặt chẽ |
| RISK-011 | **Hạn sử dụng sản phẩm** | Bánh tươi có hạn ngắn (1-3 ngày) → rủi ro bán SP hết hạn cho khách | Trung bình | High | 🟡 High | Gắn expiry_date theo lô nhập kho. Cảnh báo tự động khi SP sắp/đã hết hạn. Tự ẩn SP hết hạn trên app |
| RISK-012 | **Scope creep** | Thêm tính năng ngoài phạm vi ban đầu (VD: quản lý nguyên vật liệu, giao hàng nội bộ) → trễ deadline | Cao | Medium | 🟡 High | Tuân thủ nghiêm ngặt phạm vi IN-SCOPE. Mọi tính năng mới phải qua Human Checkpoint. Ưu tiên MVP |

---

## Ma trận tổng hợp

| Severity | Số lượng | Rủi ro |
|----------|---------|--------|
| 🔴 Critical | 4 | RISK-001, 002, 003, 006 |
| 🟡 High | 5 | RISK-004, 005, 007, 008, 011 |
| 🟢 Medium | 2 | RISK-009, 010 |
| 🔵 Low | 0 | — |

> **Khuyến nghị:** 4 rủi ro Critical (ví, kho, SePay, bảo mật) phải được xử lý ở tầng kiến trúc bởi AG-02. Không để đến giai đoạn code (AG-03) mới thiết kế giải pháp.
