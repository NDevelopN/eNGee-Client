import { useState }  from 'react';

function TestInput({send}) {
    let [reply, setReply] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (reply === "" || reply === undefined) {
            return;
        }

        send(reply);
    }

    function handleChange(event) {
        setReply(event.target.value);
    }

    return (
    <form onSubmit={handleSubmit}>
        <label>
            Send a dumb reply:
            <input type="text" name="name" defaultValue={reply} autoComplete='off' onChange={handleChange}/>
        </label>
        <input type="submit" value="submit" onClick={handleSubmit}/>
    </form>
    );
}

export default TestInput;
