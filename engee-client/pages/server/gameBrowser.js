import {useState, useEffect} from 'react';

import { GameList } from '@/components/listView';
import { GET }  from '@/lib/networkFunctions';

export default function GameBrowser({callback, joinFunc, endpoint}) {
    let [gameList, setGameList] = useState([])

    useEffect(() => {
        getGames();
        const timer = setInterval(() => getGames(), 2000);

        return () => {
            clearInterval(timer);
        }
    },[]);

    function getGames() {
        
        GET(endpoint + "/server/browser", (e) => {
            if (e.games) {
                setGameList(e.games)
            } else {
                console.log("No games received from server");
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