import Prompts from '@/pages/game/consequences/prompts';
import Story from '@/pages/game/consequences/story';

export default function Consequences({msg, send, quit}) {

    function reply(replies) {
        let response = {
            list: replies
        };

        send("Reply", JSON.stringify(response));
    }

    function update(text) {
        send("Update", text);
    }

    function leave() {
        send("Leave", "");
        quit();
    }
    
    let content = JSON.parse(msg.content)

    switch (msg.type) {
        case "Prompts":
            return (<Prompts prompts={content.list} reply={reply}/>);
        case "Story":
            return (<Story story={content.list} update={update} quit={leave}/>);
        default:
            return (<h2>Something isnt quite right.</h2>)
    }
}