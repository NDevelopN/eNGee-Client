import { useState } from 'react';
import { httpRequest } from '../net.js';

export default function User({url, User, setUser}) {
    let [UserName, setUserName] = useState("");

    function createUser() {
        let endpoint = url + "/users";
        httpRequest("POST", UserName, endpoint, (response) => {
            let uid = response

            setUser({'name': UserName, 'uid': uid});
        });
    }

    function logout() {
        let endpoint = url + "/users/" + User.uid;
        httpRequest("DELETE", "", endpoint, () => {
            setUser({'name': "", 'uid': ""});

            setUserName("");
        });
    }

    function updateUser() {
        if (User.name === UserName) {
            //TODO pop up
            return;
        }

        let endpoint = url + "/users/" + User.uid + "/name";
        httpRequest("PUT", UserName, endpoint, () => {
            setUser({'name': UserName, 'uid': User.uid});
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (UserName === "") {
            return;
        }

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
                <button onClick={logout}>Logout</button>
            </>
            : null}
        </form>
        </>
    );
}