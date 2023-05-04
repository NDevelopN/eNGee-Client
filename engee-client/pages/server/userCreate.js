import {useState} from 'react';

import {POST} from '@/lib/networkFunctions';

export default function UserCreate({id, name, callback, endpoint}) {

    let [UserName, setUserName] = useState("");

    function joinServer() {
        let message = {
            pid: id, 
            name: UserName,
        };

        POST(JSON.stringify(message), endpoint + "/server/", (e) => {
            callback(e.pid, UserName)
        });
    }

    function handleChange (event){
        setUserName(event.target.value); 
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (UserName !== "") {
            //No need to post new update if name isn't changing
            if (UserName === name) {
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
                <input type="text" name="name" value={UserName} autoComplete='off' onChange={handleChange}/>
                <input type="submit" value="submit"/>
            </label>
        </form>
    );
}