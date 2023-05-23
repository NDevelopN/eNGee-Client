import UserCreate from '@/pages/server/userCreate';
import GameBrowser from '@/pages/server/gameBrowser';
import GameManager from '@/components/gameManager';
import GameScreen from '@/pages/game/gameScreen';


export default function DisplayContent({UUID, GID, UserName, status, setUser, statusChange, joinFunc, url, gameCreate, exit, types, defGInfo}) {

    switch(status) {
        case "Naming":
            return (
                <UserCreate id={UUID} name={UserName} callback={setUser} url={url}/>
            );
        case "Browsing":
            return (
                <GameBrowser callback={statusChange} joinFunc={joinFunc} url={url}/>
            );
        case "InGame":
            return (
                <GameScreen pid={UUID} gid={GID} url={url} statusChange={statusChange} types={types} defGInfo={defGInfo}/>
            );
        case "Creating":
            return (
                <GameManager gid="" info={defGInfo} send={gameCreate} exit={exit} types={types}/>
            );
        default:
            return null;
    }
}