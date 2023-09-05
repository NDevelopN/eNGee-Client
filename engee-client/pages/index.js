import {useState, useEffect} from 'react';
import Head from 'next/head';

import {POST, PUT, DELETE, SOCK} from '@/lib/networkFunctions';
import ReadCookie from '@/lib/readCookie';

import Layout, {siteTitle} from '@/components/layout';
import UserCreate from '@/components/server/userCreate';
import GameBrowser from '@/components/server/gameBrowser';
import GameCreator from '@/components/server/gameCreator';
import GameScreen from '@/components/gameScreen';

export default function Home() {
    let [User, setUser] = useState({});
    let [Status, setStatus] = useState([]);
    let [active, setActive] = useState(false);
    let [socket, setSocket] = useState({});

    useEffect(() => {
        let uid = ReadCookie("uid");
        if (uid === undefined) {
            uid = "";
        }

        let gid = ReadCookie("gid");
        if (gid === undefined) {
            gid = "";
        }
        
        let uName = ReadCookie("username");
        if (uName === undefined) {
            uName = "UserName";
        }

        let uStatus = ReadCookie("userstatus");
        if (uStatus === undefined) {
            uStatus = "";
        }

        if (uid != "") {
            if (gid != "") {
                setStatus(["Browsing","InGame"])
            }
            else {
                setStatus(["Browsing"])
            }
        } else {
            gid = "";
            uName = "";
            uStatus = "";

            document.cookie = "gid=;path='/'";
            document.cookie = "username=;path='/'";
            document.cookie = "userstatus=;path='/'";
            
            
            setStatus(["Naming"])
        }

        let user = {
            uid: uid,
            gid: gid,
            name: uName,
            status: uStatus,
        };

        setUser(user);

        setActive(true);
        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let CONFIG = require(`@/config.json`);
    let url = CONFIG.url
    if (url === null) {
        console.error("Could not get URL from config.json");
    }

    async function updateUser(user, callback) {
        if (user.uid === "") {
            POST(JSON.stringify(user), url + "/users", (e) => {
                user.uid = e.uid;
                setStatus(["Browsing"])
                setUser(user)

                document.cookie = "uid=" + user.uid + ";path='/'";
                document.cookie = "username=" + user.name + ";path='/'";
                document.cookie = "userstatus=" + user.status + ";path='/'";
                callback();
            });
        } else if (user.name === "") {

            DELETE(url + "/users/" + user.uid, () => {
                document.cookie = "uid=" + user.uid + ";path='/'";
                document.cookie = "username=" + user.name + ";path='/'";
                callback();
            });
            
            user.uid = "";
            setStatus(["Naming"]);
            setUser(user)
        } else {
            PUT(JSON.stringify(user), url + "/users/" + user.uid, () => {
                setUser(user)

                document.cookie = "uid=" + user.uid + ";path='/'";
                document.cookie = "username=" + user.name + ";path='/'";
                callback();
            });
        }
    }

    async function setGame(gid) {
        setActive(false);
        let user = User;
        user.gid = gid;
        document.cookie = "gid=" + gid + ";path='/'";

        updateUser(user, () => {
            if (gid === "") {
                return;
            }

            let endpoint = "ws" + url.substring(4) + "/games/" + User.uid;
            SOCK(endpoint, socketOpen, socketClose);

            setActive(true);
        });
    }

    function socketOpen(sock) {
        if (sock !== null) {
            setSocket(sock);
            setStatus(["Browsing", "InGame"]);
        }
    }

    function leaveGame() {
        socketClose(null);
    }

    function socketClose(event) {
        if (event === null ) {
            console.log("[close] Client error")
        }
        else if(event !== undefined && event.wasClean) {
            console.log("[close] Connection closed cleanly, code= " + event.code + ", reason= " + event.reason);
        } else  {
            console.log("[close] Connection died.");
        }

        let user = User;
        user.Status = "Left";
        user.gid = "";
        updateUser(user, () => {
            document.cookie = "gid=;path='/'";
            revertStatus();
        });
    }

    function updateStatus(nStat) {
        setActive(false)
        let s = [...Status] 
        s.push(nStat);
        setStatus(s);
        setActive(true);
    }

    function revertStatus() {
        setActive(false);
        let s = [...Status];
        if (s.length > 1) {
            s.pop();
            setStatus(s);
        }

        setActive(true);
    }

    function ContentSwitch() {
        switch (Status[Status.length-1]) {
        case "Naming":
            return (
                <UserCreate pUser={User} updateUser={updateUser} revertStatus={revertStatus} setStatus={setStatus}/>
            );
        case "Browsing":
            return (
                <GameBrowser updateStatus={updateStatus} setGame={setGame} url={url}/>
            );
        case "InGame":
            if (socket === undefined) {
                return <h2> Socket undefined</h2>
            }
            return (
                <GameScreen user={User} setUser={setUser} leaveGame={leaveGame} revertStatus={revertStatus} url={url} socket={socket} setSocket={setSocket}/>
            );
        case "Creating":
            return (
                <GameCreator uid={User.uid} info={null} setGame={setGame} revertStatus={revertStatus} url={url}/>
            );
        default:
            return null;
        }
    }

    if (active) {
        return (
            <Layout name={User.name} isNaming={Status[Status.length-1] === "Naming"} updateStatus={updateStatus}>
                <Head>
                    <title>
                        {siteTitle}
                        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                    </title>
                </Head>
                <main>
                    <ContentSwitch/>
                </main>
            </Layout>
        );
    }
}