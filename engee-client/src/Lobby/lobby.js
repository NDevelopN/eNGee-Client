import { useState, useEffect, useRef } from 'react';
import { httpRequest } from '../net.js';

import { Card, Table, TableHead, TableRow, TableCell, TableBody, Button} from '@mui/material';

const listInterval = 2500;

export default function Lobby({url, userInfo, roomInfo, leave, setWarning, setConfirmation, setOnConfirm}) {
    let [Players, setPlayers] = useState([]);

    const interval = useRef(null);
    
    useEffect(lobbyUpdate, []);

    function lobbyUpdate() {
        interval.current = setInterval(getPlayerList, listInterval);

        function getPlayerList() {
            let endpoint = url + "/rooms/" + roomInfo.rid + "/users";

            httpRequest("GET", "", endpoint, (plrs) => {
                setPlayers(plrs);
            });
        }

        return (() => {
            clearInterval(interval.current);
        });
    }

    function PlayerRow({player}) {
        let isCurrentPlayer = player.uid === userInfo.uid
        return (
            <TableRow key={player.uid}>
                <TableCell padding='none'>
                    {isCurrentPlayer ? 
                        <b>{player.name}</b> 
                    : 
                        <p>{player.name}</p>
                    }
                </TableCell>
                <TableCell padding='none'>
                    {isCurrentPlayer ? 
                        <b>{player.status}</b> 
                    : 
                        <p>{player.status}</p>}
                </TableCell>
            </TableRow>
        );
    }

    function leaveRoom() {
        setConfirmation("Are you sure you want to leave?");
        setOnConfirm(leave);
    }

    return (
        <Card sx={{margin:'10%', padding:'5%'}}> 
            <h3 align='center'>Room: {roomInfo.name} ({roomInfo.gameMode})</h3>
            <Table padding='none'>
                <TableHead>
                    <TableRow key='head'>
                        <TableCell padding='none'><b>Player</b></TableCell>
                        <TableCell padding='none'><b>Status</b></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Players.map(player=> (
                        <PlayerRow player={player}/>
                    ))}
                </TableBody>
            </Table>
            <Button 
                sx={{width:'50%', margin:'10px 25%'}}
                variant='outlined' 
                onClick={leaveRoom}
            >
                Leave Room
            </Button>
        </Card>
    );
}