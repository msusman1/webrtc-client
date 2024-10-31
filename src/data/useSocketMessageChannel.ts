import {getSocket} from "../data/SocketConnection";
import {useCallback, useEffect} from "react";
import {ChatMessage, RoomMessageRequest} from "../data/types/Room";


export function useSocketMessageChannel(onNewMessage: (message: ChatMessage) => void) {
    const socket = getSocket()
    useEffect(() => {
        const handleMessage = (message: ChatMessage) => {
            onNewMessage(message);
        };

        socket.on("message", handleMessage);
        return () => {
            socket.off("message", handleMessage);
        };
    }, [socket, onNewMessage]);

    const sendMessage = useCallback((message: RoomMessageRequest) => {
        socket?.emit("message", message)
    }, [socket])

    return {sendMessage}

}