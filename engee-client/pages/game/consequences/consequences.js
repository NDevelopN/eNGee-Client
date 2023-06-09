import { useState } from 'react';

import Prompts from '@/pages/game/consequences/prompts';
import Story from '@/pages/game/consequences/story';

import Popup from 'reactjs-popup';

import {ConfirmDialog} from '@/components/dialogs';

export default function Consequences({msg, send, quit}) {

    let [dialog, setDialog] = useState(false);

    function reply(replies) {
        let response = {
            list: replies
        };

        send("Reply", JSON.stringify(response));
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

    if (msg.content === "" || msg.content === undefined) {
        //TODO: should this be handled?
        return;
    }

    let content = JSON.parse(msg.content);

    switch (msg.type) {
        case "Prompts":
            return (
                <>
                <Prompts prompts={content} reply={reply} quit={() => setDialog(true)}/>
                <LeaveDialog/>
                </>
            );
        case "Story":
            return (
                <>
                <Story story={content.lines} send={send} quit={() => setDialog(true)}/>
                <LeaveDialog/>
                </>
            );
        case "Accept":
            return (<h2>Waiting for other players...</h2>);
        default:
            return (<h2>Something isnt quite right.</h2>);
    }
}