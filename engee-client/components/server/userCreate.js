import {useState} from 'react';
import Popup from 'reactjs-popup';

import { ConfirmDialog } from '@/components/dialogs';

export default function UserCreate({pUser, updateUser, revertStatus, setStatus, setActive}) {

    let [UserName, setUserName] = useState(pUser.name);
    let [dialog, setDialog] = useState(false);

    function logout() {
        let user = {
            uid: pUser.uid,
            gid: "",
            name: "",
            status: "",
        };

        document.cookie = "uid=;path='/'";
        document.cookie = "username=;path='/'";
        updateUser(user, () => {
            setUserName("");
            setStatus(["Naming"]);
        });
    }

    function dialogCheck(e) {
        e.preventDefault();

        if (UserName == undefined || UserName == "") {
            return;
        }
        
        setDialog(true);
    }

    function handleChange (event){
        setUserName(event.target.value); 
    }

    function handleSubmit() {
        if (UserName !== "") {
            //No need to post new update if name isn't changing
            if (UserName === pUser.name) {
                alert("User name has not been changed");
                return;
            }

            let revert = pUser.name === "";

            let user = {
                uid: pUser.uid,
                gid: pUser.gid,
                name: UserName,
                status: pUser.status
            };

            updateUser(user, () => {
                if (revert) {
                    revertStatus();
                } else {
                    setActive(true);
                }
            });
        } else {
            alert("Please enter a user name");
        }
    }

    return (
        <div>
        <form onSubmit={(e)=>dialogCheck(e)}>
            <label>
                Change your name: 
                <input type="text" name="name" defaultValue={UserName} autoComplete='off' onChange={handleChange}/>
                <input type="submit" value="submit"/>
            </label>
            {pUser.uid !== "" ? 
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