import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


export default function Protected({ children, path="/" }) {
    const { user } = useSelector((state) => state.auth)
    

    if (!user) {
        return <Navigate to={path} replace />
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}