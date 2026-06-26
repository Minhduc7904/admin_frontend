# Chi tiết API

Tài liệu được tổng hợp từ các lời gọi trong `src/core/api` và hằng `API_ENDPOINTS` tại `src/core/constants/index.js`. Các tham số động được biểu diễn bằng `{tênThamSố}`.

- `Auth = Yes`: frontend gửi access token nếu token đang có trong local storage.
- `Auth = No`: endpoint xác thực công khai theo luồng đăng nhập/đăng ký/làm mới token.
- Cột Auth phản ánh cách frontend sử dụng API; quyền thực tế vẫn do backend quyết định.

## Auth API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| POST | `/api/auth/admin/login` | Đăng nhập quản trị viên | No |
| GET | `/api/auth/admin/me` | Lấy thông tin quản trị viên hiện tại | Yes |
| POST | `/api/auth/admin/register` | Đăng ký tài khoản quản trị viên | No |
| POST | `/api/auth/logout` | Đăng xuất và thu hồi refresh token | Yes |
| POST | `/api/auth/refresh` | Làm mới access token | No |

## Profile API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/admin/profile` | Lấy hồ sơ quản trị viên hiện tại | Yes |
| PUT | `/api/admin/profile` | Cập nhật hồ sơ | Yes |
| POST | `/api/admin/profile/avatar` | Tải lên ảnh đại diện | Yes |

## User API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| PATCH | `/api/users/{id}/toggle-activation` | Bật hoặc khóa tài khoản người dùng | Yes |

## Admin API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/admins` | Lấy danh sách quản trị viên | Yes |
| POST | `/api/admins` | Tạo quản trị viên | Yes |
| GET | `/api/admins/{id}` | Lấy chi tiết quản trị viên | Yes |
| GET | `/api/admins/search` | Tìm kiếm dữ liệu | Yes |

## Super Admin API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| POST | `/api/super-admin/cleanup-unused-media-older-than-30-days` | Dọn media không sử dụng quá 30 ngày | Yes |
| POST | `/api/super-admin/exams/generate-missing-slugs` | Tạo slug còn thiếu cho đề thi | Yes |
| POST | `/api/super-admin/questions/regenerate-slugs` | Tạo lại slug câu hỏi | Yes |
| POST | `/api/super-admin/reset-password-by-date-range` | Đặt lại mật khẩu theo khoảng ngày | Yes |
| POST | `/api/super-admin/students/graduation-year/by-grade` | Cập nhật năm tốt nghiệp theo khối | Yes |
| POST | `/api/super-admin/students/promote-grade/by-graduation-year` | Tăng khối học sinh theo năm tốt nghiệp | Yes |
| POST | `/api/super-admin/tags/seed-defaults` | Khởi tạo các thẻ mặc định | Yes |
| POST | `/api/super-admin/update-admin-direct` | Cập nhật trực tiếp dữ liệu quản trị viên | Yes |

## Student API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/students` | Lấy danh sách học sinh | Yes |
| POST | `/api/students` | Tạo học sinh | Yes |
| DELETE | `/api/students/{id}` | Xóa học sinh | Yes |
| GET | `/api/students/{id}` | Lấy chi tiết học sinh | Yes |
| PUT | `/api/students/{id}` | Cập nhật học sinh | Yes |
| GET | `/api/students/export/excel` | Xuất danh sách ra Excel | Yes |
| GET | `/api/students/me` | Lấy hồ sơ học sinh hiện tại | Yes |
| PUT | `/api/students/me` | Cập nhật hồ sơ học sinh hiện tại | Yes |
| GET | `/api/students/search` | Tìm kiếm dữ liệu | Yes |
| GET | `/api/students/stats/grade` | Thống kê học sinh theo khối | Yes |
| GET | `/api/students/stats/status` | Thống kê học sinh theo trạng thái | Yes |

## Subject API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/subjects` | Lấy danh sách môn học | Yes |
| POST | `/api/subjects` | Tạo môn học | Yes |
| DELETE | `/api/subjects/{id}` | Xóa môn học | Yes |
| GET | `/api/subjects/{id}` | Lấy chi tiết môn học | Yes |
| PUT | `/api/subjects/{id}` | Cập nhật môn học | Yes |

## Tag API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/tags` | Lấy danh sách thẻ | Yes |
| POST | `/api/tags` | Tạo thẻ | Yes |
| DELETE | `/api/tags/{id}` | Xóa thẻ | Yes |
| GET | `/api/tags/{id}` | Lấy chi tiết thẻ | Yes |
| PUT | `/api/tags/{id}` | Cập nhật thẻ | Yes |

## Document API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/documents` | Lấy danh sách tài liệu | Yes |
| POST | `/api/documents` | Tạo tài liệu | Yes |
| DELETE | `/api/documents/{id}` | Xóa tài liệu | Yes |
| GET | `/api/documents/{id}` | Lấy chi tiết tài liệu | Yes |
| PUT | `/api/documents/{id}` | Cập nhật tài liệu | Yes |
| GET | `/api/documents/slug/{slug}` | Lấy tài liệu theo slug | Yes |

## Teacher Profile API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/teacher-profiles` | Lấy danh sách hồ sơ giáo viên | Yes |
| POST | `/api/teacher-profiles` | Tạo hồ sơ giáo viên | Yes |
| DELETE | `/api/teacher-profiles/{id}` | Xóa hồ sơ giáo viên | Yes |
| GET | `/api/teacher-profiles/{id}` | Lấy chi tiết hồ sơ giáo viên | Yes |
| PUT | `/api/teacher-profiles/{id}` | Cập nhật hồ sơ giáo viên | Yes |

## Chapter API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/chapters` | Lấy danh sách chương | Yes |
| POST | `/api/chapters` | Tạo chương | Yes |
| DELETE | `/api/chapters/{id}` | Xóa chương | Yes |
| GET | `/api/chapters/{id}` | Lấy chi tiết chương | Yes |
| PUT | `/api/chapters/{id}` | Cập nhật chương | Yes |
| GET | `/api/chapters/{parentChapterId}/children` | Lấy các chương con của một chương | Yes |
| GET | `/api/chapters/root` | Lấy danh sách chương gốc | Yes |
| GET | `/api/chapters/search` | Tìm kiếm dữ liệu | Yes |

## Permission API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/permissions` | Lấy danh sách quyền | Yes |
| POST | `/api/permissions` | Tạo quyền | Yes |
| DELETE | `/api/permissions/{id}` | Xóa quyền | Yes |
| GET | `/api/permissions/{id}` | Lấy chi tiết quyền | Yes |
| PUT | `/api/permissions/{id}` | Cập nhật quyền | Yes |
| GET | `/api/permissions/groups` | Lấy danh sách nhóm quyền | Yes |

## Role API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/roles` | Lấy danh sách vai trò | Yes |
| POST | `/api/roles` | Tạo vai trò | Yes |
| DELETE | `/api/roles/{id}` | Xóa vai trò | Yes |
| GET | `/api/roles/{id}` | Lấy chi tiết vai trò | Yes |
| PUT | `/api/roles/{id}` | Cập nhật vai trò | Yes |
| POST | `/api/roles/{roleId}/permissions/{permissionId}/toggle` | Bật hoặc tắt quyền của vai trò | Yes |
| DELETE | `/api/roles/{userId}/roles/{roleId}` | Gỡ vai trò khỏi người dùng | Yes |
| POST | `/api/roles/assign` | Gán vai trò cho người dùng | Yes |
| GET | `/api/roles/user/{userId}` | Lấy các vai trò của người dùng | Yes |

## Audit Log API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/admin-audit-log` | Lấy danh sách nhật ký quản trị | Yes |
| GET | `/api/admin-audit-log/{id}` | Lấy chi tiết nhật ký quản trị | Yes |
| POST | `/api/admin-audit-log/rollback/{id}` | Hoàn tác thao tác từ nhật ký | Yes |

## Media API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/media` | Lấy danh sách media | Yes |
| DELETE | `/api/media/{id}` | Xóa media | Yes |
| GET | `/api/media/{id}` | Lấy chi tiết media | Yes |
| PUT | `/api/media/{id}` | Cập nhật media | Yes |
| GET | `/api/media/{id}/download` | Lấy URL tải media | Yes |
| GET | `/api/media/{id}/download/my` | Lấy URL tải media của tài khoản hiện tại | Yes |
| POST | `/api/media/{id}/extract-text` | Trích xuất văn bản từ PDF hoặc hình ảnh | Yes |
| DELETE | `/api/media/{id}/my` | Xóa mềm media của tài khoản hiện tại | Yes |
| DELETE | `/api/media/{id}/permanent` | Xóa vĩnh viễn media | Yes |
| GET | `/api/media/{id}/raw-content/my` | Lấy nội dung thô thuộc tài khoản hiện tại | Yes |
| GET | `/api/media/{id}/view` | Lấy URL xem media | Yes |
| GET | `/api/media/{id}/view/my` | Lấy URL xem media của tài khoản hiện tại | Yes |
| GET | `/api/media/admin/{id}/download` | Lấy URL tải media dành cho quản trị viên | Yes |
| GET | `/api/media/admin/{id}/raw-content` | Lấy nội dung thô của media với quyền quản trị | Yes |
| GET | `/api/media/admin/{id}/view` | Lấy URL xem media dành cho quản trị viên | Yes |
| POST | `/api/media/batch/view/my` | Lấy hàng loạt URL xem media của tài khoản hiện tại | Yes |
| GET | `/api/media/buckets` | Lấy danh sách bucket lưu trữ | Yes |
| GET | `/api/media/my` | Lấy danh sách media của tài khoản hiện tại | Yes |
| GET | `/api/media/statistics/buckets` | Lấy thống kê dung lượng theo bucket | Yes |
| POST | `/api/media/upload` | Tải lên media | Yes |
| POST | `/api/media/upload/complete` | Xác nhận hoàn tất tải tệp trực tiếp | Yes |
| POST | `/api/media/upload/presigned` | Tạo URL ký sẵn để tải tệp trực tiếp | Yes |

## SEO Media API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| POST | `/api/seo-media/items` | Thêm media vào vị trí SEO | Yes |
| DELETE | `/api/seo-media/items/{itemId}` | Xóa media SEO | Yes |
| PUT | `/api/seo-media/items/{itemId}` | Cập nhật media SEO | Yes |
| GET | `/api/seo-media/slots` | Lấy danh sách vị trí media SEO | Yes |
| POST | `/api/seo-media/slots` | Tạo vị trí media SEO | Yes |
| DELETE | `/api/seo-media/slots/{slotId}` | Xóa vị trí media SEO | Yes |
| GET | `/api/seo-media/slots/{slotId}` | Lấy chi tiết vị trí media SEO | Yes |
| PUT | `/api/seo-media/slots/{slotId}` | Cập nhật vị trí media SEO | Yes |
| GET | `/api/seo-media/slots/{slotId}/items` | Lấy media trong một vị trí SEO | Yes |
| PUT | `/api/seo-media/slots/{slotId}/items/reorder` | Sắp xếp các media trong vị trí SEO | Yes |
| GET | `/api/seo-media/slots/code/{code}` | Lấy vị trí media SEO theo mã | Yes |
| POST | `/api/seo-media/upload-image` | Tải ảnh phục vụ SEO | Yes |

## Media Folder API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/media-folders` | Lấy danh sách thư mục media | Yes |
| POST | `/api/media-folders` | Tạo thư mục media | Yes |
| DELETE | `/api/media-folders/{id}` | Xóa thư mục media | Yes |
| GET | `/api/media-folders/{id}` | Lấy chi tiết thư mục media | Yes |
| PUT | `/api/media-folders/{id}` | Cập nhật thư mục media | Yes |
| GET | `/api/media-folders/{id}/children` | Lấy các thư mục con | Yes |
| GET | `/api/media-folders/roots` | Lấy các thư mục media gốc | Yes |

## Media Usage API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/media-usages` | Lấy danh sách liên kết sử dụng media | Yes |
| DELETE | `/api/media-usages/{id}` | Xóa liên kết sử dụng media | Yes |
| POST | `/api/media-usages/attach` | Gắn media vào một thực thể | Yes |
| DELETE | `/api/media-usages/by-entity/{entityType}/{entityId}` | Gỡ các liên kết media theo thực thể | Yes |
| GET | `/api/media-usages/by-entity/{entityType}/{entityId}` | Lấy media gắn với một thực thể | Yes |
| GET | `/api/media-usages/by-media/{mediaId}` | Lấy nơi đang sử dụng một media | Yes |

## Course API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/courses` | Lấy danh sách khóa học | Yes |
| POST | `/api/courses` | Tạo khóa học | Yes |
| DELETE | `/api/courses/{id}` | Xóa khóa học | Yes |
| GET | `/api/courses/{id}` | Lấy chi tiết khóa học | Yes |
| PUT | `/api/courses/{id}/basic-info` | Cập nhật thông tin cơ bản của khóa học | Yes |
| PUT | `/api/courses/{id}/pricing` | Cập nhật chính sách giá của khóa học | Yes |
| GET | `/api/courses/{id}/students-attendance` | Lấy dữ liệu điểm danh học sinh theo khóa học | Yes |
| GET | `/api/courses/{id}/students-attendance/export` | Xuất dữ liệu điểm danh học sinh theo khóa học | Yes |
| GET | `/api/courses/admin/my` | Lấy các khóa học do quản trị viên phụ trách | Yes |
| GET | `/api/courses/search` | Tìm kiếm dữ liệu | Yes |

## Course Class API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/course-classes` | Lấy danh sách lớp học | Yes |
| POST | `/api/course-classes` | Tạo lớp học | Yes |
| DELETE | `/api/course-classes/{id}` | Xóa lớp học | Yes |
| GET | `/api/course-classes/{id}` | Lấy chi tiết lớp học | Yes |
| PUT | `/api/course-classes/{id}` | Cập nhật lớp học | Yes |
| GET | `/api/course-classes/admin/my` | Lấy các lớp do quản trị viên phụ trách | Yes |
| GET | `/api/course-classes/search` | Tìm kiếm dữ liệu | Yes |

## Course Class Lesson API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| PUT | `/api/course-class-lessons/switch` | Chuyển trạng thái hiển thị bài học theo lớp | Yes |

## Course Enrollment API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/course-enrollments` | Lấy danh sách ghi danh | Yes |
| POST | `/api/course-enrollments` | Tạo ghi danh | Yes |
| DELETE | `/api/course-enrollments/{id}` | Xóa ghi danh | Yes |
| GET | `/api/course-enrollments/{id}` | Lấy chi tiết ghi danh | Yes |
| PUT | `/api/course-enrollments/{id}` | Cập nhật ghi danh | Yes |
| GET | `/api/course-enrollments/export/excel` | Xuất danh sách ra Excel | Yes |

## Class Session API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/class-sessions` | Lấy danh sách buổi học | Yes |
| POST | `/api/class-sessions` | Tạo buổi học | Yes |
| DELETE | `/api/class-sessions/{id}` | Xóa buổi học | Yes |
| GET | `/api/class-sessions/{id}` | Lấy chi tiết buổi học | Yes |
| PUT | `/api/class-sessions/{id}` | Cập nhật buổi học | Yes |
| GET | `/api/class-sessions/search` | Tìm kiếm dữ liệu | Yes |

## Class Student API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/class-students` | Lấy danh sách học sinh trong lớp | Yes |
| POST | `/api/class-students` | Tạo học sinh trong lớp | Yes |
| DELETE | `/api/class-students/{classId}/{studentId}` | Xóa học sinh trong lớp | Yes |
| GET | `/api/class-students/{id}` | Lấy chi tiết học sinh trong lớp | Yes |

## Attendance API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/attendances` | Lấy danh sách điểm danh | Yes |
| POST | `/api/attendances` | Tạo điểm danh | Yes |
| DELETE | `/api/attendances/{id}` | Xóa điểm danh | Yes |
| GET | `/api/attendances/{id}` | Lấy chi tiết điểm danh | Yes |
| PUT | `/api/attendances/{id}` | Cập nhật điểm danh | Yes |
| POST | `/api/attendances/{id}/send-to-parent` | Gửi kết quả điểm danh cho phụ huynh | Yes |
| PUT | `/api/attendances/{id}/toggle-parent-notified` | Đổi trạng thái đã thông báo phụ huynh | Yes |
| POST | `/api/attendances/bulk/session` | Tạo điểm danh hàng loạt theo buổi học | Yes |
| GET | `/api/attendances/export/image/{id}` | Xuất phiếu điểm danh dạng ảnh | Yes |
| GET | `/api/attendances/export/session/{sessionId}` | Xuất điểm danh theo buổi học | Yes |
| GET | `/api/attendances/statistics/session/{sessionId}` | Lấy thống kê điểm danh theo buổi học | Yes |

## Learning Item API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/learning-items` | Lấy danh sách học liệu | Yes |
| POST | `/api/learning-items` | Tạo học liệu | Yes |
| DELETE | `/api/learning-items/{id}` | Xóa học liệu | Yes |
| GET | `/api/learning-items/{id}` | Lấy chi tiết học liệu | Yes |
| PUT | `/api/learning-items/{id}` | Cập nhật học liệu | Yes |
| GET | `/api/learning-items/admin/my` | Lấy học liệu của quản trị viên hiện tại | Yes |

## Lesson API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/lessons` | Lấy danh sách bài học | Yes |
| POST | `/api/lessons` | Tạo bài học | Yes |
| DELETE | `/api/lessons/{id}` | Xóa bài học | Yes |
| GET | `/api/lessons/{id}` | Lấy chi tiết bài học | Yes |
| PUT | `/api/lessons/{id}` | Cập nhật bài học | Yes |

## Video Content API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/video-contents` | Lấy danh sách nội dung video | Yes |
| POST | `/api/video-contents` | Tạo nội dung video | Yes |
| DELETE | `/api/video-contents/{id}` | Xóa nội dung video | Yes |
| GET | `/api/video-contents/{id}` | Lấy chi tiết nội dung video | Yes |
| PUT | `/api/video-contents/{id}` | Cập nhật nội dung video | Yes |

## Document Content API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/document-contents` | Lấy danh sách nội dung tài liệu | Yes |
| POST | `/api/document-contents` | Tạo nội dung tài liệu | Yes |
| DELETE | `/api/document-contents/{id}` | Xóa nội dung tài liệu | Yes |
| GET | `/api/document-contents/{id}` | Lấy chi tiết nội dung tài liệu | Yes |
| PUT | `/api/document-contents/{id}` | Cập nhật nội dung tài liệu | Yes |

## YouTube Content API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/youtube-contents` | Lấy danh sách nội dung YouTube | Yes |
| POST | `/api/youtube-contents` | Tạo nội dung YouTube | Yes |
| DELETE | `/api/youtube-contents/{id}` | Xóa nội dung YouTube | Yes |
| GET | `/api/youtube-contents/{id}` | Lấy chi tiết nội dung YouTube | Yes |
| PUT | `/api/youtube-contents/{id}` | Cập nhật nội dung YouTube | Yes |

## Homework Content API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/homework-contents` | Lấy danh sách nội dung bài tập | Yes |
| POST | `/api/homework-contents` | Tạo nội dung bài tập | Yes |
| DELETE | `/api/homework-contents/{id}` | Xóa nội dung bài tập | Yes |
| GET | `/api/homework-contents/{id}` | Lấy chi tiết nội dung bài tập | Yes |
| PUT | `/api/homework-contents/{id}` | Cập nhật nội dung bài tập | Yes |
| GET | `/api/homework-contents/by-course/{courseId}` | Lấy dữ liệu theo khóa học | Yes |

## Homework Submit API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/homework-submits` | Lấy danh sách bài nộp | Yes |
| POST | `/api/homework-submits` | Tạo bài nộp | Yes |
| DELETE | `/api/homework-submits/{id}` | Xóa bài nộp | Yes |
| GET | `/api/homework-submits/{id}` | Lấy chi tiết bài nộp | Yes |
| PUT | `/api/homework-submits/{id}` | Cập nhật bài nộp | Yes |
| PATCH | `/api/homework-submits/{id}/grade` | Chấm bài nộp | Yes |

## Lesson Learning Item API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/lesson-learning-items` | Lấy danh sách học liệu trong bài học | Yes |
| POST | `/api/lesson-learning-items` | Tạo học liệu trong bài học | Yes |
| DELETE | `/api/lesson-learning-items/{lessonId}/{learningItemId}` | Xóa học liệu trong bài học | Yes |
| GET | `/api/lesson-learning-items/{lessonId}/{learningItemId}` | Lấy chi tiết học liệu trong bài học | Yes |
| PUT | `/api/lesson-learning-items/reorder` | Sắp xếp lại thứ tự | Yes |

## Notification API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| DELETE | `/api/notifications/{id}` | Xóa thông báo | Yes |
| PUT | `/api/notifications/{id}/mark-read` | Đánh dấu một thông báo đã đọc | Yes |
| GET | `/api/notifications/my` | Lấy thông báo của tài khoản hiện tại | Yes |
| PUT | `/api/notifications/my/mark-all-read` | Đánh dấu tất cả thông báo đã đọc | Yes |
| GET | `/api/notifications/my/stats` | Lấy thống kê thông báo của tài khoản hiện tại | Yes |
| POST | `/api/notifications/send` | Gửi thông báo đến người dùng hoặc nhóm người dùng | Yes |
| GET | `/api/notifications/user/{userId}` | Lấy thông báo của một người dùng | Yes |

## Tuition Payment API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/tuition-payments` | Lấy danh sách thanh toán học phí | Yes |
| POST | `/api/tuition-payments` | Tạo thanh toán học phí | Yes |
| DELETE | `/api/tuition-payments/{id}` | Xóa thanh toán học phí | Yes |
| GET | `/api/tuition-payments/{id}` | Lấy chi tiết thanh toán học phí | Yes |
| PUT | `/api/tuition-payments/{id}` | Cập nhật thanh toán học phí | Yes |
| POST | `/api/tuition-payments/bulk` | Tạo hàng loạt khoản học phí | Yes |
| POST | `/api/tuition-payments/bulk-array` | Tạo hàng loạt khoản học phí từ mảng dữ liệu | Yes |
| PUT | `/api/tuition-payments/bulk-array` | Cập nhật hàng loạt khoản học phí từ mảng dữ liệu | Yes |
| GET | `/api/tuition-payments/export/excel` | Xuất danh sách ra Excel | Yes |
| GET | `/api/tuition-payments/export/excel/example` | Tải tệp Excel học phí mẫu | Yes |
| POST | `/api/tuition-payments/import/excel/preview` | Xem trước dữ liệu học phí nhập từ Excel | Yes |
| GET | `/api/tuition-payments/stats/money` | Thống kê học phí theo số tiền | Yes |
| GET | `/api/tuition-payments/stats/monthly` | Thống kê học phí theo tháng | Yes |
| GET | `/api/tuition-payments/stats/status` | Thống kê học sinh theo trạng thái | Yes |
| GET | `Chưa xác định: thiếu hằng BY_COURSE` | Lấy thanh toán học phí theo khóa học | Yes |
| GET | `Chưa xác định: thiếu hằng BY_STUDENT` | Lấy thanh toán học phí theo học sinh | Yes |

## Exam Import Session API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/exam-import-sessions` | Lấy danh sách phiên nhập đề | Yes |
| POST | `/api/exam-import-sessions` | Tạo phiên nhập đề | Yes |
| GET | `/api/exam-import-sessions/{sessionId}` | Lấy chi tiết phiên nhập đề | Yes |
| POST | `/api/exam-import-sessions/{sessionId}/classify-chapters/my` | Tự động phân loại chương cho câu hỏi | Yes |
| POST | `/api/exam-import-sessions/{sessionId}/manual-split/my` | Tách câu hỏi thủ công | Yes |
| POST | `/api/exam-import-sessions/{sessionId}/migrate/my` | Chuyển dữ liệu tạm thành dữ liệu chính thức | Yes |
| GET | `/api/exam-import-sessions/{sessionId}/raw-content/my` | Lấy nội dung thô thuộc tài khoản hiện tại | Yes |
| PUT | `/api/exam-import-sessions/{sessionId}/raw-content/my` | PUT phiên nhập đề | Yes |
| POST | `/api/exam-import-sessions/{sessionId}/split-question/raw-content` | Tách câu hỏi từ nội dung thô được cung cấp | Yes |
| POST | `/api/exam-import-sessions/{sessionId}/split-questions/my` | Tự động tách câu hỏi từ nội dung của phiên | Yes |

## Temporary Exam API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| PUT | `/api/temp-exams/{tempExamId}` | Cập nhật đề thi tạm | Yes |
| GET | `/api/temp-exams/session/{sessionId}` | Lấy dữ liệu tạm theo phiên nhập đề | Yes |
| POST | `/api/temp-exams/session/{sessionId}` | Tạo đề thi tạm | Yes |

## Temporary Section API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| DELETE | `/api/temp-sections/{tempSectionId}` | Xóa phần thi tạm | Yes |
| GET | `/api/temp-sections/{tempSectionId}` | Lấy chi tiết dữ liệu tạm | Yes |
| PUT | `/api/temp-sections/{tempSectionId}` | Cập nhật phần thi tạm | Yes |
| PUT | `/api/temp-sections/reorder` | Sắp xếp lại thứ tự | Yes |
| GET | `/api/temp-sections/session/{sessionId}` | Lấy dữ liệu tạm theo phiên nhập đề | Yes |
| POST | `/api/temp-sections/session/{sessionId}` | Tạo phần thi tạm | Yes |

## Temporary Question API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| DELETE | `/api/temp-questions/{tempQuestionId}` | Xóa câu hỏi tạm | Yes |
| GET | `/api/temp-questions/{tempQuestionId}` | Lấy chi tiết dữ liệu tạm | Yes |
| PUT | `/api/temp-questions/{tempQuestionId}` | Cập nhật câu hỏi tạm | Yes |
| PUT | `/api/temp-questions/{tempQuestionId}/link-section` | Liên kết câu hỏi tạm với phần thi tạm | Yes |
| PUT | `/api/temp-questions/reorder` | Sắp xếp lại thứ tự | Yes |
| GET | `/api/temp-questions/session/{sessionId}` | Lấy dữ liệu tạm theo phiên nhập đề | Yes |
| POST | `/api/temp-questions/session/{sessionId}` | Tạo câu hỏi tạm | Yes |

## Temporary Statement API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| DELETE | `/api/temp-statements/{tempStatementId}` | Xóa mệnh đề tạm | Yes |
| PUT | `/api/temp-statements/{tempStatementId}` | Cập nhật mệnh đề tạm | Yes |
| POST | `/api/temp-statements/question/{tempQuestionId}` | Tạo mệnh đề tạm | Yes |
| PUT | `/api/temp-statements/reorder` | Sắp xếp lại thứ tự | Yes |

## Question API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/exams/{examId}/questions` | Lấy dữ liệu theo đề thi | Yes |
| GET | `/api/questions` | Lấy danh sách câu hỏi | Yes |
| POST | `/api/questions` | Tạo câu hỏi | Yes |
| DELETE | `/api/questions/{id}` | Xóa câu hỏi | Yes |
| GET | `/api/questions/{id}` | Lấy chi tiết câu hỏi | Yes |
| PUT | `/api/questions/{id}` | Cập nhật câu hỏi | Yes |
| DELETE | `/api/questions/exam` | Gỡ câu hỏi khỏi đề thi | Yes |
| POST | `/api/questions/exam` | Thêm câu hỏi vào đề thi | Yes |
| GET | `/api/questions/my-questions` | Lấy câu hỏi của tài khoản hiện tại | Yes |
| PUT | `/api/questions/reorder` | Sắp xếp lại thứ tự | Yes |
| GET | `/api/questions/search` | Tìm kiếm dữ liệu | Yes |
| POST | `/api/questions/section` | Thêm câu hỏi vào phần thi | Yes |

## Statement API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| DELETE | `/api/statements/{id}` | Xóa mệnh đề | Yes |
| PUT | `/api/statements/{id}` | Cập nhật mệnh đề | Yes |
| POST | `/api/statements/question/{questionId}` | Tạo mệnh đề | Yes |

## Exam API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/exams` | Lấy danh sách đề thi | Yes |
| POST | `/api/exams` | Tạo đề thi | Yes |
| DELETE | `/api/exams/{id}` | Xóa đề thi | Yes |
| GET | `/api/exams/{id}` | Lấy chi tiết đề thi | Yes |
| PUT | `/api/exams/{id}` | Cập nhật đề thi | Yes |
| GET | `/api/exams/my-exams` | Lấy đề thi của tài khoản hiện tại | Yes |
| GET | `/api/exams/search` | Tìm kiếm dữ liệu | Yes |

## Competition API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/competitions` | Lấy danh sách cuộc thi | Yes |
| POST | `/api/competitions` | Tạo cuộc thi | Yes |
| DELETE | `/api/competitions/{id}` | Xóa cuộc thi | Yes |
| GET | `/api/competitions/{id}` | Lấy chi tiết cuộc thi | Yes |
| PUT | `/api/competitions/{id}` | Cập nhật cuộc thi | Yes |
| GET | `/api/competitions/{id}/question-stats` | Lấy thống kê câu hỏi trong cuộc thi | Yes |
| GET | `/api/competitions/my-competitions` | Lấy cuộc thi của tài khoản hiện tại | Yes |
| GET | `/api/competitions/search` | Tìm kiếm dữ liệu | Yes |

## Competition Submit API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| GET | `/api/competition-submits` | Lấy danh sách bài thi đã nộp | Yes |
| DELETE | `/api/competition-submits/{id}` | Xóa bài thi đã nộp | Yes |
| GET | `/api/competition-submits/{id}` | Lấy chi tiết bài thi đã nộp | Yes |
| PUT | `/api/competition-submits/{id}` | Cập nhật bài thi đã nộp | Yes |
| GET | `/api/competition-submits/{id}/detail` | Lấy đầy đủ chi tiết bài thi đã nộp | Yes |
| POST | `/api/competition-submits/{id}/regrade` | Chấm lại bài thi đã nộp | Yes |

## Section API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| POST | `/api/sections` | Tạo phần thi | Yes |
| GET | `/api/sections?examId={examId}` | Lấy dữ liệu theo đề thi | Yes |
| DELETE | `/api/sections/{id}` | Xóa phần thi | Yes |
| GET | `/api/sections/{id}` | Lấy chi tiết phần thi | Yes |
| PUT | `/api/sections/{id}` | Cập nhật phần thi | Yes |

## Markdown API

| Method | Endpoint | Mô tả | Auth |
|---|---|---|:---:|
| POST | `/api/markdown/fix-spelling` | Sửa lỗi chính tả trong nội dung Markdown | Yes |

## Lưu ý phát hiện khi đối chiếu mã nguồn

Hai hàm `tuitionPaymentApi.getByCourseId` và `tuitionPaymentApi.getByStudentId` đang gọi `API_ENDPOINTS.TUITION_PAYMENT.BY_COURSE` và `BY_STUDENT`, nhưng hai hằng này chưa được khai báo trong `src/core/constants/index.js`. Vì vậy tài liệu giữ trạng thái “Chưa xác định” thay vì suy đoán endpoint.
