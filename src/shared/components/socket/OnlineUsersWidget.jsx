import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users } from 'lucide-react'
import { useSocket, useSocketEvent } from '../../../shared/hooks/socket'

export function OnlineUsersWidget({ isOpen }) {
    const { emit, isConnected } = useSocket()
    const [stats, setStats] = useState({
        total: 0,
        admin: 0,
        student: 0,
    })

    useEffect(() => {
        if (isConnected) {
            emit('get-online-stats', {})
        }
    }, [isConnected, emit])

    useSocketEvent('online-stats', (data) => {
        setStats({
            total: data.total || 0,
            admin: data.admin || 0,
            student: data.student || 0,
        })
    })

    useSocketEvent('online-stats-updated', (data) => {
        setStats({
            total: data.total || 0,
            admin: data.admin || 0,
            student: data.student || 0,
        })
    })

    if (!isConnected) return null

    return (
        <div
            className={`
                flex items-center gap-3 rounded-sm
                ${isOpen ? 'px-3 py-2' : 'p-2 justify-center'}
                text-foreground-light
            `}
        >
            {/* Icon */}
            <div className="relative shrink-0">
                <Users size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            {/* Animated content (GIỐNG MENU ITEM) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden flex flex-col leading-tight"
                    >
                        <span className="text-[11px] uppercase tracking-wide">
                            Online Users
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-foreground">
                                {stats.total}
                            </span>
                            <span className="text-[11px] text-foreground-light whitespace-nowrap">
                                ({stats.admin} admin · {stats.student} student)
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
