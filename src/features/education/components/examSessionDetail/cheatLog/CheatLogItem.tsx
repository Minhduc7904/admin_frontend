import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface CheatLogEntry {
    id: string;
    timestamp: string;
    studentName: string;
    studentCode: string;
    studentClass: string;
    action: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    ipAddress?: string;
    deviceInfo?: string;
}

interface CheatLogItemProps {
    log: CheatLogEntry;
}

const getSeverityIcon = (severity: CheatLogEntry['severity']) => {
    switch (severity) {
        case 'critical':
            return <AlertCircle size={16} className="text-red-600" />;
        case 'warning':
            return <AlertTriangle size={16} className="text-orange-600" />;
        case 'info':
            return <Info size={16} className="text-gray-600" />;
        default:
            return <Info size={16} className="text-gray-600" />;
    }
};

const getSeverityBgColor = (severity: CheatLogEntry['severity']) => {
    switch (severity) {
        case 'critical':
            return 'bg-red-50 border-red-200';
        case 'warning':
            return 'bg-orange-50 border-orange-200';
        case 'info':
            return 'bg-gray-50 border-gray-200';
        default:
            return 'bg-gray-50 border-gray-200';
    }
};

const getSeverityTextColor = (severity: CheatLogEntry['severity']) => {
    switch (severity) {
        case 'critical':
            return 'text-red-700';
        case 'warning':
            return 'text-orange-700';
        case 'info':
            return 'text-gray-700';
        default:
            return 'text-gray-700';
    }
};

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const CheatLogItem: React.FC<CheatLogItemProps> = ({ log }) => {
    return (
        <div className={`border rounded-lg p-3 ${getSeverityBgColor(log.severity)}`}>
            <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(log.severity)}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-gray-900">
                                    {log.studentName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {log.studentCode} • {log.studentClass}
                                </span>
                            </div>
                            <p className={`text-xs font-medium ${getSeverityTextColor(log.severity)} mt-0.5`}>
                                {log.action}
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTimestamp(log.timestamp)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{log.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {log.ipAddress && (
                            <span className="flex items-center gap-1">
                                <span className="font-medium">IP:</span>
                                {log.ipAddress}
                            </span>
                        )}
                        {log.deviceInfo && (
                            <span className="flex items-center gap-1">
                                <span className="font-medium">Thiết bị:</span>
                                {log.deviceInfo}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
