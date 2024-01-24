import { useState, useEffect, useRef } from 'react';
import { httpRequest } from '../net.js';

const heartbeatInterval = 3000;

export default function User({url, User, setUser, setWarning, setConfirmation, setOnConfirm}) {
    let [UserName, setUserName] = useState("");

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


    function createUser() {
        let endpoint = url + "/users";
        httpRequest("POST", UserName, endpoint, (response) => {
            let uid = response

            setUser({'name': UserName, 'uid': uid});
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
        });
    }

    function updateUser() {
        let endpoint = url + "/users/" + User.uid + "/name";
        httpRequest("PUT", UserName, endpoint, () => {
            setUser({'name': UserName, 'uid': User.uid});
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (UserName === "") {
            setWarning("Provided user name is empty.")
            return;
        }
        
        if (User.name === UserName) {
            setWarning("Provided user name has not changed from last time.")
            return;
        }

        setConfirmation("Would you like to submit '" + UserName + "'?");
        setOnConfirm(confirm);
    }

    function confirm() {
        if  (User.uid !== "" && User.uid !== undefined) {
            updateUser();
        } else {
            createUser();
        }
    }

    function handleChange(event) {
        setUserName(event.target.value);
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label>
                Change your name:
                <input type="text" name="name" value={UserName} autoComplete='off' onChange={handleChange}/>
                <input type="submit" value="submit"/>
            </label>
            {User.uid !== "" && User.uid !== undefined?
            <>
                <button type="button" onClick={confirmLogout}>Logout</button>
            </>
            : null}
        </form>
        </>
    );
}