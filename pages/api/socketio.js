import { Server as SocketIOServer } from 'socket.io';

let io;

export default function SocketHandler(req, res) {
    if (!res.socket.server.io) {
        console.log('Initializing new Socket.IO server...');
        io = new SocketIOServer(res.socket.server, {
            path: '/api/socketio',
            addTrailingSlash: false,
            transports: ['websocket', 'polling'],
            pingTimeout: 60000,
            pingInterval: 25000,
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            },
            connectTimeout: 45000,
            allowEIO3: true,
            cookie: {
                name: 'io',
                httpOnly: true,
                sameSite: 'strict'
            }
        });

        io.on('connection', socket => {
            // console.log('Client connected:', socket.id);
            
            socket.on('heartbeat', () => {
                socket.emit('heartbeat_ack');
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });

            socket.on('disconnect', (reason) => {
                // console.log('Client disconnected:', socket.id, 'Reason:', reason);
                // Attempt to clean up any lingering connections
                socket.removeAllListeners();
            });
        });

        res.socket.server.io = io;
        global.io = io;
    }

    res.end();
}

export const emitVoteUpdate = async (data) => {
    if (!io) {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/socketio`);
        } catch (error) {
            console.error('Failed to initialize Socket.IO:', error);
        }
    }

    const socketInstance = io || global.io;
    
    if (socketInstance) {
        try {
            console.log('Broadcasting vote update to all clients...');
            socketInstance.emit('voteUpdate', {
                ...data,
                timestamp: Date.now()
            });
            console.log('Vote update broadcast successful');
        } catch (error) {
            console.error('Error broadcasting vote update:', error);
        }
    } else {
        console.error('No Socket.IO instance available after recovery attempt');
    }
};