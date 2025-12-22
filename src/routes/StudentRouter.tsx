import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  StudentDashboard,
  StudentListPage,
  StudentDetailPage,
} from "@/features/dashboard";
import { TuitionPage } from "@/features/student/pages";
import { StudentLayout } from "@/features/student/layouts/StudentLayout";

export const StudentRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="list" element={<StudentListPage />} />
        <Route path="detail/:id" element={<StudentDetailPage />} />
        <Route path="tuition" element={<TuitionPage />} />
      </Route>
    </Routes>
  );
};
