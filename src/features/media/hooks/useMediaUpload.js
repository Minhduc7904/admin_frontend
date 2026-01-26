import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getPresignedUploadUrlAsync,
  postUploadCompleteAsync,
  selectMediaLoadingGetPresignedUrl,
  selectMediaLoadingCompleteUpload,
} from "../store/mediaSlice";

export const useMediaUpload = ({ type, folderId, onUploaded }) => {
  const dispatch = useDispatch();

  // Loading từ redux
  const loadingPresignedUrl = useSelector(selectMediaLoadingGetPresignedUrl);
  const loadingCompleteUpload = useSelector(selectMediaLoadingCompleteUpload);
  const loadingUpload = loadingPresignedUrl || loadingCompleteUpload;

  // State local
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedMediaData, setUploadedMediaData] = useState(null);

  /**
   * Cấu hình loại file được phép upload
   */
  const acceptedTypes = useMemo(() => {
    switch (type) {
      case "IMAGE":
        return { accept: "image/*", maxSize: 5, label: "ảnh" };
      case "VIDEO":
        return { accept: "video/*", maxSize: 100, label: "video" };
      case "AUDIO":
        return { accept: "audio/*", maxSize: 20, label: "audio" };
      case "DOCUMENT":
        return {
          accept: ".pdf,.doc,.docx,.xls,.xlsx",
          maxSize: 10,
          label: "tài liệu",
        };
      default:
        return { accept: "*/*", maxSize: 100, label: "tất cả" };
    }
  }, [type]);

  /**
   * Xử lý upload file
   */
  const processFile = async (file) => {
    // Validate dung lượng
    if (file.size > acceptedTypes.maxSize * 1024 * 1024) {
      alert(`File vượt quá ${acceptedTypes.maxSize}MB`);
      return;
    }

    // Reset state
    setUploadFile(file);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedMediaData(null);

    // Preview ảnh
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null);
    }

    try {
      /**
       * 1️⃣ Lấy presigned URL
       */
      const presigned = await dispatch(
        getPresignedUploadUrlAsync({
          originalFilename: file.name,
          mimeType: file.type,
          fileSize: file.size,
          type,
          folderId,
        })
      ).unwrap();

      /**
       * 2️⃣ Upload trực tiếp lên MinIO (CÓ PROGRESS)
       * ⚠️ KHÔNG dùng axiosClient
       */
      await axios.put(presigned.data.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });

      /**
       * 3️⃣ Thông báo backend upload hoàn tất
       */
      const completed = await dispatch(
        postUploadCompleteAsync({
          mediaId: presigned.data.mediaId,
          uploadedSize: file.size,
        })
      ).unwrap();

      setUploadSuccess(true);
      setUploadedMediaData(completed.data);
      onUploaded?.(completed.data);
    } catch (error) {
      console.error("Upload thất bại:", error);
      setUploadProgress(0);
    }
  };

  /**
   * Reset toàn bộ state upload
   */
  const reset = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedMediaData(null);
  };

  return {
    state: {
      uploadFile,
      uploadPreview,
      uploadProgress,
      uploadSuccess,
      uploadedMediaData,
      isDragging,
      loadingUpload,
    },
    handlers: {
      fileChange: (e) => e.target.files?.[0] && processFile(e.target.files[0]),
      dragEnter: (e) => {
        e.preventDefault();
        setIsDragging(true);
      },
      dragLeave: (e) => {
        e.preventDefault();
        setIsDragging(false);
      },
      dragOver: (e) => e.preventDefault(),
      drop: (e) => {
        e.preventDefault();
        setIsDragging(false);
        e.dataTransfer.files?.[0] && processFile(e.dataTransfer.files[0]);
      },
      reset,
    },
    acceptedTypes,
  };
};
