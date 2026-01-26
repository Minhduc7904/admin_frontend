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

export const BroadcastNotificationsPage = () => {
    const dispatch = useAppDispatch();

    const hasGetAllAdminAccess = useHasPermission(PERMISSIONS.ADMIN_GET_ALL);
    const hasGetAllStudentAccess = useHasPermission(PERMISSIONS.STUDENT_GET_ALL);
    const hasNotifyAllAccess = useHasPermission(PERMISSIONS.NOTIFY_ALL_USERS);

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
    const handleRecipientTypeChange = (newType) => {
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

    const handleSubmit = async (formData) => {
        // 🔒 Permission guard
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
