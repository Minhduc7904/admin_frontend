// 1. Imports
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import {
    selectCurrentCourseClass,
    selectCourseClassLoadingGet,
} from '../store/courseClassSlice';
import { CourseClassInfoTab } from '../components/CourseClassInfoTab';
import { RightPanel } from '../../../shared/components';
import { EditClass } from '../components/EditClass';

// 2. Component
export const CourseClassDetail = () => {
    const courseClass = useSelector(selectCurrentCourseClass);
    const loading = useSelector(selectCourseClassLoadingGet);
    const [openEditPanel, setOpenEditPanel] = useState(false);

    // Get context from parent layout
    const { isMyClasses = false, from = null } = useOutletContext() || {};

    const handleEdit = () => {
        setOpenEditPanel(true);
    };

    const handleCloseEdit = () => {
        setOpenEditPanel(false);
    };

    return (
        <>
            <CourseClassInfoTab
                courseClass={courseClass}
                loading={loading}
                onEdit={handleEdit}
            />

            <RightPanel
                isOpen={openEditPanel}
                onClose={handleCloseEdit}
                title="Chỉnh sửa thông tin lớp học"
            >
                <EditClass
                    courseClass={courseClass}
                    onClose={handleCloseEdit}
                    disableInstructorEdit={isMyClasses}
                />
            </RightPanel>
        </>
    );
};
