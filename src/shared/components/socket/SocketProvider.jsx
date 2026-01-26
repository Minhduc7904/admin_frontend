// src/shared/components/socket/SocketProvider.jsx
import { useEffect } from 'react'
import { useSocket } from '../../hooks/socket/useSocket'
import { useSocketEvent } from '../../hooks/socket/useSocketEvent'

/**
 * SocketProvider Component
 * 
 * Global component that manages Socket.IO connection lifecycle.
 * Place this component at the root level of your app.
 * Automatically connects when user is authenticated and disconnects on logout.
 */
export const SocketProvider = ({ children }) => {
    const { isConnected, socketId } = useSocket({
        autoConnect: false, // Auto connect when user is authenticated
    })

    // Listen to global socket events
    useSocketEvent('connected', (data) => {
        console.log('✅ Connected to WebSocket server:', data)
    }, [])

    useSocketEvent('error', (error) => {
        console.error('❌ Socket error:', error)
        // You can dispatch notification action here
        // dispatch(addNotification({ type: 'error', message: error.message }))
    }, [])

    // Listen for new notifications (example)
    useSocketEvent('new-notification', (notification) => {
        console.log('🔔 New notification:', notification)

        // You can dispatch Redux action here to update notification state
        // dispatch(addNotification(notification.data))
    }, [])

    // Log connection status changes
    useEffect(() => {
        if (isConnected) {
            console.log(`✅ Socket connected with ID: ${socketId}`)
        } else {
            console.log('❌ Socket disconnected')
        }
    }, [isConnected, socketId])

    return children
}
