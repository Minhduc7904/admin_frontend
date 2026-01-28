// 1. Imports
import { useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  selectCurrentCourse,
  selectCourseLoadingGet,
} from "../store/courseSlice";
import { RightPanel } from "../../../shared/components";
import { CoursePricingTab } from "../components/pricing/CoursePricingTab";
import { EditCoursePricing } from "../components/pricing/EditCoursePricing";

// 2. Component
export const CoursePricing = () => {
  const course = useSelector(selectCurrentCourse);
  const loading = useSelector(selectCourseLoadingGet);
  const [openEditPanel, setOpenEditPanel] = useState(false);

  // Context từ layout cha
  const { isMyCourses = false } = useOutletContext() || {};

  const handleEdit = () => {
    setOpenEditPanel(true);
  };

  const handleCloseEdit = () => {
    setOpenEditPanel(false);
  };

  return (
    <>
      <CoursePricingTab
        course={course}
        loading={loading}
        onEdit={handleEdit}
      />

      <RightPanel
        isOpen={openEditPanel}
        onClose={handleCloseEdit}
        title="Chỉnh sửa học phí"
      >
        <EditCoursePricing
          course={course}
          onClose={handleCloseEdit}
          disabled={isMyCourses}
        />
      </RightPanel>
    </>
  );
};
