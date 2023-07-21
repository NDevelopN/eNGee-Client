import {useState} from 'react';

import utilStyles from '@/styles/utils.module.css';

import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export default function Prompts({prompts, reply, quit}) {

    let replies = [];

    function handleSubmit(e) {
        e.preventDefault();
        
        for (let i = 0; i < prompts.length; i++) {
            if (replies[i] === undefined  || replies[i] === "") {
                alert("Please enter a reply for " + prompts[i]);
                return
            }
        }

        reply(replies)
    }

    function handleChange(e, key) {
        replies[key] = e.target.value
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