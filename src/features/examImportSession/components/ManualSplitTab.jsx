import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Scissors, ChevronDown, ChevronRight, FileText, ListChecks, ToggleLeft, AlignLeft } from 'lucide-react';
import { Button } from '../../../shared/components/ui';
import { CustomContentInput } from './CustomContentInput';
import { SessionContentPreview } from './SessionContentPreview';
import { manualSplitAsync } from '../store/examImportSessionSlice';

const MANUAL_SECTIONS = [
    {
        id: 'trac-nghiem',
        questionType: 'SINGLE_CHOICE',
        label: 'Phần 1: Trắc nghiệm',
        description: 'Câu hỏi trắc nghiệm một đáp án đúng',
        icon: ListChecks,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
    {
        id: 'dung-sai',
        questionType: 'TRUE_FALSE',
        label: 'Phần 2: Đúng sai',
        description: 'Câu hỏi đúng / sai nhiều ý',
        icon: ToggleLeft,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
    },
    {
        id: 'tra-loi-ngan',
        questionType: 'SHORT_ANSWER',
        label: 'Phần 3: Trả lời ngắn',
        description: 'Câu hỏi điền khuyết / trả lời ngắn',
        icon: AlignLeft,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
    },
];

const AccordionHeader = ({ title, description, icon: Icon, iconClass, isOpen, onClick, disabled, hasErrors, errorCount }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
            w-full flex items-center gap-3 px-4 py-3 text-left transition
            hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed
        `}
    >
        <div className={`p-1.5 rounded-md bg-zinc-100 ${iconClass}`}>
            <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-foreground-light truncate">{description}</p>
        </div>
        {hasErrors && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold
                             bg-red-100 text-red-600 rounded-full border border-red-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                {errorCount} lỗi
            </span>
        )}
        {isOpen
            ? <ChevronDown size={16} className="text-foreground-light shrink-0" />
            : <ChevronRight size={16} className="text-foreground-light shrink-0" />
        }
    </button>
);

export const ManualSplitTab = ({
    sessionId,
    sessionRawContentData,
    sessionRawContentLoading,
    onSplitSuccess,
    loading: externalLoading,
}) => {
    const dispatch = useDispatch();
    const [openSections, setOpenSections] = useState({ session: true });
    const [contents, setContents] = useState({
        'trac-nghiem': '',
        'dung-sai': '',
        'tra-loi-ngan': '',
    });
    const [answers, setAnswers] = useState({
        'trac-nghiem': '',
        'dung-sai': '',
        'tra-loi-ngan': '',
    });
    // Per-section loading state
    const [loadingSections, setLoadingSections] = useState({
        'trac-nghiem': false,
        'dung-sai': false,
        'tra-loi-ngan': false,
    });
    // Per-section parse errors: { [sectionId]: [{ line, message }] }
    const [sectionErrors, setSectionErrors] = useState({
        'trac-nghiem': [],
        'dung-sai': [],
        'tra-loi-ngan': [],
    });

    const toggleSection = (id) => {
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSplitSection = useCallback(async (section) => {
        const content = contents[section.id];
        if (!content?.trim()) return;

        setLoadingSections((prev) => ({ ...prev, [section.id]: true }));
        // Clear previous errors for this section before new attempt
        setSectionErrors((prev) => ({ ...prev, [section.id]: [] }));

        try {
            const result = await dispatch(manualSplitAsync({
                sessionId,
                rawContent: content,
                questionType: section.questionType,
                answers: answers[section.id] || undefined,
            })).unwrap();

            // unwrap() resolves for both success:true and success:false (we return body in both)
            if (result?.data?.hasParseErrors && result.data.parseErrors?.length > 0) {
                // Map API parseErrors { lineIndex (0-based), message } → { line (1-based), message }
                const mapped = result.data.parseErrors.map((e) => ({
                    line: (e.lineIndex ?? 0) + 1,
                    message: e.message || '',
                }));
                setSectionErrors((prev) => ({ ...prev, [section.id]: mapped }));
            } else {
                // Success with no parse errors → reload session questions
                setSectionErrors((prev) => ({ ...prev, [section.id]: [] }));
                onSplitSuccess?.();
                setContents((prev) => ({ ...prev, [section.id]: '' }));
                setAnswers((prev) => ({ ...prev, [section.id]: '' }));
            }
        } catch {
            // Network/server errors are already handled by the thunk (notification shown)
        } finally {
            setLoadingSections((prev) => ({ ...prev, [section.id]: false }));
        }
    }, [sessionId, contents, answers, dispatch, onSplitSuccess]);

    const isReadyToSplit = (sectionId) => {
        const content = contents[sectionId];
        return content && content.trim().length > 0 && content.length <= 15000;
    };

    return (
        <div className="space-y-3">
            {/* Section 0: Nội dung từ Session (read-only reference) */}
            <div className="border border-border rounded-lg overflow-hidden">
                <AccordionHeader
                    title="Phần 0: Nội dung từ Session"
                    description="Tham khảo nội dung trích xuất từ PDF"
                    icon={FileText}
                    iconClass="text-zinc-600"
                    isOpen={!!openSections['session']}
                    onClick={() => toggleSection('session')}
                />
                {openSections['session'] && (
                    <div className="px-4 pb-4 pt-1 border-t border-border bg-zinc-50/50">
                        <SessionContentPreview
                            rawContentData={sessionRawContentData}
                            isLoading={sessionRawContentLoading}
                        />
                    </div>
                )}
            </div>

            {/* Sections 1–3: Manual content input + split button */}
            {MANUAL_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isOpen = !!openSections[section.id];
                const content = contents[section.id];
                const isSectionLoading = loadingSections[section.id];
                const parseErrors = sectionErrors[section.id];
                const hasErrors = parseErrors.length > 0;

                return (
                    <div
                        key={section.id}
                        className={`border rounded-lg overflow-hidden transition-colors ${hasErrors ? 'border-red-300' : 'border-border'
                            }`}
                    >
                        <AccordionHeader
                            title={section.label}
                            description={section.description}
                            icon={Icon}
                            iconClass={section.color}
                            isOpen={isOpen}
                            onClick={() => toggleSection(section.id)}
                            disabled={isSectionLoading || externalLoading}
                            hasErrors={hasErrors}
                            errorCount={parseErrors.length}
                        />
                        {isOpen && (
                            <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                                {/* Content Input */}
                                <CustomContentInput
                                    value={content}
                                    onChange={(val) => {
                                        setContents((prev) => ({ ...prev, [section.id]: val }));
                                        // Clear errors when user edits
                                        if (sectionErrors[section.id].length > 0) {
                                            setSectionErrors((prev) => ({ ...prev, [section.id]: [] }));
                                        }
                                    }}
                                    disabled={isSectionLoading || externalLoading}
                                    sectionType={section.id}
                                    rowErrors={parseErrors}
                                    answerValue={answers[section.id]}
                                    onAnswerChange={(val) =>
                                        setAnswers((prev) => ({ ...prev, [section.id]: val }))
                                    }
                                />

                                {/* Split button */}
                                <Button
                                    onClick={() => handleSplitSection(section)}
                                    disabled={isSectionLoading || externalLoading || !isReadyToSplit(section.id)}
                                    variant="primary"
                                    className="w-full"
                                >
                                    {isSectionLoading ? (
                                        <>
                                            <Scissors size={16} className="animate-pulse" />
                                            Đang tách...
                                        </>
                                    ) : (
                                        <>
                                            <Scissors size={16} />
                                            Tách {section.label}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
