import { useEffect, useState } from "react";

function Logger({ log }) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(log);

        const timeout = setTimeout(() => {
            setMessage('');
        }, 3000);

        return () => clearTimeout(timeout);
    }, [log]);

    return <div className="logger">{message}</div>;
}

export default Logger