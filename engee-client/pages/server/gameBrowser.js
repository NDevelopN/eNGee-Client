import {useState, useEffect} from 'react';

import { GameList } from '@/components/listView';
import { POST }  from '@/lib/networkFunctions';

export default function GameBrowser({pid, UserName, callback, joinFunc}) {
    let [gameList, setGameList] = useState([])

    useEffect(() => {
        getGames();
        const timer = setInterval(() => getGames(), 5000);

        return () => {
            clearInterval(timer);
        }
    },[]);

    //TODO: change this to a simple GET
    function getGames() {
        let endpoint = "http://localhost:8080/server/browser";
        let message = {
            pid: pid,
            name: UserName,
        };

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log(e);
            if (e.games) {
                setGameList(e.games)
            }
        });
    }

    function createGame() {
        callback("Creating");
    }

    return (
        <>
        <GameList gameList={gameList} joinFunc={joinFunc}/>
        <button onClick={createGame}>Create new Game</button>
        </>
    );
}