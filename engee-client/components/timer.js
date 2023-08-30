import { memo } from  'react';
import style from '@/styles/timer.module.css'

function Timer({time})  {
    time = Number(time);
    if (isNaN(time) || time === undefined) {
        return <></>;
    }

    let msg
    if (time > 0) {
        msg = "" + time + "s left.";
    } else {
        msg = "Time's up!";
    }

    return (
        <div className={style.circle}>
            <p className={style.text}>{msg}</p>
        </div>
    );
}

export default Timer = memo(Timer);