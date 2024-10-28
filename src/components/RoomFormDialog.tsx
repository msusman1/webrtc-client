import React, {FC, useState} from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "./ui/alert-dialog";


interface RoomFormDialogProps {
    isOpen: boolean,
    onDataEntered: (roomName: string, personName: string) => void;
    onDismiss: () => void;
}

export const RoomFormDialog: FC<RoomFormDialogProps> = ({isOpen, onDataEntered, onDismiss}) => {
    const [roomName, setRoomName] = useState('Fleek')
    const [personName, setPersonName] = useState('Usman')
    const handleSubmit = () => {
        if (roomName.trim().length > 2 && personName.trim().length > 2) {
            onDataEntered(roomName, personName)
        } else {
            alert('Please fill in both fields')
        }
    }

    return (

        <AlertDialog open={isOpen}>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Join the Room</AlertDialogTitle>
                    <AlertDialogDescription>
                        <form className="space-y-6">

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
                            <div className="space-y-2">
                                <label htmlFor="personName" className="text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    id="personName"
                                    type="text"
                                    value={personName}
                                    onChange={(e) => setPersonName(e.target.value)}
                                    placeholder="Enter Your Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                        </form>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onDismiss}>Dismiss</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


    )
}