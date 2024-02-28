
import 'animate.css';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import home_cover from '~/assets/home_cover.svg';
import styles from './Home.module.scss';

function Home() {

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
    </>;
}

export default Home;