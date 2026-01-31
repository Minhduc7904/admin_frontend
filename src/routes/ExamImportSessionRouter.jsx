import { Outlet } from 'react-router-dom';
import { ExamImportSessionLayout } from '../features/examImportSession/layouts/ExamImportSessionLayout';
import { ExamImportSessionDetail } from '../features/examImportSession/pages/ExamImportSessionDetail';
import { UploadPdfExtraction } from '../features/examImportSession/pages/UploadPdfExtraction';
import { ROUTES } from '../core/constants';

export const examImportSessionRouter = [
    {
        path: ROUTES.EXAM_IMPORT_SESSION_DETAIL(),
        element: (
            <ExamImportSessionLayout>
                <Outlet />
            </ExamImportSessionLayout>
        ),
        children: [
            {
                index: true,
                element: <ExamImportSessionDetail />,
            },
            {
                path: 'upload',
                element: <UploadPdfExtraction />,
            },
        ],
    },
];
