import {useState} from 'react';

import {POST} from '@/lib/networkFunctions';

export default function UserCreate({id, callback}) {

    let [UUID, setUUID] = useState(id);
    let [UserName, setUserName] = useState("");
    let curName = id;

    function joinServer() {
        let endpoint = "http://localhost:8080/server/";

        let message = {
            pid: UUID,
            name: UserName,
        };

        POST(JSON.stringify(message), endpoint, callback);
    }

    function handleChange (event){
        setUserName(event.target.value); 
    }

    function handleSubmit() {
        if (UserName !== "") {
            //No need to post new update if name isn't changing
            if (UserName === curName) {
                return;
            }

            joinServer(onResponse);
        }
        //TODO: Error saying it can't be empty

        callback(UUID, UserName);
    }

    function onResponse(response) {
        //Error handling
        console.log("Registered");
        console.log(e);
        setUUID(e.id);
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