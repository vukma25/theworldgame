import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Box, Grid, Button, CircularProgress, TextField,
    Typography, Divider, Dialog, DialogActions,
    DialogContent, DialogTitle
} from "@mui/material"
import { Check } from "@mui/icons-material"
import { verifyModal, updateProfile } from "../../../../../redux/features/profile";
import { LogContext } from "../../../Profile";
import api from "../../../../../lib/api";
import { fetchUser } from "../../../../../redux/features/auth";
import { socials } from "../../Left/SocialPattern";
import { ProfileContext } from "../index";

export default function EditMode({ info }) {
    const { user_information: { _id }, verify_modal, isLoading } = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const { username, email, bio, role, socialLinks } = info
    const [user, setUser] = useState({
        username, email, bio, role
    });
    const [social, setSocial] = useState({
        "facebook": "",
        "x": "",
        "instagram": "",
        "linkedin": "",
        "other": "",
        ...socialLinks
    })
    const [psd, setPsd] = useState("")
    const [format, setFormat] = useState({
        "facebook": true,
        "x": true,
        "instagram": true,
        "linkedin": true,
        "other": true
    })
    const { setLog } = useContext(LogContext)
    const { setMode } = useContext(ProfileContext)

    const handleInputChange = (field, u = 1) => (event) => {
        if (u === 1) {
            setUser({
                ...user,
                [field]: event.target.value
            });
        } else {
            setSocial({
                ...social,
                [field]: event.target.value
            })
            setFormat({
                ...format,
                [field]: socials[field].regex.test(event.target.value)
                    || event.target.value.length === 0
            })
        }

    };

    function checkAnyChange() {
        let cd1 = (
            user.username !== username ||
            user.email !== email ||
            user.bio !== bio
        )
        let cd2 = Object.entries(social).map(([f, v]) => {
            return (!socialLinks?.[f] && v.length !== 0) ||
                (socialLinks?.[f] && socialLinks?.[f] !== v)
        }).some(e => e)

        return cd1 || cd2
    }

    function handleCancelChange() {
        setUser({ username, email, bio, role })
        setSocial({
            "facebook": "",
            "x": "",
            "instagram": "",
            "linkedin": "",
            "other": "",
            ...socialLinks
        })
        setMode("view")
    }

    async function handleSaveChange() {
        try {
            setLog({ type: "info", message: "Updating" })
            await dispatch(updateProfile({
                id: _id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                socialLinks: social
            })).unwrap()
            dispatch(fetchUser())

            setLog({ type: "info", message: "Update successfully" })
        } catch (error) {
            setLog({ type: "error", message: "Update failed" })
        }
        finally {
            setMode("view")
        }
    }

    async function verify() {
        try {
            if (psd.length === 0) {
                setLog({ type: "error", message: "Password is required" })
                return
            }

            setLog({ type: "info", message: "Verifying" })
            const res = await api.post("auth/verify/action", {
                id: _id, password: psd
            }, { withCredentials: true })

            if (res.status !== 200) return

            handleSaveChange()
            setLog({ type: "error", message: "Verify successfully" })
            dispatch(verifyModal(false))
        } catch (error) {
            setLog({ type: "error", message: "Verify failed" })
        } finally {
            setPsd("")
        }
    }

    function cancelVerify() {
        dispatch(verifyModal(false))
        handleCancelChange()
    }

    function verifyChange() {
        try {
            if (!checkAnyChange()) {
                setLog({ type: "error", message: "You have not changed anything yet" })
                return
            }
            if (!Object.values(format).every(e => e)) {
                setLog({ type: "error", message: "Format of social link is not correct" })
                return
            }
            if (user.email !== email) {
                dispatch(verifyModal(true))
                return
            }
            handleSaveChange()
        } catch (error) {
            setLog({ type: "error", message: "Update failed" })
        }
    }

    function Field(field, value, u = 1) {
        return (
            <Grid key={field} size={{ xs: 12 }}>
                {(field !== "role" ?
                    <TextField
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={value}
                        helperText={u === 1 ? "" : format[field] ? "" : socials[field].helper}
                        error={u === 1 ? false : !format[field]}
                        onChange={handleInputChange(field, u)}
                        variant="outlined"
                    /> :
                    <TextField
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={value}
                        variant="outlined"
                        disabled
                    />
                )}
            </Grid>
        )
    }

    return (
        <Box>
            <Grid container spacing={2}>
                {
                    Object.keys(user).map((field) => {
                        return Field(field, user[field])
                    })
                }
                <Divider sx={{ width: "100%", bgcolor: "var(--cl-black)" }} />
                <Typography variant="h6">Social</Typography>
                {
                    Object.entries(social).map(([label, link]) => {
                        return Field(label, link, 0)
                    })
                }

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleCancelChange}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={verifyChange}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} /> : <Check />}
                        >
                            Save
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={verify_modal}>
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                    <Typography variant='body1' sx={{ mb: 2 }}>You have just changed some sensitive fields. You must verify to complete action</Typography>
                    <TextField
                        type="password"
                        label="Password"
                        fullWidth
                        value={psd}
                        onChange={(e) => setPsd(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelVerify}>Cancel</Button>
                    <Button onClick={verify}>Verify</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}