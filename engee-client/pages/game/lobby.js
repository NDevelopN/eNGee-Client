import {PlayerList} from '@/components/listView';
 
export default function Lobby({leave, status, changeStatus, plrList}) {

    //TODO: something odd with the ternary operator 
    return (
        <>
        <PlayerList playerList={plrList}/>
        <span>
            <button onClick={leave}>Leave</button>
            <button onClick={changeStatus}>{status === "Ready" ? "Unready" : "Ready"}</button>
        </span>
        </>
    );
}