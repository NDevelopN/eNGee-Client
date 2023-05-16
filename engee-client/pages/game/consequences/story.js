import utilStyles from '@/styles/utils.module.css';
import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

export default function Story({story, update, quit}) {

    function ready(e) {
        e.preventDefault();

        update("Ready");
    }
    
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
                        <TableCell>{line.first}</TableCell>
                        <TableCell>{line.second}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <button onClick={ready}>Ready</button>
        <button onClick={quit}>Quit</button>
        </>
    );
}