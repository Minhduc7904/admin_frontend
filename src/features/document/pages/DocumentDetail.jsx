import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { InlineLoading } from '../../../shared/components';
import { Button } from '../../../shared/components/ui';
import { DocumentDetailContent } from '../components';
import {
    clearCurrentDocument,
    getDocumentByIdAsync,
    selectCurrentDocument,
    selectDocumentLoadingGet,
} from '../store/documentSlice';

export const DocumentDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const document = useSelector(selectCurrentDocument);
    const loading = useSelector(selectDocumentLoadingGet);

    useEffect(() => {
        dispatch(getDocumentByIdAsync(id));
        return () => dispatch(clearCurrentDocument());
    }, [dispatch, id]);

    if (loading && !document) {
        return <InlineLoading message="Đang tải tài liệu..." />;
    }

    if (!document) {
        return <div className="text-sm text-foreground-light">Không tìm thấy tài liệu.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(ROUTES.DOCUMENTS)}>
                    <ArrowLeft size={16} />
                    Quay lại
                </Button>
                <Button type="button" onClick={() => navigate(ROUTES.DOCUMENT_EDIT(document.documentId))}>
                    <Edit2 size={16} />
                    Sửa
                </Button>
            </div>

            <DocumentDetailContent document={document} />
        </div>
    );
};
