import { Box, CircularProgress, Typography } from '@mui/material';

function Loading({isOpen = false,...props}) { 
    return <Box sx={{
        display: isOpen ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        zIndex: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backdropFilter: 'blur(10px)',
        flexDirection: 'column',
    }} {...props}>
        <CircularProgress />
        <Typography sx={{
            marginTop: '20px',
        }} variant='body1'>Loading</Typography>
    </Box>
 }

 export default Loading;