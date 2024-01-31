import { useState }  from 'react';

import { Paper, FormGroup, TextField, Button} from '@mui/material';

function TestInput({send}) {
    let [reply, setReply] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (reply === "" || reply === undefined) {
            return;
        }

        send(reply);
    }

    function handleChange(event) {
        setReply(event.target.value);
    }

    return (
    <Paper variant='outlined'>
        <FormGroup>
            <TextField 
                name="name" 
                type='text' 
                size='small' 
                variant='outlined' 
                label="Enter test message" 
                autoComplete='off' 
                onChange={handleChange}
            />
            <Button 
                name="submit" 
                variant='contained' 
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </FormGroup>
    </Paper>
    );
}

export default TestInput;
