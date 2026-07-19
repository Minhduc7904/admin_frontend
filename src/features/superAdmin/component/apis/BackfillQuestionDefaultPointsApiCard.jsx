import { useMemo, useState } from 'react';
import { Coins, RotateCcw } from 'lucide-react';
import { Button } from '../../../../shared/components/ui';
import { useBackfillQuestionDefaultPoints } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

const POINT_RULES = [
    { label: 'SINGLE_CHOICE', points: '0.25 điểm', key: 'singleChoiceUpdated' },
    { label: 'MULTIPLE_CHOICE', points: '0.25 điểm', key: 'multipleChoiceUpdated' },
    { label: 'TRUE_FALSE', points: '1 điểm', key: 'trueFalseUpdated' },
    { label: 'SHORT_ANSWER', points: '0.5 điểm', key: 'shortAnswerUpdated' },
];

export const BackfillQuestionDefaultPointsApiCard = () => {
    const { loading, error, result, backfillQuestionDefaultPoints, clearState } = useBackfillQuestionDefaultPoints();
    const [isOpen, setIsOpen] = useState(false);
    const requestBody = useMemo(() => ({}), []);
    const responseData = result?.data || result;

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((previous) => !previous)}
            method="POST"
            path="/super-admin/questions/backfill-default-points"
            description="Điền điểm mặc định cho các câu hỏi chưa có điểm"
            methodClassName="bg-amber-600"
            headerClassName="bg-amber-50 hover:bg-amber-100"
            pathClassName="text-amber-800"
        >
            <div className="space-y-4">
                <ApiErrorAlert message={error} />
                <div className="rounded-sm border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    Chỉ cập nhật câu hỏi có điểm <code>NULL</code> hoặc <code>0</code>; giữ nguyên điểm khác 0 và không thay đổi câu tự luận <code>ESSAY</code>.
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                    {POINT_RULES.map((rule) => <div key={rule.key} className="rounded-sm border border-border bg-gray-50 p-3"><p className="font-semibold text-foreground">{rule.label}</p><p className="mt-1 text-foreground-light">{rule.points}</p></div>)}
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={backfillQuestionDefaultPoints} loading={loading} disabled={loading}>
                        <Coins size={14} /> Cập nhật điểm mặc định
                    </Button>
                    <Button variant="outline" onClick={clearState} disabled={loading}>
                        <RotateCcw size={14} /> Clear Response
                    </Button>
                </div>
                <ApiJsonPreview title="Request body" value={requestBody} />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Response</h2>
                {!result ? <ApiResponsePlaceholder message="Chưa có dữ liệu phản hồi. Hãy bấm Cập nhật điểm mặc định." /> : <>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-3"><p className="text-xs text-emerald-700">Tổng cập nhật</p><p className="mt-1 text-lg font-semibold text-emerald-700">{responseData?.totalUpdated ?? 0}</p></div>
                        {POINT_RULES.map((rule) => <div key={rule.key} className="rounded-sm border border-border bg-gray-50 p-3"><p className="text-xs text-foreground-light">{rule.label}</p><p className="mt-1 text-lg font-semibold text-foreground">{responseData?.[rule.key] ?? 0}</p></div>)}
                    </div>
                    <ApiJsonPreview title="Raw JSON" value={result} className="max-h-[320px] overflow-auto rounded-sm border border-gray-800 bg-gray-900 p-3 text-xs text-blue-200" />
                </>}
            </div>
        </ApiEndpointCard>
    );
};
