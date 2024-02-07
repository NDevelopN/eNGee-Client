import PopUp from '../PopUp';

function Warning({message, onClose}) {
    let options = [ 
        {
            "text": "Close",
            "onClick": onClose,
        },
    ];

    return (
    <PopUp 
        title={"Warning"} 
        message={message} 
        options={options} 
        onClose={onClose}
    />
    );
}

export default Warning;