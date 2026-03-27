import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Input, RightPanel } from '../../../shared/components';
import {
    selectCompetitionSubmitLoadingUpdate,
    updateCompetitionSubmitAsync,
} from '../store/competitionSubmitSlice';
import { toVNDateTimeLocal, vnDateTimeLocalToISO } from '../../../shared/utils';

const STATUS_OPTIONS = [
    { value: '', label: 'Chọn trạng thái' },
    { value: 'IN_PROGRESS', label: 'Đang làm' },
    { value: 'SUBMITTED', label: 'Đã nộp' },
];

const toNumberOrUndefined = (value) => {
    if (value === '' || value == null) return undefined;

    const normalized = String(value).trim().replace(',', '.');
    // Accept formats like 10, 10.5, 10,5
    if (!/^\d+(\.\d+)?$/.test(normalized)) return undefined;

    const num = Number(normalized);
    return Number.isNaN(num) ? undefined : num;
};

export const EditCompetitionSubmitPanel = ({ isOpen, submit, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const loadingUpdate = useSelector(selectCompetitionSubmitLoadingUpdate);

    const submitId = useMemo(
        () => submit?.competitionSubmitId ?? submit?.submitId,
        [submit],
    );

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        status: '',
        submittedAt: '',
        totalPoints: '',
        maxPoints: '',
    });

    useEffect(() => {
        if (!isOpen || !submit) return;

        setFormData({
            status: submit.status || '',
            submittedAt: toVNDateTimeLocal(submit.submittedAt),
            totalPoints: submit.totalPoints ?? '',
            maxPoints: submit.maxPoints ?? '',
        });
        setErrors({});
    }, [isOpen, submit]);

    const validate = () => {
        const nextErrors = {};

        if (!formData.status) {
            nextErrors.status = 'Trạng thái không được để trống';
        }

        const totalPoints = toNumberOrUndefined(formData.totalPoints);
        const maxPoints = toNumberOrUndefined(formData.maxPoints);

        if (formData.totalPoints !== '' && totalPoints == null) {
            nextErrors.totalPoints = 'Tổng điểm không hợp lệ (ví dụ: 0.25 hoặc 0,25)';
        } else if (totalPoints != null && totalPoints < 0) {
            nextErrors.totalPoints = 'Tổng điểm phải là số >= 0';
        }

        if (formData.maxPoints !== '' && maxPoints == null) {
            nextErrors.maxPoints = 'Điểm tối đa không hợp lệ (ví dụ: 10 hoặc 10,5)';
        } else if (maxPoints != null && maxPoints < 0) {
            nextErrors.maxPoints = 'Điểm tối đa phải là số >= 0';
        }

        if (totalPoints != null && maxPoints != null && totalPoints > maxPoints) {
            nextErrors.totalPoints = 'Tổng điểm không được lớn hơn điểm tối đa';
        }

        if (formData.submittedAt && !vnDateTimeLocalToISO(formData.submittedAt)) {
            nextErrors.submittedAt = 'Thời gian nộp bài không hợp lệ';
        }

        return nextErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submitId) return;

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            // Chỉ cho phép cập nhật các trường theo yêu cầu API.
            status: formData.status,
            submittedAt: vnDateTimeLocalToISO(formData.submittedAt),
            totalPoints: toNumberOrUndefined(formData.totalPoints),
            maxPoints: toNumberOrUndefined(formData.maxPoints),
        };

        try {
            await dispatch(updateCompetitionSubmitAsync({ id: submitId, data: payload })).unwrap();
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.error('Error updating competition submit:', err);
        }
    };

    return (
        <RightPanel
            isOpen={isOpen}
            onClose={onClose}
            title={submitId ? `Chỉnh sửa bài nộp #${submitId}` : 'Chỉnh sửa bài nộp'}
            width="w-[560px]"
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
                    <Dropdown
                        label="Trạng thái"
                        required
                        value={formData.status}
                        onChange={(value) => {
                            setFormData((prev) => ({ ...prev, status: value }));
                            if (errors.status) setErrors((prev) => ({ ...prev, status: null }));
                        }}
                        options={STATUS_OPTIONS}
                        error={errors.status}
                    />

                    <Input
                        label="Thời gian nộp bài"
                        name="submittedAt"
                        type="datetime-local"
                        value={formData.submittedAt}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, submittedAt: e.target.value }));
                            if (errors.submittedAt) setErrors((prev) => ({ ...prev, submittedAt: null }));
                        }}
                        error={errors.submittedAt}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Tổng điểm"
                            name="totalPoints"
                            type="text"
                            value={formData.totalPoints}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, totalPoints: e.target.value }));
                                if (errors.totalPoints) setErrors((prev) => ({ ...prev, totalPoints: null }));
                            }}
                            error={errors.totalPoints}
                            placeholder="VD: 8.5 hoặc 8,5"
                        />

                        <Input
                            label="Điểm tối đa"
                            name="maxPoints"
                            type="text"
                            value={formData.maxPoints}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, maxPoints: e.target.value }));
                                if (errors.maxPoints) setErrors((prev) => ({ ...prev, maxPoints: null }));
                            }}
                            error={errors.maxPoints}
                            placeholder="VD: 10"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loadingUpdate}>
                        Hủy
                    </Button>
                    <Button type="submit" loading={loadingUpdate}>
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </RightPanel>
    );
};
