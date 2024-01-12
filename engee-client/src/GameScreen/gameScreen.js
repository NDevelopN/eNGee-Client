import Lobby from '../Lobby';

function GameScreen ({url, userInfo, roomInfo, leave}){
    return (
    <>
        {roomInfo.addr !== "" && roomInfo.addr !== undefined
        ?
        <h3> This is where the game would be. </h3>
        : 
        null
        }

        <Lobby url={url} userInfo={userInfo} roomInfo={roomInfo} leave={leave}/>
        </>
    );
}

export default GameScreen;