# 🚀 AntiGravity Agent Framework

> **Dành cho người đọc lần đầu hoặc AI Agent với context mới:**
> Đây là tài liệu duy nhất bạn cần đọc trước. Nó giải thích toàn bộ hệ thống, thứ tự đọc tài liệu, và cách khởi chạy đúng.

---

## 1. Hệ thống này là gì?

**AntiGravity** là một framework **Multi-Agent** tự động hóa toàn bộ quy trình phát triển phần mềm — từ tài liệu đầu vào thô (SRS, source code cũ) đến bộ tài liệu kỹ thuật hoàn chỉnh (`.md`, `.docx`, `.xlsx`), không cần lập trình viên can thiệp thủ công ở từng bước.

**Triết lý cốt lõi:**
- Mỗi Agent là một **chuyên gia độc lập** — không biết việc của Agent khác, chỉ nhận Input → xử lý → xuất Output.
- **Không có ảo giác:** Agent bị cấm bịa ra thông tin không có trong tài liệu gốc.
- **Kế thừa context** qua file `Memory/experience.md` — giải quyết giới hạn token window.
- **Con người (PM) kiểm soát** tại các Human Checkpoint — hệ thống không bao giờ chạy thẳng qua checkpoint mà không có duyệt.

---

## 2. Pipeline 5 Agent

```
Tài liệu đầu vào (SRS / PRD / source code cũ)
          │
          ▼
┌─────────────────────────────────────────────┐
│  AG-01 — Business Analyst                   │
│  Đọc tài liệu thô → chuẩn hóa yêu cầu      │
│  Output: Requirements_Spec, Backlog, Risk...│
└────────────────┬────────────────────────────┘
                 │ ← [HUMAN CHECKPOINT] PM xác nhận requirements
                 ▼
┌─────────────────────────────────────────────┐
│  AG-02 — System Architect                   │
│  Thiết kế kiến trúc, DB, API, Diagrams      │
│  Output: System_Architecture, ERD, API...   │
└────────────────┬────────────────────────────┘
                 │ ← [HUMAN CHECKPOINT] PM duyệt Schema + API Contracts
                 ▼
┌─────────────────────────────────────────────┐
│  AG-03 — Developer                          │
│  Viết code theo từng module / ticket        │
│  Output: Source code, Changelog, Plan...    │
└────────────────┬────────────────────────────┘
                 │ ← Feedback loop nếu QA block
                 ▼
┌─────────────────────────────────────────────┐
│  AG-04 — QA Reviewer                        │
│  Test cases, Bug report, Security scan      │
│  Output: Test_Results, Bug_Report, Sign_Off │
└────────────────┬────────────────────────────┘
                 │ ← Chỉ đi tiếp khi QA_Sign_Off = PASS RELEASE
                 ▼
┌─────────────────────────────────────────────┐
│  AG-05 — Final Documenter                   │
│  Tổng hợp + render ra .docx / .xlsx         │
│  Output: Final_Report, User_Manual, API_Doc │
└─────────────────────────────────────────────┘
```

> **Quan trọng:** AG-04 có **feedback loop** về AG-03. Nếu `QA_Sign_Off.md` = **BLOCK RELEASE**, AG-03 phải fix bug trước khi AG-05 được phép chạy.

---

## 3. Ba kịch bản sử dụng

Hệ thống hỗ trợ ba tình huống thực tế khác nhau. Chọn đúng kịch bản trước khi chạy:

| | Kịch bản | Bạn có gì | AG-03 làm việc theo |
|---|---|---|---|
| 🟢 | **Scenario 1 — Greenfield** | SRS / tài liệu mô tả hệ thống mới | Song song theo module |
| 🟡 | **Scenario 2 — Maintenance** | Source code cũ, thêm tính năng / fix bug | Tuần tự theo ticket |
| 🔴 | **Scenario 3 — Refactoring** | Cả source code cũ lẫn SRS mới, viết lại sạch | Tuần tự theo layer kỹ thuật |

---

## 4. Cấu trúc thư mục & Mục đích từng file

```
AntiGravity_Agent_Framework/
│
├── 📜 README.md                     ← File bạn đang đọc — đọc đây TRƯỚC TIÊN
├── requirements.txt                 ← Python dependencies
├── .gitignore
│
├── 00_Global_Rules/                 ← ⚠️ HIẾN PHÁP HỆ THỐNG — tất cả Agent bắt buộc đọc
│   ├── 01_General_Behavior.md       ← Quy tắc ứng xử: ngôn ngữ, phân công, cấm ảo giác
│   ├── 02_Technical_Standards.md    ← Chuẩn kỹ thuật: architecture, coding style, output format
│   ├── 03_Anti_Gravity_Logic.md     ← [ĐIỀN VÀO ĐÂY] Hằng số nghiệp vụ của DỰ ÁN CỤ THỂ
│   └── 04_Template_Mapping.md       ← Quy tắc {{placeholder}} → AG-05 dùng để render docx/xlsx
│
├── 01_Analyst/
│   ├── AGENT_PROMPT.md              ← Nạp file này vào system-prompt khi spawn AG-01
│   ├── Inputs/                      ← [ĐIỀN VÀO ĐÂY] SRS, PRD, BRD, meeting notes...
│   ├── Outputs/                     ← Requirements_Spec.md, Product_Backlog.md, Risk_Register.md,
│   │   └── Diagrams/                    Glossary.md + Use_Case, Business_Flow, Feature_Priority
│   ├── Memory/                      ← experience.md (di chúc context giữa các session)
│   └── Templates/                   ← Template tài liệu AG-01 sử dụng
│
├── 02_Architect/
│   ├── AGENT_PROMPT.md              ← Nạp file này vào system-prompt khi spawn AG-02
│   ├── Outputs/                     ← System_Architecture.md, API_Contracts.md,
│   │   │                                Database_Schema.md, Module_Breakdown.md, ADR.md
│   │   └── Diagrams/                ← ERD.md, Sequence_Diagram.md, System_Architecture_Diagram.md,
│   │                                    DFD_Level1.md (tất cả viết bằng Mermaid)
│   ├── Memory/                      ← experience.md
│   └── Templates/
│       └── DIAGRAM_TEMPLATE_ERD.html ← Template HTML xem diagram trực quan
│
├── 03_Developer/
│   ├── AGENT_PROMPT.md              ← Nạp file này vào system-prompt khi spawn AG-03
│   ├── Inputs/                      ← [ĐIỀN VÀO ĐÂY] Source code cũ (Scenario 2/3)
│   ├── Outputs/                     ← Source code, Implementation_Plan.md, Changelog.md
│   │                                    Scenario 1: [Module]/ | Scenario 2: TICKET-xxx/ | Scenario 3: 01_DB/ 02_Backend/ 03_Frontend/
│   ├── Memory/
│   └── Templates/
│
├── 04_QA_Reviewer/
│   ├── AGENT_PROMPT.md              ← Nạp file này vào system-prompt khi spawn AG-04
│   ├── Outputs/                     ← Test_Cases.md, Test_Results.md, Bug_Report.md,
│   │                                    Security_Scan.md, Performance_Report.md, QA_Sign_Off.md
│   ├── Memory/
│   └── Templates/
│
├── 05_Final_Doc/
│   ├── AGENT_PROMPT.md              ← Nạp file này vào system-prompt khi spawn AG-05
│   ├── Outputs/                     ← Final_Report.md, User_Manual.md, Developer_Guide.md,
│   │                                    API_Documentation.md, RELEASE_NOTES.md + file .docx/.xlsx
│   ├── Memory/
│   └── Templates/                   ← File .docx/.xlsx gốc với {{placeholder}} (KHÔNG SỬA TRỰC TIẾP)
│
├── Documents/
│   ├── 📊 EXECUTION_PLAN.md         ← Bảng tiến độ tổng thể — cập nhật sau mỗi task
│   ├── PROJECT_BRIEF.md             ← [TÙY CHỌN] Điền context nhanh cho toàn bộ agent
│   ├── PROJECT_TEMPLATE.html        ← Giao diện web để điền thông tin dự án trực quan
│   └── workflow_diagram.html        ← Sơ đồ luồng pipeline 5 Agent (xem trên trình duyệt)
│
├── Example/                         ← Dự án mẫu đã chạy xong — tham khảo output chuẩn
│
├── logs/                            ← Log tự động của Orchestrator
│
└── utils/
    ├── orchestrator.py              ← ✅ ĐIỂM KHỞI CHẠY CHÍNH
    ├── render_documents.py          ← Chuyển .md + .json → .docx / .xlsx
    └── export_template.py           ← Tạo bản sao template sạch cho dự án mới
```

---

## 5. Thứ tự đọc tài liệu (cho người mới & agent)

> **Nếu bạn là AI Agent vừa được spawn:** Đọc theo thứ tự này, không bỏ bước nào.

### Bước 1 — Đọc bắt buộc (mọi agent)
```
README.md                               ← Bạn đang đọc — hiểu toàn bộ hệ thống
Documents/EXECUTION_PLAN.md            ← Biết đang ở Phase nào, task nào đã xong
00_Global_Rules/01_General_Behavior.md  ← Luật ứng xử — đọc trước khi làm bất cứ gì
00_Global_Rules/02_Technical_Standards.md
00_Global_Rules/03_Anti_Gravity_Logic.md ← Quy tắc nghiệp vụ đặc thù của dự án này
```

### Bước 2 — Đọc di chúc đời trước (nếu tồn tại)
```
[TEN_AGENT]/Memory/experience.md       ← ĐỌC NGAY nếu file này tồn tại
                                           Đây là context từ session trước — không được bỏ qua
```

### Bước 3 — Đọc AGENT_PROMPT của mình
```
[TEN_AGENT]/AGENT_PROMPT.md            ← Nhiệm vụ cụ thể, input cần đọc, output cần xuất
```

### Bước 4 — Đọc output đời trước (theo thứ tự dependency)
```
Nếu là AG-02 → đọc 01_Analyst/Outputs/
Nếu là AG-03 → đọc 01_Analyst/Outputs/ + 02_Architect/Outputs/
Nếu là AG-04 → đọc 01→02→03 Outputs/
Nếu là AG-05 → đọc 01→02→03→04 Outputs/ (xem AGENT_PROMPT.md để biết thứ tự ưu tiên)
```

---

## 6. Human Checkpoint — Những điểm PM phải duyệt

Hệ thống **tự dừng** tại 3 điểm và chờ PM xác nhận:

| Checkpoint | Sau Phase | PM cần làm gì |
|---|---|---|
| **CP-1** | AG-01 xong | Đọc `Requirements_Spec.md` → xác nhận đúng yêu cầu |
| **CP-2** | AG-02 xong | Đọc `Database_Schema.md` + `API_Contracts.md` → duyệt trước khi code |
| **CP-3** | AG-03 xong (mỗi module/sprint) | Đọc `Implementation_Plan.md` → approve trước khi implement tiếp |

Khi terminal hiển thị:
```
============================================================
🛑 [HUMAN CHECKPOINT] AG-01 hoàn thành phân tích yêu cầu
============================================================
👉 PM, vui lòng review 01_Analyst/Outputs/Requirements_Spec.md
👉 Nhập "approve" để tiếp tục, hoặc mô tả vấn đề cần điều chỉnh:
>
```
→ Gõ `approve` hoặc mô tả yêu cầu điều chỉnh → nhấn **Enter**.

---

## 7. Cài đặt & Khởi chạy

### Cài đặt
```bash
pip install -r requirements.txt
```

### Chuẩn bị trước khi chạy

- [ ] Ném tài liệu SRS/PRD vào `01_Analyst/Inputs/` *(Scenario 1 & 3)*
- [ ] Ném source code cũ vào `03_Developer/Inputs/` *(Scenario 2 & 3)*
- [ ] Điền quy tắc nghiệp vụ vào `00_Global_Rules/03_Anti_Gravity_Logic.md`
- [ ] *(Tùy chọn)* Mở `Documents/PROJECT_TEMPLATE.html` trên trình duyệt → điền thông tin → xuất ra `Documents/PROJECT_BRIEF.md`

### Chạy hệ thống

```bash
# Dự án mới từ SRS
python utils/orchestrator.py --scenario 1

# Có source code cũ, thêm tính năng
python utils/orchestrator.py --scenario 2

# Có cả source code cũ lẫn SRS mới, viết lại
python utils/orchestrator.py --scenario 3

# Chạy lại từ đầu (xóa Memory + Outputs + Logs)
python utils/orchestrator.py --scenario 1 --reset
```

### Render tài liệu ra .docx / .xlsx

```bash
# Render toàn bộ output của AG-05
python utils/render_documents.py --agent AG-05

# Render một file đơn lẻ
python utils/render_documents.py --input 05_Final_Doc/Outputs/Final_Report.md

# Render tất cả
python utils/render_documents.py
```

---

## 8. Tạo Boilerplate cho dự án mới (export_template)

Sau khi dự án hiện tại đã chạy xong, dùng script này để **đóng gói bộ khung sạch** — toàn bộ cấu trúc thư mục, AGENT_PROMPT, Global Rules, và Templates — nhưng **không có data cũ** (Memory, Inputs, Outputs, Logs đều bị xóa).

```bash
python utils/export_template.py
```

Script sẽ tự động:
1. **Copy** toàn bộ cấu trúc dự án vào thư mục `../AntiGravity_Agent_Framework_Template/` (cùng cấp với thư mục hiện tại)
2. **Loại bỏ** tất cả data cũ: `Memory/`, `Inputs/`, `Outputs/`, `logs/`, `Legacy*`, file cache Python
3. **Tái tạo** các thư mục trống cần thiết (`Memory/`, `Inputs/`, `Outputs/`) cho mỗi Agent
4. **Tự cài Skills** vào `.agents/skills/` (clone từ GitHub — yêu cầu kết nối internet)

Sau khi script hoàn tất, hướng dẫn sử dụng template cho dự án mới:

```bash
# Bước 1: Copy template ra và đổi tên
cp -r ../AntiGravity_Agent_Framework_Template ../TenDuAnMoi

# Bước 2: Ném tài liệu yêu cầu vào Inputs
cp SRS_KhachHang.pdf ../TenDuAnMoi/01_Analyst/Inputs/

# Bước 3: Khởi chạy
cd ../TenDuAnMoi
python utils/orchestrator.py --scenario 1
```

> **Lưu ý:** Nếu không có kết nối internet, bước cài Skills sẽ thất bại nhưng template vẫn được tạo đầy đủ. Skills có thể cài thủ công sau.

---

## 9. Quy tắc Output bất di bất dịch

> **Agent đọc phần này để tránh vi phạm quy định hệ thống.**

| Quy tắc | Chi tiết |
|---|---|
| **Format file** | Tất cả tài liệu trung gian là `.md` với heading `##`, bảng, bullet — **không dùng JSON thuần** |
| **Diagram** | Viết bằng Mermaid code block (` ```mermaid `) — render trực tiếp không cần tool ngoài |
| **Không ghi đè template** | File `.docx` / `.xlsx` trong `Templates/` là vùng cấm — chỉ AG-05 + `render_documents.py` được đụng vào |
| **Không suy diễn** | Thiếu thông tin → ghi vào `[PENDING_ISSUES]` trong `experience.md`, không tự bịa |
| **Cập nhật tiến độ** | Sau mỗi task hoàn thành → cập nhật `Documents/EXECUTION_PLAN.md`: đổi `[ ]` thành `[x]` |
| **Cấm ảo giác** | Không fabricate tính năng, thông số, API endpoint nào không có trong tài liệu gốc |

---

## 10. Tích hợp LLM API thực

Mở `requirements.txt` và bỏ comment dòng tương ứng với provider bạn dùng:

```
# google-generativeai>=0.8.0   # Gemini
# anthropic>=0.25.0             # Claude
# openai>=1.30.0                # OpenAI
```

Sau đó set API key trong `.env` hoặc biến môi trường:

```bash
export GEMINI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
export OPENAI_API_KEY="..."
```

---

## 11. Xem Pipeline trực quan

Mở hai file HTML dưới đây trực tiếp trên trình duyệt — không cần cài đặt gì thêm:

| File | Mục đích |
|---|---|
| `Documents/workflow_diagram.html` | Sơ đồ luồng pipeline 5 Agent, Human Checkpoints, và feedback loop |
| `Documents/PROJECT_TEMPLATE.html` | Form điền thông tin dự án → tự động tạo `PROJECT_BRIEF.md` |

---

## 12. Xem dự án mẫu

Thư mục `Example/` chứa một dự án đã chạy xong hoàn chỉnh. Đọc để hiểu output chuẩn trông như thế nào trước khi bắt đầu dự án thật.

```
Example/
├── 01_Analyst/Outputs/      ← Requirements_Spec.md mẫu
├── 02_Architect/Outputs/    ← System_Architecture.md mẫu, ERD.md mẫu
├── 04_QA_Reviewer/Outputs/  ← QA_Sign_Off.md mẫu
└── 05_Final_Doc/Outputs/    ← Final_Report.md mẫu
```

---

*Cập nhật lần cuối: 2026-03-29*
