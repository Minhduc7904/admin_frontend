import { Eye, Edit, Trash2, FileText } from 'lucide-react';
import { useState, useRef } from 'react';
import { ActionMenu, Table } from '../../../shared/components/ui';
import {
    getQuestionTypeLabel,
    getQuestionTypeColor,
    getDifficultyLabel,
    getDifficultyColor
} from '../../../core/constants/question-constants';
import { VISIBILITY, VISIBILITY_LABELS } from '../../../core/constants';
import { QuestionContentTooltip } from './QuestionContentTooltip';

export const QuestionTable = ({ questions, onView, onEdit, onDelete, loading, isViewPanelOpen }) => {
    const [hoveredQuestion, setHoveredQuestion] = useState(null);
    const contentRefsMap = useRef(new Map());
    const getVisibilityBadge = (visibility) => {
        const badges = {
            [VISIBILITY.DRAFT]: {
                label: VISIBILITY_LABELS[VISIBILITY.DRAFT],
                className: 'bg-gray-100 text-gray-700'
            },
            [VISIBILITY.PUBLISHED]: {
                label: VISIBILITY_LABELS[VISIBILITY.PUBLISHED],
                className: 'bg-green-100 text-green-700'
            },
            [VISIBILITY.PRIVATE]: {
                label: VISIBILITY_LABELS[VISIBILITY.PRIVATE],
                className: 'bg-yellow-100 text-yellow-700'
            },
        };

        const badge = badges[visibility] || badges[VISIBILITY.DRAFT];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                {badge.label}
            </span>
        );
    };

    const getDifficultyBadge = (difficulty) => {
        if (!difficulty) return <span className="italic text-foreground-lighter">-</span>;

        const colors = getDifficultyColor(difficulty);
        const label = getDifficultyLabel(difficulty);

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                {label}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const colors = getQuestionTypeColor(type);
        const label = getQuestionTypeLabel(type);

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                {label}
            </span>
        );
    };

    const columns = [
        {
            key: 'questionId',
            label: 'ID',
            render: (question) => (
                <span className="text-sm text-foreground-light">#{question.questionId}</span>
            )
        },
        {
            key: 'content',
            label: 'Nội dung câu hỏi',
            render: (question) => {
                const MAX_CONTENT = 120
                const MAX_SOLUTION = 80

                const content =
                    question.content?.length > MAX_CONTENT
                        ? question.content.slice(0, MAX_CONTENT) + '…'
                        : question.content

                const solution =
                    question.solution?.length > MAX_SOLUTION
                        ? question.solution.slice(0, MAX_SOLUTION) + '…'
                        : question.solution

                return (
                    <div 
                        className="flex flex-col max-w-md"
                        ref={(el) => {
                            if (el) {
                                contentRefsMap.current.set(question.questionId, el);
                            } else {
                                contentRefsMap.current.delete(question.questionId);
                            }
                        }}
                    >
                        <span className="text-sm font-semibold text-foreground cursor-help">
                            {content}
                        </span>

                        {solution && (
                            <span className="text-xs text-foreground-lighter">
                                Lời giải: {solution}
                            </span>
                        )}
                    </div>
                )
            },
        },
        {
            key: 'type',
            label: 'Loại',
            render: (question) => getTypeBadge(question.type)
        },
        {
            key: 'subject',
            label: 'Môn học',
            render: (question) => (
                <div className="text-sm text-foreground-light">
                    {question.subjectName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            )
        },
        {
            key: 'grade',
            label: 'Khối',
            render: (question) => (
                question.grade ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Khối {question.grade}
                    </span>
                ) : (
                    <span className="italic text-foreground-lighter">-</span>
                )
            )
        },
        {
            key: 'difficulty',
            label: 'Độ khó',
            render: (question) => getDifficultyBadge(question.difficulty)
        },
        {
            key: 'pointsOrigin',
            label: 'Điểm',
            render: (question) => (
                <div className="text-sm text-foreground">
                    {question.pointsOrigin || <span className="italic text-foreground-lighter">-</span>}
                </div>
            )
        },
        {
            key: 'visibility',
            label: 'Trạng thái',
            render: (question) => getVisibilityBadge(question.visibility)
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (question) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Xem chi tiết',
                            icon: <Eye size={14} />,
                            onClick: () => onView(question),
                        },
                        {
                            label: 'Chỉnh sửa',
                            icon: <Edit size={14} />,
                            onClick: () => onEdit(question),
                        },
                        {
                            label: 'Xóa câu hỏi',
                            icon: <Trash2 size={14} />,
                            variant: 'danger',
                            onClick: () => onDelete(question),
                        },
                    ]}
                />
            )
        }
    ];

    return (
        <>
            <Table 
                columns={columns} 
                data={questions} 
                loading={loading}
                onRowClick={(question) => onView(question)}
                onRowMouseEnter={(question) => setHoveredQuestion(question.questionId)}
                onRowMouseLeave={() => setHoveredQuestion(null)}
            />
            {!isViewPanelOpen && hoveredQuestion && questions.find(q => q.questionId === hoveredQuestion) && (
                <QuestionContentTooltip
                    question={questions.find(q => q.questionId === hoveredQuestion)}
                    triggerRef={{ current: contentRefsMap.current.get(hoveredQuestion) }}
                    isVisible={true}
                />
            )}
        </>
    );
};
