import {useState} from 'react';
import Popup from 'reactjs-popup';

import { ConfirmDialog } from '@/components/dialogs';

let submit = null;

export default function LeaderView({status, send}) {
    let [dialog, setDialog] = useState(false);
    let [confirmationText, setConfirmationText] = useState("");

    function pause() {
        send("Pause", "");
    }

    function start() {
        setConfirmationText("Are you sure you're ready to start?");
        submit = () => {
            send("Start", "");
        };
        setDialog(true);
    }

    function Pop() {
        if (dialog) {
            return (<Popup open={dialog} onClose={()=>setDialog(false)}>
                <ConfirmDialog
                    text={confirmationText}
                    confirm={(e) => {
                        submit(); 
                        setDialog(false);
                    }}
                    close={()=>setDialog(false)}
                />
            </Popup>);
        } else {
            return <></>;
        }
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
        default:
            console.log("Invalid Leader status: " + status);
            return (<></>);
    }
}