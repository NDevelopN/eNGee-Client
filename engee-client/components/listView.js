import utilStyles from "../styles/utils.module.css";
import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export function PlayerList({playerList, lid}) {

    function body() {
        return(
            <TableBody>
                {playerList.map(player=> (
                <TableRow key ={player.uid}>
                    {player.uid === lid ? 
                    <>
                        <TableCell><b>{player.name}</b></TableCell>
                        <TableCell><b>{player.status}</b></TableCell>
                    </>
                    : <>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.status}</TableCell>
                    </>
                }
                </TableRow>
                ))}
            </TableBody>
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

        {playerList.length > 0 ? body() : loading()}

        </Table>
    );
}