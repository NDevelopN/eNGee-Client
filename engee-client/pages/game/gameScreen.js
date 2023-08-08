import {useState, useEffect} from 'react';

import {GET, SOCK} from '@/lib/networkFunctions';
import Consequences from '@/pages/game/consequences/consequences';
import Lobby from '@/pages/game/lobby';
import LeaderView from '@/pages/game/leader/leader';


let count = 0;
export default function GameScreen({user, setUser, revertStatus, url}) {
    let [socket, setSocket] = useState();

    let [gameInfo, setGameInfo] = useState();
    let [pStatus, setPStatus] = useState("");
    let [isLeader, setIsLeader] = useState(false);
    let [plrList, setPlrList] = useState([])

    let [gameMessage, setGameMessage] = useState({type: "", uid: "", gid: "", content: ""});
    let [status, setStatus] = useState("Loading");


    let uE = true;
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
        if (uE) {
            uE = false;
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
        if (event !== undefined && event.wasClean) {
            console.log("[close] Connection closed cleanly, code=" + event.code + " reason=" + event.reason);
        } else {
            console.log("[close] Connection died");
        }

        leave();
    }

    function send(type, data) {
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
                content = JSON.parse(data.content);
                setGameInfo(content);
                setStatus(content.status);
                setIsLeader(content.leader === user.uid);
                break;
            case "Update":
                content = JSON.parse(data.content);
                setGameInfo(content);
                setStatus(content.status);
                setIsLeader(content.leader === user.uid);
                break;
            case "Status": 
                setStatus(data.content);
                setGameMessage(data.content);
                break;
            case "Player":
                content = JSON.parse(data.content);
                setUser(content);
                setPStatus(content.Status);
                revertStatus();
                break;
            case "Players":
                setPlrList(JSON.parse(data.content));
                break;
            case "Leader":
                setIsLeader(data.uid === user.uid);
                if (isLeader) {
                    alert("You are now the game leader")
                }
                break;
            case "Rules":
                content = JSON.parse(data.content)
                setRules(content.rules);
                break;
            case "Response":
                let response = JSON.parse(data.content) 
                console.error("Received " + response.cause + " message: " + response.message);
                break;
            case "ACK":
                break;
            case "End":
                alert("The Game has been deleted.")
                leave();
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
                return (<Consequences msg={gameMessage} send={send} 
                        quit={ () => {
                                send("Leave", ""); 
                                socket.close(1000, "playerLeft")
                            }
                        }
                />);
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
                <Lobby 
                    socket={socket} status={pStatus} changeStatus={playerToggleReady} 
                    plrList={plrList} lid={gameInfo.leader} quit={() => send("Leave", "")}
                />
                </div>
            );
       default:
            console.error("Unknown status: " + status);
            socket.close();
            break;
    }
}