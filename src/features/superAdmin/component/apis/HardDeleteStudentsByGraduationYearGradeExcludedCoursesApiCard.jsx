import { useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';
import { Button, Input, Table, Textarea } from '../../../../shared/components/ui';
import { useHardDeleteStudentsByGraduationYearGradeExcludedCourses } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

const CONFIRM_TEXT = 'HARD_DELETE';

const parseCourseIds = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
        return { courseIds: [], error: '' };
    }

    let rawItems = [];

    if (trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed);

            if (!Array.isArray(parsed)) {
                return {
                    courseIds: [],
                    error: 'courseIds dạng JSON phải là mảng, ví dụ: [1, 2, 3].',
                };
            }

            rawItems = parsed;
        } catch {
            return {
                courseIds: [],
                error: 'courseIds JSON không hợp lệ. Có thể nhập [1, 2, 3] hoặc 1,2,3.',
            };
        }
    } else {
        rawItems = trimmed.split(/[\s,;]+/).filter(Boolean);
    }

    const invalidItems = rawItems.filter((item) => {
        const numberValue = Number(item);
        return !Number.isInteger(numberValue) || numberValue <= 0;
    });

    if (invalidItems.length > 0) {
        return {
            courseIds: [],
            error: `courseIds chỉ nhận số nguyên dương. Giá trị không hợp lệ: ${invalidItems
                .slice(0, 5)
                .join(', ')}.`,
        };
    }

    const courseIds = [...new Set(rawItems.map(Number))];
    return { courseIds, error: '' };
};

const getStatusClassName = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (normalized.includes('fail') || normalized.includes('error')) {
        return 'bg-red-100 text-red-700';
    }

    if (normalized.includes('delete') || normalized.includes('success')) {
        return 'bg-green-100 text-green-700';
    }

    return 'bg-amber-100 text-amber-700';
};

const MetricCard = ({ label, value, className = 'border-border' }) => (
    <div className={`rounded-sm border p-3 ${className}`}>
        <p className="text-xs text-foreground-light">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value ?? 0}</p>
    </div>
);

const ruleItems = [
    'Đây là API xóa cứng: học sinh, user và dữ liệu liên quan đã xóa sẽ không khôi phục bằng soft delete.',
    'courseIds là danh sách khóa học cần bảo vệ, bắt buộc là mảng không rỗng và tất cả ID phải tồn tại.',
    'Chỉ xóa học sinh có highSchoolGraduationYear và grade đúng với input.',
    'Học sinh đang đăng ký khóa học hoặc đang nằm trong lớp thuộc một trong các courseIds sẽ được giữ lại.',
    'Dữ liệu liên quan được xóa trong transaction: bài nộp, câu trả lời, điểm danh, liên kết lớp, đăng ký khóa học, học phí, log điểm, lượt làm bài, bản ghi học sinh và user.',
    'Avatar chỉ hard delete media và file MinIO nếu media avatar không còn entity khác sử dụng.',
    'Nếu xóa file avatar trên MinIO thất bại sau khi DB đã commit, API vẫn trả kết quả và ghi chi tiết trong avatarFileResults.',
    'Admin audit log dùng actionKey DELETE_STUDENT, resourceType STUDENT và resourceId bulk:{year}:{grade}.',
];

const inputItems = [
    'highSchoolGraduationYear: năm tốt nghiệp cấp 3, từ 1900 đến 2100.',
    'grade: khối lớp cần xóa, từ 1 đến 12.',
    'courseIds: danh sách ID khóa học cần bảo vệ học sinh đang tham gia.',
];

export const HardDeleteStudentsByGraduationYearGradeExcludedCoursesApiCard = () => {
    const {
        loading,
        error,
        result,
        hardDeleteStudentsByGraduationYearGradeExcludedCourses,
        clearState,
    } = useHardDeleteStudentsByGraduationYearGradeExcludedCourses();

    const [highSchoolGraduationYear, setHighSchoolGraduationYear] = useState('');
    const [grade, setGrade] = useState('');
    const [courseIdsInput, setCourseIdsInput] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const [formError, setFormError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const parsedCourseIds = useMemo(() => parseCourseIds(courseIdsInput), [courseIdsInput]);

    const requestBody = useMemo(
        () => ({
            highSchoolGraduationYear: highSchoolGraduationYear
                ? Number(highSchoolGraduationYear)
                : 2026,
            grade: grade ? Number(grade) : 12,
            courseIds: parsedCourseIds.courseIds,
        }),
        [grade, highSchoolGraduationYear, parsedCourseIds.courseIds]
    );

    const responseData = result?.data || result;
    const deleteCounts = responseData?.deleteCounts || {};
    const deleteCountRows = Object.entries(deleteCounts).map(([tableName, count]) => ({
        tableName,
        count,
    }));
    const deletedStudents = Array.isArray(responseData?.deletedStudents)
        ? responseData.deletedStudents
        : [];
    const avatarFileResults = Array.isArray(responseData?.avatarFileResults)
        ? responseData.avatarFileResults
        : [];

    const validate = () => {
        const year = Number(highSchoolGraduationYear);
        const numericGrade = Number(grade);

        if (!highSchoolGraduationYear || !grade) {
            return 'Vui lòng nhập đầy đủ highSchoolGraduationYear và grade.';
        }

        if (!Number.isInteger(year) || year < 1900 || year > 2100) {
            return 'highSchoolGraduationYear phải là số nguyên từ 1900 đến 2100.';
        }

        if (!Number.isInteger(numericGrade) || numericGrade < 1 || numericGrade > 12) {
            return 'grade phải là số nguyên từ 1 đến 12.';
        }

        if (parsedCourseIds.error) {
            return parsedCourseIds.error;
        }

        if (parsedCourseIds.courseIds.length === 0) {
            return 'courseIds bắt buộc là mảng không rỗng.';
        }

        if (confirmText !== CONFIRM_TEXT) {
            return `Nhập ${CONFIRM_TEXT} để xác nhận thao tác xóa cứng.`;
        }

        return '';
    };

    const handleExecute = async () => {
        const message = validate();

        if (message) {
            setFormError(message);
            return;
        }

        setFormError('');
        await hardDeleteStudentsByGraduationYearGradeExcludedCourses({
            highSchoolGraduationYear: Number(highSchoolGraduationYear),
            grade: Number(grade),
            courseIds: parsedCourseIds.courseIds,
        });
    };

    const clearResponse = () => {
        setFormError('');
        clearState();
    };

    const deleteCountColumns = [
        {
            key: 'tableName',
            label: 'Bảng',
            render: (row) => <span className="text-sm text-foreground">{row.tableName}</span>,
        },
        {
            key: 'count',
            label: 'Số bản ghi đã xóa',
            render: (row) => <span className="text-sm font-medium text-foreground">{row.count ?? 0}</span>,
        },
    ];

    const deletedStudentColumns = [
        {
            key: 'studentId',
            label: 'ID học sinh',
            render: (row) => <span className="text-sm text-foreground">{row?.studentId ?? '-'}</span>,
        },
        {
            key: 'userId',
            label: 'ID user',
            render: (row) => <span className="text-sm text-foreground">{row?.userId ?? '-'}</span>,
        },
    ];

    const avatarFileColumns = [
        {
            key: 'mediaId',
            label: 'ID media',
            render: (row) => <span className="text-sm text-foreground">{row?.mediaId ?? '-'}</span>,
        },
        {
            key: 'bucketName',
            label: 'Bucket',
            render: (row) => <span className="text-xs text-foreground-light">{row?.bucketName || '-'}</span>,
        },
        {
            key: 'objectKey',
            label: 'Object key',
            render: (row) => (
                <span className="block max-w-[280px] truncate text-xs text-foreground-light" title={row?.objectKey || ''}>
                    {row?.objectKey || '-'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row) => (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClassName(row?.status)}`}>
                    {row?.status || '-'}
                </span>
            ),
        },
        {
            key: 'reason',
            label: 'Lý do',
            render: (row) => (
                <span className="block max-w-[260px] truncate text-xs text-foreground-light" title={row?.reason || ''}>
                    {row?.reason || '-'}
                </span>
            ),
        },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/students/hard-delete-by-graduation-year-grade-excluded-courses"
            description="Xóa cứng học sinh theo năm tốt nghiệp và khối, trừ các khóa học cần bảo vệ"
            methodClassName="bg-red-700"
            headerClassName="bg-red-50 hover:bg-red-100"
            pathClassName="text-red-800"
        >
            <div className="space-y-4">
                <div className="rounded-sm border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-700" />
                        <div>
                            <p className="text-sm font-semibold text-red-800">Cảnh báo xóa cứng</p>
                            <p className="mt-1 text-sm text-red-700">
                                API này xóa vĩnh viễn học sinh, user và nhiều bảng liên quan. Chỉ thực hiện khi đã kiểm tra backup, courseIds bảo vệ và phạm vi lọc.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-sm border border-border bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">Rule xử lý</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground-light">
                            {ruleItems.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-sm border border-border bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">Input và output cần đọc</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground-light">
                            {inputItems.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                            <li>Output trả về thống kê học sinh khớp điều kiện, học sinh được bảo vệ, số bản ghi đã xóa theo từng bảng và kết quả xóa avatar.</li>
                            <li>avatarFileResults cho biết file avatar nào đã xóa thành công hoặc thất bại trên MinIO.</li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        type="number"
                        label="highSchoolGraduationYear"
                        value={highSchoolGraduationYear}
                        onChange={(e) => setHighSchoolGraduationYear(e.target.value)}
                        min={1900}
                        max={2100}
                        required
                        helperText="Năm tốt nghiệp cấp 3 của học sinh cần xóa, từ 1900 đến 2100."
                    />
                    <Input
                        type="number"
                        label="grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        min={1}
                        max={12}
                        required
                        helperText="Khối lớp cần xóa, từ 1 đến 12."
                    />
                    <Input
                        label="confirmText"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        required
                        placeholder={CONFIRM_TEXT}
                        helperText={`Nhập đúng ${CONFIRM_TEXT} trước khi thực thi.`}
                    />
                </div>

                <Textarea
                    label="courseIds"
                    value={courseIdsInput}
                    onChange={(e) => setCourseIdsInput(e.target.value)}
                    required
                    rows={3}
                    maxLength={1000}
                    placeholder="Ví dụ: 101, 102, 103 hoặc [101, 102, 103]"
                    helperText="Danh sách khóa học cần bảo vệ. Học sinh đang đăng ký khóa học hoặc nằm trong lớp thuộc các khóa học này sẽ không bị xóa."
                />

                <ApiErrorAlert message={formError || error} />

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="danger" onClick={handleExecute} loading={loading} disabled={loading}>
                        <Trash2 size={14} />
                        Thực thi xóa cứng
                    </Button>
                    <Button variant="outline" onClick={clearResponse} disabled={loading}>
                        <RotateCcw size={14} />
                        Xóa phản hồi
                    </Button>
                </div>

                <ApiJsonPreview title="Body gửi lên" value={requestBody} />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Phản hồi</h2>

                {!result ? (
                    <ApiResponsePlaceholder message="Chưa có dữ liệu phản hồi. Hãy nhập năm tốt nghiệp, grade, courseIds, confirmText và bấm Thực thi xóa cứng." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
                            <MetricCard
                                label="Khớp bộ lọc"
                                value={responseData?.totalMatchedByGradeAndGraduationYear ?? 0}
                            />
                            <MetricCard
                                label="Được bảo vệ"
                                value={responseData?.protectedByCourseCount ?? 0}
                                className="border-amber-200 bg-amber-50"
                            />
                            <MetricCard label="Đủ điều kiện xóa" value={responseData?.totalCandidates ?? 0} />
                            <MetricCard
                                label="Học sinh đã xóa"
                                value={responseData?.deletedStudentsCount ?? 0}
                                className="border-red-200 bg-red-50"
                            />
                            <MetricCard
                                label="User đã xóa"
                                value={responseData?.deletedUsersCount ?? 0}
                                className="border-red-200 bg-red-50"
                            />
                            <MetricCard
                                label="Media avatar"
                                value={responseData?.deletedAvatarMediaCount ?? 0}
                                className="border-green-200 bg-green-50"
                            />
                            <MetricCard
                                label="File đã xóa"
                                value={responseData?.deletedAvatarFilesCount ?? 0}
                                className="border-green-200 bg-green-50"
                            />
                            <MetricCard
                                label="File lỗi"
                                value={responseData?.failedAvatarFilesCount ?? 0}
                                className="border-red-200 bg-red-50"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <MetricCard
                                label="Media avatar dùng chung bị bỏ qua"
                                value={responseData?.skippedSharedAvatarMediaCount ?? 0}
                                className="border-amber-200 bg-amber-50"
                            />
                            <MetricCard
                                label="Khối / năm tốt nghiệp"
                                value={`${(responseData?.grade ?? grade) || '-'} / ${(responseData?.highSchoolGraduationYear ?? highSchoolGraduationYear) || '-'}`}
                            />
                            <MetricCard
                                label="courseIds bảo vệ"
                                value={Array.isArray(responseData?.courseIds) ? responseData.courseIds.length : parsedCourseIds.courseIds.length}
                            />
                        </div>

                        <ApiJsonPreview
                            title="JSON thô"
                            value={result}
                            className="max-h-[320px] overflow-auto rounded-sm border border-gray-800 bg-gray-900 p-3 text-xs text-blue-200"
                        />

                        <div className="grid gap-4 xl:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">Thống kê xóa</p>
                                <div className="overflow-hidden rounded-sm border border-border">
                                    <Table
                                        columns={deleteCountColumns}
                                        data={deleteCountRows}
                                        loading={false}
                                        emptyMessage="Phản hồi không có deleteCounts"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">Học sinh đã xóa</p>
                                <div className="overflow-hidden rounded-sm border border-border">
                                    <Table
                                        columns={deletedStudentColumns}
                                        data={deletedStudents}
                                        loading={false}
                                        emptyMessage="Không có học sinh bị xóa"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">Kết quả xóa file avatar</p>
                            <div className="overflow-hidden rounded-sm border border-border">
                                <Table
                                    columns={avatarFileColumns}
                                    data={avatarFileResults}
                                    loading={false}
                                    emptyMessage="Không có kết quả xóa file avatar"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ApiEndpointCard>
    );
};
