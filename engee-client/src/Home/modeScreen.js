import Browser from '../Browser';
import Room from '../Room';
import GameScreen from '../GameScreen';

function ModeScreen({Mode, url, setMode, JoinRoom, leaveRoom, UserInfo, RoomInfo, setWarning, setConfirmation, setOnConfirm }) {
    switch(Mode) {
        case 0:
            return <h3>Please set your name.</h3>;
        case 1:
            return <Browser url={url} createRoom={()=>setMode(2)} joinRoom={JoinRoom}
                    setWarning={setWarning} setConfirmation={setConfirmation} setOnConfirm={setOnConfirm}/>
        case 2:
            return <Room url={url} joinRoom={JoinRoom} leave={()=>setMode(1)}
                    setWarning={setWarning} setConfirmation={setConfirmation} setOnConfirm={setOnConfirm}/>
        case 3:
            return <GameScreen url={url} userInfo={UserInfo} roomInfo={RoomInfo} leave={leaveRoom}
                    setWarning={setWarning} setConfirmation={setConfirmation} setOnConfirm={setOnConfirm}/>
        default:
            return <h3>Invalid Mode</h3>;
    }
}

export default ModeScreen;