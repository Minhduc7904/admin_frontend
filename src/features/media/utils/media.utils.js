// media.utils.js
export const MEDIA_TYPES = {
  IMAGE: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  VIDEO: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  AUDIO: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

export const getMediaType = (mimeType) => {
  if (MEDIA_TYPES.IMAGE.includes(mimeType)) return "IMAGE";
  if (MEDIA_TYPES.VIDEO.includes(mimeType)) return "VIDEO";
  if (MEDIA_TYPES.AUDIO.includes(mimeType)) return "AUDIO";
  if (MEDIA_TYPES.DOCUMENT.includes(mimeType)) return "DOCUMENT";
  return "OTHER";
};

// ✅ chỉ trả về KEY, không JSX
export const getFileIconType = (mediaType) => {
  switch (mediaType) {
    case "IMAGE":
      return "IMAGE";
    case "VIDEO":
      return "VIDEO";
    case "AUDIO":
      return "AUDIO";
    case "DOCUMENT":
      return "DOCUMENT";
    default:
      return "FILE";
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
