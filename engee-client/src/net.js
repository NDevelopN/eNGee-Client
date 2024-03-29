export async function httpRequest(method, message, endpoint, callback) {
    let request;
    if (message === "") {
        request = new Request(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } else {
        request = new Request(endpoint, {
            method: method,
            body: message,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }

    fetch(request).then((response) => {
        let s = response.status
        switch (s) {
            case 202: // Accepted
                callback();
                break;
            case 200: //OK
                response.json().then(callback);
                break;
            default: 
                throw new Error ("Something went wrong with http request: " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}


export function wsConnect(endpoint, onOpen, onClose, onMessage) {
    let socket = new WebSocket(endpoint);

    socket.onclose = onClose;

    socket.onerror = (event) => {
        console.error("Websocket issue:  " + event.data);
        socket.onclose();
    }

    socket.onopen = onOpen;

    socket.onmessage = onMessage;

    return socket;
}