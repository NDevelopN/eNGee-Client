import {useState} from 'react';
import Popup from 'reactjs-popup';

import { ConfirmDialog } from '@/components/dialogs';

import {POST} from '@/lib/networkFunctions';

export default function UserCreate({id, name, callback, endpoint}) {

    let [UserName, setUserName] = useState("");
    let [dialog, setDialog] = useState(false);

    function joinServer() {
        let message = {
            pid: id, 
            name: UserName,
        };

        POST(JSON.stringify(message), endpoint + "/server/", (e) => {
            callback(e.pid, UserName)
        });
    }

    function dialogCheck(e) {
        e.preventDefault();

        if (UserName == undefined || UserName == "") {
            return
        }
        
        setDialog(true);
    }

    function handleChange (event){
        setUserName(event.target.value); 
    }

    function handleSubmit() {
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
        <div>
        {dialog ? <></> :
        <form onSubmit={(e)=>dialogCheck(e)}>
            <label>
                Change your name:
                <input type="text" name="name" value={UserName} autoComplete='off' onChange={handleChange}/>
                <input type="submit" value="submit"/>
            </label>
        </form>
        }
        <Popup open={dialog} onClose={()=>setDialog(false)}>
            <ConfirmDialog 
                text={"Are you happy with the username \"" + UserName + "\"?"}
                confirm={() => {handleSubmit(); setDialog(false)}} 
                close={() => setDialog(false)}
            />
        </Popup>
        </div>


    );
}