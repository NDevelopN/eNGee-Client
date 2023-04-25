import {useState} from 'react';

import { PlayerList } from '@/components/listView';
import { POST }  from '@/lib/networkFunctions';

export default function Lobby({pid, gid, leave, plrList}) {

    //TODO: transition into gameplay
    let [ready, setReady] = useState(false);
    
    function changeReady() {
        let message = {
            pid: pid,
            gid: gid,
        };
        
        let endpoint = "http://localhost:8080/game/ready";

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log("Changed ready")
            setReady(!ready);
            //TODO Check for fail
        });
    }
    
    return (
        <>
        <PlayerList playerList={plrList}/>
        <span>
            <button onClick={leave}>Leave</button>
            <button onClick={changeReady}>{ready ? "Unready" : "Ready"}</button>
        </span>
        </>
    );
}