import { useState } from 'react';
import { Button, Input, Select, Switch, Tabs, Textarea } from '../../../shared/components/ui';
import { TEACHER_PROFILE_VISIBILITY_OPTIONS } from '../constants/teacherProfile.constants';
import { TeacherProfileImageField } from './TeacherProfileImageField';
import { TeacherProfileScheduleImagesField } from './TeacherProfileScheduleImagesField';

const FORM_TABS = [
    { key: 'basic', label: 'Cơ bản' },
    { key: 'teaching', label: 'Giảng dạy' },
    { key: 'contact', label: 'Liên hệ' },
    { key: 'seo', label: 'SEO' },
    { key: 'publish', label: 'Xuất bản' },
];

const ToggleRow = ({ title, description, checked, onChange }) => (
    <div className="rounded-sm border border-border p-3">
        <div className="flex items-center justify-between gap-3">
            <div>
                <div className="text-sm font-medium text-foreground">{title}</div>
                <div className="text-xs text-foreground-light">{description}</div>
            </div>
            <Switch checked={checked} onChange={onChange} />
        </div>
    </div>
);

export const TeacherProfileForm = ({
    formData,
    errors,
    loading,
    onChange,
    onSwitchChange,
    onModeSwitchChange,
    onOpenImagePicker,
    onClearProfileImage,
    onOpenScheduleImagePicker,
    onClearScheduleImages,
    onOpenClassroomImagePicker,
    onClearClassroomImages,
    onSubmit,
    onCancel,
    submitLabel = 'Tạo hồ sơ giáo viên',
}) => {
    const [activeTab, setActiveTab] = useState('basic');

    return (
        <form onSubmit={onSubmit} className="flex h-full flex-col">
            <Tabs
                tabs={FORM_TABS.map((tab) => ({
                    label: tab.label,
                    isActive: activeTab === tab.key,
                    onActivate: () => setActiveTab(tab.key),
                }))}
            />

            <div className="flex-1 space-y-6 py-5">
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <Input
                            label="Tên hiển thị"
                            name="displayName"
                            value={formData.displayName}
                            onChange={onChange}
                            required
                            error={errors.displayName}
                            placeholder="VD: Thầy Nguyễn Văn A"
                        />
                        <Input
                            label="Headline"
                            name="headline"
                            value={formData.headline}
                            onChange={onChange}
                            placeholder="VD: Giáo viên Toán THPT 10 năm kinh nghiệm"
                        />
                        <TeacherProfileImageField
                            value={formData.profileImageMediaId}
                            imageUrl={formData.profileImageUrl}
                            error={errors.profileImageMediaId}
                            onOpen={onOpenImagePicker}
                            onClear={onClearProfileImage}
                        />
                        <Textarea
                            label="Mô tả ngắn"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={onChange}
                            rows={3}
                            maxLength={800}
                        />
                        <Textarea
                            label="Tiểu sử"
                            name="bio"
                            value={formData.bio}
                            onChange={onChange}
                            rows={8}
                            maxLength={5000}
                        />
                    </div>
                )}

                {activeTab === 'teaching' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input label="Chuyên môn" name="expertise" value={formData.expertise} onChange={onChange} />
                            <Input
                                label="Môn/lớp giảng dạy"
                                name="teachingSubjects"
                                value={formData.teachingSubjects}
                                onChange={onChange}
                            />
                            <Input label="Khối lớp" name="gradeLevels" value={formData.gradeLevels} onChange={onChange} />
                            <Input
                                label="Hình thức dạy"
                                name="teachingFormats"
                                value={formData.teachingFormats}
                                onChange={onChange}
                            />
                            <Input
                                label="Số năm kinh nghiệm"
                                name="yearsExperience"
                                type="number"
                                min="0"
                                value={formData.yearsExperience}
                                onChange={onChange}
                                error={errors.yearsExperience}
                            />
                            <Input label="Khu vực dạy" name="teachingArea" value={formData.teachingArea} onChange={onChange} />
                            <Input label="Nơi làm việc" name="workplace" value={formData.workplace} onChange={onChange} />
                            <Input label="Học vấn" name="education" value={formData.education} onChange={onChange} />
                        </div>
                        <Textarea
                            label="Phương pháp giảng dạy"
                            name="teachingMethods"
                            value={formData.teachingMethods}
                            onChange={onChange}
                            rows={4}
                            maxLength={2000}
                        />
                        <TeacherProfileScheduleImagesField
                            mediaIds={formData.scheduleImageMediaIds}
                            imageUrls={formData.scheduleImageUrls}
                            error={errors.scheduleImageMediaIds}
                            onOpen={onOpenScheduleImagePicker}
                            onClear={onClearScheduleImages}
                        />
                        <TeacherProfileScheduleImagesField
                            label="Ảnh lớp học"
                            emptyTitle="Chưa chọn ảnh lớp học"
                            altPrefix="Ảnh lớp học"
                            mediaIds={formData.classroomImageMediaIds}
                            imageUrls={formData.classroomImageUrls}
                            error={errors.classroomImageMediaIds}
                            onOpen={onOpenClassroomImagePicker}
                            onClear={onClearClassroomImages}
                        />
                        <Textarea
                            label="Chứng chỉ"
                            name="certifications"
                            value={formData.certifications}
                            onChange={onChange}
                            rows={3}
                            maxLength={1500}
                        />
                        <Textarea
                            label="Thành tích"
                            name="achievements"
                            value={formData.achievements}
                            onChange={onChange}
                            rows={3}
                            maxLength={1500}
                        />
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input label="Email" name="contactEmail" value={formData.contactEmail} onChange={onChange} />
                            <Input label="Điện thoại" name="contactPhone" value={formData.contactPhone} onChange={onChange} />
                            <Input label="Zalo" name="contactZalo" value={formData.contactZalo} onChange={onChange} />
                            <Input
                                label="Facebook"
                                name="contactFacebook"
                                value={formData.contactFacebook}
                                onChange={onChange}
                            />
                            <Input label="Website" name="contactWebsite" value={formData.contactWebsite} onChange={onChange} />
                            <Input label="Booking URL" name="bookingUrl" value={formData.bookingUrl} onChange={onChange} />
                            <Input label="CTA label" name="ctaLabel" value={formData.ctaLabel} onChange={onChange} />
                            <Input label="CTA URL" name="ctaUrl" value={formData.ctaUrl} onChange={onChange} />
                        </div>
                        <Textarea
                            label="Địa chỉ liên hệ"
                            name="contactAddress"
                            value={formData.contactAddress}
                            onChange={onChange}
                            rows={3}
                            maxLength={1000}
                        />
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        <ToggleRow
                            title="Tự động tạo SEO"
                            description="Backend tự sinh các trường SEO còn trống từ context hồ sơ giáo viên."
                            checked={formData.autoSeo}
                            onChange={(checked) => onModeSwitchChange('autoSeo', checked)}
                        />

                        {!formData.autoSeo && (
                            <>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Input
                                        label="Từ khóa mục tiêu"
                                        name="targetKeyword"
                                        value={formData.targetKeyword}
                                        onChange={onChange}
                                    />
                                    <Input
                                        label="Keyword text"
                                        name="keywordText"
                                        value={formData.keywordText}
                                        onChange={onChange}
                                    />
                                    <Input label="Meta title" name="metaTitle" value={formData.metaTitle} onChange={onChange} />
                                    <Input label="OG title" name="ogTitle" value={formData.ogTitle} onChange={onChange} />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Textarea
                                        label="Meta description"
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={onChange}
                                        rows={3}
                                        maxLength={500}
                                    />
                                    <Textarea
                                        label="OG description"
                                        name="ogDescription"
                                        value={formData.ogDescription}
                                        onChange={onChange}
                                        rows={3}
                                        maxLength={500}
                                    />
                                </div>
                                <Input
                                    label="Search intent"
                                    name="searchIntent"
                                    value={formData.searchIntent}
                                    onChange={onChange}
                                />
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'publish' && (
                    <div className="space-y-6">
                        <Select
                            label="Trạng thái"
                            name="visibility"
                            value={formData.visibility}
                            onChange={onChange}
                            options={TEACHER_PROFILE_VISIBILITY_OPTIONS}
                        />

                        <ToggleRow
                            title="Hồ sơ nổi bật"
                            description="Ưu tiên hiển thị hồ sơ này ở các vị trí nổi bật."
                            checked={formData.isFeatured}
                            onChange={onSwitchChange}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="SEO score"
                                name="seoScore"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.seoScore}
                                onChange={onChange}
                                error={errors.seoScore}
                            />
                            <Input
                                label="Thứ tự sắp xếp"
                                name="sortOrder"
                                type="number"
                                min="0"
                                value={formData.sortOrder}
                                onChange={onChange}
                                error={errors.sortOrder}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy
                </Button>
                <Button type="submit" loading={loading} disabled={loading}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};
