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
export class SocketService {
    constructor(socketFactory = io) {
        this.socket = null
        this.isConnected = false
        this.listeners = new Map() // Map<event, Set<callback>>; survives socket recreation
        this.authFailed = false   // True after an auth error — stops reconnection loop
        this.socketFactory = socketFactory
    }

    /**
     * Connect to Socket.IO server
     * @param {string} token - JWT access token for authentication
     * Single root namespace only - no multiple namespaces
     */
    connect(token) {
        if (this.socket) {
            console.log('✅ Socket connection already initialized')
            return
        }

        // Reset auth-failure guard each time we get a fresh token
        this.authFailed = false

        // Use API base URL without /api suffix for socket connection
        const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api'
        const serverUrl = apiBaseUrl.replace('/api', '')

        console.log('🔌 Connecting to Socket.IO server:', serverUrl)

        this.socket = this.socketFactory(serverUrl, {
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
        this.attachRegisteredListeners()
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

            // Check if error is authentication-related
            if (this.isAuthenticationError(error)) {
                this.markAuthenticationFailure()
                console.warn('🔒 Socket auth error detected')
            }
        })

        // Disconnected
        this.socket.on('disconnect', (reason) => {
            this.isConnected = false
            console.log('❌ Socket disconnected:', reason)

            if (reason === 'io server disconnect' && !this.authFailed) {
                // Server disconnected us for a non-auth reason, try to reconnect
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

            // The backend currently emits an auth error before disconnecting.
            // Mark it before the disconnect handler can attempt a stale-token reconnect.
            if (this.isAuthenticationError(error)) {
                this.markAuthenticationFailure()
                console.warn('🔒 Socket auth error detected from server event')
            }
        })
    }

    attachRegisteredListeners() {
        if (!this.socket) return

        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach((callback) => {
                this.socket.on(event, callback)
            })
        })
    }

    isAuthenticationError(error) {
        const message = typeof error === 'string'
            ? error
            : error?.message || error?.data?.message || ''
        const code = error?.code || error?.data?.code
        const normalizedMessage = String(message).toLowerCase()

        return code === 'SOCKET_AUTH_FAILED' ||
            code === 'UNAUTHORIZED' ||
            normalizedMessage.includes('jwt') ||
            normalizedMessage.includes('expired') ||
            normalizedMessage.includes('unauthorized') ||
            normalizedMessage.includes('authentication') ||
            normalizedMessage.includes('unauthenticated') ||
            normalizedMessage.includes('invalid token') ||
            normalizedMessage.includes('invalid or expired') ||
            error?.type === 'UnauthorizedException'
    }

    markAuthenticationFailure() {
        this.authFailed = true
        this.isConnected = false
        this.socket?.io?.reconnection?.(false)
    }

    /**
     * Disconnect from Socket.IO server
     */
    disconnect() {
        if (this.socket) {
            console.log('🔌 Disconnecting socket...')

            // Remove only callbacks owned by this registry.
            this.listeners.forEach((callbacks, event) => {
                callbacks.forEach((callback) => {
                    this.socket.off(event, callback)
                })
            })
            // Disconnect
            this.socket.disconnect()
            this.socket = null

            console.log('✅ Socket disconnected')
        }

        this.isConnected = false
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
        if (!event || typeof callback !== 'function') return () => {}

        let callbacks = this.listeners.get(event)
        if (!callbacks) {
            callbacks = new Set()
            this.listeners.set(event, callbacks)
        }

        if (!callbacks.has(callback)) {
            callbacks.add(callback)
            this.socket?.on(event, callback)
        }

        console.log(`👂 Listening to '${event}'`)
        return () => this.off(event, callback)
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event handler to remove
     */
    off(event, callback) {
        if (!event || typeof callback !== 'function') return

        const callbacks = this.listeners.get(event)
        if (!callbacks?.has(callback)) return

        this.socket?.off(event, callback)
        callbacks.delete(callback)
        if (callbacks.size === 0) this.listeners.delete(event)
        console.log(`🔇 Stopped listening to '${event}'`)
    }

    /**
     * Check if socket is connected
     * @returns {boolean}
     */
    getConnectionStatus() {
        return this.isConnected && this.socket?.connected
    }

    /**
     * Check if connection was stopped due to an auth error
     * @returns {boolean}
     */
    getAuthFailed() {
        return this.authFailed
    }

    /**
     * Get socket ID
     * @returns {string|null}
     */
    getSocketId() {
        return this.socket?.id || null
    }

    /**
     * Disconnect current socket and reconnect with a new token.
     * Used after a successful token refresh following a 401 auth error.
     * @param {string} newToken - Fresh JWT access token
     */
    reconnectWithToken(newToken) {
        if (this.socket) {
            this.socket.io.reconnection(false)
            this.socket.disconnect()
            this.socket = null
        }
        this.authFailed = false
        this.isConnected = false
        this.connect(newToken)
    }
}

// Export singleton instance
export const socketService = new SocketService()
