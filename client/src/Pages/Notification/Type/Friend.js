import { useSelector, useDispatch } from 'react-redux'
import { Box, Avatar, Button, Card, CardHeader } from '@mui/material'
import { handleFriendRequest } from '../../../redux/features/user'

export default function Friend({ title, content, reveal }) {
    const { user: { _id } } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    function handleRequest(user, response) {
        try {
            dispatch(handleFriendRequest({
                userId: _id,
                id: user,
                response
            }))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: ".5rem" }}>
            <Card sx={{ width: "90%", display: "flex", justifyContent: "space-between", paddingRight: "1rem" }}>
                <CardHeader
                    sx={{
                        '& .MuiCardHeader-content span': { fontSize: "1.4rem" }
                    }}
                    avatar={<Avatar src={reveal.avatar} alt={reveal.username} />}
                    title={title}
                    subheader={content}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Button
                        variant='contained'
                        sx={{ background: "var(--cl-primary-yellow)", color: "var(--cl-white-pure)" }}
                        onClick={() => handleRequest(reveal.user, 'accept')}>accept</Button>
                    <Button
                        variant='outlined'
                        sx={{ borderColor: "var(--cl-primary-yellow)", color: "var(--cl-primary-yellow)" }}
                        onClick={() => handleRequest(reveal.user, 'reject')}>reject</Button>
                </Box>
            </Card>
        </Box>
    )
}