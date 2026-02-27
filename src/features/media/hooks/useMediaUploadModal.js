import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  getPresignedUploadUrlAsync,
  postUploadCompleteAsync,
  updateMediaAsync,
} from "../store/mediaSlice";
import { getMediaType } from "../utils/media.utils";

export const useMediaUploadModal = ({ folderId = null, onUploaded, onClose }) => {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [alt, setAlt] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  // Upload progress state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState(null);

  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Kích thước file không được vượt quá 100MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return;

    setFile(file);
    setUploadSuccess(false);
    setUploadedMedia(null);
    setUploadProgress(0);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng chọn file để tải lên");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const mediaType = getMediaType(file.type);

      // 1️⃣ Lấy presigned URL
      const presigned = await dispatch(
        getPresignedUploadUrlAsync({
          originalFilename: file.name,
          mimeType: file.type,
          fileSize: file.size,
          type: mediaType,
          folderId: folderId || null,
        })
      ).unwrap();

      // 2️⃣ Upload thẳng lên MinIO với progress
      await axios.put(presigned.data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });

      // 3️⃣ Thông báo backend upload hoàn tất
      const completed = await dispatch(
        postUploadCompleteAsync({
          mediaId: presigned.data.mediaId,
          uploadedSize: file.size,
        })
      ).unwrap();

      let result = completed.data;

      // 4️⃣ Cập nhật description / alt nếu có
      if (description.trim() || (alt.trim() && mediaType === "IMAGE")) {
        const updatePayload = {};
        if (description.trim()) updatePayload.description = description.trim();
        if (alt.trim() && mediaType === "IMAGE") updatePayload.alt = alt.trim();

        try {
          const updated = await dispatch(
            updateMediaAsync({ id: result.mediaId, data: updatePayload })
          ).unwrap();
          if (updated?.data) result = updated.data;
        } catch (_) {
          // Non-critical, continue
        }
      }

      // Attach local preview for immediate display
      if (preview) result = { ...result, _localPreview: preview };

      setUploadedMedia(result);
      setUploadSuccess(true);
      onUploaded?.(result);
    } catch (err) {
      console.error("Upload thất bại:", err);
      setError("Tải lên thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setDescription("");
    setAlt("");
    setError(null);
    setDragActive(false);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setDescription("");
    setAlt("");
    setError(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    state: {
      file,
      preview,
      description,
      alt,
      dragActive,
      error,
      fileType: file ? getMediaType(file.type) : null,
      isUploading,
      uploadProgress,
      uploadSuccess,
      uploadedMedia,
    },
    refs: { fileInputRef },
    handlers: {
      setDescription,
      setAlt,
      setDragActive,
      handleFile,
      handleSubmit,
      handleClose,
      handleReset,
    },
  };
};
