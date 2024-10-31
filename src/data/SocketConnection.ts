import {io, Socket} from "socket.io-client";

// const SERVER_URL = 'http://3.89.28.171:4000';
// const SERVER_URL = "http://localhost:4000";
const SERVER_URL = "http://localhost:4000";

let socket: Socket | null = null;
export const getSocket = () => {
    if (!socket) {
        socket = io(SERVER_URL, {
            autoConnect: false,
            secure: true,
        })
    }
    return socket
}


export function logWithTimestamp(message: string,...optionalParams: any[]) {
    const now = new Date();
    const timestamp = now.toISOString(); // ISO string includes milliseconds
    console.log(`[${timestamp}] ${message}`,optionalParams);
}
