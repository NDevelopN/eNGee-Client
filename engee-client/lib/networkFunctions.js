//TODO: Investigate CORS and identify what configuration is needed.

/** POST
 * Accepts a JSON object (message) to be sent to the endpoint
 * Can also accept a callback function to be called when the server responds
 */
export async function POST(message, endpoint, callback) {
    const request = new Request(endpoint, {
        method: 'POST',
        body: message,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });

    fetch(request).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                if (callback) {
                    callback(data);
                }
            })
        } else {
            throw new Error ("Something went wrong on API server " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function GET(endpoint, callback) {
    let retval = null;

    const request = new Request(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });

    //TODO: Which other statuses are acceptable?

    fetch(request).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                callback(data);
            })
        } else {
            throw new Error ("Something went wrong on API server " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

/** SOCK
 * Accepts an endpoint and creates a websocket connection
 * Callback allows the client function to manage connection 
 */
export async function SOCK(endpoint, callback) {
    let socket = new WebSocket(endpoint);

    socket.onopen = (e) => {
        console.log("[open] Connection established");
        callback(socket);
    };

    socket.onclose = (e) => {
        if (e.wasClean) {
            console.log("[close] Connection closed cleanly, code=" + e.code + " reason=" + e.reason);
        } else {
            console.log("[close] Connection died");
        }
    };

    socket.onerror = (e) => {
        console.log("[error] " + e.data);
    };
}