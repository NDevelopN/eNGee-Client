import UserCreate from './userCreate';
import GameBrowser from './gameBrowser';
import GameCreator from './gameCreator';


export default function DisplayContent({UUID, GID, UserName, status, setUser, setGame, setCreating}) {

    console.log("Status: " + status);

    switch(status) {
        case "Naming":
            return (
                <UserCreate id={UUID} callback={setUser}/>
            );
        case "Browsing":
            return (
                <GameBrowser id={UUID} UserName={UserName} callback={setCreating}/>
            );
        case "Creating":
            return (
                <GameCreator id={UUID} callback={setGame}/>
            );
        default:
            return null;
    }
}