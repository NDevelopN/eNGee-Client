import { useState, useEffect, useRef } from 'react';
import { httpRequest } from '../net.js';

import UserMenu from './userMenu.js';

import { Paper, Container } from '@mui/material';

const heartbeatInterval = 3000;

function User({url, User, setUser, setWarning, setConfirmation, setOnConfirm}) {
    let [UserName, setUserName] = useState("");
    let [changing, setChanging] = useState(true);

    const interval = useRef(null);

    useEffect(startUserHeartbeat, [User.uid]);

    function startUserHeartbeat() {
        if (User.uid === undefined || User.uid === "" || User.uid === null) {
            return;
        }
        let endpoint = url + "/users/" + User.uid

        setInterval.current = setInterval(sendHeartbeat, heartbeatInterval);

        function sendHeartbeat() {
            httpRequest("POST", "", endpoint, () => {});
        }

        return (() => {
            clearInterval(interval.current)
        });
    }


    function createUser(userName) {
        let endpoint = url + "/users";
        httpRequest("POST", userName, endpoint, (response) => {
            let uid = response

            setUser({'name': userName, 'uid': uid});
        });
    }

    function confirmLogout() {
        setConfirmation("Are you sure you want to log out?");
        setOnConfirm(logout);
    }

    function logout() {
        let endpoint = url + "/users/" + User.uid;
        httpRequest("DELETE", "", endpoint, () => {
            setUser({'name': "", 'uid': ""});

            setUserName("");
        }); }

    function updateUser(userName) {
        let endpoint = url + "/users/" + User.uid + "/name";
        httpRequest("PUT", userName, endpoint, () => {
            setUser({'name': userName, 'uid': User.uid});
        });
    }

    function submit(userName) {
        if (userName === "") {
            setWarning("Provided user name is empty.")
            return;
        }
        
        if (User.name === userName) {
            setWarning("Provided user name has not changed from last time.")
            return;
        }

        setConfirmation("Would you like to submit '" + userName + "'?");
        setOnConfirm(() => confirm(userName));
    }

    function confirm(userName) {
        setChanging(false);
        if  (User.uid !== "" && User.uid !== undefined) {
            updateUser(userName);
        } else {
            createUser(userName);
        }
    }

    return (
    <Paper sx={{width:'50%', padding:'5px', margin:'1% 25%'}}>
        {!changing
        ? 
        <Container 
                maxWidth='sm'
                onClick={()=>setChanging(true)}
            >
                <h2 align='center'>
                    {User.name}
                </h2>
        </Container>
        :
        <UserMenu 
            userInfo={User} 
            submit={submit} 
            exit={() => setChanging(false)} 
            confirmLogout={confirmLogout}
        />
     }
        </Paper>
    )
}

export default User;