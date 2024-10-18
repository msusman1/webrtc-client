import {useNavigate} from "react-router-dom";

export default function LandingPage() {

    const navigate = useNavigate()

    const handleCreateRoom = () => {
        navigate("/create-room")
    }

    const handleJoinRoom = () => {
        navigate("/join-room")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Video Conferencing App</h1>
                <div className="space-x-4">
                    <button
                        onClick={handleCreateRoom}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Create a Room
                    </button>
                    <button
                        onClick={handleJoinRoom}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Join a Room
                    </button>
                </div>
            </div>
        </div>
    )

}
