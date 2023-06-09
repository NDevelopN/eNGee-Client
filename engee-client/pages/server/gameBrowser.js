import {useState, useEffect} from 'react';

import { GameList } from '@/components/listView';
import { GET }  from '@/lib/networkFunctions';

export default function GameBrowser({callback, joinFunc, url}) {
    let [gameList, setGameList] = useState([])

    useEffect(() => {
        getGames();
        const timer = setInterval(() => getGames(), 100000);

        return () => {
            clearInterval(timer);
        }
    },[]);

    function getGames() {
        
        GET(url + "/server/browser", (e) => {
            if (e[0]) {
                setGameList(e)
                console.log(e)
            } else {
                setGameList([]);
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