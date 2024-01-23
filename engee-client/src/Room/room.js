import { useState, useEffect } from 'react';
import { httpRequest } from '../net';

function Room({url, joinRoom, leave, setWarning, setConfirmation, setOnConfirm}) {
    let [RoomName, setRoomName] = useState("");
    let [RoomGameMode, setRoomGameMode] = useState("");

    let [gameModes, setGameModes] = useState([""]);

    useEffect(getGameMode, []);

    function getGameMode() {
        let endpoint = url + "/gameModes";

        httpRequest("GET", "", endpoint, (modeList) => {
            console.log(modeList)
            if (modeList === null || modeList === undefined) {
                setGameModes([]);
            } else {
                setGameModes(modeList);
                if (RoomGameMode === "" || RoomGameMode === undefined) {
                    setRoomGameMode(modeList[0]);
                }
            }
        });
    }

    function createRoom() {
        let endpoint = url + "/rooms";

        let room = {
            'rid': "",
            'name': RoomName,
            'gamemode': RoomGameMode,
            'status': "",
            'addr': "",
        };

        httpRequest("POST", JSON.stringify(room), endpoint, (rid) => {
            room.rid = rid;
            joinRoom(room);
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (RoomName === "") {
            setWarning("Room name is required");
            return;
        }

        setConfirmation("Are you happy with these settings?");
        setOnConfirm(createRoom);
    }

    function handleChange(event) {
        switch (event.target.name) {
            case "name":
                setRoomName(event.target.value);
                break;
            case "mode":
                setRoomGameMode(event.target.value);
                break;
            default:
                console.error("Invalid event: " + event.target.name);
                break;
        }
    }

    function leaveScreen() {
        setConfirmation("Are you sure you want to leave? All settings will be lost.");
        setOnConfirm(leave);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Change room name:
                    <input type="text" name="name" defaultValue={RoomName} autoComplete='off' onChange={handleChange}/>
                </label>
                <label>
                    Change room game mode:
                    <select name="mode" defaultValue={RoomGameMode} onChange={handleChange}>
                        {gameModes.map((mode, index) => (
                            <option key={index} value={mode}>{mode}</option>
                        ))}
                    </select>
                </label>
                <input type="submit" value="submit" onClick={handleSubmit}/>
            </form>
            <>
                <button onClick={leaveScreen}>Return</button>
            </>
        </>
    );
}

export default Room;