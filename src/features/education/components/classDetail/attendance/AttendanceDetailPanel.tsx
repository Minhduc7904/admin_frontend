import React from 'react';
import { X, User, Calendar, Clock, FileText, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import type { AttendanceRecord } from './AttendanceTableRow';

interface AttendanceDetailPanelProps {
    record: AttendanceRecord & { teacherComment?: string };
    onClose: () => void;
}

const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
        case 'present':
            return 'bg-green-100 text-green-700';
        case 'absent':
            return 'bg-red-100 text-red-700';
        case 'late':
            return 'bg-orange-100 text-orange-700';
        case 'excused':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: AttendanceRecord['status']) => {
    switch (status) {
        case 'present':
            return 'Có mặt';
        case 'absent':
            return 'Vắng';
        case 'late':
            return 'Muộn';
        case 'excused':
            return 'Có phép';
        default:
            return status;
    }
};

export const AttendanceDetailPanel: React.FC<AttendanceDetailPanelProps> = ({ record, onClose }) => {
    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />

            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Chi tiết phiếu điểm danh</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* ID Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={16} className="text-gray-600" />
                            <span className="text-xs font-medium text-gray-600 uppercase">ID Phiếu</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{record.id}</p>
                    </div>

                    {/* Student Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User size={16} />
                            Thông tin học sinh
                        </h3>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-lg font-semibold">
                                        {record.studentName.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-gray-900">{record.studentName}</p>
                                    <p className="text-xs text-gray-500">{record.studentCode}</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-200 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Lớp:</span>
                                    <span className="text-xs font-medium text-gray-900">{record.studentClass}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Số điện thoại:</span>
                                    <span className="text-xs font-medium text-gray-900">{record.studentPhone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar size={16} />
                            Thông tin điểm danh
                        </h3>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Ngày điểm danh:</span>
                                <span className="text-xs font-medium text-gray-900">{record.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Trạng thái:</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                                    {getStatusText(record.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Homework Score */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText size={16} />
                            Điểm bài tập về nhà
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            {record.homeworkScore !== null ? (
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">{record.homeworkScore}</div>
                                    <div className="text-sm text-gray-600 mt-1">/10 điểm</div>
                                </div>
                            ) : (
                                <div className="text-center text-sm text-gray-500">Chưa chấm điểm</div>
                            )}
                        </div>
                    </div>

                    {/* Tuition Status */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <DollarSign size={16} />
                            Trạng thái học phí
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-center gap-2">
                                {record.isPaidTuition ? (
                                    <>
                                        <CheckCircle size={20} className="text-green-600" />
                                        <span className="text-sm font-medium text-green-600">Đã đóng học phí</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={20} className="text-red-600" />
                                        <span className="text-sm font-medium text-red-600">Chưa đóng học phí</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Teacher Comment */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText size={16} />
                            Nhận xét của giáo viên
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            {record.teacherComment ? (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.teacherComment}</p>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Chưa có nhận xét</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
