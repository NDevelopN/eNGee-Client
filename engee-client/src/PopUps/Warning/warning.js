import PopUp from '../PopUp';

function Warning({title, message, onClose}) {
    let options = [ 
        {
            "text": "Close",
            "onClick": onClose,
        },
    ];

    return <PopUp title={title} message={message} options={options} onClose={onClose}/>;
}

export default Warning;