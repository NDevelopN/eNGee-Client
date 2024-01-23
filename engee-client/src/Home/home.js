import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';

import User from '../User';
import Browser from '../Browser';
import Room from '../Room';
import GameScreen from '../GameScreen';

import Warning from '../PopUps/Warning';
import Confirm from '../PopUps/Confirm';

import { httpRequest } from '../net';

const url = "http://localhost:8090";

const emptyRoom = {
    'name': "",
    'rid': "",
    'type': "",
}

function Home() {
    let [Mode, setMode] = useState(0);
    let [UserInfo, setUserInfo] = useState({'name': "", 'uid': ""});
    let [RoomInfo, setRoomInfo] = useState(emptyRoom);

    let [warning, setWarning] = useState("");
    let [confirmation, setConfirmation] = useState("");

    let afterConfirmation = useRef(() => {console.log("afterConfirmation")});

    function setAfterConfirmation(onConfirmation) {
        afterConfirmation.current = onConfirmation;
    }

    useEffect(updateMode, [UserInfo, RoomInfo]);

    function JoinRoom(room) {
        let endpoint = url + "/users/" + UserInfo.uid + "/room";
        httpRequest("PUT", room.rid, endpoint, () => {
            setRoomInfo(room);
        });
    }

    //TODO define Modes and transitions
    function updateMode() {
        if (Mode !== 0 && (UserInfo.uid === "" || UserInfo.uid === undefined)) {
            setRoomInfo(emptyRoom);
            setMode(0);
            return;
        }

        if (Mode === 0) {
            if (UserInfo.uid !== "" && UserInfo.uid !== undefined) {
                setMode(1);
            }
            return;
        }

        if (Mode === 1 || Mode === 2) {
            if (RoomInfo.rid !== "" && RoomInfo.rid !== undefined) {
                setMode(3);
                return;
            }
        }

        if (Mode === 3) {
            if (RoomInfo.rid === "" || RoomInfo.rid === undefined) {
                setMode(1);
                return;
            }
        }
    }

    function leaveRoom() {
        let endpoint = url + "/users/" + UserInfo.uid + "/leave";
        
        httpRequest("PUT", RoomInfo.rid, endpoint, () => {
            setRoomInfo(emptyRoom);
            setMode(1);
        });
    }

    function ModeScreen() {
        switch(Mode) {
            case 0:
                return <h3>Please set your name.</h3>;
            case 1:
                return <Browser url={url} createRoom={()=>setMode(2)} joinRoom={JoinRoom}/>
            case 2:
                return <Room url={url} joinRoom={JoinRoom} leave={()=>setMode(1)}/>
            case 3:
                return <GameScreen url={url} userInfo={UserInfo} roomInfo={RoomInfo} leave={leaveRoom}/>
            default:
                return <h3>Invalid Mode</h3>;
        }
    }

    function WarningModal() {
        console.log("warning")
        return ( 
            <Modal
                isOpen={warning !== "" && warning !== undefined}
                contentLabel="Warning"
            >
                <Warning
                    message={warning}
                    onClose={() => setWarning("")}
                />
            </Modal>
        );
    }

    function ConfirmationModal() {
        console.log("Confirmation")
        return (
            <Modal
                isOpen={confirmation !== "" && confirmation !== undefined}
                onRequestClose={() => setConfirmation("")}
                contentLabel="Confirmation"
            >
                <Confirm
                    message={confirmation}
                    onConfirm={() => {
                        setConfirmation(""); 
                        afterConfirmation.current();
                    }}
                    onClose={() => setConfirmation("")}
                />
            </Modal>
        );
    }


    return (
        <>
            <WarningModal/>
            <ConfirmationModal/>
            <User url={url} User={UserInfo} setUser={setUserInfo}/> 
            <ModeScreen/>
        </>
    );
}

export default Home;