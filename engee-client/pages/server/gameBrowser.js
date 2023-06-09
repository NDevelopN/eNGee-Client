export default function GameBrowser({updateStatus, joinFunc, gameList}) {
    function createGame() {
        updateStatus("Creating");
    }
    //TODO change to material design

    return (
        <>
        <Table padding='none'>
            <TableHeader>
                <TableRow>
                    <TableCell><b>Game</b></TableCell>
                    <TableCell><b>Mode</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Players</b></TableCell>
                </TableRow>
            </TableHeader>

            <TableBody>
                {gameList.map(game=> (
                    <TableRow key={game.gid}>
                        <TableCell>{game.name}</TableCell>
                        <TableCell>{game.type}</TableCell>
                        <TableCell>{game.status}</TableCell>
                        <TableCell>{game.cur_plrs}/{game.max_plrs}</TableCell>
                        <TableCell><button onClick={()=>joinFunc(game.gid)}>Join</button></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </>
    );
}