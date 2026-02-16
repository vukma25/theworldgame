import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { setNotifications } from '../../redux/features/eventSocket';
import {
    Box, Typography, Button,
    Tabs, Tab
} from '@mui/material'
import { Circle } from '@mui/icons-material';
import TabContent from './TabContent';
import Back from '../../Components/BackBtn/Back'
import api from '../../lib/api';

// --brand - 500: #6366f1;
// --brand - 600: #4f46e5;
// --brand - 700: #4338ca;

const theme = createTheme({
    palette: {
        primary: {
            main: '#4338ca',
        },
        secondary: {
            main: '#6366f1',
        },
    },
});

export default function Notification() {
    const { notifications } = useSelector((state) => state.event)
    const { user: { _id } } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [tab, setTab] = useState(0)

    const style = {
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItem: "center"
    }

    function handleChangeTab(e, value) {
        setTab(value)
    }

    function redirect() {
        navigate("/")
    }

    function notice() {
        return (<Circle sx={{ fontSize: ".5rem", color: "red" }} />)
    }

    useEffect(() => {
        async function fetchNotification() {
            const response = await api.post('/notification/all', { id: _id }, { withCredentials: true })
            if (!response.data.notifications) return

            dispatch(setNotifications(response.data.notifications))

        }

        fetchNotification()
    }, [])

    const content = useMemo(() => {
        return notifications.filter(({ reveal }) => {
            return ((tab === 0 && reveal.type === "friend") ||
                (tab === 1 && reveal.type === "friend:response") ||
                (tab === 2 && reveal.type === "system"))
        })
    }, [notifications, tab])

    const tabStatus = useMemo(() => {
        const hasNew = { "0": false, "1": false, "2": false }
        notifications.forEach(({ reveal: { unread, type } }) => {
            if (unread) {
                switch (type) {
                    case "friend":
                        hasNew["0"] = true
                        break
                    case "friend:response":
                        hasNew["1"] = true
                        break
                    case "system":
                        hasNew["2"] = true
                        break
                    default:
                        break
                }
            }
        })

        return hasNew
    }, [notifications])


    if (notifications.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: "center", width: "100%",
                    height: "100vh", display: "flex",
                    flexDirection: "column", justifyContent: "center",
                    alignItems: "center", gap: "1rem"
                }}>
                <Typography variant='h4'>You do not have any notification</Typography>
                <Button sx={{ background: "var(--brand-500)", color: "var(--cl-white-pure)", width: "10rem", height: "3.5rem", fontSize: "1.2rem" }}
                    onClick={redirect}
                >Back</Button>
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <div style={style}>
                <Box sx={{
                    display: "flex", gap: 1, width: "90%",
                    margin: "1rem auto", alignItems: "center"
                }}>
                    <Back />
                    <Typography variant='h5' sx={{ fontSize: "1.75rem" }}>Notification</Typography>
                </Box>

                <Tabs
                    variant='fullWidth'
                    sx={{ margin: "0 auto", width: "90%" }}
                    value={tab}
                    textColor="secondary"
                    indicatorColor="primary"
                    onChange={handleChangeTab}
                >
                    <Tab
                        icon={tabStatus["0"] ? notice() : <></>}
                        iconPosition="end"
                        label="Friend request" />
                    <Tab
                        icon={tabStatus["1"] ? notice() : <></>}
                        iconPosition="end"
                        label="Friend response" />
                    <Tab
                        icon={tabStatus["2"] ? notice() : <></>}
                        iconPosition="end"
                        label="System" />
                </Tabs>
                <TabContent content={content} tab={tab} />
            </div>
        </ThemeProvider>
    );
}
