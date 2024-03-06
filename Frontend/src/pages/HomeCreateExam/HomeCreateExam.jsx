import 'animate.css';
import {Box, Button,  Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {Divider} from "@mui/material";
import {useState} from "react";
import {Map, MenuBook, QueryStats, Settings} from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Discover from "~/pages/Discover"
import Report from "~/pages/Report"
import { useNavigate } from "react-router-dom";
const data = [
    { name: 'Discover', icon: <Map /> ,link: '~/pages/Report'},
    { name: 'Library', icon: <MenuBook /> ,link: '~/pages/Report'},
    { name: 'Report', icon: <QueryStats />,link: '~/pages/Report' },
    { name: 'Settings', icon: <Settings />,link: '~/pages/Report' },
];

function HomeCreateExam() {
    const [clickItem,setclickItem] = useState(0);
    const [showDiscover, setShowDiscover] = useState(true);
    const [showLibrary, setShowLibrary] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const clickMenuItem = (index)=>{
        setclickItem(index);
        setShowDiscover(index === 0);
        setShowLibrary(index === 1);
        setShowReport(index === 2);
        setShowSettings(index === 3);
    }

    const theme = useTheme();
    return <>
        <Box height={'calc(100vh - var(--header-height))'} sx={{
            color: theme.palette.white,
            display:'flex',
            padding: {

            },

        }}>
            <Box height={'100%'} sx={{
                width: 240,
                backgroundColor: 'white',

            }}>
                <Divider/>
                <Typography  variant="h8"
                             align={"center"}
                             noWrap
                             component="div"
                             sx={{ display: { sm: 'block' },
                                 color:'black',
                                 padding:{
                                     xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                                     sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                                     md: '15px',
                                 },

                             }}>
                    Ho Anh Duong</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                    <Button startIcon={<AddCircleOutlineIcon/>} sx={{textTransform: 'none',borderRadius:3}} variant="contained">Create Exam</Button>
                </Box>
                <List  disablePadding sx={{color:'black',marginTop:{
                        xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                        sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                        md: '15px',
                    }}}>
                    {data.map((item, index) => (
                        <ListItem  key={index} sx={{'&:hover': { backgroundColor: '#f4f3f7' },color: index === clickItem ? '#364c98' : '#c0c0c0' }}
                                   onClick={()=>clickMenuItem(index)}>
                            <ListItemIcon sx={{color: index === clickItem ? '#364c98' : '#c0c0c0'}} >{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItem>
                    ))}
                </List>

            </Box>
            <Box sx={{
                flexGrow:1, display: 'flex',flexDirection:'column',
                padding:{
                    xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                    sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                    md: '25px',
            }
            }}>
                <Box sx={{height:'100%'}}>

                    {showDiscover && <Discover/>}
                    {showLibrary && <Discover/>}
                    {showReport && <Report />}
                    {showSettings && <Discover />}
                </Box>
            </Box>
        </Box>

    </>;
}

export default HomeCreateExam;
