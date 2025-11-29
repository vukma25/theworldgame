import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNotifications } from '../../redux/features/eventSocket';
import { Box, Typography, Button } from '@mui/material' 
import Friend from './Type/Friend'
import Info from './Type/Info'
import api from '../../lib/api';

export default function Notification() {
    const { notifications } = useSelector((state) => state.event)
    const { user: {_id}} = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const style = {
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItem: "center"
    }

    useEffect(() => {
        async function fetchNotification() {
            const response = await api.post('/notification/all', { id: _id }, { withCredentials: true })
            if (!response.data.notifications) return

            dispatch(setNotifications(response.data.notifications))

        }

        fetchNotification()
    }, [])


    if (notifications.length === 0) {
        return (
            <Box 
                sx={{textAlign:"center",width:"100%", 
                    height:"100vh",display:"flex",
                    flexDirection:"column",justifyContent:"center",
                    alignItems:"center",gap:"1rem"}}>
                <Typography variant='h4'>You do not have any notification</Typography>
                <Button sx={{background:"var(--brand-500)",color:"var(--cl-white-pure)",width:"10rem",height:"3.5rem",fontSize:"1.2rem"}}>Back</Button>
            </Box>
        )
    }

    return (
        <div style={style}>
            {notifications.map(({ title, content, reveal }) => {
                if (reveal.type === "friend") {
                    return (
                        <Friend key={reveal.id} title={title} content={content} reveal={reveal}/>
                    )
                } else {
                    return <Info key={reveal.id} title={title} content={content} reveal={reveal}/>
                }
            })}
        </div>
    );
}
