import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Loader } from 'lucide-react';
import { uploadMediaAsync } from '../../media/store/mediaSlice';
import {
    attachMediaAsync,
    detachMediaByEntityAsync
} from '../../mediaUsage/store/mediaUsageSlice';
import {
    selectProfile,
    getAvatarUsagesAsync,
    getAvatarDownloadUrlAsync,
    selectAvatarUsages,
    selectAvatarLoading,
    selectAvatarDownloadUrl,
    selectAvatarDownloadUrlLoading
} from '../store/profileSlice';
import { addNotification } from '../../notification/store/notificationSlice';

export const ProfileAvatar = ({ size = 'large' }) => {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const avatarUsages = useSelector(selectAvatarUsages);
    const loadingAvatar = useSelector(selectAvatarLoading);
    const avatarDownloadUrl = useSelector(selectAvatarDownloadUrl);
    const loadingDownloadUrl = useSelector(selectAvatarDownloadUrlLoading);

    const [uploading, setUploading] = useState(false);
    const [hovering, setHovering] = useState(false);

    // Size configurations
    const sizeClasses = {
        small: 'w-16 h-16 text-xl',
        medium: 'w-24 h-24 text-3xl',
        large: 'w-32 h-32 text-4xl'
    };

    // Fetch avatar when component mounts or profile changes
    useEffect(() => {
        if (profile?.userId) {
            dispatch(getAvatarUsagesAsync(profile.userId));
        }
    }, [dispatch, profile?.userId]);

    // Load download URL when avatar usages change
    useEffect(() => {
        if (avatarUsages.data && avatarUsages.data.length > 0) {
            const firstAvatar = avatarUsages.data[0];
            if (firstAvatar?.mediaId) {
                dispatch(getAvatarDownloadUrlAsync(firstAvatar.mediaId));
            }
        }
    }, [dispatch, avatarUsages]);

    const getAvatarText = (name) => {
        if (!name) return 'U';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const getFullName = () => {
        if (profile?.firstName && profile?.lastName) {
            return `${profile.lastName} ${profile.firstName}`;
        }
        return profile?.username || 'User';
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !profile?.userId) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            dispatch(addNotification({
                type: 'error',
                title: 'Lỗi định dạng file',
                message: 'Vui lòng chọn file ảnh'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            dispatch(addNotification({
                type: 'error',
                title: 'Lỗi kích thước file',
                message: 'Kích thước file không được vượt quá 5MB'
            }));
            return;
        }

        setUploading(true);

        try {
            // Step 1: Upload media file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', `Profile avatar for ${profile.username}`);
            formData.append('alt', `${profile.username} avatar`);

            const uploadResult = await dispatch(uploadMediaAsync(formData)).unwrap();
            const mediaId = uploadResult.data.mediaId;

            // Step 2: Detach old avatar (if exists)
            if (avatarUsages.data.length > 0) {
                await dispatch(detachMediaByEntityAsync({
                    entityType: 'AVATAR',
                    entityId: profile.userId,
                })).unwrap();
            }

            // Step 3: Attach new avatar
            await dispatch(attachMediaAsync({
                mediaId,
                entityType: 'AVATAR',
                entityId: profile.userId,
                fieldName: 'avatar',
                visibility: 'PUBLIC',
            })).unwrap();

            // Refresh avatar
            dispatch(getAvatarUsagesAsync(profile.userId));

        } catch (error) {
            console.error('Failed to update avatar:', error);
            dispatch(addNotification({
                type: 'error',
                title: 'Cập nhật avatar thất bại',
                message: 'Vui lòng thử lại sau'
            }));
        } finally {
            setUploading(false);
        }
    };

    const handleUploadClick = () => {
        document.getElementById('avatar-upload-input').click();
    };

    if (loadingAvatar && !avatarDownloadUrl) {
        return (
            <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center`}>
                <Loader className="animate-spin text-gray-400" size={size === 'large' ? 32 : 24} />
            </div>
        );
    }

    return (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} rounded-full bg-white p-1 shadow-lg cursor-pointer relative`}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={handleUploadClick}
            >
                {avatarDownloadUrl ? (
                    <img
                        src={avatarDownloadUrl}
                        alt={getFullName()}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {getAvatarText(getFullName())}
                    </div>
                )}

                {/* Overlay on hover */}
                {hovering && !uploading && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                        <Camera className="text-white" size={size === 'large' ? 32 : 24} />
                    </div>
                )}

                {/* Uploading overlay */}
                {uploading && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader className="animate-spin text-white" size={size === 'large' ? 32 : 24} />
                    </div>
                )}
            </div>

            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>

            {/* Hidden file input */}
            <input
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />
        </div>
    );
};
