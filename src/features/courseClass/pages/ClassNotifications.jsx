// src/features/notification/pages/ClassNotifications.jsx

import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    BroadcastNotifications
} from '../../notification/components/BroadcastNotifications';

import {
    getAllClassStudentsAsync,
    selectClassStudents,
    selectClassStudentLoadingGet,
} from '../../classStudent/store/classStudentSlice';

import {
    sendNotificationAsync,
    selectLoadingSend,
} from '../../notification/store/notificationSlice';
import { ROUTES } from '../../../core/constants';
export const ClassNotifications = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const classId = Number(id);

    /* ===== STORE ===== */
    const classStudents = useSelector(selectClassStudents);
    const loadingStudents = useSelector(selectClassStudentLoadingGet);
    const loadingSend = useSelector(selectLoadingSend);

    /* ===== LOCAL STATE ===== */
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    /* ===== EFFECT ===== */
    useEffect(() => {
        dispatch(
            getAllClassStudentsAsync({
                classId,
                page: 1,
                limit: 1000,
            })
        );
    }, [classId]);

    /* ===== HANDLERS ===== */
    const handleSelectionChange = (ids) => {
        setSelectedStudentIds(ids);
    };

    const handleSubmit = async (formData) => {
        const userIds = selectedStudentIds
            .map((studentId) => {
                const cs = classStudents.find(
                    (c) => c.studentId === studentId
                );
                return cs?.student?.userId;
            })
            .filter(Boolean);

        if (userIds.length === 0) return;

        await dispatch(
            sendNotificationAsync({
                title: formData.title,
                message: formData.message,
                type: formData.type,
                level: formData.level,
                userIds,
                data: {
                    entity: 'class',
                    entityId: classId,
                },
            })
        ).unwrap();

        setSelectedStudentIds([]);
    };

    /* ===== RENDER UI ===== */
    return (
        <BroadcastNotifications
            title="Gửi thông báo"
            description="Gửi thông báo cho học sinh trong lớp học"
            students={classStudents}
            selectedStudentIds={selectedStudentIds}
            loadingStudents={loadingStudents}
            loadingSend={loadingSend}
            onSelectionChange={handleSelectionChange}
            onSubmit={handleSubmit}
            showRecipientTypeSelector={false}
            recipientType="STUDENT"
        />
    );
};
