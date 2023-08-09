import { useState, useEffect } from 'react';

import Prompts from '@/pages/game/consequences/prompts';
import Story from '@/pages/game/consequences/story';

import Popup from 'reactjs-popup';

import {ConfirmDialog} from '@/components/dialogs';

export default function Consequences({msgs, setMsgs, send, quit}) {

    const States = {
        LOBBY: 0,
        PROMPTS: 1,
        POSTPROMPTS: 2,
        STORIES: 3,
        POSTSTORIES: 4,
        ERROR: 5,
        WAIT: 10,
    }

    let [dialog, setDialog] = useState(false);

    let [conState, setConState] = useState(States.WAIT);
    let [prompts, setPrompts] = useState([]);
    let [story, setStory] = useState([]);

    let tempState = ""

    const timeout = 100

    useEffect(() => {
        processInput();
    },[msgs]);
    
    function processInput() {
        if (msgs.length == 0) {
            return
        }

        let message = msgs.pop() 

        switch (message.type) {
        case "ConState":
            if (message.content !== "" && message.content !== undefined) {
                setConState(Number(message.content));
            } else {
                setConState(States.ERROR);
            }
            break;
        case "ConTimer":
            break;
        case "Prompts":
            if (message.content === "" || message.content === undefined) {
                console.error("Empty prompts");
                setConState(States.ERROR);
                break;
            }

            setPrompts(JSON.parse(message.content));
            break;
        case "Story":
            if (message.content === "" || message.content === undefined) {
                console.error("Empty story");
                setConState(States.ERROR);
                break;
            }

            setStory(JSON.parse(message.content));
            break;
        default:
            console.error("Unknown message type: " + message.type);
            setConState(States.ERROR)
            break;
        }

        setMsgs(msgs);

    }

    function reply(replies) {

        send("Reply", JSON.stringify(replies));
    }

    function update(text) {
        send("Update", text);
    }

    function leave() {
        send("Leave", "");
        quit();
    }

    function LeaveDialog() {
        return (
            <Popup open={dialog} onClose={()=>setDialog(false)}>
                <ConfirmDialog
                    text={"Are you sure you want to leave?"}
                    confirm={() => {leave(); setDialog(false)}}
                    close={() => setDialog(false)}
                />
            </Popup>
        );
    }

    switch (conState) {
        case States.WAIT:
            return (<h3>Waiting for other players...</h3>);
        case States.PROMPTS:
            return (
                <>
                <Prompts prompts={prompts} reply={reply} quit={() => setDialog(true)}/>
                <LeaveDialog/>
                </>
            );
        case States.POSTPROMPTS:
            break;
        case States.STORIES:
            return (
                <>
                <Story story={story} send={send} quit={() => setDialog(true)}/>
                <LeaveDialog/>
                </>
            );
        case States.POSTSTORIES:
            break;
        case States.ERROR:
            break;
        default:
            /** 
            tempState = conState
            setInterval(() => {
                if (conState === tempState) {
                    leave();
                }
            }, 5000);
            */  

            return (
                <h3>Something went wrong</h3>
            );
    }
}