import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks'
import { useSocketEvent } from '../../../shared/hooks/socket'
import {
    getMyNotificationsAsync,
    getMyStatsAsync,
    markNotificationReadAsync,
    markAllReadAsync,
    deleteNotificationAsync,
    setPagination,
    addRealtimeNotification,
    selectMyNotifications,
    selectNotificationStats,
    selectNotificationPagination,
    selectLoadingMyNotifications,
} from '../store/notificationSlice'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { SOCKET_EVENTS } from '../../../core/constants/socket-event'
import { NOTIFICATION_LEVEL_UI, NOTIFICATION_TYPE_UI } from '../../../core/constants/notification.constants'
/* ===================== Small Components ===================== */

const BellButton = ({ unread, onClick }) => (
    <button
        onClick={onClick}
        className="p-2 hover:bg-gray-100 bg-primary rounded-lg relative"
        aria-label="Thông báo"
    >
        <Bell size={18} />
        {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-error rounded-full text-[10px] text-white flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
            </span>
        )}
    </button>
)

const DropdownHeader = ({ unread, onMarkAllRead, onClose }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
            <h3 className="text-sm font-semibold">Thông báo</h3>
            <p className="text-xs text-foreground-light">{unread} chưa đọc</p>
        </div>
        <div className="flex items-center gap-2">
            {unread > 0 && (
                <button
                    onClick={onMarkAllRead}
                    title="Đánh dấu tất cả đã đọc"
                    className="text-blue-600"
                >
                    <CheckCheck size={14} />
                </button>
            )}
            <button onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    </div>
)

const NotificationItem = ({ data, onRead, onDelete }) => {
    const typeUI = NOTIFICATION_TYPE_UI[data.type] || NOTIFICATION_TYPE_UI.OTHER
    const levelUI =
        NOTIFICATION_LEVEL_UI[data.level] || NOTIFICATION_LEVEL_UI.DEFAULT

    const TypeIcon = typeUI.icon
    const LevelIcon = levelUI.icon

    return (
        <div
            className={`
                px-4 py-3 hover:bg-gray-50 cursor-pointer
                ${!data.isRead ? 'bg-blue-50' : ''}
                border-l-2 ${levelUI.color}
            `}
        >
            <div className="flex gap-3">
                {/* TYPE ICON */}
                <div className="shrink-0 mt-0.5">
                    <TypeIcon size={18} />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-sm font-medium">
                                {data.title}
                            </h4>
                            <span className="text-[10px] text-foreground-light">
                                {typeUI.label}
                            </span>
                        </div>

                        {/* LEVEL ICON */}
                        <LevelIcon size={14} className="opacity-60" />
                    </div>

                    <p className="text-xs text-foreground-light mt-1 line-clamp-2">
                        {data.message}
                    </p>

                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-foreground-light">
                            {formatDistanceToNow(new Date(data.createdAt), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </span>

                        <div className="flex gap-1">
                            {!data.isRead && (
                                <button
                                    onClick={(e) =>
                                        onRead(data.notificationId, e)
                                    }
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    title="Đánh dấu đã đọc"
                                >
                                    <Check size={14} />
                                </button>
                            )}
                            <button
                                onClick={(e) =>
                                    onDelete(data.notificationId, e)
                                }
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                title="Xóa"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const DropdownFooter = ({ onClose }) => (
    <div className="px-4 py-2 border-t text-center ">
        <button
            onClick={onClose}
            className="text-xs text-blue-600 bg-primary hover:underline font-medium"
        >
            Xem tất cả thông báo
        </button>
    </div>
)

/* ===================== Main Component ===================== */

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const dropdownRef = useRef(null)
    const listRef = useRef(null)

    const dispatch = useAppDispatch()
    const notifications = useAppSelector(selectMyNotifications)
    const stats = useAppSelector(selectNotificationStats)
    const pagination = useAppSelector(selectNotificationPagination)
    const loading = useAppSelector(selectLoadingMyNotifications)

    useEffect(() => {
        dispatch(getMyStatsAsync())
        dispatch(getMyNotificationsAsync({ page: 1, limit: 10 }))
    }, [dispatch])

    useSocketEvent(SOCKET_EVENTS.NOTIFICATION.NEW, (data) => {
        if (data?.notification) {
            dispatch(addRealtimeNotification(data.notification))
        }
    })

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        if (isOpen) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [isOpen])

    const handleRead = (id, e) => {
        e.stopPropagation()
        dispatch(markNotificationReadAsync(id))
    }

    const handleDelete = (id, e) => {
        e.stopPropagation()
        dispatch(deleteNotificationAsync(id))
    }

    return (
        <div ref={dropdownRef} className="relative">
            <BellButton unread={stats.unread} onClick={() => setIsOpen(!isOpen)} />

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-primary border rounded-sm shadow-lg z-50">
                    <DropdownHeader
                        unread={stats.unread}
                        onMarkAllRead={() => dispatch(markAllReadAsync())}
                        onClose={() => setIsOpen(false)}
                    />

                    <div ref={listRef} className="max-h-[500px] overflow-y-auto">
                        {notifications.map((n) => (
                            <NotificationItem
                                key={n.notificationId}
                                data={n}
                                onRead={handleRead}
                                onDelete={handleDelete}
                            />
                        ))}

                        {loading && (
                            <div className="py-4 text-center">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block" />
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <DropdownFooter onClose={() => setIsOpen(false)} />
                    )}
                </div>
            )}
        </div>
    )
}
