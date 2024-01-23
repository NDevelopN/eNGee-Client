import { useState } from 'react';

import * as mui from '@mui/material';

function Prompts({prompts, sendReplies, setWarning}) {
    let [replies, setReplies] = useState([]);

    function handleChange(event) {
        let r = replies;
        r[parseInt(event.target.name)] = event.target.value;

        setReplies(r);
    }

    function handleSubmit(event) {
        console.log("Submitting in prompts")
        event.preventDefault();
        if (replies.length === prompts.length) {
            for (let i = 0; i < replies.length; i++) {
                if (replies[i] === "" || replies[i] === null || replies[i] === undefined) {
                    setWarning("Reply #" + (i+1) + " is missing.");
                    return;
                }
            }
            sendReplies(replies);
        } else if (replies.length < prompts.length) {
            setWarning("You must provide a reply to each prompt.");
        } else {
            console.error("Reply set is larger that prompts");
        }

    }

    return (
    <>
    <form onSubmit={handleSubmit}>
    <mui.Table padding='none'>
        <mui.TableHead>
            <mui.TableRow>
                <mui.TableCell><b>Prompt</b></mui.TableCell>
                <mui.TableCell><b>Reply</b></mui.TableCell>
            </mui.TableRow>
        </mui.TableHead>

        <mui.TableBody>
            {prompts.map((prompt, index) => (
                <mui.TableRow key ={index}>
                    <mui.TableCell>{prompt}</mui.TableCell>
                    <mui.TableCell><input type="text" name={index} defaultValue={replies[index]} autoComplete='off' onChange={handleChange}/></mui.TableCell>
                </mui.TableRow>
            ))}
        </mui.TableBody>
    </mui.Table>
    <input type="submit" value="submit" onClick={handleSubmit}/>
    </form>
    </>
    );
}

export default Prompts;