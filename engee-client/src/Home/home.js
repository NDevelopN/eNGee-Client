import { useState } from 'react';

function Home() {
    let [Mode, setMode] = useState(0);

    switch (Mode) {
        default:
            return <h3>Invalid Mode</h3>;
    }
}

export default Home;