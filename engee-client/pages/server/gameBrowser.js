import {useState, useEffect} from 'react';
import {GET} from '@/lib/networkFunctions';

import {Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

const listInterval = 1000

export default function GameBrowser({updateStatus, setGame, url}) {
    let [GameList, setGameList] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => getGameList(), listInterval);
        return () => {
            clearInterval(timer);
        }
    }, []);

    function join(gid) {
        setGame(gid);
    }

    function createGame() {
        updateStatus("Creating");
    }

    function getGameList() {
        GET(url + "/games", (e) => {
            if (e.games) {
                setGameList(e.games);
            } else {
                setGameList([]);
            }
        });
    }
    
    return (
        <>
        <Table padding='none'>
            <TableHead>
                <TableRow>
                    <TableCell><b>Game</b></TableCell>
                    <TableCell><b>Mode</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Players</b></TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {GameList.map(game=> (
                    <TableRow key={game.gid}>
                        <TableCell>{game.name}</TableCell>
                        <TableCell>{game.type}</TableCell>
                        <TableCell>{game.status}</TableCell>
                        <TableCell>{game.cur_plrs}/{game.max_plrs}</TableCell>
                        <TableCell><button onClick={()=>join(game.gid)}>Join</button></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <button onClick={createGame}>Create New Game</button>
        </>
    );
}