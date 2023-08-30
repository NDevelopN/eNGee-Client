import {useState, useEffect, useRef, memo} from 'react';

import utilStyles from '@/styles/utils.module.css';

import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

function Prompts({prompts, reply, quit}) {

    let [replies, setReplies] = useState([]);
    
    let rRef = useRef(false);

    useEffect(()=> {
        if (!rRef.current) {
            setReplies(Array(prompts.length).map(()=>""));
            rRef.current = true;
        } 
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        for (let i = 0; i < prompts.length; i++) {
            console.log("Reply[" + i + "]: " + replies[i]);
            if (replies[i] === undefined  || replies[i] === "") {
                alert("Please enter a reply for " + prompts[i]);
                return
            }
        }

        reply(replies)
    }

    function handleChange(e, key) {
        let tReply = [...replies];
        tReply[key] = e.target.value
        setReplies(tReply);
    }

    return (
        <>
        <Table padding='none'>
            <TableHead>
                <TableRow>
                    <TableCell><b>Prompt</b></TableCell>
                    <TableCell><b>Response</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                
                {prompts.map((prompt, index) => (
                    <TableRow key={index}>
                        <TableCell>{prompt}</TableCell>
                        <TableCell>
                            <input  
                                type="text" 
                                name={prompt} 
                                autoComplete='off' 
                                onChange={(e) => handleChange(e, index)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={quit}>Quit</button>
        </>
    );
}

export default Prompts = memo(Prompts);