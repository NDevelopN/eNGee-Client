import {useState} from 'react';
import {POST} from '../lib/networkFunctions'
import parseJSON from 'date-fns/parseJSON';

export function SingleTextForm({promptText, outputHandler}) {
    const [input, setInput] = useState("");

    function HandleChange(e) {
       setInput(e.target.value);
    }
    
    //TODO: Add more validation
    function HandleSubmit(e) {

        e.preventDefault();
        if (input.length > 0) {  
            outputHandler(input);
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

    
//Accepts an array of strings and generates a set of input fields to handle them.
export function MultiTextForm({prompts, outputHandler}) {

    let formFields = [];
    for (let i = 1; i < prompts.length; i++) {
        formFields.push({response: ''});
    }

    const handleFormChange = (event, index) => {
        let data = [...formFields];
        formFields[index][event.target.name] = event.target.value;
    
    }

    function submit(event) {

        event.preventDefault();

        let data = [];

        for (let i = 0; i < formFields.length; i++) {
            let resp = formFields[i].response;

            //TODO Improve the validation
            if (resp === "response" || resp === "") {
                console.log("Not all fields are filled")
                return;
            }

            data[i] = resp;
        }

        outputHandler(data);

    }


    return (
        <div className="App">
            <form onSubmit={submit}>
                {formFields.map((form, index) => {
                    return (
                        <div key={index}>
                            <label>{prompts[index]}</label>
                            <input
                                name='response'
                                placeholder=''
                                onChange={event => handleFormChange(event, index)}
                                value={form.name}
                            />
                        </div>
                    )
                })}
            </form>
            <button onClick={submit}>Submit</button>
        </div>
    );
}