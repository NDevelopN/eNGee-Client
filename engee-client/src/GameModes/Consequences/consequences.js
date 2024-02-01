import { useState, useEffect, useRef } from 'react';

import { wsConnect } from '../../net.js';
import NoConnection from '../NoConnection';
import Prompts from './prompts.js'
import Shuffled from './shuffled.js'

import { Paper, ButtonGroup, Button } from '@mui/material';

function Consequences({wsEndpoint, leave, setWarning, setConfirmation, setOnConfirm}) {
    let [gameState, setGameState] = useState(0);
    let [prompts, setPrompts] = useState([""]);
    let [shuffled, setShuffled] = useState([""]);

    const connection = useRef(null);

    useEffect(() => {
        setTimeout(connect, 2000);
        return disconnect;
    }, [wsEndpoint]);

    function connect() {
        if (connection.current !== null && connection.current !== undefined) {
            console.log("There is an existing connection")
            return
        }

        connection.current = wsConnect(wsEndpoint, onOpen, onClose, onMessage);
    }

    function disconnect() {
        console.log("Disconnecting");
        if (connection.current !== null && connection.current !== undefined) {
            connection.current.close();
        }
    }

    function onOpen() {
        if (connection.current !== null && connection.current !== undefined) {
            console.log("Connection established");
        }
    }

    function onClose() {
        if (connection.current !== null && connection.current !== undefined) {
            console.log("Connection closed");
        }
        connection.current = null;
        setGameState(-1);
    }

    function onMessage(event) {
        if (connection.current !== null && connection.current !== undefined) {
            let data = JSON.parse(event.data);

            switch(data.type) {
                case "Status":
                    setGameState(parseInt(data.content));
                    break;
                case "Prompts":
                    setPrompts(JSON.parse(data.content));
                    break;
                case "Shuffled":
                    setShuffled(JSON.parse(data.content));
                    break;
                default: 
                    console.error("Unexpected message type received: " + data.type);
                    return;
            }
        }
    }

    function send(msgType, content) {
        console.log("Using Send")
        if (connection.current !== null && connection.current !== undefined) {
            let message = {
                'type': msgType,
                'content': content,
            };

            console.log("Sending message: " + JSON.stringify(message));

            connection.current.send(JSON.stringify(message));
        } else {
            console.error("Attempted to send message but the websocket connection is not available.");
        }
    }

    function reconnect() {
        connect();
    }

    function sendReplies(replies) {
        setConfirmation("Are you sure you want to submit these replies?");
        setOnConfirm(() => send("Reply", JSON.stringify(replies)));
    }

    function sendContinue() {
        setConfirmation("Are you ready to continue? You won't be able to return.");
        setOnConfirm(() => send("Continue", "."));
    }

    switch (gameState) {
        case -1:
            return <NoConnection reconnect={reconnect}/>;
        case 0:
            return <h3>Waiting for server</h3>;
        case 1:
            return <Prompts prompts={prompts} sendReplies={sendReplies} setWarning={setWarning}/>;
        case 2:
            return <Shuffled prompts={prompts} shuffled={shuffled} sendContinue={sendContinue}/>;
        default:
            return (
            <>
                <h3>Unsupported Game State.</h3>
                <button onClick={leave}>Leave</button>
            </>
            );            
    }
}

export default Consequences;