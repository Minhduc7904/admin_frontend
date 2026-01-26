// src/features/notification/pages/BroadcastNotificationsPage.jsx

import { useEffect, useState, useRef, useMemo } from 'react';
import { BroadcastNotifications } from '../components/BroadcastNotifications';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';

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

export const BroadcastNotificationsPage = () => {
    const dispatch = useAppDispatch();

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

    /* ===== EFFECT: Load students when needed ===== */
    useEffect(() => {
        if (recipientType === 'STUDENT' && !studentsLoadedRef.current) {
            dispatch(
                getAllStudentsAsync({
                    page: 1,
                    limit: 1000,
                })
            );
            studentsLoadedRef.current = true;
        }
    }, [recipientType, dispatch]);

    /* ===== EFFECT: Load admins when needed ===== */
    useEffect(() => {
        if (recipientType === 'ADMIN' && !adminsLoadedRef.current) {
            dispatch(
                getAllAdminsAsync({
                    page: 1,
                    limit: 1000,
                })
            );
            adminsLoadedRef.current = true;
        }
    }, [recipientType, dispatch]);

    /* ===== HANDLERS ===== */
    const handleRecipientTypeChange = (newType) => {
        setRecipientType(newType);
        // Clear selections when switching type
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
        let userIds = [];

        if (recipientType === 'ALL') {
            // Send to all users - backend will handle
            userIds = null; // or empty array, depend on backend implementation
        } else if (recipientType === 'STUDENT') {
            if (selectedStudentIds.length === 0) return;
            // Students: use userId from student object
            console.log('selectedStudentIds', selectedStudentIds);
            userIds = selectedStudentIds
                .map((studentId) => {
                    const student = students.find((s) => s.studentId === studentId);
                    return student?.userId;
                })
                .filter(Boolean);
        } else if (recipientType === 'ADMIN') {
            if (selectedAdminIds.length === 0) return;
            // Admins: use userId from admin object
            console.log('selectedAdminIds', selectedAdminIds);
            userIds = selectedAdminIds
                .map((adminId) => {
                    const admin = admins.find((a) => a.adminId === adminId);
                    return admin?.userId;
                })
                .filter(Boolean);
        }

        await dispatch(
            sendNotificationAsync({
                title: formData.title,
                message: formData.message,
                type: formData.type,
                level: formData.level,
                userIds,
                all: recipientType === 'ALL' ? true : false,
                data: {
                    entity: 'broadcast',
                    recipientType,
                },
            })
        ).unwrap();

        // Clear selections after successful send
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
        />
    );
};
