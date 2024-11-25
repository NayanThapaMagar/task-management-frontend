import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Function to initialize the socket connection after login
export const initializeSocket = (token: string): Socket => {
    if (!socket) {
        socket = io(`${process.env.REACT_APP_BACKEND_API_BASE_URL}`, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            auth: { token },
        });

        // Handle successful connection
        socket.on('connect', () => {
            // console.log('Socket connected:', socket?.id);
        });

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            // console.warn('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // console.warn('Server disconnected the socket. Attempting to reconnect...');
                socket?.connect(); // Attempt to reconnect manually
            }
        });

        // Handle connection errors
        socket.on('connect_error', (err) => {
            // console.error('Socket connection error:', err.message);
        });
    }
    return socket;
};

// Function to get the existing socket instance
export const getSocket = (): Socket | null => socket;

// Function to clean up the socket on logout
export const destroySocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};