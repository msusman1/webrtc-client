import React, {FC, FormEvent, useState} from 'react'

interface RoomFormDialogProps {
    onDataEntered: (roomName: string, personName: string) => void;
    onCancel: () => void;
}

export const RoomFormDialog: FC<RoomFormDialogProps> = ({onDataEntered, onCancel}) => {
    const [roomName, setRoomName] = useState('Fleek')
    const [personName, setPersonName] = useState('Usman')
    const handleSubmit = (e: FormEvent<any>) => {
        e.preventDefault()
        if (roomName.trim().length > 2 && personName.trim().length > 2) {
            onDataEntered(roomName, personName)
        } else {
            alert('Please fill in both fields')
        }
    }


    return (
        <div className="dialog">
            <div className="dialog-content">
                <h1 className="text-2xl font-bold text-center text-gray-800">Create/Join a Room</h1>
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
                    <div className="space-y-2">
                        <label htmlFor="personName" className="text-sm font-medium text-gray-700">
                            Room Name
                        </label>
                        <input
                            id="personName"
                            type="text"
                            value={roomName}
                            onChange={(e) => setPersonName(e.target.value)}
                            placeholder="Enter Person name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </form>
                <div className="dialog-overlay" onClick={onCancel}></div>
            </div>
        </div>
    )
}