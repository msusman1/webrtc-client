import {Route, Routes, useNavigate} from "react-router-dom";
import LandingPage from "./LandingPage";
import CreateRoom from "./CreateRoom";
import ConferencePage from "./ConferencePage";
import {createContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

// export const SERVER_URL = "http://18.234.159.36:4000";
export const SERVER_URL = "http://localhost:4000";
export const SocketContext = createContext<Socket | undefined>(undefined);

function App() {

    const [socket, setSocket] = useState<Socket | undefined>()

    useEffect(() => {
        const socketInstance = io(SERVER_URL)
        socketInstance.on("connect", () => {
            setSocket(socketInstance)
        })
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/create-room" element={<CreateRoom/>}/>
                <Route path="/room/:roomName" element={<ConferencePage/>}/>
            </Routes>
        </SocketContext.Provider>


    )

}

export default App;
