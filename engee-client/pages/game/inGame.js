import {useState} from 'react';

import Lobby from '@/pages/game/lobby'

export default function InGame({pid, gid, callback}) {

    let [status, setStatus] = useState("Lobby");
    let [gameType, setGameType] = useState("");

    console.log("Status: " + status);

    function leaveGame() {
                callback("Browsing"); 
    }

    function changeStatus(newStatus) {
        setStatus(newStatus);
    }

    switch(status) {
        case "Lobby":
            return (
                <Lobby pid={pid} gid={gid} leave={leaveGame} changeStatus={changeStatus} />
            );
        case "ActivePlay":
            return (
                <></>
            );
        case "RuleChange":
            return (
                <></>
            );
        case "GameOver":
            //Notification that game has been deleted
            leaveGame();
            return null;
        default:
            return null;
    }
}