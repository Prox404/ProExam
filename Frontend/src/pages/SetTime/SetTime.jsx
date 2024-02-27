import { Box, Typography, TextField, Autocomplete, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "~/services/examService";
import 'animate.css'

const SetTime = () => {
  const theme = useTheme();
  const [examTime, setExamTime] = useState('0');
  const today = new Date().getFullYear()
    + '-' +
    ((new Date().getMonth() > 8) ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1))
    + '-' + new Date().getDate();
  const now = ((new Date().getHours() > 9) ? new Date().getHours() : '0' + new Date().getHours()) + ':' + ((new Date().getMinutes() > 9) ? new Date().getMinutes() : '0' + new Date().getMinutes());
  const [openDate, setOpenDate] = useState(today);
  const [openTime, setOpenTime] = useState(now);
  const [closeDate, setCloseDate] = useState(openDate);
  const [closeTime, setCloseTime] = useState(openTime);
  const [examName, setExamName] = useState('');
  const [numberSubmit, setNumberSubmit] = useState(1);
  const [isOpenA, setIsOpenA] = useState(false);
  const [statusA, setStatusA] = useState('success');
  const [messageA, setMessageA] = useState('');
  const [randomNumber, setRandomNumber] = useState();
  const [isEditExam, setIsEditExam] = useState(true);
  const navigate = useNavigate();
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
  const onNext = () => {
    if (examName === '') {
      setStatusA('error');
      setMessageA('The Exam Name Is Not Null !');
      setIsOpenA(true);
    } else {
      if (examTime === '0' || examTime === '') {
        setStatusA('error');
        setMessageA('Exam Time Is Not Null !');
        setIsOpenA(true);
      } else {
        if (Number(examTime) < 0) {
          setStatusA('error');
          setMessageA('Exam Time Must Be Greater Than 0 !');
          setIsOpenA(true);
        } else {
          const openT = new Date(`${openDate}T${openTime}:00`);
          const closeT = new Date(`${closeDate}T${closeTime}:00`);
          if (openT >= closeT) {
            setStatusA('error');
            setMessageA('The closing Time Must Be Greater Than The Opening Time !');
            setIsOpenA(true);
          } else {
            if ((closeT.getTime() - openT.getTime()) / 60000 < Number(examTime)) {
              setStatusA('error');
              setMessageA('The Opening Time And Closing Time Do Not Match The Exam Time !');
              setIsOpenA(true);
            } else {
              if (Number(numberSubmit) < 1) {
                setStatusA('error');
                setMessageA('The Number Submit Must Be Greater Than 0 !');
                setIsOpenA(true);
              } else {
                setIsEditExam(false)
              }
            }
          }
        }
      }
    }
  }
  const onCreate = async () => {
    setStatusA('success');
    setMessageA('The Exam Has Created !');
    setIsOpenA(true);
    const openT = new Date(`${openDate}T${openTime}:00`);
    const closeT = new Date(`${closeDate}T${closeTime}:00`);
    const result = await createExam({
      examName,
      duration: Number(examTime)*60,
      examStartTime: openT,
      examEndTime: closeT,
      numberSubmit,
      keyCode: randomNumber,
      userId: "A"
    });
    console.log(result)
    return result;
  }
  return (
    <>
      {
        isEditExam && <>
          <form
            className="set-time-container animate__animated animate__backInRight"
            onSubmit={(e) => e.preventDefault() }
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
                value={options.find(option => option.minute === examTime) || null}
                getOptionLabel={(option) => option.minute}
                onChange={(event, newValue) => { (newValue) ? setExamTime(newValue.minute) : setExamTime('0')}}
                renderInput={(params) => (
                  <TextField {...params}
                    type="number"
                    label="Minute"
                    size="small"
                    onChange={(event) => {setExamTime(event.target.value)}}
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
                  width: '200px'
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
                onChange={(event) => (new Date(`${today}T${now}:00`) < new Date(`${openDate}T${event.target.value}:00`)) && setOpenTime(event.target.value)}
                sx={{
                  width: '200px'
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
                  width: '200px'
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
                  width: '200px'
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
              <TextField
                type="number"
                label="Number Submit"
                size="small"
                value={numberSubmit}
                onChange={(event) => setNumberSubmit(event.target.value)}
                sx={{
                  width: '225px',
                }}
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
        !isEditExam && <>
          <Box className="input-method-container animate__animated animate__backInRight" sx={{
            width: 'fit-content',
            background: theme.palette.cardBackground,
            margin: '7vh auto',
            borderRadius: '15px',
            padding: '30px 50px'
          }}>
            <Typography sx={{
              fontSize: '21px',
              fontWeight: '500'
            }}>Choosing Method For Inputting Questions !</Typography>
            <Button sx={{ display: 'block' }} onClick={() => setIsEditExam(true)}>
              Edit exam information
            </Button>
            <Button sx={{ display: 'block' }} onClick={async () => {const result = await onCreate(); setTimeout(()=>{navigate(`/upload-exam/${result.examId}`)},1000);}}>
              Import questions via file
            </Button>
            <Button sx={{ display: 'block' }} onClick={async () => {const result = await onCreate(); setTimeout(()=>{navigate(`/exam/uploadQuestionManually/${result.examId}`)},1000);}}>
              Import questions manually
            </Button>
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