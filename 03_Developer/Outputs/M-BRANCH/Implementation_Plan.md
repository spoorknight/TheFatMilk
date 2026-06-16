# IMPLEMENTATION PLAN: M-BRANCH (Branch Management)

**Kịch bản:** Scenario 1 - Greenfield
**Module:** M-BRANCH
**Đầu ra (Output):** `src/modules/branch/`
**Quy tắc:** AG-03 tuân thủ Clean Architecture, kế thừa Boilerplate từ M-AUTH. Không sửa các module đã hoàn thành trừ khi có authorization logic liên kết.

---

## 1. Mục tiêu
Xây dựng logic quản lý chi nhánh (`branches`) cho The Fat Milk. Hỗ trợ CRUD bởi Admin, và API tìm kiếm chi nhánh gần nhất cho PWA.

---

## 2. Danh sách Task chi tiết

### Giai đoạn 1: Domain & DB Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M2-T01 | Setup DB | Cập nhật `prisma/schema.prisma` với table `branches`, `staff_branches`. | `prisma/schema.prisma` | Bảng branches có `latitude`, `longitude`. Chạy `npx prisma migrate dev`. |
| S1-M2-T02 | Entity | Viết `BranchEntity` và `StaffBranchEntity`. | `src/modules/branch/domain/entities/branch.entity.ts` | — |
| S1-M2-T03 | Interface | Khai báo `IBranchRepository`. Thêm hàm `findNearest(lat, lng, limit)`. | `src/modules/branch/domain/repositories/branch.repository.interface.ts` | Tọa độ phải xử lý tính toán khoảng cách (Haversine formula hoặc PostGIS). |

### Giai đoạn 2: Infrastructure Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M2-T04 | Repository | Implement `PrismaBranchRepository`. | `src/modules/branch/infrastructure/repositories/prisma-branch.repository.ts` | Với tính khoảng cách, nếu dùng Prisma raw query thì gọi `SELECT id, name, address, ( 6371 * acos(...) ) AS distance`. |

### Giai đoạn 3: Application Layer (Use Cases)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M2-T05 | Use Case | Viết `CreateBranchUseCase` và `UpdateBranchUseCase`. | `src/modules/branch/application/use-cases/admin-branch.usecase.ts` | Validate name và address bắt buộc. |
| S1-M2-T06 | Use Case | Viết `DeleteBranchUseCase` (Soft delete) và `GetBranchListUseCase`. | `src/modules/branch/application/use-cases/admin-branch.usecase.ts` | Soft delete cập nhật `is_deleted = true`. |
| S1-M2-T07 | Use Case | Viết `FindNearestBranchUseCase`. | `src/modules/branch/application/use-cases/public-branch.usecase.ts` | Truyền `lat`, `lng`. Sắp xếp tăng dần theo khoảng cách. |

### Giai đoạn 4: API / Presentation Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M2-T08 | Validation | Schema Validation Zod cho Branch Create/Update. | `src/modules/branch/api/branch.schema.ts` | — |
| S1-M2-T09 | Controller | Viết `BranchController` map `/api/branches/*` | `src/modules/branch/api/branch.controller.ts` | Gắn middleware: Các API Create/Update/Delete YÊU CẦU `auth.middleware` + `role(Admin)`. Các API GET public. |
| S1-M2-T10 | Router | Khai báo `branch.routes.ts` và nhúng vào `app.ts`. | `src/modules/branch/api/branch.routes.ts`, `src/app.ts` | — |

---

## 3. Dependency Check
- **Database:** Prisma migration phải chạy pass mà không lỗi khóa ngoại.
- **API Contracts:** Đảm bảo `GET /branches/nearest?lat=&lng=` trả đúng định dạng JSON danh sách kèm khoảng cách ước tính.
