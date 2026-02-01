import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import SpeedDial from './Components/SpeedDial/SpeedDial'
import { connectSocket, disconnectSocket } from './redux/features/socket';
import { initSocket } from './socket';

export default function AppContent() {
    const { accessToken } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        if (accessToken) {
            dispatch(connectSocket(accessToken))
            initSocket()
        }

        return () => dispatch(disconnectSocket())
    }, [accessToken])

    return (
        <Fragment>
            <Outlet />
            <SpeedDial />
        </Fragment>
    )
}