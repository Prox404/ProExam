
import 'animate.css';
import { Box, Button, Typography, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import home_cover from '~/assets/home_cover.svg';
import styles from './Home.module.scss';
import { useState } from 'react';

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme();

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
                            <input className={styles['code-input']} type='number' placeholder='Enter your exam code' min={100000} max={999999} />
                            <Button variant='contained' sx={{
                                borderRadius: '10px',
                                padding: '13px 26px',
                                lineHeight: '20px',
                                marginLeft: { xs: '5px' },
                                textTransform: 'none'
                            }}
                                onClick={() => { setIsOpen(true) }}
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
            sx={{
                height: 'fit-content',
                width: {
                    xs: '100%',
                    sm: '600px', 
                    md: '700px'
                },
                backgroundColor: theme.palette.cardBackground,
                borderRadius: '30px',
                position: 'fixed',
                zIndex: 0,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px 15px'
            }}
            display={isOpen ? 'block' : 'none'}>
            <Typography
                sx={{
                    fontSize: '21px',
                    color: '#364B98',
                    fontWeight: 'bold',
                    paddingLeft: '50px'
                }}
            >Input Information</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0px 30%'
                }}
                >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="name"
                    label="Name"
                    type="text"
                    id="name"

                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    id="email"
                />
                <Button
                    sx={{
                        background: 'linear-gradient(to right, #3D5AF1, #22D1EE)',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '15px',
                        marginTop: '15px'
                    }}>Enter The Exam</Button>
                <Button
                    sx={{
                        background: 'linear-gradient(to right, #3D5AF1, #22D1EE)',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '15px',
                        marginTop: '15px'
                    }}
                    onClick={() => { setIsOpen(false) }}
                >Back</Button>
            </Box>
            <Box 
            sx={{
                height: '10vh',
                width: '10vh',
                background: 'linear-gradient(to top, #3D5AF1, #22D1EE)',
                borderRadius: '50%',
                position: 'absolute',
                top: '15%',
                left: '-3%'
            }}
            ></Box>
            <Box 
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
                bottom: '-10%',
                right: '10%'
            }}
            ></Box>
        </Box>
    </>;
}

export default Home;