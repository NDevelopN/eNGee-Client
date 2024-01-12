function TestMode({url, userInfo, roomInfo, leave}) {
    switch (roomInfo.status) {
        default:
            return (
            <>
                <h3>TestMode: Unsupported Status.</h3>
                <button onClick={leave}>Leave</button>
            </>
            );            
    }
}

export default TestMode;