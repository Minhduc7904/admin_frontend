import { createCourseAsync, getAllCoursesAsync, selectCourseLoadingCreate } from "../store/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Input, Button, Dropdown, Textarea } from "../../../shared/components";
import { AdminSearchSelect } from "../../admin/components/AdminSearchSelect";
import { SubjectSearchSelect } from "../../subject/components/SubjectSearchSelect";

export const AddCourse = ({ onClose, defaultTeacherId = null, canSelectTeacher = true, loadCourses }) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectCourseLoadingCreate);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        academicYear: '',
        grade: '',
        subjectId: '',
        description: '',
        priceVND: '0',
        compareAtVND: '',
        visibility: 'DRAFT',
        teacherId: defaultTeacherId || '',
        isUpdatable: true,
    });

    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateCreateCourse = (formData) => {
        const errors = {};

        if (!formData.title?.trim()) {
            errors.title = 'Tiêu đề không được để trống';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        } else if (formData.title.trim().length > 200) {
            errors.title = 'Tiêu đề không được quá 200 ký tự';
        }

        if (formData.subtitle && formData.subtitle.trim().length > 255) {
            errors.subtitle = 'Phụ đề không được quá 255 ký tự';
        }

        if (formData.academicYear && formData.academicYear.trim().length > 9) {
            errors.academicYear = 'Năm học không được quá 9 ký tự';
        }

        if (formData.grade && (parseInt(formData.grade) < 1 || parseInt(formData.grade) > 12)) {
            errors.grade = 'Khối phải từ 1 đến 12';
        }

        const price = parseFloat(formData.priceVND);
        if (isNaN(price) || price < 0) {
            errors.priceVND = 'Giá phải là số không âm';
        }

        if (formData.compareAtVND) {
            const comparePrice = parseFloat(formData.compareAtVND);
            if (isNaN(comparePrice) || comparePrice < 0) {
                errors.compareAtVND = 'Giá gốc phải là số không âm';
            } else if (comparePrice < price) {
                errors.compareAtVND = 'Giá gốc phải lớn hơn giá bán';
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateCreateCourse(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            title: formData.title.trim(),
            subtitle: formData.subtitle?.trim() || undefined,
            academicYear: formData.academicYear?.trim() || undefined,
            grade: formData.grade ? parseInt(formData.grade) : undefined,
            subjectId: formData.subjectId ? parseInt(formData.subjectId) : undefined,
            description: formData.description?.trim() || undefined,
            priceVND: parseFloat(formData.priceVND),
            compareAtVND: formData.compareAtVND ? parseFloat(formData.compareAtVND) : undefined,
            visibility: formData.visibility,
            teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
            isUpdatable: formData.isUpdatable,
        };

        try {
            await dispatch(createCourseAsync(data)).unwrap();
            await loadCourses();
            onClose();
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const gradeOptions = [
        { value: '', label: 'Chọn khối' },
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

    const visibilityOptions = [
        { value: 'DRAFT', label: 'Bản nháp' },
        { value: 'PUBLISHED', label: 'Đã xuất bản' },
        { value: 'PRIVATE', label: 'Riêng tư' },
    ];

    // Generate academic year options
    const currentYear = new Date().getFullYear();
    const academicYearOptions = [
        { value: '', label: 'Chọn năm học' },
        ...Array.from({ length: 5 }, (_, i) => {
            const startYear = currentYear - 2 + i;
            const endYear = startYear + 1;
            const value = `${startYear}-${endYear}`;
            return { value, label: `${value}` };
        })
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Title */}
                <div>
                    <Input
                        error={errors.title}
                        name="title"
                        label="Tiêu đề khóa học"
                        required={true}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="VD: Toán nâng cao lớp 10"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <Input
                        error={errors.subtitle}
                        name="subtitle"
                        label="Phụ đề"
                        value={formData.subtitle}
                        onChange={handleChange}
                        placeholder="VD: Chương trình học nâng cao"
                    />
                </div>

                {/* Grade and Academic Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Dropdown
                            label="Khối lớp"
                            value={formData.grade}
                            onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                            options={gradeOptions}
                            error={errors.grade}
                        />
                    </div>
                    <div>
                        <Dropdown
                            label="Năm học"
                            value={formData.academicYear}
                            onChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
                            options={academicYearOptions}
                            error={errors.academicYear}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <Textarea
                        error={errors.description}
                        name="description"
                        label="Mô tả"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả chi tiết về khóa học..."
                        rows={4}
                    />
                </div>

                {/* Price and Compare At Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            error={errors.priceVND}
                            name="priceVND"
                            label="Giá khóa học (VNĐ)"
                            type="number"
                            required={true}
                            value={formData.priceVND}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                    <div>
                        <Input
                            error={errors.compareAtVND}
                            name="compareAtVND"
                            label="Giá gốc (VNĐ)"
                            type="number"
                            value={formData.compareAtVND}
                            onChange={handleChange}
                            placeholder="Để trống nếu không giảm giá"
                            min="0"
                        />
                    </div>
                </div>

                {/* Visibility */}
                <div>
                    <Dropdown
                        label="Trạng thái"
                        required={true}
                        value={formData.visibility}
                        onChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                        options={visibilityOptions}
                        error={errors.visibility}
                    />
                </div>

                {/* Subject and Teacher Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <SubjectSearchSelect
                            label="Môn học"
                            placeholder="Tìm kiếm môn học..."
                            value={formData.subjectId}
                            onSelect={(subject) => {
                                setSelectedSubject(subject);
                                setFormData(prev => ({
                                    ...prev,
                                    subjectId: subject?.subjectId || ''
                                }));
                            }}
                            error={errors.subjectId}
                        />
                    </div>
                    {canSelectTeacher && (
                        <div>
                            <AdminSearchSelect
                                label="Giáo viên"
                                placeholder="Tìm kiếm giáo viên..."
                                value={formData.teacherId}
                                onSelect={(admin) => {
                                    setSelectedAdmin(admin);
                                    setFormData(prev => ({
                                        ...prev,
                                        teacherId: admin?.adminId || ''
                                    }));
                                }}
                                error={errors.teacherId}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loadingCreate}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={loadingCreate}
                >
                    Tạo khóa học
                </Button>
            </div>
        </form>
    );
};
