import { Box, Typography, TextField, Autocomplete, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
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
  const [isOpenA, setIsOpenA] = useState(false);
  const [statusA, setStatusA] = useState('success');
  const [messageA, setMessageA] = useState('');
  const [randomNumber, setRandomNumber] = useState();
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
  useEffect(()=>{
    const randomFraction = Math.random();
    const randomNumber = Math.floor(randomFraction * (9999999999 - 1000000000 + 1)) + 1000000000;
    setRandomNumber(randomNumber);
  },[]);
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
          if((closeT.getTime()-openT.getTime())/60000 < Number(examTime)) {
            setStatusA('error');
            setMessageA('The Opening Time And Closing Time Do Not Match The Exam Time !');
            setIsOpenA(true);
          } else {
            setStatusA('success');
          setMessageA('Set Time Successfully !');
          setIsOpenA(true);
          }
        }
      }
    }
  }
  return (
    <>
      <Box
        className="set-time-container"
        sx={{
          width: 'fit-content',
          background: theme.palette.cardBackground,
          margin: '15vh auto 0vh auto',
          borderRadius: '30px',
          padding: '70px'
        }}
      >
        <Box
          className="exam-time"
          sx={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            marginBottom: '50px'
          }}
        >
          <Typography
            sx={{
              width: "200px",
              fontSize: '21px',
              fontWeight: 'bold'
            }}
          >Exam Time</Typography>
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.minute}
            onChange={(event, newValue) => { (newValue) ? setExamTime(newValue.minute) : setExamTime('0'); }}
            renderInput={(params) => (
              <TextField {...params}
                type="number"
                label="Minute"
                size="small"
                onChange={(event) => setExamTime(event.target.value)}
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
            marginBottom: '50px'
          }}>
          <Typography
            sx={{
              width: '200px',
              fontSize: '21px',
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
            marginBottom: '50px'
          }}>
          <Typography
            sx={{
              width: '200px',
              fontSize: '21px',
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
          gap: '200px'
        }}>
          <Typography sx={{
            fontSize: '21px',
            fontWeight: 'bold',
          }}>
            Exam Code:
          </Typography>
          <Typography sx={{
            fontSize: '25px',
            fontWeight: '500',
          }}>
            {randomNumber}
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        width: '50px',
        margin: '10px auto',
      }}>
        <Button
          onClick={onNext}
          style={{
            background: '#4285F4',
            width: '80px',
            padding: '10px 15px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '17px',
            fontWeight: '700px',
            color: '#fff',
          }}>Next</Button>
      </Box>
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