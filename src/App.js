import {Route, Routes, useNavigate} from "react-router-dom";
import LandingPage from "./LandingPage";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import ConferencePage from "./ConferencePage";
import {useState} from "react";

export const SERVER_URL = "http://192.168.1.6:3000";

function App() {

    const [room, setRoom] = useState("");
    const [person, setPerson] = useState("");
    const navigate = useNavigate();

    const onSubmit = (roomName, personName) => {
        setRoom(roomName)
        setPerson(personName)
        navigate("/conference-page")
    }

    return (

        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/create-room" element={<CreateRoom onSubmit={onSubmit}/>}/>
            <Route path="/join-room" element={<JoinRoom onSubmit={onSubmit}/>}/>
            <Route path="/conference-page" element={<ConferencePage roomName={room} personName={person}/>}/>
        </Routes>

    )

}

export default App;
