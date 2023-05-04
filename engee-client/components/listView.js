import utilStyles from "../styles/utils.module.css";

//TODO: Change ready status to a symbol
export function PlayerList({playerList}) {

    return (
        <div className={utilStyles.list}>
            <div className={utilStyles.listItem}>
                    <div className={utilStyles.listItemElement}><b>Name</b></div>
                    <div className={utilStyles.listItemElement}><b>Status</b></div>
            </div>

            {playerList.map(player=> (
                <div key={player.id} className={utilStyles.listItem}>
                    <div className={utilStyles.listItemElement}>{player.name}</div>
                    <div className={utilStyles.listItemElement}>{player.status}</div>
                </div>
            ))}
        </div>
    );
}

export function GameList({gameList, joinFunc}) {
    return (
        <div className={utilStyles.list}>
            <div className={utilStyles.listItem}>
                    <div className={utilStyles.listItemElement}><b>Name</b></div>
                    <div className={utilStyles.listItemElement}><b>GameType</b></div>
                    <div className={utilStyles.listItemElement}><b>Status</b></div>
                    <div className={utilStyles.listItemElement}><b>Players</b></div>
            </div>

            {gameList.map(game=> (
                <div key={game.gid} className={utilStyles.listItem}>
                    <div className={utilStyles.listItemElement}>{game.name}</div>
                    <div className={utilStyles.listItemElement}>{game.game_type}</div>
                    <div className={utilStyles.listItemElement}>{game.cur_plrs}</div>
                    <div className={utilStyles.listItemElement}>{game.max_plrs}</div>
                    <button onClick={() => {joinFunc(game.gid);}} className={utilStyles.listItemElement }>Join</button>
                </div>
            ))}
        </div>
    );
}