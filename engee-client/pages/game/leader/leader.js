import {useState} from 'react'
import Popup from 'reactjs-popup';

import GameManager from '@/components/gameManager'
import { ConfirmDialog } from '@/components/dialogs';

export default function LeaderView({info, gid, status, send, types}) {

    let [inRules, setInRules] = useState(false)
    let [dialog, setDialog] = useState(false)
    let [confirmationText, setConfirmationText] = useState("")
    let [submitType, setSubmitType] = useState("")

    function pause() {
        send("Pause", "");
    }

    function start() {
        setConfirmationText("Are you sure you're ready to start?");
        setSubmitType("Start");
        setDialog(true);
    }

    function rulesUpdate() {
        setInRules(!inRules)
    }

    function endGame() {
        setConfirmationText("This will delete the game for all players, are you sure?");
        setSubmitType("End");
        setDialog(true);
    }

    function restart () {
        setConfirmationText("Reset all players to the lobby?");
        setSubmitType("Restart");
        setDialog(true);
    }

    function handleSubmit(type) {
        send(type, "")
    }

    function Pop() {
        if (dialog) {
            return <Popup open={dialog} onClose={()=>setDialog(false)}>
                <ConfirmDialog
                    text={confirmationText}
                    confirm={(e) => {handleSubmit(submitType); setDialog(false)}}
                    close={()=>setDialog(false)}
                />
            </Popup>
        } else {
            return <></>
        }
    }

    //Override current status until exited rules
    if (inRules) {
        return (
            <GameManager gid={gid} info={info} send={send} exit={rulesUpdate} types={types}/>
        );
    }

    switch (status) {
        case "Lobby": 
            return (
                <div>
                    <Pop/>
                    <button onClick={pause}>Pause</button>
                    <button onClick={start}>Start</button>
                </div>
            );
        case "Play":
            return(
                <div>
                    <Pop/>
                    <button onClick={pause}>Pause</button>
                </div>
            );
        case "Pause":
            return (
                <div>
                    <Pop/>
                    <button onClick={rulesUpdate}>Edit Rules</button>
                    <button onClick={pause}>Unpause</button>
                    <button onClick={endGame}>End Game</button>
                    <button onClick={restart}>Restart</button>
                    
                </div>
            );
        default:
            console.log("Invalid Leader status: " + status);
            return (<></>);
    }
}