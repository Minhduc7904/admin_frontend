import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getSectionsByExamAsync,
    clearSections,
} from '../store/sectionSlice';
import {
    getQuestionsByExamAsync,
    clearCurrentQuestion,
} from '../../question/store/questionSlice';
import { ExamSectionTabs } from '../components/ExamSectionTabs';
import { ExamSectionDetail } from '../components/ExamSectionDetail';
import { ExamQuestionsList } from '../components/ExamQuestionsList';

export const ExamQuestions = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Active tab state: null = uncategorized, number = sectionId
    const [activeTab, setActiveTab] = useState(null);

    // Selectors
    const sections = useSelector((state) => state.section.sections);
    const sectionsLoading = useSelector((state) => state.section.loadingGet);
    const questions = useSelector((state) => state.question.questions);
    const questionsLoading = useSelector((state) => state.question.loadingGet);

    // Load sections and questions when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getSectionsByExamAsync(id));
            dispatch(getQuestionsByExamAsync({ examId: id, params: { limit: 1000 } }));
        }
        return () => {
            dispatch(clearSections());
            dispatch(clearCurrentQuestion());
        };
    }, [id, dispatch]);

    // Sort sections by order
    const sortedSections = useMemo(() => {
        if (!sections) return [];
        return [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [sections]);

    // Filter questions by active tab
    const filteredQuestions = useMemo(() => {
        if (!questions) return [];

        // Note: Backend doesn't return sectionId in question response yet
        // For now, show all questions in uncategorized tab
        // TODO: Update backend to include sectionId in question response
        if (activeTab === null) {
            // Uncategorized: all questions for now
            return questions;
        } else {
            // Questions belonging to selected section
            // TODO: Filter by sectionId when backend supports it
            return questions.filter(q => q.sectionId === activeTab);
        }
    }, [questions, activeTab]);

    // Get current section object
    const currentSection = useMemo(() => {
        if (activeTab === null) return null;
        return sortedSections.find(s => s.sectionId === activeTab);
    }, [sortedSections, activeTab]);

    const handleTabChange = (sectionId) => {
        setActiveTab(sectionId);
    };

    const isLoading = sectionsLoading || questionsLoading;

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
                {/* Left Panel - Section Details & Questions */}
                <div className="flex flex-col gap-4 min-h-0">
                    {/* Section Tabs */}
                    <ExamSectionTabs
                        sections={sortedSections}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto bg-primary border border-border rounded-lg p-4 min-h-0">
                        <div className="flex flex-col gap-6">
                            <ExamSectionDetail
                                section={currentSection}
                                questionsCount={filteredQuestions.length}
                            />

                            <ExamQuestionsList
                                questions={filteredQuestions}
                                loading={isLoading}
                                sectionTitle={currentSection?.title}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - All Questions */}
                <div className="flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto bg-primary border border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Tất cả câu hỏi
                        </h3>
                        <ExamQuestionsList
                            questions={questions}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
