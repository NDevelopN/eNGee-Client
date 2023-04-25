import UserCreate from '@/pages/server/userCreate';
import GameBrowser from '@/pages/server/gameBrowser';
import GameCreator from '@/pages/server/gameCreator';
import InGame from '@/pages/game/inGame';


export default function DisplayContent({UUID, GID, UserName, status, setUser, setGame, statusChange, joinFunc}) {

    console.log("Status: " + status);

    switch(status) {
        case "Naming":
            return (
                <UserCreate id={UUID} name={UserName} callback={setUser}/>
            );
        case "Browsing":
            return (
                <GameBrowser id={UUID} UserName={UserName} callback={statusChange} joinFunc={joinFunc}/>
            );
        case "InGame":
            return (
                <InGame pid={UUID} gid={GID} callback={statusChange}/>
            );
        case "Creating":
            return (
                <GameCreator id={UUID} joinFunc={joinFunc}/>
            );
        default:
            return null;
    }
}