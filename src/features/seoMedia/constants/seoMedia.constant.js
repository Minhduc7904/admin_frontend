export const SEO_MEDIA_PAGES = [
  {
    key: 'home',
    pageKey: 'home',
    name: 'Trang chủ',
    path: '/',
    slots: [
      { value: 'home_hero', label: 'Banner chính', ratio: '16:9', size: '1920 x 1080' },
      { value: 'home_featured_courses', label: 'Khóa học nổi bật', ratio: '4:3', size: '1200 x 900' },
      { value: 'home_testimonials', label: 'Cảm nhận học viên', ratio: '1:1', size: '1000 x 1000' },
    ],
  },
  {
    key: 'about',
    pageKey: 'about',
    name: 'Giới thiệu',
    path: '/gioi-thieu',
    slots: [
      { value: 'about_banner', label: 'Banner giới thiệu', ratio: '16:9', size: '1920 x 1080' },
      { value: 'about_story', label: 'Câu chuyện trung tâm', ratio: '4:3', size: '1200 x 900' },
    ],
  },
  {
    key: 'offline_courses',
    pageKey: 'offline_courses',
    name: 'Khóa học offline',
    path: '/khoa-hoc-offline',
    slots: [
      { value: 'offline_courses_banner', label: 'Banner khóa offline', ratio: '16:9', size: '1920 x 1080' },
      { value: 'offline_courses_classroom', label: 'Ảnh lớp học offline', ratio: '4:3', size: '1200 x 900' },
    ],
  },
  {
    key: 'online_courses',
    pageKey: 'online_courses',
    name: 'Khóa học online',
    path: '/khoa-hoc-online',
    slots: [
      { value: 'online_courses_banner', label: 'Banner khóa online', ratio: '16:9', size: '1920 x 1080' },
      { value: 'online_courses_preview', label: 'Preview học online', ratio: '4:3', size: '1200 x 900' },
    ],
  },
  {
    key: 'achievements',
    pageKey: 'achievements',
    name: 'Thành tích',
    path: '/thanh-tich',
    slots: [
      { value: 'achievements_banner', label: 'Banner thành tích', ratio: '16:9', size: '1920 x 1080' },
      { value: 'achievements_students', label: 'Ảnh học viên tiêu biểu', ratio: '4:3', size: '1200 x 900' },
    ],
  },
  {
    key: 'library',
    pageKey: 'library',
    name: 'Thư viện',
    path: '/thu-vien',
    slots: [
      { value: 'library_banner', label: 'Banner thư viện', ratio: '16:9', size: '1920 x 1080' },
      { value: 'library_featured', label: 'Ảnh nổi bật', ratio: '4:3', size: '1200 x 900' },
    ],
  },
  {
    key: 'team',
    pageKey: 'team',
    name: 'Đội ngũ',
    path: '/doi-ngu',
    slots: [
      { value: 'team_banner', label: 'Banner đội ngũ', ratio: '16:9', size: '1920 x 1080' },
      { value: 'team_teachers', label: 'Ảnh giáo viên', ratio: '4:3', size: '1200 x 900' },
    ],
  },
  {
    key: 'contact',
    pageKey: 'contact',
    name: 'Liên hệ',
    path: '/lien-he',
    slots: [
      { value: 'contact_banner', label: 'Banner liên hệ', ratio: '16:9', size: '1920 x 1080' },
      { value: 'contact_location', label: 'Ảnh bản đồ hoặc trung tâm', ratio: '4:3', size: '1200 x 900' },
    ],
  },
];

export const SLOT_TYPE_OPTIONS = [
  { value: 'image', label: 'Anh' },
  { value: 'video', label: 'Video' },
  { value: 'gif', label: 'GIF' },
];

export const SLOT_TYPE_ACCEPT_CONFIG = {
  image: {
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    label: 'JPG, PNG, WebP',
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    extensions: ['.mp4', '.webm', '.ogg', '.mov'],
    label: 'MP4, WebM, OGG, MOV',
  },
  gif: {
    mimeTypes: ['image/gif'],
    extensions: ['.gif'],
    label: 'GIF',
  },
};

const ALL_SLOT_MIME_TYPES = Object.values(SLOT_TYPE_ACCEPT_CONFIG).flatMap((config) => config.mimeTypes);
const ALL_SLOT_EXTENSIONS = Object.values(SLOT_TYPE_ACCEPT_CONFIG).flatMap((config) => config.extensions);

export const DEFAULT_SLOT_ACCEPT_CONFIG = {
  mimeTypes: ALL_SLOT_MIME_TYPES,
  extensions: ALL_SLOT_EXTENSIONS,
  label: 'JPG, PNG, WebP, GIF, MP4, WebM, OGG, MOV',
};

export const getSlotAcceptConfig = (slotType) => SLOT_TYPE_ACCEPT_CONFIG[slotType] || DEFAULT_SLOT_ACCEPT_CONFIG;

export const getSeoPageByPageKey = (pageKey) => {
  return SEO_MEDIA_PAGES.find((page) => page.pageKey === pageKey);
};
