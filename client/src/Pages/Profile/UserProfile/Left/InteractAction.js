import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Button, MenuItem } from "@mui/material"
import {
    PersonAdd, Check, Block,
    PersonRemove, Close, Chat, Report
} from "@mui/icons-material"
import CustomizedMenus from "../../../../Components/StyledMenu/StyleMenu";


const renderFriendButton = (action) => {
    const buttonProps = {
        variant: 'contained',
        startIcon: <PersonAdd />,
        sx: { borderRadius: 2, width: "10rem" }
    };

    switch (action) {
        case 'pending':
            return (
                <Button {...buttonProps} color="warning" startIcon={<Check />}>
                    Accept
                </Button>
            );
        case 'friend':
            return (
                <Button {...buttonProps} color="error" startIcon={<PersonRemove />}>
                    Unfriend
                </Button>
            );
        case 'requested':
            return (
                <Button {...buttonProps} color="secondary" startIcon={<Close />}>
                    Pending
                </Button>
            );
        default:
            return (
                <Button {...buttonProps} color="primary">
                    Add
                </Button>
            );
    }
};

export default function InteractActionBtns() {
    const { user: {
        _id: id, friends, friendRequests
    } } = useSelector((state) => state.auth)
    const { user_information: { _id, friendRequests: fr } } = useSelector((state) => state.profile)
    const navigate = useNavigate()

    function getAction() {
        if (friends.some((id) => id.toString() === _id.toString())) return "friend"
        else if (friendRequests.some(({ from }) => from.toString() === _id.toString())) return "pending"
        else if (fr.some(({ from }) => from.toString() === id.toString())) return "requested"
        else return "none"
    }

    return (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            {renderFriendButton(getAction())}

            <IconButton
                onClick={() => navigate("/chat")}
                color="primary"
                sx={{ border: '1px solid', borderColor: 'primary.main' }}
            >
                <Chat />
            </IconButton>

            <CustomizedMenus hasShadow={true}>
                <MenuItem onClick={() => { }}>
                    <Block fontSize="small" sx={{ mr: 1 }} />
                    Block
                </MenuItem>
                <MenuItem onClick={() => { }}>
                    <Report fontSize="small" sx={{ mr: 1 }} />
                    Report
                </MenuItem>
            </CustomizedMenus>

        </Box>
    )
}