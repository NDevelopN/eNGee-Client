import { useState, useEffect, useRef, lazy } from 'react';
import Lobby from '../Lobby';
import { httpRequest } from '../net';


const addrInterval = 1000;

function GameScreen ({url, userInfo, roomInfo, leave}) {

    let [GameMode, setGameMode] = useState(null);
    let [addr, setAddr] = useState(roomInfo.addr);

    const first = useRef(true);
    const interval = useRef(null);


    useEffect(WaitForAddr, []) 
    
    function WaitForAddr() {
        if (first.current) {
            first.current = false;
            return
        }
        
        let endpoint = url + "/rooms/" + roomInfo.rid;

        interval.current = setInterval(GetRoomAddr, addrInterval);

        return (() => {
            if (interval.current !== null) {
                clearInterval(interval.current);
                interval.current = null;
            }
        });


        function GetRoomAddr() {
            if (addr !== "" && addr !== undefined) {
                clearInterval(interval.current);
                interval.current = null;
                return;
            }

            httpRequest("GET", "", endpoint, (rInfo) => {
                let wsAddress = "ws://" + rInfo.addr + "/games/" + roomInfo.rid + "/players/" + userInfo.uid;
                setAddr(wsAddress);
            });
        }
    }

    useEffect(SelectGameMode, [addr]);

    function SelectGameMode() {
        if (addr === "" || addr === undefined) {
            setGameMode(null);
            return;
        }

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
        {GameMode!== null ? <GameMode wsEndpoint={addr} userInfo={userInfo} leave={leave}/> : null}
        <Lobby url={url} userInfo={userInfo} roomInfo={roomInfo} leave={leave}/>
    </>
    );
}

export default GameScreen;