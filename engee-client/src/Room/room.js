import { useState, useEffect } from 'react';
import { httpRequest } from '../net';

import { Paper, FormGroup, TextField, Select, MenuItem, Button  } from '@mui/material';

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
        <Paper sx={{margin:'10px 30%', padding:'25px'}}>
        <FormGroup >
            <TextField 
                id="roomName" 
                name="name"
                type='text' 
                size='small' 
                variant='outlined' 
                label="Room Name" 
                autoComplete='off' 
                value={RoomName}
                onChange={handleChange}
            />
            <Select 
                name="gameMode" 
                id="gameMode" 
                label="Room Game Mode"
                value={RoomGameMode} 
                onChange={handleChange}
            >
                {gameModes.map((mode, index) => (
                    <MenuItem 
                        id={mode + index} 
                        value={mode}
                    >
                        {mode}
                    </MenuItem>
                ))}
            </Select>
            <Button 
                variant='contained'
                onClick={handleSubmit}
            >
                Submit
            </Button>
            <Button 
                variant='outlined' 
                onClick={leaveScreen}
            >
                Cancel
            </Button>
        </FormGroup>
        </Paper>
    );
}

export default Room;