import {FormEvent, useContext, useEffect, useState} from 'react'
import {SocketContext} from "./App";
import {useNavigate} from "react-router-dom";
import {Room} from "./types/Room";


export default function CreateRoom() {
    const socket = useContext(SocketContext)
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState('Fleek')
    const [room, setRoom] = useState<Room | undefined>()
    const handleSubmit = (e: FormEvent<any>) => {
        e.preventDefault()
        if (roomName.trim() && socket) {
            socket.emit("create_room", roomName)
        } else {
            alert('Please fill in both fields')
        }
    }
    useEffect(() => {
        socket?.on('room_created', (room: Room) => {
            setRoom(room)
        })
    }, [socket])
    const onShareClick = () => {
        const baseUrl = window.location.origin; // Get the current React app's base URL
        const fullUrl = `${baseUrl}/room/${room?.name}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            alert('Link Copied!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
    const onJoinClick = () => {
        window.open(`/room/${room?.name}`, "_blank")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">

                {room ? (
                    <>
                        <h1>
                            Room <span className={"font-bold italic "}>{room.name}</span> created successfully.
                        </h1>
                        <p className={"text-sm italic font-light "}>{`${window.location.origin}/room/${room?.name}`}</p>
                        <div className={"flex space-x-0 "}>
                            <button
                                onClick={onShareClick}
                                type="button"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Copy Link
                            </button>
                            <div className={"w-32"}></div>
                            <button
                                onClick={onJoinClick}
                                type="button"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Open Link
                            </button>
                        </div>

                    </>

                ) : <>
                    <h1 className="text-2xl font-bold text-center text-gray-800">Create a Room</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <label htmlFor="roomName" className="text-sm font-medium text-gray-700">
                                Room Name
                            </label>
                            <input
                                id="roomName"
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Enter room name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create Room
                        </button>
                    </form>
                </>
                }

            </div>
        </div>
    )
}