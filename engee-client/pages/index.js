import {useState, useEffect} from 'react';
import Head from 'next/head';

import ContentSwitch from '@/pages/server/contentSwitch';
import Layout, {siteTitle} from '@/components/layout';

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

    //TODO include multiple games
    function setGame(id) {
        setGID(id);
        setStatus("InGame");
    }
    
    function setCreating() {
        setStatus("Creating")
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
                        setUser={setUser} setGame={setGame} setCreating={setCreating}
                    />
                </main>
        </Layout>
    );
}