import {useState} from 'react'

import GameUpdate from '@/pages/game/leader/gameUpdate'

export default function LeaderView({e, gid, status, send}) {

    let [inRules, setInRules] = useState(false)

    function pause() {
        send("Pause", "");
    }

    function start() {
        send("Start", "");
    }

    function rulesUpdate() {
        setInRules(!inRules)
    }

    function endGame() {
        send("End", "");
    }

    function restart () {
        send("Restart", "");
    }

    //Override current status until exited rules
    if (inRules) {
        return (
            <GameUpdate gid={gid} e={e} send={send} exit={rulesUpdate}/>
        );
    }

    switch (status) {
        case "Lobby": 
            return (
                <div>
                    <button onClick={pause}>Pause</button>
                    <button onClick={start}>Start</button>
                </div>
            );
        case "InGame":
            return(
                <div>
                    <button onClick={pause}>Pause</button>
                </div>
            );
        case "Pause":
            return (
                <div>
                    <button onClick={rulesUpdate}>Edit Rules</button>
                    <button onClick={pause}>Unpause</button>
                    <button onClick={endGame}>End Game</button>
                    <button onClick={restart}>Restart</button>
                    
                </div>
            );
        default:
            console.log("Invalid Leader status: " + status);
            return (<></>);
    }
}