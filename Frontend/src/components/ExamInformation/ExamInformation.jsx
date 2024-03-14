import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import {
    Box,
    TextField,
    Typography,
    Autocomplete
} from "@mui/material";

// eslint-disable-next-line react/display-name
const ExamInformation = forwardRef(({ timeOfExam: time }, ref) => {

    const [examName, setExamName] = useState('');
    const [duration, setDuration] = useState('');
    const [openDate, setOpenDate] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeDate, setCloseDate] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [numberSubmit, setNumberSubmit] = useState('');
    useEffect(() => {
        setDuration(time.duration + '');
        setExamName(time.examName);
        setOpenDate(time.openDate);
        setOpenTime(time.openTime);
        setCloseDate(time.closeDate);
        setCloseTime(time.closeTime);
        setNumberSubmit(time.numberSubmit);
    }, [time])
    useImperativeHandle(ref, () => ({
        getData: () => {
            return {
                examName,
                duration,
                openDate,
                openTime,
                closeDate,
                closeTime,
                numberSubmit,
                keyCode: time.examCode,
                isPublic: time.isPublic
            };
        },
    }));
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
    const today = new Date().getFullYear()
        + '-' +
        ((new Date().getMonth() > 8) ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1))
        + '-' + ((new Date().getDate() > 9) ? (new Date().getDate()) : '0' + (new Date().getDate()));
    const now = ((new Date().getHours() > 9) ? new Date().getHours() : '0' + new Date().getHours()) + ':' + ((new Date().getMinutes() > 9) ? new Date().getMinutes() : '0' + new Date().getMinutes());

    return (
        <>
            <Typography sx={{
                fontSize: '21px',
                fontWeight: '500',
                textAlign: 'center',
                marginBottom: '15px'
            }}>
                Set Exam Time
            </Typography>


            <TextField
                type="text"
                label="Exam Name"
                size='small'
                value={examName}
                onChange={(e) => {
                    setExamName(e.target.value)
                }}
                sx={{
                    width: '80%',
                    '& input': {
                        textAlign: 'center'
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Autocomplete
                freeSolo sx={{
                    width: '80%',
                }}

                options={options}
                value={options.find(option => option.minute === duration) || { label: duration + 'minutes', minute: duration }}

                getOptionLabel={(option) => option.minute}
                onChange={(e, newValue) => { (newValue) ? setDuration(newValue.minute) : setDuration('0') }}
                renderInput={(params) => (
                    <TextField {...params}
                        type="number"
                        label="Minute"
                        size="small"
                        // value={'123'}
                        onChange={(e) => { setDuration(e.target.value) }}
                        sx={{
                            '& input': {
                                textAlign: 'center',
                                marginLeft: '28px',
                            }
                        }} />
                )}
                renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        {option.label}
                    </Box>
                )}
            />
            <TextField
                type="date"
                label="Select Start Date"
                size='small'
                value={openDate}
                onChange={(e) => (new Date(today) <= new Date(e.target.value)) && setOpenDate(e.target.value)}
                sx={{
                    width: '80%',
                    '& input': {
                        textAlign: 'center',
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                type='time'
                label='Select Start Time'
                size='small'
                value={openTime}
                onChange={(event) => (new Date(`${today}T${now}:00`) < new Date(`${openDate}T${event.target.value}:00`)) && setOpenTime(event.target.value)}
                sx={{
                    width: '80%',
                    '& input': {
                        textAlign: 'center',
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }} />

            <TextField
                type="date"
                label="Select Close Date"
                size='small'
                value={closeDate}
                onChange={(event) => (new Date(openDate) <= new Date(event.target.value)) && setCloseDate(event.target.value)}
                sx={{
                    width: '80%',
                    '& input': {
                        textAlign: 'center'
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                type='time'
                label='Select Close Time'
                size='small'
                value={closeTime}
                onChange={(event) => (new Date(`${openDate}T${openTime}:00`) < new Date(`${closeDate}T${event.target.value}:00`)) && setCloseTime(event.target.value)}
                sx={{
                    width: '80%',
                    '& input': {
                        textAlign: 'center'
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }} />
            <TextField
                type="number"
                label="Number Submit"
                size="small"
                value={numberSubmit}
                onChange={(event) => setNumberSubmit(event.target.value)}
                sx={{
                    width: '80%',
                    '& input': {
                        textAlign: 'center',
                        minWidth: {
                            xs: '100px !important'
                        }
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Box sx={{
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                gap: '10%',
                alignItems: 'center'
            }}>
                <Typography sx={{
                    marginLeft: '5px',
                    color: '#00000099'
                }}>
                    Exam Code:
                </Typography>
                <Typography sx={{
                    fontSize: '30px'
                }}>
                    {time.examCode}
                </Typography>
            </Box>
        </>
    )
})

export default ExamInformation