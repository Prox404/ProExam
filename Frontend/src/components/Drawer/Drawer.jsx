import React, { useState } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Map, MenuBook, QueryStats, Settings } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const data = [
    { name: 'Discover', icon: <Map />, link: '/discover' },
    { name: 'Library', icon: <MenuBook />, link: '/library' },
    { name: 'Report', icon: <QueryStats />, link: '/report' },
    { name: 'Settings', icon: <Settings />, link: '/settings' },
];

function Drawer() {
    const navigate = useNavigate(); // Use useNavigate hook

    const handleListItemClick = (index) => {
        navigate(data[index].link); // Navigate to the link associated with the clicked item
    };

    const [clickItem, setClickItem] = useState(-1);

    return (
        <Box sx={{
            width: 240,
            background: 'white'
        }}>
            <Divider />
            <Typography variant="h8"
                        align={"center"}
                        noWrap
                        component="div"
                        sx={{
                            display: { sm: 'block' },
                            color: 'black',
                            padding: {
                                xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                                sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                                md: '15px',
                            },
                        }}>
                Ho Anh Duong
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Button startIcon={<AddCircleOutlineIcon />} sx={{ textTransform: 'none', borderRadius: 3 }} variant="contained">Create Exam</Button>
            </Box>
            <List disablePadding sx={{
                color: 'black', marginTop: {
                    xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                    sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                    md: '15px',
                }
            }}>
                {data.map((item, index) => (
                    <ListItem key={index} sx={{
                        '&:hover': { backgroundColor: '#f4f3f7' },
                        color: index === clickItem ? '#364c98' : '#c0c0c0'
                    }}
                              onClick={() => {
                                  handleListItemClick(index); // Handle click event
                                  setClickItem(index);
                              }}>
                        <ListItemIcon sx={{ color: index === clickItem ? '#364c98' : '#c0c0c0' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
            </List>

        </Box>
    );
}

export default Drawer;
