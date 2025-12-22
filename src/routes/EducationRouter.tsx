import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EducationDashboard } from '@/features/dashboard';
import { ClassListPage } from '@/features/education/pages/ClassListPage';
import { ClassDetailPage } from '@/features/education/pages/ClassDetailPage';
import { ExamListPage } from '@/features/education/pages/ExamListPage';
import { ExamDetailPage } from '@/features/education/pages/ExamDetailPage';
import { ExamSessionListPage } from '@/features/education/pages/ExamSessionListPage';
import { ExamSessionDetailPage } from '@/features/education/pages/ExamSessionDetailPage';
import { QuestionListPage } from '@/features/education/pages/QuestionListPage';
import { QuestionDetailPage } from '@/features/education/pages/QuestionDetailPage';
import { MaterialsPage } from '@/features/education/pages/MaterialsPage';
import { EducationLayout } from '@/features/education/layouts/EducationLayout';

export const EducationRouter: React.FC = () => {
    return (
        <Routes>
            <Route element={<EducationLayout />}>
                <Route path="dashboard" element={<EducationDashboard />} />
                <Route path="classes" element={<ClassListPage />} />
                <Route path="classes/:id" element={<ClassDetailPage />} />
                <Route path="exams" element={<ExamListPage />} />
                <Route path="exams/:id" element={<ExamDetailPage />} />
                <Route path="exam-sessions" element={<ExamSessionListPage />} />
                <Route path="exam-sessions/:id" element={<ExamSessionDetailPage />} />
                <Route path="questions" element={<QuestionListPage />} />
                <Route path="questions/:id" element={<QuestionDetailPage />} />
                <Route path="materials" element={<MaterialsPage />} />
                {/* Add more education routes here */}
            </Route>
        </Routes>
    );
};