import {useState, useEffect} from 'react';

import { GameList } from '@/components/listView';
import { POST }  from '@/lib/networkFunctions';

export default function GameBrowser({pid, UserName, callback}) {
    let [gameList, setGameList] = useState([])

    useEffect(() => {
        getGames();
       // let timer = setInterval(() => getGames(), 5000);
    },[]);

    function getGames() {
        let endpoint = "http://localhost:8080/server/browser";
        let message = {
            pid: pid,
            name: UserName,
        };

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log("Got list");
            console.log(e);
            if (e.games) {
                setGameList(e.games)
            }
        });
    }

    function join(gameid) {
        let message = {
            pid: pid,
            gid: gameid,
        };

        let endpoint = "http://localhost:8080/game/join";

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log("Joined");
            console.log(e);
        });

        // TODO: confirm joined
        callback(gameid);
    }

    function createGame() {
        callback();
    }

    return (
        <>
        <GameList gameList={gameList} joinFunc={join}/>
        <button onClick={createGame}>Create new Game</button>
        </>
    );
}