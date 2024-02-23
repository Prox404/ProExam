import * as React from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useContext, useState } from 'react';
import { ThemeContext } from '~/App';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import styles from './Header.module.scss';
import ReactModal from '~/components/Modal/ReactModal';
import login_cover from '~/assets/login_cover.svg';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Snackbar } from '@mui/material';
import * as authService from '~/services/authService';
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

        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => handleLogin(loginEmail, loginPassword)}
        >
            Sign In
        </Button>
    </Box>
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

    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRePassword, setRegisterRePassword] = useState('');

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


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
        } else {
            // console.log(res.data);
            handleShowSnackBar('Login failed', 'error');
        }
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
        theme={theme}/>


    let modalRegister = <>
        <Box sx={{
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
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
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
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Register
            </Button>
        </Box>
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
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
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
            <MenuItem>
                <Button onClick={() => handleModal('register')} sx={{ color: 'GrayText', width: '100%' }}>Register</Button>
            </MenuItem>
            <MenuItem>
                <Button onClick={() => handleModal('login')} sx={{ width: '100%' }} variant="contained">Login</Button>
            </MenuItem>
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
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: '10px' }}>
                            <Button onClick={() => handleModal('register')} sx={{ color: 'GrayText', textTransform: 'none' }}>Register</Button>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button onClick={() => handleModal('login')} sx={{ textTransform: 'none' }} variant="contained">Login</Button>
                        </Box>


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
                {/* <button className={styles['close-modal-btn']} onClick={() => setModalIsOpen(false)}>Close Modal</button> */}
            </ReactModal>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar} >
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