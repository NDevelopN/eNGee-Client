import {useState} from 'react';

import {POST} from '@/lib/networkFunctions';

export default function UserCreate({id, name, callback}) {

    let [UserName, setUserName] = useState("");
    let curName = name;

    function joinServer() {
        let endpoint = "http://localhost:8080/server/";

        let message = {
            pid: id, 
            name: UserName,
        };

        POST(JSON.stringify(message), endpoint, onResponse);
    }

    function handleChange (event){
        setUserName(event.target.value); 
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log(UserName)
        if (UserName !== "") {
            //No need to post new update if name isn't changing
            if (UserName === curName) {
                return;
            }

            joinServer();
        }
        //TODO: Error saying it can't be empty
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Change your name:
                <input type="text" name="name" value={UserName} onChange={handleChange}/>
            </label>
        </form>
    );
}