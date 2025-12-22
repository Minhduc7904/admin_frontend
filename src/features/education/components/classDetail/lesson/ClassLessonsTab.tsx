import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { LessonCard, type Lesson } from './LessonCard';
import { StudentSubmissionsList, type StudentSubmission } from './StudentSubmissionsList';
import { ExamRankList, type ExamRank } from './ExamRankList';
import { AddLessonModal } from './AddLessonModal';
import { AddLessonItemModal } from './AddLessonItemModal';
import type { LessonItem } from './LessonItemCard';

interface ClassLessonsTabProps {
    classId: string;
}

export const ClassLessonsTab: React.FC<ClassLessonsTabProps> = ({ classId }) => {
    const [selectedItem, setSelectedItem] = useState<LessonItem | null>(null);
    const [selectedExamItem, setSelectedExamItem] = useState<LessonItem | null>(null);
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
    const [addItemLessonId, setAddItemLessonId] = useState<string | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([
        {
            id: '1',
            title: 'Buổi 1: Giới thiệu về Đạo hàm',
            description: 'Khái niệm đạo hàm, ý nghĩa hình học và vật lý của đạo hàm',
            date: '02/12/2024',
            duration: '90 phút',
            status: 'completed',
            items: [
                {
                    id: '1-1',
                    title: 'Video bài giảng: Khái niệm đạo hàm',
                    type: 'video',
                    content: 'https://youtube.com/watch?v=abc123',
                    order: 1,
                },
                {
                    id: '1-2',
                    title: 'Tài liệu: Bài giảng đạo hàm',
                    type: 'document',
                    content: 'https://drive.google.com/file/d/abc123',
                    order: 2,
                },
                {
                    id: '1-3',
                    title: 'Bài tập online: Định nghĩa đạo hàm',
                    type: 'online-exercise',
                    content: 'Bài tập trắc nghiệm về khái niệm đạo hàm',
                    order: 3,
                    examId: 'EXAM001',
                    examTitle: 'Kiểm tra định nghĩa đạo hàm - Chương 1',
                    completedCount: 36,
                    totalStudents: 38,
                },
            ],
        },
        {
            id: '2',
            title: 'Buổi 2: Các quy tắc tính đạo hàm',
            description: 'Đạo hàm của tổng, hiệu, tích, thương. Đạo hàm hàm hợp',
            date: '05/12/2024',
            duration: '90 phút',
            status: 'completed',
            items: [
                {
                    id: '2-1',
                    title: 'Video: Quy tắc đạo hàm cơ bản',
                    type: 'video',
                    content: 'https://youtube.com/watch?v=def456',
                    order: 1,
                },
                {
                    id: '2-2',
                    title: 'Bài tập nộp file: Tính đạo hàm các hàm số',
                    type: 'assignment',
                    content: 'Hoàn thành 10 bài tập tính đạo hàm',
                    order: 2,
                    submissionCount: 35,
                    totalStudents: 38,
                },
                {
                    id: '2-3',
                    title: 'Tài liệu: Tổng hợp công thức đạo hàm',
                    type: 'document',
                    content: 'https://drive.google.com/file/d/def456',
                    order: 3,
                },
            ],
        },
        {
            id: '3',
            title: 'Buổi 3: Ứng dụng đạo hàm khảo sát hàm số',
            description: 'Tìm cực trị, khoảng đơn điệu, giá trị lớn nhất nhỏ nhất',
            date: '09/12/2024',
            duration: '90 phút',
            status: 'upcoming',
            items: [
                {
                    id: '3-1',
                    title: 'Video: Ứng dụng đạo hàm',
                    type: 'video',
                    content: 'https://youtube.com/watch?v=ghi789',
                    order: 1,
                },
                {
                    id: '3-2',
                    title: 'Bài tập online: Khảo sát hàm số',
                    type: 'online-exercise',
                    content: 'Bài tập trắc nghiệm về khảo sát hàm số',
                    order: 2,
                    examId: 'EXAM003',
                    examTitle: 'Kiểm tra ứng dụng đạo hàm - Chương 3',
                    completedCount: 0,
                    totalStudents: 38,
                },
            ],
        },
    ]);

    // Mock data - student submissions
    const mockSubmissions: StudentSubmission[] = [
        {
            id: '1',
            studentName: 'Nguyễn Văn An',
            studentCode: 'HS001',
            submittedDate: '06/12/2024 14:30',
            fileName: 'BaiTap_DaoHam_NguyenVanAn.pdf',
            fileUrl: 'https://example.com/file1.pdf',
            status: 'graded',
            score: 9.5,
            maxScore: 10,
            feedback: 'Bài làm tốt, trình bày rõ ràng',
        },
        {
            id: '2',
            studentName: 'Trần Thị Bình',
            studentCode: 'HS002',
            submittedDate: '06/12/2024 15:20',
            fileName: 'BaiTap_DaoHam_TranThiBinh.pdf',
            fileUrl: 'https://example.com/file2.pdf',
            status: 'graded',
            score: 8.0,
            maxScore: 10,
            feedback: 'Cần chú ý đến dấu trong các phép tính',
        },
        {
            id: '3',
            studentName: 'Lê Văn Cường',
            studentCode: 'HS003',
            submittedDate: '06/12/2024 16:45',
            fileName: 'BaiTap_DaoHam_LeVanCuong.pdf',
            fileUrl: 'https://example.com/file3.pdf',
            status: 'submitted',
        },
        {
            id: '4',
            studentName: 'Phạm Thị Dung',
            studentCode: 'HS004',
            submittedDate: '07/12/2024 10:20',
            fileName: 'BaiTap_DaoHam_PhamThiDung.pdf',
            fileUrl: 'https://example.com/file4.pdf',
            status: 'late',
        },
    ];

    // Mock data - exam ranks
    const mockExamRanks: ExamRank[] = [
        {
            rank: 1,
            studentName: 'Nguyễn Văn An',
            studentCode: 'HS001',
            score: 9.8,
            maxScore: 10,
            completedTime: '15 phút 30 giây',
            completedDate: '03/12/2024 10:30',
            status: 'completed',
        },
        {
            rank: 2,
            studentName: 'Trần Thị Bình',
            studentCode: 'HS002',
            score: 9.5,
            maxScore: 10,
            completedTime: '18 phút 45 giây',
            completedDate: '03/12/2024 10:35',
            status: 'completed',
        },
        {
            rank: 3,
            studentName: 'Lê Văn Cường',
            studentCode: 'HS003',
            score: 9.2,
            maxScore: 10,
            completedTime: '20 phút 10 giây',
            completedDate: '03/12/2024 11:00',
            status: 'completed',
        },
        {
            rank: 4,
            studentName: 'Phạm Thị Dung',
            studentCode: 'HS004',
            score: 8.8,
            maxScore: 10,
            completedTime: '22 phút 30 giây',
            completedDate: '03/12/2024 11:15',
            status: 'completed',
        },
        {
            rank: 5,
            studentName: 'Hoàng Văn Em',
            studentCode: 'HS005',
            score: 8.5,
            maxScore: 10,
            completedTime: '25 phút 05 giây',
            completedDate: '03/12/2024 14:20',
            status: 'completed',
        },
        {
            rank: 6,
            studentName: 'Đỗ Thị Phương',
            studentCode: 'HS006',
            score: 8.2,
            maxScore: 10,
            completedTime: '23 phút 50 giây',
            completedDate: '03/12/2024 14:45',
            status: 'completed',
        },
        {
            rank: 7,
            studentName: 'Vũ Văn Giang',
            studentCode: 'HS007',
            score: 7.8,
            maxScore: 10,
            completedTime: '28 phút 15 giây',
            completedDate: '03/12/2024 15:30',
            status: 'completed',
        },
        {
            rank: 8,
            studentName: 'Mai Thị Hoa',
            studentCode: 'HS008',
            score: 7.5,
            maxScore: 10,
            completedTime: '30 phút 00 giây',
            completedDate: '03/12/2024 16:00',
            status: 'completed',
        },
    ];

    // Handlers
    const handleAddLesson = () => {
        setIsAddLessonModalOpen(true);
    };

    const handleSubmitLesson = (lessonData: {
        title: string;
        description: string;
        date: string;
        duration: string;
        status: 'upcoming' | 'completed' | 'cancelled';
    }) => {
        const newLesson: Lesson = {
            id: Date.now().toString(),
            title: lessonData.title,
            description: lessonData.description,
            date: lessonData.date,
            duration: lessonData.duration,
            status: lessonData.status,
            items: [],
        };
        setLessons([...lessons, newLesson]);
    };

    const handleEditLesson = (lesson: Lesson) => {
        console.log('Edit lesson:', lesson);
    };

    const handleDeleteLesson = (id: string) => {
        setLessons(lessons.filter((lesson) => lesson.id !== id));
    };

    const handleAddItem = (lessonId: string) => {
        setAddItemLessonId(lessonId);
    };

    const handleSubmitItem = (itemData: {
        title: string;
        type: LessonItem['type'];
        content: string;
        examId?: string;
        examTitle?: string;
    }) => {
        if (!addItemLessonId) return;

        const newItem: LessonItem = {
            id: Date.now().toString(),
            title: itemData.title,
            type: itemData.type,
            content: itemData.content,
            order: lessons.find((l) => l.id === addItemLessonId)?.items.length || 0 + 1,
            ...(itemData.type === 'online-exercise' && {
                examId: itemData.examId,
                examTitle: itemData.examTitle,
                completedCount: 0,
                totalStudents: 38,
            }),
            ...(itemData.type === 'assignment' && {
                submissionCount: 0,
                totalStudents: 38,
            }),
        };

        setLessons(
            lessons.map((lesson) =>
                lesson.id === addItemLessonId
                    ? { ...lesson, items: [...lesson.items, newItem] }
                    : lesson
            )
        );
    };

    const handleEditItem = (item: LessonItem) => {
        console.log('Edit item:', item);
    };

    const handleDeleteItem = (itemId: string) => {
        setLessons(
            lessons.map((lesson) => ({
                ...lesson,
                items: lesson.items.filter((item) => item.id !== itemId),
            }))
        );
    };

    const handleViewSubmissions = (item: LessonItem) => {
        setSelectedItem(item);
    };

    const handleViewRank = (item: LessonItem) => {
        setSelectedExamItem(item);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Danh sách buổi học</h3>
                <button
                    onClick={handleAddLesson}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={16} />
                    Thêm buổi học
                </button>
            </div>

            {/* Lessons List */}
            <div className="space-y-3">
                {lessons.map((lesson) => (
                    <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onEdit={handleEditLesson}
                        onDelete={handleDeleteLesson}
                        onAddItem={handleAddItem}
                        onEditItem={handleEditItem}
                        onDeleteItem={handleDeleteItem}
                        onViewSubmissions={handleViewSubmissions}
                        onViewRank={handleViewRank}
                    />
                ))}
            </div>

            {/* Student Submissions Modal */}
            {selectedItem && (
                <StudentSubmissionsList
                    itemTitle={selectedItem.title}
                    submissions={mockSubmissions}
                    onClose={() => setSelectedItem(null)}
                />
            )}

            {/* Exam Rank Modal */}
            {selectedExamItem && (
                <ExamRankList
                    examTitle={selectedExamItem.examTitle || selectedExamItem.title}
                    ranks={mockExamRanks}
                    onClose={() => setSelectedExamItem(null)}
                />
            )}

            {/* Add Lesson Modal */}
            {isAddLessonModalOpen && (
                <AddLessonModal
                    onClose={() => setIsAddLessonModalOpen(false)}
                    onSubmit={handleSubmitLesson}
                />
            )}

            {/* Add Lesson Item Modal */}
            {addItemLessonId && (
                <AddLessonItemModal
                    lessonId={addItemLessonId}
                    onClose={() => setAddItemLessonId(null)}
                    onSubmit={handleSubmitItem}
                />
            )}
        </div>
    );
};
