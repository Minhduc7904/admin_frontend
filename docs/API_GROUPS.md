# Danh mục nhóm API

Tài liệu này nhóm các API được frontend quản trị gọi trong thư mục `src/core/api`. Base URL mặc định là `http://localhost:3001/api` và có thể được thay đổi bằng biến môi trường `VITE_API_BASE_URL`.

| Nhóm API | Mục đích | Số API |
|---|---|---:|
| Auth API | Đăng ký, đăng nhập, đăng xuất, làm mới token và lấy người dùng hiện tại | 5 |
| Profile API | Xem, cập nhật hồ sơ và ảnh đại diện quản trị viên | 3 |
| User API | Quản lý trạng thái kích hoạt tài khoản người dùng | 1 |
| Admin API | Danh sách, tìm kiếm, xem và tạo quản trị viên | 4 |
| Super Admin API | Các tác vụ bảo trì dữ liệu và vận hành cấp cao | 8 |
| Student API | Quản lý học sinh, hồ sơ, thống kê và xuất dữ liệu | 11 |
| Subject API | Quản lý môn học | 5 |
| Tag API | Quản lý thẻ nội dung | 5 |
| Document API | Quản lý tài liệu và truy cập tài liệu theo slug | 6 |
| Teacher Profile API | Quản lý hồ sơ giáo viên | 5 |
| Chapter API | Quản lý chương, cây chương và tìm kiếm chương | 8 |
| Permission API | Quản lý quyền và nhóm quyền | 6 |
| Role API | Quản lý vai trò, gán vai trò và quyền của vai trò | 9 |
| Audit Log API | Tra cứu và hoàn tác nhật ký thao tác quản trị | 3 |
| Media API | Tải lên, xem, tải xuống, xử lý và xóa tệp phương tiện | 22 |
| SEO Media API | Quản lý vị trí và nội dung media phục vụ SEO | 12 |
| Media Folder API | Quản lý cây thư mục phương tiện | 7 |
| Media Usage API | Theo dõi liên kết giữa media và thực thể sử dụng | 6 |
| Course API | Quản lý khóa học, học phí và dữ liệu điểm danh theo khóa | 10 |
| Course Class API | Quản lý lớp học thuộc khóa học | 7 |
| Course Class Lesson API | Điều khiển hiển thị bài học theo lớp | 1 |
| Course Enrollment API | Quản lý ghi danh khóa học và xuất danh sách | 6 |
| Class Session API | Quản lý buổi học | 6 |
| Class Student API | Quản lý học sinh trong lớp | 4 |
| Attendance API | Quản lý điểm danh, thống kê, xuất và gửi thông báo | 11 |
| Learning Item API | Quản lý học liệu | 6 |
| Lesson API | Quản lý bài học | 5 |
| Video Content API | Quản lý nội dung video | 5 |
| Document Content API | Quản lý nội dung tài liệu trong học liệu | 5 |
| YouTube Content API | Quản lý nội dung YouTube | 5 |
| Homework Content API | Quản lý nội dung bài tập về nhà | 6 |
| Homework Submit API | Quản lý bài nộp và chấm bài tập | 6 |
| Lesson Learning Item API | Gắn, gỡ và sắp xếp học liệu trong bài học | 5 |
| Notification API | Nhận, đánh dấu, xóa và gửi thông báo | 7 |
| Tuition Payment API | Quản lý thanh toán học phí, thống kê và nhập/xuất Excel | 16 |
| Exam Import Session API | Nhập đề thi, tách câu, phân loại và chuyển dữ liệu | 10 |
| Temporary Exam API | Quản lý đề thi tạm trong phiên nhập | 3 |
| Temporary Section API | Quản lý phần thi tạm trong phiên nhập | 6 |
| Temporary Question API | Quản lý câu hỏi tạm trong phiên nhập | 7 |
| Temporary Statement API | Quản lý mệnh đề tạm của câu hỏi | 4 |
| Question API | Quản lý ngân hàng câu hỏi và liên kết với đề thi | 12 |
| Statement API | Quản lý mệnh đề/đáp án của câu hỏi | 3 |
| Exam API | Quản lý đề thi | 7 |
| Competition API | Quản lý kỳ thi/cuộc thi và thống kê câu hỏi | 8 |
| Competition Submit API | Quản lý bài thi đã nộp và chấm lại | 6 |
| Section API | Quản lý phần của đề thi | 5 |
| Markdown API | Sửa chính tả nội dung Markdown | 1 |

> Số API được tính theo từng cặp method–endpoint xuất hiện trong mã nguồn frontend.
