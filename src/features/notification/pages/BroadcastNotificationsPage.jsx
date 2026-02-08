// src/features/notification/pages/BroadcastNotificationsPage.jsx

import { useEffect, useState, useRef, useMemo } from 'react';
import { BroadcastNotifications } from '../components/BroadcastNotifications';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { Navigate } from 'react-router-dom';
import {
    getAllStudentsAsync,
    selectStudents,
    selectStudentLoadingGet,
} from '../../student/store/studentSlice';

import {
    getAllAdminsAsync,
    selectAdmins,
    selectAdminLoadingGet,
} from '../../admin/store/adminSlice';

import {
    sendNotificationAsync,
    selectLoadingSend,
} from '../store/notificationSlice';
import { useHasPermission } from '../../../shared/hooks';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';
import { ROUTES } from '../../../core/constants';

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * 
 * === ROUTER LEVEL ===
 * - ADMIN_PAGE.BROADCAST_NOTIFICATIONS ('admin:page:broadcast-notifications')
 *   → Quyền truy cập trang gửi thông báo broadcast
 *   → Được kiểm tra bởi ProtectedRoute trong AdminRouter.jsx
 * 
 * === PAGE OPERATIONS ===
 * 
 * 1. ADMIN_GET_ALL ('admin:get-all')
 *    → Quyền xem danh sách tất cả admins
 *    → Dùng khi recipientType là 'ADMIN'
 *    → Gọi getAllAdminsAsync để load danh sách admins
 * 
 * 2. STUDENT_GET_ALL ('student:get-all')
 *    → Quyền xem danh sách tất cả students
 *    → Dùng khi recipientType là 'STUDENT'
 *    → Gọi getAllStudentsAsync để load danh sách students
 * 
 * 3. NOTIFY_ALL_USERS ('notification:notify-all-users')
 *    → Quyền gửi thông báo đến tất cả người dùng trong hệ thống
 *    → Dùng khi recipientType là 'ALL'
 *    → Cho phép gửi broadcast notification không giới hạn người nhận
 * 
 * === PERMISSION LOGIC ===
 * - Người dùng phải có ít nhất 1 trong 3 quyền để truy cập trang
 * - Mỗi recipientType được kiểm soát bởi permission tương ứng
 * - UI sẽ disable/hide các option không có quyền
 */

export const BroadcastNotificationsPage = () => {
    const dispatch = useAppDispatch();

    /* ===== PERMISSION HOOKS ===== */
    const hasGetAllAdminAccess = useHasPermission(PERMISSIONS.ADMIN.GET_ALL);
    const hasGetAllStudentAccess = useHasPermission(PERMISSIONS.STUDENT.GET_ALL);
    const hasNotifyAllAccess = useHasPermission(PERMISSIONS.NOTIFICATION.SEND);

    // Kiểm tra quyền truy cập trang: cần ít nhất 1 trong 3 quyền
    if (!hasGetAllAdminAccess && !hasGetAllStudentAccess && !hasNotifyAllAccess) {
        return <Navigate to={ROUTES.FORBIDDEN} replace />;
    }

    /* ===== STORE ===== */
    const students = useAppSelector(selectStudents);
    const loadingStudents = useAppSelector(selectStudentLoadingGet);
    const admins = useAppSelector(selectAdmins);
    const loadingAdmins = useAppSelector(selectAdminLoadingGet);
    const loadingSend = useAppSelector(selectLoadingSend);

    /* ===== LOCAL STATE ===== */
    const [recipientType, setRecipientType] = useState('STUDENT');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectedAdminIds, setSelectedAdminIds] = useState([]);
    const [grade, setGrade] = useState('');

    // Track if data has been loaded to prevent duplicate loads
    const studentsLoadedRef = useRef(false);
    const adminsLoadedRef = useRef(false);

    /* ===== FILTERED STUDENTS BY GRADE ===== */
    const filteredStudents = useMemo(() => {
        if (!grade) return students;
        return students.filter((student) => student.grade === parseInt(grade));
    }, [students, grade]);

    /* ===== EFFECTS ===== */
    // Load students khi chọn recipientType là STUDENT và có quyền
    useEffect(() => {
        if (
            recipientType === 'STUDENT' &&
            hasGetAllStudentAccess &&
            !studentsLoadedRef.current
        ) {
            dispatch(getAllStudentsAsync({ page: 1, limit: 1000 }));
            studentsLoadedRef.current = true;
        }
    }, [recipientType, hasGetAllStudentAccess, dispatch]);

    // Load admins khi chọn recipientType là ADMIN và có quyền
    useEffect(() => {
        if (
            recipientType === 'ADMIN' &&
            hasGetAllAdminAccess &&
            !adminsLoadedRef.current
        ) {
            dispatch(getAllAdminsAsync({ page: 1, limit: 1000 }));
            adminsLoadedRef.current = true;
        }
    }, [recipientType, hasGetAllAdminAccess, dispatch]);

    /* ===== HANDLERS ===== */
    // Thay đổi loại người nhận (kiểm tra permission cho từng loại)
    const handleRecipientTypeChange = (newType) => {
        // 🔒 Permission guards
        if (newType === 'ALL' && !hasNotifyAllAccess) return;
        if (newType === 'STUDENT' && !hasGetAllStudentAccess) return;
        if (newType === 'ADMIN' && !hasGetAllAdminAccess) return;

        setRecipientType(newType);
        setSelectedStudentIds([]);
        setSelectedAdminIds([]);
    };


    const handleStudentSelectionChange = (ids) => {
        setSelectedStudentIds(ids);
    };

    const handleAdminSelectionChange = (ids) => {
        setSelectedAdminIds(ids);
    };

    const handleGradeChange = (newGrade) => {
        setGrade(newGrade);
        // Clear selections when changing grade
        setSelectedStudentIds([]);
    };

    // Gửi notification (kiểm tra permission trước khi gửi)
    const handleSubmit = async (formData) => {
        // 🔒 Permission guards - Kiểm tra lại permission trước khi gửi
        if (recipientType === 'ALL' && !hasNotifyAllAccess) return;
        if (recipientType === 'STUDENT' && !hasGetAllStudentAccess) return;
        if (recipientType === 'ADMIN' && !hasGetAllAdminAccess) return;

        let userIds = [];

        if (recipientType === 'ALL') {
            userIds = null;
        }

        if (recipientType === 'STUDENT') {
            if (selectedStudentIds.length === 0) return;

            userIds = selectedStudentIds
                .map((id) => students.find((s) => s.studentId === id)?.userId)
                .filter(Boolean);
        }

        if (recipientType === 'ADMIN') {
            if (selectedAdminIds.length === 0) return;

            userIds = selectedAdminIds
                .map((id) => admins.find((a) => a.adminId === id)?.userId)
                .filter(Boolean);
        }

        await dispatch(
            sendNotificationAsync({
                title: formData.title,
                message: formData.message,
                type: formData.type,
                level: formData.level,
                userIds,
                all: recipientType === 'ALL',
                data: {
                    entity: 'broadcast',
                    recipientType,
                },
            })
        ).unwrap();

        setSelectedStudentIds([]);
        setSelectedAdminIds([]);
    };


    /* ===== RENDER UI ===== */
    return (
        <BroadcastNotifications
            title="Gửi thông báo đến học sinh"
            description="Soạn thảo và gửi thông báo đến một hoặc nhiều học sinh trong hệ thống."
            // Student props
            students={filteredStudents}
            selectedStudentIds={selectedStudentIds}
            loadingStudents={loadingStudents}
            onSelectionChange={handleStudentSelectionChange}
            // Admin props
            admins={admins}
            selectedAdminIds={selectedAdminIds}
            loadingAdmins={loadingAdmins}
            onAdminSelectionChange={handleAdminSelectionChange}
            // Common props
            loadingSend={loadingSend}
            onSubmit={handleSubmit}
            // Recipient type control
            showRecipientTypeSelector={true}
            recipientType={recipientType}
            onRecipientTypeChange={handleRecipientTypeChange}
            // Grade filter
            grade={grade}
            onGradeChange={handleGradeChange}
            // Permission props
            hasGetAllAdminAccess={hasGetAllAdminAccess}
            hasGetAllStudentAccess={hasGetAllStudentAccess}
            hasNotifyAllAccess={hasNotifyAllAccess}
        />
    );
};
