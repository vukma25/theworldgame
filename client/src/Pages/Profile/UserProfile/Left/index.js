import { useSelector } from "react-redux"
import { Card, CardContent, Typography, Box } from "@mui/material"
import { useOnline } from "../../../../hook/useOnline"
import BadgeAvatar from "../../../../Components/BadgeAvatar/BadgeAvatar"
import UserAvatar from "./UserAvatar"
import InteractActionBtns from "./InteractAction"
import Name from "./Name"
import Contact from "./Contact"
import Socials from "./Socials"

export default function LeftPart() {
    const { is_me, user_information: { _id, bio, username, avatar } } = useSelector((state) => state.profile)
    const isOnline = useOnline()

    return (
        <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    {is_me ? <UserAvatar /> :
                        <BadgeAvatar username={username} src={avatar} online={isOnline(_id)} sx={{ width: "15rem", height: "15rem", fontSize: "3rem" }} />}
                    {!is_me && <InteractActionBtns />}
                </Box>

                <Name />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 3,
                        fontStyle: 'italic',
                        lineHeight: 1.6
                    }}
                >
                    {bio}
                </Typography>

                <Contact />
                <Socials />
            </CardContent>
        </Card>
    )
}