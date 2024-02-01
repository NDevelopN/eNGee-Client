import { Paper, Box, Button } from '@mui/material';

const adjectives = [
    "wonderful",
    "daring",
    "tragic",
    "horrifying",
    "wacky",
    "insipring",
    "cautionary",
    "epic",
    "forgotten",
    "sinister",
    "funny",
    "mysterious",
    "ancient",
    "disgusting",
];

function Shuffled({shuffled, sendContinue}) {
    function Story() {
        let adj = Math.floor(Math.random() * adjectives.length);

        return  (
        <div>
            <h3 align='center'>
                The {adjectives[adj]} tale of {shuffled[0]} and {shuffled[1]}.
            </h3>
            <p align='center'>
                {shuffled[0]} met {shuffled[1]} at {shuffled[2]}.
                <br/>
                {shuffled[0]} {shuffled[3]}.
                <br/>
                {shuffled[1]} {shuffled[4]}.
                <br/>
                {shuffled[5]}.
            </p>
        </div>
        );
    }

    return (
    <Paper>
        <Box
            display='flex' 
            justifyContent='center' 
            alignItems='center'
            sx={{padding:'none', margin:'none'}}
        > 
        <Story/>
        </Box>
         
        <Button
            variant='contained'
            onClick={sendContinue}
            sx={{width:'40%', margin:'10px 30%'}}
        >
            Continue 
        </Button>
    </Paper>
    );
}

export default Shuffled;