import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/store/authSlice";
import profileReducer from "../../features/profile/store/profileSlice";
import notificationReducer from "../../features/notification/store/notificationSlice";
import roleReducer from "../../features/role/store/roleSlice";
import permissionReducer from "../../features/permission/store/permissionSlice";
import auditLogReducer from "../../features/adminAuditLog/store/auditLogSlice";
import mediaReducer from "../../features/media/store/mediaSlice";
import mediaUsageReducer from "../../features/mediaUsage/store/mediaUsageSlice";
import mediaFolderReducer from "../../features/mediaFolder/store/mediaFolderSlice";
import adminReducer from "../../features/admin/store/adminSlice";
import { userReducer } from "../../features/user/store/userSlice";
import studentReducer from "../../features/student/store/studentSlice";
import subjectReducer from "../../features/subject/store/subjectSlice";
import chapterReducer from "../../features/chapter/store/chapterSlice";
import courseReducer from "../../features/course/store/courseSlice";
import courseClassSlice from "../../features/courseClass/store/courseClassSlice";
import courseEnrollmentSlice from "../../features/courseEnrollment/store/courseEnrollmentSlice";
import classStudentSlice from "../../features/classStudent/store/classStudentSlice";
import classSessionSlice from "../../features/classSesssion/store/classSesssionSlice";
import attendanceSlice from "../../features/attendance/store/attendanceSlice";
import learningItemReducer from "../../features/learningItem/store/learningItemSlice";
import lessonReducer from "../../features/lesson/store/lessonSlice";
import lessonLearningItemReducer from "../../features/lessonLearningitem/store/lessonLearningItemSlice";
import tuitionPaymentReducer from "../../features/tuitionPayment/store/tuitionPaymentSlice";
import examImportSessionReducer from "../../features/examImportSession/store/examImportSessionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    notification: notificationReducer,
    role: roleReducer,
    permission: permissionReducer,
    auditLog: auditLogReducer,
    media: mediaReducer,
    mediaUsage: mediaUsageReducer,
    mediaFolder: mediaFolderReducer,
    admin: adminReducer,
    user: userReducer,
    student: studentReducer,
    subject: subjectReducer,
    chapter: chapterReducer,
    course: courseReducer,
    courseClass: courseClassSlice,
    courseEnrollment: courseEnrollmentSlice,
    classStudent: classStudentSlice,
    classSession: classSessionSlice,
    attendance: attendanceSlice,
    learningItem: learningItemReducer,
    lesson: lessonReducer,
    lessonLearningItem: lessonLearningItemReducer,
    tuitionPayment: tuitionPaymentReducer,
    examImportSession: examImportSessionReducer,
  },
});
