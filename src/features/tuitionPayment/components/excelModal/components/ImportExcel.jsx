import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Upload, FileSpreadsheet, X } from 'lucide-react'

import { Button } from '../../../../../shared/components/ui'
import {
    selectTuitionPaymentLoadingImport,
    importTuitionPaymentExcelPreviewAsync,
} from '../../../store/tuitionPaymentSlice'

export const ImportExcel = ({ onFileUploaded }) => {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const loading = useSelector(selectTuitionPaymentLoadingImport)

    const [file, setFile] = useState(null)
    const [dragging, setDragging] = useState(false)

    /* ===================== HANDLERS ===================== */
    const handleSelectFile = (f) => {
        if (!f.name.endsWith('.xlsx')) {
            alert('Chỉ hỗ trợ file .xlsx')
            return
        }
        setFile(f)
    }

    const handleClearFile = () => {
        setFile(null)

        // reset input để có thể chọn lại cùng file
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    const handleUpload = async () => {
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        await dispatch(
            importTuitionPaymentExcelPreviewAsync(formData)
        ).unwrap()
        
        // Save file for future refresh
        if (onFileUploaded) {
            onFileUploaded(file)
        }
    }

    /* ===================== RENDER ===================== */
    return (
        <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm flex items-center gap-2">
                <Upload size={16} /> Import Excel
            </h3>

            {/* DROP ZONE */}
            <div
                className={`
                    border-2 border-dashed rounded-lg px-4 py-6
                    text-center cursor-pointer transition
                    ${dragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
                `}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    const f = e.dataTransfer.files?.[0]
                    if (f) handleSelectFile(f)
                }}
            >
                <Upload className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm">
                    Kéo thả file hoặc <span className="text-gray-500">chọn file</span>
                </p>
                <p className="text-xs text-gray-400">.xlsx</p>

                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept=".xlsx"
                    onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleSelectFile(f)
                    }}
                />
            </div>

            {/* FILE PREVIEW */}
            {file && (
                <div className="flex items-center justify-between gap-3 text-sm bg-gray-50 px-3 py-2 rounded">
                    <div className="flex items-center gap-2 truncate">
                        <FileSpreadsheet size={16} />
                        <span className="truncate">{file.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            size="sm"
                            loading={loading}
                            onClick={handleUpload}
                        >
                            Upload
                        </Button>

                        {/* CLEAR FILE */}
                        <button
                            type="button"
                            onClick={handleClearFile}
                            className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition"
                            title="Bỏ file"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
