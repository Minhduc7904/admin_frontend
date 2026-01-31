import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Upload,
    Settings,
    Eye,
} from 'lucide-react'
import { Tooltip } from '../../../shared/components/ui'
import { ROUTES } from '../../../core/constants'

const STEPS = [
    {
        key: 'exam',
        label: 'Thông tin đề thi',
        icon: FileText,
        path: ROUTES.EXAM_IMPORT_SESSION_DETAIL(),
    },
    {
        key: 'upload',
        label: 'Upload PDF & trích xuất',
        icon: Upload,
        path: ROUTES.EXAM_IMPORT_SESSION_UPLOAD(),
    },
    {
        key: 'process',
        label: 'Xử lý câu hỏi',
        icon: Settings,
        path: '/exam/import/process',
    },
    {
        key: 'preview',
        label: 'Xem trước & xác nhận',
        icon: Eye,
        path: '/exam/import/preview',
    },
]

export const ExamImportSessionSidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()

    const getStepPath = (step) => {
        if (step.key === 'exam') {
            return ROUTES.EXAM_IMPORT_SESSION_DETAIL(id)
        }
        if (step.key === 'upload') {
            return ROUTES.EXAM_IMPORT_SESSION_UPLOAD(id)
        }
        return step.path
    }

    const isActive = (step) => {
        const stepPath = getStepPath(step)
        return location.pathname === stepPath
    }

    const handleNavigate = (step) => {
        const path = getStepPath(step)
        navigate(path)
    }

    return (
        <aside className="w-16 bg-white border-r border-border flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {STEPS.map((step) => {
                    const Icon = step.icon
                    const active = isActive(step)

                    return (
                        <Tooltip key={step.key} text={step.label} position="right">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigate(step)}
                                className={`
                                    w-10 h-10 flex items-center justify-center rounded-lg
                                    transition cursor-pointer
                                    ${active
                                        ? 'bg-purple-200 text-purple-600'
                                        : 'text-gray-400 hover:bg-gray-100'}
                                `}
                            >
                                <Icon size={20} className="shrink-0" />
                            </motion.div>
                        </Tooltip>
                    )
                })}
            </div>
        </aside>
    )
}
