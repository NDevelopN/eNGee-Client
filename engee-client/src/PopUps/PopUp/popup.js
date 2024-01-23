import * as mui from '@mui/material';

function PopUp({title, message, options}) {
    return (
        <mui.Table>
            <mui.TableRow key="message">
                <p>{message}</p>
            </mui.TableRow>

            <mui.TableRow key="options">
            {options.map(option => (
                <mui.TableCell key={option.text}>
                    <button id={option.text} onClick={option.onClick}>{option.text}</button>
                </mui.TableCell>
            ))}
            </mui.TableRow>

        </mui.Table>
    );
}

export default PopUp;