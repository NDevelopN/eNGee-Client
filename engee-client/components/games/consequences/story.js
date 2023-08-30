export default function Story({story, send}) {

    function ready(e) {
        e.preventDefault();

        send();
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