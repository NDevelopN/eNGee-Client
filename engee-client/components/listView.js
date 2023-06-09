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

export function GameList({gameList, joinFunc}) {
    return (
        <Table padding='none'>
            <TableHead>
                <TableRow>
                    <TableCell><b>Game</b></TableCell>
                    <TableCell><b>Mode</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Players</b></TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
            {gameList.map(game=> (
                <TableRow key={game.gid}>
                    <TableCell>{game.name}</TableCell>
                    <TableCell>{game.type}</TableCell>
                    <TableCell>{game.status}</TableCell>
                    <TableCell>{game.cur_plrs}/{game.max_plrs}</TableCell>
                    <TableCell><button onClick={()=>{joinFunc(game.gid);}}>Join</button></TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}
