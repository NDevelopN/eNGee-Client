import { useState, useEffect, useRef, lazy } from 'react';
import Lobby from '../Lobby';
import { httpRequest } from '../net';
import { Container, ListItem } from '@mui/material';


const addrInterval = 1000;

function GameScreen ({url, userInfo, roomInfo, leave, setWarning, setConfirmation, setOnConfirm}) {

    let [GameMode, setGameMode] = useState(null);
    let [addr, setAddr] = useState("");

    const first = useRef(true);
    const interval = useRef(null);


    useEffect(WaitForAddr, []) 
    
    function WaitForAddr() {
        if (first.current) {
            first.current = false;
            return
        }
        
        let endpoint = url + "/rooms/" + roomInfo.rid;
        
        GetRoomAddr()

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
                let addr = rInfo.addr.replace("http", "ws") 

                let wsAddress = addr + "/games/" + roomInfo.rid + "/players/" + userInfo.uid;
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
            case "consequences":
                setGameMode(lazy(()=> import('../GameModes/Consequences')));
                break;
            default:
                setGameMode(null);
                alert("The game mode " + roomInfo.gamemode + " is not supported.");
                break;
        }
    }

    return (
    <ListItem>
        <Container maxWidth='md'>
        {GameMode !== null  && GameMode !== undefined && GameMode !== ""
            ? <GameMode 
                wsEndpoint={addr} 
                userInfo={userInfo} 
                leave={leave}
                setWarning={setWarning} 
                setConfirmation={setConfirmation} 
                setOnConfirm={setOnConfirm}/>
            : <h3>No Game mode selected.</h3>}
        </Container>

        <Container maxWidth='sm'>
            <Lobby 
                url={url} 
                userInfo={userInfo} 
                roomInfo={roomInfo} 
                leave={leave}
                setWarning={setWarning} 
                setConfirmation={setConfirmation} 
                setOnConfirm={setOnConfirm}
            />
        </Container>
    </ListItem>
    );
}

export default GameScreen;