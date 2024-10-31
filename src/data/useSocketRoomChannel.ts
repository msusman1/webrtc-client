import {useCallback, useEffect} from "react";

import {Peer, RoomJoinRequest, RoomLeaveRequest} from "./types/Room";
import {getSocket} from "../data/SocketConnection";


export function useSocketRoomChannel(onUserJoined: (peer: Peer) => void, onUserLeft: (peer: Peer) => void,) {
    const socket = getSocket()

    useEffect(() => {

        const handleNewUserJoined = (peer: Peer) => {
            onUserJoined(peer)
        }

        const handleUserLeft = (peer: Peer) => {
            onUserLeft(peer)
        }
        socket.on('user_joined', handleNewUserJoined);
        socket.on('user_left', handleUserLeft);
        return () => {
            socket.off('user_joined', handleNewUserJoined);
            socket.off('user_left', handleUserLeft);
        }
    }, [socket, onUserJoined, onUserLeft]);


    const joinRoom = useCallback((roomJoinRequest: RoomJoinRequest) => {
        socket?.emit("join_room", roomJoinRequest)
    }, [socket])

    const leaveRoom = useCallback((roomLeaveRequest: RoomLeaveRequest) => {
        socket?.emit("leave_room", roomLeaveRequest)
    }, [socket])

    return {
        joinRoom,
        leaveRoom,
    }
}