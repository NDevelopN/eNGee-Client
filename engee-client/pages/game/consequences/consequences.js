import { useState, useEffect } from 'react';

import Prompts from '@/pages/game/consequences/prompts';
import Story from '@/pages/game/consequences/story';

import Popup from 'reactjs-popup';

import {ConfirmDialog} from '@/components/dialogs';

export default function Consequences({msg, send, quit}) {


    let [dialog, setDialog] = useState(false);

    let [conState, setConState] = useState("Wait");
    let [prompts, setPrompts] = useState([]);
    let [story, setStory] = useState([]);
    let [message, setMessage] = useState();

    let tempState = ""

    useEffect(() => {
        switch (msg.type) {
            case "ConState":
                if (msg.content !== "" && msg.content !== undefined) {
                
                }
                setConState(msg.content);
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
            case "Accept":
                //TODO
                break;
            default:
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
        case "Wait":
            return (<h3>Waiting for other players...</h3>);
        case "Prompts":
            return (
                <>
                <Prompts prompts={prompts} reply={reply} quit={() => setDialog(true)}/>
                <LeaveDialog/>
                </>
            );
        case "Pause":
            return (<h3>Please wait for unpause...</h3>)
        case "Story":
            return (
                <>
                <Story story={story} send={send} quit={() => setDialog(true)}/>
                <LeaveDialog/>
                </>
            );
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