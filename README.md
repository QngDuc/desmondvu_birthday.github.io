# Birthday Flip

Trang sinh nhật tương tác bằng HTML, CSS và JavaScript thuần, dành tặng anh
Híu (Desmond Vũ). Nội dung gồm 48 lời chúc cộng đồng, một mục riêng cho lời
chúc từ modders, 9 món fan art (ảnh/GIF) và một video lời chúc; tên người gửi
được ghi nhận trong từng thẻ.

## Chạy và kiểm tra

Chạy server trong thư mục dự án rồi mở `http://localhost:8080`:

```sh
python -m http.server 8080
```

```sh
npm run check
```

Kiểm tra xác nhận nội dung, file media thực sự tồn tại và dung lượng gallery;
kiểm thử model và tương tác. Kiểm tra Node không thay thế kiểm thử WebGL trong
trình duyệt.

## Build và triển khai

Mã nguồn website nằm ở thư mục gốc. GitHub Pages hiện phục vụ bản ở thư mục gốc
của nhánh `main`. Cấu hình `.openai/hosting.json` lại trỏ static hosting vào
`dist/`; tạo bản triển khai đầy đủ cho cấu hình đó bằng:

```sh
npm run build
```

Lệnh build sao chép HTML, CSS, JavaScript, model và thư viện cục bộ vào `dist/`.
Chạy `npm run build` sau mỗi lần cập nhật trước khi triển khai qua hosting dùng
`dist/`.

## Nội dung và tài nguyên

- Lời chúc hiển thị và ghi công người gửi nằm trong `content.js`. Mục cộng đồng
  và mục modders được tách riêng; chỉ những người được xác định rõ là mod mới
  xuất hiện trong mục modders. Một số đoạn riêng tư, câu đùa quá cá nhân và
  nội dung lời bài hát đã được lược khỏi bản công khai.
- Khung lời chúc cuộn riêng, còn tiêu đề và nút chuyển lời nhắn luôn ở vị trí
  cố định để dễ đọc trên điện thoại; vùng cuộn cũng dùng được bằng bàn phím.
- Hướng dẫn sử dụng tự hiện trong lần truy cập đầu tiên; đóng lại hoặc nhấn nút
  `?` ở góc màn hình để mở lại bất cứ lúc nào.
- Fan art đã được chuyển thành các ảnh JPEG kích thước tối ưu trong
  `assets/fan-art/`; file gốc vẫn được giữ nguyên trong `fanart/`.
- Model Galaxy Z Flip 7 được tải cục bộ từ `assets/galaxy-z-flip-7.glb`
  (khoảng 1,4 MB). Các thư viện Three.js cũng nằm trong `vendor/`; không cần
  nhúng Sketchfab.
  - Dùng nút `+`/`−` hoặc con lăn chuột để phóng to/thu nhỏ điện thoại. Khi bật
    chế độ xoay, kéo ngoài màn hình để xoay ngang quanh trục đứng; màn hình và
    các nút app vẫn tương tác bình thường.
  - Ngày và giờ hiển thị theo múi giờ Việt Nam. Sinh nhật được tính vào ngày
  28/10; tuổi tự cập nhật theo năm.

## Ghi công và giấy phép

Model gốc: SAMSUNG Galaxy Z Flip 7 của zhe_kan — <https://skfb.ly/pLxPW> —
CC BY-NC-SA 4.0. Model và các sửa đổi model được cung cấp theo giấy phép này;
trang ghi rõ mục đích phi thương mại và giữ liên kết ghi công trong bảng
thông tin model.

Three.js 0.170.0 được lưu cục bộ theo MIT License; xem
`vendor/THREE-LICENSE.txt`. Giữ nguyên phần ghi công và thông báo giấy phép khi
thay đổi model hoặc thư viện.
