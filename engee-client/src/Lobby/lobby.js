import { useState, useEffect, useRef } from 'react';
import { httpRequest } from '../net.js';

import * as mui from '@mui/material';

const listInterval = 2500;

export default function Lobby({url, userInfo, roomInfo, leave}) {
    let [Players, setPlayers] = useState([]);

    const interval = useRef(null);
    
    useEffect(roomInfoUpdate, []);

    function roomInfoUpdate() {
        interval.current = setInterval(() => getRoomUpdate(), listInterval);

        function getRoomUpdate() {
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
            <mui.TableRow key={player.uid}>
                <mui.TableCell>{isCurrentPlayer ? <b>{player.name}</b> : <p>{player.name}</p>}</mui.TableCell>
                <mui.TableCell>{isCurrentPlayer ? <b>{player.status}</b> : <p>{player.status}</p>}</mui.TableCell>
            </mui.TableRow>
        );
    }

    return (
        <>
        <div>
            <label>
                Room Name
                <p><b>{roomInfo.name}</b></p>
            </label>
            <label>
                Game Type 
                <p><b>{roomInfo.type}</b></p>
            </label>
        </div>
        

        <mui.Table padding='none'>
            <mui.TableHead>
                <mui.TableRow>
                    <mui.TableCell><b>Player</b></mui.TableCell>
                    <mui.TableCell><b>Status</b></mui.TableCell>
                </mui.TableRow>
            </mui.TableHead>

            <mui.TableBody>
                {Players.map(player=> (
                    <PlayerRow player={player}/>
                                    ))}
            </mui.TableBody>
        </mui.Table>

        <button onClick={leave}>Leave Room</button>
        </>
    );
}