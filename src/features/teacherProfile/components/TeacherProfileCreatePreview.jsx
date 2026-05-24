import { Badge } from '../../../shared/components/ui';
import { TEACHER_PROFILE_VISIBILITY_LABELS } from '../constants/teacherProfile.constants';

const getMissingFields = (formData) => {
    const missing = [];

    if (!formData.displayName.trim()) missing.push('Tên hiển thị');

    return missing;
};

export const TeacherProfileCreatePreview = ({ formData }) => {
    const missingFields = getMissingFields(formData);

    return (
        <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-sm border border-border bg-white p-5">
            <div className="space-y-6">
                <section className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant={formData.autoSeo ? 'info' : 'secondary'} size="small">
                            {formData.autoSeo ? 'SEO tự động' : 'SEO thủ công'}
                        </Badge>
                        <Badge variant={formData.isFeatured ? 'primary' : 'secondary'} size="small">
                            {formData.isFeatured ? 'Nổi bật' : 'Không nổi bật'}
                        </Badge>
                        <Badge variant={missingFields.length === 0 ? 'success' : 'warning'} size="small">
                            {missingFields.length === 0 ? 'Đủ dữ liệu để lưu' : `Còn thiếu ${missingFields.length} trường`}
                        </Badge>
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-blue-700">Preview hồ sơ giáo viên</div>
                        <h2 className="mt-2 text-2xl font-bold text-blue-900">
                            {formData.displayName || 'Tên giáo viên'}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {formData.headline || 'Headline sẽ hiển thị tại đây'}
                        </p>
                    </div>

                    <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
                        <div className="space-y-4">
                            <p className="text-sm leading-6 text-slate-700">
                                {formData.shortDescription ||
                                    'Mô tả ngắn giúp người đọc nắm nhanh chuyên môn và thế mạnh của giáo viên.'}
                            </p>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="text-slate-500">Kinh nghiệm</div>
                                    <div className="font-semibold text-slate-800">
                                        {formData.yearsExperience || 0} năm
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500">Trạng thái</div>
                                    <div className="font-semibold text-slate-800">
                                        {TEACHER_PROFILE_VISIBILITY_LABELS[formData.visibility] || formData.visibility}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500">Khu vực</div>
                                    <div className="font-semibold text-slate-800">{formData.teachingArea || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500">Thứ tự</div>
                                    <div className="font-semibold text-slate-800">{formData.sortOrder || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700">Thông tin giảng dạy</h3>
                    <dl className="space-y-3 text-sm">
                        <div>
                            <dt className="text-slate-500">Chuyên môn</dt>
                            <dd className="text-slate-800">{formData.expertise || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Môn/lớp giảng dạy</dt>
                            <dd className="text-slate-800">{formData.teachingSubjects || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Phương pháp</dt>
                            <dd className="text-slate-800">{formData.teachingMethods || '-'}</dd>
                        </div>
                    </dl>
                </section>

                <section className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700">SEO</h3>
                    <dl className="space-y-3 text-sm">
                        <div>
                            <dt className="text-slate-500">Từ khóa mục tiêu</dt>
                            <dd className="text-slate-800">
                                {formData.autoSeo ? 'Backend tự sinh nếu để trống' : formData.targetKeyword || '-'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Meta title</dt>
                            <dd className="text-slate-800">
                                {formData.autoSeo ? 'Backend tự sinh nếu để trống' : formData.metaTitle || '-'}
                            </dd>
                        </div>
                    </dl>
                </section>

                {missingFields.length > 0 && (
                    <section>
                        <h3 className="text-sm font-semibold text-slate-700">Trường còn thiếu</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {missingFields.map((field) => (
                                <span
                                    key={field}
                                    className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                                >
                                    {field}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
