# MẪU ĐẶC TẢ HỆ THỐNG TỔNG QUAN (MASTER SYSTEM OVERVIEW)
Đây là File định dạng JSON mà AG-01 cần rặn ra trước khi chia module. File này đóng vai trò làm "Xương sống" (Backbone) để các module không bị trượt logic với nhau.

Bắt buộc cấu trúc các node trong file JSON:

```json
{
  "PROJECT_NAME": "Tên dự án tổng",
  "PROJECT_SUMMARY": "Mô tả ngắn gọn về giá trị và mục tiêu của dự án",
  "TECH_STACK_BASELINE": {
    "frontend": "Ví dụ: React.js, Tailwind",
    "backend": "Ví dụ: Python FastAPI",
    "database": "Ví dụ: PostgreSQL"
  },
  "MODULE_LIST": [
    {
      "module_code": "AUTH",
      "module_name": "Authentication & Authorization",
      "description": "Quản lý đăng nhập và quyền"
    },
    {
      "module_code": "GPS",
      "module_name": "GPS Tracking",
      "description": "Theo dõi vị trí"
    }
  ],
  "CORE_ENTITIES": [
    {
      "entity": "User",
      "relations": ["1-N với DeductionLogs", "1-1 với Profile"]
    }
  ],
  "GLOBAL_CONSTRAINTS": "Ghi chú các ràng buộc toàn cục chạy xuyên suốt các module (ví dụ: Tất cả API phải có prefix /api/v1/)"
}
```
