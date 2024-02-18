import { Box } from "@mui/material";
import styles from './ExamLayout.module.scss';
import { useTheme } from "@emotion/react";

function ExamLayout({ children }) {
    const theme = useTheme();
    return (
        <Box sx={{
            minHeight: '100vh',
            position: 'relative',
        }}>
            <div className={styles['background']}></div>
            <Box sx={{
                height: 'calc(100vh - 40px)',
                inset: '20px',
                position: 'fixed',
                zIndex: 1,
                overflow: 'hidden',
                backgroundColor: theme.palette.cardBackground,
                borderRadius: '10px',
            }}>
                <Box sx={{
                    overflow: 'auto',
                    height: '100%',

                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

export default ExamLayout;