import React, { useState } from 'react';
import { Mail, Clock } from 'lucide-react';
import {
    NotificationsPageHeader,
    EmailTemplates,
    RecipientSelector,
    EmailContentForm,
    EmailPreview,
    EmailHistoryList,
    type EmailTemplate,
    type RecipientUser,
    type SentEmail,
} from '../components/notifications';

type RecipientType = 'all' | 'specific';

export const NotificationsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
    
    // Compose form state
    const [recipientType, setRecipientType] = useState<RecipientType>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    
    // Search and filter
    const [userSearch, setUserSearch] = useState('');
    const [historySearch, setHistorySearch] = useState('');

    // Mock data
    const templates: EmailTemplate[] = [
        {
            id: '1',
            name: 'Chào mừng người dùng mới',
            subject: 'Chào mừng bạn đến với hệ thống',
            content: 'Xin chào {{name}},\n\nChúng tôi rất vui khi chào đón bạn đến với hệ thống của chúng tôi.\n\nTrân trọng,\nĐội ngũ quản trị',
        },
        {
            id: '2',
            name: 'Thông báo bảo trì',
            subject: 'Thông báo bảo trì hệ thống',
            content: 'Kính gửi {{name}},\n\nHệ thống sẽ được bảo trì vào ngày {{date}}. Vui lòng lưu ý.\n\nTrân trọng,\nĐội ngũ quản trị',
        },
        {
            id: '3',
            name: 'Cập nhật tính năng',
            subject: 'Thông báo cập nhật tính năng mới',
            content: 'Xin chào {{name}},\n\nChúng tôi vừa cập nhật các tính năng mới cho hệ thống.\n\nTrân trọng,\nĐội ngũ quản trị',
        },
    ];

    const users: RecipientUser[] = [
        { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Admin' },
        { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', role: 'Teacher' },
        { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', role: 'Student' },
        { id: '4', name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'Student' },
        { id: '5', name: 'Hoàng Văn E', email: 'hoangvane@example.com', role: 'Teacher' },
        { id: '6', name: 'Vũ Thị F', email: 'vuthif@example.com', role: 'Student' },
    ];

    const sentEmails: SentEmail[] = [
        {
            id: '1',
            subject: 'Thông báo cập nhật hệ thống',
            recipientType: 'all',
            recipientCount: 245,
            sentAt: '2024-12-22T10:30:00',
            status: 'success',
        },
        {
            id: '2',
            subject: 'Nhắc nhở hoàn thành khóa học',
            recipientType: 'specific',
            recipientCount: 15,
            sentAt: '2024-12-21T14:20:00',
            status: 'success',
        },
        {
            id: '3',
            subject: 'Thông báo bảo trì',
            recipientType: 'all',
            recipientCount: 245,
            sentAt: '2024-12-20T09:00:00',
            status: 'failed',
        },
    ];

    // Handlers
    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            setSubject(template.subject);
            setContent(template.content);
        }
    };

    const handleUserToggle = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAllUsers = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((u) => u.id));
        }
    };

    const handleSendEmail = () => {
        console.log('Send email:', {
            recipientType,
            selectedUsers,
            subject,
            content,
        });
        // Reset form
        setSubject('');
        setContent('');
        setSelectedUsers([]);
        setSelectedTemplate('');
    };

    const handleClearForm = () => {
        setSubject('');
        setContent('');
        setSelectedUsers([]);
        setSelectedTemplate('');
        setRecipientType('all');
    };

    // Filtered data
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredHistory = sentEmails.filter((email) =>
        email.subject.toLowerCase().includes(historySearch.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <NotificationsPageHeader />

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('compose')}
                    className={`px-4 py-2 font-medium transition-colors relative text-xs ${
                        activeTab === 'compose'
                            ? 'text-gray-900 border-b-2 border-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Mail size={14} />
                        Soạn email
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 font-medium transition-colors relative text-xs ${
                        activeTab === 'history'
                            ? 'text-gray-900 border-b-2 border-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Clock size={14} />
                        Lịch sử gửi
                    </div>
                </button>
            </div>

            {/* Compose Tab */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Email Templates */}
                        <EmailTemplates
                            templates={templates}
                            selectedTemplate={selectedTemplate}
                            onTemplateSelect={handleTemplateSelect}
                        />

                        {/* Recipient Selector */}
                        <RecipientSelector
                            recipientType={recipientType}
                            onRecipientTypeChange={setRecipientType}
                            users={filteredUsers}
                            selectedUsers={selectedUsers}
                            onUserToggle={handleUserToggle}
                            onSelectAll={handleSelectAllUsers}
                            userSearch={userSearch}
                            onUserSearchChange={setUserSearch}
                            totalUsersCount={245}
                        />

                        {/* Email Content */}
                        <EmailContentForm
                            subject={subject}
                            onSubjectChange={setSubject}
                            content={content}
                            onContentChange={setContent}
                            onSend={handleSendEmail}
                            onClear={handleClearForm}
                            canSend={
                                !!subject &&
                                !!content &&
                                (recipientType === 'all' || selectedUsers.length > 0)
                            }
                        />
                    </div>

                    {/* Preview Sidebar */}
                    <div>
                        <EmailPreview
                            recipientType={recipientType}
                            selectedUsersCount={selectedUsers.length}
                            totalUsersCount={245}
                            subject={subject}
                            content={content}
                        />
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <EmailHistoryList
                    emails={filteredHistory}
                    searchQuery={historySearch}
                    onSearchChange={setHistorySearch}
                />
            )}
        </div>
    );
};
