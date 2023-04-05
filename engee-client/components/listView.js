import { useState } from "react";
import utilStyles from "../styles/utils.module.css";


//TODO: Tidy this up
//TODO: Change ready status to a symbol
//TODO: Is this something that can be made generic?
export function PlayerList({conFunc, conText, disFunc, disText, playerList}) {
    return (
        <>
        <div className={utilStyles.list}>
            <div className={utilStyles.listItem}>
                    <div className={utilStyles.listItemElement}><b>Name</b></div>
                    <div className={utilStyles.listItemElement}><b>Ready Status</b></div>

            </div>
            {playerList.map(player => (
                <div key={player.id} className={utilStyles.listItem}>
                    <div className={utilStyles.listItemElement}>{player.name}</div>
                    <div className={utilStyles.listItemElement}>{player.ready ? "Ready" : "Not Ready"}</div>
                </div>
            ))}
        </div>
        <div className="Buttons">
            <button onClick={conFunc}>{conText}</button>
            <button onClick={disFunc}>{disText}</button>
        </div>
        </>
    );
}

//TODO: Add list of available games