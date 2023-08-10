import utilStyles from '@/styles/utils.module.css';
import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export default function Story({story, send, quit}) {

    function ready(e) {
        e.preventDefault();

        send("Status", "Ready");
    }


    let text = ""
    for (let i=0;i<story.length;i++) {
        text += story[i] + ". ";
    }

    return (
        <>
        <p>{text}</p>
        <button onClick={ready}>Ready</button>
        </>
    );
}