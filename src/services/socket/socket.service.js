// src/services/socket/socket.service.js
import { io } from 'socket.io-client'

/**
 * SocketService
 * 
 * Service for managing Socket.IO client connection.
 * Handles connection, disconnection, and event management.
 * 
 * @singleton
 */
class SocketService {
    constructor() {
        this.socket = null
        this.isConnected = false
        this.listeners = new Map() // Store event listeners
    }

    /**
     * Connect to Socket.IO server
     * @param {string} token - JWT access token for authentication
     * Single root namespace only - no multiple namespaces
     */
    connect(token) {
        if (this.socket?.connected) {
            console.log('✅ Socket already connected')
            return
        }

        const serverUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001'

        console.log('🔌 Connecting to Socket.IO server:', serverUrl)

        this.socket = io(serverUrl, {
            auth: {
                token, // Send token for authentication
            },
            transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        })

        // Setup default event handlers
        this.setupDefaultHandlers()
    }

    /**
     * Setup default Socket.IO event handlers
     */
    setupDefaultHandlers() {
        if (!this.socket) return

        // Connection successful
        this.socket.on('connect', () => {
            this.isConnected = true
            console.log('✅ Socket connected:', this.socket.id)
        })

        // Server confirms connection with user info
        this.socket.on('connected', (data) => {
            console.log('✅ Server acknowledged connection:', data)
        })

        // Connection error
        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message)
            this.isConnected = false
        })

        // Disconnected
        this.socket.on('disconnect', (reason) => {
            this.isConnected = false
            console.log('❌ Socket disconnected:', reason)

            if (reason === 'io server disconnect') {
                // Server disconnected us, try to reconnect
                console.log('🔄 Attempting to reconnect...')
                this.socket.connect()
            }
        })

        // Reconnecting
        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}...`)
        })

        // Reconnected
        this.socket.on('reconnect', (attemptNumber) => {
            this.isConnected = true
            console.log(`✅ Reconnected after ${attemptNumber} attempts`)
        })

        // Error from server
        this.socket.on('error', (error) => {
            console.error('❌ Socket error:', error)
        })
    }

    /**
     * Disconnect from Socket.IO server
     */
    disconnect() {
        if (this.socket) {
            console.log('🔌 Disconnecting socket...')

            // Remove all custom listeners
            this.listeners.forEach((_, event) => {
                this.socket.off(event)
            })
            this.listeners.clear()

            // Disconnect
            this.socket.disconnect()
            this.socket = null
            this.isConnected = false

            console.log('✅ Socket disconnected')
        }
    }

    /**
     * Join a room
     * @param {string} roomId - Room identifier
     */
    joinRoom(roomId) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected')
            return
        }

        this.socket.emit('join-room', { roomId })
        console.log(`📥 Joining room: ${roomId}`)
    }

    /**
     * Leave a room
     * @param {string} roomId - Room identifier
     */
    leaveRoom(roomId) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected')
            return
        }

        this.socket.emit('leave-room', { roomId })
        console.log(`📤 Leaving room: ${roomId}`)
    }

    /**
     * Emit an event to server
     * @param {string} event - Event name
     * @param {any} data - Event data (optional)
     */
    emit(event, data = {}) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected')
            return
        }

        this.socket.emit(event, data)
        console.log(`📤 Emitted '${event}':`, Object.keys(data).length > 0 ? data : '(no data)')
    }

    /**
     * Listen to an event from server
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     */
    on(event, callback) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected')
            return
        }

        // Remove existing listener if any
        if (this.listeners.has(event)) {
            this.socket.off(event, this.listeners.get(event))
        }

        // Add new listener
        this.socket.on(event, callback)
        this.listeners.set(event, callback)

        console.log(`👂 Listening to '${event}'`)
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     */
    off(event) {
        if (!this.socket) return

        const callback = this.listeners.get(event)
        if (callback) {
            this.socket.off(event, callback)
            this.listeners.delete(event)
            console.log(`🔇 Stopped listening to '${event}'`)
        }
    }

    /**
     * Check if socket is connected
     * @returns {boolean}
     */
    getConnectionStatus() {
        return this.isConnected && this.socket?.connected
    }

    /**
     * Get socket ID
     * @returns {string|null}
     */
    getSocketId() {
        return this.socket?.id || null
    }
}

// Export singleton instance
export const socketService = new SocketService()
