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
import get_started_finished from '~/assets/get_started_finished.svg'

const steps = [
    {
        title: 'No Screenshot', content: <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: {xs: '10px', md: '15px'},
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <img src={get_started_no_screenshot} alt="Get started" style={{width: '100%', maxWidth: '300px'}} />
            <Typography variant='h5' marginTop={'20px'}>
                No Screenshot 
            </Typography>
            <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
                You are not allowed to take screenshots during the exam
            </Typography>
        </Box>
    },
    { title: 'Quiet', content: <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: {xs: '10px', md: '15px'},
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <img src={get_started_no_noise} alt="Get started" style={{width: '100%', maxWidth: '300px'}} />
        <Typography variant='h5' marginTop={'20px'}>
            Stay in a quiet place
        </Typography>
        <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
            We will determine that you have cheated if there is any unusual noise during the test. So you need to be in the quietest place possible.
        </Typography>
    </Box> 
    },
    { title: "Content Copying", content: <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: {xs: '10px', md: '15px'},
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <img src={get_started_no_copy} alt="Get started" style={{width: '100%', maxWidth: '300px'}} />
        <Typography variant='h5' marginTop={'20px'}>
            Don't copy or paste content
        </Typography>
        <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
            You are not allowed to copy or paste content from the exam. If you do, we will determine that you have cheated.
        </Typography>
    </Box> 
    },
    { title: 'Alone', content: <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: {xs: '10px', md: '15px'},
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <img src={get_started_alone} alt="Get started" style={{width: '100%', maxWidth: '300px'}} />
        <Typography variant='h5' marginTop={'20px'}>
            Be alone
        </Typography>
        <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
            We need you to be alone during the test. Please adhere to it.
        </Typography>
    </Box> 
    },
    { title: 'Stay tab', content: <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: {xs: '10px', md: '15px'},
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <img src={get_started_stay_tab} alt="Get started" style={{width: '100%', maxWidth: '300px'}} />
        <Typography variant='h5' marginTop={'20px'}>
            Stay on the tab
        </Typography>
        <Typography variant='body1' marginTop={'10px'} textAlign={'center'}>
            Don't leave the tab during the test. If you do, we will determine that you have cheated.
        </Typography>
    </Box> 
    },
    { title: 'No code inspector', content: <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: {xs: '10px', md: '15px'},
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <img src={get_started_code_inspestor} alt="Get started" style={{width: '100%', maxWidth: '300px'}} />
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

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

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
                        padding: {xs: '10px', md: '15px'},
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'auto',
                        flex: '1 1 auto',
                    }}>
                        <img src={get_started_finished} alt="Get started" style={{width: '100%', maxWidth: '300px'}} />
                        <Typography sx={{
                            marginTop: '20px',
                        }} variant='h5'>
                            You are ready to take the test
                        </Typography>
                        <Button variant="contained" color="primary" sx={{marginTop: '20px'}}>Start the exam</Button>
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
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}
