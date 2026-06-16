# IMPLEMENTATION PLAN: M-INVENTORY (Inventory Control)

**Kịch bản:** Scenario 1 - Greenfield
**Module:** M-INVENTORY
**Đầu ra (Output):** `src/modules/inventory/`

---

## 1. Mục tiêu
Quản lý tồn kho cho từng sản phẩm tại từng chi nhánh. Xử lý logic thay đổi số lượng kho, lưu log lịch sử (inventory logs), và thực hiện nghiệp vụ chuyển kho giữa các chi nhánh.

---

## 2. Danh sách Task chi tiết

### Giai đoạn 1: Domain & DB Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M4-T01 | Setup DB | Cập nhật `prisma/schema.prisma`: bảng `inventory`, `inventory_logs`, `stock_transfers`. | `prisma/schema.prisma` | Unique(product_id, branch_id). Chạy Prisma migrate. |
| S1-M4-T02 | Entity | Viết Domain Entities: Inventory, InventoryLog, StockTransfer. | `src/modules/inventory/domain/entities/*.entity.ts` | Tách biệt các change_type (import, export, sale). |
| S1-M4-T03 | Interface | Khai báo `IInventoryRepository`, `IInventoryLogRepository`. | `src/modules/inventory/domain/repositories/*.interface.ts` | Cần hỗ trợ Database Transaction (cho việc update stock + write log). |

### Giai đoạn 2: Infrastructure Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M4-T04 | Repository | Implement `PrismaInventoryRepository`. | `src/modules/inventory/infrastructure/repositories/*.repository.ts` | Cần có hàm `adjustStockWithTransaction(productId, branchId, quantity, type)` để đảm bảo ACID. |

### Giai đoạn 3: Application Layer (Use Cases)
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M4-T05 | Use Case | Viết `GetInventoryListUseCase`. | `src/modules/inventory/application/use-cases/get-inventory.usecase.ts` | Query theo `branch_id`. |
| S1-M4-T06 | Use Case | Viết `AdjustStockUseCase` (Import/Export/Sale). | `src/modules/inventory/application/use-cases/adjust-stock.usecase.ts` | Cập nhật bảng `inventory` và insert `inventory_logs` trong cùng 1 Transaction. Không cho stock âm trừ phi cho phép xuất quá. |
| S1-M4-T07 | Use Case | Viết `CreateStockTransferUseCase` và `CompleteStockTransferUseCase`. | `src/modules/inventory/application/use-cases/transfer.usecase.ts` | Complete: Trừ kho nguồn, cộng kho đích. |

### Giai đoạn 4: API / Presentation Layer
| Task ID | Component | Chi tiết công việc | File ảnh hưởng | Validation/Rules |
|---------|-----------|--------------------|----------------|------------------|
| S1-M4-T08 | Controller | Viết `InventoryController` map routes `/api/inventory/*`. | `src/modules/inventory/api/inventory.controller.ts` | RBAC: Admin & Staff. Validate số lượng chuyển kho. |
| S1-M4-T09 | Router | Khai báo `inventory.routes.ts`. | `src/modules/inventory/api/inventory.routes.ts` | — |
