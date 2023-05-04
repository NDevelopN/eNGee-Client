import {useState} from 'react';

import utilStyles from '@/styles/utils.module.css';

export default function Prompts({prompts, reply}) {

    let [sent, setSent] = useState(false)
    let replies = [prompts.length];

    function handleSubmit(e) {
        e.preventDefault();
        
        for (let i = 0; i < prompts.length; i++) {
            if (replies[i] === null  || replies[i] === "") {
                console.log("Empty field: " + i);
                return
            }
        }

        reply(replies)
        setSent(true)
    }

    function handleChange(e, key) {
        replies[key] = e.target.value
        console.log(key +": " + replies[key])
    }

    //TODO make changes to bring back lobby
    if (sent) {
        return (<h2>Message sent, waiting for other players</h2>);
    }

    return (
        <div className={utilStyles.list}>
            <div className={utilStyles.listItem}>
                <div className={utilStyles.listItemElement}><b>Prompt</b></div>
                <div className={utilStyles.listItemElement}><b>Response</b></div>
            </div>

            <form onSubmit={handleSubmit}>

            {prompts.map((prompt, index) => (
                <div key={index} className={utilStyles.listItem}>
                    <label>{prompt}
                        <input type="text" name={prompt} value={replies[index]} autocomplete='off' onChange={(e) => handleChange(e, index)}/>
                    </label>
                </div>
            ))}
            <input type="submit" value="submit"/>
            </form>
        </div>
    );
}