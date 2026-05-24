import { Badge } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/dateTime';
import { TEACHER_PROFILE_VISIBILITY_LABELS } from '../constants/teacherProfile.constants';

const InfoItem = ({ label, value }) => (
    <div>
        <dt className="text-foreground-light">{label}</dt>
        <dd className="mt-1 whitespace-pre-line text-foreground">{value === '' || value == null ? '-' : value}</dd>
    </div>
);

export const TeacherProfileDetailContent = ({ teacherProfile }) => {
    return (
        <div className="space-y-6">
            <section className="rounded-sm border border-border bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="info" size="small">
                        {TEACHER_PROFILE_VISIBILITY_LABELS[teacherProfile.visibility] || teacherProfile.visibility}
                    </Badge>
                    <Badge variant={teacherProfile.isFeatured ? 'primary' : 'secondary'} size="small">
                        {teacherProfile.isFeatured ? 'Nổi bật' : 'Không nổi bật'}
                    </Badge>
                </div>
                <h1 className="text-2xl font-bold text-foreground">{teacherProfile.displayName}</h1>
                <p className="mt-1 font-mono text-sm text-foreground-light">{teacherProfile.slug}</p>
                {teacherProfile.headline && (
                    <p className="mt-3 text-sm font-medium text-foreground">{teacherProfile.headline}</p>
                )}
                {teacherProfile.shortDescription && (
                    <p className="mt-2 text-sm text-foreground-light">{teacherProfile.shortDescription}</p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-4 rounded-sm border border-border p-4 text-sm md:grid-cols-4">
                    <div>
                        <div className="text-foreground-light">Lượt xem</div>
                        <div className="font-semibold text-foreground">{teacherProfile.viewCount || 0}</div>
                    </div>
                    <div>
                        <div className="text-foreground-light">SEO score</div>
                        <div className="font-semibold text-foreground">{teacherProfile.seoScore ?? '-'}</div>
                    </div>
                    <div>
                        <div className="text-foreground-light">Thứ tự</div>
                        <div className="font-semibold text-foreground">{teacherProfile.sortOrder ?? '-'}</div>
                    </div>
                    <div>
                        <div className="text-foreground-light">Cập nhật</div>
                        <div className="font-semibold text-foreground">{formatDateTime(teacherProfile.updatedAt)}</div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-6">
                    <section className="rounded-sm border border-border bg-white p-5">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Thông tin giảng dạy</h2>
                        <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <InfoItem label="Chuyên môn" value={teacherProfile.expertise} />
                            <InfoItem label="Môn/lớp giảng dạy" value={teacherProfile.teachingSubjects} />
                            <InfoItem label="Khối lớp" value={teacherProfile.gradeLevels} />
                            <InfoItem label="Hình thức dạy" value={teacherProfile.teachingFormats} />
                            <InfoItem label="Số năm kinh nghiệm" value={teacherProfile.yearsExperience} />
                            <InfoItem label="Khu vực dạy" value={teacherProfile.teachingArea} />
                            <InfoItem label="Nơi làm việc" value={teacherProfile.workplace} />
                            <InfoItem label="Học vấn" value={teacherProfile.education} />
                            <InfoItem label="Phương pháp" value={teacherProfile.teachingMethods} />
                            <InfoItem label="Chứng chỉ" value={teacherProfile.certifications} />
                            <InfoItem label="Thành tích" value={teacherProfile.achievements} />
                        </dl>
                    </section>

                    <section className="rounded-sm border border-border bg-white p-5">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Tiểu sử</h2>
                        {teacherProfile.bio ? (
                            <p className="whitespace-pre-line text-sm leading-6 text-foreground">{teacherProfile.bio}</p>
                        ) : (
                            <p className="text-sm text-foreground-light">Chưa có tiểu sử.</p>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-sm border border-border bg-white p-5">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Liên hệ</h2>
                        <dl className="space-y-3 text-sm">
                            <InfoItem label="Email" value={teacherProfile.contactEmail} />
                            <InfoItem label="Điện thoại" value={teacherProfile.contactPhone} />
                            <InfoItem label="Zalo" value={teacherProfile.contactZalo} />
                            <InfoItem label="Facebook" value={teacherProfile.contactFacebook} />
                            <InfoItem label="Website" value={teacherProfile.contactWebsite} />
                            <InfoItem label="Địa chỉ" value={teacherProfile.contactAddress} />
                            <InfoItem label="Booking URL" value={teacherProfile.bookingUrl} />
                            <InfoItem label="CTA" value={[teacherProfile.ctaLabel, teacherProfile.ctaUrl].filter(Boolean).join(' - ')} />
                        </dl>
                    </section>

                    <section className="rounded-sm border border-border bg-white p-5">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">SEO</h2>
                        <dl className="space-y-3 text-sm">
                            <InfoItem label="Từ khóa mục tiêu" value={teacherProfile.targetKeyword} />
                            <InfoItem label="Keyword text" value={teacherProfile.keywordText} />
                            <InfoItem label="Meta title" value={teacherProfile.metaTitle} />
                            <InfoItem label="Meta description" value={teacherProfile.metaDescription} />
                            <InfoItem label="OG title" value={teacherProfile.ogTitle} />
                            <InfoItem label="OG description" value={teacherProfile.ogDescription} />
                            <InfoItem label="Search intent" value={teacherProfile.searchIntent} />
                        </dl>
                    </section>
                </div>
            </div>
        </div>
    );
};
