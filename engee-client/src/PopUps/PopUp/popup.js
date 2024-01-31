import { FormGroup, Paper, ButtonGroup, Button } from '@mui/material';
function PopUp({title, message, options}) {
    return (
        <FormGroup sx={{margin:'10% 30%'}}>
            <Paper sx={{justifyItems:'center', padding:'1% 5%'}}>
            <h3 align='center'>{title}</h3>
            <p align='center'>{message}</p>
            <ButtonGroup fullWidth={true}>
                {options.map(option => (
                    <Button
                        key={option.text}
                        variant='contained' 
                        onClick={option.onClick}
                    >
                        {option.text}
 
                    </Button>
                ))}
            </ButtonGroup>
            </Paper>
        </FormGroup>
    );
}

export default PopUp;