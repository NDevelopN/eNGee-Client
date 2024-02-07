import { useState } from 'react';

import { FormGroup, TextField, ButtonGroup, Button } from '@mui/material';

function UserMenu({userInfo, submit, exit, confirmLogout}) {
    let [userName, setUserName] = useState(userInfo.name)

    function handleChange(event) {
        setUserName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        submit(userName);
    }


    return (
        <FormGroup>
            <TextField 
                name="name" 
                id="name" 
                type='text' 
                autoComplete='off' 
                size='small' 
                variant='outlined' 
                label="User Name" 
                value={userName} 
                onChange={handleChange}
            />
            <ButtonGroup fullWidth={true}>
            <Button 
                id="submit" 
                variant='contained' 
                onClick={handleSubmit}
            >
                Submit
            </Button>
            {userInfo.uid !== "" 
            ?
            <>
                <Button 
                    variant='outlined' 
                    onClick={exit}
                >
                    Cancel
                </Button>
                <Button 
                    variant='outlined' 
                    onClick={confirmLogout}
                >
                    Logout
                </Button>
            </>
            :
            null
            }
            </ButtonGroup>
        </FormGroup>
    );
}

export default UserMenu;