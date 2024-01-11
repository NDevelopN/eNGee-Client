import { useState, useEffect } from 'react';

import User from '../User';
import Browser from '../Browser';
import Room from '../Room';

const url = "http://localhost:8090";

function Home() {
    let [Mode, setMode] = useState(0);
    let [UserInfo, setUserInfo] = useState({'name': "", 'uid': ""});
    let [RoomInfo, setRoomInfo] = useState({'name': "", 'rid': "", 'type': ""});

    useEffect(updateMode, [UserInfo, RoomInfo]);

    //TODO define Modes and transitions
    function updateMode() {
        if (UserInfo.uid === "" || UserInfo.uid === undefined) {
            setMode(0);
            return;
        }

        if (Mode === 0) {
            if (UserInfo.uid !== "" && UserInfo.uid !== undefined) {
                setMode(1);
            }
        }

        if (Mode === 1 || Mode === 2) {
            if (RoomInfo.rid !== "" && RoomInfo.rid !== undefined) {
                setMode(3);
            }
        }
    }

    function ModeScreen() {
        switch(Mode) {
            case 0:
                return <h3>Please set your name.</h3>;
            case 1:
                return <Browser uid={UserInfo.uid} url={url} createRoom={()=>setMode(2)} setRoomInfo={setRoomInfo}/>
            case 2:
                return <Room url={url} setRoom={setRoomInfo} leave={()=>setMode(1)}/>
            case 3:
                return <h3>This is where the room lobby goes....</h3>
            default:
                return <h3>Invalid Mode</h3>;
        }
    }

    return (
        <>
            <User url={url} User={UserInfo} setUser={setUserInfo}/>
            <ModeScreen/>
        </>
    );
}

export default Home;