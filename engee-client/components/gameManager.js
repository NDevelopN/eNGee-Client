import {useState, useEffect} from 'react';

export default function GameManager({gid, info, send, exit, types}) {
    let [gameName, setGameName] = useState("");
    let [gameType, setGameType] = useState("");
    let [rounds, setRounds] = useState(1);
    let [minPlrs, setMinPlrs] = useState(1);
    let [maxPlrs, setMaxPlrs] = useState(1);
    let [timeout, setTimeout] = useState(0);
    //Allow for extensability
    let [additional, setAdditional] = useState("");
    
    useEffect(() => {
        setGameName(info.name);
        setGameType(info.type)
        setRounds(info.rules.rounds)
        setMinPlrs(info.rules.min_plrs)
        setMaxPlrs(info.rules.max_plrs)
        setTimeout(info.rules.timeout)
        setAdditional(info.rules.additional) 
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
            case "rounds":
                console.log("Setting rounds..." + event.target.value);
                setRounds(parseInt(event.target.value, 10));
                break;
            case "minPlrs":
                console.log("Setting minp..." + event.target.value);
                setMinPlrs(parseInt(event.target.value, 10));
                break;
            case "maxPlrs":
                console.log("Setting maxp..." + event.target.value);
                setMaxPlrs(parseInt(event.target.value, 10));
                break;
            case "timeout":
                console.log("Setting timeout..." + event.target.value);
                setTimeout(parseInt(event.target.value, 10));
                break;
            default:
                console.error("Unknown event " + event);
                break;
        }
    };

    function handleSubmit(event) {
        event.preventDefault();



        if (gameName === undefined || gameName === "") {
            alert("Please enter a game name");
            return;
        }
        
        if (gameType === undefined || gameType === "") {
            alert("Please select a game type");
            return;
        }


        if (rounds === undefined || rounds < 1) {
            alert("Please enter a number of rounds to play, must be greater than zero.");
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

        if (timeout === undefined || timeout < 0) {
            alert("Please enter an idle timeout in seconds. For no timeout, enter 0.")
            return;
        }


        let message = info;

        message.name = gameName;
        message.type = gameType;
        message.rules = {
            rounds: rounds,
            min_plrs: minPlrs,
            max_plrs: maxPlrs,
            timeout: timeout,
            additional: additional,
        };
        
        if (message === info) {
            alert("No changes were made.");
            return
        }
        
        send("Rules", JSON.stringify(message))
    }

    return (
    <form onSubmit={handleSubmit}>

        <label>
            Name:
            <input type="text" name="name" defaultValue={info.name} autoComplete='off' onChange={handleChange} contentEditable={false}/>
        </label>
        <br/>

        <label>
            Game Type:
            <select name="type" defaultValue={info.type} onChange={handleChange}>
                {types.map((type, index) => ( 
                    <option key={index} value={type}>{type}</option>
                ))}
            </select>
        </label>
        <br/>
        
        <label>
            Rounds:
            <input type="number" name="rounds" defaultValue={info.rules.rounds} mind={1} onChange={handleChange}/>
        </label>
        <br/>

        <label>
            Minimum Players:
            <input type="number" name="minPlrs" defaultValue={info.rules.min_plrs} min={1} onChange={handleChange}/>
        </label>
        <br/>

        <label>
            Maximum Players:
            <input type="number" name="maxPlrs" defaultValue={info.rules.max_plrs} min={1} onChange={handleChange}/>
        </label>
        <br/>

        <label>
            Idle Timeout:
            <input type="number" name="timeout" defaultValue={info.rules.timeout} min={0} onChange={handleChange}/>
        </label>
        <br/>

        <input type="submit" value="submit"/>
        <input type="button" value="close" onClick={exit}/>
    </form>
    );
}