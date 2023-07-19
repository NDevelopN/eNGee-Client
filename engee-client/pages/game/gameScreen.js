import {useState, useEffect} from 'react';

import {SOCK} from '@/lib/networkFunctions';
import Consequences from '@/pages/game/consequences/consequences';
import Lobby from '@/pages/game/lobby';
import LeaderView from '@/pages/game/leader/leader';

export default function GameScreen({user, revertStatus, url}) {
    let [socket, setSocket] = useState();
    let [gameInfo, setGameInfo] = useState();
    let [pStatus, setPStatus] = useState("");
    let [isLeader, setIsLeader] = useState(false);
    let [gameMessage, setGameMessage] = useState({type: "", uid: "", gid: "", content: ""});
    let [plrList, setPlrList] = useState([]);

    let [status, setStatus] = useState("Loading");

    useEffect(() => {
        if (socket === undefined) {
            connect()
        }
    }, []);

    function connect() {
        let endpoint = "ws" + url.substring(4) + "/games/" + user.uid;
        SOCK(endpoint, close, (sock) => {
            sock.addEventListener("message", Receive);
            setSocket(sock);

            let message = {
                type: "Status",
                uid: user.uid,
                gid: user.gid,
                content: "Not Ready",
            }

            sock.send(JSON.stringify(message));
        });
    }

    function close() {
        socket.close();
        revertStatus();
    }

    //TODO redundant?
    function setRules(rules) {
        var gm = gameInfo
        gm.rules = rules
        setGameInfo(gm)
    }

    function playerToggleReady() {
        var nStatus = (pStatus === "Ready" ? "Not Ready" : "Ready")
        send("Status", nStatus);
        setPStatus(nStatus);
    }

    function leaveGame() {
        send("Leave", "");
        disconnect();
    }

    function disconnect() {
        //TODO inform the server? 
        socket.close();
        revertStatus(); 
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
            case "Info":
                content = JSON.parse(data.content)
                setGameInfo(content)
                setStatus(content.status)

                setIsLeader(content.leader === user.uid);

                break;
            case "Update":
                content = JSON.parse(data.content)
                setGameInfo(content)
                setStatus(content.Status)
                setIsLeader(content.leader === user.uid);
                break;
            case "Status": 
                console.log("Recieving status update: " + data.content)
                setStatus(data.content);
                setGameMessage(data.content)
                break;
            case "Players":
                console.log("Got players update " + data.content);
                setPlrList(JSON.parse(data.content));
                break;
            case "Leader":
                console.log("Got leader update")
                console.log("leader uid: " + data.uid + " current uid: " + user.uid)
                setIsLeader(data.uid === user.uid);
                if (isLeader) {
                    alert("You are now the game leader")
                }
                break;
                //TODO Should be no longer needed
            case "Rules":
                content = JSON.parse(data.content)
                setRules(content.rules);
                setGameSpec(typeMap[content.type])
                break;
            case "Issue":
                console.log("Issue from server: " + data.content);
                //TODO what issues can be handled here?
                break;
            case "End":
                alert("The Game has been deleted.")
                revertStatus();
                break;
            default:
                //If the standard options are not covered, pass it on to the gameSpecific logic
                setGameMessage(data)
                break;
        }
    }
    
    function send(type, data) {
        let message = {
            type: type,
            uid: user.uid,
            gid: user.gid,
            content: data
        };

        if (socket === undefined) {
            console.error("Socket is undefined") 
            return 
        }

        socket.send(JSON.stringify(message));
    }

    function Leader() {
        return (<LeaderView uid={user.uid} info={gameInfo} status={status} send={send} url={url}/>);
    }
    
    if (gameInfo === undefined) {
        return <h2> Loading... </h2>
    }

    switch (status) {
        case "Loading":
            return (
                <h2>Loading</h2>
            );
        case "Lobby":
            return (
                <>
                {isLeader ?  <Leader/> : <></>}
                <Lobby leave={leaveGame} status={pStatus} changeStatus={playerToggleReady} plrList={plrList} lid={gameInfo.leader}/>
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
                <Lobby leave={leaveGame} status={pStatus} changeStatus={playerToggleReady} plrList={plrList} lid={gameInfo.leader}/>
                </div>
            );
        case "Restart":
            return (
                <h2>Restarting game...</h2>
            );
        default:
            return null;
    }

}