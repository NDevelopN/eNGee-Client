import {useState, useEffect} from 'react';

import Lobby from '@/pages/game/lobby'
import LeaderView from '@/pages/game/leader/leader'

import {POST} from '@/lib/networkFunctions'

export default function InGame({pid, gid, callback}) {

    let [status, setStatus] = useState("Ready");
    let [isLeader, setIsLeader] = useState(false);
    let [plrList, setPlrList] = useState([]);

    useEffect(() => {

//        getStatus();
        const timer = window.setInterval(() => getStatus(), 500);

        return () => {
            window.clearInterval(timer);
        };
   }, []);

    function getStatus() {
        let endpoint = "http://localhost:8080/game/status";

        let message = {
            pid: pid,
            gid: gid,
        };

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log(e);
            setIsLeader(e.leader === pid);
            setPlrList(e.players);
            setStatus(e.status);
        }); }

    function leaveGame() {
        let endpoint = "http://localhost:8080/game/leave"

        let message = {
            pid: pid,
            gid: gid,
        }

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log(e);
            callback("Browsing"); 
        });
    }

    function changeStatus(newStatus) {
        console.log("This is the problem")
        setStatus(newStatus);
    }

    console.log(status)

    switch(status) {
        case "Pre":
            return (
                <h2>Loading</h2>
            );
        case "Lobby":
            return (
                <>
                {isLeader ? <LeaderView pid={pid} gid={gid} gStatus={status} changeStatus={changeStatus}/> : <></> }  
                <Lobby pid={pid} gid={gid} plrList={plrList} leave={leaveGame} changeStatus={changeStatus} />
                </>
            );
        case "InGame":
            return (
                <>
                {isLeader ? <LeaderView pid={pid} gid={gid} gStatus={status} changeStatus={changeStatus}/> : <></> }  
                <h2>In the Game</h2>
                </>
            );
        case "Pause":
            return (
                <div>
                <h3>Paused</h3>
                {isLeader ? <LeaderView pid={pid} gid={gid} gStatus={status} changeStatus={changeStatus}/> : <></> }  
                <Lobby pid={pid} gid={gid} plrList={plrList} leave={leaveGame} changeStatus={changeStatus} />
                </div>
            );
        case "Restart":
            return (
                <h2>Restarting game...</h2>
            );
        case "Ended":
            //Notification that game has been deleted
            leaveGame();
            return null;
        default:
            //TODO remove
            return null;
    }
}