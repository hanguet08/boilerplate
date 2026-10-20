# QOrder Web

Gọi món bằng QR cho quán ăn — 1 web app responsive gồm 3 phần:

| Phần | Đường dẫn | Ghi chú |
|---|---|---|
| Khách hàng (QR) | `/order/:qrToken` → `/menu` → `/cart` → `/success` · `/history` | Không cần đăng nhập, giỏ món lưu localStorage theo bàn |
| App quán (PWA, mobile) | `/tables`, `/tables/:id`, `/orders`, `/menu`, `/more` | Tab bar dưới, popup + âm báo đơn mới qua Socket.IO, Web Push khi chạy nền |
| Quản trị (OWNER, desktop) | `/dashboard`, `/manage/tables`, `/menu`, `/orders`, `/staff`, `/settings` | Sidebar trái; cùng các trang trên, tự đổi layout theo màn hình |

Auth: `/login`, `/register`, `/restaurants` (chọn / tạo quán).

## Môi trường

- Node JS 18.17.1, Next JS 13.4 (pages router), antd 5, react-query 4, tailwind
- Backend QOrder (NestJS) chạy ở `NEXT_PUBLIC_API_HOST` (mặc định `http://localhost:3000`)
- Backend cần cấu hình `CLIENT_ORDER_URL={URL web này}/order` để link QR trỏ đúng trang khách

## Chạy local

1. `cp .env.example .env.local` và sửa `NEXT_PUBLIC_API_HOST` nếu cần
2. `npm install`
3. `npm run dev` → http://localhost:3001 (port 3001 để không trùng backend)

## Deploy

1. `npm install`
2. `npm run build`
3. `npm run start`

Web Push và "Thêm vào màn hình chính" cần HTTPS (localhost được miễn). iOS chỉ nhận Web Push khi đã thêm vào màn hình chính (iOS 16.4+).

## Cấu trúc

```
src/
  configs/ApiClient.ts     axios + Bearer token, 401 → /login
  constants/apiUrls.ts     toàn bộ endpoint theo tài liệu API
  services/*.service.ts    hàm gọi API theo module
  providers/               AuthProvider (token, quán đang chọn, role) · RealtimeProvider (socket staff)
  layout/app               sidebar desktop + tab bar mobile + guard đăng nhập
  layout/customer          khung mobile cho trang khách
  modules/                 customer · auth · tables · orders · menu · staff · settings · dashboard
public/sw.js, manifest.json, icons/   PWA + Web Push
```
