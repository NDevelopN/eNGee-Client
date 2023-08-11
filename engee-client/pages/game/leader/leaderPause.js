import {useState, useEffect} from 'react';

import GameManager from '@/components/gameManager';
import { ConfirmDialog } from '@/components/dialogs';

let submit = null;

export default function LeaderPause({info, status, send, url}) {
    let [types, setTypes] = useState(["consequences"]); //TODO]
    let [inRules, setInRules] = useState(false);
    let [dialog, setDialog] = useState(false);
    let [confirmationText, setConfirmationText] = useState("");

    useEffect(getTypes, [])

    function getTypes() {
        //TODO: make request to server for list of available game types
        setTypes(["consequences"]);
    }

    function unpause() {
        send("Pause", "");
    }

    function rulesUpdate(info) {
        let text = JSON.stringify(info);
        send("Rules", text);
        setInRules(false);
    }

    function endGame() {
        setConfirmationText("This will delete the game for all players, are you sure?");
        submit = () => {
            send("End", ""); 
        };
        setDialog(true);
    }

    function restart () {
        setConfirmationText("Reset all players to the lobby?");
        submit = () => {
            send("Reset", "");
        };
        setDialog(true);
    }
 
    function Pop() {
        if (dialog) {
            return (
                <ConfirmDialog
                    text={confirmationText}
                    confirm={(e) => {
                        submit(); 
                        send("End", "")
                    }}
                />
            );
        } else {
            return <></>;
        }
    }

    if (inRules) {
        return (
            <GameManager info={info} send={rulesUpdate} types={types} 
                revertStatus={()=>setInRules(false)}/>
        );
    }

    return (
        <>
            {dialog ?
            <Pop/> : 
            <>
                <h3>Paused</h3>
                {status === "Lobby" ?
                <div>
                    <button onClick={()=>setInRules(true)}>Edit Rules</button>
                    <button onClick={unpause}>Unpause</button>
                    <button onClick={endGame}>End Game</button>
                    <button onClick={restart}>Restart</button>
                </div>
                :
                <div>
                    <button onClick={unpause}>Unpause</button>
                    <button onClick={endGame}>End Game</button>
                    <button onClick={restart}>Restart</button>
                </div>
                }
            </> 
            }
        </>
    );
}