import {useState, useEffect} from 'react';

import { PlayerList } from '@/components/listView';
import { POST }  from '@/lib/networkFunctions';

export default function Lobby({pid, gid, leave, changeStatus}) {

    //TODO: transition into gameplay
    let [plrList, setPlrList] = useState([]);
    let [ready, setReady] = useState(false);
    
    useEffect(() => {
        getPlrList();
        let timer = setInterval(() => getPlrList, 10000);
    }, []);

    function getPlrList() {
        let message = {
            pid: pid,
            gid: gid,
        };

        let endpoint = "http://localhost:8080/game/players";

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log("Got Player List");
            console.log(e);
            if (e.players) {
                setPlrList(e.players);
            }
        });
    }

    function sendLeave() {
        let message = {
            pid: pid,
            gid: gid,
        };

        let endpoint = "http://localhost:8080/game/leave";

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log("sent Leave");
            leave();
        });
    }

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
            <button onClick={sendLeave}>Leave</button>
            <button onClick={changeReady}>{ready ? "Unready" : "Ready"}</button>
        </span>
        </>
    );
}