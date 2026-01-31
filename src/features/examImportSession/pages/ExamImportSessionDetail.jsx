import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    selectCurrentExamImportSession,
    selectExamImportSessionLoadingGet,
} from '../store/examImportSessionSlice';
import {
    getTempExamBySessionAsync,
    createTempExamAsync,
    selectCurrentTempExam,
    selectTempExamLoadingGet,
    selectTempExamLoadingCreate,
    clearCurrentTempExam,
} from '../../examTemp/store/tempExamSlice';
import {
    TempExamInfo,
    TempExamForm,
    TempExamEmptyState,
    ExamProcessing,
    MediaPreviewPanel,
} from '../components';

export const ExamImportSessionDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        grade: '',
        subjectId: '',
        visibility: 'PRIVATE',
    });

    const session = useSelector(selectCurrentExamImportSession);
    const sessionLoading = useSelector(selectExamImportSessionLoadingGet);
    
    const tempExam = useSelector(selectCurrentTempExam);
    const tempExamLoading = useSelector(selectTempExamLoadingGet);
    const tempExamCreating = useSelector(selectTempExamLoadingCreate);

    // Load TempExam by SessionId
    useEffect(() => {
        if (id) {
            dispatch(getTempExamBySessionAsync(id));
        }
        return () => {
            dispatch(clearCurrentTempExam());
        };
    }, [id, dispatch]);

    // Populate form data when editing
    useEffect(() => {
        if (isEditing && tempExam) {
            setFormData({
                title: tempExam.title || '',
                description: tempExam.description || '',
                grade: tempExam.grade?.toString() || '',
                subjectId: tempExam.subjectId?.toString() || '',
                visibility: tempExam.visibility || 'PRIVATE',
            });
        }
    }, [isEditing, tempExam]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateTempExam = (data) => {
        const newErrors = {};

        if (!data.title?.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        } else if (data.title.trim().length < 3) {
            newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        } else if (data.title.trim().length > 200) {
            newErrors.title = 'Tiêu đề không được quá 200 ký tự';
        }

        if (data.grade && (parseInt(data.grade) < 1 || parseInt(data.grade) > 12)) {
            newErrors.grade = 'Khối phải từ 1 đến 12';
        }

        return newErrors;
    };

    const handleCreateTempExam = async () => {
        const validationErrors = validateTempExam(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
            grade: formData.grade ? Number(formData.grade) : undefined,
            subjectId: formData.subjectId ? Number(formData.subjectId) : undefined,
            visibility: formData.visibility,
        };

        const result = await dispatch(createTempExamAsync({
            sessionId: id,
            data: payload,
        }));

        if (result.type.endsWith('/fulfilled')) {
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                grade: '',
                subjectId: '',
                visibility: 'PRIVATE',
            });
            setErrors({});
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setFormData({
            title: '',
            description: '',
            grade: '',
            subjectId: '',
            visibility: 'PRIVATE',
        });
        setErrors({});
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setShowForm(true);
        setSelectedMedia(null);
        
    };

    const handleAddClick = () => {
        setIsEditing(false);
        setShowForm(true);
        setSelectedMedia(null);
    };

    const handleMediaClick = (media) => {
        setSelectedMedia(media);
        setShowForm(false);
    };

    const handleClosePreview = () => {
        setSelectedMedia(null);
    };

    if (sessionLoading || tempExamLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-sm text-foreground-light">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-6 h-full">
            {/* Left Side - TempExam Info */}
            <div className="flex flex-col h-full overflow-y-auto">
                {!tempExam ? (
                    <TempExamEmptyState onAddClick={handleAddClick} />
                ) : (
                    <TempExamInfo
                        tempExam={tempExam}
                        onEdit={handleEditClick}
                        onMediaClick={handleMediaClick}
                    />
                )}
            </div>

            {/* Right Side - Form or Processing or Preview */}
            <div className="flex flex-col h-full overflow-y-auto">
                {selectedMedia ? (
                    <MediaPreviewPanel
                        media={selectedMedia}
                        onClose={handleClosePreview}
                    />
                ) : showForm ? (
                    <TempExamForm
                        formData={formData}
                        onChange={handleInputChange}
                        onSubmit={handleCreateTempExam}
                        onCancel={handleCancelForm}
                        isSubmitting={tempExamCreating}
                        errors={errors}
                        isEditing={isEditing}
                        onGradeChange={(value) => {
                            setFormData(prev => ({ ...prev, grade: value }));
                            if (errors.grade) {
                                setErrors(prev => ({ ...prev, grade: '' }));
                            }
                        }}
                        onVisibilityChange={(value) => {
                            setFormData(prev => ({ ...prev, visibility: value }));
                        }}
                        onSubjectSelect={(subject) => {
                            setFormData(prev => ({
                                ...prev,
                                subjectId: subject?.subjectId || ''
                            }));
                            if (errors.subjectId) {
                                setErrors(prev => ({ ...prev, subjectId: '' }));
                            }
                        }}
                    />
                ) : (
                    <ExamProcessing />
                )}
            </div>
        </div>
    );
};
