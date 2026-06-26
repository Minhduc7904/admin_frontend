export const getSeoMediaType = (slotType) => (slotType === 'video' ? 'VIDEO' : 'IMAGE');

export const getMediaName = (media) => media?.originalName || media?.fileName || media?.objectKey || 'seo-media';

export const getMediaPublicUrl = (media) => {
  if (!media) return '';
  if (media.publicUrl) return media.publicUrl;
  if (media.url) return media.url;
  if (media.viewUrl) return media.viewUrl;
  if (media.objectKey) return media.objectKey.startsWith('/') ? media.objectKey : `/${media.objectKey}`;
  return '';
};

export const getMediaKey = (media) => media?.objectKey || media?.publicUrl || getMediaName(media);

export const isVideoMedia = (media) => media?.mediaType === 'VIDEO' || media?.mimeType?.startsWith('video/');

export const isAcceptedSeoMediaItem = (media, acceptConfig) => {
  if (!media) return false;
  if (media.mimeType && acceptConfig.mimeTypes.includes(media.mimeType)) return true;

  const lowerName = getMediaName(media).toLowerCase();
  return acceptConfig.extensions.some((extension) => lowerName.endsWith(extension));
};

export const isAcceptedFile = (file, acceptConfig) => {
  if (!file) return false;
  if (file.type && acceptConfig.mimeTypes.includes(file.type)) return true;

  const lowerName = file.name.toLowerCase();
  return acceptConfig.extensions.some((extension) => lowerName.endsWith(extension));
};

export const buildSeoMediaPayload = (media) => ({
  bucketName: media.bucketName || 'seo-media',
  objectKey: media.objectKey,
  publicUrl: getMediaPublicUrl(media),
  originalName: getMediaName(media),
  mimeType: media.mimeType,
  mediaType: media.mediaType || (isVideoMedia(media) ? 'VIDEO' : 'IMAGE'),
  fileSize: media.fileSize,
  width: media.width,
  height: media.height,
  duration: media.duration,
});
