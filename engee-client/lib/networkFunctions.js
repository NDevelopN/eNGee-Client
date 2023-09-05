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
        let s = response.status
        if (s === 200 || s === 201 || s === 202) {
            response.json().then((data) => {
                if (callback) {
                    callback(data);
                }
            });
        } else {
            throw new Error ("Something went wrong on API server " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

export async function PUT(message, endpoint, callback) {
    const request = new Request(endpoint, {
        method: 'PUT',
        body: message,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });

    fetch(request).then((response) => {
        let s = response.status
        if (s === 200 || s === 201 || s === 202) {
            response.json().then((data) => {
                if (callback) {
                    callback(data);
                }
            });
        } else {
            throw new Error ("Something went wrong on API server " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

export async function GET(endpoint, callback) {
    let retval = null;

    const request = new Request(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });

    fetch(request).then((response) => {
        let s = response.status
        if (s === 200 || s === 201 || s === 202) {
            response.json().then((data) => {
                callback(data);
            });
        } else {
            throw new Error ("Something went wrong on API server " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

export async function DELETE(endpoint, callback) {
    let retval = null;
    
    const request = new Request(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });

    fetch(request).then((response) => {
        let s = response.status
        if (s === 200 || s === 201 || s === 202) {
            response.json().then((data) => {
                callback(data);
            });
        } else {
            console.error("Something went wrong on API server " + response.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

/** SOCK
 * Accepts an endpoint and creates a websocket connection
 * Callback allows the client function to manage connection 
 */
export async function SOCK(endpoint, callback, close) {
    let socket = new WebSocket(endpoint);
    socket.onclose = close;
    socket.onerror = (e) => {
        console.error("Websocket issue: " + e.data);
        close();
    }

    socket.onopen = () => {
        console.log("[open] Websocket connection established.");
        callback(socket);
    };
}