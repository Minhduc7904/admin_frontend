import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';

import {
    Modal,
    Button,
    Checkbox,
    Dropdown,
    Input,
} from '../../../shared/components/ui';

import { TIME_RANGE_OPTIONS } from '../../../core/constants/options';
import { VISIBILITY_OPTIONS } from '../../../core/constants';
import { getDateRange } from '../../../shared/utils';
import { COURSE_ENROLLMENT_STATUS_OPTIONS } from '../../courseEnrollment/constants/course-enrollment.constant';
import {
    selectCourseEnrollmentExportExcelOptions,
    setCourseEnrollmentExportExcelOptions,
} from '../../courseEnrollment/store/courseEnrollmentSlice';

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    ...COURSE_ENROLLMENT_STATUS_OPTIONS,
];

const COURSE_VISIBILITY_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái khóa học' },
    ...VISIBILITY_OPTIONS,
];

const TIME_RANGE_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tùy chọn' },
    ...TIME_RANGE_OPTIONS,
];

const SORT_BY_OPTIONS = [
    { value: 'enrolledAt', label: 'Ngày đăng ký' },
    { value: 'enrollmentId', label: 'Mã đăng ký' },
    { value: 'courseId', label: 'Mã khóa học' },
    { value: 'studentId', label: 'Mã học sinh' },
    { value: 'status', label: 'Trạng thái' },
];

const SORT_ORDER_OPTIONS = [
    { value: 'desc', label: 'Mới nhất trước' },
    { value: 'asc', label: 'Cũ nhất trước' },
];

export const ExportCourseEnrollmentListModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    initialFilters = {},
}) => {
    const dispatch = useDispatch();
    const exportOptions = useSelector(selectCourseEnrollmentExportExcelOptions);
    const [timeRange, setTimeRange] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        dispatch(
            setCourseEnrollmentExportExcelOptions({
                search: initialFilters.search || '',
                status: initialFilters.status || '',
            })
        );
    }, [dispatch, initialFilters.search, initialFilters.status, isOpen]);

    const updateOption = (field) => (value) => {
        dispatch(setCourseEnrollmentExportExcelOptions({ [field]: value }));
    };

    const handleInputChange = (field) => (e) => {
        dispatch(setCourseEnrollmentExportExcelOptions({ [field]: e.target.value }));
    };

    const handleDateInputChange = (field) => (e) => {
        setTimeRange('');
        handleInputChange(field)(e);
    };

    const handleTimeRangeChange = (value) => {
        setTimeRange(value);

        if (!value) {
            dispatch(
                setCourseEnrollmentExportExcelOptions({
                    enrolledAtFrom: '',
                    enrolledAtTo: '',
                })
            );
            return;
        }

        const { fromDate, toDate } = getDateRange(value);
        dispatch(
            setCourseEnrollmentExportExcelOptions({
                enrolledAtFrom: fromDate,
                enrolledAtTo: toDate,
            })
        );
    };

    const handleCheckboxChange = (field) => (checked) => {
        dispatch(setCourseEnrollmentExportExcelOptions({ [field]: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(exportOptions);
    };

    const handleClose = () => {
        setTimeRange('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="xl"
            title="Xuất danh sách đăng ký khóa học"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6 mb-6">
                    <div className="bg-white border border-border rounded-sm p-4 space-y-4">
                        <p className="text-sm font-medium text-foreground">
                            Bộ lọc dữ liệu
                        </p>

                        <Input
                            label="Từ khóa"
                            value={exportOptions.search}
                            onChange={handleInputChange('search')}
                            placeholder="Tìm kiếm học sinh..."
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Dropdown
                                value={exportOptions.status}
                                onChange={updateOption('status')}
                                options={STATUS_OPTIONS}
                                placeholder="Trạng thái đăng ký"
                            />

                            <Dropdown
                                value={exportOptions.courseVisibility}
                                onChange={updateOption('courseVisibility')}
                                options={COURSE_VISIBILITY_OPTIONS}
                                placeholder="Trạng thái khóa học"
                            />

                            <Dropdown
                                value={exportOptions.sortBy}
                                onChange={updateOption('sortBy')}
                                options={SORT_BY_OPTIONS}
                                placeholder="Sắp xếp theo"
                            />

                            <Dropdown
                                value={exportOptions.sortOrder}
                                onChange={updateOption('sortOrder')}
                                options={SORT_ORDER_OPTIONS}
                                placeholder="Thứ tự"
                            />
                        </div>

                        <Dropdown
                            label="Khoảng thời gian đăng ký"
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            options={TIME_RANGE_OPTIONS_WITH_DEFAULT}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="date"
                                label="Từ ngày đăng ký"
                                value={exportOptions.enrolledAtFrom}
                                onChange={handleDateInputChange('enrolledAtFrom')}
                            />

                            <Input
                                type="date"
                                label="Đến ngày đăng ký"
                                value={exportOptions.enrolledAtTo}
                                onChange={handleDateInputChange('enrolledAtTo')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Chọn các trường cần xuất
                        </label>

                        <div className="bg-background rounded-sm border border-border p-4 space-y-4">
                            <p className="text-xs text-foreground-light">
                                <strong>Mặc định:</strong> STT, Mã học sinh, Họ và tên, Trạng thái
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Checkbox id="courseEnrollmentIncludeSchool" label="Trường" checked={exportOptions.includeSchool} onChange={handleCheckboxChange('includeSchool')} />
                                <Checkbox id="courseEnrollmentIncludeGender" label="Giới tính" checked={exportOptions.includeGender} onChange={handleCheckboxChange('includeGender')} />
                                <Checkbox id="courseEnrollmentIncludeDateOfBirth" label="Ngày sinh" checked={exportOptions.includeDateOfBirth} onChange={handleCheckboxChange('includeDateOfBirth')} />
                                <Checkbox id="courseEnrollmentIncludeUsername" label="Username" checked={exportOptions.includeUsername} onChange={handleCheckboxChange('includeUsername')} />
                                <Checkbox id="courseEnrollmentIncludeParentPhone" label="SĐT phụ huynh" checked={exportOptions.includeParentPhone} onChange={handleCheckboxChange('includeParentPhone')} />
                                <Checkbox id="courseEnrollmentIncludeStudentPhone" label="SĐT học sinh" checked={exportOptions.includeStudentPhone} onChange={handleCheckboxChange('includeStudentPhone')} />
                                <Checkbox id="courseEnrollmentIncludeGrade" label="Khối" checked={exportOptions.includeGrade} onChange={handleCheckboxChange('includeGrade')} />
                                <Checkbox id="courseEnrollmentIncludeHighSchoolGraduationYear" label="Năm tốt nghiệp cấp 3" checked={exportOptions.includeHighSchoolGraduationYear} onChange={handleCheckboxChange('includeHighSchoolGraduationYear')} />
                                <Checkbox id="courseEnrollmentIncludeEmail" label="Email" checked={exportOptions.includeEmail} onChange={handleCheckboxChange('includeEmail')} />
                                <Checkbox id="courseEnrollmentIncludeIsActive" label="Trạng thái tài khoản" checked={exportOptions.includeIsActive} onChange={handleCheckboxChange('includeIsActive')} />
                                <Checkbox id="courseEnrollmentIncludeCreatedAt" label="Ngày tạo" checked={exportOptions.includeCreatedAt} onChange={handleCheckboxChange('includeCreatedAt')} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                        Hủy
                    </Button>

                    <Button type="submit" loading={loading} disabled={loading}>
                        <Download size={16} />
                        Xuất Excel
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
