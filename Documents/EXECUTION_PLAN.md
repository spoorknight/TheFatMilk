# 📊 BẢNG THEO DÕI TIẾN ĐỘ DỰ ÁN

**Dự án:** [Tên Dự Án]
**Trạng thái tổng thể:** ⏹️ Chưa bắt đầu
**Lần cập nhật cuối:** 2026-06-13 00:41:22 (Tự động bởi Orchestrator)

> **Quy tắc cho Agent:**
>
> - Khi hoàn thành hoặc thay đổi trạng thái của một Task, Agent phụ trách **BẮT BUỘC** phải dùng tool `replace_file_content` để chuyển `[ ]` thành `[x]`, cập nhật `(Bởi: Agent-ID)` và cập nhật **Trạng thái** của Giai đoạn (Phase) tương ứng.
> - **Output format:** Tất cả file trung gian đều là `.md` có cấu trúc (dùng heading `##`, bảng, bullet list). **Không dùng JSON.** Agent đọc/ghi tự nhiên hơn, con người review trực tiếp không cần tool parse.

---

## 🔍 GIAI ĐOẠN 0: NẠP BỐI CẢNH & KHỞI TẠO TỪ DỰ ÁN CŨ (PHASE 0 - LEGACY LOADING)
**Trạng thái:** ⏹️ Chưa bắt đầu

> Chọn thực hiện Option A (Bảo trì) hoặc Option B (Đập đi làm lại) tuỳ cấu trúc dự án.

* **Option A — Scenario 2: Bảo trì / Nâng cấp (Không có tài liệu)**
  * [ ] Task 0.A.1 (AG-02): Đọc source code → Trích xuất `02_Architect/Outputs/Legacy_Architecture.md` + `02_Architect/Outputs/Diagrams/Legacy_ERD.md` + `02_Architect/Outputs/Diagrams/Legacy_CallFlow.md`. *(Status: Pending)*
  * [ ] **[HUMAN CHECKPOINT]**: PM nạp yêu cầu thêm tính năng / fix bug vào `01_Analyst/Inputs/`. *(Status: Pending)*

* **Option B — Scenario 3: Refactoring / Viết lại từ SRS mới**
  * [ ] Task 0.B.1 (AG-02): Đọc source code → Trích xuất `02_Architect/Outputs/Legacy_Architecture.md` + Diagrams Legacy. *(Status: Pending)*
  * [ ] Task 0.B.2 (AG-01): Đọc SRS quy chuẩn mới → Bóc tách `01_Analyst/Outputs/Requirements_Spec.md` + `01_Analyst/Outputs/Product_Backlog.md`. *(Status: Pending)*

* [ ] **[CHECKPOINT]** Đã có Context hệ thống & Yêu cầu rõ ràng. Chuyển tiếp sang Phase 1.

---

## 🌍 GIAI ĐOẠN 1: PHÂN TÍCH YÊU CẦU (AG-01 — Business Analyst)
**Trạng thái:** ⏳ Đang xử lý

> **Input:** Tài liệu thô từ khách hàng (SRS, PRD, email, brief...) → để vào `01_Analyst/Inputs/`

* [ ] Task 1.1: Đọc toàn bộ tài liệu gốc → Xuất **`01_Analyst/Outputs/Requirements_Spec.md`** (Functional + Non-Functional requirements, có mã REQ-F-xxx). *(Status: Pending)*
* [ ] Task 1.2: Bóc tách user story theo module → Xuất **`01_Analyst/Outputs/Product_Backlog.md`** (ưu tiên Must/Should/Could, effort point). *(Status: Pending)*
* [ ] Task 1.3: Định nghĩa thuật ngữ nghiệp vụ → Xuất **`01_Analyst/Outputs/Glossary.md`**. *(Status: Pending)*
* [ ] Task 1.4: Xác định rủi ro → Xuất **`01_Analyst/Outputs/Risk_Register.md`** (severity: Critical/High/Medium/Low, mitigation). *(Status: Pending)*
* [ ] **[HUMAN CHECKPOINT]** PM review Requirements_Spec.md — xác nhận đúng yêu cầu trước khi AG-02 thiết kế. *(Status: Pending)*
* [ ] **[CHECKPOINT]** 4 file output hoàn chỉnh. Chuyển sang Phase 2.

---

## 📐 GIAI ĐOẠN 2: THIẾT KẾ KIẾN TRÚC HỆ THỐNG (AG-02 — System Architect)
**Trạng thái:** ⏹️ Chưa bắt đầu

> **Input:** Toàn bộ outputs Phase 1 + Legacy files (nếu Scenario 2/3)

### 📄 Tài liệu kiến trúc (lưu vào `02_Architect/Outputs/`)
* [ ] Task 2.1: Thiết kế C4 diagram + chọn tech stack → Xuất **`System_Architecture.md`**. *(Status: Pending)*
* [ ] Task 2.2: Phân tách module, dependency graph, thứ tự implement → Xuất **`Module_Breakdown.md`**. *(Status: Pending)*
* [ ] Task 2.3: Định nghĩa tất cả endpoints → Xuất **`API_Contracts.md`** (method, path, request/response schema, error codes). *(Status: Pending)*
* [ ] Task 2.4: Thiết kế database → Xuất **`Database_Schema.md`** (DDL, index, constraint, soft-delete policy). *(Status: Pending)*
* [ ] Task 2.5: Ghi lại quyết định kiến trúc → Xuất **`ADR.md`** (vấn đề → lựa chọn → lý do). *(Status: Pending)*
* [ ] Task 2.6 *(Scenario 2/3)*: Map kiến trúc hệ thống cũ → Xuất **`Legacy_Architecture.md`**. *(Status: Pending)*

### 📐 Diagrams bắt buộc (lưu vào `02_Architect/Outputs/Diagrams/`)
* [ ] Task 2.7: Vẽ ERD → Xuất **`ERD.md`** (Mermaid, quan hệ bảng, FK, cardinality). *(Status: Pending)*
* [ ] Task 2.8: Vẽ Sequence Diagram → Xuất **`Sequence_Diagram.md`** (luồng gọi Client→Controller→Service→Repository→DB). *(Status: Pending)*
* [ ] Task 2.9: Vẽ tổng quan layer → Xuất **`System_Architecture_Diagram.md`** (FE/BE/DB/External Services). *(Status: Pending)*
* [ ] Task 2.10: Vẽ luồng dữ liệu → Xuất **`DFD_Level1.md`** (data flow giữa các module). *(Status: Pending)*
* [ ] Task 2.11 *(Scenario 3)*: Reverse-engineer codebase cũ → Xuất **`Legacy_ERD.md`** + **`Legacy_CallFlow.md`**. *(Status: Pending)*

* [ ] **[HUMAN CHECKPOINT]** PM duyệt Database Schema và API Contracts trước khi AG-03 code. *(Status: Pending)*
* [ ] **[CHECKPOINT]** Hoàn thiện blueprint hệ thống (≥10 file). Chuyển sang Phase 3.

---

## 💻 GIAI ĐOẠN 3: LẬP TRÌNH (AG-03 — Developer)
**Trạng thái:** ⏹️ Chưa bắt đầu

> **Input:** Toàn bộ outputs Phase 1 & Phase 2 + `00_Global_Rules/` + `03_Developer/Memory/experience.md` (nếu có)

---

### 🟢 Kịch bản 1 — Greenfield (Song song theo module)

> *AG-03 spawn multi-instances, mỗi instance xử lý 1 module độc lập — không conflict file.*

* **Sprint 1 — Planning (dừng chờ PM approve)**
  * [ ] AG-03 đọc `Module_Breakdown.md` + `API_Contracts.md` + `Database_Schema.md` → Lập kế hoạch chi tiết → Xuất **`03_Developer/Outputs/[Module]/Implementation_Plan.md`**. *(Status: Pending)*
  * [ ] **[HUMAN CHECKPOINT]** PM review và Approve `Implementation_Plan.md` của từng module. *(Status: Pending)*

* **Sprint 2 — Implementation (chỉ chạy sau khi Plan được PM duyệt)**
  * [ ] Sprint 2.1: Setup Boilerplate & Base Entity (project structure, DI, base repo). *(Status: Pending)*
  * [ ] Sprint 2.2: Code từng module theo Implementation Plan — tuân thủ `API_Contracts.md` 100%. *(Status: Pending)*
  * [ ] Xuất source code → **`03_Developer/Outputs/[Module]/`** + **`03_Developer/Outputs/Changelog.md`**. *(Status: Pending)*

* [ ] **[CHECKPOINT]** Code build thành công không lỗi syntax. Ghép nối (Merge) tổng. Chuyển sang Phase 4.

---

### 🟡 Kịch bản 2 — Maintenance (Tuần tự, sửa trên code cũ)

> *Không chia module. AG-03 làm việc tuần tự trên toàn bộ codebase hiện có.*

* [ ] AG-03 đọc `Legacy_Architecture.md` + `API_Contracts.md` → Xuất **`03_Developer/Outputs/Implementation_Plan.md`**. *(Status: Pending)*
* [ ] **[HUMAN CHECKPOINT]** PM review và Approve `Implementation_Plan.md`. *(Status: Pending)*
* [ ] Implement lần lượt từng ticket theo thứ tự ưu tiên trong plan. *(Status: Pending)*
* [ ] Xuất source code patch → **`03_Developer/Outputs/TICKET-[xxx]/`** + **`03_Developer/Outputs/Changelog.md`**. *(Status: Pending)*
* [ ] **[CHECKPOINT]** Code build thành công, không regression. Chuyển sang Phase 4.

---

### 🔴 Kịch bản 3 — Refactoring (Tuần tự, viết lại từ SRS mới)

> *Không chia module. AG-03 viết lại hoàn toàn theo kiến trúc mới, tham chiếu `Legacy_Architecture.md` để không mất business logic.*

* [ ] AG-03 đọc `Requirements_Spec.md` + `Legacy_Architecture.md` + `Module_Breakdown.md` → Xuất **`03_Developer/Outputs/Implementation_Plan.md`**. *(Status: Pending)*
* [ ] **[HUMAN CHECKPOINT]** PM review và Approve `Implementation_Plan.md`. *(Status: Pending)*
* [ ] Setup Boilerplate & Base Entity theo kiến trúc mới hoàn toàn. *(Status: Pending)*
* [ ] Implement tuần tự theo Implementation Plan. *(Status: Pending)*
* [ ] Xuất source code mới → **`03_Developer/Outputs/01_DB/`**, **`03_Developer/Outputs/02_Backend/`**, **`03_Developer/Outputs/03_Frontend/`** + **`Changelog.md`**. *(Status: Pending)*
* [ ] **[CHECKPOINT]** Build thành công, coverage nghiệp vụ 100% so với `Requirements_Spec.md`. Chuyển sang Phase 4.

---

## 🧪 GIAI ĐOẠN 4: KIỂM THỬ & QA (AG-04 — QA Reviewer)
**Trạng thái:** ⏹️ Chưa bắt đầu

> **Input:** Toàn bộ outputs Phase 1, 2, 3 + `00_Global_Rules/` + `04_QA_Reviewer/Memory/experience.md` (nếu có)
> **Không sửa code** — chỉ report bug, kick-back lại AG-03 nếu cần.

* [ ] Task 4.1: Mapping Requirements → viết toàn bộ test cases → Xuất **`04_QA_Reviewer/Outputs/Test_Cases.md`** (Functional + Integration + Business Logic + Edge + Negative). *(Status: Pending)*
* [ ] Task 4.2: Chạy test cases → Xuất **`04_QA_Reviewer/Outputs/Test_Results.md`** (PASS / FAIL / BLOCKED). *(Status: Pending)*
* [ ] Task 4.3: Phân loại bug tìm thấy → Xuất **`04_QA_Reviewer/Outputs/Bug_Report.md`** (ID, severity, steps to reproduce). *(Status: Pending)*
* [ ] Task 4.4: Quét bảo mật OWASP Top 10 → Xuất **`04_QA_Reviewer/Outputs/Security_Scan.md`**. *(Status: Pending)*
* [ ] Task 4.5: Đo hiệu năng → Xuất **`04_QA_Reviewer/Outputs/Performance_Report.md`** (response time, N+1 query, bottleneck). *(Status: Pending)*
* [ ] Task 4.6 *(Scenario 2/3)*: Test regression → Xuất **`04_QA_Reviewer/Outputs/Regression_Checklist.md`**. *(Status: Pending)*
* [ ] Task 4.7: Tổng kết QA → Xuất **`04_QA_Reviewer/Outputs/QA_Sign_Off.md`** (**PASS RELEASE** hoặc **BLOCK RELEASE** + lý do). *(Status: Pending)*

> 🔁 **Feedback Loop:** Nếu `QA_Sign_Off.md` = BLOCK → AG-04 ghi bug vào `Bug_Report.md` → kick-back AG-03 → AG-03 fix → AG-04 retest.

* [ ] **[CHECKPOINT]** Pass rate ≥ 80% & Không có bug Critical. `QA_Sign_Off.md` = **PASS RELEASE**. Chuyển sang Phase 5.

---

## 📦 GIAI ĐOẠN 5: ĐÓNG GÓI TÀI LIỆU (AG-05 — Final Documenter)
**Trạng thái:** ⏹️ Chưa bắt đầu

> **Input:** Toàn bộ outputs Phase 1→4 + `00_Global_Rules/04_Template_Mapping.md` + `05_Final_Doc/Memory/experience.md` (nếu có)
> **Điều kiện tiên quyết:** `QA_Sign_Off.md` phải = PASS RELEASE trước khi bắt đầu Phase 5.

### 📄 Output tất cả kịch bản (lưu vào `05_Final_Doc/Outputs/`)
* [ ] Task 5.1: Tổng hợp toàn bộ → Xuất **`Final_Report.md`** (Executive Summary, phạm vi, kiến trúc, kết quả QA, rủi ro, next steps). *(Status: Pending)*
* [ ] Task 5.2: Viết hướng dẫn end-user → Xuất **`User_Manual.md`** (ngôn ngữ phi kỹ thuật, step-by-step). *(Status: Pending)*
* [ ] Task 5.3: Viết hướng dẫn kỹ thuật → Xuất **`Developer_Guide.md`** (setup môi trường, ERD, hướng dẫn deploy, contribution guide). *(Status: Pending)*
* [ ] Task 5.4: Compile API từ `API_Contracts.md` + verified bởi AG-04 → Xuất **`API_Documentation.md`** (endpoint, example, error codes). *(Status: Pending)*
* [ ] Task 5.5: Viết release notes → Xuất **`RELEASE_NOTES.md`** (version, date, tính năng mới, bug fix, breaking changes). *(Status: Pending)*
* [ ] Task 5.6: Chạy script render → `python utils/render_documents.py --agent AG-05`. *(Status: Pending)*

### 🟡 Chỉ Scenario 2 — Maintenance
* [ ] Task 5.7: Xuất **`Patch_Report.md`** (ticket list, files thay đổi, impact analysis, backward compatibility, rollback plan). *(Status: Pending)*

### 🔴 Chỉ Scenario 3 — Refactoring
* [ ] Task 5.8: Xuất **`Migration_Report.md`** (before/after architecture, breaking changes, migration steps cho end-user & devops, data migration results). *(Status: Pending)*

* [ ] **[CHECKPOINT]** All Done. Bàn giao bộ hồ sơ hoàn chỉnh.

---

## 🚨 BẢNG THEO DÕI VẤN ĐỀ (ISSUE TRACKER)

Nếu Agent có trục trặc, phải log vào đây theo format: `Ngày | Agent | Vấn đề | Trạng thái`

| Ngày | Agent | Vấn đề | Trạng thái |
|------|-------|---------|-----------|
| *(ví dụ) 2026-03-19* | *AG-02* | *Thiếu thông tin concurrent users trong SRS để chọn DB pool config* | *Pending clarification* |
