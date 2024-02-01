import { Paper, ButtonGroup, Button} from '@mui/material';

function NoConnection({reconnect}) {
    return (
        <Paper sx={{padding:'10px 20%'}}>
            <h4 padding='none' align='center'>Not connected to the game.</h4>
            <h4 padding='none' align='center'> Something may be wrong.</h4>
            <ButtonGroup fullWidth={true}>
                <Button 
                    variant='contained'
                    onClick={reconnect}
                >
                    Reconnect
                </Button>
            </ButtonGroup>
        </Paper>
    );
}

export default NoConnection;
