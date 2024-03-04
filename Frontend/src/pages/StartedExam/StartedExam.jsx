import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import get_started_no_screenshot from '~/assets/get_started_no_screenshot.svg'
import get_started_no_noise from '~/assets/get_started_no_noise.svg'
import get_started_no_copy from '~/assets/get_started_no_copy.svg'
import get_started_alone from '~/assets/get_started_alone.svg'
import get_started_stay_tab from '~/assets/get_started_stay_tab.svg'
import get_started_code_inspestor from '~/assets/get_started_code_inspestor.svg'
import { useEffect, useState } from 'react';
import { isLogin } from '~/utils/authUtils';
import { useNavigate } from 'react-router-dom';
import * as examService from '~/services/examService';
import { Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';


const steps = [
    {
        title: 'No Screenshot', content: <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '10px', md: '15px' },
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <img src={get_started_no_screenshot} alt="Get started" style={{ width: '100%', maxWidth: '300px' }} />
            <Typography variant='h5' marginTop={'20px'}>
                No Screenshot
            </Typography>
            <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
                You are not allowed to take screenshots during the exam
            </Typography>
        </Box>
    },
    {
        title: 'Quiet', content: <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '10px', md: '15px' },
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <img src={get_started_no_noise} alt="Get started" style={{ width: '100%', maxWidth: '300px' }} />
            <Typography variant='h5' marginTop={'20px'}>
                Stay in a quiet place
            </Typography>
            <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
                We will determine that you have cheated if there is any unusual noise during the test. So you need to be in the quietest place possible.
            </Typography>
        </Box>
    },
    {
        title: "Content Copying", content: <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '10px', md: '15px' },
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <img src={get_started_no_copy} alt="Get started" style={{ width: '100%', maxWidth: '300px' }} />
            <Typography variant='h5' marginTop={'20px'}>
                Don&apos;t copy or paste content
            </Typography>
            <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
                You are not allowed to copy or paste content from the exam. If you do, we will determine that you have cheated.
            </Typography>
        </Box>
    },
    {
        title: 'Alone', content: <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '10px', md: '15px' },
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <img src={get_started_alone} alt="Get started" style={{ width: '100%', maxWidth: '300px' }} />
            <Typography variant='h5' marginTop={'20px'}>
                Be alone
            </Typography>
            <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
                We need you to be alone during the test. Please adhere to it.
            </Typography>
        </Box>
    },
    {
        title: 'Stay tab', content: <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '10px', md: '15px' },
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <img src={get_started_stay_tab} alt="Get started" style={{ width: '100%', maxWidth: '300px' }} />
            <Typography variant='h5' marginTop={'20px'}>
                Stay on the tab
            </Typography>
            <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
                Don&apos;t leave the tab during the test. If you do, we will determine that you have cheated.
            </Typography>
        </Box>
    },
    {
        title: 'No code inspector', content: <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '10px', md: '15px' },
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <img src={get_started_code_inspestor} alt="Get started" style={{ width: '100%', maxWidth: '300px' }} />
            <Typography variant='h5' marginTop={'20px'}>
                No code inspector
            </Typography>
            <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
                You are not allowed to use code inspector during the test. If you do, we will determine that you have cheated.
            </Typography>
        </Box>
    }

];

export default function StartedExam() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const navigate = useNavigate();
    const [examInfo, setExamInfo] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [exam, setExam] = useState({});

    useEffect(() => {
        const examInfo = JSON.parse(localStorage.getItem('examInfo'));
        if (!examInfo) {
            navigate('/')
        }
        if (!isLogin()) {
            navigate('/')
        }
        setExamInfo(JSON.parse(localStorage.getItem('examInfo')));
    }, [navigate]);

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

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = async () => {
        setLoading(true);
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        if (activeStep + 1 === steps.length) {
            if (!examInfo?.keyCode || examInfo?.keyCode < 100000 || examInfo?.keyCode > 999999) {
                handleShowSnackBar('Invalid exam code!');
                setLoading(false);
                return;
            } else {
                const res = await examService.getExam(examInfo?.keyCode);
                console.log(res);
                if (!res.status === 200) {
                    handleShowSnackBar('Invalid exam code!');
                    setLoading(false);
                    return;
                }
                if (res.data?.examStartTime > new Date()) {
                    handleShowSnackBar('The exam has not started yet!');
                    setLoading(false);
                    return;
                }

                if (res.data?.examEndTime !== null && res.data?.exam?.examEndTime < new Date()) {
                    handleShowSnackBar('The exam has ended!');
                    setLoading(false);
                    return;
                }

                setExam(res.data);
            }
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        setLoading(false);
    };

    const handleCheckPersimission = async () => {
        // checking camera and microphone permission
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        } catch (error) {
            handleShowSnackBar('You need to allow camera and microphone permission to take the test');
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleStartExam = async () => {
        setLoading(true);
        // checking camera and microphone permission
        await handleCheckPersimission();
        // start the exam here
        const examCode = examInfo?.keyCode;
        const res = await examService.takeExam(examCode, {
            userName: examInfo?.name,
            userEmail: examInfo?.email,
        });
        if (res.status === 201) {
            localStorage.setItem('exam', JSON.stringify(res));
            navigate('/take-exam');
        } else {
            handleShowSnackBar(res?.data?.message || 'Error taking the exam !');
        }
        setLoading(false);
    }

    return (
        <Box sx={{ width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Stepper sx={{
                overflow: 'auto',
                height: 'auto',
                flex: '0 0 auto',
            }} activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    {/* if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    } */}
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={step.title} {...stepProps}>
                            <StepLabel {...labelProps}>{step.title}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: { xs: '10px', md: '15px' },
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'auto',
                        flex: '1 1 auto',
                    }}>
                        {/* <img src={get_started_finished} alt="Get started" style={{ width: '100%', maxWidth: '300px' }} /> */}

                        <Table sx={{ minWidth: '300px', maxWidth: '1000px' }} aria-label="simple table">

                            <TableBody>
                                <TableRow>
                                    <TableCell align='left'>Exam Name</TableCell>
                                    <TableCell align='right'>
                                        {exam?.examName || 'None'}
                                    </TableCell>
    
                                </TableRow>
                                <TableRow>
                                    <TableCell align='left'>Start Date</TableCell>
                                    <TableCell align='right'>{exam?.examStartTime || 'None'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='left'>End Date</TableCell>
                                    <TableCell align='right'>{exam?.examEndTime || 'None'}</TableCell>
    
                                </TableRow>
                                <TableRow>
                                    <TableCell align='left'>Duration</TableCell>
                                    <TableCell align='right'>{exam?.duration || 'Infinity'}</TableCell>
    
                                </TableRow>
                                <TableRow>
                                    <TableCell align='left'>Number Submit</TableCell>
                                    <TableCell align='right'>{exam?.numberSubmit || 'Infinity'}</TableCell>
                                </TableRow>
                            </TableBody>


                            {/* <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            </TableRow> */}

                        </Table>
                        <Typography sx={{
                            marginTop: '20px',
                        }} variant='h5'>
                            You are ready to take the test
                        </Typography>
                        <LoadingButton loading={loading} onClick={handleStartExam} variant="contained" color="primary" sx={{ marginTop: '20px' }}>Start the exam</LoadingButton>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Box sx={{
                        flexGrow: '1',
                    }}>{steps[activeStep].content}</Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {/* {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )} */}

                        <LoadingButton loading={loading} onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </LoadingButton>
                    </Box>
                </React.Fragment>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar} >
                <Alert
                    onClose={handleCloseSnackBar}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {content ? content : 'Error'}
                </Alert>
            </Snackbar>
        </Box>
    );
}
