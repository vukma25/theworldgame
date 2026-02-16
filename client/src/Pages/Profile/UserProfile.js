import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import LeftPart from './UserProfile/Left'
import RightPart from './UserProfile/Right'


const UserProfile = () => {
    const { is_me } = useSelector((state) => state.profile)

    const navigate = useNavigate()

    console.log("Ok")
    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <IconButton
                sx={{ mb: "1rem" }}
                onClick={() => navigate(-1)}
            >
                <ArrowBack sx={{ fontSize: "2rem" }} />
            </IconButton>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <LeftPart />
                </Grid>

                {is_me && <Grid size={{ xs: 12, md: 8 }}>
                    <RightPart />
                </Grid>}
            </Grid>
        </Container>
    );
};

export default UserProfile;