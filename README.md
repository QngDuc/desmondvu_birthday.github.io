# Birthday Flip

Trang sinh nhật tương tác bằng HTML, CSS và JavaScript thuần, dành tặng anh
Híu (Desmond Vũ). Trang có lời chúc từ cộng đồng và modders, cùng 10 món quà
fan art (9 ảnh/GIF và một video); tên người gửi được ghi nhận trong từng thẻ.

## Tính năng

- Mở đầu bằng video; khi video kết thúc, hộp quà xuất hiện. Bấm hộp để mở trang
  sinh nhật. Có thể bỏ qua video nếu muốn vào hộp quà ngay.
- Mô hình Galaxy Z Flip 7 3D có thể xoay, phóng to/thu nhỏ và gập lại.
- Các app trên điện thoại để đọc lời chúc cộng đồng, lời chúc modders, xem fan
  art, mở bất ngờ sinh nhật và đọc lời nhắn After credit. Màn hình chính căn
  giữa đồng hồ, thẻ sinh nhật và lưới ứng dụng. Lời chúc dài có thể cuộn riêng
  trong khung đọc.
- Chạm vào điện thoại để vào chế độ tập trung; nhấn nút đóng hoặc `Esc` để trở
  lại trang.
- Hướng dẫn sử dụng tự hiện lần đầu. Đóng hướng dẫn rồi nhấn nút `?` ở góc
  màn hình để mở lại.
- Đồng hồ và đếm ngược sinh nhật sử dụng múi giờ Việt Nam.

## Chạy và kiểm tra

Chạy server trong thư mục dự án rồi mở `http://localhost:8080`:

```sh
python -m http.server 8080
```

```sh
npm run check
```

Kiểm tra xác nhận nội dung, file media thực sự tồn tại và dung lượng gallery;
kiểm thử model và tương tác, bao gồm hướng dẫn lần đầu và nút mở lại. Kiểm tra
Node không thay thế kiểm thử WebGL và tương tác thực tế trong trình duyệt.

Video mở đầu không được tải trước khi người xem chọn phát. Các app, thư viện 3D
và model điện thoại chỉ khởi chạy sau khi bấm hộp quà; thao tác bỏ qua video
không tải file video.

## Build và triển khai

Mã nguồn website nằm ở thư mục gốc. GitHub Pages hiện phục vụ bản ở thư mục gốc
của nhánh `main`. Cấu hình `.openai/hosting.json` lại trỏ static hosting vào
`dist/`; tạo bản triển khai đầy đủ cho cấu hình đó bằng:

```sh
npm run build
```

Lệnh build sao chép HTML, CSS, JavaScript, video mở đầu, model và thư viện cục
bộ vào `dist/`.
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
- Fan art công khai đã được tối ưu trong `assets/fan-art/`. Các file gốc trong
  `fanart/` và bản thu thập lời chúc `lời chúc.txt` được Git bỏ qua để giữ riêng
  tư; chúng vẫn có thể tồn tại trên máy phát triển. Trang dùng nội dung đã
  biên tập trong `content.js` và media tối ưu, nên không cần các file gốc để
  build hoặc triển khai.
- Model Galaxy Z Flip 7 được tải cục bộ từ `assets/galaxy-z-flip-7.glb`
  (khoảng 1,4 MB). Các thư viện Three.js cũng nằm trong `vendor/`; không cần
  nhúng Sketchfab.
- Dùng nút `+`/`−` hoặc con lăn chuột để phóng to/thu nhỏ điện thoại. Khi bật
  chế độ xoay, kéo bên ngoài màn hình để xoay quanh trục đứng; màn hình và các
  nút app vẫn tương tác bình thường.
- Sinh nhật được tính vào ngày 28/10; tuổi tự cập nhật theo năm.

## Ghi công và giấy phép

Model gốc: SAMSUNG Galaxy Z Flip 7 của zhe_kan — <https://skfb.ly/pLxPW> —
CC BY-NC-SA 4.0. Model và các sửa đổi model được cung cấp theo giấy phép này;
trang ghi rõ mục đích phi thương mại và giữ liên kết ghi công trong bảng
thông tin model.

Three.js 0.170.0 được lưu cục bộ theo MIT License; xem
`vendor/THREE-LICENSE.txt`. Giữ nguyên phần ghi công và thông báo giấy phép khi
thay đổi model hoặc thư viện.
