import React from 'react';
import { GraduationCap, BookOpen, FileText, HelpCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { useAppSelector } from '@/core/store/hooks';
import { SUBJECTS } from '@/features/modules';
import { EducationSidebar } from '@/shared/components/sidebar';

export const EducationDashboard: React.FC = () => {
    const { selectedSubject } = useAppSelector((state) => state.module);
    const subjectInfo = SUBJECTS.find(s => s.id === selectedSubject);

    return (
        <div className="flex gap-6 -mx-4 -my-8">
            {/* Sidebar */}
            <EducationSidebar />
            
            {/* Main Content */}
            <div className="flex-1 p-8 space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Học tập</h1>
                <p className="text-gray-600 mt-1">
                    Môn học: <span className="font-semibold text-blue-600">{subjectInfo?.name}</span> ({subjectInfo?.nameEn})
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Tổng lớp học">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <GraduationCap className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">24</p>
                            <p className="text-sm text-gray-600">Lớp đang hoạt động</p>
                        </div>
                    </div>
                </Card>

                <Card title="Đề thi">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 rounded-full p-3">
                            <FileText className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">156</p>
                            <p className="text-sm text-gray-600">Đề thi có sẵn</p>
                        </div>
                    </div>
                </Card>

                <Card title="Câu hỏi">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <HelpCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">2,450</p>
                            <p className="text-sm text-gray-600">Trong ngân hàng</p>
                        </div>
                    </div>
                </Card>

                <Card title="Điểm trung bình">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <TrendingUp className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">7.8</p>
                            <p className="text-sm text-gray-600">Điểm TB học kỳ</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Classes List */}
                <Card title={`Lớp học môn ${subjectInfo?.name}`}>
                    <div className="space-y-3">
                        {[
                            { name: 'Lớp 10A1', students: 35, teacher: 'GV Nguyễn Văn A' },
                            { name: 'Lớp 10A2', students: 32, teacher: 'GV Trần Thị B' },
                            { name: 'Lớp 11A1', students: 38, teacher: 'GV Lê Văn C' },
                            { name: 'Lớp 11A2', students: 30, teacher: 'GV Phạm Thị D' },
                        ].map((cls, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{cls.name}</p>
                                    <p className="text-sm text-gray-600">{cls.teacher}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {cls.students} HS
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Exams */}
                <Card title="Đề thi gần đây">
                    <div className="space-y-3">
                        {[
                            { name: 'Kiểm tra 15 phút - Chương 1', questions: 10, time: '2 ngày trước' },
                            { name: 'Kiểm tra giữa kỳ', questions: 40, time: '1 tuần trước' },
                            { name: 'Bài tập về nhà', questions: 15, time: '1 tuần trước' },
                            { name: 'Ôn tập chương 2', questions: 25, time: '2 tuần trước' },
                        ].map((exam, index) => (
                            <div key={index} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                                <FileText className="text-purple-600 mt-1" size={20} />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{exam.name}</p>
                                    <p className="text-sm text-gray-600">{exam.questions} câu hỏi • {exam.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card title="Thao tác nhanh">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <GraduationCap className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Thêm lớp học</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <FileText className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Tạo đề thi</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <HelpCircle className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Thêm câu hỏi</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <BookOpen className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Xem báo cáo</p>
                    </button>
                </div>
            </Card>
            </div>
        </div>
    );
};
