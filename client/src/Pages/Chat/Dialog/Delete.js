import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDeleteDialog, handleDeleteMessage } from '../../../redux/features/chat';
import {
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

const classes = {
    title: { fontSize: "1.75rem" },
    text: { fontSize: "1.25rem", },
    btn: { fontSize: "1rem" },
    btnPrimary: { background: "var(--brand-600)", color: "var(--cl-white-pure)" }
}

export default function Delete() {
    const { deleteDialog: { conversation, message, open }, isLoading } = useSelector((state) => state.chat)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(setDeleteDialog({
            conversation: null,
            message: null,
            open: false
        }))
    }

    const deleteMessage = useCallback(() => {
        if (isLoading) return

        dispatch(handleDeleteMessage({
            conversationId: conversation,
            messageId: message,
        }))

    }, [isLoading, conversation, message])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle id="delete-dialog-title" sx={{ ...classes.title }}>
                Do you want to delete this message?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description" sx={{ ...classes.text }}>
                    Deleting this message means neither you nor the recipient will be able to see it.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{ ...classes.btn }}>Disagree</Button>
                <Button onClick={deleteMessage} sx={{ ...classes.btn, ...classes.btnPrimary }}>Agree</Button>
            </DialogActions>
        </Dialog>
    );
}
