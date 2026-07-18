import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';

import {
    Modal,
    Button,
    Checkbox,
} from '../../../shared/components/ui';

import {
    selectClassStudentExportExcelOptions,
    setClassStudentExportExcelOptions,
} from '../store/classStudentSlice';

export const ExportClassStudentExcelModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    classId,
}) => {
    const dispatch = useDispatch();
    const exportOptions = useSelector(selectClassStudentExportExcelOptions);

    useEffect(() => {
        if (!isOpen) return;

        dispatch(setClassStudentExportExcelOptions({ classId: classId || '' }));
    }, [classId, dispatch, isOpen]);

    const handleCheckboxChange = (field) => (checked) => {
        dispatch(setClassStudentExportExcelOptions({ [field]: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(exportOptions);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="xl"
            title="Xuất danh sách học sinh trong lớp"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6 mb-6">
                    <div className="bg-white border border-border rounded-sm p-4 space-y-4">
                        <p className="text-sm font-medium text-foreground">
                            Bộ lọc dữ liệu
                        </p>

                        <div className="text-sm text-foreground-light">
                            File Excel sẽ xuất danh sách học sinh đang hoạt động của lớp #{classId}.
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Chọn các trường cần xuất
                        </label>

                        <div className="bg-background rounded-sm border border-border p-4 space-y-4">
                            <p className="text-xs text-foreground-light">
                                <strong>Mặc định:</strong> thông tin lớp, khóa học và các cột học sinh cơ bản.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Checkbox
                                    id="classStudentIncludeStudentPhone"
                                    label="SĐT học sinh"
                                    checked={exportOptions.includeStudentPhone}
                                    onChange={handleCheckboxChange('includeStudentPhone')}
                                />
                                <Checkbox
                                    id="classStudentIncludeParentPhone"
                                    label="SĐT phụ huynh"
                                    checked={exportOptions.includeParentPhone}
                                    onChange={handleCheckboxChange('includeParentPhone')}
                                />
                                <Checkbox
                                    id="classStudentIncludeSchool"
                                    label="Trường"
                                    checked={exportOptions.includeSchool}
                                    onChange={handleCheckboxChange('includeSchool')}
                                />
                                <Checkbox
                                    id="classStudentIncludeGender"
                                    label="Giới tính"
                                    checked={exportOptions.includeGender}
                                    onChange={handleCheckboxChange('includeGender')}
                                />
                                <Checkbox
                                    id="classStudentIncludeDateOfBirth"
                                    label="Ngày sinh"
                                    checked={exportOptions.includeDateOfBirth}
                                    onChange={handleCheckboxChange('includeDateOfBirth')}
                                />
                                <Checkbox
                                    id="classStudentIncludeEmail"
                                    label="Email"
                                    checked={exportOptions.includeEmail}
                                    onChange={handleCheckboxChange('includeEmail')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>

                    <Button type="submit" loading={loading} disabled={loading || !classId}>
                        <Download size={16} />
                        Xuất Excel
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
