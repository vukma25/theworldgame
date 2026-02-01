import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { styled, alpha } from '@mui/material/styles';
import { setAnchor, setClose } from '../../redux/features/menu';
import { IconButton, Menu } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
                ...theme.applyStyles('dark', {
                    color: 'inherit',
                }),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));

const shadow =
    'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'

export default function CustomizedMenus({ children, hasShadow = false }) {
    const { closeByChildren } = useSelector((state) => state.menu)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null)

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        dispatch(setAnchor())
        setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
        dispatch(setClose())
        setAnchorEl(null)
    };

    useEffect(() => {
        if (closeByChildren) {
            handleClose()
        }
    }, [closeByChildren])

    return (
        <div>
            <IconButton
                id="customized-button"
                aria-controls={open ? 'customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
            <StyledMenu
                sx={{
                    '& .MuiPaper-root': {
                        boxShadow: `${hasShadow ? shadow : "none"}`
                    }
                }}
                id="customized-menu"
                slotProps={{
                    list: {
                        'aria-labelledby': 'customized-button',
                    },
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {children}
            </StyledMenu>
        </div>
    );
}
