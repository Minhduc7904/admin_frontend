import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Modal } from '../../../../shared/components/ui'
import {
    selectImportPreview,
    selectTuitionPaymentLoadingImport,
    setImportPreview,
    createBulkArrayTuitionPaymentAsync,
    updateBulkArrayTuitionPaymentAsync,
    selectTuitionPaymentLoadingCreateBulkArray,
    selectTuitionPaymentLoadingUpdateBulkArray,
    importTuitionPaymentExcelPreviewAsync,
} from '../../store/tuitionPaymentSlice'

import {
    ExportExcel,
    ImportExcel,
    SummaryCards,
    NewPaymentsTable,
    ExistingPaymentsTable,
    UnchangedPaymentsTable,
    InvalidRowsTable,
} from './components'

/* ======================================================
 * ROOT
 * ====================================================== */
export const ExportExcelModal = ({ isOpen, onClose }) => {
    const preview = useSelector(selectImportPreview)
    const dispatch = useDispatch()
    const loadingImport = useSelector(selectTuitionPaymentLoadingImport)
    const loadingCreate = useSelector(selectTuitionPaymentLoadingCreateBulkArray)
    const loadingUpdate = useSelector(selectTuitionPaymentLoadingUpdateBulkArray)
    const [activeTab, setActiveTab] = useState('new')
    const [lastUploadedFile, setLastUploadedFile] = useState(null)
    
    // Auto select first available tab when preview changes
    useEffect(() => {
        if (preview) {
            const { summary } = preview
            if (summary.newPayments > 0) setActiveTab('new')
            else if (summary.existingPayments > 0) setActiveTab('existing')
            else if (summary.unchangedPayments > 0) setActiveTab('unchanged')
            else if (summary.invalidRows > 0) setActiveTab('invalid')
        }
    }, [preview])
    
    const handleClose = () => {
        if (loadingImport) return
        dispatch(setImportPreview(null))
        setActiveTab('new')
        onClose()
    }

    const handleAddPayments = async (selectedData) => {
        // Transform data to match API format
        const payments = selectedData.map(item => ({
            studentId: item.student.studentId,
            amount: item.payment.amount,
            month: item.payment.month,
            year: item.payment.year,
            status: item.payment.status,
            notes: item.payment.notes || '',
            paidAt: item.payment.paidAt || undefined,
            courseId: item.payment.courseId || undefined,
        }))

        try {
            await dispatch(createBulkArrayTuitionPaymentAsync({ payments })).unwrap()
            
            // Refresh preview with the same file
            if (lastUploadedFile) {
                const formData = new FormData()
                formData.append('file', lastUploadedFile)
                await dispatch(importTuitionPaymentExcelPreviewAsync(formData)).unwrap()
            }
        } catch (error) {
            console.error('Error adding payments:', error)
        }
    }

    const handleUpdatePayments = async (selectedData) => {
        // Transform data to match API format
        const payments = selectedData.map(item => ({
            paymentId: item.oldPayment.paymentId,
            status: item.newPayment.status,
            amount: item.newPayment.amount,
            month: item.newPayment.month,
            year: item.newPayment.year,
            notes: item.newPayment.notes || undefined,
            paidAt: item.newPayment.paidAt || undefined,
        }))

        try {
            await dispatch(updateBulkArrayTuitionPaymentAsync({ payments })).unwrap()
            
            // Refresh preview with the same file
            if (lastUploadedFile) {
                const formData = new FormData()
                formData.append('file', lastUploadedFile)
                await dispatch(importTuitionPaymentExcelPreviewAsync(formData)).unwrap()
            }
        } catch (error) {
            console.error('Error updating payments:', error)
        }
    }

    const renderActiveTable = () => {
        if (!preview) return null

        switch (activeTab) {
            case 'new':
                return <NewPaymentsTable data={preview.newPayments} onAdd={handleAddPayments} loading={loadingCreate} />
            case 'existing':
                return <ExistingPaymentsTable data={preview.existingPayments} onUpdate={handleUpdatePayments} loading={loadingUpdate} />
            case 'unchanged':
                return <UnchangedPaymentsTable data={preview.unchangedPayments} />
            case 'invalid':
                return <InvalidRowsTable data={preview.invalidRows} />
            default:
                return null
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Xuất & Import Excel học phí"
            size={preview ? 'max' : 'lg'}
        >
            <div
                className={`grid grid-cols-1 gap-6 ${preview ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
                    }`}
            >
                {/* LEFT – STICKY */}
                <div
                    className={`space-y-6 ${preview ? 'lg:col-span-1 lg:sticky top-0 self-start' : ''
                        }`}
                >
                    <ExportExcel />
                    <ImportExcel onFileUploaded={setLastUploadedFile} />
                </div>

                {/* RIGHT – chỉ render khi có preview */}
                {preview && (
                    <div className="lg:col-span-2 space-y-6">
                        <SummaryCards 
                            summary={preview.summary} 
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                        <div className="min-h-[600px]">
                            {renderActiveTable()}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}
