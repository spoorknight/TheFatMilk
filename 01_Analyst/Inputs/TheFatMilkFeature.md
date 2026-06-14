# **TÀI LIỆU MÔ TẢ DỰ ÁN: HỆ THỐNG QUẢN LÝ CHUỖI TIỆM BÁNH & ĐỒ UỐNG — THƯƠNG MẠI ĐIỆN TỬ TÍCH HỢP PWA, CRM PHÂN HẠNG THÀNH VIÊN, VÍ ĐIỆN TỬ & ĐIỂM THƯỞNG**

* **Thương hiệu sở hữu:** THE FAT MILK  
* **Lĩnh vực:** F&B — Tiệm bánh & Đồ uống (Bakery & Beverage)  
* **Mô hình hệ thống:** 2-in-1 Omnichannel System (Tích hợp quản lý nội bộ và bán hàng đa kênh trực tuyến).

## **I. TỔNG QUAN DỰ ÁN & MỤC TIÊU**

Dự án xây dựng một hệ thống nền tảng phần mềm duy nhất cho **The Fat Milk**, sử dụng chung một cơ sở dữ liệu (Database) trung tâm nhưng chia tách thành các phân hệ giao diện chuyên biệt nhằm tối ưu hóa vận hành chuỗi đa chi nhánh (Multi-branch) và cá nhân hóa trải nghiệm khách hàng (CRM).

### **1\. Mục tiêu chiến lược**

* **Quản lý chuỗi nội bộ (The Fat Milk POS/Admin):** Giúp chủ cửa hàng và nhân viên quản lý tồn kho riêng biệt theo từng chi nhánh, tạo đơn bán hàng nhanh tại quầy, quản lý dòng tiền và dữ liệu khách hàng tập trung.  
* **Bán hàng trực tuyến di động (The Fat Milk PWA App):** Cung cấp ứng dụng dạng Progressive Web App (PWA) cho khách hàng cài đặt trực tiếp từ trình duyệt web lên màn hình chính của điện thoại. Hỗ trợ chọn chi nhánh, nạp/tiêu tiền qua Ví thành viên, tích/đổi điểm thưởng và hưởng ưu đãi tự động theo hạng thành viên.  
* **Đồng bộ thời gian thực (Real-time sync):** Đảm bảo mọi giao dịch online (qua App) và offline (tại quầy) đều tương tác trực tiếp trên kho và ví điện tử một cách chính xác tuyệt đối, chống lỗi bán quá số lượng (Over-selling).

## **II. KIẾN TRÚC CHUỖI & QUY TẮC VẬN HÀNH**

### **1\. Kiến trúc Đa chi nhánh (Multi-Branch)**

* Mỗi chi nhánh vật lý được cấp một mã định danh branch\_id trong hệ thống.  
* **Tách biệt kho:** Số lượng tồn kho được quản lý riêng theo từng chi nhánh.  
* **Phân quyền nhân viên:** Nhân viên thuộc chi nhánh nào chỉ có quyền thao tác trên giao diện POS của chi nhánh đó, dữ liệu doanh thu và xuất kho tự động tính cho chi nhánh tương ứng.  
* **Định vị đơn trực tuyến:** Khi khách hàng truy cập App, hệ thống yêu cầu chọn chi nhánh (hoặc tự gợi ý dựa trên vị trí) để hiển thị đúng tình trạng còn/hết hàng của kho chi nhánh đó.

### **2\. Tiêu chí phân hạng khách hàng CRM (Customer Tiering)**

Hệ thống tự động tính toán tổng chi tiêu tích lũy (total\_spent) từ các đơn hàng đã giao thành công để phân hạng khách hàng:

* **Hạng Đồng (Bronze):** Khách hàng mới đăng ký tài khoản (Mặc định).  
* **Hạng Bạc (Silver):** Tổng chi tiêu tích lũy đạt từ **2.000.000đ** trở lên.  
* **Hạng Vàng (Gold):** Tổng chi tiêu tích lũy đạt từ **5.000.000đ** trở lên.  
* **Hạng Kim Cương (Diamond):** Tổng chi tiêu tích lũy đạt từ **10.000.000đ** trở lên.

## **III. DANH SÁCH CHỨC NĂNG CHI TIẾT (FEATURE MATRIX)**

### **PHÂN HỆ 1: ỨNG DỤNG DI ĐỘNG & WEBSITE BÁN HÀNG (KHÁCH HÀNG \- PWA)**

#### **1\. Tính năng Progressive Web App (PWA) kỹ thuật**

* Tự động hiển thị pop-up gợi ý *"Thêm The Fat Milk vào màn hình chính"* trên thiết bị di động.  
* Sau khi cài đặt, app chạy độc lập toàn màn hình (không hiển thị thanh địa chỉ URL của trình duyệt).  
* Tích hợp Service Workers để lưu bộ nhớ đệm (Cache), tối ưu tốc độ tải trang dưới 2 giây và cho phép xem sản phẩm ngay cả khi mất mạng (Offline Mode).  
* Yêu cầu bảo mật: Toàn bộ hệ thống chạy trên giao thức mã hóa mã nguồn **HTTPS**.

#### **2\. Cấu trúc Giao diện Trang chủ (Homepage)**

Thiết kế cuộn dọc theo tư duy Mobile-First bao gồm các khối block:

* **Header cố định:** Logo **The Fat Milk**, Thanh tìm kiếm nhanh (Search bar), Icon Giỏ hàng (hiển thị số lượng sản phẩm đang có).  
* **Khối Chọn Chi Nhánh:** Hiển thị chi nhánh khách đang xem kho (Ví dụ: *Chi nhánh Cầu Giấy*). Khách có thể bấm vào để thay đổi vị trí mua hàng.  
* **Banner Slider:** Ảnh trượt chạy các chiến dịch Marketing, sản phẩm mới ra lò, bánh theo mùa lễ, hoặc chương trình tặng quà khi nạp ví.  
* **Thẻ Thành Viên VIP (Quick View):** Hiển thị nhanh Tên khách hàng \+ Tag hạng thành viên hiện tại ngay trên trang chủ để tăng tính cá nhân hóa.  
* **Khối Flash Sale / Giờ vàng:** Đồng hồ đếm ngược thời gian kết thúc kèm danh sách sản phẩm giảm giá (Hiển thị giá gốc gạch ngang và giá đã giảm).  
* **Khối Danh Mục Nhanh:** Các icon tròn liên kết nhanh đến từng dòng sản phẩm (Bánh ngọt, Bánh mì, Đồ uống, Topping, Combo...).  
* **Khối Danh Sách Sản Phẩm (Product Feed):** Lưới sản phẩm 2 cột mượt mà, hiển thị giá bán thực tế được cá nhân hóa theo hạng thành viên của tài khoản đang đăng nhập. Mỗi sản phẩm hiển thị ảnh, tên, giá, và tag thông tin dị ứng (allergens) nếu có.

#### **3\. Hệ thống Điều hướng cố định (Bottom Navigation Bar)**

Nằm cố định ở đáy màn hình trên mọi thiết bị di động với cấu trúc 4 tab:

* **Tab 1: Trang Chủ (Home):** Quay về màn hình chính của cửa hàng.  
* **Tab 2: Danh Mục (Categories):** Cây danh mục phân loại toàn bộ sản phẩm của shop.  
* **Tab 3: Thông Báo (Notifications):** Nhận tin nhắn tự động về trạng thái đơn hàng, biến động số dư ví, ưu đãi thăng hạng VIP.  
* **Tab 4: Cá Nhân (Profile) \- Trung tâm quản lý tài khoản & Tài chính:**  
  * *Thông tin chung:* Ảnh đại diện, Tên, Hạng thành viên hiện tại kèm thanh tiến trình (Progress bar) hiển thị số tiền cần chi tiêu thêm để lên hạng kế tiếp.  
  * *Phân khu Quản lý Tài chính (Gom chung):*  
    * **Ví điện tử thành viên (The Fat Milk Wallet):** Hiển thị số dư hiện tại. Nút "Nạp tiền" tự động tạo mã QR động qua **SePay** chứa sẵn số tiền và nội dung định danh. Khách chuyển khoản thành công hệ thống tự động cộng số dư trong vài giây (qua SePay Webhook).  
    * **Điểm thưởng (Reward Points):** Hiển thị số điểm hiện có, lịch sử tích điểm từ đơn hàng và lịch sử trừ điểm khi mua sắm.  
  * *Quản lý đơn hàng:* Lịch sử mua sắm, bộ lọc theo dõi trạng thái đơn (Chờ duyệt $\\rightarrow$ Đang giao $\\rightarrow$ Đã giao $\\rightarrow$ Đã hủy).  
  * *Kho Voucher của tôi:* Nơi lưu trữ và hiển thị các mã giảm giá cá nhân.

#### **4\. Quy trình Giỏ hàng & Thanh toán tổng hợp**

* Khách hàng có thể chọn mua hàng bằng cách kết hợp đồng thời:  
  * Giá sản phẩm tự động giảm theo hạng thành viên.  
  * Áp dụng thêm mã mã giảm giá (Voucher) từ kho voucher nếu đủ điều kiện đơn hàng.  
  * Tích chọn *"Dùng điểm thưởng để giảm giá"* (Quy đổi điểm thành tiền theo tỷ lệ cấu hình, ví dụ: 1.000 điểm \= 10.000đ).  
* **Ghi chú đơn hàng:** Khách hàng có thể ghi chú cho từng sản phẩm trong giỏ (ví dụ: "ít đường", "không đá", "thêm kem", "giao lạnh").  
* Phương thức thanh toán: Trừ trực tiếp vào số dư **Ví điện tử thành viên**, thanh toán **COD** hoặc quét **QR ngân hàng**.

### **PHÂN HỆ 2: GIAO DIỆN BÁN HÀNG TẠI QUẦY (THE FAT MILK POS)**

* **Tối ưu thao tác:** Giao diện một màn hình chuyên dụng cho nhân viên chi nhánh, hỗ trợ tìm kiếm nhanh sản phẩm hoặc sử dụng máy quét mã vạch (Barcode) để đưa sản phẩm vào đơn.  
* **Nhận diện khách hàng CRM:** Nhân viên nhập SĐT khách hàng để hệ thống truy xuất nhanh: Tên, Hạng thành viên, Số dư ví và Điểm thưởng hiện có.  
* **Áp dụng ưu đãi tại quầy:** Hệ thống POS tự động áp dụng mức chiết khấu theo hạng thành viên của khách lên hóa đơn (Ví dụ: Khách Vàng tự động được giảm 2% hóa đơn) hoặc cho phép nhân viên nhập mã voucher của khách.  
* **Thao tác Ví & Điểm tại quầy:** Nhân viên có thể hỗ trợ khách tiêu điểm thưởng hoặc bấm trừ tiền trong Ví thành viên của khách bằng cách yêu cầu khách đọc mã xác nhận hoặc quét mã QR ví trên app của khách.  
* **In hóa đơn:** Kết nối máy in nhiệt K80/K57, in hóa đơn có đầy đủ thông tin tên chi nhánh, hạng thành viên của khách, chi tiết số tiền giảm từ voucher/điểm thưởng và số dư tài chính mới của khách sau khi kết thúc giao dịch.

### **PHÂN HỆ 3: TRANG QUẢN TRỊ TRUNG TÂM (ADMIN PANEL \- CHỦ CHUỖI)**

* **Quản lý Cấu trúc Chuỗi:** Thêm, sửa, cấu hình thông tin (địa chỉ, số điện thoại, trạng thái hoạt động) của các chi nhánh.  
* **Quản lý Sản phẩm & Tổng Kho (Inventory Control):**  
  * Tạo và quản lý danh mục sản phẩm tập trung (giá nhập, giá bán lẻ, SKU, danh mục: Bánh ngọt/Bánh mì/Đồ uống/Topping/Combo, thuộc tính: trọng lượng/dung tích, thành phần nguyên liệu, thông tin dị ứng, hạn sử dụng, nhiệt độ bảo quản).  
  * Hỗ trợ sản phẩm theo mùa/giới hạn (limited edition, bánh lễ Tết/Noel...) với trạng thái bán theo thời gian.  
  * Hỗ trợ tạo Combo/Bundle (ví dụ: 1 bánh + 1 đồ uống) với giá ưu đãi.  
  * Phân bổ và điều phối số lượng tồn kho riêng biệt cho từng chi nhánh. Theo dõi lịch sử xuất \- nhập \- tồn và phiếu chuyển kho giữa các chi nhánh.  
* **Quản lý Đơn hàng Toàn chuỗi:** Bộ lọc đơn hàng thông minh theo từng chi nhánh, theo nguồn đơn (Online từ App/ PWA hoặc Offline từ POS tại quầy).  
* **Hệ thống CRM & Cấu hình Hạng thành viên:**  
  * Thiết lập ngưỡng chi tiêu thăng hạng (Đồng, Bạc, Vàng, Kim Cương) và phần trăm giảm giá mặc định của từng hạng.  
  * Hệ thống chạy ngầm tự động quét và thăng hạng cho khách khi đơn hàng chuyển sang trạng thái "Đã giao".  
* **Cấu hình Cơ chế Ví & Điểm Thưởng:**  
  * Cài đặt tỷ lệ tích điểm (Ví dụ: 100.000đ hóa đơn đổi lại 10 điểm) và tỷ lệ tiêu điểm quy đổi ra tiền mặt.  
  * Quản lý biến động số dư hệ thống, đối soát dòng tiền nạp vào ví thành viên của khách hàng qua cổng **SePay**.  
* **Quản lý Khuyến mãi & Voucher theo phân khúc đối tượng (Targeted Marketing):**  
  * Khi tạo chương trình giảm giá sản phẩm (Flash sale) hoặc tạo mã Voucher code, Admin có quyền chọn **"Đối tượng áp dụng"**: *Tất cả khách hàng* hoặc *Chỉ áp dụng riêng cho một/một nhóm hạng thành viên cụ thể (Ví dụ: Chỉ hạng Vàng và Kim Cương mới dùng được)*.  
  * Cấu hình phạm vi chương trình: Áp dụng cho toàn bộ các chi nhánh hệ thống hoặc chỉ chạy riêng tại một chi nhánh cố định.  
* **Báo cáo & Thống kê đa chiều:** Biểu đồ doanh thu, lợi nhuận chi tiết của từng chi nhánh; thống kê sản phẩm bán chạy; báo cáo tổng số tiền khách đang giữ trong ví thành viên để đối soát tài chính.

## **IV. CÁC YÊU CẦU KỸ THUẬT & BẢO MẬT NÂNG CAO**

### **1\. Bảo mật giao dịch Ví điện tử (Race Condition Control)**

* Hệ thống Backend bắt buộc phải sử dụng cơ chế **Database Transaction** và **Row-level locking** cực kỳ nghiêm ngặt tại các API thay đổi số dư ví và điểm thưởng. Khi khách hàng bấm thanh toán, hệ thống phải thực hiện khóa tạm thời tiến trình của user đó $\\rightarrow$ kiểm tra số dư thực tế $\\rightarrow$ trừ tiền $\\rightarrow$ tạo đơn hàng $\\rightarrow$ trả kết quả $\\rightarrow$ mở khóa. Tuyệt đối không để xảy ra lỗi bấm liên tiếp nhiều lần khiến số dư ví bị âm hoặc một số dư mua được nhiều đơn hàng cùng lúc.  
* Toàn bộ API tài chính phải được ký mã bảo mật (Token verification), không tin cậy dữ liệu truyền từ Frontend.

### **2\. Xử lý đồng bộ kho chống bán quá số lượng (Over-selling)**

* Khi sản phẩm tại một chi nhánh chỉ còn số lượng bằng 1, nếu có nhiều lượt bấm mua cùng lúc (từ khách online chọn chi nhánh đó hoặc từ nhân viên quét mã tại quầy), hệ thống backend phải đưa các request vào hàng đợi (Queue). Request nào gửi trước một phần mili-giây sẽ được xử lý trừ kho và tạo đơn, request đến sau lập tức bị từ chối và thông báo "Sản phẩm đã hết hàng tại chi nhánh này".