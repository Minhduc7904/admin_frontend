import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Loader } from 'lucide-react';
import {
    selectProfile,
    uploadAvatarAsync,
    selectAvatarUploading,
} from '../store/profileSlice';

export const ProfileAvatar = ({ size = 'large' }) => {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const uploading = useSelector(selectAvatarUploading);
    const inputRef = useRef(null);

    const [hovering, setHovering] = useState(false);
    const avatarUrl = profile?.avatarUrl || profile?.avatarurl || null;

    // Size configurations
    const sizeClasses = {
        small: 'w-16 h-16 text-xl',
        medium: 'w-24 h-24 text-3xl',
        large: 'w-32 h-32 text-4xl'
    };

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

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            await dispatch(uploadAvatarAsync(file)).unwrap();
        } catch (error) {
            console.error('Failed to update avatar:', error);
        } finally {
            event.target.value = '';
        }
    };

    const handleAvatarClick = () => {
        if (!uploading) {
            inputRef.current?.click();
        }
    };

    return (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} rounded-full bg-white p-1 shadow-lg cursor-pointer relative`}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={handleAvatarClick}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
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

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
        </div>
    );
};
