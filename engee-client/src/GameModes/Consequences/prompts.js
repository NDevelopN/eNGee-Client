import { useState } from 'react';

import { FormGroup, Paper, List, ListItem, TextField, Button } from '@mui/material';

function Prompts({prompts, sendReplies, setWarning}) {
    let [replies, setReplies] = useState([]);

    function handleChange(event) {
        let r = replies;
        r[parseInt(event.target.name)] = event.target.value;

        setReplies(r);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (replies.length === prompts.length) {
            for (let i = 0; i < replies.length; i++) {
                if (replies[i] === "" || replies[i] === null || replies[i] === undefined) {
                    setWarning("Reply #" + (i+1) + " is missing.");
                    return;
                }
            }
            sendReplies(replies);
        } else if (replies.length < prompts.length) {
            setWarning("You must provide a reply to each prompt.");
        } else {
            console.error("Reply set is larger that prompts");
        }
    }

    return (
        <FormGroup>
        <Paper>
            <List sx={{margin:'20px'}}>
                {prompts.map((prompt, index) => (
                    <ListItem key={index}>
                    <TextField 
                        alignItems='center'
                        justifyContent='center'
                        fullWidth={true}
                        name={index} 
                        type='text'     
                        label={prompt}
                        autoComplete='off'
                        onChange={handleChange}
                    />
                    </ListItem>
                ))}
                <ListItem>
                <Button
                    fullWidth={true}    
                    variant='contained'
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                </ListItem> 
            </List>
        </Paper>
        </FormGroup>
    );
}

export default Prompts;