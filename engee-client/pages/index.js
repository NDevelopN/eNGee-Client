import {useState, useEffect} from 'react';
import Head from 'next/head';

import Layout, {siteTitle} from '@/components/layout';
import { POST } from '@/lib/networkFunctions';
import ReadCookie from '@/lib/readCookie';

import UserCreate from '@/pages/server/userCreate';
import GameBrowser from '@/pages/server/gameBrowser';
import GameManager from '@/components/gameManager';
import GameScreen from '@/pages/game/gameScreen';

const listInterval = 1000;

export default function Home() {
    let [UUID, setUUID] = useState("");
    let [UserName, setUserName] = useState("");
    let [GID, setGID] = useState("");
    let [status, setStatus] = useState("Naming")
    let [oldStatus, setOldStatus] = useState("");
    //TODO: Request from server
    let [types, setTypes] = useState(["Consequences"]);

    let [gameList, setGameList] = useState([]);

    useEffect(() => {
        let id = ReadCookie("uuid");
        if (id != "" ){
            setUUID(id);
            setUserName(ReadCookie("username"));
            setStatus("Browsing");
        }

        const timer = setInterval(() => getGameList(), listInterval);
        return () => {
            clearInterval(timer);
        }

    }, []) 

    let CONFIG = require('@/config.json')
    let url = CONFIG.url
    if (url === null) {
        console.log("URL not found in config file");
        return
    }

    function setUser(id, name){
        setUUID(id);
        document.cookie = "uuid=" + id +" ;path='/'";
        setUserName(name);
        document.cookie = "username=" + name + ";path='/'";
        setStatus("Browsing");
    }

    function setGame(id) {
        setGID(id);
        setStatus("InGame");
    }

    function toLobby() {
        if (status != "InGame") {
            setStatus("Lobby");
        }
    }

    function toUser() {
        setOldStatus(status);
        setStatus("Naming")
    }

    function updateStatus(newStatus) {
        setOldStatus(status);
        setStatus(newStatus);
    }

    function revertStatus() {
        setStatus(oldStatus);
        setOldStatus("");
    }

    function goBack() {
        if (oldStatus != "") {
            setStatus(oldStatus);
            setOldStatus("");
        }
    }

    function getGameList() {
        GET(url + "/server/browser", (e) => {
            if (e.games) {
                setGameList(e.games);
            } else {
                setGameList([]);
            }
        });
    }

    function join(gameID) {
        let message = {
            pid: UUID,
            gid: gameID,
        };

        POST(JSON.stringify(message), url + "/server/join", (e) => {
            console.log("Joined");
            if (e.message === "ACK") {
                setGame(gameID);
            }
            //TODO this should be a http error
            else {
                console.log("ERROR: gameID not matching");
            }
        });
    }

    function gameCreate(type, message) {
        POST(message, url + "/server/create", (e) => {
            console.log(e);
            join(e.gid);
        });
    }

    function exit() {
        setStatus("Browsing");
    }

    function logout() {
        //TODO send message to server
        setUser("", "");
        setStatus("Naming");
    }

    function ContentSwitch() {
        switch (status) {
        case "Naming":
            return (
                <UserCreate id={UUID} name={UserName} login={setUser} revertStatus={revertStatus} logout={logout} url={url}/>
            );
        case "Browsing":
            return (
                <GameBrowser updateStatus={updateStatus} joinFunc={join} gameList={gameList}/>
            );
        case "InGame":
            return (
                <GameScreen pid={UUID} gid={GID} url={url} updateStatus={setStatus} types={types}/>
            );
        case "Creating":
            return (
                <GameManager gid="" info={null} send={gameCreate} exit={exit} types={types}/>
            );
        default:
            return null;
        }
    }

    return (
        <Layout name={UserName} userChange={toUser} home={toLobby}> 
            <Head>
                <title>
                    {siteTitle}
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </title>
            </Head>
                <main>
                    <ContentSwitch/>
                </main>
        </Layout>
    );
}