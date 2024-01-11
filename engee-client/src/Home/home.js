import { useState, useEffect } from 'react';

import User from '../User';

const url = "http://localhost:8090";

function Home() {
    let [Mode, setMode] = useState(0);
    let [UserInfo, setUserInfo] = useState({'name': "", 'uid': ""});

    useEffect(updateMode, [UserInfo]);

    //TODO define Modes and transitions
    function updateMode() {
        if (Mode === 0) {
            if (UserInfo.uid !== "" && UserInfo.uid !== undefined) {
                setMode(1);
            }
        }

        if (Mode === 1) {
            if (UserInfo.uid === "" || UserInfo.uid === undefined) {
                setMode(0);
            }
        }
    }

    function ModeScreen() {
        switch(Mode) {
            case 0:
                return <h3>Please set your name.</h3>;
            case 1:
                return <h3>Welcome, {UserInfo.name}!</h3>;
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