import { parseISO, format } from 'date-fns';

//TODO is there any need to keep this?
export default function Date({dateString}) {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}