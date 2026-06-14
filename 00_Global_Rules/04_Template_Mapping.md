# THIẾT CHẾ 04: BẢO TỒN VÀ MAPPING TÀI LIỆU (TEMPLATE PRESERVATION & MAPPING)

Tài liệu này quy chuẩn cực kỳ nghiêm ngặt việc ứng xử với các tài liệu văn bản (.docx, .xlsx, .pdf).

## 1. Vùng Cấm (ZONES OF NO TOUCH)
- **TUYỆT ĐỐI KHÔNG SỬ DỤNG AI ĐỂ SINH VÀ GHI ĐÈ TRỰC TIẾP VÀO FILE VẬT LÝ:** LLM không giỏi giữ format XML của file Word và Excel. 
- Các Agent (AG-01 -> AG-04) chỉ được phép trích xuất ngữ nghĩa, tư duy toán học và lưu dưới dạng DATA (JSON).

## 2. Hệ Ngữ Pháp Placeholders định tuyến
- Các Templates trong `Templates/` đã được người (hoặc template builder) nhúng sẵn các thẻ tag có định dạng `{{TEN_BIEN}}`.
- Các Agent (từ 01 đến 04), khi hoàn thành nhiệm vụ, **BẮT BUỘC** phải rà soát file Template `.md` tương ứng để xem các thẻ `{{TEN_BIEN}}` đang yêu cầu là gì. Sau đó Render output của mình dưới dạng JSON có key là các biến đó.
- Ví dụ:
  ```json
  {
      "PROJECT_SUMMARY": "Mô tả của dự án...",
      "SYSTEM_DATE": "06/01/2026",
      ...
  }
  ```

## 3. Nhiệm Vụ Của Assembler (AG-05)
- Assembler (và các Script đính kèm) sở hữu Skill `@docx-official` và `@xlsx-official`.
- Chỉ duy nhất tại Output của AG-05, Script `render_documents.py` mới được kích hoạt, lôi json của các đời trước chèn vào `{{TEN_BIEN}}` trên file `docx/xlsx` gốc và save as ra file mới.
- Format file mẫu (Header, Footer, Bảng màu, Kích cỡ Line Height) phải được giữ nguyên cấu trúc 100%.