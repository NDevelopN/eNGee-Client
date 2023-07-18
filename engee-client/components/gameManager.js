import {useState, useEffect} from 'react';
import Popup from 'reactjs-popup';

import { ConfirmDialog } from '@/components/dialogs';
import { POST, PUT } from '@/lib/networkFunctions';

import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export default function GameManager({uid, info, setGame, revertStatus, setActive, url}) {
    let [types, setTypes] = useState(["consequences"])

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

        //TODO get types
    }, []);

    function handleChange(event) {
        switch (event.target.name) {
            case "name": 
                setGameName(event.target.value);
                break;
            case "type":
                setGameType(event.target.value);
                break;
            case "minPlrs":
                setMinPlrs(parseInt(event.target.value, 10));
                break;
            case "maxPlrs":
                setMaxPlrs(parseInt(event.target.value, 10));
                break;
            default:
                console.error("Unknown event " + event);
                break;
        }
    };

    function createGame() {
        let msg = {
            gid: "",
            name: gameName,
            type: gameType,
            status: "Lobby",
            old_status: "",
            leader: uid,
            min_plrs: minPlrs,
            max_plrs: maxPlrs,
            cur_plrs: 0,
            additional_rules: additional
        };

        setMessage(msg);
        setDialog(true);
    }

    function updateGame() {

        let msg = {
            gid: info.gid,
            name: gameName, 
            type: gameType,
            status: info.status,
            old_status: info.old_status, 
            leader: info.leader,
            min_plrs: minPlrs,
            max_plrs: maxPlrs,
            cur_plrs: info.cur_plrs,
            additional_rules: info.additional_rules,
        };

        if (JSON.stringify(msg) === JSON.stringify(info)) {
            alert("No changes were made.");
            return;
        }

        setMessage(msg)
        setDialog(true)
    }

    function handleSubmit() {
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
            updateGame();
        } else {
            createGame();
        }
    }

    function put(msg) {
        let endpoint = url + "/games/" + msg.gid;
        let text = JSON.stringify(msg);

        PUT(text, endpoint, (e) => {
            //TODO anything here?
        });
    }

    function post(msg) {
        let endpoint = url + "/games"
        let text  = JSON.stringify(msg);

        POST(text, endpoint, (e) => {
            setGame(e.gid, () => {
                setActive(true);
            });
        });
    }

    function Pop() {
        if (dialog) {
            return <Popup open={dialog} onClose={()=>setDialog(false)}>
                <ConfirmDialog
                    text={"Are you sure you want to submit these new settings?"}
                    confirm={(e) => {(info === null) ? post(message) : put(message); setDialog(false)}}
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
            <input type="button" value="close" onClick={revertStatus}/>
        </form>
    </div>
    );
}