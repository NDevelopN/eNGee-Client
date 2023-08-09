import { useState, useEffect } from 'react';

import Prompts from '@/pages/game/consequences/prompts';
import Story from '@/pages/game/consequences/story';

import Popup from 'reactjs-popup';

import {ConfirmDialog} from '@/components/dialogs';

export default function Consequences({msg, send, quit}) {

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

    let [conState, setConState] = useState(WAIT);
    let [prompts, setPrompts] = useState([]);
    let [story, setStory] = useState([]);
    let [message, setMessage] = useState();

    let tempState = ""

    useEffect(() => {
        switch (msg.type) {
            case "ConState":
                if (msg.content !== "" && msg.content !== undefined) {
                    setConState(msg.content);
                }
                break;
            case "ConTimer":
                break;
            case "ConState":
                break;
            case "Prompts":
                if (msg.content === "" || msg.content === undefined) {
                    console.error("Empty prompts");
                    setConState("Error");
                    break;
                }

                setPrompts(JSON.parse(msg.content));
                setConState("Prompts");
                break;
            case "Story":
                if (msg.content === "" || msg.content === undefined) {
                    console.error("Empty story");
                    setConState("Error");
                    break;
                }

                setStory(JSON.parse(msg.content));
                setConState("Story");
                break;
            default:
                console.log("MESSAGE: " + msg);
                console.error("Unknown message type: " + msg.type);
                break;
        }
    }, [message]);


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

    if (msg !== message) {
        setMessage(msg);
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
            tempState = conState
            setInterval(() => {
                if (conState === tempState) {
                    leave();
                }
            }, 5000);

            return (
                <h3>Something went wrong</h3>
            );
    }
}