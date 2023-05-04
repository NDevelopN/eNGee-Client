import {useState} from 'react'

import GameManager from '@/components/gameManager'

export default function LeaderView({info, gid, status, send, types}) {

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
            <GameManager gid={gid} info={info} send={send} exit={rulesUpdate} types={types}/>
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
        case "Play":
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