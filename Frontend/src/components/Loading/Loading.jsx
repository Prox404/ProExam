import { Box, CircularProgress, Typography } from '@mui/material';
import styles from './Loading.module.scss';
import { useTheme } from '@mui/material';

function Loading({ isOpen = false, ...props }) {
    const theme = useTheme();
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
        backgroundColor: theme.palette.cardBackground,
        backdropFilter: 'blur(10px)',    
        flexDirection: 'column',
        transition: ' all 0.3s',
    }} {...props}>
        <div className={styles['spinner-box']}>
            <div className={`${styles['blue-orbit']} ${styles['leo']}`}>
            </div>

            <div className={`${styles['green-orbit']} ${styles['leo']}`}>
            </div>

            <div className={`${styles['red-orbit']} ${styles['leo']}`}>
            </div>

            <div className={`${styles['white-orbit']} ${styles['w1']} ${styles['leo']}`}>
            </div><div className={`${styles['white-orbit']} ${styles['w2']} ${styles['leo']}`}>
            </div><div className={`${styles['white-orbit']} ${styles['w3']} ${styles['leo']}`}>
            </div>
        </div>
        {/* <Typography variant="h6" sx={{ color: theme.palette.textColorSecondary, fontWeight: '300' }}>Loading...</Typography> */}
    </Box>
}

export default Loading;