import {useState} from 'react';

import { PUT } from '@/lib/networkFunctions';
import GameManager from '@/components/gameManager';
import { ConfirmDialog } from '@/components/dialogs';

let submit = null;

export default function LeaderPause({info, status, send, url}) {
    let [inRules, setInRules] = useState(false);
    let [dialog, setDialog] = useState(false);
    let [confirmationText, setConfirmationText] = useState("");

    function unpause() {
        send("Pause", "");
    }

    function rulesUpdate(info) {
        let endpoint = url + "/games/" + info.gid;
        let msg = JSON.stringify(info);

        PUT(msg, endpoint, (e) => {
            setInRules(false);
        });
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
                    }}
                />
            );
        } else {
            return <></>;
        }
    }

    if (inRules) {
        return (
            <GameManager info={info} send={rulesUpdate} revertStatus={()=>setInRules(false)} url={url}/>
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