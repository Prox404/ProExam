import get_started_no_screenshot from '~/assets/get_started_no_screenshot.svg'
import get_started_no_noise from '~/assets/get_started_no_noise.svg'
import get_started_no_copy from '~/assets/get_started_no_copy.svg'
import get_started_alone from '~/assets/get_started_alone.svg'
import get_started_stay_tab from '~/assets/get_started_stay_tab.svg'
import get_started_code_inspestor from '~/assets/get_started_code_inspestor.svg'
import { useState, useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import 'animate.css'
import { useTheme } from '@mui/material'

const CHEATING_RULES = [
    {
        code: '1000',
        description: 'Copy/Paste Content',
        img: get_started_no_copy
    },
    {
        code: '1001',
        description: 'Screenshot or Recording',
        img: get_started_no_screenshot
    },
    {
        code: '1002',
        description: 'Leave Exam Window',
        img: get_started_stay_tab
    },
    {
        code: '1003',
        description: 'Inspector Code',
        img: get_started_code_inspestor
    },
    {
        code: '1004',
        description: 'Noise Detected',
        img: get_started_no_noise
    },
    {
        code: '1005',
        description: 'Multiple Faces Detected',
        img: get_started_alone
    }
]

function CheatingAlert({ cheatingCode, isOpen, handleClose }) {
    const theme = useTheme()

    console.log(cheatingCode);
    const currentRule = CHEATING_RULES.find(rule => rule.code == cheatingCode)

    return (
        <>
            { (isOpen && currentRule) && (<Box sx={{
                position: 'fixed',
                top: 'calc(50% - (100vh - 40px) / 2)',
                left: 'calc(50% - (100vw - 40px) / 2)',
                height: 'calc(100vh - 40px)',
                width: 'calc(100vw - 40px)',
                padding: '20px',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden',
            }}
                className="animate__animated animate__bounceIn"
            >
    
                <Box sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} >
                    <Box>
                        <img style={{
                            width: '300px',
                            objectFit: 'contain'
    
                        }} src={currentRule.img} alt="cheating" />
                    </Box>
                    <Box sx={{
                        textAlign: 'center',
                        marginTop: '20px'
                    }}>
                        <Typography variant="h5">Cheating Alert</Typography>
                        <Typography variant="body1">{currentRule.description}</Typography>
                    </Box>
                    <Box sx={{
                        marginTop: '10px',
                        textAlign: 'center'
                    }}>
                        <Button variant='contained' onClick={handleClose}>I got it</Button>
                    </Box>
                </Box>
            </Box>
            )}
        </>
    )

 }

export default CheatingAlert;