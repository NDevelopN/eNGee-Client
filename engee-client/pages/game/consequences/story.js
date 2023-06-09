import utilStyles from '@/styles/utils.module.css';
import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export default function Story({story, send, quit}) {

    function ready(e) {
        e.preventDefault();

        send("Ready", "");
    }
    
    //TODO add ready button when supported server side
    return (
        <>
        <Table padding='none'>
            <TableHead>
                <TableRow>
                    <TableCell><b>Prompt</b></TableCell>
                    <TableCell><b>Response</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                
                {story.map((line, index) => (
                    <TableRow key={index}>
                        <TableCell>{line.prompt}</TableCell>
                        <TableCell>{line.story}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <button onClick={quit}>Quit</button>
        </>
    );
}