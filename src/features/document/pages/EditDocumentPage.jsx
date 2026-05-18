import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { InlineLoading } from '../../../shared/components';
import { Spinner } from '../../../shared/components/loading';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { DocumentCreatePreview, DocumentForm } from '../components';
import { useDocumentForm } from '../hooks/useDocumentForm';
import {
    clearCurrentDocument,
    getDocumentByIdAsync,
    selectCurrentDocument,
    selectDocumentLoadingGet,
} from '../store/documentSlice';

export const EditDocumentPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const document = useSelector(selectCurrentDocument);
    const loadingGet = useSelector(selectDocumentLoadingGet);
    useEffect(() => {
        dispatch(getDocumentByIdAsync(id));
        return () => dispatch(clearCurrentDocument());
    }, [dispatch, id]);

    if (loadingGet && !document) {
        return <InlineLoading message="Đang tải tài liệu..." />;
    }

    if (!document) {
        return <div className="text-sm text-foreground-light">Không tìm thấy tài liệu.</div>;
    }

    return <EditDocumentContent document={document} />;
};

const EditDocumentContent = ({ document }) => {
    const navigate = useNavigate();
    const form = useDocumentForm({ mode: 'edit', document });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Sửa tài liệu</h1>
                <p className="mt-1 text-sm text-foreground-light">
                    Cập nhật tài liệu PDF, tag và cấu hình nội dung SEO.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(520px,0.9fr)_minmax(560px,1.1fr)]">
                <div className="rounded-sm border border-border bg-white p-6">
                    <DocumentForm
                        formData={form.formData}
                        errors={form.errors}
                        loading={form.loading}
                        onChange={form.handleChange}
                        onMarkdownChange={form.handleMarkdownChange}
                        onSwitchChange={form.handleSwitchChange}
                        onModeSwitchChange={form.handleModeSwitchChange}
                        onTagChange={form.handleTagChange}
                        onSubmit={form.submit}
                        onCancel={() => navigate(ROUTES.DOCUMENT_DETAIL(document.documentId))}
                        onOpenMediaPicker={form.openMediaPicker}
                        onClearMedia={form.clearMedia}
                        submitLabel="Cập nhật tài liệu"
                    />
                </div>

                <DocumentCreatePreview formData={form.formData} />
            </div>

            <MediaPickerModal
                isOpen={form.pickerState.isOpen}
                onClose={form.closeMediaPicker}
                onSave={form.saveMedia}
                selectedMediaId={form.pickerState.field ? form.formData[form.pickerState.field] : null}
                title={form.pickerState.field === 'thumbnailMediaId' ? 'Chọn thumbnail' : 'Chọn file PDF'}
                type={form.pickerState.type}
            />

            {form.loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-sm">
                    <div className="rounded-sm bg-white px-6 py-5 text-center shadow-lg">
                        <Spinner size="lg" className="mx-auto mb-3 text-blue-700" />
                        <p className="text-sm font-medium text-foreground">Đang cập nhật tài liệu...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
