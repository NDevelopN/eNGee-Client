import { useState, useEffect, useRef, memo } from 'react';

import ReadCookie from '@/lib/readCookie';

import Prompts from '@/pages/game/consequences/prompts';
import PostPrompts from '@/pages/game/consequences/postPrompts';
import Story from '@/pages/game/consequences/story';
import PostStory from '@/pages/game/consequences/postStory';

import Popup from 'reactjs-popup';

import {ConfirmDialog} from '@/components/dialogs';

const States = {
    LOBBY: 0,
    PROMPTS: 1,
    POSTPROMPTS: 2,
    STORIES: 3,
    POSTSTORIES: 4,
    ERROR: 5,
}

let issue = false;

function Consequences({round, paused, getMsg, send, quit, plrList, lid}) {

    let [dialog, setDialog] = useState(false);

    let [conState, setConState] = useState();
    let [prompts, setPrompts] = useState([]);
    let [story, setStory] = useState([]);
    let [err, setErr] = useState("");

    const ivRef = useRef(null);
    const toRef = useRef(null);
    const first = useRef(true);


    useEffect(() => {
        if (!paused) {
            getCookies();
        }
    }, [paused]);

    function getCookies() {

        let state = Number(ReadCookie("state"));
        if (state !== undefined) {
            updateState(state);
        } else {
            setErr("No state in cookies");
        }

        let p = ReadCookie("prompts");
        if (p !== undefined && p !== "") {
            setPrompts(JSON.parse(p));
        }

        let s = ReadCookie("story");
        if (s !== undefined && s !== "") {
            setStory(JSON.parse(s));
        }
    } 


    useEffect(() => {
        if (first.current) {
            setCookie("state", "");
            setCookie("prompts", "");
            setCookie("story", "");
            first.current = false;
        }

        ivRef.current = setInterval(processInput, 100);

        return () => {
            clearInterval(ivRef.current);
            clearTimeout(toRef.current);
        }
    }, []);

    useEffect(() => {
        if (!issue) {
            if (conState > States.ERROR) {
                issue = true;
                toRef.current = setTimeout(() =>  {
                    if (issue) {
                        setErr("Timeout on invalid state: " + conState);
                        setConState(States.ERROR); 
                    }
                }, 2000);
            }
        } else {
            if (conState <= States.ERROR || paused) {
                issue = false;
            }
        }
    }, [conState]);

    

    function updateState(state) {
        setConState(state);
        if (state === undefined) {
            return

        }

        setCookie("state", state);
        issue = false;
    }
 
    function processInput() {

        let message = getMsg();
        if (message == null) {
            return;
        }

        switch (message.type) {
        case "ConState":
            if (message.content !== "" && message.content !== undefined) {
                updateState(Number(message.content));
            } else {
                updateState(States.ERROR);
                setErr("Invalid state message: " + JSON.stringify(message));
            }
            break;
        case "ConTimer":
            break;
        case "Prompts":
            if (message.content === "" || message.content === undefined) {
                updateState(States.ERROR);
                setErr("Invalid prompts message: " + JSON.stringify(message));
                break;
            }

            let p = JSON.parse(message.content);
            setPrompts(p);
            setCookie("prompts", JSON.stringify(p));
            break;
        case "Story":
            if (message.content === "" || message.content === undefined) {
                updateState(States.ERROR);
                setErr("Invalid story message: " + JSON.stringify(message));
                break;
            }

            let s = JSON.parse(message.content);
            setStory(s);
            setCookie("story", JSON.stringify(s));
            break;
        default:
            updateState(States.ERROR);
            setErr("Invalid message type: " + JSON.stringify(message));
            break;
        }
    }

    function setCookie(vName, value) {
        document.cookie = vName + "=" + value + ";path='/pages/game/consequences/'";
    }

    function reply(replies) {
        send("Reply", JSON.stringify(replies));
        setConState(States.POSTPROMPTS);
    }

    function finishStory() {
        send("Status", "Ready");
        setConState(States.POSTSTORIES);
    } 

    function leave() {
        setCookie("state", "");
        setCookie("prompts", "");
        setCookie("story", "");
        send("Leave", "");
        quit();
    }

    function LeaveDialog() {
        return (
            <Popup open={dialog} onClose={()=>setDialog(false)}>
                <ConfirmDialog
                    text={"Are you sure you want to leave?"}
                    confirm={() => {leave(); setDialog(false)}}
                    close={() => setDialog(false)}
                />
            </Popup>
        );
    }

    if (paused) {
        return (
            <></>
        )
    }

    return (
        <>
        {(() => {
            switch (conState) {
            case States.PROMPTS:
                return (
                    <>
                    <Prompts prompts={prompts} reply={reply} quit={() => setDialog(true)}/>
                    <LeaveDialog/>
                    </>
                );
            case States.POSTPROMPTS:
                return <PostPrompts plrList={plrList} lid={lid} quit={leave}/>;
            case States.STORIES:
                return (
                    <>
                    <Story story={story} send={finishStory} quit={() => setDialog(true)}/>
                    <LeaveDialog/>
                    </>
                );
            case States.POSTSTORIES:
                return <PostStory plrList={plrList} lid={lid} quit={leave}/>;
            case States.ERROR:
                console.error(err);
                return <h3>Something went wrong.</h3>;
            }

            issue = true;
            return (<h3>Loading...</h3>);
        })()}
        </>
    )
}
export default Consequences = memo(Consequences);