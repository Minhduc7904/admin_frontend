import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UploadPdfSection } from '../components/UploadPdfSection';
import { MarkdownPreview } from '../components/MarkdownPreview';
import {
    getSessionRawContentAsync,
    updateSessionRawContentAsync,
    selectExamImportSessionRawContent,
    selectExamImportSessionLoadingRawContent,
    selectExamImportSessionLoadingUpdateRawContent,
} from '../store/examImportSessionSlice';

export const UploadPdfExtraction = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const rawContentData = useSelector(selectExamImportSessionRawContent);
    const loadingRawContent = useSelector(selectExamImportSessionLoadingRawContent);
    const loadingUpdateRawContent = useSelector(selectExamImportSessionLoadingUpdateRawContent);

    // Load raw content when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getSessionRawContentAsync({ sessionId: id, expiry: 3600 }));
        }
    }, [id, dispatch]);

    // Handle save edited raw content
    const handleSaveRawContent = async (newRawContent) => {
        if (!id) return;
        
        await dispatch(updateSessionRawContentAsync({
            sessionId: id,
            rawContent: newRawContent,
        })).unwrap();
        
        // Reload session raw content after save
        await dispatch(getSessionRawContentAsync({ 
            sessionId: id, 
            expiry: 3600 
        })).unwrap();
    };

    return (
        <div className="grid grid-cols-2 gap-6 h-full">
            {/* Left Side - Upload PDF */}
            <div className="flex flex-col h-full overflow-y-auto">
                <UploadPdfSection 
                    sessionId={id}
                />
            </div>

            {/* Right Side - Markdown Preview */}
            <div className="flex flex-col h-full overflow-y-auto">
                <MarkdownPreview 
                    rawContent={rawContentData?.rawContent}
                    processedContent={rawContentData?.processedContent}
                    metadata={rawContentData?.metadata}
                    isLoading={loadingRawContent}
                    onSave={handleSaveRawContent}
                    isSaving={loadingUpdateRawContent}
                />
            </div>
        </div>
    );
};
