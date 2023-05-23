import {useState, useEffect} from 'react';
import Head from 'next/head';

import ContentSwitch from '@/pages/server/contentSwitch';
import Layout, {siteTitle} from '@/components/layout';
import { POST } from '@/lib/networkFunctions';

export default function Home() {
    let [UUID, setUUID] = useState("");
    let [UserName, setUserName] = useState("Test Name");
    let [GID, setGID] = useState("");
    let [status, setStatus] = useState("Naming")
    //TODO: Request from server
    let [types, setTypes] = useState(["", "Consequences"]);


    let CONFIG = require('@/config.json')

    let url = CONFIG.url
    if (url === null) {
        console.log("URL not found in config file");
        return
    }

    let defGInfo = {
        gid: "",
        name: "",
        type: "",
        status: "",
        old_status: "",
        leader: "",
        rules: {
            rounds: 1,
            min_plrs: 1,
            max_plrs: 1,
            timeout: 0,
            additional: ""
        },
        players: [],
    }
   
    function setUser(id, name){
        setUUID(id);
        setUserName(name);
        setStatus("Browsing");
    }

    function setGame(id) {
        setGID(id);
        setStatus("InGame");
    }

    function join(gameID) {
        let message = {
            pid: UUID,
            gid: gameID,
        };

        //TODO remove endpoint harcoding
        POST(JSON.stringify(message), url + "/server/join", (e) => {
            console.log("Joined");
            if (e.message === "ACK") {
                setGID(gameID);
                setStatus("InGame");
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

    return (
        <Layout home> <Head>
                <title>
                    {siteTitle}
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </title>
            </Head>
                <main>
                    <ContentSwitch
                        UUID={UUID} GID={GID} UserName={UserName} status={status} 
                        setUser={setUser} setGame={setGame} statusChange={setStatus}
                        joinFunc={join} url={url} gameCreate={gameCreate} 
                        exit={exit} types={types} defGInfo={defGInfo}
                    />
                </main>
        </Layout>
    );
}