import {useState, useEffect} from 'react';

import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material'; 
import CustomPrompts from '@/pages/game/consequences/customPrompts';

export default function ConRules({rules, setRules, pop, setPop}) {
    let [rounds, setRounds] = useState(0);
    let [shuffle, setShuffle] = useState(0);
    let [timer1, setTimer1] = useState(0);
    let [timer2, setTimer2] = useState(0);
    let [prompts, setPrompts] = useState([]);

    useEffect(() => {
        if (rules !== undefined) {
            console.log(JSON.stringify(rules))
            let addrules = JSON.parse(rules);
            setRounds(addrules.rounds)
            setShuffle(addrules.shuffle)
            setTimer1(addrules.timer1)
            setTimer2(addrules.timer2)
            setPrompts(addrules.prompts)
        }
    }, [rules])

    function handleChange(event) {
        switch (event.target.name) { case "rounds":
                setRounds(Number(event.target.value));
                break;
            case "shuffle":
                setShuffle(Number(event.target.value));
                break;
            case "timer1":
                setTimer1(Number(event.target.value));
                break;
            case "timer2":
                setTimer2(Number(event.target.value));
                break;
        }
    }

    function submit() {
        setRules(JSON.stringify({
            rounds: rounds,
            shuffle: shuffle,
            timer1: timer1,
            timer2: timer2,
            prompts: prompts,
        }));
    }

    return (
        <div>
            {!pop ? 
            <Table padding='none'>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <b>Consequences Rules</b>
                        </TableCell>
                        <TableCell>
                            <p>(0 = default)</p>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Rounds
                        </TableCell>
                        <TableCell>
                            <input
                                type="number"
                                name="rounds"
                                value={rounds}
                                min="0"
                                onChange={handleChange}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Shuffle Type
                        </TableCell>
                        <TableCell>
                            <input
                                type="number"
                                name="shuffle"
                                value={shuffle}
                                min="0"
                                onChange={handleChange}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Reply Time
                        </TableCell>
                        <TableCell>
                            <input
                                type="number"
                                name="timer1"
                                value={timer1}
                                min="0"
                                onChange={handleChange}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Story Time
                        </TableCell>
                        <TableCell>
                            <input
                                type="number"
                                name="timer2"
                                value={timer2}
                                min="0"
                                onChange={handleChange}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Custom Prompts
                        </TableCell>
                        <TableCell>
                            <button onClick={() => setPop(true)}>Change Prompts</button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <button onClick={submit}>Set Consequences Rules</button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            :
            <CustomPrompts prompts={prompts} setPrompts={setPrompts} setPop={setPop}/>}
        </div>
    );
}