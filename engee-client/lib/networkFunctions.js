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
            console.log(response.body);
            response.json().then((data) => {
                if (callback) {
                    callback(data.message);
                }
            })
        } else {
            throw new Error ("Somethign went wrong on API server " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

/** GET
 * Accepts an endpoint and a callback function to be called when the server responds
 */
export async function GET(endpoint, callback) {
    const request = new Request(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });

    fetch(endpoint).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                callback(data.message);
            })
        }
    })
}

//TODO: Change default functions to use callbacks
/** SOCK
 * Accepts an endpoint and creates a websocket connection
 */
export async function SOCK(endpoint, callback) {
    let socket = new WebSocket(endpoint);

    socket.onopen = (e) => {
        alert("[open] Connection established");
        alert("Sending to server");
        socket.send("Test message");
    };

    socket.onmessage = (e) => {
        alert("[message] Received: " + e.data);
    };

    socket.onclose = (e) => {
        if (e.wasClean) {
            alert("[close] Connection closed cleanly, code=" + e.code + " reason=" + e.reason);
        } else {
            alert("[close] Connection died");
        }
    };

    socket.onerror = (e) => {
        alert("[error] " + e.data);
    };


}