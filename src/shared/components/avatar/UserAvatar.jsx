import { useEffect, useMemo, useState } from 'react';
import { User } from 'lucide-react';
import { mediaApi, mediaUsageApi } from '../../../core/api';
import { Spinner } from '../loading';

const avatarCache = new Map();

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const extractArray = (response) => {
  const payload = response?.data ?? response;
  console.log('Extracted payload:', payload);
  const data = payload?.data ?? payload;
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const extractDownloadUrl = (response) => {
    console.log('Download URL response:', response);
  const payload = response?.data ?? response;
  if (!payload) return null;
  const data = payload.data ?? payload;
  return data.downloadUrl || data.viewUrl || data.url || null;
};

export const UserAvatar = ({
  userId,
  name = 'User',
  size = 'md',
  shape = 'circle',
  className = '',
  variant = 'gradient',
  showInitials = true,
  fallbackIcon: FallbackIcon = User,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (!userId) {
      setAvatarUrl(null);
      setLoading(false);
      return () => {
        isActive = false;
      };
    }

    const cached = avatarCache.get(userId);
    if (cached !== undefined) {
      setAvatarUrl(cached);
      setLoading(false);
      return () => {
        isActive = false;
      };
    }

    const fetchAvatar = async () => {
      setLoading(true);
      try {
        const usagesResponse = await mediaUsageApi.getByEntity('AVATAR', userId);
        // console.log('Avatar usages response:', usagesResponse);
        const usages = extractArray(usagesResponse);
        const firstUsage = usages[0];

        if (firstUsage?.mediaId) {
          const downloadResponse = await mediaApi.getDownloadUrl(firstUsage.mediaId, 3600);
          
          const url = extractDownloadUrl(downloadResponse);
          if (isActive) {
            avatarCache.set(userId, url);
            setAvatarUrl(url);
          }
        } else if (isActive) {
          avatarCache.set(userId, null);
          setAvatarUrl(null);
        }
      } catch (error) {
        if (isActive) {
          avatarCache.set(userId, null);
          setAvatarUrl(null);
        }
        console.error('Failed to load avatar', error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchAvatar();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const initials = useMemo(() => {
    if (!name) {
      return 'AD';
    }

    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) {
      return 'AD';
    }

    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [name]);

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-sm';
  const variantClass =
    variant === 'muted'
      ? 'bg-slate-700 text-white'
      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white';

  return (
    <div className={`relative overflow-hidden ${sizeClass} ${shapeClass} ${className}`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${variantClass}`}>
          {showInitials ? (
            <span className="text-sm font-semibold tracking-wide">{initials}</span>
          ) : (
            <FallbackIcon className="w-4 h-4" />
          )}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
          <Spinner size="sm" className="text-white" />
        </div>
      )}
    </div>
  );
};
