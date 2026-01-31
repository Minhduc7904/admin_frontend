import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ExamImportSessionSidebar } from '../components/ExamImportSessionSidebar';
import { ExamImportSessionHeader } from '../components/ExamImportSessionHeader';
import {
    getExamImportSessionByIdAsync,
    selectCurrentExamImportSession,
    selectExamImportSessionLoadingGet,
    clearCurrentSession,
} from '../store/examImportSessionSlice';

export const ExamImportSessionLayout = ({ children }) => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const session = useSelector(selectCurrentExamImportSession);
    const loading = useSelector(selectExamImportSessionLoadingGet);

    useEffect(() => {
        if (id) {
            dispatch(getExamImportSessionByIdAsync(id));
        }

        return () => {
            dispatch(clearCurrentSession());
        };
    }, [id, dispatch]);

    return (
        <div className="min-h-screen bg-primary-dark">
            {/* Header */}
            <ExamImportSessionHeader session={session} loading={loading} />

            <div className="flex h-[calc(100vh-73.5px)]">
                {/* Sidebar */}
                <ExamImportSessionSidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6 h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
