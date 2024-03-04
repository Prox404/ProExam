
import 'animate.css';
import { Box, Button, Typography, TextField, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import home_cover from '~/assets/home_cover.svg';
import styles from './Home.module.scss';
import { useState } from 'react';
import 'animate.css';
import * as examService from '~/services/examService';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme();
    const [keyCode, setKeyCode] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const handleShowSnackBar = (content) => {
        setContent(content);
        setSnackbarOpen(true);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };


    const handleStart = async () => {
        console.log(keyCode);
        if (!keyCode || keyCode < 100000 || keyCode > 999999) {
            handleShowSnackBar('Please input valid exam code!');
        } else {
            const res = await examService.isValidKeyCode(keyCode);
            console.log(res);
            if (res.status === 200) {
                setIsOpen(true);
            } else {
                handleShowSnackBar('Invalid exam code!');
            }
        }
    }

    const handleEnterExam = async () => {
        if (!name || !email || !emailRegex.test(email)) {
            handleShowSnackBar('Please input valid name and email!');
        } else {
            const examInfo = {
                name: name,
                email: email,
                keyCode: keyCode,
            };
            await localStorage.setItem('examInfo', JSON.stringify(examInfo));
            navigate('/started-exam');
        }
    }

    return <>

        <Box height={'calc(100vh - var(--header-height))'} sx={{
            color: theme.palette.white,
            padding: {
                xs: '10px',
                sm: '20px',
                md: '40px',
            }
        }}>
            <Grid container height={'100%'} spacing={0}>
                    <Grid height={'100%'} item xs={12} sm={7}>
                    <Item className='animate__animated animate__zoomIn' sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: {
                            sm: 'calc(100% - var(--header-height))',
                            xs: '100%',
                        },
                    }} >
                        <Typography sx={{
                            textAlign: {
                                xs: 'center',
                                sm: 'left',
                            },
                            fontSize: { xs: '3rem', sm: '4rem' },
                        }} variant='h2' fontWeight={'600'}>Enter your <br />
                            exam code !</Typography>
                        <Box sx={{
                            marginTop: '40px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: {
                                xs: 'center',
                                sm: 'flex-start',
                            },
                        }} >
                            <input
                                className={styles['code-input']}
                                onChange={(e) => setKeyCode(e.target.value)}
                                type='number'
                                placeholder='Enter your exam code'
                                min={100000} max={999999} />
                            <Button variant='contained' sx={{
                                borderRadius: '10px',
                                padding: '13px 26px',
                                lineHeight: '20px',
                                marginLeft: { xs: '5px' },
                                textTransform: 'none'
                            }}
                                onClick={handleStart}
                            >
                                Start
                            </Button>
                        </Box>
                    </Item>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Item sx={{
                        display: {
                            xs: 'none',
                            sm: 'flex',
                        },
                        textAlign: 'center',
                        height: 'calc(100% - var(--header-height))',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <img className={`${styles['cover-image']} animate__animated animate__zoomIn`} src={home_cover} alt='home_cover' />
                    </Item>
                </Grid>
            </Grid>
        </Box>
        <Box
            className='animate__animated animate__fadeIn'
            sx={{
                height: 'fit-content',
                minHeight: '40vh',
                width: {
                    xs: '95%',
                    sm: '500px',
                    md: '500px'
                },
                backgroundColor: theme.palette.cardBackground,
                borderRadius: '20px',
                animationDuration: '0.3s',
                position: 'fixed',
                zIndex: 0,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px 15px',
                flexDirection: 'column',
            }}

            display={isOpen ? 'flex' : 'none'}>
            <Typography
                sx={{
                    fontSize: '21px',
                    color: '#364B98',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingLeft: {
                        xs: '0px',
                        sm: '0'
                    }
                }}
            >Input Information</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: {
                        xs: '15px',
                        sm: '0px 20%'
                    },
                    justifyContent: 'center',
                    flex: 1,
                }}
            >
                <Box>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        label="Name"
                        type="text"
                        id="name"
                        size='small'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        id="email"
                        size='small'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '20px',
                }}>
                    <Button
                        sx={{
                            background: 'linear-gradient(to right, #3D5AF1, #22D1EE)',
                            color: '#fff',
                            padding: '7px 10px',
                            borderRadius: '10px',
                            marginTop: '20px',
                            textTransform: 'none'
                        }}
                        size='small'
                        onClick={handleEnterExam}
                    >Enter The Exam
                    </Button>
                    <Button
                        sx={{
                            background: 'linear-gradient(to right, #3D5AF1, #22D1EE)',
                            color: '#fff',
                            padding: '7px 10px',
                            borderRadius: '10px',
                            marginTop: '15px',
                            textTransform: 'none'
                        }}
                        onClick={() => { setIsOpen(false) }}
                        size='small'
                    >Back</Button>
                </Box>
            </Box>
            <Box
                className='animate__animated animate__fadeInUp'
                sx={{
                    height: '10vh',
                    width: '10vh',
                    background: 'linear-gradient(to top, #3D5AF1, #22D1EE)',
                    borderRadius: '50%',
                    position: 'absolute',
                    animationDelay: '0.3s',
                    animationDuration: '0.3s',
                    top: {
                        xs: '-15%',
                        sm: '15%'

                    },
                    left: {
                        xs: '3%',
                        sm: '-5%',

                    }
                }}
            ></Box>
            <Box
                className='animate__animated animate__fadeInUp'
                sx={{
                    height: {
                        xs: '60px',
                        sm: '70px',
                        md: '90px'
                    },
                    width: {
                        xs: '60px',
                        sm: '70px',
                        md: '90px'
                    },
                    background: 'linear-gradient(to top, #3D5AF1, #22D1EE)',
                    borderRadius: '50%',
                    position: 'absolute',
                    animationDelay: '0.2s',
                    animationDuration: '0.3s',
                    bottom: {
                        xs: '-13%',
                        sm: '-15%'
                    },
                    right: '3%'
                }}
            ></Box>
        </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar} >
            <Alert
                onClose={handleCloseSnackBar}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {content ? content : 'Invalid input'}
            </Alert>
        </Snackbar>
    </>;
}

export default Home;