import {useState} from 'react';
import { createPortal } from 'react-dom';

import {PlayerList} from '@/components/listView';
import { ConfirmDialog } from '@/components/dialogs';

export default function PostStory({plrList, lid, quit}) {

    let [dialog, setDialog] = useState(false);

    return (
        <div>
            <h3> Post Story </h3>
            <PlayerList playerList={plrList} lid={lid} notReadyAlt={"Reading"}/>
            <span>
                <button onClick={()=>setDialog(true)}>Leave</button>
            </span>
            {dialog ?
            createPortal(
                <ConfirmDialog
                    text={"Are you sure you want to leave?"}
                    confirm={() => {quit(); setDialog(false)}}
                    close={() => setDialog(false)}
                />,
                document.body)
            : <></>
            }
        </div>
    );
}