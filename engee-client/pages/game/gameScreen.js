import {useState, useEffect} from 'react';

import {SOCK} from '@/lib/networkFunctions';
import Consequences from '@/pages/game/consequences/consequences';
import Lobby from '@/pages/game/lobby';
import LeaderView from '@/pages/game/leader/leader';

export default function GameScreen({pid, gid, callback}) {

    let [status, setStatus] = useState("Pre");
    let [pStatus, setPStatus] = useState("Not Ready");
    let [isLeader, setIsLeader] = useState(false);
    let [plrList, setPlrList] = useState([]);
    let [socket, setSocket] = useState();
    let [rules, setRules] = useState();
    let [gameSpec, setGameSpec] = useState();

    let message = {}

    const typeMap = new Map();
    typeMap.set("Consequences", Consequences);

    useEffect(() => {
        connect()
        
      //  return(disconnect);

    }, []);

    function connect() {
        console.log("Connecting");
        let endpoint = "ws://localhost:8080/game/connect";
        SOCK(endpoint, (sock) => {
            sock.addEventListener("message", Receive);
            setSocket(sock)
            
            message = {
                type: "Connect",
                PID: pid,
                GID: gid,
                Content: "",
            }

            sock.send(JSON.stringify(message))
        });
    }

    function changePStatus() {
        var nStatus = (pStatus === "Ready" ? "Not Ready" : "Ready")
        send("Status", nStatus);
        setPStatus(nStatus);
    }

    function leaveGame() {
        send("Leave", "");
        disconnect();
        callback("Browsing");
    }

    function disconnect() {
        //TODO inform the server? 
        socket.close();
    }
    
    function Receive(event) {
        let data = JSON.parse(event.data);
        let content = JSON.parse(data.content);

        switch(data.type){
            //Should be the reply for first connection
            case "Info":
                setIsLeader(content.leader === pid);
                setRules(content.rules);
                setPlrList(content.players);
                setStatus(content.status);
                //setGameSpec(typeMap[content.rules.type])
            case "Update":
                setIsLeader(content.leader === pid);
                setRules(content.rules);
                setPlrList(content.players);
                setStatus(content.status);
                //setGameSpec(typeMap[content.rules.type])
            case "Status": 
                setStatus(content.status);
                break;
            case "Players":
                setPlrList(content.players);
                break;
            case "Leader":
                setIsLeader(content.leader === pid);
                break;
            case "Rules":
                setRules(content.rules);
                setGameSpec(typeMap[content.rules.type])
                break;
            case "Issue":
                console.log(content.issue);
                break;

            //If the standard options are not covered, pass it on to the gameSpecific logic
            default:
                //gameSpec(pid, gid, event.data);
                break;
        }
    }

    
    function send(type, data) {
        message = {
            type: type,
            pid: pid,
            gid: gid,
            content: data
        };

        socket.send(JSON.stringify(message));
    }

    switch (status) {
        case "Pre":
            return (
                <h2>Loading</h2>
            );
        case "Lobby":
            return (
                <>
                {isLeader ?  <LeaderView e={rules} gid={gid} status={status} send={send}/> : <></>}
                <Lobby leave={leaveGame} status={pStatus} changeStatus={changePStatus} plrList={plrList}/>
                </>
            );
        case "InGame":
            return (
                <>
                <LeaderView e={rules} gid={gid} status={status} send={send}/>
                <h2> THis is the game part</h2>
                </>
            );
        case "Pause":
            return (
                <div>
                <h3>Paused</h3>
                {isLeader ?  <LeaderView e={rules} gid={gid} status={status} send={send}/> : <></>}
                <Lobby leave={leaveGame} status={pStatus} changeStatus={changePStatus} plrList={plrList}/>
                </div>
            );
        case "Restart":
            return (
                <h2>Restarting game...</h2>
            );
        case "Ended":
            //TODO: Notification that game has been deleted
            leaveGame();
            return null;
        default:
            return null;
    }
}