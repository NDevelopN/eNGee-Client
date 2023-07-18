import {useState, useEffect} from 'react';
import Head from 'next/head';

import Layout, {siteTitle} from '@/components/layout';
import { GET, POST, PUT, DELETE } from '@/lib/networkFunctions';
import ReadCookie from '@/lib/readCookie';

import UserCreate from '@/pages/server/userCreate';
import GameBrowser from '@/pages/server/gameBrowser';
import GameManager from '@/components/gameManager';
import GameScreen from '@/pages/game/gameScreen';

export default function Home() {
    let [User, setUser] = useState({});
    let [Status, setStatus] = useState([]);
    let [active, setActive] = useState(false);

    useEffect(() => {
        let uid = ReadCookie("uuid");
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

        let user = {
            uid: uid,
            gid: gid,
            name: uName,
            status: uStatus,
        };

        setUser(user);

        if (gid != "") {
            setStatus(["Browsing","InGame"])
        } else if (uid != "") {
            setStatus(["Browsing"])
        } else {
            setStatus(["Naming"])
        }

        setActive(true);
        
    }, []);

    let CONFIG = require(`@/config.json`);
    let url = CONFIG.url
    if (url === null) {
        console.error("Could not get URL from config.json");
    }

    async function updateUser(user, callback) {
        setActive(false);
        if (user.uid === "") {
            POST(JSON.stringify(user), url + "/users", (e) => {
                user.uid = e.uid;
                setStatus(["Browsing"])
                setUser(user)

                document.cookie = "uuid=" + user.uid + ";path='/'";
                document.cookie = "username=" + user.name + ";path='/'";
                callback();
            });
        } else if (user.name === "") {
            DELETE(url + "/users/" + user.uid, (e) => {
                user.uid = ""
                setStatus(["Naming"]);
                setUser(user)

                document.cookie = "uuid=" + user.uid + ";path='/'";
                document.cookie = "username=" + user.name + ";path='/'";
                callback();
            });
        } else {
            PUT(JSON.stringify(user), url + "/users/" + user.uid, (e) => {
                setUser(user)

                document.cookie = "uuid=" + user.uid + ";path='/'";
                document.cookie = "username=" + user.name + ";path='/'";
                callback();
            });
        }
    }

    async function setGame(gid, callback) {
        setActive(false)
        let user = User
        user.gid = gid

        updateUser(user, () => {
            document.cookie = "gid=" + gid + ";path='/'";

            let stat = Status[Status.length - 1];
            if (stat === "Browsing" || stat === "Creating") {
                console.log("In Game");
                setStatus(["Browsing", "InGame"]);
            } else {
                setStatus(["Browsing"]);
            }
            callback();
        });
   }

    function updateStatus(nStat) {
        setActive(false)
        let s = [...Status] 
        s.push(nStat);
        setStatus(s);

        document.cookie = "status=" + Status +";path=`/`";
        setActive(true)
    }

    function revertStatus() {
        setActive(false)
        let s = [...Status];
        if (s.length > 1) {
            s.pop();
            setStatus(s);
        }
        setActive(true)
    }

    function ContentSwitch() {
        switch (Status[Status.length-1]) {
        case "Naming":
            return (
                <UserCreate user={User} updateUser={updateUser} revertStatus={revertStatus} url={url}/>
            );
        case "Browsing":
            return (
                <GameBrowser updateStatus={updateStatus} setGame={setGame} setActive={setActive} url={url}/>
            );
        case "InGame":
            return (
                <GameScreen user={User} updateStatus={updateStatus} revertStatus={revertStatus} url={url}/>
            );
        case "Creating":
            return (
                <GameManager uid={User.uid} info={null} setGame={setGame} revertStatus={revertStatus} setActive={setActive} url={url}/>
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