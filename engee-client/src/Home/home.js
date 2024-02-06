import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';

import ModeScreen from './modeScreen.js'

import User from '../User';
import Warning from '../PopUps/Warning';
import Confirm from '../PopUps/Confirm';

import { httpRequest } from '../net';

import { Paper } from '@mui/material';

const emptyRoom = {
    'name': "",
    'rid': "",
    'type': "",
}

function Home({id, cfg}) {
    let [Mode, setMode] = useState(0);
    let [UserInfo, setUserInfo] = useState({'name': "", 'uid': ""});
    let [RoomInfo, setRoomInfo] = useState(emptyRoom);

    let [warning, setWarning] = useState("");
    let [confirmation, setConfirmation] = useState("");

    let afterConfirmation = useRef(() => {});

    let url = "http://" + cfg.server.host + ":" + cfg.server.port;

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

    function WarningModal() {
        return ( 
            <Modal
                className="modal"
                appElement={document.getElementById('app')}
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
        return (
            <Modal 
                className="modal"
                appElement={document.getElementById('app')}
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
                    onClose={() => {
                        setConfirmation("");
                        setAfterConfirmation(null); 
                    }}
                />
            </Modal>
        );
    }

    return (
            <Paper sx={{margin: '20px', padding:'10px', justifyContent:'center'}}>
                <WarningModal/>
                <ConfirmationModal/>
                <User 
                    url={url} 
                    User={UserInfo} 
                    setUser={setUserInfo}
                    setWarning={setWarning} 
                    setConfirmation={setConfirmation} 
                    setOnConfirm={setAfterConfirmation}
                />
                <ModeScreen 
                    Mode={Mode} 
                    url={url} 
                    setMode={setMode} 
                    JoinRoom={JoinRoom} 
                    leaveRoom={leaveRoom} 
                    UserInfo={UserInfo} 
                    RoomInfo={RoomInfo}
                    setWarning={setWarning} 
                    setConfirmation={setConfirmation} 
                    setOnConfirm={setAfterConfirmation}/>
            </Paper>
    );
}

export default Home;