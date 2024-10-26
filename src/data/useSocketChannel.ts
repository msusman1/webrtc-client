import {useCallback, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";

import {ChatMessage, Room, RoomJoinRequest, RoomLeaveRequest, RoomMessage, RoomMessageRequest} from "./types/Room";
import {ConnectionState} from "./types/ConnectionState";


//const SERVER_URL = "http://18.234.159.36:4000";
const SERVER_URL = "http://localhost:4000";

export function useSocketChannel() {
    const socketRef = useRef<Socket | null>(null)
    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.CONNECTING)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [newUserJoined, setNewUserJoined] = useState<RoomMessage | null>(null);
    const [roomCreated, setRoomCreated] = useState<Room | null>(null);
    const [roomJoined, setRoomJoined] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        socketRef.current = io(SERVER_URL)
        const socket = socketRef.current
        const handleConnection = () => setConnectionState(ConnectionState.CONNECTED);
        const handleDisconnection = () => setConnectionState(ConnectionState.DISCONNECTED);
        const handleError = (errorMsg: string) => setError(errorMsg);
        const handleNewMessage = (chatMessage: ChatMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
        }
        const handleNewUserJoined = (roomMessage: RoomMessage) => setNewUserJoined(roomMessage);
        const handleUserLeft = (roomMessage: RoomMessage) => {

        };
        const handleRoomCreated = (room: Room) => {
            console.log('room_created', room);
            setRoomCreated(room);
        }
        const handleRoomJoined = (room: RoomMessage) => {
            console.log('room_joined', room);
            setRoomJoined(true);
        }
        const handleRoomLeft = (room: RoomMessage) => {
            console.log('room_left', room);
            setRoomJoined(false);
        }
        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection)
        socket.on('message', handleNewMessage);
        socket.on('user_joined', handleNewUserJoined);
        socket.on('user_left', handleUserLeft);
        socket.on('room_created', handleRoomCreated);
        socket.on('room_joined', handleRoomJoined);
        socket.on('room_left', handleRoomLeft);
        socket.on('error', handleError);
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
            socket.off('room_created', handleRoomCreated);
            socket.off('room_joined', handleRoomJoined);
            socket.off('room_left', handleRoomLeft);
            socket.off('error', handleError);
            socket.close()
        }
    }, []);

    const createRoom = useCallback((roomName: string) => {
        socketRef.current?.emit("create_room", roomName)
    }, [])

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
        createRoom,
        roomCreated,
        joinRoom,
        roomJoined,
        newUserJoined,
        leaveRoom,
        error
    }
}