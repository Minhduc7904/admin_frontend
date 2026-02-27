import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getPresignedUploadUrlAsync,
  postUploadCompleteAsync,
  selectMediaLoadingGetPresignedUrl,
  selectMediaLoadingCompleteUpload,
} from "../store/mediaSlice";

export const useMediaUpload = ({ type, folderId, onUploaded, multiple = false }) => {
  const dispatch = useDispatch();

  const loadingPresignedUrl = useSelector(selectMediaLoadingGetPresignedUrl);
  const loadingCompleteUpload = useSelector(selectMediaLoadingCompleteUpload);
  const loadingUpload = loadingPresignedUrl || loadingCompleteUpload;

  // --- Pending (selected but not yet uploaded) ---
  const [pendingFiles, setPendingFiles] = useState([]);   // File[]
  const [pendingPreviews, setPendingPreviews] = useState([]); // string[] (objectURLs)
  const [isDragging, setIsDragging] = useState(false);

  // --- Upload progress ---
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // --- Result ---
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedMediaData, setUploadedMediaData] = useState(null);
  const [uploadedMediaList, setUploadedMediaList] = useState([]);

  const acceptedTypes = useMemo(() => {
    switch (type) {
      case "IMAGE":    return { accept: "image/*", maxSize: 5, label: "ảnh" };
      case "VIDEO":    return { accept: "video/*", maxSize: 100, label: "video" };
      case "AUDIO":    return { accept: "audio/*", maxSize: 20, label: "audio" };
      case "DOCUMENT": return { accept: ".pdf,.doc,.docx,.xls,.xlsx", maxSize: 10, label: "tài liệu" };
      default:         return { accept: "*/*", maxSize: 100, label: "tất cả" };
    }
  }, [type]);

  // Build object-URL previews for an array of File objects
  const buildPreviews = (files) =>
    files.map(f => f.type.startsWith("image/") ? URL.createObjectURL(f) : null);

  // Revoke pending previews to free memory
  const revokePreviews = (previews) =>
    previews.forEach(p => { if (p) URL.revokeObjectURL(p); });

  /**
   * Validate + set pending files (no upload yet)
   */
  const setPending = (fileList) => {
    const files = Array.from(fileList).filter(f => {
      if (f.size > acceptedTypes.maxSize * 1024 * 1024) {
        alert(`File "${f.name}" vượt quá ${acceptedTypes.maxSize}MB`);
        return false;
      }
      return true;
    });
    if (!files.length) return;

    revokePreviews(pendingPreviews);
    const chosen = multiple ? files : [files[0]];
    setPendingFiles(chosen);
    setPendingPreviews(buildPreviews(chosen));

    // Reset result state
    setUploadSuccess(false);
    setUploadedMediaData(null);
    setUploadedMediaList([]);
    setUploadProgress(0);
    setUploadedCount(0);
  };

  /**
   * Upload a single File, returns media result or null
   */
  const processFile = async (file, localPreview) => {
    try {
      const presigned = await dispatch(
        getPresignedUploadUrlAsync({
          originalFilename: file.name,
          mimeType: file.type,
          fileSize: file.size,
          type,
          folderId,
        })
      ).unwrap();

      await axios.put(presigned.data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          if (!event.total) return;
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      const completed = await dispatch(
        postUploadCompleteAsync({
          mediaId: presigned.data.mediaId,
          uploadedSize: file.size,
        })
      ).unwrap();

      return localPreview
        ? { ...completed.data, _localPreview: localPreview }
        : completed.data;
    } catch (error) {
      console.error("Upload thất bại:", error);
      return null;
    }
  };

  /**
   * Trigger actual upload of pending files
   */
  const handleUpload = async () => {
    if (!pendingFiles.length || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);

    const uploadedList = [];

    for (let i = 0; i < pendingFiles.length; i++) {
      const result = await processFile(pendingFiles[i], pendingPreviews[i]);
      if (result) {
        uploadedList.push(result);
        setUploadedCount(i + 1);
        if (multiple) onUploaded?.(result);
      }
      if (pendingFiles.length > 1) {
        setUploadProgress(Math.round(((i + 1) / pendingFiles.length) * 100));
      }
    }

    setUploadedMediaList(uploadedList);
    setIsUploading(false);

    if (uploadedList.length > 0) {
      setUploadSuccess(true);
      setUploadedMediaData(uploadedList[uploadedList.length - 1]);
      if (!multiple) onUploaded?.(uploadedList[0]);
    }
  };

  /**
   * Reset all state
   */
  const reset = () => {
    revokePreviews(pendingPreviews);
    setPendingFiles([]);
    setPendingPreviews([]);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedCount(0);
    setUploadSuccess(false);
    setUploadedMediaData(null);
    setUploadedMediaList([]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) setPending(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) setPending(e.dataTransfer.files);
  };

  return {
    state: {
      // pending
      pendingFiles,
      pendingPreviews,
      isDragging,
      // progress
      isUploading,
      loadingUpload,
      uploadProgress,
      uploadedCount,
      totalFiles: pendingFiles.length,
      // result
      uploadSuccess,
      uploadedMediaData,
      uploadedMediaList,
      // legacy aliases kept for UploadTab
      uploadFile: pendingFiles[0] ?? null,
      uploadPreview: pendingPreviews[0] ?? null,
    },
    handlers: {
      fileChange: handleFileChange,
      dragEnter: (e) => { e.preventDefault(); setIsDragging(true); },
      dragLeave: (e) => { e.preventDefault(); setIsDragging(false); },
      dragOver:  (e) => e.preventDefault(),
      drop: handleDrop,
      upload: handleUpload,
      reset,
    },
    acceptedTypes,
  };
};
