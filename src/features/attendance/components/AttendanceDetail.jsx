import { useState } from 'react';
import { Info, FileImage } from 'lucide-react';
import { Tabs } from '../../../shared/components/ui';
import { AttendanceDetailInfo } from './AttendanceDetailInfo';
import { AttendanceExport } from './AttendanceExport';

export const AttendanceDetail = ({ attendance }) => {
    const [activeTab, setActiveTab] = useState('detail');

    if (!attendance) {
        return (
            <div className="p-6 text-center text-foreground-light">
                Không có dữ liệu điểm danh
            </div>
        );
    }

    const tabs = [
        {
            label: 'Chi tiết',
            isActive: activeTab === 'detail',
            onActivate: () => setActiveTab('detail'),
            icon: Info,
            className: 'bg-primary',
        },
        {
            label: 'Xuất phiếu',
            isActive: activeTab === 'export',
            onActivate: () => setActiveTab('export'),
            icon: FileImage,
            className: 'bg-primary',
        },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="px-6 pt-4">
                <Tabs tabs={tabs} />
            </div>

            {/* Tabs Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'detail' && <AttendanceDetailInfo attendance={attendance} />}
                {activeTab === 'export' && <AttendanceExport attendance={attendance} />}
            </div>
        </div>
    );
};
