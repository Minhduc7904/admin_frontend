import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Button, Dropdown, Textarea } from '../../../../shared/components/ui'
import { AdminSearchSelect } from '../../../admin/components/AdminSearchSelect'
import { SubjectSearchSelect } from '../../../subject/components/SubjectSearchSelect'
import {
    updateCourseBasicInfoAsync,
    getCourseByIdAsync,
    selectCourseLoadingUpdate,
} from '../../store/courseSlice'

export const EditCourse = ({ course, onClose, disableTeacherEdit = false }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectCourseLoadingUpdate)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        academicYear: '',
        grade: '',
        subjectId: '',
        description: '',
        visibility: 'DRAFT',
        teacherId: '',
    })

    useEffect(() => {
        if (!course) return

        setFormData({
            title: course.title || '',
            subtitle: course.subtitle || '',
            academicYear: course.academicYear || '',
            grade: course.grade?.toString() || '',
            subjectId: course.subjectId?.toString() || '',
            description: course.description || '',
            visibility: course.visibility || 'DRAFT',
            teacherId: course.teacherId?.toString() || '',
        })
    }, [course])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const errors = {}

        if (!formData.title?.trim()) {
            errors.title = 'Tiêu đề không được để trống'
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự'
        } else if (formData.title.trim().length > 200) {
            errors.title = 'Tiêu đề không được quá 200 ký tự'
        }

        if (formData.subtitle && formData.subtitle.trim().length > 255) {
            errors.subtitle = 'Phụ đề không được quá 255 ký tự'
        }

        if (formData.academicYear && formData.academicYear.trim().length > 9) {
            errors.academicYear = 'Năm học không được quá 9 ký tự'
        }

        if (
            formData.grade &&
            (parseInt(formData.grade) < 1 || parseInt(formData.grade) > 12)
        ) {
            errors.grade = 'Khối phải từ 1 đến 12'
        }

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const data = {
            title: formData.title.trim(),
            subtitle: formData.subtitle?.trim() || undefined,
            academicYear: formData.academicYear?.trim() || undefined,
            grade: formData.grade ? parseInt(formData.grade) : undefined,
            subjectId: formData.subjectId ? parseInt(formData.subjectId) : undefined,
            description: formData.description?.trim() || undefined,
            visibility: formData.visibility,
            teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
        }

        try {
            await dispatch(
                updateCourseBasicInfoAsync({ id: course.courseId, data }),
            ).unwrap()

            await dispatch(getCourseByIdAsync(course.courseId))
            onClose()
        } catch (error) {
            console.error('Error updating course:', error)
        }
    }

    const gradeOptions = [
        { value: '', label: 'Chọn khối' },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: `${i + 1}`,
            label: `Khối ${i + 1}`,
        })),
    ]

    const visibilityOptions = [
        { value: 'DRAFT', label: 'Bản nháp' },
        { value: 'PUBLISHED', label: 'Đã xuất bản' },
        { value: 'PRIVATE', label: 'Riêng tư' },
    ]

    const currentYear = new Date().getFullYear()
    const academicYearOptions = [
        { value: '', label: 'Chọn năm học' },
        ...Array.from({ length: 5 }, (_, i) => {
            const startYear = currentYear - 2 + i
            const endYear = startYear + 1
            const value = `${startYear}-${endYear}`
            return { value, label: value }
        }),
    ]

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                <Input
                    name="title"
                    label="Tiêu đề khóa học"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    placeholder="VD: Toán nâng cao lớp 10"
                />

                <Input
                    name="subtitle"
                    label="Phụ đề"
                    value={formData.subtitle}
                    onChange={handleChange}
                    error={errors.subtitle}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Dropdown
                        label="Khối lớp"
                        value={formData.grade}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, grade: value }))
                        }
                        options={gradeOptions}
                        error={errors.grade}
                    />

                    <Dropdown
                        label="Năm học"
                        value={formData.academicYear}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, academicYear: value }))
                        }
                        options={academicYearOptions}
                        error={errors.academicYear}
                    />
                </div>

                <Textarea
                    name="description"
                    label="Mô tả"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                />

                <Dropdown
                    label="Trạng thái"
                    required
                    value={formData.visibility}
                    onChange={(value) =>
                        setFormData((prev) => ({ ...prev, visibility: value }))
                    }
                    options={visibilityOptions}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SubjectSearchSelect
                        label="Môn học"
                        value={formData.subjectId}
                        onSelect={(subject) =>
                            setFormData((prev) => ({
                                ...prev,
                                subjectId: subject?.subjectId || '',
                            }))
                        }
                        error={errors.subjectId}
                    />

                    <AdminSearchSelect
                        label="Giáo viên"
                        value={formData.teacherId}
                        disabled={disableTeacherEdit}
                        onSelect={(admin) => {
                            if (!disableTeacherEdit) {
                                setFormData((prev) => ({
                                    ...prev,
                                    teacherId: admin?.adminId || '',
                                }))
                            }
                        }}
                        error={errors.teacherId}
                    />
                </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button type="submit" loading={loadingUpdate}>
                    Cập nhật
                </Button>
            </div>
        </form>
    )
}
