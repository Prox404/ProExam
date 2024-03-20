import { Brightness4, Close, Face, Folder, Logout, Map, Menu, MenuBook, QueryStats, Settings } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography, Menu as SidebarMenu, MenuItem } from '@mui/material';
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Add from '@mui/icons-material/Add';
import { ThemeContext } from '~/App';
import Brightness7 from '@mui/icons-material/Brightness7';


function Sidebar({ isActive = true, onActive }) {

    const listItem = [
        { name: 'Discover', icon: <Map />, link: '/discovery' },
        { name: 'Exams', icon: <MenuBook />, link: '/exams' },
        { name: 'Report', icon: <QueryStats />, link: '/report' },
        { name: 'Question bank', icon: <Folder />, link: '/question-bank' },
        { name: 'Settings', icon: <Settings />, link: '/settings' },
    ];

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }



    const renderMenu = (
        <SidebarMenu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={'primary-search-account-menu'}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={handleMenuClose}
        >
            <MenuItem sx={{
                minWidth: '150px',
            }} onClick={handleMenuClose}>
                <ListItemIcon>
                    <Face fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </SidebarMenu>
    );

    const [clickItem, setclickItem] = useState(0);
    const [user, setUser] = useState({});
    const location = window.location.href;
    const navigate = useNavigate();
    const theme = useTheme();
    const { mode, handleChange } = useContext(ThemeContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    }, []);

    useEffect(() => {
        if (location.includes('discover') || location.includes('dashboard')) {
            setclickItem(0);
        }
        else if (location.includes('exams')) {
            setclickItem(1);
        }
        else if (location.includes('report')) {
            setclickItem(2);
        }
        else if (location.includes('question-bank')) {
            setclickItem(3);
        }
        else if (location.includes('settings')) {
            setclickItem(4);
        } else {
            setclickItem(-1);
        }
    }, [location]);

    const handleClickItem = (index) => {
        setclickItem(index);
        navigate(listItem[index].link);
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    function stringAvatar(name = '') {
        return {
            sx: {
                bgcolor: '#673ab7',
                margin: 0,
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
        };
    }


    return <>
        <Box sx={{
            backgroundColor: theme.palette.cardBackground,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: {
                xs: '5px',
                sm: '10px',
            },
            // alignItems: isActive ? 'flex-start' : 'center',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    md: isActive ? 'row' : 'column',
                },
                justifyContent: {
                    xs: 'center',
                    md: isActive ? 'space-between' : 'center',
                },
                alignItems: 'center',
                width: '100%',

            }}>
                <IconButton onClick={onActive} sx={{}}>
                    {
                        isActive ?  <Close/> : <Menu />
                    }
                </IconButton>

                <IconButton color="inherit" onClick={handleChange}>
                    {mode ? <Brightness7 /> : <Brightness4/>}
                </IconButton>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Button onClick={() => navigate('/create-exam')}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '5px',
                            width: '100%',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0px 2px 0px 2px #d8d8d8',
                            },
                            padding: isActive ? '8px 16px' : '8px 0',
                            minWidth: {
                                xs: '56px',
                                md: isActive ? '56px' : '100%',
                            },
                        }} variant="contained">
                        <Add sx={{
                            marginRight: {
                                xs: '0',
                                md: isActive ? '10px' : '0',
                            }
                        }} />
                        {
                            isActive && <Typography variant='body1' sx={{
                                display: {
                                    xs: 'none',
                                    md: 'block'
                                }
                            }}>
                                Create Exam
                            </Typography>
                        }
                    </Button>
                </Box>
                <List disablePadding sx={{
                    color: 'black', marginTop: {
                        xs: '5px', // Cho thiết bị có kích thước màn hình nhỏ hơn 600px
                        sm: '10px', // Cho thiết bị có kích thước màn hình từ 600px trở lên
                        md: '15px',
                    }
                }}>
                    {listItem.map((item, index) => (
                        <ListItem key={index} sx={{
                            '&:hover': { backgroundColor: mode ? '#2b2b2b' : '#f3f3f3', cursor: 'pointer'},
                            color: index === clickItem ? '#364c98' : '#c0c0c0',
                            borderRadius: '5px',
                            padding: {
                                xs: '8px 0',
                                md: isActive ? '8px 16px' : '8px 0',
                            },
                            '& div:nth-child(1)': {
                                display: 'flex',
                                justifyContent: {
                                    xs: 'center',
                                    md: isActive ? 'flex-start' : 'center',
                                },
                                minWidth: {
                                    xs: '40px',
                                    md: isActive ? '56px' : '40px',
                                },
                                width: {
                                    xs: '100%',
                                    md: isActive ? '56px' : '100%',
                                },
                            }
                        }}
                            onClick={() => handleClickItem(index)}>
                            <ListItemIcon sx={{ color: index === clickItem ? '#364c98' : '#c0c0c0' }} >{item.icon}</ListItemIcon>
                            {
                                isActive && <ListItemText primary={item.name} sx={{
                                    display: {
                                        xs: 'none',
                                        md: 'block'
                                    },
                                }} />
                            }
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: {
                    xs: 'center',
                    md: isActive ? 'flex-start' : 'center'
                },
                alignItems: 'center',
            }}>
                <Avatar onClick={handleProfileMenuOpen}
                    {...stringAvatar(user?.userName)} />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: {
                        xs: '0',
                        md: isActive ? '10px' : '0',
                    },
                }}>
                    {
                        isActive && <>
                            <Typography variant="h8" align={"center"} noWrap component="div" sx={{
                                color: theme.palette.textBlack, display: {
                                    xs: 'none',
                                    md: 'block',
                                }
                            }}>
                                {user?.userName}
                            </Typography>
                        </>
                    }
                </Box>
            </Box>
            {renderMenu}
        </Box>
    </>
}

export default Sidebar;