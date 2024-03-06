import React from 'react'
import { Box, Button, Typography } from '@mui/material';
import Header from '../../components/Header';

const ThangDzvcl = () => {
    const randomFraction = Math.random();
    const randomNumber = Math.floor(randomFraction * (9999999999 - 1000000000 + 1)) + 1000000000;
    return (
        <Box sx={{
            // height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - var(--header-height))',
        }}>
            <Box>
                <Box className="title">
                    <Typography sx={{
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: '10px'
                    }}>
                        Exam Code!
                    </Typography>
                </Box>
                <Box className="examCode" sx={{
                    width: '600px',
                    height: '140px',
                    background: '#22D1EE',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '20px',
                }}>
                    <Typography className="numberExamCode" sx={{
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: '#E05151',

                    }}>
                        {randomNumber}
                    </Typography>
                </Box>
                <Box className="buttonBack" marginTop={'40px'} display={'flex'} justifyContent={'end'}>
                    <Button className="buttonBack" sx={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#fff',
                        background: 'linear-gradient(to right, #22D1EE, #5451E0)',
                        width: '300px',
                        height: '60px',
                        borderRadius: '10px',
                    }}>
                        Go Back Home
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ThangDzvcl