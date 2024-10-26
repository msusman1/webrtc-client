import {FC} from "react";

interface HomeButtonsViewProps {
    onCreateRoom: () => void;
    onJoinRoom: () => void;
}

export const HomeButtonsView: FC<HomeButtonsViewProps> = ({onCreateRoom, onJoinRoom}) => {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Video Conferencing App</h1>
                <div className="space-x-4">
                    <button
                        onClick={onCreateRoom}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Create a Room
                    </button>
                    <button
                        onClick={onJoinRoom}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Join a Room
                    </button>

                </div>
            </div>
        </div>
    )

}
