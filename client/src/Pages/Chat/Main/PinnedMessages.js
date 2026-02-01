import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Card, CardContent, Typography, Stack, IconButton,
    Box, Divider, Tooltip, Pagination, MenuItem, Chip
} from '@mui/material';
import { PushPin, KeyboardArrowDown, NearMeDisabled } from '@mui/icons-material'
import CustomizedMenus from '../../../Components/StyledMenu/StyleMenu';
import BadgeAvatar from '../../../Components/BadgeAvatar/BadgeAvatar';
import moment from 'moment/moment';
import { handleUnPinMessage } from '../../../redux/features/chat';
import { setClose } from '../../../redux/features/menu';

function PinnedMessages({ messages }) {
    const { selectedConversation: { conversationId } } = useSelector((state) => state.event)
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1)

    const truncateContent = (content, maxLength = 100) => {
        if (content.length <= maxLength) return content;
        return `${content.substring(0, maxLength)}...`;
    };

    function handleOpen() {
        setOpen((prev) => !prev)
    }

    function handlePageChange(e, value) {
        setPage(value)
    }


    const length = messages.length
    useEffect(() => {
        if (Math.ceil(length / 4) < page) {
            handlePageChange(null, page - 1)
        }
    }, [length, page])

    return (
        <Card sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
            position: "fixed",
            top: "7rem",
            left: "3rem",
            right: "3rem",
            zIndex: 99,
            height: open ? "38rem" : "5rem",
            transition: "height .25s"
        }}>
            <Box sx={{
                p: 1,
                bgcolor: 'var(--brand-600)',
                display: 'flex',
                alignItems: 'center',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                zIndex: 97
            }}>
                <PushPin sx={{ mr: 1, fontSize: 20, color: "white" }} />
                <Typography variant='h6' fontWeight="bold" color='white'>
                    Pinned messages
                </Typography>
                <Chip
                    label={messages.length}
                    sx={{ ml: 1, color: "white" }}
                />
                <IconButton sx={{ marginLeft: "auto" }} onClick={handleOpen}>
                    <KeyboardArrowDown sx={{ color: "white", fontSize: "2rem", transform: open ? "rotate(180deg)" : "" }} />
                </IconButton>
            </Box>

            <CardContent sx={{ p: 1 }}>
                <Stack spacing={1}>
                    {messages.slice(4 * page - 4, 4 * page).map(({ _id, content, sentAt, sender: { username, avatar } }, index) => {
                        return (<Fragment key={_id || index}>
                            <Box
                                sx={{
                                    p: ".25rem, 1rem",
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <BadgeAvatar username={username} src={avatar} online={null} />

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                                fontSize={"1.2rem"}
                                                color="text.primary"
                                            >
                                                {username || 'Anonymous'}
                                            </Typography>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Tooltip title={"Date"}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {moment(sentAt).format('DD/MM/YYYY - hh:mm')}
                                                    </Typography>
                                                </Tooltip>
                                                <CustomizedMenus hasShadow={true}>
                                                    <MenuItem onClick={
                                                        () => {
                                                            dispatch(handleUnPinMessage({
                                                                messageId: _id, conversationId
                                                            }))
                                                            dispatch(setClose())
                                                        }}
                                                        disableRipple>
                                                        <NearMeDisabled /> Un pin
                                                    </MenuItem>
                                                </CustomizedMenus>
                                            </Stack>
                                        </Stack>

                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                                fontSize: "1.25rem"
                                            }}
                                        >
                                            {false ?
                                                truncateContent(content, 50) :
                                                content
                                            }
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {(index + 1) % 4 !== 0 && (
                                <Divider sx={{ mx: 1 }} />
                            )}
                        </Fragment>)
                    })}
                </Stack>
            </CardContent>

            {messages.length >= 4 &&
                <Pagination
                    count={Math.ceil(messages.length / 4)}
                    variant="outlined" shape="rounded"
                    sx={{
                        width: "100%",
                        display: open ? "flex" : "none",
                        justifyContent: "center",
                        marginTop: "auto",
                        position: "absolute",
                        bottom: "1rem",
                        zIndex: 90
                    }}
                    onChange={handlePageChange}
                />}
        </Card>
    );
};

export default PinnedMessages;