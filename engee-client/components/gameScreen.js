import {useState, useEffect, useRef} from 'react';
import { createPortal } from 'react-dom';

import popUp from '@/styles/popup.module.css';

import CQ from '@/lib/queue';

import Consequences from '@/components/games/consequences/consequences';
import Lobby from '@/components/lobby';
import LeaderView from '@/components/leader/leaderView';
import LeaderPause from '@/components/leader/leaderPause';
 
let round = 0;

let gameMessages = new CQ(20);
let plrList = [];

export default function GameScreen({user, url, socket, setSocket, leaveGame}) {
    let [gameInfo, setGameInfo] = useState();
    let [pStatus, setPStatus] = useState("");
    let [isLeader, setIsLeader] = useState(false);

    let [status, setStatus] = useState("Loading");
    let [paused, setPaused] = useState(false);

    let conRef = useRef(true);

    useEffect(() => {
        if (socket === undefined) {
            leaveGame();
            return;
        }

        if (conRef.current) {
            setTimeout(() => {
                let message = {
                    type: "Join",
                    uid: user.uid,
                    gid: user.gid,
                };

                socket.onmessage = receive;
                socket.send(JSON.stringify(message));
                setSocket(socket);
            }, 1000);

            conRef.current = false;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    function send(type, data) {
        let message = {
            type: type,
            uid: user.uid,
            gid: user.gid,
            content: data,
        };

        if (socket === undefined) {
            console.error("Socket is undefined");
            return;
        }

        socket.send(JSON.stringify(message));
    }

    function changeStatus(status) {
        if (status === "Pause"){
            setPaused(true);
            return;
        }

        setPaused(false);
        setStatus(status);
    }


    function receive(event) {
        let data = JSON.parse(event.data);
        let content;

        switch(data.type){
            //Should be the reply for first connection, same as a full update
            case "Info":
                content = JSON.parse(data.content);
                setGameInfo(content);
                changeStatus(content.status);
                setIsLeader(content.leader === user.uid);
                break;
            case "Update":
                content = JSON.parse(data.content);
                setGameInfo(content);
                changeStatus(content.status);
                setIsLeader(content.leader === user.uid);
                break;
            case "Status": 
                if (data.content === "Lobby") {
                    round++;
                }
                changeStatus(data.content);
                break;
            case "Player":
                let nUser = JSON.parse(data.content);
                if (nUser.gid === "" || nUser.status === "Leaving") {
                    socket.close();
                    break;
                }

                if (nUser.status !== pStatus) {
                    setPStatus(nUser.status);
                }

                break;
            case "Players":
                let pString = JSON.stringify(plrList); 

                if (pString !== data.content) {
                    let pList = JSON.parse(data.content);
                    if (JSON.stringify(pList) !== JSON.stringify(plrList)) {
                        plrList = pList;
                        for (let i = 0; i < pList.length; i++) {
                            let plr = pList[i];
                            if (plr.uid == user.uid) {
                                setPStatus(plr.status);
                            }
                        }

                    }
                }
                break;
            case "Leader":
                setIsLeader(data.uid === user.uid);
                if (isLeader) {
                    alert("You are now the game leader");
                }
                break;
            case "Rules":
                content = JSON.parse(data.content);
                setRules(content.rules);
                break;
            case "Response":
                let response = JSON.parse(data.content);
                if (response.cause === "Warn") {
                    alert(response.message);
                } else {
                    console.error("Received " + response.cause + " message: " + response.message);
                }
                break;
            case "End":
                alert("The Game has been deleted.");
                socket.close();
                break;
            default:
                //If the standard options are not covered, pass it on to the gameSpecific logic
                if (!gameMessages.enqueue(data)) {
                    //TODO
                    console.error("Dropped message: " + data.type + ", " + data.content);
                }
                break;
        }
    }

    function DQ() {
        let msg = gameMessages.dequeue();
        return msg;
    }

    function setRules(rules) {
        var gm = gameInfo;
        gm.rules = rules;
        setGameInfo(gm);
    }

    function playerToggleReady() {
        var nStatus = (pStatus === "Ready" ? "Not Ready" : "Ready");
        send("Status", nStatus);
    }

    function GameRender() {
        switch (gameInfo.type.toLowerCase()) {
            case "consequences":
                return (<Consequences round={round} paused={paused} getMsg={DQ} send={send} 
                            plrList={plrList} lid={gameInfo.Leader}
                            quit={ () => {
                                    send("Leave", ""); 
                                    socket.close();
                                }
                            }
                />);
        }
    }

    function Leader() {
        return (
            <div>
            <LeaderView uid={user.uid} status={status} send={send}/>
            <GS/>
            </div>
        );
    }

    function Paused() {
        if (paused) {
            return (
                <div className={popUp.modal}>
                {isLeader 
                ? 
                <LeaderPause info={gameInfo} status={status} send={send} url={url}/>
                :
                <div className={popUp.modal}>
                    <h2>Paused</h2>
                </div>
                }
                </div>
            );
        }
        return <></>;
    }

    function GS() {
        switch (status) {
            case "Loading":
                return (
                    <h2>Loading</h2>
                );
            case "Reset":
                round = 0;
                return (
                    <h2>Restarting game...</h2>
                );
            case "Play":
                return (
                    <>
                    {createPortal(<Paused/>, document.body)}
                    <GameRender/>
                    </>
                );
            case "Lobby":
                return(
                    <div>
                    {createPortal(<Paused/>, document.body)}
                    <Lobby 
                        socket={socket} status={pStatus} paused={paused} changeStatus={playerToggleReady} 
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

    return (<>{isLeader ? <Leader/> : <GS/>}</>);
}