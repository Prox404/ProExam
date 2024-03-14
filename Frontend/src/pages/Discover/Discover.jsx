
import 'animate.css';
import { Box, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import styles from "~/pages/NotFound/NotFound.module.scss";
import ListItemText from "@mui/material/ListItemText";
import literature from "~/assets/literature.svg";
import beginner from "~/assets/beginner.svg";
import math from "~/assets/subject-math.svg";
import computer from "~/assets/computer.svg";
import languague from "~/assets/languague.svg";
import history from "~/assets/history.svg";
const dataLecture = [
    { name: 'Literature', icon: literature },
    { name: 'Beginner', icon: beginner },
    { name: 'Math', icon: math },
    { name: 'Computer', icon: computer },
    { name: 'Language', icon: languague },
    { name: 'History', icon: history },
]
function Discover() {
    const theme = useTheme();
    return <>
        <Box height={'100%'} sx={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center'
        }}>
            <Typography fontSize={35} sx={{
                padding: {
                    xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                    sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                    md: '15px',
                },
                fontWeight: '500',
                color: theme.palette.textWhite
            }}>What will you teach today?</Typography>
            <Box sx={{ mt: 2, }}>
                <List disablePadding sx={{
                    color: 'black', marginTop: {
                        xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                        sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                        md: '15px',
                    }
                    , flexDirection: 'row', display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}>
                    {dataLecture.map((item, index) => (
                        <ListItem key={index}
                            cd="true"
                            sx={{
                                color: 'white', 
                                flexDirection: 'column', 
                                display: 'flex',
                                padding: {
                                    xs: '10px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                                    sm: '15px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                                },
                                width: 'auto',
                            }}
                        >
                            <img className={styles['login-cover']}
                                src={item.icon} alt='not found' style={{ width: 55, marginBottom: 5 }} />
                            <ListItemText primary={item.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    </>;
}

export default Discover;