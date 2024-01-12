import { useState, useEffect, lazy } from 'react';
import Lobby from '../Lobby';

function GameScreen ({url, userInfo, roomInfo, leave}) {

    let [GameMode, setGameMode] = useState(null);

    const data = {
        url: url,
        userInfo: userInfo,
        roomInfo: roomInfo,
        leave: leave,
    }

    useEffect(SelectGameMode, [roomInfo]);

    function SelectGameMode() {
        switch (roomInfo.gamemode) {
            case "test":
                setGameMode(lazy(()=> import('../GameModes/Test')));
                break;

            default:
                setGameMode(null);
                alert("The game mode " + roomInfo.gamemode + " is not supported.");
                break;
        }
    }

    return (
    <>
        {GameMode!== null ? <GameMode {...data}/> : null}
        <Lobby {...data}/>
    </>
    );
}

export default GameScreen;