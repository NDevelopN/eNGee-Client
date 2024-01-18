import { useState, useEffect, useRef } from 'react';
import { wsConnect } from '../../net.js';

import TestInput from './testInput.js'

function TestMode({wsEndpoint, userInfo, leave}) {
    let [gameState, setGameState] = useState(0);
    let [gameInfo, setGameInfo] = useState();

    const connection = useRef(null);

    useEffect(connect, [wsEndpoint]);

    function connect() {
        if (connection.current === null && connection.current === undefined) {
            connection.current = wsConnect(wsEndpoint, onOpen, onClose, onMessage);
            return disconnect;
        } 
    }
    
    function disconnect() {
        console.log("Disconnecting");
        connection.current.close();
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
        setGameState(-1);
    }

    function onMessage(event) {
        if (connection.current !== null && connection.current !== undefined) {
            let data = JSON.parse(event.data);

            switch(data.type) {
                case "Status":
                    setGameState(parseInt(data.content));
                    break;
                case "Info":
                    setGameInfo(data.content);
                    break;
                case "Test":
                    alert(data.content);
                    break;
                default: 
                    console.error("Unexpected message type received: " + data.type);
                    return;
            }
        }
    }

    function send(content) {
        if (connection.current !== null && connection.current !== undefined) {
            let message = {
                'type': "Test",
                'content': content,
            };

            connection.current.send(JSON.stringify(message));
        } else {
            console.error("Attempted to send message but the websocket connection is not available.");
        }
    }

    function reconnect() {
        connect();
    }

    function NoConnection() {
        return (
            <>
            <h4>Not connected to the game. Something may be wrong.</h4>
            <div>
                <button onClick={reconnect}>Reconnect</button>
                <button onClick={leave}>Abort</button>
            </div>
            </>
        );
    }

    switch (gameState) {
        case -1:
            return <NoConnection/>;
        case 0:
            return <TestInput send={send}/>;
        case 1: 
            return <h3>Connecting...</h3>;
        default:
            return (
            <>
                <h3>TestMode: Unsupported Game State.</h3>
                <button onClick={leave}>Leave</button>
            </>
            );            
    }
}

export default TestMode;