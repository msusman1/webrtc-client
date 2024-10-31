import {HomeButtonsView} from "./HomeButtonsView";
import {useSocketConnectionChannel} from "./data/useSocketConnectionChannel";
import {useState} from "react";
import {RoomFormDialog} from "./components/RoomFormDialog";
import {VideoGridView} from "./components/VideoGridView";
import {MessagesView} from "./components/MessagesView";
import {ConnectionState} from "./data/types/ConnectionState";
import {Peer} from "./data/types/Room";
import {useSocketRoomChannel} from "./data/useSocketRoomChannel";

export default function App() {

    const {connectionState,} = useSocketConnectionChannel()
    const {joinRoom, leaveRoom} = useSocketRoomChannel(
        (roomMessage: Peer) => {},
        (roomMessage: Peer) => {}
    )
    const [roomName, setRoomName] = useState<string>("")
    const [personName, setPersonName] = useState<string>("")
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [roomJoined, setRoomJoined] = useState<boolean>(false)


    function onDialogSubmit(roomName: string, personName: string) {
        setDialogOpen(false)
        setRoomName(roomName)
        setPersonName(personName)
        joinRoom({roomName, personName})
        setRoomJoined(true)
    }


    function onDialogDismiss() {
        setDialogOpen(false)
    }


    function onJoinClick() {
        setDialogOpen(true)
    }

    function onLeaveClick() {
        leaveRoom({roomName, personName})
        setRoomJoined(false)
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
            <MessagesView
                roomName={roomName}
                personName={personName}
                onLeaveRoomClick={onLeaveClick}
            />
        </div>
    ) : (
        <>
            <HomeButtonsView onJoinRoom={onJoinClick}/>
            <RoomFormDialog isOpen={dialogOpen} onDataEntered={onDialogSubmit} onDismiss={onDialogDismiss}/>

        </>
    );


}

