import {MessageSquare} from "lucide-react";
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {ChatMessage, RoomMessageRequest} from "../data/types/Room";
import {ScrollArea} from "../components/ui/scroll-area";

interface MessagesViewProps {
    roomName: string;
    personName: string;
    sendMessage: (message: RoomMessageRequest) => void;
    chatMessages: ChatMessage[];
    onLeaveRoomClick: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
                                                              roomName,
                                                              personName,
                                                              onLeaveRoomClick,
                                                              sendMessage,
                                                              chatMessages
                                                          }) => {
    const [newMessage, setNewMessage] = useState<string>('')
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const handleLeaveRoom = () => onLeaveRoomClick()

    const handleSendMessage = (e: FormEvent<any>) => {
        e.preventDefault()
        if (newMessage.trim()) {
            const roomMessageRequest: RoomMessageRequest = {
                roomName: roomName,
                personName: personName,
                content: newMessage
            }
            sendMessage(roomMessageRequest)
            setNewMessage('')
        }
    }
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [chatMessages]);

    return (<div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex  justify-between">
            <h2 className="text-lg font-semibold">{roomName + ":" + personName}</h2>
            <button
                onClick={handleLeaveRoom}
                className="text-sm rounded-2xl top-4 right-4 bg-red-500 hover:bg-red-600 px-2 py-1 text-white">
                Leave Room
            </button>
        </div>
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">

            {chatMessages.map((chat, index) => {
                return <div
                    className={` w-full flex ${chat.personName === personName ? "justify-end" : "justify-start"}`}
                    key={index}>
                    <div
                        className="mb-4 flex-col w-[200px] ">
                        <div
                            className={`max-w-sm rounded-lg ${chat.personName === personName ? " bg-amber-100" : " bg-cyan-100"} p-2 shadow-md`}>
                            <p className="text-sm text-gray-700">{chat.content}</p>
                            <p className="text-xs text-gray-500 mt-1">{chat.personName}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">{chat.timestamp}</p>
                    </div>
                </div>

            })}

        </ScrollArea>
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