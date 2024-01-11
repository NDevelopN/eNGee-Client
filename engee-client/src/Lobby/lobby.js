import { useState, useEffect, useRef } from 'react';
import { httpRequest } from '../net.js';

import * as mui from '@mui/material';

const listInterval = 500;

export default function Lobby({url, userInfo, roomInfo, setRoomInfo, startGame, leave}) {
    let [Players, setPlayers] = useState([{}, {}]);

    const interval = useRef(null);

    useEffect(() => {
        roomInfoUpdate();
        startGameIfReady();
    }, []);

    function roomInfoUpdate() {

        if (interval.current === null) {
            let endpoint = url + "/users/" + userInfo.uid + "/room"
            httpRequest("PUT", roomInfo.rid, endpoint, () => { });
        }

        interval.current = setInterval(() => getRoomUpdate(), listInterval);

        function getRoomUpdate() {
            let endpoint = url + "/rooms/" + roomInfo.rid + "/users";

            httpRequest("GET", "", endpoint, (plrs) => {
                setPlayers(plrs);
            });

            endpoint = url + "/rooms/" + roomInfo.rid

            httpRequest("GET", "", endpoint, (roomInfo) => {
                console.log("Get Room INFO : " + roomInfo)
                if (roomInfo !== undefined && roomInfo !== "") {
                    setRoomInfo(roomInfo)
                }
            });
        }

        return (() => {
            clearInterval(interval.current);
        });
    }

    function startGameIfReady() {
        if (roomInfo.status === "Game") {
            startGame(roomInfo.address)
        }
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
        
        {roomInfo.addr !== "" 
            ? 
            <button onClick={() => startGame(roomInfo.addr)}>Start</button> 
            : 
            null
        }

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
                        <mui.TableCell>This is where status will go</mui.TableCell>
                    </mui.TableRow>
                ))}
            </mui.TableBody>
        </mui.Table>

        <button onClick={leave}>Leave Room</button>
        </>
    );
}