import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box, IconButton, Button, MenuItem, ButtonGroup,
    Dialog, DialogTitle, DialogActions, DialogContent
} from "@mui/material"
import {
    PersonAdd, Check, Block, Close,
    PersonRemove, HourglassEmpty, Chat, Report
} from "@mui/icons-material"
import CustomizedMenus from "../../../../Components/StyledMenu/StyleMenu";
import {
    sendRequestFriend, withdrawFriendRequest,
    handleFriendRequest, unfriend
} from "../../../../redux/features/user"

export default function InteractActionBtns() {
    const { user: {
        _id: id, friends, friendRequests
    } } = useSelector((state) => state.auth)
    const { user_information: { _id, friendRequests: fr } } = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [revoke, setRevoke] = useState(false)
    const [unf, setUnf] = useState(false)

    function handleCloseRevokeDialog() {
        setRevoke(false)
    }

    function handleOpenRevokeDialog() {
        setRevoke(true)
    }

    function handleCloseUnfDialog() {
        setUnf(false)
    }

    function handleOpenUnfDialog() {
        setUnf(true)
    }
    function handleWithdrawRequest() {
        dispatch(withdrawFriendRequest({ me: id, another: _id }))
        handleCloseRevokeDialog()
    }

    function handleWithdrawRequest() {
        dispatch(unfriend({ me: id, another: _id }))
        handleCloseUnfDialog()
    }

    function getAction() {
        if (friends.some((id) => id.toString() === _id.toString())) return "friend"
        else if (friendRequests.some(({ from }) => from.toString() === _id.toString())) return "pending"
        else if (fr.some(({ from }) => from.toString() === id.toString())) return "requested"
        else return "none"
    }

    function renderFriendButton(action) {
        const buttonProps = {
            variant: 'contained',
            startIcon: <PersonAdd />,
            sx: { borderRadius: 2, width: "10rem" }
        };

        switch (action) {
            case 'pending':
                return (
                    <ButtonGroup>
                        <Button
                            {...buttonProps} color="warning" startIcon={<Check />}
                            onClick={() => dispatch(handleFriendRequest({
                                userId: id,
                                id: _id,
                                response: "accept"
                            }))}
                        >
                            Accept
                        </Button>
                        <Button
                            {...buttonProps} color="inherit" startIcon={<Close />}
                            onClick={() => dispatch(handleFriendRequest({
                                userId: id,
                                id: _id,
                                response: "reject"
                            }))}
                        >
                            Reject
                        </Button>
                    </ButtonGroup>
                );
            case 'friend':
                return (
                    <Button
                        {...buttonProps} color="error" startIcon={<PersonRemove />}
                        onClick={handleOpenUnfDialog}
                    >
                        Unfriend
                    </Button>
                );
            case 'requested':
                return (
                    <Button
                        {...buttonProps} color="inherit" startIcon={<HourglassEmpty />}
                        onClick={handleOpenRevokeDialog}
                    >
                        Pending
                    </Button>
                );
            default:
                return (
                    <Button
                        {...buttonProps} color="primary"
                        onClick={() => dispatch(sendRequestFriend({
                            id,
                            userId: _id
                        }))}
                    >
                        Add
                    </Button>
                );
        }
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

            {/* Thu hoi yeu cau ket ban */}
            <Dialog open={revoke} onClose={handleCloseRevokeDialog}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>Are you sure you want to withdraw this request?</DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseRevokeDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleWithdrawRequest}>Ok</Button>
                </DialogActions>
            </Dialog>

            {/* Hoi truoc khi huy ket ban */}
            <Dialog open={unf} onClose={handleCloseUnfDialog}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>Are you sure you want to unfriend this person?</DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseUnfDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleWithdrawRequest}>Ok</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}