import type { ManagementModule, Subject } from '../types/module.types';

export const MANAGEMENT_MODULES: ManagementModule[] = [
    {
        id: 'admin',
        name: 'Quản lý Admin',
        description: 'Phân quyền và quản lý người quản trị',
        icon: 'Shield',
        features: [
            'Phân quyền người dùng',
            'Thêm quản trị viên',
            'Sửa thông tin admin',
            'Xóa quản trị viên',
        ],
    },
    {
        id: 'education',
        name: 'Quản lý Học tập',
        description: 'Quản lý lớp học, đề thi và câu hỏi',
        icon: 'GraduationCap',
        features: [
            'Quản lý lớp học',
            'Quản lý đề thi',
            'Quản lý câu hỏi',
            'Theo dõi tiến độ',
        ],
        requiresSubject: true,
    },
    {
        id: 'student',
        name: 'Quản lý Học sinh',
        description: 'Quản lý học sinh, điểm danh và học phí',
        icon: 'Users',
        features: [
            'Thêm/Sửa/Xóa học sinh',
            'Quản lý điểm danh',
            'Quản lý học phí',
            'Theo dõi tiến độ',
        ],
    },
    {
        id: 'public',
        name: 'Quản lý Trang Public',
        description: 'Quản lý nội dung trang công khai',
        icon: 'Globe',
        features: [
            'Thêm ảnh',
            'Xóa ảnh',
            'Quản lý banner',
            'Cập nhật nội dung',
        ],
    },
];

export const SUBJECTS: Subject[] = [
    {
        id: 'math',
        name: 'Toán',
        nameEn: 'Mathematics',
        color: 'bg-blue-500',
        icon: 'Calculator',
    },
    {
        id: 'physics',
        name: 'Lý',
        nameEn: 'Physics',
        color: 'bg-purple-500',
        icon: 'Atom',
    },
    {
        id: 'chemistry',
        name: 'Hóa',
        nameEn: 'Chemistry',
        color: 'bg-green-500',
        icon: 'FlaskConical',
    },
    {
        id: 'literature',
        name: 'Văn',
        nameEn: 'Literature',
        color: 'bg-pink-500',
        icon: 'BookOpen',
    },
    {
        id: 'biology',
        name: 'Sinh',
        nameEn: 'Biology',
        color: 'bg-emerald-500',
        icon: 'Leaf',
    },
    {
        id: 'english',
        name: 'Anh',
        nameEn: 'English',
        color: 'bg-red-500',
        icon: 'Languages',
    },
];
