export const getCourseMedia = (course) => ({
    thumbnail: course?.media?.thumbnail || course?.thumbnail || null,
    banner: course?.media?.banner || course?.banner || null,
    introVideo: course?.media?.introVideo || course?.introVideo || null,
    gallery: course?.media?.gallery || course?.gallery || [],
});

export const getMediaViewUrl = (media) =>
    media?.viewUrl || media?.downloadUrl || media?.url || media?.publicUrl || "";

export const getMediaName = (media) =>
    media?.originalName || media?.fileName || `Media #${media?.mediaId || ""}`;
