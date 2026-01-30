import { useState } from 'react'
import { Info, FileText } from 'lucide-react'
import { Tabs } from '../../../shared/components/ui'
import { TuitionPaymentDetailInfo } from './TuitionPaymentDetailInfo'
import { TuitionPaymentExport } from './TuitionPaymentExport'

export const TuitionPaymentDetail = ({ payment }) => {
    const [activeTab, setActiveTab] = useState('detail')

    if (!payment) {
        return (
            <div className="p-6 text-center text-foreground-light">
                Không có dữ liệu học phí
            </div>
        )
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
            label: 'Phiếu học phí',
            isActive: activeTab === 'export',
            onActivate: () => setActiveTab('export'),
            icon: FileText,
            className: 'bg-primary',
        },
    ]

    return (
        <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="px-6 pt-4">
                <Tabs tabs={tabs} />
            </div>

            {/* Tabs Content */}
            <div className="flex-1">
                {activeTab === 'detail' && <TuitionPaymentDetailInfo payment={payment} />}
                {activeTab === 'export' && <TuitionPaymentExport payment={payment} />}
            </div>
        </div>
    )
}
