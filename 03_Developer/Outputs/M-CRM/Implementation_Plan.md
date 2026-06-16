# IMPLEMENTATION PLAN: M-CRM (CRM & Tiers)

**Kịch bản:** Scenario 1 - Greenfield
**Module:** M-CRM
**Đầu ra (Output):** `src/modules/crm/`

---

## 1. Mục tiêu
Quản lý hạng thành viên (Tiers), tính toán tỷ lệ giảm giá, và xử lý logic tự động thăng hạng / duy trì hạng dựa trên số tiền `total_spent` của user.

---

## 2. Danh sách Task chi tiết

### Giai đoạn 1: Domain & DB Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M5-T01 | Setup DB | Seed data mặc định cho bảng `customer_tiers` (Bronze, Silver, Gold, Diamond). | `prisma/seed.ts` | Theo đúng `Database_Schema.md`. |
| S1-M5-T02 | Entity | Viết Domain Entity cho CustomerTier. | `src/modules/crm/domain/entities/tier.entity.ts` | — |
| S1-M5-T03 | Interface | Khai báo `ITierRepository`. | `src/modules/crm/domain/repositories/tier.repository.interface.ts` | — |

### Giai đoạn 2: Infrastructure Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M5-T04 | Repository | Implement `PrismaTierRepository`. | `src/modules/crm/infrastructure/repositories/prisma-tier.repository.ts` | Hàm lấy ra Tier phù hợp nhất với `total_spent` của khách hàng. |

### Giai đoạn 3: Application Layer (Use Cases)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M5-T05 | Use Case | Viết `EvaluateUserTierUseCase`. | `src/modules/crm/application/use-cases/evaluate-tier.usecase.ts` | Lấy `total_spent` của user, so khớp mốc `min_spent`, gọi User Repository để cập nhật `tier_id`. |
| S1-M5-T06 | Use Case | Viết `GetTiersListUseCase` và `UpdateTierConfigUseCase`. | `src/modules/crm/application/use-cases/tier-config.usecase.ts` | Admin đổi `% discount` hoặc mức tiền. |
| S1-M5-T07 | Use Case | Viết `LookupCustomerUseCase` (Phục vụ POS). | `src/modules/crm/application/use-cases/lookup.usecase.ts` | Lấy User kèm Tier, điểm, ví dựa theo số điện thoại. |

### Giai đoạn 4: API / Presentation Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M5-T08 | Controller | Viết `CrmController` map routes `/api/crm/*`. | `src/modules/crm/api/crm.controller.ts` | `/my-tier` trả về progress hạng. `/lookup` bắt buộc có auth. |
| S1-M5-T09 | Router | Khai báo `crm.routes.ts` và nhúng vào `app.ts`. | `src/modules/crm/api/crm.routes.ts`, `src/app.ts` | — |
