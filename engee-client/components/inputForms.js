import {useState} from 'react';
import {POST} from '../lib/networkFunctions'
import parseJSON from 'date-fns/parseJSON';

export function SingleTextForm({promptText, outputHandler}) {
    const [input, setInput] = useState("");
    const [name, setName] = useState("");

    function HandleChange(e) {
       setInput(e.target.value);
    }
    
    //TODO: Add more validation
    function HandleSubmit(e) {

        e.preventDefault();
        if (input.length > 0) {  
            outputHandler(input);
            setName(input);
            setInput("");
        }
        else {
            console.debug("Empty string");
        }
    }

    return (
        <>
        <form onSubmit={e => {HandleSubmit(e)}}>
            <div><span>{promptText}</span><input value={input} onChange={e => {HandleChange(e)}}/></div> </form></>
    )

}
