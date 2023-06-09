import utilStyles from "../styles/utils.module.css";
import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export function PlayerList({playerList, lid}) {
    return (
        <Table padding='none'>
            <TableHead>
                <TableRow>
                    <TableCell><b>Player</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {playerList.map(player=> (
                <TableRow key ={player.pid}>
                    {player.pid === lid ? 
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
        </Table>
    );
}