import {useEffect, useState} from "react";
import {ConnectionState} from "./types/ConnectionState";
import {getSocket} from "../data/SocketConnection";


export function useSocketConnectionChannel() {
    const socket = getSocket()
    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.CONNECTING)


    useEffect(() => {
        socket.connect()
        const handleConnection = () => setConnectionState(ConnectionState.CONNECTED);
        const handleDisconnection = () => setConnectionState(ConnectionState.DISCONNECTED);

        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection)
        socket.on('connect_error', (error: Error) => {
            console.log("connect_error", error);
            setConnectionState(ConnectionState.FAILED)
        });

        return () => {
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection)
            socket.close()
        }
    }, []);


    return {connectionState}
}