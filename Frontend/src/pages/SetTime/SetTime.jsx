import { Box, Typography, TextField, Autocomplete, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "~/services/examService";
import { useContext } from "react";
import { ThemeContext } from '~/App';
import { format, set } from 'date-fns';
import 'animate.css'
import { Add, ArrowBack, FileUpload, Folder } from "@mui/icons-material";

const SetTime = () => {
    const theme = useTheme();
    const [examTime, setExamTime] = useState('0');
    const today = new Date().getFullYear()
        + '-' +
        ((new Date().getMonth() > 8) ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1))
        + '-' + ((new Date().getDate() > 9) ? (new Date().getDate()) : '0' + (new Date().getDate()));
    const now = ((new Date().getHours() > 9) ? new Date().getHours() : '0' + new Date().getHours()) + ':' + ((new Date().getMinutes() > 9) ? new Date().getMinutes() : '0' + new Date().getMinutes());
    const [openDate, setOpenDate] = useState(today);
    const [openTime, setOpenTime] = useState(now);
    const [closeDate, setCloseDate] = useState(openDate);
    const [closeTime, setCloseTime] = useState(openTime);
    const [examName, setExamName] = useState('');
    const [numberSubmit, setNumberSubmit] = useState('1');
    const [isOpenA, setIsOpenA] = useState(false);
    const [statusA, setStatusA] = useState('success');
    const [messageA, setMessageA] = useState('');
    const [randomNumber, setRandomNumber] = useState();
    const [isEditExam, setIsEditExam] = useState(true);
    const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('user'))?.userId);
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('user'))) {
            navigate('/');
        }
    }, []);
    useEffect(() => {
        if (Number(examTime) >= 0) {
            const openD = new Date(`${openDate}T${openTime}:00`);
            const closeD = new Date(`${closeDate}T${closeTime}:00`);
            const newCloseD = new Date(openD.setMinutes(openD.getMinutes() + Number(examTime)));
            if (closeD <= newCloseD) {
                setCloseTime(`${(newCloseD.getHours() > 9) ? newCloseD.getHours() : '0' + newCloseD.getHours()}:${(newCloseD.getMinutes() > 9) ? newCloseD.getMinutes() : '0' + newCloseD.getMinutes()}`)
            }
        }
    }, [examTime]);
    useEffect(() => {
        const randomFraction = Math.random();
        const randomNumber = Math.floor(randomFraction * (999999 - 100000 + 1)) + 100000;
        setRandomNumber(randomNumber);
    }, []);
    const options = [
        {
            label: '5 Minutes',
            minute: '5'
        },
        {
            label: '10 Minutes',
            minute: '10'
        },
        {
            label: '15 Minutes',
            minute: '15'
        },
        {
            label: '20 Minutes',
            minute: '20'
        },
        {
            label: '30 Minutes',
            minute: '30'
        },
        {
            label: '45 Minutes',
            minute: '45'
        },
        {
            label: '60 Minutes',
            minute: '60'
        },
        {
            label: '90 Minutes',
            minute: '90'
        },
        {
            label: '120 Minutes',
            minute: '120'
        },
        {
            label: 'Unlimited Minutes',
            minute: '00000'
        }
    ];

    const submitOptions = [
        { label: 'Unlimited', times: '0000' }
    ];

    const showAlert = (status, message) => {
        setStatusA(status);
        setMessageA(message);
        setIsOpenA(true);
    };

    const onNext = () => {
        if (examName === '') {
            showAlert('error', 'The Exam Name Is Not Null !');
            return;
        }

        if (examTime === '0' || examTime === '') {
            showAlert('error', 'Exam Time Is Not Null !');
            return;
        }

        if (Number(examTime) < 0) {
            showAlert('error', 'Exam Time Must Be Greater Than 0 !');
            return;
        }

        const openT = new Date(`${openDate}T${openTime}:00`);
        const closeT = new Date(`${closeDate}T${closeTime}:00`);

        if (openT >= closeT) {
            showAlert('error', 'The closing Time Must Be Greater Than The Opening Time !');
            return;
        }

        if ((closeT.getTime() - openT.getTime()) / 60000 < Number(examTime)) {
            showAlert('error', 'The Opening Time And Closing Time Do Not Match The Exam Time !');
            return;
        }

        if (Number(numberSubmit) < 0) {
            showAlert('error', 'The Number Submit Must Be Greater Than 0 !');
            return;
        }

        // Xử lý khi tất cả điều kiện đều hợp lệ
        const form = document.getElementsByClassName('set-time-container')[0];
        form.classList.remove('animate__backInLeft');
        form.classList.add('animate__backOutLeft');
        setTimeout(() => {
            setIsEditExam(false);
        }, 500);
    };

    const onBack = () => {
        const inputMethod = document.getElementsByClassName('input-method-container')[0];
        inputMethod.classList.remove('animate__backInRight');
        inputMethod.classList.add('animate__backOutRight');
        setTimeout(() => {
            setIsEditExam(true);
        }, 500);
    }
    const onCreate = async () => {
        const openT = `${openDate} ${openTime}:00`;
        const closeT = `${closeDate} ${closeTime}:00`;
        const result = await createExam({
            examName,
            duration: Number(examTime) * 60,
            examStartTime: format(new Date(openT), 'dd/MM/yyyy HH:mm:ss'),
            examEndTime: format(new Date(closeT), 'dd/MM/yyyy HH:mm:ss'),
            numberSubmit,
            keyCode: randomNumber,
            userId
        });
        return result;
    }


    const handleNavigate = async (action) => {
        const res = await onCreate();
        if (res?.examId) {
            setStatusA('success');
            setMessageA('The Exam Has Created !');
            setIsOpenA(true);
            setTimeout(() => {
                navigate(`/${action}/${res.examId}`)
            }, 1000);
        } else {
            setStatusA('error');
            setMessageA('Exam create failed !');
            setIsOpenA(true);
        }
    }

    return (
        <>
            {
                isEditExam && <>
                    <form
                        className="set-time-container animate__animated animate__backInLeft"
                        onSubmit={(e) => e.preventDefault()}
                        style={{
                            display: 'block',
                            width: 'fit-content',
                            background: theme.palette.cardBackground,
                            margin: '7vh auto',
                            borderRadius: '15px',
                            padding: '20px 25px'
                        }}
                    >
                        <Typography sx={{
                            fontSize: '21px',
                            fontWeight: '500',
                            textAlign: 'center',
                            marginBottom: '15px'
                        }}>Enter exam's information</Typography>
                        <Box sx={{
                            marginBottom: '30px'
                        }}>
                            <TextField
                                type="text"
                                label="Exam Name"
                                value={examName}
                                onChange={(event) => setExamName(event.target.value)}
                                sx={{
                                    width: '100%',
                                    '& input': {
                                        textAlign: 'center'
                                    }
                                }}
                            />

                        </Box>
                        <Box
                            className="exam-time"
                            sx={{
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'center',
                                marginBottom: '30px'
                            }}
                        >
                            <Typography
                                sx={{
                                    width: "200px",
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}
                            >Exam Time</Typography>
                            <Autocomplete
                                freeSolo
                                options={options}
                                value={options.find(option => option.minute === examTime) || { label: '', minute: examTime }}
                                getOptionLabel={(option) => option.minute}
                                onChange={(event, newValue) => { (newValue) ? setExamTime(newValue.minute) : setExamTime('0') }}
                                renderInput={(params) => (
                                    <TextField {...params}
                                        type="number"
                                        label="Minute"
                                        size="small"
                                        value={examTime}
                                        onChange={(event) => { Number(event.target.value) >= 0 ? setExamTime(event.target.value) : setExamTime('-1') }}
                                        sx={{
                                            width: '200px'
                                        }} />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.label}
                                    </Box>
                                )}
                            />
                        </Box>
                        <Box
                            className="open-time"
                            sx={{
                                display: 'flex',
                                gap: '15px',
                                marginBottom: '30px'
                            }}>
                            <Typography
                                sx={{
                                    width: '200px',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>Open Exam On</Typography>
                            <TextField
                                type="date"
                                label="Select Start Date"
                                size="small"
                                value={openDate}
                                onChange={(event) => (new Date(today) <= new Date(event.target.value)) && setOpenDate(event.target.value)}
                                sx={{
                                    width: '200px',
                                    '& input::-webkit-calendar-picker-indicator': {
                                        filter: mode ? 'invert(1)' : 'none'
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}

                            />
                            <TextField
                                type="time"
                                label="Select Start Time"
                                size="small"
                                value={openTime}
                                onChange={(event) => (new Date(`${today} ${now}:00`) <= new Date(`${openDate} ${event.target.value}:00`)) && setOpenTime(event.target.value)}
                                sx={{
                                    width: '200px',
                                    '& input::-webkit-calendar-picker-indicator': {
                                        filter: mode ? 'invert(1)' : 'none'
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300,
                                }}
                            />
                        </Box>
                        <Box
                            className="close-time"
                            sx={{
                                display: 'flex',
                                gap: '15px',
                                marginBottom: '30px'
                            }}>
                            <Typography
                                sx={{
                                    width: '200px',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>Close Exam On</Typography>
                            <TextField
                                type="date"
                                label="Select End Date"
                                size="small"
                                value={closeDate}
                                onChange={(event) => (new Date(openDate) <= new Date(event.target.value)) && setCloseDate(event.target.value)}
                                sx={{
                                    width: '200px',
                                    '& input::-webkit-calendar-picker-indicator': {
                                        filter: mode ? 'invert(1)' : 'none'
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                type="time"
                                label="Select End Time"
                                size="small"
                                value={closeTime}
                                onChange={(event) => (new Date(`${openDate}T${openTime}:00`) < new Date(`${closeDate}T${event.target.value}:00`)) && setCloseTime(event.target.value)}
                                sx={{
                                    width: '200px',
                                    '& input::-webkit-calendar-picker-indicator': {
                                        filter: mode ? 'invert(1)' : 'none'
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300,
                                }}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: '15px',
                            marginBottom: '30px'
                        }}>
                            <Typography sx={{
                                fontSize: '17px',
                                fontWeight: 'bold',
                                width: '200px'
                            }}>
                                Number Submit:
                            </Typography>
                            <Autocomplete
                                freeSolo
                                options={submitOptions}
                                value={submitOptions.find(option => option.times === numberSubmit) || { label: '', times: numberSubmit }}
                                getOptionLabel={(option) => option.times}
                                onChange={(event, newValue) => { (newValue) ? setNumberSubmit(newValue.times) : setNumberSubmit('1') }}
                                renderInput={(params) => (
                                    <TextField {...params}
                                        label="Number Submit"
                                        type="number"
                                        size="small"
                                        onChange={(event) => { setNumberSubmit(event.target.value) }}
                                        sx={{
                                            width: '225px',
                                            '& .MuiInputBase-root': {
                                                height: '40px'
                                            },
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.label}
                                    </Box>
                                )}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: '15px',
                        }}>
                            <Typography sx={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                width: '200px'
                            }}>
                                Exam Code:
                            </Typography>
                            <Typography sx={{
                                fontSize: '25px',
                                fontWeight: '500',
                                width: '200px'
                            }}>
                                {randomNumber}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '30px'
                        }}>
                            <Button
                                onClick={onNext}
                                type="submit"
                                style={{
                                    background: '#4285F4',
                                    width: '200px',
                                    padding: '7px 14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '17px',
                                    fontWeight: '700px',
                                    color: '#fff',
                                    textTransform: 'none',
                                }} size="small">Next</Button>
                        </Box>
                    </form>
                </>
            }
            {
                !isEditExam && 
                <>
                    <Box className="input-method-container animate__animated animate__backInRight" sx={{
                        width: 'fit-content',
                        background: theme.palette.cardBackground,
                        margin: '7vh auto',
                        borderRadius: '15px',
                        padding: '20px 30px',
                        minWidth: {
                            xs: '300px',
                            sm: '500px',
                            lg: '700px',
                        }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <Button sx={{ display: 'flex', alignItems: 'center' }} onClick={onBack}>
                                <ArrowBack fontSize="small"/>
                            </Button>
                            <Typography sx={{
                                fontSize: '21px',
                                fontWeight: '500'
                            }}>Choosing Method !</Typography>

                        </Box>

                        <Box display={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            justifyContent: 'center',
                        }}>
                            <Button sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'none',
                                padding: '10px 20px',
                                backgroundColor: theme.palette.cardSecondaryBackground,
                                '&:hover': {
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }
                            }}
                                onClick={() => handleNavigate('upload-question')}>
                                <FileUpload />
                                Import questions via file
                            </Button>
                            <Button sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'none',
                                padding: '10px 20px',
                                backgroundColor: theme.palette.cardSecondaryBackground,
                                '&:hover': {
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }
                            }}
                                onClick={() => handleNavigate('add-question')}>
                                <Add />
                                Add questions manually
                            </Button>
                            <Button sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'none',
                                padding: '10px 20px',
                                backgroundColor: theme.palette.cardSecondaryBackground,
                                '&:hover': {
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }
                            }}
                                onClick={() => handleNavigate('select-from-bank')}>
                                <Folder />
                                Select from question bank
                            </Button>
                        </Box>
                    </Box>
                </>
            }
            <Snackbar open={isOpenA} autoHideDuration={6000} onClose={(event, reason) => { if (reason === 'clickaway') { setIsOpenA(false) } }}>
                <Alert
                    severity={statusA}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {messageA}
                </Alert>
            </Snackbar>

        </>
    );
}
export default SetTime;