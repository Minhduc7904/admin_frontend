import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import {
    createTeacherProfileAsync,
    selectTeacherProfileLoadingCreate,
    selectTeacherProfileLoadingUpdate,
    updateTeacherProfileAsync,
} from '../store/teacherProfileSlice';

const DEFAULT_FORM_DATA = {
    displayName: '',
    profileImageMediaId: '',
    profileImageUrl: '',
    scheduleImageMediaIds: [],
    scheduleImageUrls: [],
    classroomImageMediaIds: [],
    classroomImageUrls: [],
    headline: '',
    shortDescription: '',
    bio: '',
    expertise: '',
    teachingSubjects: '',
    gradeLevels: '',
    teachingFormats: '',
    teachingMethods: '',
    yearsExperience: '',
    education: '',
    certifications: '',
    achievements: '',
    teachingArea: '',
    workplace: '',
    contactEmail: '',
    contactPhone: '',
    contactZalo: '',
    contactFacebook: '',
    contactWebsite: '',
    contactAddress: '',
    bookingUrl: '',
    ctaLabel: '',
    ctaUrl: '',
    autoSeo: true,
    targetKeyword: '',
    keywordText: '',
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    searchIntent: '',
    seoScore: '',
    visibility: 'DRAFT',
    isFeatured: false,
    sortOrder: '',
};

const TEXT_FIELDS = [
    'headline',
    'shortDescription',
    'bio',
    'expertise',
    'teachingSubjects',
    'gradeLevels',
    'teachingFormats',
    'teachingMethods',
    'education',
    'certifications',
    'achievements',
    'teachingArea',
    'workplace',
    'contactEmail',
    'contactPhone',
    'contactZalo',
    'contactFacebook',
    'contactWebsite',
    'contactAddress',
    'bookingUrl',
    'ctaLabel',
    'ctaUrl',
];

const SEO_FIELDS = [
    'targetKeyword',
    'keywordText',
    'metaTitle',
    'metaDescription',
    'ogTitle',
    'ogDescription',
    'searchIntent',
];

const toOptionalText = (value) => value.trim() || undefined;
const toOptionalNumber = (value) => (value === '' ? undefined : Number(value));

const hasSeoData = (profile) => SEO_FIELDS.some((field) => Boolean(profile?.[field]));

const buildPayload = (
    formData,
    { mode, profileImageChanged, scheduleImagesChanged, classroomImagesChanged } = {}
) => {
    const payload = {
        displayName: formData.displayName.trim(),
        visibility: formData.visibility,
        isFeatured: formData.isFeatured,
        yearsExperience: toOptionalNumber(formData.yearsExperience),
        seoScore: toOptionalNumber(formData.seoScore),
        sortOrder: toOptionalNumber(formData.sortOrder),
    };

    const profileImageMediaId = toOptionalNumber(formData.profileImageMediaId);
    if (profileImageMediaId !== undefined) {
        payload.profileImageMediaId = profileImageMediaId;
    } else if (mode === 'edit' && profileImageChanged) {
        payload.profileImageMediaId = null;
    }

    const scheduleImageMediaIds = formData.scheduleImageMediaIds
        .map((mediaId) => Number(mediaId))
        .filter((mediaId) => Number.isFinite(mediaId));
    if (scheduleImageMediaIds.length > 0 || scheduleImagesChanged) {
        payload.scheduleImageMediaIds = scheduleImageMediaIds;
    }

    const classroomImageMediaIds = formData.classroomImageMediaIds
        .map((mediaId) => Number(mediaId))
        .filter((mediaId) => Number.isFinite(mediaId));
    if (classroomImageMediaIds.length > 0 || classroomImagesChanged) {
        payload.classroomImageMediaIds = classroomImageMediaIds;
    }

    TEXT_FIELDS.forEach((field) => {
        payload[field] = toOptionalText(formData[field]);
    });

    SEO_FIELDS.forEach((field) => {
        payload[field] = formData.autoSeo ? undefined : toOptionalText(formData[field]);
    });

    return payload;
};

const mapProfileToFormData = (profile) => ({
    ...DEFAULT_FORM_DATA,
    displayName: profile?.displayName || '',
    profileImageMediaId: profile?.profileImageMediaId ?? '',
    profileImageUrl: profile?.profileImageUrl || '',
    scheduleImageMediaIds: profile?.scheduleImageMediaIds || [],
    scheduleImageUrls: profile?.scheduleImageUrls || [],
    classroomImageMediaIds: profile?.classroomImageMediaIds || [],
    classroomImageUrls: profile?.classroomImageUrls || [],
    headline: profile?.headline || '',
    shortDescription: profile?.shortDescription || '',
    bio: profile?.bio || '',
    expertise: profile?.expertise || '',
    teachingSubjects: profile?.teachingSubjects || '',
    gradeLevels: profile?.gradeLevels || '',
    teachingFormats: profile?.teachingFormats || '',
    teachingMethods: profile?.teachingMethods || '',
    yearsExperience: profile?.yearsExperience ?? '',
    education: profile?.education || '',
    certifications: profile?.certifications || '',
    achievements: profile?.achievements || '',
    teachingArea: profile?.teachingArea || '',
    workplace: profile?.workplace || '',
    contactEmail: profile?.contactEmail || '',
    contactPhone: profile?.contactPhone || '',
    contactZalo: profile?.contactZalo || '',
    contactFacebook: profile?.contactFacebook || '',
    contactWebsite: profile?.contactWebsite || '',
    contactAddress: profile?.contactAddress || '',
    bookingUrl: profile?.bookingUrl || '',
    ctaLabel: profile?.ctaLabel || '',
    ctaUrl: profile?.ctaUrl || '',
    autoSeo: !hasSeoData(profile),
    targetKeyword: profile?.targetKeyword || '',
    keywordText: profile?.keywordText || '',
    metaTitle: profile?.metaTitle || '',
    metaDescription: profile?.metaDescription || '',
    ogTitle: profile?.ogTitle || '',
    ogDescription: profile?.ogDescription || '',
    searchIntent: profile?.searchIntent || '',
    seoScore: profile?.seoScore ?? '',
    visibility: profile?.visibility || 'DRAFT',
    isFeatured: Boolean(profile?.isFeatured),
    sortOrder: profile?.sortOrder ?? '',
});

const validateForm = (formData) => {
    const errors = {};

    if (!formData.displayName.trim()) {
        errors.displayName = 'Tên hiển thị không được để trống';
    }
    if (formData.yearsExperience !== '' && Number(formData.yearsExperience) < 0) {
        errors.yearsExperience = 'Số năm kinh nghiệm không được âm';
    }
    if (formData.seoScore !== '') {
        const score = Number(formData.seoScore);
        if (score < 0 || score > 100) {
            errors.seoScore = 'SEO score phải từ 0 đến 100';
        }
    }
    if (formData.sortOrder !== '' && Number(formData.sortOrder) < 0) {
        errors.sortOrder = 'Thứ tự sắp xếp không được âm';
    }

    return errors;
};

export const useTeacherProfileForm = ({ mode = 'create', teacherProfile = null } = {}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loadingCreate = useSelector(selectTeacherProfileLoadingCreate);
    const loadingUpdate = useSelector(selectTeacherProfileLoadingUpdate);
    const loading = mode === 'edit' ? loadingUpdate : loadingCreate;
    const [formData, setFormData] = useState(() =>
        mode === 'edit' && teacherProfile ? mapProfileToFormData(teacherProfile) : DEFAULT_FORM_DATA
    );
    const [errors, setErrors] = useState({});
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [isScheduleImagePickerOpen, setIsScheduleImagePickerOpen] = useState(false);
    const [isClassroomImagePickerOpen, setIsClassroomImagePickerOpen] = useState(false);
    const [profileImageChanged, setProfileImageChanged] = useState(false);
    const [scheduleImagesChanged, setScheduleImagesChanged] = useState(false);
    const [classroomImagesChanged, setClassroomImagesChanged] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSwitchChange = (checked) => {
        setFormData((prev) => ({ ...prev, isFeatured: checked }));
    };

    const handleModeSwitchChange = (field, checked) => {
        setFormData((prev) => ({ ...prev, [field]: checked }));
    };

    const openImagePicker = () => {
        setIsImagePickerOpen(true);
    };

    const closeImagePicker = () => {
        setIsImagePickerOpen(false);
    };

    const saveProfileImage = (mediaId) => {
        setFormData((prev) => ({
            ...prev,
            profileImageMediaId: mediaId || '',
            profileImageUrl: '',
        }));
        setProfileImageChanged(true);
        closeImagePicker();
    };

    const clearProfileImage = () => {
        setFormData((prev) => ({
            ...prev,
            profileImageMediaId: '',
            profileImageUrl: '',
        }));
        setProfileImageChanged(true);
    };

    const openScheduleImagePicker = () => {
        setIsScheduleImagePickerOpen(true);
    };

    const closeScheduleImagePicker = () => {
        setIsScheduleImagePickerOpen(false);
    };

    const saveScheduleImages = (mediaIds) => {
        setFormData((prev) => ({
            ...prev,
            scheduleImageMediaIds: Array.isArray(mediaIds) ? mediaIds : [],
            scheduleImageUrls: [],
        }));
        setScheduleImagesChanged(true);
        closeScheduleImagePicker();
    };

    const clearScheduleImages = () => {
        setFormData((prev) => ({
            ...prev,
            scheduleImageMediaIds: [],
            scheduleImageUrls: [],
        }));
        setScheduleImagesChanged(true);
    };

    const openClassroomImagePicker = () => {
        setIsClassroomImagePickerOpen(true);
    };

    const closeClassroomImagePicker = () => {
        setIsClassroomImagePickerOpen(false);
    };

    const saveClassroomImages = (mediaIds) => {
        setFormData((prev) => ({
            ...prev,
            classroomImageMediaIds: Array.isArray(mediaIds) ? mediaIds : [],
            classroomImageUrls: [],
        }));
        setClassroomImagesChanged(true);
        closeClassroomImagePicker();
    };

    const clearClassroomImages = () => {
        setFormData((prev) => ({
            ...prev,
            classroomImageMediaIds: [],
            classroomImageUrls: [],
        }));
        setClassroomImagesChanged(true);
    };

    const submit = async (e) => {
        e.preventDefault();
        const nextErrors = validateForm(formData);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        const payload = buildPayload(formData, {
            mode,
            profileImageChanged,
            scheduleImagesChanged,
            classroomImagesChanged,
        });
        const response =
            mode === 'edit'
                ? await dispatch(
                    updateTeacherProfileAsync({
                        id: teacherProfile.teacherProfileId,
                        data: payload,
                    })
                ).unwrap()
                : await dispatch(createTeacherProfileAsync(payload)).unwrap();

        const teacherProfileId = response?.data?.teacherProfileId;
        navigate(teacherProfileId ? ROUTES.TEACHER_PROFILE_DETAIL(teacherProfileId) : ROUTES.TEACHER_PROFILES);
    };

    return {
        formData,
        errors,
        loading,
        isImagePickerOpen,
        isScheduleImagePickerOpen,
        isClassroomImagePickerOpen,
        handleChange,
        handleSwitchChange,
        handleModeSwitchChange,
        openImagePicker,
        closeImagePicker,
        saveProfileImage,
        clearProfileImage,
        openScheduleImagePicker,
        closeScheduleImagePicker,
        saveScheduleImages,
        clearScheduleImages,
        openClassroomImagePicker,
        closeClassroomImagePicker,
        saveClassroomImages,
        clearClassroomImages,
        submit,
    };
};
