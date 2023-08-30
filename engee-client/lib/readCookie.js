export default function ReadCookie(field) {
    let items = decodeURIComponent(document.cookie).split(';');

    for (let i = 0; i < items.length; i++) {
        let line = items[i];

        line = line.trimStart();

        if (line.substring(0, field.length) === field) {
            let value = line.substring(field.length+1, line.length);
            return value;
        }
    }

    return ""
}