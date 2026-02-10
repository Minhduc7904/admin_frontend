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
  
  // Multiple upload state
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedMediaList, setUploadedMediaList] = useState([]);

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
   * Xử lý upload 1 file
   */
  const processFile = async (file) => {
    // Validate dung lượng
    if (file.size > acceptedTypes.maxSize * 1024 * 1024) {
      alert(`File vượt quá ${acceptedTypes.maxSize}MB`);
      return null;
    }

    setUploadFile(file);

    // Preview ảnh
    if (file.type.startsWith("image/") && !multiple) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
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

      return completed.data;
    } catch (error) {
      console.error("Upload thất bại:", error);
      setUploadProgress(0);
      return null;
    }
  };

  /**
   * Xử lý upload nhiều files (tuần tự)
   */
  const processFiles = async (files) => {
    const fileArray = Array.from(files);
    setTotalFiles(fileArray.length);
    setUploadedCount(0);
    setUploadedMediaList([]);
    setUploadProgress(0);

    const uploadedList = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const result = await processFile(file);
      
      if (result) {
        uploadedList.push(result);
        setUploadedCount(i + 1);
        
        // Call onUploaded for each file if in multiple mode
        if (multiple) {
          onUploaded?.(result);
        }
      }
      
      // Update overall progress
      const overallProgress = Math.round(((i + 1) / fileArray.length) * 100);
      setUploadProgress(overallProgress);
    }

    setUploadedMediaList(uploadedList);
    
    if (uploadedList.length > 0) {
      setUploadSuccess(true);
      setUploadedMediaData(uploadedList[uploadedList.length - 1]); // Last uploaded
      
      // Call onUploaded with last item if single mode
      if (!multiple) {
        onUploaded?.(uploadedList[0]);
      }
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
    setUploadedCount(0);
    setTotalFiles(0);
    setUploadedMediaList([]);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset state first
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedMediaData(null);

    if (multiple && files.length > 1) {
      processFiles(files);
    } else {
      processFile(files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Reset state first
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedMediaData(null);

    if (multiple && files.length > 1) {
      processFiles(files);
    } else {
      processFile(files[0]);
    }
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
      uploadedCount,
      totalFiles,
      uploadedMediaList,
    },
    handlers: {
      fileChange: handleFileChange,
      dragEnter: (e) => {
        e.preventDefault();
        setIsDragging(true);
      },
      dragLeave: (e) => {
        e.preventDefault();
        setIsDragging(false);
      },
      dragOver: (e) => e.preventDefault(),
      drop: handleDrop,
      reset,
    },
    acceptedTypes,
  };
};
