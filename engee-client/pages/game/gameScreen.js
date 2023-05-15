import {useState, useEffect} from 'react';

import {SOCK} from '@/lib/networkFunctions';
import Consequences from '@/pages/game/consequences/consequences';
import Lobby from '@/pages/game/lobby';
import LeaderView from '@/pages/game/leader/leader';

export default function GameScreen({pid, gid, statusChange, types, defGInfo}) {
    let [socket, setSocket] = useState();
    let [gameInfo, setGameInfo] = useState(defGInfo);
    let [pStatus, setPStatus] = useState("Not Ready");
    let [isLeader, setIsLeader] = useState(false);
    let [gameMessage, setGameMessage] = useState({type: "", pid: "", gid: "", content: ""});

    let [status, setStat] = useState("Lobby");

    useEffect(() => {
        connect()
        
      //  return(disconnect);

    }, []);

    function connect() {
        console.log("Connecting");
        //TODO change this hardcoding
        let endpoint = "ws://localhost:8090/game/consequences";
        SOCK(endpoint, close, (sock) => {
            sock.addEventListener("message", Receive);
            setSocket(sock)
            
            let message = {
                type: "Connect",
                PID: pid,
                GID: gid,
                Content: "",
            }

            sock.send(JSON.stringify(message))
        });
    }

    function close() {
        statusChange("Browsing");
    }

    function setGInfo(input) {
        var gm = gameInfo
        gm.gid = input.gid
        gm.name = input.name
        gm.type = input.type
        gm.status = input.status
        gm.old_status = input.old_status
        gm.leader = input.leader
        gm.rules =  {
            rounds: input.rules.rounds,
            min_plrs: input.rules.min_plrs,
            max_plrs: input.rules.max_plrs,
            timeout: input.rules.timeout,
            additional: input.rules.additional, 
        }

        gm.players = input.players 
        setGameInfo(gm)
    }


    function setStatus(status) {
        console.log("setting status to " + status); 
        var gm = gameInfo
        gm.status = status
        setGameInfo(gm)
        setStat(status)
    }

    function setPlrList(plrList) {
        var gm = gameInfo
        gm.players = plrList
        setGameInfo(gm)
    }

    //TODO redundant?
    function setRules(rules) {
        var gm = gameInfo
        gm.rules = rules
        setGameInfo(gm)
    }


    function changePStatus() {
        var nStatus = (pStatus === "Ready" ? "Not Ready" : "Ready")
        send("Status", nStatus);
        setPStatus(nStatus);
    }

    function leaveGame() {
        send("Leave", "");
        disconnect();
        statusChange("Browsing");
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
        
        switch (gameInfo.type.toLowerCase()) {
            case "consequences":
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
                setGInfo(content)
                setIsLeader(content.leader === pid);
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
                break;te
            default:
                //If the standard options are not covered, pass it on to the gameSpecific logic
                setGameMessage(data)
                break;
        }
    }

    
    function send(type, data) {
        let message = {
            type: type,
            pid: pid,
            gid: gid,
            content: data
        };

        socket.send(JSON.stringify(message));
    }

    function Leader() {
        return (<LeaderView info={gameInfo} gid={gid} status={gameInfo.status} send={send} types={types}/>);
    }
    
    if (gameInfo === undefined) {
        return <h2> Loading... </h2>
    }

    switch (gameInfo.status) {
        case "Pre":
            return (
                <h2>Loading</h2>
            );
        case "Lobby":
            return (
                <>
                {isLeader ?  <Leader/> : <></>}
                <Lobby leave={leaveGame} status={pStatus} changeStatus={changePStatus} plrList={gameInfo.players}/>
                </>
            );
        case "Play":
            return (
                <>
                {isLeader ? <Leader/> : <></>}
                <GameRender/>
                </>
            );
        case "Pause":
            return (
                <div>
                <h3>Paused</h3>
                {isLeader ? <Leader/> : <></>}
                <Lobby leave={leaveGame} status={pStatus} changeStatus={changePStatus} plrList={gameInfo.players}/>
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