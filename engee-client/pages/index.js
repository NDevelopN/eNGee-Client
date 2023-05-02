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
        let endpoint = "http://localhost:8080/server/join";

        POST(JSON.stringify(message), endpoint, (e) => {
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

    return (
        <Layout home>
            <Head>
                <title>
                    {siteTitle}
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </title>
            </Head>
                <main>
                    <ContentSwitch
                        UUID={UUID} GID={GID} UserName={UserName} status={status} 
                        setUser={setUser} setGame={setGame} statusChange={setStatus}
                        joinFunc={join}
                    />
                </main>
        </Layout>
    );
}