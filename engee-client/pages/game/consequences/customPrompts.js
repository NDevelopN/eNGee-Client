import {useState, useEffect, memo} from 'react';

import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material'; 
import { ConfirmDialog } from '@/components/dialogs';

let tPrompts = [] 

function CustomPrompts({prompts, setPrompts, setPop}) {

    let [pCount, setPCount] = useState(0);
    let [dialog, setDialog] = useState(false);

    useEffect(() => {
        tPrompts = prompts;
        setPCount(prompts.length);
    }, [prompts]);

    function addPrompt() {
        setPrompts([...prompts, "New Prompt"]);
        tPrompts = ([...tPrompts, "New Prompt"]);
        setPCount(tPrompts.length)
    }

    function removePrompt() {
        setPrompts([...prompts.slice(0, -1)])
        tPrompts =([...tPrompts.slice(0, -1)])
        setPCount(tPrompts.length)
    }

    function clearPrompts() {
        tPrompts = prompts;
    }

    function Confirm() {
        if (pCount == 1) {
            alert ("Cannot submit only one prompt.")
            setDialog(false);
            return <></>;
        }
        return <ConfirmDialog
            text={"Are you sure you want to save these " + pCount + " prompts?"}
            confirm={() => { setPrompts(tPrompts); setPop(false);}}
            close={() => setDialog(false)}
        />
    }

    return (
        <div>
            {dialog ? <Confirm/> : <>
            <h4>Custom prompts (remove all to set to default)</h4>
            <Table padding='none'>
                <TableBody>
                    {tPrompts.map((p, index) => { return (
                    <TableRow key={index}>
                        <TableCell align='center'>
                            <input
                                type="text"
                                name={"prompt" + index}
                                placeholder={p}
                                autoComplete='off'
                                onChange={(e) => {
                                    tPrompts[index] = e.target.value;
                                }}
                            />
                        </TableCell>
                    </TableRow>
                    )})}
                </TableBody>
            </Table>

            <div>
                <button onClick={removePrompt}>Remove bottom Prompt</button>
                <button onClick={addPrompt}>Add new Prompt</button>
            </div>

            <div>
                <button onClick={clearPrompts}>Reset</button>
                <button onClick={() => {setDialog(true) }}>Submit</button> 
            </div>
            </>}
        </div>
    );
}

export default CustomPrompts = memo(CustomPrompts);