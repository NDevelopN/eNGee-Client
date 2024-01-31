import { useState, useEffect } from 'react';
import { httpRequest } from '../net';

import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const listInterval = 2500;

function Browser({url, createRoom, joinRoom, setWarning, setConfirmation, setOnConfirm}) {
    let [RoomList, setRoomList] = useState([{}]);

    useEffect(roomListUpdate, []);

    function roomListUpdate() {
        getRoomList();

        const timer = setInterval(getRoomList, listInterval);

        return () => {
            clearInterval(timer);
        }

        function getRoomList() {
            let endpoint = url + "/rooms"
            httpRequest("GET", "", endpoint, (rooms) => {
                setRoomList(rooms);
            });
        }
    }

    function join(room) {
        setConfirmation("Join game: '" + room.name + " (" + room.type + ")'?");
        setOnConfirm(() => joinRoom(room));
    }

    return (
        <Paper sx={{margin:'10px 20%', padding:'10px'}}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><b>Room Name</b></TableCell>
                    <TableCell><b>Game Type</b></TableCell>
                    <TableCell><b>Room Status</b></TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {RoomList.map(room=> (
                    <TableRow key={room.rid} onClick={() => join(room)}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>{room.status}</TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>

        <Button 
            sx={{margin:'10px 35%', 'width':'30%'}}
            variant='contained' 
            onClick={createRoom}
        >
            Create New Room
        </Button>
        </Paper>
    );
}

export default Browser;