import { useState, useRef } from "react";
import { getMediaType } from "../utils/media.utils";

export const useMediaUploadModal = ({ onUpload, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [alt, setAlt] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

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

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng chọn file để tải lên");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (description) formData.append("description", description);
    if (alt && file.type.startsWith("image/")) formData.append("alt", alt);

    await onUpload(formData);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setDescription("");
    setAlt("");
    setError(null);
    setDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
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
    },
    refs: {
      fileInputRef,
    },
    handlers: {
      setDescription,
      setAlt,
      setDragActive,
      handleFile,
      handleSubmit,
      handleClose,
    },
  };
};
