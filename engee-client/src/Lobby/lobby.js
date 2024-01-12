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

    function PlayerName({name}) {
        if (userInfo.name === name) {
            return <b>{name}</b>;
        }
        else {
            return <p>{name}</p>;
        }
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
                    <mui.TableRow key={player.uid}>
                        <mui.TableCell><PlayerName name={player.name}/></mui.TableCell>
                        <mui.TableCell>{player.status}</mui.TableCell>
                    </mui.TableRow>
                ))}
            </mui.TableBody>
        </mui.Table>

        <button onClick={leave}>Leave Room</button>
        </>
    );
}