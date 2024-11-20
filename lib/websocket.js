import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.callbacks = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 15;
        this.heartbeatInterval = null;
        this.connectionCheckInterval = null;
        this.lastHeartbeatResponse = null;
        this.connectCallbacks = new Set();
        this.disconnectCallbacks = new Set();
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (this.socket?.connected) {
                console.log('Already connected, skipping connection attempt');
                resolve();
                return;
            }

            const socketUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
            console.log('Attempting to connect to:', socketUrl);
            
            this.socket = io(socketUrl, {
                path: '/api/socketio',
                reconnectionDelay: 1000,
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: true,
                autoConnect: true,
                reconnectionDelayMax: 10000
            });

            this.initEventListeners();
            this.setupHeartbeat();
            this.setupConnectionCheck();

            this.socket.on('connect', () => {
                console.log('WebSocket connected successfully:', this.socket.id);
                this.connected = true;
                this.reconnectAttempts = 0;
                this.lastHeartbeatResponse = Date.now();
                resolve();
            });

            this.socket.on('heartbeat_ack', () => {
                this.lastHeartbeatResponse = Date.now();
                console.log('Heartbeat acknowledged');
            });

            this.socket.on('disconnect', (reason) => {
                console.log('WebSocket disconnected:', reason);
                this.connected = false;
                if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'ping timeout') {
                    this.handleConnectionError();
                }
            });

            // Add connection timeout
            setTimeout(() => {
                if (!this.connected) {
                    console.warn('Connection attempt timed out');
                    this.handleConnectionError();
                    reject(new Error('Connection timeout'));
                }
            }, 10000);
        });
    }

    setupHeartbeat() {
        this.clearIntervals();
        this.heartbeatInterval = setInterval(() => {
            if (this.socket?.connected) {
                console.log('Sending heartbeat');
                this.socket.emit('heartbeat');
                
                // Check if we haven't received a response in 45 seconds
                if (this.lastHeartbeatResponse && Date.now() - this.lastHeartbeatResponse > 45000) {
                    console.warn('No heartbeat response received - reconnecting');
                    this.reconnect();
                }
            }
        }, 30000);
    }

    setupConnectionCheck() {
        this.connectionCheckInterval = setInterval(() => {
            if (!this.socket?.connected && this.reconnectAttempts < this.maxReconnectAttempts) {
                console.log('Connection check failed - attempting reconnect...');
                this.connect().catch(console.error);
            }
        }, 10000); // Check connection every 10 seconds
    }

    clearIntervals() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.connectionCheckInterval) {
            clearInterval(this.connectionCheckInterval);
        }
    }

    handleConnectionError() {
        this.connected = false;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
            console.log(`Attempting reconnection in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect().catch(error => {
                    console.error('Reconnection attempt failed:', error);
                });
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    onConnect(callback) {
        this.connectCallbacks.add(callback);
        if (this.socket) {
            this.socket.on('connect', callback);
        }
    }

    offConnect(callback) {
        this.connectCallbacks.delete(callback);
        if (this.socket) {
            this.socket.off('connect', callback);
        }
    }

    onDisconnect(callback) {
        this.disconnectCallbacks.add(callback);
        if (this.socket) {
            this.socket.on('disconnect', callback);
        }
    }

    offDisconnect(callback) {
        this.disconnectCallbacks.delete(callback);
        if (this.socket) {
            this.socket.off('disconnect', callback);
        }
    }

    initEventListeners() {
        if (!this.socket) return;
        
        this.socket.removeAllListeners();
        
        // Register connect/disconnect handlers
        this.connectCallbacks.forEach(callback => {
            this.socket.on('connect', callback);
        });
        
        this.disconnectCallbacks.forEach(callback => {
            this.socket.on('disconnect', callback);
        });
        
        // Re-register all callbacks
        this.callbacks.forEach((callback, type) => {
            this.socket.on(type, (data) => {
                if (this.connected) {
                    callback(data);
                }
            });
        });
    }


    subscribe(type, callback) {
        if (!this.socket) {
            console.warn('Attempting to subscribe without socket connection');
            return;
        }
        
        // Remove existing listener for this type if it exists
        this.socket.off(type);
        
        console.log(`Subscribing to ${type} events`);
        this.callbacks.set(type, callback);
        
        // Add new listener
        this.socket.on(type, (data) => {
            console.log(`Received ${type} event:`, data);
            if (this.connected) {
                callback(data);
            }
        });
    }

    reconnect() {
        if (this.pendingReconnect) return;
        
        this.pendingReconnect = true;
        console.log('Forcing reconnection...');
        
        // Clean up existing connection
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        
        this.connected = false;
        
        // Attempt reconnection
        this.connect()
            .then(() => {
                // Resubscribe to all events
                this.callbacks.forEach((callback, type) => {
                    this.subscribe(type, callback);
                });
            })
            .catch(console.error)
            .finally(() => {
                this.pendingReconnect = false;
            });
    }

    isConnected() {
        return this.socket?.connected || false;
    }

    unsubscribe(type) {
        if (this.socket) {
            this.socket.off(type);
        }
        this.callbacks.delete(type);
    }

    disconnect() {
        this.clearIntervals();
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        this.connected = false;
    }
}

export const wsService = new WebSocketService();