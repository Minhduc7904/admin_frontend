import React, { useEffect, useState } from 'react';
import { File, Video, Music, FileText, Check } from 'lucide-react';
import { Spinner } from '../../../../shared/components/loading';

/* =====================
   Media Grid Item
===================== */
export const MediaGridItem = ({ media, isSelected, onClick, viewUrl, multiple = false }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For images, loading state is controlled by viewUrl availability
        if (media.type === 'IMAGE') {
            setLoading(!viewUrl);
        } else {
            setLoading(false);
        }
    }, [media.type, viewUrl]);

    const getIcon = () => {
        switch (media.type) {
            case 'VIDEO':
                return <Video size={40} className="text-purple-500" />;
            case 'AUDIO':
                return <Music size={40} className="text-green-500" />;
            case 'DOCUMENT':
                return <FileText size={40} className="text-orange-500" />;
            default:
                return <File size={40} className="text-gray-400" />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                relative aspect-square rounded-lg border-2 cursor-pointer
                transition-all hover:shadow-md
                ${isSelected
                    ? 'border-info bg-info/5'
                    : 'border-border hover:border-info/50'
                }
            `}
        >
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {loading ? (
                    <Spinner size="lg" />
                ) : media.type === 'IMAGE' && viewUrl ? (
                    <img
                        src={viewUrl}
                        alt={media.fileName || media.originalName}
                        className="w-full h-full object-cover rounded"
                    />
                ) : (
                    getIcon()
                )}
            </div>

            {/* Selected Indicator - Checkbox for multiple, Check icon for single */}
            {multiple ? (
                <div className={`absolute top-2 right-2 w-6 h-6 rounded border-2 flex items-center justify-center shadow-lg
                    ${isSelected 
                        ? 'bg-info border-info' 
                        : 'bg-white border-gray-300'
                    }
                `}>
                    {isSelected && <Check size={16} className="text-white" />}
                </div>
            ) : (
                isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-info rounded-full flex items-center justify-center shadow-lg">
                        <Check size={16} className="text-white" />
                    </div>
                )
            )}

            {/* File Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b truncate">
                { media.originalName || media.fileName}
            </div>
        </div>
    );
};