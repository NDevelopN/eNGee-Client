import PopUp from '../PopUp';

function Confirm({title, message, onConfirm, onClose}) {
    let options = [
        {
            "text": "Confirm",
            "onClick": onConfirm,
        },
        {
            "text": "Cancel",
            "onClick": onClose,
        },
    ];

    return <PopUp title={title} message={message} options={options}/>;
}

export default Confirm;