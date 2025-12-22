import React from 'react';
import { Users, User } from 'lucide-react';
import { SearchInput, Button } from '@/shared/components/ui';

export interface RecipientUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

type RecipientType = 'all' | 'specific';

interface RecipientSelectorProps {
    recipientType: RecipientType;
    onRecipientTypeChange: (type: RecipientType) => void;
    users: RecipientUser[];
    selectedUsers: string[];
    onUserToggle: (userId: string) => void;
    onSelectAll: () => void;
    userSearch: string;
    onUserSearchChange: (search: string) => void;
    totalUsersCount: number;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
    recipientType,
    onRecipientTypeChange,
    users,
    selectedUsers,
    onUserToggle,
    onSelectAll,
    userSearch,
    onUserSearchChange,
    totalUsersCount,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Người nhận</h3>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onRecipientTypeChange('all')}
                        className={`p-3 rounded border-2 transition-all ${
                            recipientType === 'all'
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`p-2 rounded ${
                                    recipientType === 'all' ? 'bg-gray-900' : 'bg-gray-200'
                                }`}
                            >
                                <Users
                                    size={16}
                                    className={recipientType === 'all' ? 'text-white' : 'text-gray-600'}
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-semibold text-gray-900">Gửi tất cả</p>
                                <p className="text-[10px] text-gray-600">{totalUsersCount} người dùng</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => onRecipientTypeChange('specific')}
                        className={`p-3 rounded border-2 transition-all ${
                            recipientType === 'specific'
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`p-2 rounded ${
                                    recipientType === 'specific' ? 'bg-gray-900' : 'bg-gray-200'
                                }`}
                            >
                                <User
                                    size={16}
                                    className={recipientType === 'specific' ? 'text-white' : 'text-gray-600'}
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-semibold text-gray-900">Chọn cụ thể</p>
                                <p className="text-[10px] text-gray-600">{selectedUsers.length} đã chọn</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Specific Users Selection */}
                {recipientType === 'specific' && (
                    <div className="border-t pt-3">
                        <div className="flex items-center gap-2 mb-2">
                            <SearchInput
                                value={userSearch}
                                onChange={onUserSearchChange}
                                placeholder="Tìm người dùng..."
                                className="flex-1"
                            />
                            <Button variant="outline" onClick={onSelectAll} className="text-xs h-[38px] px-3">
                                {selectedUsers.length === users.length ? 'Bỏ chọn' : 'Chọn tất cả'}
                            </Button>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {users.map((user) => (
                                <label
                                    key={user.id}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => onUserToggle(user.id)}
                                        className="w-3.5 h-3.5 text-gray-900 rounded focus:ring-gray-900"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] text-gray-600 truncate">{user.email}</p>
                                    </div>
                                    <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded flex-shrink-0">
                                        {user.role}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
