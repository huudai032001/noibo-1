1. Tai router confirm-sms-test-input
1.1 Hãy sử dụng tailwind và primeVue để làm toàn bộ component
2. Lấy logic cũ từ: F:\projects\noibo\src\views/pages/confirm-sms-test-input/ConfirmSmsTestInput.vue toàn
   bộ composables/components/models/apis liên quan
3. Refactor toàn bộ logic sang composables 

- Không viết business logic trực tiếp trong component page
- Tách:
  - API calls
  - state management
  - table handlers
  - filter handlers
  - pagination handlers
  - dialog handlers ra composables riêng

5. Structure cần tuân theo: ├── composables/ ├── components/ ├── models/ ├── services/ ├──constants/
6. Nếu thiếu model/type/interface:

- Hãy tự tạo thêm đầy đủ
- Sử dụng TypeScript typing đầy đủ
- API response luôn dùng camelCase
- Không dùng snake_case trong frontend models
- Không dùng Record<>
-

7. Nếu có dialog/modal:

- Tách riêng component vào folder components
- Dialog phải reusable
- Emit event đầy đủ
- Không viết inline dialog trong page

8. API sẽ luôn trả response camelCase vậy nên khi tạo model hãy sử dụng camelCase
9. UI requirements:

- Responsive
- Đồng bộ style với PaymentLogs.vue
- Reuse component hiện có nếu project đã có

10. Nếu có export Exel hãy học export từ IssueFeedbackList.vue bên F:\projects\admin
11. các loại format hãy sử dụng từ use-formatter.ts
12. khi call API params luôn là snake_cased
13. Khi mà ở trang chi tiết cần có UI UX để quay lại trang trước
