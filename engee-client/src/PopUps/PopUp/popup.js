import * as mui from '@mui/material';

function PopUp({title, message, options}) {
    return (
        <mui.Table>
            <mui.TableHead>
                <mui.TableRow>
                    <mui.TableCell><h3>{title}</h3></mui.TableCell>
                </mui.TableRow>
            </mui.TableHead>
            <mui.TableBody>
            <mui.TableRow key="message">
                <mui.TableCell>{message}</mui.TableCell>
            </mui.TableRow>

            <mui.TableRow key="options">
            {options.map(option => (
                <mui.TableCell key={option.text}>
                    <button id={option.text} onClick={option.onClick}>{option.text}</button>
                </mui.TableCell>
            ))}
            </mui.TableRow>
            </mui.TableBody>

        </mui.Table>
    );
}

export default PopUp;