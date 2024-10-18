import {useState} from 'react'


export default function JoinRoom({onSubmit}) {
    const [personName, setPersonName] = useState('')
    const [roomName, setRoomName] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        if (personName.trim() && roomName.trim()) {
            onSubmit(roomName, personName)
        } else {
            alert('Please fill in both fields')
        }
    }

    return (<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-800">Join a Room</h1>
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
                    Join Room
                </button>
            </form>
        </div>
    </div>)
}