import * as React from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '~/App';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import styles from './Header.module.scss';
import ReactModal from '~/components/Modal/ReactModal';
import login_cover from '~/assets/login_cover.svg';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Snackbar, Avatar } from '@mui/material';
import * as authService from '~/services/authService';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    TextField,
    InputBase,
    Button,
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    MenuItem,
    Menu,
    useTheme
} from '@mui/material';
import * as validate from '~/utils/validateData';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    background: '#bbbbbb2b',
    '&:hover': {
        background: '#bbbbbb42',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',

    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },

}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function Login({ handleLogin, theme }) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        await handleLogin(loginEmail, loginPassword);
        setIsLoading(false);
    }

    return <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    }}>
        <img className={styles['login-cover']} src={login_cover} alt="login_cover" />
        <Typography sx={{
            fontWeight: '500', color: {
                light: theme.palette.textBlack,
                dark: theme.palette.textWhite,
            },
            marginTop: '20px',
        }} variant='h5'>Welcome to ProExam</Typography>
        <form onSubmit={(e) => e.preventDefault()}>


            <TextField
                margin="normal"
                required
                fullWidth
                id="loginEmail"
                label="Email Address"
                name="loginEmail"
                autoComplete="email"
                autoFocus
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="loginPassword"
                label="Password"
                type="password"
                id="loginPassword"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
            />

            <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                loading={isLoading}
            >
                Sign In
            </LoadingButton>
        </form>
    </Box>
}

function Register({ handleRegister, theme }) {

    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRePassword, setRegisterRePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true); // Đặt trạng thái loading là true khi bắt đầu gửi request
        await handleRegister(registerName, registerEmail, registerPassword, registerRePassword);
        setIsLoading(false); // Đặt trạng thái loading là false sau khi nhận được kết quả từ request
    };

    return <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    }}>
        <img className={styles['login-cover']} src={login_cover} alt="login_cover" />
        <form onSubmit={(e) => e.preventDefault()}>

            <Typography sx={{
                fontWeight: '500', color: {
                    light: theme.palette.textBlack,
                    dark: theme.palette.textWhite,
                },
                marginTop: '20px',
            }} variant='h5'>Welcome to ProExam</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="registerName"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="registerEmail"
                type='email'
                label="Email Address"
                name="registerEmail"
                autoComplete="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="rePassword"
                label="Re-Password"
                type="password"
                id="rePassword"
                autoComplete="current-password"
                value={registerRePassword}
                onChange={(e) => setRegisterRePassword(e.target.value)}
            />

            <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}

                loading={isLoading}
            >
                Register
            </LoadingButton>
        </form>
    </Box>;

}

export default function Header({ ...props }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const { mode, handleChange } = useContext(ThemeContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modal, setModal] = useState(<></>);
    const theme = useTheme();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [content, setContent] = useState('');
    const [severity, setSeverity] = useState('error');
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});


    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsLogin(true);
            setUser(user);
        }
    }, [isLogin]);


    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogin = async (loginEmail, loginPassword) => {
        if (!validate.validateEmail(loginEmail)) {
            handleShowSnackBar('Please enter a valid email address', 'warning');
            return;
        }
        if (!validate.validatePassword(loginPassword)) {
            handleShowSnackBar('Please enter a valid password', 'warning');
            return;
        }
        const res = await authService.login({
            email: loginEmail,
            password: loginPassword
        })

        console.log(res);

        if (res.status === 200) {
            handleShowSnackBar('Login successfully', 'success');
            localStorage.setItem('user', JSON.stringify(res.data));
            setIsLogin(true);
            setUser(res.data);
            setModalIsOpen(false);
        } else {
            // console.log(res.data);
            handleShowSnackBar('Login failed', 'error');
        }
    }

    const handleRegister = async (registerName, registerEmail, registerPassword, registerRePassword) => {
        if (!registerName
            || !registerEmail
            || !registerPassword
            || !registerRePassword) {
            handleShowSnackBar('Please enter all fields', 'warning');
            return;
        }
        if (!validate.validateEmail(registerEmail)) {
            handleShowSnackBar('Please enter a valid email address', 'warning');
            return;
        }

        if (!validate.validatePassword(registerPassword)) {
            handleShowSnackBar('Password must contain at least 8 characters, 1 letter, 1 number and 1 special character', 'warning');
            return;
        }

        if (registerPassword !== registerRePassword) {
            handleShowSnackBar('Password and Re-Password are not matched', 'warning');
            return;
        }

        const res = await authService.register({
            email: registerEmail,
            password: registerPassword,
            userName: registerName
        })

        console.log(res);

        if (res?.status && res.status === 200) {
            handleShowSnackBar('Register successfully', 'success');
            setModalIsOpen(false);
        } else {
            handleShowSnackBar(res?.message ? res.message : 'Register failed', 'error');
        }

    }

    function handleLogout() {
        localStorage.removeItem('user');
        setIsLogin(false);
        setUser({});
        handleMenuClose();
    }


    const handleShowSnackBar = (content, severity) => {
        setContent(content);
        setSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    let modalLogin = <Login handleLogin={handleLogin}
        theme={theme} />


    let modalRegister = <>
        <Register handleRegister={handleRegister} theme={theme} />
    </>


    const handleModal = (modalName) => {
        setModalIsOpen(true);
        switch (modalName) {
            case 'login':
                setModal(modalLogin);
                break;
            case 'register':
                setModal(modalRegister);
                break;
            default:
                setModal(modalLogin);
                break;
        }
        handleMenuClose();
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: '#673ab7',
                margin: {
                    xs: '0 10px 0 0',
                    sm: '0 0 0 10px'
                },
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            {
                !isLogin && <>
                    <MenuItem>
                        <Button onClick={() => handleModal('register')} sx={{ color: 'GrayText', width: '100%' }}>Register</Button>
                    </MenuItem>
                    <MenuItem>
                        <Button onClick={() => handleModal('login')} sx={{ width: '100%' }} variant="contained">Login</Button>
                    </MenuItem>
                </>
            }

            <MenuItem onClick={handleChange}>
                <IconButton sx={{ ml: 1 }} color="inherit">
                    {mode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <p>
                    {mode ? 'Light' : 'Dark'} Mode
                </p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box {...props} sx={{ flexGrow: 1 }}>
                <AppBar color="default" elevation={0} position="static" sx={{
                    backgroundColor: mode ? '#333' : '#fff',
                }}>
                    <Toolbar>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { sm: 'block' } }}
                        >
                            Pro Exam
                        </Typography>
                        <Search sx={{
                            display: {
                                xs: 'none',
                                sm: 'flex',
                            }
                        }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton sx={{ ml: 1 }} onClick={handleChange} color="inherit">
                                {mode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Box>
                        {
                            isLogin && user ? <>
                                <Avatar aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    {...stringAvatar(user?.userName)}
                                />
                            </> : <>
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: '10px' }}>
                                    <Button onClick={() => handleModal('register')} sx={{ color: 'GrayText', textTransform: 'none' }}>Register</Button>
                                </Box>
                                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                    <Button onClick={() => handleModal('login')} sx={{ textTransform: 'none' }} variant="contained">Login</Button>
                                </Box>
                            </>
                        }



                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                {renderMenu}
            </Box>
            <ReactModal
                isOpen={modalIsOpen}
                size='md'
                onRequestClose={() => setModalIsOpen(false)}
            >
                {modal}
                <IconButton sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: theme.palette.textBlack,

                }} onClick={() => setModalIsOpen(false)}><CloseIcon /></IconButton>
            </ReactModal>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackBar} >
                <Alert
                    onClose={handleCloseSnackBar}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {content ? content : 'Invalid input'}
                </Alert>
            </Snackbar>
        </>
    );
}