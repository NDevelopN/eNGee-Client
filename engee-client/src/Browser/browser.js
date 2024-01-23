import { useState, useEffect } from 'react';
import { httpRequest } from '../net';

import * as mui from '@mui/material';

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
        <>
        <mui.Table padding='none'>
            <mui.TableHead>
                <mui.TableRow>
                    <mui.TableCell><b>Room Name</b></mui.TableCell>
                    <mui.TableCell><b>Game Type</b></mui.TableCell>
                    <mui.TableCell><b>Room Status</b></mui.TableCell>
                </mui.TableRow>
            </mui.TableHead>

            <mui.TableBody>
                {RoomList.map(room=> (
                    <mui.TableRow key={room.rid}>
                        <mui.TableCell>{room.name}</mui.TableCell>
                        <mui.TableCell>{room.type}</mui.TableCell>
                        <mui.TableCell>{room.status}</mui.TableCell>
                        <mui.TableCell><button onClick={()=> join(room)}>Join Room</button></mui.TableCell>
                    </mui.TableRow>
                ))}
            </mui.TableBody>
        </mui.Table>
        <button onClick={createRoom}>Create New Room</button>
        </>
    );
}

export default Browser;