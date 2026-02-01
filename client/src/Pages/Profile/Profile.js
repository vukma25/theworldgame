import { useState, useEffect, createContext } from 'react';
import { useParams } from "react-router"
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from "@mui/material"
import UserProfile from './UserProfile';
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import { getMyProfile, getAnotherProfile } from '../../redux/features/profile';
import Logger from '../../Components/Logger/Logger';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

export const LogContext = createContext()

const Profile = () => {
    const { isLoading, user_information } = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const params = useParams()
    const [log, setLog] = useState({ type: "info", message: "" })

    useEffect(() => {
        if (params?.id) {
            dispatch(getAnotherProfile({ id: params.id }))
        } else {
            dispatch(getMyProfile())
        }
    }, [])


    if (isLoading || !user_information) {
        return <CircularProgress />
    }

    return (
        <LogContext.Provider value={{ log, setLog }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <UserProfile />
                <GoTopBtn />
                <Logger log={log} setLog={setLog} />
            </ThemeProvider>
        </LogContext.Provider>
    );
};

export default Profile;