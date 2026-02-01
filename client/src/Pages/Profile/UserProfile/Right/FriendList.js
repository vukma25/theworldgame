import { useSelector, useDispatch } from "react-redux"
import {
    Box, Typography, Button, Grid, Card, Stack,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, Paper
} from "@mui/material"
import { Group } from "@mui/icons-material"
import BadgeAvatar from "../../../../Components/BadgeAvatar/BadgeAvatar"
import { useOnline } from "../../../../hook/useOnline"
import { friendModal } from "../../../../redux/features/profile"

export default function FriendList() {
    const { user_information: { friends }, friend_list_modal } = useSelector((state) => state.profile)
    const isOnline = useOnline()
    const dispatch = useDispatch()

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Friend list ({friends.length})
                </Typography>
                {friends.length > 6 && <Button
                    variant="outlined"
                    size="small"
                    onClick={() => { dispatch(friendModal(true)) }}
                >
                    See all
                </Button>}
            </Box>

            <Grid container spacing={2}>
                {friends.slice(0, 6).map((friend) => {
                    const { _id, username, avatar } = friend

                    return (<Grid size={{ xs: 6, md: 4 }} key={_id}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                            <BadgeAvatar username={username} src={avatar} online={isOnline(_id)} />
                            <Typography variant="body1" fontWeight="medium" sx={{ mt: 2 }}>
                                {username}
                            </Typography>
                        </Card>
                    </Grid>)
                })}
            </Grid>

            <Dialog
                open={friend_list_modal}
                onClose={() => dispatch(friendModal(false))}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Group sx={{ mr: 1 }} />
                        All friends ({friends.length})
                    </Box>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        height: "40rem",
                        overflowY: "auto"
                    }}
                >
                    <Stack
                        direction="column"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={1} sx={{ py: 1 }}
                    >
                        {friends.map((friend) => {
                            const { _id, username, avatar } = friend

                            return (
                                <Paper sx={{
                                    width: "100%", p: 2, display: "flex", boxShadow: "0 0 2rem var(--cl-gray)",
                                    justifyContent: "start", alignItems: "center", gap: "1rem"
                                }}>
                                    <BadgeAvatar username={username} src={avatar} online={isOnline(_id)} />
                                    <Typography variant="body1" fontSize={"1.5rem"}>
                                        {username}
                                    </Typography>
                                </Paper>)
                        })}</Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dispatch(friendModal(false))}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}