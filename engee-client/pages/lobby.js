import Head from 'next/head';

import Layout, {siteTitle} from '../components/layout';
import {PlayerList} from '../components/listView';

import styles from '../styles/Home.module.css';


export default function Lobby() {
    function plrConfirm() {
        if (checkLeadStart()) {
            //TODO: send start commmand to server
        }
        else {
            //TODO: send ready status to server
        }
        console.log("Confirm button pressed");
    }

    function plrCancel() {
        if (checkLeadStart()) {
            //TODO: send kill commmand to server
        }
        else {
            //TODO: send leave status to server
        }
        console.log("Cancel button pressed");

    }

    //TODO: Make websocket for checking current players 
    function getPlayerList() {
        return (
            [
                { name: "Player 1", id: 1, ready: true  },
                { name: "Player 2", id: 2, ready: false },
                { name: "Player 3", id: 3, ready: true  },
                { name: "Player 4", id: 4, ready: false },
                { name: "Player 5", id: 5, ready: false },
            ]
        )

    }

    //TODO: Check if current player is leader
    //TODO: Check if there are conditions for start override
    function checkLeadStart() {
        return false;
    }

    return (
        <Layout>
            <Head>
                <title>{siteTitle} - Lobby</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className={styles.main}>
                <PlayerList 
                    playerList={getPlayerList()} 
                    conFunc={plrConfirm()} 
                    cancelFunc={plrCancel()} 
                    conText={checkLeadStart() ? "Start" : "Ready"}
                    disText={checkLeadStart() ? "Cancel Game": "Disconnect"}
                />
            </main>
        </Layout>
    )
}