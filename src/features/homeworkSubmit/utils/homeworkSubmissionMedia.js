export const getHomeworkSubmissionMedia = (attachment) => attachment?.media ?? attachment;

export const isHomeworkSubmissionImage = (attachment) => {
    const media = getHomeworkSubmissionMedia(attachment);
    return media?.type === 'IMAGE' || media?.mimeType?.startsWith('image/');
};

export const isHomeworkSubmissionPdf = (attachment) => {
    const media = getHomeworkSubmissionMedia(attachment);
    return media?.mimeType === 'application/pdf' || media?.originalName?.toLowerCase().endsWith('.pdf');
};
