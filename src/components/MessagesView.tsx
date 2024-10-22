import {MessageSquare} from "lucide-react";
import React, {FormEvent, useContext, useEffect, useState} from "react";
import {SocketContext} from "../App";
import {ChatMessage, ChatMessageEventType} from "../types/Room";

interface MessagesViewProps {
    roomName: string;
    personName: string;
    onLeaveRoom: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({roomName, personName, onLeaveRoom}) => {
    const socket = useContext(SocketContext);
    const [newMessage, setNewMessage] = useState<string>('')
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

    useEffect(() => {
            socket?.on("receive_channel", onNewMessageReceived)
        }, [socket]
    )
    const onNewMessageReceived = (chatMessage: ChatMessage) => {
        setChatMessages(prevMessages => [...prevMessages, chatMessage])
    }

    const handleLeaveRoom = () => {
        onLeaveRoom()
    }

    const handleSendMessage = (e: FormEvent<any>) => {
        e.preventDefault()
        if (newMessage.trim()) {
            socket?.emit("send_channel", {roomName: roomName, personName: personName, content: newMessage})
            setNewMessage('')
        }
    }

    return (<div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex  justify-between">
            <h2 className="text-lg font-semibold">{roomName + ":" + personName}</h2>
            <button
                onClick={handleLeaveRoom}
                className="text-sm rounded-2xl top-4 right-4 bg-red-500 hover:bg-red-600 px-2 py-1 text-white">
                Leave Room
            </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto ">

            {chatMessages.map((chat, index) => {
                return <div
                    className={` w-full flex ${chat.personName === personName ? "justify-end" : "justify-start"}`}
                    key={index}>
                    {chat.eventType === ChatMessageEventType.textMessage ? (<div
                        className="mb-4 flex-col w-[200px] ">
                        <div
                            className={`max-w-sm rounded-lg ${chat.personName === personName ? " bg-amber-100" : " bg-cyan-100"} p-2 shadow-md`}>
                            <p className="text-sm text-gray-700">{chat.content}</p>
                            <p className="text-xs text-gray-500 mt-1">{chat.personName}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">{chat.timestamp}</p>
                    </div>) : (<div
                        className="mb-4 flex flex-row content-center justify-center items-center space-x-2">
                        <hr style={{width: 60}}/>
                        <div className="flex px-4 text-center">
                            <p className="text-xs text-gray-400 mt-1 italic">
                                {chat.personName} {chat.eventType === ChatMessageEventType.joinedRoom ? "Joined Room" : "Left Room"}
                            </p>
                        </div>
                        <hr style={{width: 60}}/>
                    </div>)}
                </div>

            })}

        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 outline-none border border-gray-300 rounded px-2 py-1"
                />
                <button type="submit">
                    <MessageSquare className="h-4 w-4"/>
                </button>
            </div>
        </form>
    </div>)
}