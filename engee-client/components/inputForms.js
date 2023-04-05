import {useState} from 'react';

export function SingleTextForm({promptText, outputHandler}) {
    const [input, setInput] = useState("");
    const [name, setName] = useState("");

    function HandleChange(e) {
       console.log(e.target.value);
       setInput(e.target.value);
    }
    
    //TODO: Add more validation
    function HandleSubmit(e) {

        e.preventDefault();
        if (input.length > 0) {  
            console.log(input);
            outputHandler(input);
            setName(input);
            setInput("");
        }
        else {
            console.log("Empty string");
        }
    }

    return (
        <>
        <form onSubmit={e => {HandleSubmit(e)}}>
            <div><span>{promptText}</span><input value={input} onChange={e => {HandleChange(e)}}/></div> </form></>
    )

}