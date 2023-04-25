import {useState} from 'react'

import Lobby from '@/pages/game/lobby'
import GameUpdate from '@/pages/game/leader/gameUpdate'

import {POST} from '@/lib/networkFunctions'

export default function LeaderView({pid, gid, gStatus}) {

    let [status, setStatus] = useState(gStatus);

    function sendPause(stat) {
        let message = {
            pid: pid,
            gid: gid,
        };

        let endpoint = "http://localhost:8080/game/pause";

        POST(JSON.stringify(message), endpoint, () => {
            setStatus(stat);
        });
    }
    
    function unpause() {
        sendPause("Ready");
    }

    function pause() {
        sendPause("Pause");
    }

    function start() {
        let message = {
            pid: pid,
            gid: gid,
        };

        let endpoint = "http://localhost:8080/game/start";

        POST(JSON.stringify(message), endpoint, () => {

        });
    }

    function rulesUpdate() {
        
        setStatus("Rules");
    }

    function endGame() {
        let message = {
            pid: pid,
            gid: gid,
        };

        let endpoint = "http://localhost:8080/game/end";

        POST(JSON.stringify(message), endpoint, () => {
        });
    }

    function restart () {
        let message = {
            pid: pid,
            gid: gid,
        };

        let endpoint = "http://localhost:8080/game/restart";

        POST(JSON.stringify(message), endpoint, () => {
            setStatus("Restarting");
        });
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
                    <button onClick={unpause}>Unpause</button>
                    <button onClick={endGame}>End Game</button>
                    <button onClick={restart}>Restart</button>
                    
                </div>
            );
        case "Rules":
            return (
                <GameUpdate gid={gid} pid={pid} restart={restart}/>
            );
    }
}