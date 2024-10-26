import {HomeButtonsView} from "./HomeButtonsView";
import {useSocketChannel} from "./data/useSocketChannel";
import {useEffect, useState} from "react";
import {RoomFormDialog} from "./components/RoomFormDialog";
import {VideoGridView} from "./components/VideoGridView";
import {MessagesView} from "./components/MessagesView";
import {ConnectionState} from "./data/types/ConnectionState";

// export const SERVER_URL = "http://18.234.159.36:4000";
export const SERVER_URL = "http://localhost:4000";

enum DialogType {
    CREATE = "CREATE",
    JOIN = "JOIN"
}

function App() {
    const {connectionState, createRoom, joinRoom, roomCreated, roomJoined} = useSocketChannel()
    const [roomDialogOpen, setRoomDialogOpen] = useState<boolean>(false)
    const [roomName, setRoomName] = useState<string>("")
    const [personName, setPersonName] = useState<string>("")
    const [dialogType, setDialogType] = useState<DialogType>(DialogType.CREATE)


    function onDialogSubmit(roomName: string, personName: string) {
        setRoomDialogOpen(false)
        setRoomName(roomName)
        setPersonName(personName)
        if (dialogType === DialogType.CREATE) {
            createRoom(roomName)
        } else if (dialogType === DialogType.JOIN) {
            joinRoom({roomName, personName})
        }
    }

    useEffect(() => {
        if (roomCreated) {
            joinRoom({roomName, personName})
        }
    }, [joinRoom, roomCreated, personName, roomName]);


    function onDialogDismiss() {
        setRoomDialogOpen(false)
    }

    function onCreateClick() {
        setDialogType(DialogType.CREATE)
        setRoomDialogOpen(true)
    }

    function onJoinClick() {
        setDialogType(DialogType.JOIN)
        setRoomDialogOpen(true)
    }
    if (connectionState === ConnectionState.CONNECTING) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div
                        className="loader mx-auto mb-4 border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
                    <p className="text-xl text-blue-600 font-semibold">Connecting...</p>
                </div>
            </div>
        );
    }

    if (connectionState === ConnectionState.FAILED) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-50">
                <div className="text-center">
                    <p className="text-xl text-red-600 font-semibold">Connection to signaling server failed.</p>
                </div>
            </div>
        );
    }

    if (connectionState === ConnectionState.DISCONNECTED) {
        return (
            <div className="flex items-center justify-center h-screen bg-yellow-50">
                <div className="text-center">
                    <p className="text-xl text-yellow-600 font-semibold">Disconnected from signaling server.</p>
                </div>
            </div>
        );
    }

    return roomJoined ? (
        <div className="flex h-screen bg-gray-100">
            <VideoGridView roomName={roomName} personName={personName}/>
            <MessagesView roomName={roomName} personName={personName}/>
        </div>
    ) : (
        <>
            <HomeButtonsView onJoinRoom={onCreateClick} onCreateRoom={onJoinClick}/>
            {roomDialogOpen && (
                <RoomFormDialog onDataEntered={onDialogSubmit} onCancel={onDialogDismiss}/>
            )}
        </>
    );


}

export default App;
