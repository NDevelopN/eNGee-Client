import {useState, useEffect} from 'react';
import Popup from 'reactjs-popup';

import { ConfirmDialog } from '@/components/dialogs';

import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export default function GameManager({info, send, exit, types}) {
    let [gameName, setGameName] = useState("");
    let [gameType, setGameType] = useState(types[0]);
    let [minPlrs, setMinPlrs] = useState(1);
    let [maxPlrs, setMaxPlrs] = useState(1);
    //Allow for extensability
    let [additional, setAdditional] = useState("");

    let [dialog, setDialog] = useState(false);
    let [message, setMessage] = useState();
    
    useEffect(() => {
        if (info != null) {
            setGameName(info.name);
            setGameType(info.type)
            setMinPlrs(info.min_plrs)
            setMaxPlrs(info.max_plrs)
            setAdditional(info.additional) 
        }
    }, []);

    function handleChange(event) {
        switch (event.target.name) {
            case "name": 
                console.log("Setting name..." + event.target.value);
                setGameName(event.target.value);
                break;
            case "type":
                console.log("Setting type..." + event.target.value);
                setGameType(event.target.value);
                break;
            case "minPlrs":
                console.log("Setting minp..." + event.target.value);
                setMinPlrs(parseInt(event.target.value, 10));
                break;
            case "maxPlrs":
                console.log("Setting maxp..." + event.target.value);
                setMaxPlrs(parseInt(event.target.value, 10));
                break;
            default:
                console.error("Unknown event " + event);
                break;
        }
    };

    function handleSubmit() {
        console.log("__DEBUG__ \ngamename: " + gameName + "\ngametype: " + gameType + "\nmin: " + minPlrs + " max: " + maxPlrs)
        if (gameName === undefined || gameName === "") {
            alert("Please enter a game name");
            return;
        }
        
        if (gameType === undefined || gameType === "") {
            alert("Please select a game type");
            return;
        }

        if (minPlrs === undefined || minPlrs < 1) {
            alert("Please enter a minimum number of players, must be greater than zero.");
            return;
        }

        if (maxPlrs === undefined || maxPlrs < 1 ) {
            alert("Please enter a maximum number of players, must be greater than zero.");
            return;
        }

        if (minPlrs > maxPlrs) {
            alert("Cannot have minimum players higher than maximum players");
            return;
        }


        let msg;
        if (info != null) {
            msg = JSON.parse(JSON.stringify(info));

            msg.name = gameName;
            msg.type = gameType;
            msg.min_plrs = minPlrs;
            msg.max_plrs = maxPlrs;
            msg.additional_rules = additional;

            if (JSON.stringify(msg) === JSON.stringify(info)) {
                alert("No changes were made.");
                return
            }
        } else {
            msg = {
                name: gameName,
                type: gameType,
                min_plrs: minPlrs,
                max_plrs: maxPlrs,
                additional_rules: additional
            }
        }
        
        setMessage(msg)
        setDialog(true)
    }

    function Pop() {
        if (dialog) {
            return <Popup open={dialog} onClose={()=>setDialog(false)}>
                <ConfirmDialog
                    text={"Are you sure you want to submit these new rules?"}
                    confirm={(e) => {send("Rules", JSON.stringify(message)); setDialog(false)}}
                    close={()=>setDialog(false)}
                />
            </Popup>
        } else {
            return <></>
        }
    }

    return (
    <div>
        <Pop/>
        <form onSubmit={(e)=>{
            e.preventDefault(); 
            handleSubmit();
        }}>
            <Table padding='none'>
                <TableHead>
                    <TableRow>

                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell>
                            <input 
                                type="text" 
                                name="name" 
                                value={gameName} 
                                autoComplete='off' 
                                contentEditable={false}
                                onChange={handleChange} 
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>

                        <TableCell>
                           Game Type 
                        </TableCell>
                        <TableCell>
                            <select name="type" value={gameType} onChange={handleChange} >
                                {types.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                           Minimum Players 
                        </TableCell>
                        <TableCell>
                            <input 
                                type="number" 
                                name="minPlrs" 
                                value={minPlrs} 
                                min={1} 
                                onChange={handleChange}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Maximum Players            
                        </TableCell>
                        <TableCell>
                            <input 
                                type="number" 
                                name="maxPlrs" 
                                value={maxPlrs} 
                                min={minPlrs} 
                                onChange={handleChange}
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <input type="submit" value="submit"/>
            <input type="button" value="close" onClick={exit}/>
        </form>
    </div>
    );
}