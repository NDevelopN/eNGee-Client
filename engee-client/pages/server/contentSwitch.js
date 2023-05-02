import UserCreate from '@/pages/server/userCreate';
import GameBrowser from '@/pages/server/gameBrowser';
import GameCreator from '@/pages/server/gameCreator';
import GameScreen from '@/pages/game/gameScreen';


export default function DisplayContent({UUID, GID, UserName, status, setUser, statusChange, joinFunc}) {

    switch(status) {
        case "Naming":
            return (
                <UserCreate id={UUID} name={UserName} callback={setUser}/>
            );
        case "Browsing":
            return (
                <GameBrowser callback={statusChange} joinFunc={joinFunc}/>
            );
        case "InGame":
            return (
                <GameScreen pid={UUID} gid={GID} callback={statusChange}/>
            );
        case "Creating":
            return (
                <GameCreator id={UUID} joinFunc={joinFunc}/>
            );
        default:
            return null;
    }
}