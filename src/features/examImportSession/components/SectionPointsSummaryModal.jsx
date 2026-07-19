import { useMemo, useState } from 'react';
import { Calculator, PencilLine } from 'lucide-react';
import { Button, Input, Modal } from '../../../shared/components/ui';

const pointLabel = (points) => points == null ? 'Chưa đặt điểm' : `${points} điểm`;

export const SectionPointsSummaryModal = ({ isOpen, onClose, questions = [], onUpdateSectionPoints, loading = false }) => {
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [pointsOrigin, setPointsOrigin] = useState('');
    const [error, setError] = useState('');

    const sections = useMemo(() => {
        const groups = new Map();
        questions.forEach((question) => {
            const sectionId = question.tempSection?.tempSectionId ?? question.tempSectionId;
            if (!sectionId) return;
            const section = question.tempSection ?? {};
            if (!groups.has(sectionId)) {
                groups.set(sectionId, {
                    tempSectionId: sectionId,
                    title: section.title || `Section #${sectionId}`,
                    questions: [],
                });
            }
            groups.get(sectionId).questions.push(question);
        });

        return [...groups.values()].map((section) => {
            const pointGroups = new Map();
            section.questions.forEach((question) => {
                const key = question.pointsOrigin == null ? 'empty' : String(question.pointsOrigin);
                if (!pointGroups.has(key)) pointGroups.set(key, { points: question.pointsOrigin, count: 0 });
                pointGroups.get(key).count += 1;
            });
            const totalPoints = section.questions.reduce((total, question) => total + Number(question.pointsOrigin ?? 0), 0);
            return { ...section, pointGroups: [...pointGroups.values()], totalPoints };
        });
    }, [questions]);

    const openEditor = (section) => {
        const uniquePoints = section.pointGroups.length === 1 ? section.pointGroups[0].points : '';
        setEditingSectionId(section.tempSectionId);
        setPointsOrigin(uniquePoints == null ? '' : String(uniquePoints));
        setError('');
    };

    const handleUpdate = async (section) => {
        const nextPoints = Number(pointsOrigin);
        if (pointsOrigin === '' || !Number.isFinite(nextPoints) || nextPoints < 0) {
            setError('Điểm phải là số lớn hơn hoặc bằng 0.');
            return;
        }
        try {
            await onUpdateSectionPoints?.({ tempSectionId: section.tempSectionId, pointsOrigin: nextPoints });
            setEditingSectionId(null);
            setPointsOrigin('');
            setError('');
        } catch {
            // Thunk displays the API error notification.
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Điểm theo section" size="3xl">
            <div className="space-y-4">
                <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                    <Calculator className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>Mỗi section có thể đang chứa nhiều mức điểm. Chọn “Đặt điểm chung” để áp dụng một mức điểm mới cho toàn bộ câu hỏi trong section đó.</p>
                </div>

                {sections.length === 0 ? (
                    <p className="py-8 text-center text-sm text-foreground-light">Chưa có câu hỏi nào được gắn vào section.</p>
                ) : sections.map((section) => (
                    <section key={section.tempSectionId} className="rounded-xl border border-border bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h3 className="font-semibold text-foreground">{section.title}</h3>
                                <p className="mt-1 text-sm text-foreground-light">{section.questions.length} câu hỏi · Tổng {section.totalPoints} điểm</p>
                            </div>
                            <Button type="button" size="sm" variant="outline" onClick={() => openEditor(section)} disabled={loading}>
                                <PencilLine className="h-4 w-4" /> Đặt điểm chung
                            </Button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {section.pointGroups.map((group) => <span key={`${section.tempSectionId}-${group.points ?? 'empty'}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{group.count} câu · {pointLabel(group.points)}</span>)}
                        </div>

                        {editingSectionId === section.tempSectionId && (
                            <div className="mt-4 grid gap-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
                                <Input
                                    label="Điểm áp dụng cho toàn bộ câu hỏi"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={pointsOrigin}
                                    error={error}
                                    onChange={(event) => { setPointsOrigin(event.target.value); setError(''); }}
                                    helperText="Có thể nhập 0."
                                />
                                <Button type="button" onClick={() => handleUpdate(section)} loading={loading} disabled={loading}>Lưu điểm</Button>
                                <Button type="button" variant="outline" onClick={() => setEditingSectionId(null)} disabled={loading}>Hủy</Button>
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </Modal>
    );
};
