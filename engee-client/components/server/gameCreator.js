import {POST} from '@/lib/networkFunctions';

import GameManager from '@/components/gameManager';

export default function GameCreator({uid, setGame, revertStatus, setActive, url}) {

    let info = {
        gid: "",
        name: "",
        type: "",
        status: "Lobby",
        old_status: "",
        leader: uid,
        min_plrs: 1,
        max_plrs: 1,
        cur_plrs: 0,
        additional_rules: "", 
    };

    function send(info) {
        let endpoint = url + "/games";
        let msg = JSON.stringify(info);

        POST(msg, endpoint, (e) => {
            setGame(e.gid);
        });
    }

    return (
        <GameManager info={info} send={send} revertStatus={revertStatus} url={url}/>
    );
}