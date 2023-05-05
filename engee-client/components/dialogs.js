import style from '@/styles/popup.module.css';

export function ConfirmDialog({text, confirm, close}) {
    return (
        <div className={style.modal}>
            <button className={style.close} onClick={close}>
                &times;
            </button>
            <div className={style.header}>Confirmation</div>
            <div className={style.content}>
                <p>{text}</p>
                <br/>
                <button className={style.button} onClick={() => confirm()}>Confirm</button>
            </div>
        </div>
    );
}

export function TextDialog({text, confirm, change, close}) {
    return (
        <div className={style.modal}>
            <button className={style.close} onClick={close}>
                &times;
            </button>
            <div className={style.header}>Text Entry</div>
            <div className={style.content}>
                <label>{text}
                    <input type="text" autoComplete="off" onChange={(e) => change(e)}/>
                </label>
                <br/>
                <button className={style.button} onClick={() => confirm()}>Confirm</button>
            </div>
        </div>
    );
}

export function NumberDialog({text, confirm, change, close}) {
    return (
        <div className={style.modal}>
            <button className={style.close} onClick={close}>
                &times;
            </button>
            <div className={style.header}>Number Entry</div>
            <div className={style.content}>
                <label>{text}
                    <input type="number" onChange={(e)=>change(e)}/>
                </label>
                <br/>
                <button className={style.button} onClick={() => confirm()}>Confirm</button>
            </div>
        </div>
    );
}