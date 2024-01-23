import PopUp from '../PopUp';

function Confirm({message, onConfirm, onClose}) {
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

    return <PopUp title={"Confirmation"} message={message} options={options}/>;
}

export default Confirm;