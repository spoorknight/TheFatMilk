# THIẾT CHẾ 02: QUY CHUẨN KỸ THUẬT & SOURCE CODE (TECHNICAL STANDARDS)

Bộ quy chuẩn này định hướng cho AG-02 (Architect) và AG-03 (Developer) trong việc đưa ra thiết kế và sinh mã nguồn.

## 1. Cấu Trúc Hệ Thống (Architecture)
- **Clean Architecture:** Kiến trúc mã nguồn phải tuân thủ nghiêm ngặt **nguyên lý đảo ngược phụ thuộc (Dependency Inversion)** và phân tách rõ ràng thành 4 lớp (Layers):
  1. **Domain (Entities):** Chứa các enterprise business rules (Entities, Value Objects). Độc lập hoàn toàn, KHÔNG phụ thuộc vào framework, thư viện ngoại lai hay bất kỳ layer nào khác.
  2. **Application (Use Cases):** Chứa application business rules. Phối hợp luồng dữ liệu thông qua các Interface (Ports) tới/từ Domain. Phụ thuộc DUY NHẤT vào Domain.
  3. **Infrastructure (Adapters/Drivers):** Cài đặt (Implement) các Interface như Repositories, External API Clients. Đảm nhiệm giao tiếp với Database, Message Brokers, v.v.
  4. **Presentation/API (Controllers):** Giao diện tiếp nhận request (REST/GraphQL/CLI). Chuyển đổi dữ liệu (DTO) xuống Application layer. KHÔNG chứa business logic.
- **Rule of Thumb:** Dependencies luôn trỏ từ ngoài vào trong (từ Infrastructure/API vào Application, từ Application vào Domain).
- **UI/UX Design Framework:** AG-02 khi thiết kế giao diện phải sử dụng tư duy từ `@ui-ux-pro-max`. Giao diện (nếu có) phải sử dụng React/Next.js kết hợp Tailwind CSS. Cần có file Design System riêng (Colors, Typography).

## 2. Tiêu Chuẩn Lập Trình (Coding Standards)
- **Backend:** Ưu tiên Python (FastAPI/Django) hoặc Node.js / .NET 8 tùy theo context của dự án. Code phải có Type Hinting rõ ràng.
- **Quy tắc Naming Convention:**
  - `snake_case`: cho tên biến, tên hàm (Python).
  - `PascalCase`: cho Tên Class, Tên Interface.
  - `camelCase`: cho biến/hàm trong JS/TS.
  - `UPPER_SNAKE_CASE`: cho hằng số (Constants).
- **Error Handling:** Hệ thống mã nguồn bắt buộc phải bắt Lỗi (Try-Catch) ở mọi tầng. Lỗi phải được trả về dưới dạng JSON chuẩn `{ "status": "error", "message": "...", "code": 500 }`. Không trả mã lỗi hệ thống rác ra cho End-user.

## 3. Payload & Quy Chuẩn Chuyển Giao (Output Convention theo Kịch Bản)

- Định dạng giao tiếp giữa các Agent luôn là **JSON thuần (Raw JSON)**. Tuyệt đối không sinh Markdown trừ phi user yêu cầu xem nháp.
- Key của JSON phải match chính xác 100% với tên Placeholder trong các file Templates để `AG-05` tự động render file thật.
- Có một file duy nhất đứng cao nhất là `Master_System_Overview.json` chứa đặc tả chung toàn hệ thống để các Agent gọi tham chiếu chéo.

### Quy tắc tổ chức Output theo từng kịch bản:

| Kịch bản | AG-03 làm việc | Cách tổ chức Output |
|---|---|---|
| 🟢 **Scenario 1 — Greenfield** | Song song theo module | Phân tách theo **Module**: `[ModuleName]_[TaskName].json` (VD: `Auth_System_Design.json`) |
| 🟡 **Scenario 2 — Maintenance** | Tuần tự, sửa trên codebase cũ | Phân tách theo **Ticket/Feature**: `TICKET-[ID]_[Feature]/` (VD: `TICKET-001_Add_Push_Notification/`) |
| 🔴 **Scenario 3 — Refactoring** | Tuần tự, viết lại hoàn toàn | Phân tách theo **Layer kỹ thuật**: `01_Database/`, `02_Backend/`, `03_Frontend/`, `04_Testing/` |

> ⚠️ **Cấm áp dụng quy tắc Module-prefix của Greenfield vào Scenario 2 & 3.** AG-03 trong Scenario 2 và 3 không được spawn song song và không chia output theo module.