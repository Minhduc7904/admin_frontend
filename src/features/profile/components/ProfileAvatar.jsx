import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Loader } from 'lucide-react';
import {
    attachMediaAsync,
    detachMediaByEntityAsync
} from '../../mediaUsage/store/mediaUsageSlice';
import {
    selectProfile,
    getAvatarUsagesAsync,
    getAvatarViewUrlAsync,
    selectAvatarUsages,
    selectAvatarLoading,
    selectAvatarViewUrl,
    selectAvatarViewUrlLoading
} from '../store/profileSlice';
import { addNotification } from '../../notification/store/notificationSlice';
import { MediaPickerModal } from '../../media/components';

export const ProfileAvatar = ({ size = 'large' }) => {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const avatarUsages = useSelector(selectAvatarUsages);
    const loadingAvatar = useSelector(selectAvatarLoading);
    const avatarViewUrl = useSelector(selectAvatarViewUrl);
    const loadingViewUrlLoading = useSelector(selectAvatarViewUrlLoading);

    const [uploading, setUploading] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

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
                dispatch(getAvatarViewUrlAsync(firstAvatar.mediaId));
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

    const handleMediaSelect = async (mediaId) => {
        if (!profile?.userId) return;

        setUploading(true);
        setIsMediaPickerOpen(false);

        try {
            // Step 1: Detach old avatar (if exists)
            if (avatarUsages.data.length > 0) {
                await dispatch(detachMediaByEntityAsync({
                    entityType: 'AVATAR',
                    entityId: profile.userId,
                })).unwrap();
            }

            // Step 2: Attach new avatar
            await dispatch(attachMediaAsync({
                mediaId,
                entityType: 'AVATAR',
                entityId: profile.userId,
                fieldName: 'avatar',
                visibility: 'PUBLIC',
            })).unwrap();

            // Step 3: Refresh avatar
            dispatch(getAvatarUsagesAsync(profile.userId));

            dispatch(addNotification({
                type: 'success',
                title: 'Cập nhật avatar thành công',
                message: 'Ảnh đại diện của bạn đã được cập nhật'
            }));

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

    const handleAvatarClick = () => {
        setIsMediaPickerOpen(true);
    };

    if (loadingAvatar && !avatarViewUrl) {
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
                onClick={handleAvatarClick}
            >
                {avatarViewUrl ? (
                    <img
                        src={avatarViewUrl}
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

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSave={handleMediaSelect}
                selectedMediaId={avatarUsages.data?.[0]?.mediaId || null}
                title="Chọn ảnh đại diện"
                type="IMAGE"
            />
        </div>
    );
};
