import * as mui from '@mui/material';

function Shuffled({prompts, shuffled, sendContinue}) {
    console.log("shuffled: " + JSON.stringify(shuffled))

    return (
    <>
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
                    <mui.TableCell>{shuffled[index]}</mui.TableCell>
                </mui.TableRow>
            ))}
        </mui.TableBody>
    </mui.Table>
    <button onClick={sendContinue}>Continue</button>
    </>
    );
}

export default Shuffled;