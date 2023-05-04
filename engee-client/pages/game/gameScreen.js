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
    let [type, setType] = useState("");
    let [gameMessage, setGameMessage] = useState({type: "", pid: "", gid: "", content: ""});

    let message = {}

    useEffect(() => {
        connect()
        
      //  return(disconnect);

    }, []);

    function connect() {
        console.log("Connecting");
        //TODO change this hardcoding
        endpoint = "ws://localhost:8090/game/consequences";
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

    function GameRender() {
        //IF the server has not replied yet, tell user game is Loading
        if (gameMessage.type === "") {
            return (<h2>Loading...</h2>)
        }
        
        switch (type.toLowerCase()) {
            case "con":
                return (<Consequences msg={gameMessage} send={send} quit={leaveGame}/>)
        }
    }
    
    function Receive(event) {
        let data = JSON.parse(event.data);
        let content;

        switch(data.type){
            //Should be the reply for first connection, same as a full update
            //TODO is there any reason for difrentiating these?
            case "Info":
            case "Update":
                content = JSON.parse(data.content)
                setIsLeader(content.leader === pid);
                setRules(content.rules);
                setPlrList(content.players);
                setStatus(content.status);
                setType(content.type)
                break;
            case "Status": 
                setStatus(data.content);
                break;
            case "Players":
                content = JSON.parse(data.content)
                setPlrList(content.players);
                break;
            case "Leader":
                setIsLeader(data.content === pid);
                break;
            case "Rules":
                content = JSON.parse(data.content)
                setRules(content.rules);
                setGameSpec(typeMap[content.type])
                break;
            case "Issue":
                console.log(data.content);
                //TODO what issues can be handled here?
                break;
            default:
                //If the standard options are not covered, pass it on to the gameSpecific logic
                setGameMessage(data)
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
        case "Play":
            return (
                <>
                {isLeader ? <LeaderView e={rules} gid={gid} status={status} send={send}/> : <></>}
                <GameRender/>
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