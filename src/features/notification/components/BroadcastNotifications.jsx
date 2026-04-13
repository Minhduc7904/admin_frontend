// src/features/notification/components/BroadcastNotifications.jsx

import { useState } from 'react';
import { NotificationForm } from './NotificationForm';
import { StudentSelectionList } from './StudentSelectionList';
import { AdminSelectionList } from './AdminSelectionList';
import { Dropdown } from '../../../shared/components/ui';
import { IfAllowed } from '../../../shared/components/permissions/Can';

const NotifyAllUsers = () => {
    return (
        <div className="bg-white border border-border rounded-sm p-6">
            <div className="text-center text-foreground-light">
                <p className="mb-2 text-lg font-semibold">Gửi đến tất cả người dùng</p>
                <p className="text-sm">
                    Thông báo sẽ được gửi đến tất cả người dùng trong hệ thống.
                    <br />
                    Không cần chọn đối tượng cụ thể.
                </p>
            </div>
        </div>
    );
}

const NotifyAllUnpaidTuitionStudents = () => {
    return (
        <div className="bg-white border border-border rounded-sm p-6">
            <div className="text-center text-foreground-light">
                <p className="mb-2 text-lg font-semibold">Gửi đến tất cả học sinh chưa đóng học phí</p>
                <p className="text-sm">
                    Thông báo sẽ được gửi đến toàn bộ học sinh chưa hoàn tất học phí.
                    <br />
                    Không cần chọn học sinh cụ thể.
                </p>
            </div>
        </div>
    );
}

export const BroadcastNotifications = ({
    title,
    description,
    students,
    selectedStudentIds,
    loadingStudents,
    loadingSend,
    onSubmit,
    onSelectionChange,
    showRecipientTypeSelector = false,
    // Admin props
    admins,
    selectedAdminIds,
    loadingAdmins,
    onAdminSelectionChange,
    // Recipient type control
    recipientType,
    onRecipientTypeChange,
    // Grade filter for students
    grade,
    onGradeChange,
    // Permission props
    hasGetAllAdminAccess,
    hasGetAllStudentAccess,
    hasNotifyAllAccess,
}) => {

    // Determine available recipient types based on permissions
    const gradeOptions = [
        { value: '', label: 'Tất cả khối' },
        { value: '1', label: 'Khối 1' },
        { value: '2', label: 'Khối 2' },
        { value: '3', label: 'Khối 3' },
        { value: '4', label: 'Khối 4' },
        { value: '5', label: 'Khối 5' },
        { value: '6', label: 'Khối 6' },
        { value: '7', label: 'Khối 7' },
        { value: '8', label: 'Khối 8' },
        { value: '9', label: 'Khối 9' },
        { value: '10', label: 'Khối 10' },
        { value: '11', label: 'Khối 11' },
        { value: '12', label: 'Khối 12' },
    ];

    return (
        <>
            {/* ===== HEADER ===== */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-sm text-foreground-light">
                    {description}
                </p>
            </div>

            {/* ===== TWO-COLUMN LAYOUT ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left */}
                <div>
                    <NotificationForm
                        canSendAll={hasNotifyAllAccess}
                        canSendStudents={hasGetAllStudentAccess}
                        canSendAdmins={hasGetAllAdminAccess}
                        onSubmit={onSubmit}
                        loading={loadingSend}
                        selectedStudents={
                            recipientType === 'ADMIN' ? selectedAdminIds : selectedStudentIds
                        }
                        showRecipientTypeSelector={showRecipientTypeSelector}
                        recipientType={recipientType}
                        onRecipientTypeChange={onRecipientTypeChange}
                    />
                </div>

                {/* Right */}
                <div>
                    {recipientType === 'STUDENT' && (
                        <>
                            {/* Grade Filter */}
                            <IfAllowed allowed={hasGetAllStudentAccess}>
                                <StudentSelectionList
                                    students={students}
                                    selectedStudentIds={selectedStudentIds}
                                    onSelectionChange={onSelectionChange}
                                    loading={loadingStudents}
                                    grade={grade}
                                    onGradeChange={onGradeChange}
                                    gradeOptions={gradeOptions}
                                />
                            </IfAllowed>
                        </>
                    )}

                    {recipientType === 'ADMIN' && (
                        <IfAllowed allowed={hasGetAllAdminAccess}>
                            <AdminSelectionList
                                admins={admins}
                                selectedAdminIds={selectedAdminIds}
                                onSelectionChange={onAdminSelectionChange}
                                loading={loadingAdmins}
                            />
                        </IfAllowed>
                    )}

                    {recipientType === 'ALL' && (
                        <IfAllowed allowed={hasNotifyAllAccess}>
                            <NotifyAllUsers />
                        </IfAllowed>
                    )}

                    {recipientType === 'UNPAID_TUITION_STUDENTS' && (
                        <IfAllowed allowed={hasGetAllStudentAccess}>
                            <NotifyAllUnpaidTuitionStudents />
                        </IfAllowed>
                    )}
                </div>
            </div>
        </>
    );
};
