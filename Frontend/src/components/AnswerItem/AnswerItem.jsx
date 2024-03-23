import { Box, ToggleButton, Typography } from '@mui/material';
import styles from './AnswerItem.module.scss';
import { useTheme } from '@mui/material/styles';

function AnswerItem({ answer = '', selected = false, onChange, value, ...props }) {
    const theme = useTheme();
    return (
        <Box {...props} sx={{
            backgroundColor: theme.palette.cardSecondaryBackground,
            boxShadow: '0px 4px #00000040',
            borderRadius: '10px',
            overflow: 'hidden',
        }}>
            <ToggleButton sx={{
                border: 'none',
                width: '100%',
                padding: '15px',
                justifyContent: 'flex-start',
                textTransform: 'none',
                '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                },
                '&.Mui-selected:hover': {
                    backgroundColor: '#106cc8',
                    color: theme.palette.primary.contrastText,
                },
            }}
                selected={selected}
                value={value}
                onChange={onChange}
            >
                {answer}
            </ToggleButton>
        </Box>
    );
}

export default AnswerItem;