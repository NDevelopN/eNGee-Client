import {useState, useEffect} from 'react';
import Popup from 'reactjs-popup';

import { ConfirmDialog } from '@/components/dialogs';

import { GET } from '@/lib/networkFunctions';

import {Table, TableBody, TableRow, TableCell} from '@mui/material';

import ConRules from '@/pages/game/consequences/rules';

export default function GameManager({info, send, revertStatus, url}) {
    let [gameName, setGameName] = useState("");
    let [gameType, setGameType] = useState("");
    let [minPlrs, setMinPlrs] = useState(1);
    let [maxPlrs, setMaxPlrs] = useState(1);
    let [typeList, setTypeList] = useState([]);
    //Allow for extensability
    let [additional, setAdditional] = useState("");

    let [dialog, setDialog] = useState(false);
    let [message, setMessage] = useState();

    let [pop, setPop] = useState(false);
    
    useEffect(() => {
        getGameTypes();

        setGameName(info.name);
        setGameType(info.type);
        setMinPlrs(info.min_plrs);
        setMaxPlrs(info.max_plrs);
        setAdditional(info.additional); 
    }, []); //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        console.log("Game type set: " + gameType);
    }, [gameType]);

    function getGameTypes() {
        GET(url + '/types', (e) => {
            if (e) {
                setTypeList(["", ...e]);
            } else {
                console.error("No available game types.");
                setTypeList([]);
            }
        });
    }

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
            additional_rules: additional,
        };

        if (JSON.stringify(msg) === JSON.stringify(info)) {
            alert("No changes were made.");
            return;
        }

        setMessage(msg);
        setDialog(true);
    }


    function Pop() {
        if (dialog) {
            return <Popup open={dialog} onClose={()=>setDialog(false)}>
                <ConfirmDialog
                    text={"Are you sure you want to submit these new settings?"}
                    confirm={(e) => {send(message); setDialog(false)}}
                    close={()=>setDialog(false)}
                />
            </Popup>;
        } else {
            return <></>;
        }
    }

    function GameType({}) {
        switch (gameType) {
            case "consequences": 
                return <ConRules rules={additional} setRules={setAdditional} pop={pop} setPop={setPop}/>;
        }

        return <></>;
    }

    return (
    <div>
        <Pop/>
        <form onSubmit={(e)=>{
            e.preventDefault(); 
        }}>
        {!pop ? <div>
            <Table padding='none'>
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
                                {typeList.map((type, index) => (
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
            </div> : <></> }
            <GameType/>
            {!pop ? <div>
            <input type="submit" value="submit" onClick={handleSubmit}/>
            <input type="button" value="close" onClick={revertStatus}/>
            </div> : <></>}
        </form>
    </div>
    );
}