import {useCallback, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";

import {ChatMessage, RoomJoinRequest, RoomLeaveRequest, RoomMessage, RoomMessageRequest} from "./types/Room";
import {ConnectionState} from "./types/ConnectionState";


const SERVER_URL = "http://3.89.28.171:4000";

// const SERVER_URL = "http://localhost:4000";

export function useSocketChannel() {
    const socketRef = useRef<Socket | null>(null)
    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.CONNECTING)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [userJoined, setUserJoined] = useState<RoomMessage | null>(null);
    const [userLeft, setUserLeft] = useState<RoomMessage | null>(null);

    useEffect(() => {
        console.log("useSocketChannel")
        socketRef.current = io(SERVER_URL)
        const socket = socketRef.current
        const handleConnection = () => setConnectionState(ConnectionState.CONNECTED);
        const handleDisconnection = () => setConnectionState(ConnectionState.DISCONNECTED);
        const handleNewMessage = (chatMessage: ChatMessage) => {
            console.log("handleNewMessage", chatMessage)
            setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
        }
        const handleNewUserJoined = (roomMessage: RoomMessage) => {
            console.log("handleNewUserJoined", roomMessage)
            setUserJoined(roomMessage);
        }
        const handleUserLeft = (roomMessage: RoomMessage) => setUserLeft(roomMessage);

        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection)
        socket.on('message', handleNewMessage);
        socket.on('user_joined', handleNewUserJoined);
        socket.on('user_left', handleUserLeft);
        socket.on('connect_error', (error: Error) => {
            console.log("connect_error", error);
            setConnectionState(ConnectionState.FAILED)
        });


        return () => {
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection)
            socket.off('message', handleNewMessage);
            socket.off('user_joined', handleNewUserJoined);
            socket.off('user_left', handleUserLeft);
            socket.close()
        }
    }, []);

    const sendMessage = useCallback((message: RoomMessageRequest) => {
        socketRef.current?.emit("message", message)
    }, [])

    const joinRoom = useCallback((roomJoinRequest: RoomJoinRequest) => {
        socketRef.current?.emit("join_room", roomJoinRequest)
    }, [])

    const leaveRoom = useCallback((roomLeaveRequest: RoomLeaveRequest) => {
        socketRef.current?.emit("leave_room", roomLeaveRequest)
    }, [])

    return {
        connectionState,
        sendMessage,
        chatMessages,
        joinRoom,
        userJoined,
        leaveRoom,
        userLeft,
    }
}