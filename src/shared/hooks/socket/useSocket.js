// src/hooks/socket/useSocket.js
import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { socketService } from '../../../services/socket/socket.service'
import { selectAccessToken, selectIsAuthenticated } from '../../../features/auth/store/authSlice'

/**
 * useSocket Hook
 * 
 * React hook for managing Socket.IO connection lifecycle.
 * Automatically connects when user is authenticated and disconnects on logout.
 * Uses single root namespace only.
 * 
 * @param {object} options - Configuration options
 * @param {boolean} options.autoConnect - Auto connect when authenticated (default: true)
 * @returns {object} Socket utilities
 */
export const useSocket = (options = {}) => {
    const {
        autoConnect = true,
    } = options

    const accessToken = useSelector(selectAccessToken)
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [isConnected, setIsConnected] = useState(false)
    const [socketId, setSocketId] = useState(null)

    // Connect to socket
    const connect = useCallback(() => {
        if (!accessToken) {
            console.warn('⚠️ Cannot connect: No access token')
            return
        }

        socketService.connect(accessToken)
        setIsConnected(socketService.getConnectionStatus())
        setSocketId(socketService.getSocketId())
    }, [accessToken])

    // Disconnect from socket
    const disconnect = useCallback(() => {
        socketService.disconnect()
        setIsConnected(false)
        setSocketId(null)
    }, [])

    // Join a room
    const joinRoom = useCallback((roomId) => {
        socketService.joinRoom(roomId)
    }, [])

    // Leave a room
    const leaveRoom = useCallback((roomId) => {
        socketService.leaveRoom(roomId)
    }, [])

    // Emit event
    const emit = useCallback((event, data) => {
        socketService.emit(event, data)
    }, [])

    // Listen to event
    const on = useCallback((event, callback) => {
        socketService.on(event, callback)
    }, [])

    // Remove event listener
    const off = useCallback((event) => {
        socketService.off(event)
    }, [])

    // Auto connect/disconnect based on authentication
    useEffect(() => {
        if (isAuthenticated && accessToken && autoConnect) {
            console.log('🔌 Auto-connecting socket (user authenticated)...')
            connect()

            // Setup connection status listeners
            socketService.on('connect', () => {
                setIsConnected(true)
                setSocketId(socketService.getSocketId())
            })

            socketService.on('disconnect', () => {
                setIsConnected(false)
                setSocketId(null)
            })
        }

        // Cleanup: disconnect when user logs out or component unmounts
        return () => {
            if (!isAuthenticated || !accessToken) {
                console.log('🔌 Auto-disconnecting socket (user logged out)...')
                disconnect()
            }
        }
    }, [isAuthenticated, accessToken, autoConnect, connect, disconnect])

    return {
        isConnected,
        socketId,
        connect,
        disconnect,
        joinRoom,
        leaveRoom,
        emit,
        on,
        off,
    }
}
