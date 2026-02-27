import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Eye, Image as ImageIcon, Copy, Check, Phone } from 'lucide-react';
import { Button, Dropdown, Checkbox, Slider } from '../../../shared/components/ui';
import { LoadingOverlay } from '../../../shared/components/loading/Loading';
import { exportAttendanceImageAsync, setExportOptions, selectAttendanceExportOptions } from '../store/attendanceSlice';
import { attendanceApi } from '../../../core/api';
import PDDExample from '../../../assets/PhieuDiemDanh_example.png'
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { selectCurrentCourseClass } from '../../courseClass/store/courseClassSlice';
import {
    getHomeworkContentsByCourseAsync,
    clearByCourseHomeworkContents,
    selectByCourseHomeworkContents,
    selectHomeworkContentLoadingGetByCourse,
} from '../../homeworkContent/store/homeworkContentSlice';

const FORMAT_OPTIONS = [
    { label: 'PNG (Chất lượng cao)', value: 'png' },
    { label: 'JPEG (Kích thước nhỏ)', value: 'jpeg' },
];

const WIDTH_OPTIONS = [
    { label: '800px (Nhỏ)', value: 800 },
    { label: '1200px (Trung bình)', value: 1200 },
    { label: '1600px (Lớn)', value: 1600 },
    { label: '2000px (Rất lớn)', value: 2000 },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
}));

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - 2 + i,
    label: `${currentYear - 2 + i}`,
}));


export const AttendanceExport = ({ attendance }) => {
    const dispatch = useDispatch();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [previewBlocked, setPreviewBlocked] = useState(null); // null = not blocked, string = reason
    const [copied, setCopied] = useState(false);
    const previewBlobRef = useRef(null);
    const options = useSelector(selectAttendanceExportOptions);
    const debouncedQuality = useDebounce(options.quality, 400);

    const courseClass = useSelector(selectCurrentCourseClass);
    const byCourseHomeworkContents = useSelector(selectByCourseHomeworkContents);
    const loadingGetByCourse = useSelector(selectHomeworkContentLoadingGetByCourse);

    const homeworkDropdownOptions = [
        { value: '', label: '-- Chọn bài tập --' },
        ...byCourseHomeworkContents.map((hw) => ({
            value: hw.homeworkContentId,
            label: hw.title,
        })),
    ];

    // Fetch homework list when includeHomework is toggled on
    useEffect(() => {
        if (options.includeHomework && courseClass?.courseId && byCourseHomeworkContents.length === 0) {
            dispatch(getHomeworkContentsByCourseAsync(courseClass.courseId));
        }
        if (!options.includeHomework) {
            dispatch(clearByCourseHomeworkContents());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.includeHomework, courseClass?.courseId]);

    // Load preview whenever options change
    useEffect(() => {
        if (attendance?.attendanceId) {
            // Block preview if includeTuition but no month/year
            if (options.includeTuition && (!options.tuitionMonth || !options.tuitionYear)) {
                setPreviewBlocked('Vui lòng chọn tháng và năm để hiển thị thông tin học phí.');
                setPreviewUrl(null);
                return;
            }
            // Block preview if includeHomework but no homeworkContentId
            if (options.includeHomework && !options.homeworkContentId) {
                setPreviewBlocked('Vui lòng chọn bài tập về nhà để hiển thị phiếu.');
                setPreviewUrl(null);
                return;
            }
            setPreviewBlocked(null);
            loadPreview();
        }
        // Cleanup previous preview URL
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [
        attendance?.attendanceId,
        options.format,
        options.width,
        options.includeCourseName,
        options.includeClassName,
        options.includeStartTime,
        options.includeEndTime,
        options.includePhoto,
        options.includeStudentId,
        options.includeEmail,
        options.includeParentPhone,
        options.includeStudentPhone,
        options.includeGradeSchool,
        options.includeMarkedAt,
        options.includeNotes,
        options.includeTuition,
        options.tuitionMonth,
        options.tuitionYear,
        options.includeHomework,
        options.homeworkContentId,
        options.includeTeacherName,
        options.includeMarkerName,
        options.includeQRCode,
        debouncedQuality,
    ]);

    const loadPreview = async () => {
        if (!attendance?.attendanceId) return;

        setIsLoadingPreview(true);
        try {
            const response = await attendanceApi.exportImage(attendance.attendanceId, {
                ...options,
                mode: 'view',
            });

            const blob = response.data || response;
            const url = URL.createObjectURL(blob);
            previewBlobRef.current = blob;

            // Revoke previous URL if exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(url);
        } catch (error) {
            console.error('Error loading preview:', error);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleOptionChange = (key, value) => {
        dispatch(setExportOptions({ [key]: value }));
    };

    const handleDownload = () => {
        dispatch(exportAttendanceImageAsync({
            id: attendance.attendanceId,
            options: { ...options, mode: 'download' },
        }));
    };

    const handleViewInNewTab = () => {
        dispatch(exportAttendanceImageAsync({
            id: attendance.attendanceId,
            options: { ...options, mode: 'view' },
        }));
    };

    const handleCopyImage = async () => {
        if (!previewBlobRef.current) return;
        try {
            const mimeType = options.format === 'png' ? 'image/png' : 'image/jpeg';
            // Chrome only supports image/png for ClipboardItem; convert via canvas if needed
            let blobToCopy = previewBlobRef.current;
            if (mimeType !== 'image/png') {
                const bitmap = await createImageBitmap(blobToCopy);
                const canvas = document.createElement('canvas');
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                canvas.getContext('2d').drawImage(bitmap, 0, 0);
                blobToCopy = await new Promise((res) => canvas.toBlob(res, 'image/png'));
            }
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blobToCopy }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy image failed:', err);
        }
    };

    if (!attendance) {
        return (
            <div className="p-6 text-center text-foreground-light">
                Không có dữ liệu điểm danh
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                {/* ===== OPTIONS SECTION ===== */}
                <div className="px-6 py-4 border-b border-border bg-primary-light">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Tùy chọn xuất phiếu
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Format */}
                        <Dropdown
                            label="Định dạng ảnh"
                            value={options.format}
                            options={FORMAT_OPTIONS}
                            onChange={(value) => handleOptionChange('format', value)}
                        />

                        {/* Quality */}
                        {options.format === 'jpeg' && (
                            <Slider
                                label="Chất lượng"
                                value={options.quality}
                                min={50}
                                max={100}
                                onChange={(v) => handleOptionChange('quality', v)}
                            />
                        )}

                        {/* Width */}
                        <Dropdown
                            label="Độ rộng (px)"
                            value={options.width}
                            options={WIDTH_OPTIONS}
                            onChange={(value) => handleOptionChange('width', value)}
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">

                        <Checkbox
                            checked={options.includeCourseName}
                            onChange={(v) => handleOptionChange('includeCourseName', v)}
                            label="Tên khóa học"
                        />

                        <Checkbox
                            checked={options.includeClassName}
                            onChange={(v) => handleOptionChange('includeClassName', v)}
                            label="Tên lớp"
                        />

                        <Checkbox
                            checked={options.includeStartTime}
                            onChange={(v) => handleOptionChange('includeStartTime', v)}
                            label="Giờ bắt đầu"
                        />

                        <Checkbox
                            checked={options.includeEndTime}
                            onChange={(v) => handleOptionChange('includeEndTime', v)}
                            label="Giờ kết thúc"
                        />

                        <Checkbox
                            checked={options.includePhoto}
                            onChange={(v) => handleOptionChange('includePhoto', v)}
                            label="Ảnh học sinh"
                        />

                        <Checkbox
                            checked={options.includeStudentId}
                            onChange={(v) => handleOptionChange('includeStudentId', v)}
                            label="Mã học sinh"
                        />

                        <Checkbox
                            checked={options.includeEmail}
                            onChange={(v) => handleOptionChange('includeEmail', v)}
                            label="Email"
                        />

                        <Checkbox
                            checked={options.includeParentPhone}
                            onChange={(v) => handleOptionChange('includeParentPhone', v)}
                            label="SĐT phụ huynh"
                        />

                        <Checkbox
                            checked={options.includeStudentPhone}
                            onChange={(v) => handleOptionChange('includeStudentPhone', v)}
                            label="SĐT học sinh"
                        />

                        <Checkbox
                            checked={options.includeGradeSchool}
                            onChange={(v) => handleOptionChange('includeGradeSchool', v)}
                            label="Khối & Trường"
                        />

                        <Checkbox
                            checked={options.includeMarkedAt}
                            onChange={(v) => handleOptionChange('includeMarkedAt', v)}
                            label="Thời gian đến lớp"
                        />

                        <Checkbox
                            checked={options.includeNotes}
                            onChange={(v) => handleOptionChange('includeNotes', v)}
                            label="Ghi chú & Nhận xét"
                        />

                        {/* ===== TUITION ===== */}
                        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                            <Checkbox
                                checked={options.includeTuition}
                                onChange={(v) => handleOptionChange('includeTuition', v)}
                                label="Thông tin học phí"
                            />
                            {options.includeTuition && (
                                <>
                                    <div className="w-36">
                                        <Dropdown
                                            value={options.tuitionMonth}
                                            onChange={(v) => handleOptionChange('tuitionMonth', v)}
                                            options={MONTH_OPTIONS}
                                            placeholder="Chọn tháng"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <Dropdown
                                            value={options.tuitionYear}
                                            onChange={(v) => handleOptionChange('tuitionYear', v)}
                                            options={YEAR_OPTIONS}
                                            placeholder="Chọn năm"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ===== HOMEWORK ===== */}
                        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                            <Checkbox
                                checked={options.includeHomework}
                                onChange={(v) => {
                                    handleOptionChange('includeHomework', v);
                                    if (!v) handleOptionChange('homeworkContentId', null);
                                }}
                                label="Thông tin bài tập về nhà"
                                disabled={!courseClass}
                            />
                            {options.includeHomework && (
                                <div className="w-64">
                                    <Dropdown
                                        value={options.homeworkContentId ?? ''}
                                        onChange={(v) => handleOptionChange('homeworkContentId', v || null)}
                                        options={homeworkDropdownOptions}
                                        placeholder={loadingGetByCourse ? 'Đang tải...' : 'Chọn bài tập'}
                                        disabled={loadingGetByCourse}
                                    />
                                </div>
                            )}
                        </div>

                        <Checkbox
                            checked={options.includeTeacherName}
                            onChange={(v) => handleOptionChange('includeTeacherName', v)}
                            label="Giáo viên giảng dạy"
                        />

                        <Checkbox
                            checked={options.includeMarkerName}
                            onChange={(v) => handleOptionChange('includeMarkerName', v)}
                            label="Người điểm danh"
                        />

                        <Checkbox
                            checked={options.includeQRCode}
                            onChange={(v) => handleOptionChange('includeQRCode', v)}
                            label="QR Code"
                        />
                    </div>


                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleDownload}
                            icon={Download}
                        >
                            Tải xuống
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleViewInNewTab}
                            icon={Eye}
                        >
                            Xem tab mới
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyImage}
                            disabled={!previewUrl || isLoadingPreview}
                            icon={copied ? Check : Copy}
                            className={copied ? 'text-green-600 border-green-600' : ''}
                        >
                            {copied ? 'Đã copy!' : 'Copy ảnh'}
                        </Button>
                    </div>
                </div>

                {/* ===== PREVIEW SECTION ===== */}
                <div className="px-6 py-4 relative">
                    <h3 className="font-semibold text-foreground mb-3">
                        Xem trước phiếu điểm danh
                    </h3>

                    {/* Phone numbers for quick copy */}
                    {(attendance.student?.studentPhone || attendance.student?.parentPhone) && (
                        <div className="mb-4 flex flex-wrap gap-3">
                            {attendance.student?.studentPhone && (
                                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-1.5">
                                    <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="text-xs text-foreground-light">HS:</span>
                                    <span
                                        className="text-sm font-medium text-blue-700 cursor-pointer select-all"
                                        title="Click để chọn"
                                    >
                                        {attendance.student.studentPhone}
                                    </span>
                                </div>
                            )}
                            {attendance.student?.parentPhone && (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-1.5">
                                    <Phone className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                    <span className="text-xs text-foreground-light">PH:</span>
                                    <span
                                        className="text-sm font-medium text-green-700 cursor-pointer select-all"
                                        title="Click để chọn"
                                    >
                                        {attendance.student.parentPhone}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="relative bg-gray-50 rounded-sm border border-border overflow-hidden min-h-[600px] flex items-center justify-center">

                        {/* Ảnh preview thật */}
                        {previewUrl && !isLoadingPreview && !previewBlocked && (
                            <img
                                src={previewUrl}
                                alt="Preview phiếu điểm danh"
                                className="relative w-full h-auto z-10"
                            />
                        )}

                        {/* Overlay loading */}
                        {isLoadingPreview && (
                            <>
                                <img
                                    src={PDDExample}
                                    alt="Phiếu điểm danh mẫu"
                                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300`}
                                />
                                <LoadingOverlay message="Đang tải xem trước..." />
                            </>
                        )}

                        {/* Blocked: cần chọn thêm thông tin */}
                        {!isLoadingPreview && previewBlocked && (
                            <p className="relative z-10 text-sm text-amber-600 font-medium px-6 text-center">
                                ⚠️ {previewBlocked}
                            </p>
                        )}

                        {/* Fallback khi không có preview */}
                        {!isLoadingPreview && !previewBlocked && !previewUrl && (
                            <p className="relative z-10 text-foreground-light">
                                Không thể tải xem trước
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
