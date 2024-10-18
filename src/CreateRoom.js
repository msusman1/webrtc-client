import {useEffect, useState} from 'react'


export default function CreateRoom({onSubmit}) {
    const [personName, setPersonName] = useState('Usman')
    const [roomName, setRoomName] = useState('Fleek')
    const handleSubmit = (e) => {
        e.preventDefault()
        if (personName.trim() && roomName.trim()) {
            onSubmit(roomName, personName)
        } else {
            alert('Please fill in both fields')
        }
    }
    useEffect(() => {
        console.log("setup up")
        return function cleanup() {
            console.log("clean up")
        }
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Create a Room</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="personName" className="text-sm font-medium text-gray-700">
                            Your Name
                        </label>
                        <input
                            id="personName"
                            type="text"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
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
            </div>
        </div>
    )
}