// 1. Imports
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import {
    selectCurrentCourse,
    selectCourseLoadingGet,
} from '../store/courseSlice';
import { CourseInfoTab } from '../components/info/CourseInfoTab';
import { RightPanel } from '../../../shared/components';
import { EditCourse } from '../components/info/EditCourse';

// 2. Component
export const CourseDetail = () => {
    const course = useSelector(selectCurrentCourse);
    const loading = useSelector(selectCourseLoadingGet);
    const [openEditPanel, setOpenEditPanel] = useState(false);

    // Get context from parent layout
    const { isMyCourses = false } = useOutletContext() || {};

    const handleEdit = () => {
        setOpenEditPanel(true);
    };

    const handleCloseEdit = () => {
        setOpenEditPanel(false);
    };

    return (
        <>
            <CourseInfoTab
                course={course}
                loading={loading}
                onEdit={handleEdit}
            />

            <RightPanel
                isOpen={openEditPanel}
                onClose={handleCloseEdit}
                title="Chỉnh sửa thông tin khóa học"
            >
                <EditCourse
                    course={course}
                    onClose={handleCloseEdit}
                    disableTeacherEdit={isMyCourses}
                />
            </RightPanel>
        </>
    );
};
