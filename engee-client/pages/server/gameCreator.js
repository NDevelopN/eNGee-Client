import {useState} from 'react';

import {POST} from '@/lib/networkFunctions.js';

export default function GameCreator({joinFunc, endpoint}) {
    let [gameName, setGameName] = useState("");
    let [gameType, setGameType] = useState("");
    let [rounds, setRounds] = useState(1);
    let [minPlrs, setMinPlrs] = useState(0);
    let [maxPlrs, setMaxPlrs] = useState(1);
    let [timeout, setTimeout] = useState(-1)
    //Allow for extensability
    let [additional, setAdditional] = useState("");


    function handleChange(event) {
        switch (event.target.name) {
            case "name":
                setGameName(event.target.value);
                break;
            case  "type":
                setGameType(event.target.value);
                break;
            case "rounds":
                setRounds(parseInt(event.target.value, 10));
                break;
            case "minPlrs":
                setMinPlrs(parseInt(event.target.value, 10));
                break;
            case "maxPlrs":
                setMaxPlrs(parseInt(event.target.value, 10));
                break;
            case "timeout":
                setRounds(parseInt(event.target.value, 10));
                break;
            default:
                console.error("Unknown event " + event);
                break;
        }
    };

    function handleSubmit(event) {
        event.preventDefault();
        
        if (gameName === "" | gameType === "") return;

        endpoint += "/server/create"

        let message = {
            id: "",
            name: gameName,
            type: gameType,
            rules: {
                rounds: rounds,
                minPlayers: minPlrs,
                maxPlayers: maxPlrs,
                timeout: timeout,
                additional: "",        
            },
        }
        
        let str = JSON.stringify(message)
        console.log(str)

        POST(JSON.stringify(message), endpoint, (e) => {
            console.log(e);
            joinFunc(e.id);
        })
    }

    //TODO: get list of potential game types and make input select type for gametype

    return (
    <form onSubmit={handleSubmit}>
        <label>
            Name:
            <input type="text" name="name" value={gameName} autocomplete='off' onChange={handleChange}/>
        </label>
        <br/>
        <label>
            Type:
            <input type="text" name="type" value={gameType} autocomplete='off' onChange={handleChange}/>
        </label>
        <br/>
        <label>
            Rounds:
            <input type="number" name="rounds" value={rounds} min={1} onChange={handleChange}/>
        </label>
        <br/>
        <label>
            Minimum Players:
            <input type="number" name="minPlrs" value={minPlrs} min={0} onChange={handleChange}/>
        </label>
        <br/>
        <label>
            Maximum Players:
            <input type="number" name="maxPlrs" value={maxPlrs} min={1} onChange={handleChange}/>
        </label>
        <br/>
        <label>
            Inactivity Timeout:
            <input type="number" name="timeout" value={timeout} min={-1} onChange={handleChange}/>
        </label>
        <br/>
        <input type="submit" value="submit"/>
    </form>
    );

}