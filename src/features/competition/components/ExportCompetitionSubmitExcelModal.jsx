import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';

import {
    Modal,
    Button,
    Checkbox,
    Dropdown,
    Input,
} from '../../../shared/components/ui';
import { GRADE_OPTIONS } from '../../../core/constants/grade-constants';
import { IS_ACTIVE_OPTIONS } from '../../../core/constants/is-active.constants';
import { TIME_RANGE_OPTIONS } from '../../../core/constants/options';
import { getDateRange } from '../../../shared/utils';
import { CourseClassSearchMultiSelect } from '../../courseClass/components/CourseClassSearchMultiSelect';
import { getHighSchoolGraduationYearOptions } from '../../student/utils/graduationYear';
import {
    exportCompetitionSubmitExcelAsync,
    selectCompetitionSubmitExportExcelOptions,
    selectCompetitionSubmitLoadingExport,
    setCompetitionSubmitExportExcelOptions,
} from '../../competitionSubmit/store/competitionSubmitSlice';

const TIME_RANGE_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tùy chọn' },
    ...TIME_RANGE_OPTIONS,
];

const HIGH_SCHOOL_GRADUATION_YEAR_OPTIONS = getHighSchoolGraduationYearOptions();

const SUBMIT_STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái bài nộp' },
    { value: 'IN_PROGRESS', label: 'Đang làm' },
    { value: 'SUBMITTED', label: 'Đã nộp' },
    { value: 'GRADED', label: 'Đã chấm' },
    { value: 'ABANDONED', label: 'Bỏ giữa chừng' },
];

const BOOLEAN_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả' },
    { value: 'true', label: 'Có' },
    { value: 'false', label: 'Không' },
];

const SORT_FIELD_OPTIONS = [
    { value: '', label: 'Theo mặc định' },
    { value: 'startedAt', label: 'Thời gian bắt đầu' },
    { value: 'submittedAt', label: 'Thời gian nộp' },
    { value: 'gradedAt', label: 'Thời gian chấm' },
    { value: 'totalPoints', label: 'Điểm' },
    { value: 'attemptNumber', label: 'Lần làm' },
    { value: 'createdAt', label: 'Ngày tạo' },
];

const SORT_ORDER_OPTIONS = [
    { value: 'desc', label: 'Giảm dần' },
    { value: 'asc', label: 'Tăng dần' },
];

const normalizeValue = (value) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return value;
};

const cleanPayload = (payload) => {
    return Object.entries(payload).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
            if (value.length) acc[key] = value;
            return acc;
        }
        const normalized = normalizeValue(value);
        if (normalized !== undefined) acc[key] = normalized;
        return acc;
    }, {});
};

export const ExportCompetitionSubmitExcelModal = ({
    isOpen,
    onClose,
    competition,
    currentFilters = {},
}) => {
    const dispatch = useDispatch();
    const exportOptions = useSelector(selectCompetitionSubmitExportExcelOptions);
    const loading = useSelector(selectCompetitionSubmitLoadingExport);

    const [timeRange, setTimeRange] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [overriddenFields, setOverriddenFields] = useState(() => new Set());

    const markOverridden = (field) => {
        setOverriddenFields((current) => {
            const next = new Set(current);
            next.add(field);
            return next;
        });
    };

    const updateOption = (field) => (value) => {
        markOverridden(field);
        dispatch(setCompetitionSubmitExportExcelOptions({ [field]: value }));
    };

    const updateBooleanOption = (field) => (value) => {
        markOverridden(field);
        dispatch(setCompetitionSubmitExportExcelOptions({
            [field]: value === '' ? undefined : value === 'true',
        }));
    };

    const getValue = (field, fallback = '') => {
        if (overriddenFields.has(field)) return exportOptions[field] ?? '';
        return currentFilters[field] ?? exportOptions[field] ?? fallback;
    };

    const getBooleanDropdownValue = (field, fallback) => {
        const value = overriddenFields.has(field) ? exportOptions[field] : fallback ?? exportOptions[field];
        if (value === true) return 'true';
        if (value === false) return 'false';
        return '';
    };

    const handleTimeRangeChange = (value) => {
        setTimeRange(value);

        if (!value) {
            dispatch(setCompetitionSubmitExportExcelOptions({ fromDate: '', toDate: '' }));
            markOverridden('fromDate');
            markOverridden('toDate');
            return;
        }

        const { fromDate, toDate } = getDateRange(value);
        dispatch(setCompetitionSubmitExportExcelOptions({ fromDate, toDate }));
        markOverridden('fromDate');
        markOverridden('toDate');
    };

    const handleCheckboxChange = (field) => (checked) => {
        dispatch(setCompetitionSubmitExportExcelOptions({ [field]: checked }));
    };

    const handleClassesChange = (classes) => {
        setSelectedClasses(classes);
        dispatch(setCompetitionSubmitExportExcelOptions({ classIds: classes.map((item) => item.classId) }));
        markOverridden('classIds');
    };

    const handleClose = () => {
        setTimeRange('');
        setSelectedClasses([]);
        setOverriddenFields(new Set());
        onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = cleanPayload({
            competitionId: competition?.competitionId,
            search: getValue('search'),
            sortBy: getValue('sortBy'),
            sortOrder: getValue('sortOrder', 'desc'),
            page: exportOptions.page,
            limit: exportOptions.limit,
            grade: exportOptions.grade,
            highSchoolGraduationYear: exportOptions.highSchoolGraduationYear,
            isActive: exportOptions.isActive,
            hasParentZaloId: exportOptions.hasParentZaloId,
            classIds: exportOptions.classIds,
            fromDate: exportOptions.fromDate,
            toDate: exportOptions.toDate,
            includeSchool: exportOptions.includeSchool,
            includeGender: exportOptions.includeGender,
            includeDateOfBirth: exportOptions.includeDateOfBirth,
            includeUsername: exportOptions.includeUsername,
            includeParentPhone: exportOptions.includeParentPhone,
            includeStudentPhone: exportOptions.includeStudentPhone,
            includeGrade: exportOptions.includeGrade,
            includeHighSchoolGraduationYear: exportOptions.includeHighSchoolGraduationYear,
            includeEmail: exportOptions.includeEmail,
            includeIsActive: exportOptions.includeIsActive,
            includeCreatedAt: exportOptions.includeCreatedAt,
            includeClasses: exportOptions.includeClasses,
            studentId: exportOptions.studentId,
            status: getValue('status'),
            attemptNumber: exportOptions.attemptNumber,
            isGraded: getBooleanDropdownValue('isGraded', currentFilters.isGraded) === ''
                ? undefined
                : getBooleanDropdownValue('isGraded', currentFilters.isGraded) === 'true',
            startedFrom: getValue('startedFrom'),
            startedTo: getValue('startedTo'),
            submittedFrom: exportOptions.submittedFrom,
            submittedTo: exportOptions.submittedTo,
            includeCompetitionSubmitColumns: exportOptions.includeCompetitionSubmitColumns,
            includeQuestionColumns: exportOptions.includeQuestionColumns,
        });

        try {
            await dispatch(exportCompetitionSubmitExcelAsync(payload)).unwrap();
            handleClose();
        } catch (error) {
            console.error('Export competition submit excel failed:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="xl"
            title="Xuất Excel điểm bài nộp competition"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6 mb-6">
                    <div className="bg-white border border-border rounded-sm p-4 space-y-4">
                        <p className="text-sm font-medium text-foreground">
                            Bộ lọc dữ liệu
                        </p>

                        <div className="rounded-sm bg-gray-50 border border-border px-3 py-2 text-xs text-foreground-light">
                            Competition: <span className="font-medium text-foreground">{competition?.title || `#${competition?.competitionId}`}</span>
                        </div>

                        <Input
                            label="Tìm kiếm học sinh"
                            value={getValue('search')}
                            onChange={(event) => updateOption('search')(event.target.value)}
                            placeholder="Tên, email, mã học sinh..."
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Dropdown
                                value={exportOptions.grade}
                                onChange={updateOption('grade')}
                                options={GRADE_OPTIONS}
                                placeholder="Khối học"
                            />

                            <Dropdown
                                value={exportOptions.highSchoolGraduationYear}
                                onChange={updateOption('highSchoolGraduationYear')}
                                options={HIGH_SCHOOL_GRADUATION_YEAR_OPTIONS}
                                placeholder="Năm tốt nghiệp"
                            />

                            <Dropdown
                                value={getBooleanDropdownValue('isActive')}
                                onChange={updateBooleanOption('isActive')}
                                options={IS_ACTIVE_OPTIONS}
                                placeholder="Trạng thái học sinh"
                            />

                            <Dropdown
                                value={exportOptions.hasParentZaloId}
                                onChange={updateOption('hasParentZaloId')}
                                options={BOOLEAN_FILTER_OPTIONS}
                                placeholder="Có Zalo phụ huynh"
                            />
                        </div>

                        <div>
                            <Dropdown
                                label="Khoảng thời gian tạo học sinh"
                                value={timeRange}
                                onChange={handleTimeRangeChange}
                                options={TIME_RANGE_OPTIONS_WITH_DEFAULT}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="date"
                                label="Từ ngày tạo học sinh"
                                value={exportOptions.fromDate}
                                onChange={(event) => {
                                    updateOption('fromDate')(event.target.value);
                                    setTimeRange('');
                                }}
                            />

                            <Input
                                type="date"
                                label="Đến ngày tạo học sinh"
                                value={exportOptions.toDate}
                                onChange={(event) => {
                                    updateOption('toDate')(event.target.value);
                                    setTimeRange('');
                                }}
                            />
                        </div>

                        <CourseClassSearchMultiSelect
                            label="Lớp học đã tham gia"
                            placeholder="Tìm kiếm lớp học..."
                            value={selectedClasses}
                            onChange={handleClassesChange}
                        />
                    </div>

                    <div className="bg-white border border-border rounded-sm p-4 space-y-4">
                        <p className="text-sm font-medium text-foreground">
                            Bộ lọc bài nộp competition
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Dropdown
                                value={getValue('status')}
                                onChange={updateOption('status')}
                                options={SUBMIT_STATUS_OPTIONS}
                                placeholder="Trạng thái bài nộp"
                            />

                            <Dropdown
                                value={getBooleanDropdownValue('isGraded', currentFilters.isGraded)}
                                onChange={updateBooleanOption('isGraded')}
                                options={BOOLEAN_FILTER_OPTIONS}
                                placeholder="Đã chấm"
                            />

                            <Input
                                type="number"
                                label="ID học sinh"
                                value={exportOptions.studentId}
                                onChange={(event) => updateOption('studentId')(event.target.value)}
                                placeholder="Ví dụ: 123"
                            />

                            <Input
                                type="number"
                                label="Lần làm"
                                value={exportOptions.attemptNumber}
                                onChange={(event) => updateOption('attemptNumber')(event.target.value)}
                                placeholder="Ví dụ: 1"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="date"
                                label="Bắt đầu từ"
                                value={getValue('startedFrom')}
                                onChange={(event) => updateOption('startedFrom')(event.target.value)}
                            />
                            <Input
                                type="date"
                                label="Bắt đầu đến"
                                value={getValue('startedTo')}
                                onChange={(event) => updateOption('startedTo')(event.target.value)}
                            />
                            <Input
                                type="date"
                                label="Nộp từ"
                                value={exportOptions.submittedFrom}
                                onChange={(event) => updateOption('submittedFrom')(event.target.value)}
                            />
                            <Input
                                type="date"
                                label="Nộp đến"
                                value={exportOptions.submittedTo}
                                onChange={(event) => updateOption('submittedTo')(event.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Dropdown
                                value={getValue('sortBy')}
                                onChange={updateOption('sortBy')}
                                options={SORT_FIELD_OPTIONS}
                                placeholder="Sắp xếp theo"
                            />
                            <Dropdown
                                value={getValue('sortOrder', 'desc')}
                                onChange={updateOption('sortOrder')}
                                options={SORT_ORDER_OPTIONS}
                                placeholder="Thứ tự"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="number"
                                label="Trang"
                                value={exportOptions.page}
                                onChange={(event) => updateOption('page')(event.target.value)}
                                placeholder="Bỏ trống để xuất theo mặc định"
                            />
                            <Input
                                type="number"
                                label="Số dòng mỗi trang"
                                value={exportOptions.limit}
                                onChange={(event) => updateOption('limit')(event.target.value)}
                                placeholder="Bỏ trống để xuất theo mặc định"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Chọn các trường học sinh cần xuất
                        </label>

                        <div className="bg-background rounded-sm border border-border p-4 space-y-4">
                            <p className="text-xs text-foreground-light">
                                <strong>Mặc định:</strong> STT, Mã học sinh, Họ và tên.
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <Checkbox label="Trường" checked={exportOptions.includeSchool} onChange={handleCheckboxChange('includeSchool')} />
                                <Checkbox label="Giới tính" checked={exportOptions.includeGender} onChange={handleCheckboxChange('includeGender')} />
                                <Checkbox label="Ngày sinh" checked={exportOptions.includeDateOfBirth} onChange={handleCheckboxChange('includeDateOfBirth')} />
                                <Checkbox label="Username" checked={exportOptions.includeUsername} onChange={handleCheckboxChange('includeUsername')} />
                                <Checkbox label="SĐT phụ huynh" checked={exportOptions.includeParentPhone} onChange={handleCheckboxChange('includeParentPhone')} />
                                <Checkbox label="SĐT học sinh" checked={exportOptions.includeStudentPhone} onChange={handleCheckboxChange('includeStudentPhone')} />
                                <Checkbox label="Khối" checked={exportOptions.includeGrade} onChange={handleCheckboxChange('includeGrade')} />
                                <Checkbox label="Năm tốt nghiệp cấp 3" checked={exportOptions.includeHighSchoolGraduationYear} onChange={handleCheckboxChange('includeHighSchoolGraduationYear')} />
                                <Checkbox label="Email" checked={exportOptions.includeEmail} onChange={handleCheckboxChange('includeEmail')} />
                                <Checkbox label="Trạng thái" checked={exportOptions.includeIsActive} onChange={handleCheckboxChange('includeIsActive')} />
                                <Checkbox label="Ngày tạo" checked={exportOptions.includeCreatedAt} onChange={handleCheckboxChange('includeCreatedAt')} />
                                <Checkbox label="Lớp học (pivot)" checked={exportOptions.includeClasses} onChange={handleCheckboxChange('includeClasses')} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Cột bài nộp competition
                        </label>

                        <div className="bg-background rounded-sm border border-border p-4 space-y-3">
                            <Checkbox
                                label="Xuất các cột thông tin bài nộp"
                                checked={exportOptions.includeCompetitionSubmitColumns}
                                onChange={handleCheckboxChange('includeCompetitionSubmitColumns')}
                            />
                            <Checkbox
                                label="Xuất các cột Câu 1..Câu N"
                                checked={exportOptions.includeQuestionColumns}
                                onChange={handleCheckboxChange('includeQuestionColumns')}
                            />
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
