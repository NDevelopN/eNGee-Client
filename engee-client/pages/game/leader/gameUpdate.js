import {useState, useEffect} from 'react';

export default function GameUpdater({gid, e, send, exit}) {
    let [gameName, setGameName] = useState("");
    let [gameType, setGameType] = useState("");
    let [rounds, setRounds] = useState(1);
    let [minPlrs, setMinPlrs] = useState(0);
    let [maxPlrs, setMaxPlrs] = useState(1);
    let [timeout, setTimeout] = useState(-1);
    //Allow for extensability
    let [additional, setAdditional] = useState("");
    
    useEffect(() => {
            setGameName(e.name);
            setGameType(e.gameType)
            setRounds(e.Rounds)
            setMinPlrs(e.minPlayers)
            setMaxPlrs(e.maxPlayers)
            setTimeout(e.Timeout)
            setAdditional(e.additional) 
    }, []);

    function handleChange(event) {
        switch (event.target.name) {
            case "name": 
                setGameName(event.target.value);
                break;
            case "type":
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
                setTimeout(parseInt(event.target.value, 10));
                break;
            default:
                console.error("Unknown event " + event);
                break;
        }
    };

    function handleSubmit(event) {
        event.preventDefault();
        
        if (gameName === "") {
            console.log("Empty game name in rule change");
            alert("Please enter a game name");
            return;
        }
        
        if (gameType === "") {
            console.log("Empty Game type in rule change");
            alert("Please eneter a game type");
            return;
        }

        if (minPlrs > maxPlrs) {
            console.log("Min Plrs " + minPlrs + " greater than maxPlrs " + maxPlrs);
            alert("Cannot have Minimum Players higher than Maximum Players");
            return;
        }

        if (minPlrs < 0) {
            console.log("MinPlrs " + minPlrs + "  too low");
            alert("Minimum Players cannot be negative");
            return;
        }

        if (maxPlrs < 1) {
            console.log("Max Plrs " + maxPlrs + " too low");
            alert("Maximum Playeres cannot be less than 1");
            return;
        }

        let message = {
            gid: gid,
            name: gameName,
            type: gameType,
            status: "",
            old_status: "",
            rules: {
                rounds: rounds,
                min_plrs: minPlrs,
                max_plrs: maxPlrs,
                timeout: timeout,
                additional: "",
            },
            players: [],
        };

        console.log("Sending!")
        
        send("Rules", JSON.stringify(message))
    }

    //TODO: get list of potential game types and make input select type for gametype

    return (
    <form onSubmit={handleSubmit}>

        <label>
            Name:
            <input type="text" name="name" value={gameName} onChange={handleChange} contentEditable={false}/>
        </label>
        <br/>

        <label>
            Type:
            <input type="text" name="type" value={gameType} onChange={handleChange}/>
        </label>
        <br/>
        
        <label>
            Rounds:
            <input type="number" name="rounds" value={rounds} mind={1} onChange={handleChange}/>
        </label>
        <br/>

        <label>
            Min Players:
            <input type="number" name="minPlrs" value={minPlrs} min={0} onChange={handleChange}/>
        </label>
        <br/>

        <label>
            Max Players:
            <input type="number" name="maxPlrs" value={maxPlrs} min={1} onChange={handleChange}/>
        </label>
        <br/>

        <label>
            Timeout:
            <input type="number" name="timeout" value={timeout} min={-1} onChange={handleChange}/>
        </label>
        <br/>

        <input type="submit" value="submit"/>
        <input type="button" value="close" onClick={exit}/>
    </form>
    );
}