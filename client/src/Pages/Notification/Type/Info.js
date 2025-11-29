import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Accordion, AccordionActions, AccordionSummary,
    AccordionDetails, Typography, Button, Box
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { readNotification, deleteNotification } from '../../../redux/features/user';

export default function Notification({ title, content, reveal }) {
    const { user: { _id } } = useSelector((state) => state.auth)
    const { notifications } = useSelector((state) => state.event)
    const { isLoading } = useSelector((state) => state.user) 
    const dispatch = useDispatch()

    const read = useCallback((notificationId, id) => {
        const r = notifications.find(({ reveal: { id }}) => id.toString() === notificationId.toString())
        if (!r.reveal.unread) {
            console.log("This notification was read")
            return
        }

        if (isLoading) return

        dispatch(readNotification({ notificationId, id }))
    }, [isLoading])
    const del = useCallback((notificationId, id) => {
        if (isLoading) return

        dispatch(deleteNotification({ notificationId, id }))
    }, [isLoading])

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: ".5rem" }}>
            <Accordion sx={{ width: "90%" }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                    sx={{ 
                        background: `${reveal.unread ? "var(--cl-primary-yellow)" : "white"}`,
                        '& span': {
                            fontWeight: 600,
                            fontSize: "1.2rem"
                        }
                    }}
                >
                    <Typography component="span">{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>{content}</AccordionDetails>
                <AccordionActions>
                    <Button
                    variant='contained'
                    sx={{ background: "var(--cl-primary-yellow)", color:"var(--cl-black-light)" }}  
                    onClick={() => read(reveal.id, _id)}>Read</Button>
                    <Button
                    variant='contained'
                    sx={{ background: "var(--cl-primary-yellow)", color:"var(--cl-black-light)" }}              
                    onClick={() => del(reveal.id, _id)}>Delete</Button>
                </AccordionActions>
            </Accordion>
        </Box>
    )

}