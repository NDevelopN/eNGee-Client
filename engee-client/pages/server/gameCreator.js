import {useState} from 'react';

import {POST} from '@/lib/networkFunctions.js';

export default function GameCreator({joinFunc}) {
    let [gameName, setGameName] = useState("");
    let [gameType, setGameType] = useState("");
    let [minPlrs, setMinPlrs] = useState(0);
    let [maxPlrs, setMaxPlrs] = useState(1);
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

    function handleSubmit(event) {
        event.preventDefault();
        
        let endpoint = "http://localhost:8080/server/create"
        if (gameName === "" | gameType === "") return;

        console.log("min: " + minPlrs +", max: " + maxPlrs)

        let message = {
            id: "",
            name: gameName,
            gameType: gameType,
            minPlayers: minPlrs,
            maxPlayers: maxPlrs,
            additional: "",        
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
            <input type="text" name="name" value={gameName} onChange={handleChange}/>
        </label>
        <br/>
        <label>
            Type:
            <input type="text" name="type" value={gameType} onChange={handleChange}/>
        </label>
        <br/>
        <label>
            minPlrs:
            <input type="number" name="minPlrs" value={minPlrs} min={0} onChange={handleChange}/>
        </label>
        <br/>
        <label>
            maxPlrs:
            <input type="number" name="maxPlrs" value={maxPlrs} min={1} onChange={handleChange}/>
        </label>
        <input type="submit" value="submit"/>
    </form>
    );

}