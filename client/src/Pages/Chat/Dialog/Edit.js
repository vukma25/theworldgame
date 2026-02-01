import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditDialog, handleEditMessage } from '../../../redux/features/chat';
import {
    Button, Dialog, DialogActions, TextField, InputAdornment,
    DialogContent, DialogContentText, DialogTitle, CircularProgress
} from '@mui/material';
import { Close, DoneAll } from '@mui/icons-material';

const classes = {
    title: { fontSize: "1.75rem" },
    text: { fontSize: "1.25rem", },
    btn: { fontSize: "1rem" },
    btnPrimary: { background: "var(--brand-600)", color: "var(--cl-white-pure)" }
}

export default function Edit() {
    const { editDialog: { conversation, message, content, open }, isLoading } = useSelector((state) => state.chat)
    const dispatch = useDispatch()

    const [con, setCon] = useState(content)
    const [helper, setHelper] = useState({
        error: false,
        reason: ''
    })

    function setMessage(e) { setCon(e.target.value) }

    function handleClose() {
        dispatch(setEditDialog({
            conversation: null,
            message: null,
            content: null,
            open: false
        }))
        setHelper({ error: false, reason: '' })
    }


    const editMessage = useCallback(() => {
        if (isLoading) return
        if (con === content) {
            setHelper({ error: true, reason: "You must change message before updating" })
            return
        }

        dispatch(handleEditMessage({
            conversationId: conversation,
            messageId: message,
            newContent: con
        }))
        dispatch(setEditDialog({
            conversation,
            message,
            content: con,
            open: true
        }))
        setHelper({ error: false, reason: "Updated successfully" })
    }, [con, isLoading, conversation, message])

    useEffect(() => {
        setCon(content)
    }, [content])

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ ...classes.title }}>Edit message</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ ...classes.text }}>
                    To edit this message, please enter a new message here and it will be updated immediately.
                </DialogContentText>
                <TextField
                    required
                    margin="dense"
                    id="mess"
                    name="message"
                    error={helper.error}
                    helperText={helper.reason}
                    label="Modified message"
                    fullWidth
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    {isLoading ? <CircularProgress size='1.5rem' /> :
                                        helper.error ? <Close color='error' /> : <DoneAll sx={{ color: "var(--cl-green)" }} />}
                                </InputAdornment>
                            ),
                        },
                    }}
                    variant="standard"
                    value={con ?? ''}
                    onChange={setMessage}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{ ...classes.btn }}>Cancel</Button>
                <Button onClick={editMessage} sx={{ ...classes.btn, ...classes.btnPrimary }}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}
