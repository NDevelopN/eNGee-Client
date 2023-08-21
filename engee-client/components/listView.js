import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export function PlayerList({playerList, lid, readyAlt, notReadyAlt}) {
    
    if (readyAlt === undefined) {
        readyAlt = "Ready";
    }

    if (notReadyAlt === undefined) {
        notReadyAlt = "Not ready";
    }

    function AltStatus({status, leader}) {
        let alt = "";
        switch (status) {
            case "Ready":
                alt = readyAlt;
                break;
            case "Not Ready":
                alt = notReadyAlt;
                break;
            default:
                alt = status;
                break;
        }
        if (leader) {
            return <TableCell><b>{alt}</b></TableCell>;
        }
        return <TableCell>{alt}</TableCell>;
    } 


    function body() {
        return(
            <>
            {playerList.map(player=> (
            <TableRow key ={player.uid}>
                {player.uid === lid ? 
                <>
                    <TableCell><b>{player.name}</b></TableCell>
                    <AltStatus status = {player.status} leader={true}/>
                </>
                : 
                <>
                    <TableCell>{player.name}</TableCell>
                    <AltStatus status = {player.status}/>
                </>
            }
            </TableRow>
            ))}
            </>
        );
    }

    function loading() {
        return (
            <TableRow>
                <TableCell></TableCell>
                <TableCell>Loading</TableCell>
            </TableRow>
        );
    }

    return (
        <Table padding='none'>
            <TableHead>
                <TableRow>
                    <TableCell><b>Player</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                </TableRow>
            </TableHead>

        <TableBody>
        {playerList !== undefined && playerList.length > 0 ? body() : loading()}
        </TableBody>
        </Table>
    );
}