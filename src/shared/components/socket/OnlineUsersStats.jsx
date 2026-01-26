import { useState, useEffect } from 'react'
import { useSocket, useSocketEvent } from '../../../shared/hooks/socket'

/**
 * OnlineUsersStats Component
 * 
 * Displays real-time count of online users (admin vs student)
 * 
 * Features:
 * - Shows total, admin, and student online counts
 * - Auto-updates when users connect/disconnect
 * - Can manually refresh stats
 * 
 * @example
 * ```jsx
 * <OnlineUsersStats />
 * ```
 */
export default function OnlineUsersStats() {
    const { emit, isConnected } = useSocket()
    const [stats, setStats] = useState({
        total: 0,
        admin: 0,
        student: 0,
    })
    const [lastUpdated, setLastUpdated] = useState(null)

    // Request initial stats when connected
    useEffect(() => {
        if (isConnected) {
            requestStats()
        }
    }, [isConnected])

    // Handle stats response from server
    useSocketEvent(
        'online-stats',
        (data) => {
            setStats({
                total: data.total || 0,
                admin: data.admin || 0,
                student: data.student || 0,
            })
            setLastUpdated(new Date(data.timestamp))
        },
        [setStats, setLastUpdated]
    )

    // Listen for real-time stats updates
    useSocketEvent(
        'online-stats-updated',
        (data) => {
            setStats({
                total: data.total || 0,
                admin: data.admin || 0,
                student: data.student || 0,
            })
            setLastUpdated(new Date(data.timestamp))
        },
        [setStats, setLastUpdated]
    )

    // Request stats from server
    const requestStats = () => {
        if (isConnected) {
            emit('get-online-stats', {})
        }
    }

    // Format time ago
    const getTimeAgo = (date) => {
        if (!date) return ''

        const seconds = Math.floor((new Date() - date) / 1000)

        if (seconds < 10) return 'just now'
        if (seconds < 60) return `${seconds}s ago`

        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`

        const hours = Math.floor(minutes / 60)
        return `${hours}h ago`
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Online Users
                </h3>
                <button
                    onClick={requestStats}
                    disabled={!isConnected}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    title="Refresh stats"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4">
                {/* Total Online */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">Total Online</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                        {stats.total}
                    </span>
                </div>

                {/* Admin Online */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Admin</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                        {stats.admin}
                    </span>
                </div>

                {/* Student Online */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Student</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                        {stats.student}
                    </span>
                </div>
            </div>

            {/* Connection Status */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    {lastUpdated && (
                        <span>Updated {getTimeAgo(lastUpdated)}</span>
                    )}
                </div>
            </div>
        </div>
    )
}
