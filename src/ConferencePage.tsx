import {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {SocketContext} from "./App";
import {JoinRoomView} from "./components/JoinRoomView";
import {VideoGridView} from "./components/VideoGridView";
import {MessagesView} from "./components/MessagesView";
import {RoomJoinRequest, RoomLeaveRequest} from "./types/Room";


export default function ConferencePage() {
    const {roomName} = useParams()
    const [personName, setPersonName] = useState<string | undefined>(undefined)
    const navigate = useNavigate()
    const socket = useContext(SocketContext)


    const onLeaveRoom = () => {
        const roomLeaveRequest: RoomLeaveRequest = {
            personName: personName ?? "",
            roomName: roomName ?? ""
        }
        socket?.emit("leave_room", roomLeaveRequest)
        navigate('/')
    }

    useEffect(() => {
        return function cleanup() {
            if (socket && personName && roomName) {
                const roomLeaveRequest: RoomLeaveRequest = {
                    personName: personName ?? "",
                    roomName: roomName ?? ""
                }
                socket?.emit("leave_room", roomLeaveRequest)
            }

        }
    }, [socket, personName, roomName])

    const handleJoinRoom = (pName: string) => {
        setPersonName(pName)
        const roomJoinRequest: RoomJoinRequest = {
            personName: pName,
            roomName: roomName ?? ""
        }
        socket?.emit("join_room", roomJoinRequest)
    }

    return (

        personName ? (<div className="flex h-screen bg-gray-100">
            <VideoGridView roomName={roomName ?? ""} personName={personName}/>
            <MessagesView roomName={roomName ?? ""} personName={personName} onLeaveRoom={onLeaveRoom}/>
        </div>) : (<JoinRoomView onSubmit={handleJoinRoom}/>)

    )
}
