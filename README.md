# Games Toán 10

Trang web tĩnh gom các trò chơi, mô phỏng và phiếu học tập Toán 10 (SK_6, Trường THPT Đức Linh).
Tên miền dự kiến: **https://smath.io.vn**

## Cấu trúc

```
index.html     Trang chủ: liệt kê, lọc theo chủ đề, liên kết tới từng trò
games/         Các file HTML trò chơi (3 file SK_6 gốc giữ nguyên nội dung + 6 trò chơi mới)
assets/        common.css, common.js dùng chung cho 6 trò chơi mới (âm thanh, lưu sao, màn kết quả)
404.html       Trang báo lỗi khi gõ sai địa chỉ
CNAME          Tên miền riêng cho GitHub Pages (smath.io.vn)
.nojekyll      Cho GitHub Pages phục vụ file nguyên trạng
```

## Trò chơi mới (xây theo quy trình Dự đoán, Kiểm tra, Giải thích, Vận dụng của sáng kiến SK_6)

| Trò chơi | Chủ đề | Ý tưởng |
|---|---|---|
| Kho báu côsin | Hệ thức lượng | Đoán BC dài hơn hay ngắn hơn, rồi tính BC hoặc góc A |
| Robot vectơ | Vectơ | Đoán hướng và độ dài, chọn k để robot tới pin |
| Đội trưởng Venn | Mệnh đề và tập hợp | Hợp, giao, chỉ một nhóm, chuyển thẻ giữa các miền |
| Thợ săn phản ví dụ | Mệnh đề và tập hợp | Mệnh đề, mệnh đề đảo, chọn thẻ số làm phản ví dụ |
| Thám tử bắt lỗi | Cả 3 chủ đề | Tìm dòng sai trong lời giải, chọn lý do |
| Thử thách 60 giây | Cả 3 chủ đề | Câu hỏi ngẫu nhiên, combo nhân điểm |

Điểm cao và số sao được lưu ngay trên trình duyệt của học sinh (localStorage), không cần tài khoản, và hiện trên trang chủ.

## Thêm trò chơi mới

1. Chép file HTML vào thư mục `games/` (tên file không dấu, không khoảng trắng).
2. Mở `index.html`, tìm danh sách `ITEMS` và thêm một mục:

```js
{
  group: "game",            // "game" trò chơi | "sim" mô phỏng | "doc" phiếu, hướng dẫn
  icon: "🎯", color: "var(--t-vec)",
  title: "Tên trò chơi",
  desc: "Mô tả ngắn một câu.",
  topics: ["vector"],       // "logic" | "triangle" | "vector"
  href: "games/ten_file.html", kind: "Cá nhân"
},
```

Muốn thêm chủ đề mới (ví dụ hàm số bậc hai): thêm một nút `chip` trong `index.html` và một dòng trong `TOPIC_NAMES`.

## Xem thử trên máy

Mở thẳng `index.html` bằng Chrome hoặc Edge là chạy, không cần cài gì.

## Đưa lên mạng với GitHub Pages

1. Trên GitHub, vào repo → **Settings → Pages**.
2. Mục **Source** chọn *Deploy from a branch*, nhánh `main`, thư mục `/ (root)`, bấm **Save**.
3. Sau 1–2 phút trang chạy tại `https://thanhsonglbt-coder.github.io/trochoitoan10/`.

## Trỏ tên miền smath.io.vn

Vào trang quản lý DNS nơi mua tên miền `smath.io.vn` và tạo các bản ghi:

| Loại  | Tên (Host) | Giá trị                        |
|-------|------------|--------------------------------|
| A     | @          | 185.199.108.153                |
| A     | @          | 185.199.109.153                |
| A     | @          | 185.199.110.153                |
| A     | @          | 185.199.111.153                |
| CNAME | www        | thanhsonglbt-coder.github.io   |

Xóa các bản ghi A/CNAME cũ cho `@` và `www` nếu có (ví dụ trang đỗ mặc định của nhà cung cấp).

Sau đó:

1. Vào **Settings → Pages**, ô **Custom domain** đã có sẵn `smath.io.vn` (nhờ file `CNAME`). Nếu trống thì gõ vào và **Save**.
2. Chờ DNS cập nhật (vài phút đến 24 giờ). Khi GitHub báo *DNS check successful*, đánh dấu **Enforce HTTPS**.
3. Kiểm tra: mở `https://smath.io.vn`.

Gợi ý: nên xác minh tên miền trong **GitHub → Settings (tài khoản) → Pages → Add a domain** để không ai khác dùng được `smath.io.vn` trên GitHub Pages.
