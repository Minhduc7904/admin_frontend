import { useState } from 'react';
import { useAppSelector } from '../../../core/store/hooks';
import {
    selectCurrentStudent,
    selectStudentLoadingGet,
} from '../store/studentSlice';
import { StudentInfoTab } from '../components/StudentInfoTab';
import { RightPanel } from '../../../shared/components';
import { EditStudentForm } from '../components/EditStudentForm';

export const StudentDetail = () => {
    const student = useAppSelector(selectCurrentStudent);
    const loading = useAppSelector(selectStudentLoadingGet);
    const [openEditPanel, setOpenEditPanel] = useState(false);

    const handleEdit = () => {
        setOpenEditPanel(true);
    };

    const handleCloseEdit = () => {
        setOpenEditPanel(false);
    };

    return (
        <>
            <StudentInfoTab
                student={student}
                loading={loading}
                onEdit={handleEdit}
            />

            <RightPanel
                isOpen={openEditPanel}
                onClose={handleCloseEdit}
                title="Chỉnh sửa thông tin học sinh"
            >
                <EditStudentForm
                    student={student}
                    onClose={handleCloseEdit}
                />
            </RightPanel>
        </>
    );
};
