# Birthday Flip

Trang sinh nhật tĩnh bằng HTML/CSS/JS. Chạy `python -m http.server 8080` trong thư mục dự án rồi mở http://localhost:8080.

Thư mục gốc là nguồn website duy nhất; các file HTML, CSS, JavaScript, assets và thư viện dùng trực tiếp từ đây. Điện thoại được render từ `assets/galaxy-z-flip-7.glb` bằng Three.js (WebGL). Các app HTML được gắn vào mặt màn hình bằng CSS3DRenderer, cùng camera và biến đổi với model. Bản lề điều khiển nửa trên của model; màn hình ngoài có thể chạm để mở lại. Model bao gồm hai bản điện thoại, chỉ bản có hai nửa tách rời được sử dụng. Không cần nhúng Sketchfab hoặc tải thư viện từ CDN khi chạy.

Model gốc: SAMSUNG Galaxy Z Flip 7 của zhe_kan — https://skfb.ly/pLxPW — CC BY-NC-SA 4.0. Model và các sửa đổi model tuân theo giấy phép này. Three.js 0.170.0 được lưu trong `vendor` cùng MIT LICENSE; đường dẫn import được đổi thành đường dẫn tương đối.

Kiểm tra: `npm run check`. Kiểm tra hình học GLB xác nhận bản lề, tỷ lệ màn hình và thao tác gập/mở; phần giải mã ảnh được giả lập trong kiểm tra Node, nên không thay thế kiểm tra hình ảnh/WebGL trong trình duyệt.

Thay lời chúc trong `app.js` (mảng wishes). Tên Desmond lấy theo thư mục dự án; có thể sửa trong `index.html` và `app.js`.
 
Chạm vào thân máy hoặc màn hình để vào chế độ tập trung: phần chữ ngoài máy dạt ra và điện thoại chuyển vào giữa cửa sổ. Bấm × hoặc Esc để trở lại. Nội dung hiện có hai lời chúc và hai ảnh minh họa anime mẫu do AI tạo, lưu trong `assets/fan-art-*.png`; thay ảnh trong mảng `artworks` của `app.js`.
