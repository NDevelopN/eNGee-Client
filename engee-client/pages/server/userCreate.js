import {useState} from 'react';
import Popup from 'reactjs-popup';

import { ConfirmDialog } from '@/components/dialogs';

export default function UserCreate({user, updateUser, revertStatus, setActive}) {

    let [UserName, setUserName] = useState(user.name);
    let [dialog, setDialog] = useState(false);

    function logout() {
        user = {
            uid: user.uid,
            gid: "",
            name: "",
            status: "",
        };

        document.cookie = "uid=;path='/'";
        document.cookie = "username=;path='/'";

        updateUser(user, () => {
            setUserName("");
            setActive(true);
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
            if (UserName === user.name) {
                return;
            }

            let revert = user.name === "";

            user.name = UserName;
            updateUser(user, () => {
                if (revert) {
                    revertStatus();
                } else {
                    setActive(true);
                }
            });
        }

        //TODO: Error saying it can't be empty
    }

    return (
        <div>
        <form onSubmit={(e)=>dialogCheck(e)}>
            <label>
                Change your name: 
                <input type="text" name="name" defaultValue={UserName} autoComplete='off' onChange={handleChange}/>
                <input type="submit" value="submit"/>
            </label>
            {user.name !== "" ? 
            <div>
                <button onClick={revertStatus}>Return</button>
                <button onClick={logout}>Logout</button>
                </div>
            : null}
        </form>

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