import { useState }  from 'react';

import Popup from 'reactjs-popup';

import {PlayerList} from '@/components/listView';
import {ConfirmDialog} from '@/components/dialogs';
 
export default function Lobby({leave, status, changeStatus, plrList, lid}) {

    let [dialog, setDialog] = useState(false);
    
    //TODO: something odd with the ternary operator 
    return (
        <>
        <PlayerList playerList={plrList} lid={lid}/>
        <span>
            <button onClick={()=>setDialog(true)}>Leave</button>
            <button onClick={changeStatus}>{status === "Ready" ? "Unready" : "Ready"}</button>
        </span>
        <Popup open={dialog} onClose={()=>setDialog(false)}>
            <ConfirmDialog
                text={"Are you sure you want to leave?"}
                confirm={() => {leave(); setDialog(false)}}
                close={() => setDialog(false)}
            />
        </Popup>
        </>
    );
}