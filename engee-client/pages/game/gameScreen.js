import {useState, useEffect} from 'react';

import {GET, SOCK} from '@/lib/networkFunctions';
import Consequences from '@/pages/game/consequences/consequences';
import Lobby from '@/pages/game/lobby';
import LeaderView from '@/pages/game/leader/leader';

export default function GameScreen({user, setUser, revertStatus, url}) {
    let [socket, setSocket] = useState();

    let [gameInfo, setGameInfo] = useState();
    let [pStatus, setPStatus] = useState("");
    let [isLeader, setIsLeader] = useState(false);
    let [plrList, setPlrList] = useState([])

    let [gameMessage, setGameMessage] = useState({type: "", uid: "", gid: "", content: ""});
    let [status, setStatus] = useState("Loading");


    //TODO remove this mess
    let uE = 0;
    useEffect(() => {
        GET(url + "/games", (e) => {
            if (e) {
                for (let i = 0; i < e.length; i++) {
                    if (e[i].gid === user.gid) {
                        connect();
                        return
                    }
                }
            }
            
            console.error("Could not connect: game not found");
            leave();
        });
    }, []);

    function connect() {
        if (uE == 0) {
            uE += 1;
            return
        }
        let endpoint = "ws" + url.substring(4) + "/games/" + user.uid;

        let socket
        SOCK(endpoint, receive, close, (sock) => {
            socket = sock
            open(sock)
            setSocket(socket);
        });
    }

    function open(sock) {
        console.log("open()");
        let message = {
            type: "Status",
            uid: user.uid,
            gid: user.gid,
            content: "Not Ready",
        };

        sock.send(JSON.stringify(message));
 
    }

    function leave() {
        document.cookie = "gid=;path='/'";
        revertStatus();
    }

    function close(event) {
        if (event.wasClean) {
            console.log("[close] Connection closed cleanly, code=" + event.code + " reason=" + event.reason);
        } else {
            console.log("[close] Connection died");
        }

        leave();
    }

    function send(type, data) {
        console.log("send(" + type + ", " + data + ")");
        
        let message = {
            type: type,
            uid: user.uid,
            gid: user.gid,
            content: data,
        };

        if (socket === undefined) {
            console.error("Socket is undefined");
            return
        }

        socket.send(JSON.stringify(message));
    }

    function receive(event) {
        let data = JSON.parse(event.data);
        let content;

        switch(data.type){
            //Should be the reply for first connection, same as a full update
            case "Info":
                console.log("Received Info: " + data.content)
                content = JSON.parse(data.content);
                setGameInfo(content);
                setStatus(content.status);
                setIsLeader(content.leader === user.uid);
                break;
            case "Update":
                console.log("Received update: " + data.content)
                content = JSON.parse(data.content);
                setGameInfo(content);
                setStatus(content.status);
                setIsLeader(content.leader === user.uid);
                break;
            case "Status": 
                console.log("Recieving status update: " + data.content);
                setStatus(data.content);
                setGameMessage(data.content);
                break;
            case "Player":
                console.log("Receiving player update: " + data.content);
                content = JSON.parse(data.content);
                setUser(content);
                setPStatus(content.Status);
                revertStatus();
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

    function GameRender() {
        if (gameMessage.type === "") {
            return (<h2>Loading...</h2>)
        }
        switch (gameInfo.type.toLowerCase()) {
            case "consequences":
                return (<Consequences msg={gameMessage} send={send} quit={close}/>);
        }
    }

    function Leader() {
        return (<LeaderView uid={user.uid} info={gameInfo} status={status} send={send} url={url}/>);
    }

    function Paused() {
        return (<h3>Paused</h3>);
    }

    switch (status) {
        case "Loading":
            return (
                <h2>Loading</h2>
            );
        case "Reset":
            return (
                <h2>Restarting game...</h2>
            );
        case "Play":
            return (
                <>
                {isLeader ? <Leader/> : <></>}
                <GameRender/>
                </>
            );
        case "Lobby":
        case "Pause":
            return (
                <div>
                {status === "Pause" ? <Paused/> : <></>}
                {isLeader ? <Leader/> : <></>}
                <Lobby socket={socket} status={pStatus} changeStatus={playerToggleReady} plrList={plrList} lid={gameInfo.leader}/>
                </div>
            );
       default:
        console.error("Unknown status: " + status);
        socket.close();
    }
}