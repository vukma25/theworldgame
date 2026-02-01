import { useDispatch } from 'react-redux'
import { MenuItem, Divider } from '@mui/material'
import { NearMe, NearMeDisabled, Edit, Delete } from '@mui/icons-material'
import CustomizedMenus from '../../../Components/StyledMenu/StyleMenu'
import { sendSignalClose } from '../../../redux/features/menu'
import { setDeleteDialog, setEditDialog, handlePinMessage, handleUnPinMessage } from '../../../redux/features/chat'

export default function MessageOptions({ isMe, content, mess_id, selectedConversation, pinned }) {

    const dispatch = useDispatch()

    function handleCloseMenu() {
        dispatch(sendSignalClose())
    }

    function handleOpenDeleteDialog() {
        dispatch(setDeleteDialog({
            conversation: selectedConversation,
            message: mess_id,
            open: true
        }))
        handleCloseMenu()
    }

    function handleOpenEditDialog() {
        dispatch(setEditDialog({
            conversation: selectedConversation,
            message: mess_id,
            content,
            open: true
        }))
        handleCloseMenu()
    }

    function handlePinnedMessage() {
        if (pinned) return

        dispatch(handlePinMessage({
            messageId: mess_id, conversationId: selectedConversation
        }))
        handleCloseMenu()
    }

    function handleUnPinnedMessage() {
        if (!pinned) return

        dispatch(handleUnPinMessage({
            messageId: mess_id, conversationId: selectedConversation
        }))
        handleCloseMenu()
    }

    return (
        <CustomizedMenus>
            {isMe && (<div>
                <MenuItem onClick={handleOpenEditDialog} disableRipple>
                    <Edit /> Edit
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleOpenDeleteDialog} disableRipple>
                    <Delete /> Delete
                </MenuItem>
                <Divider sx={{ my: 0.5 }} /></div>)}
            {!pinned ?
                <MenuItem onClick={handlePinnedMessage} disableRipple>
                    <NearMe /> Pin
                </MenuItem> :
                <MenuItem onClick={handleUnPinnedMessage} disableRipple>
                    <NearMeDisabled /> Un pin
                </MenuItem>
            }
        </CustomizedMenus>
    )
}