import React from 'react'
import {
  Autocomplete,
  Box, IconButton,
  List,
  ListItem, ListItemSecondaryAction,
  ListItemText,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
  Button,
  Checkbox
} from "@mui/material";
import Header from '../../components/Header';
import CloseIcon from '@mui/icons-material/Close';

const ExamDetail = () => {
  return (
    <div>
      <Header />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '1000px',
        width: '100%',
        background: '#D3E4FF',
      }}>
        <Box sx={{
          alignItems: 'left',
          height: '100%',
          flex: '1',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}>
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
            sx={{
              width: '80%',
              '& input': {
                textAlign: 'center'
              }
            }}
          />

          <TextField
            type="number"
            label="Minute"
            size='small'
            sx={{
              width: '80%',
              '& input': {
                textAlign: 'center'
              }
            }}
          />
          <TextField
            type="date"
            label="Select Start Date"
            size='small'
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
            label='Select Start Time'
            size='small'
            sx={{
              width: '80%',
            }}

            InputLabelProps={{
              shrink: true,
            }} />

          <TextField
            type="date"
            label="Select Start Date"
            size='small'
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
            label='Select Start Time'
            size='small'
            sx={{
              width: '80%',
            }}

            InputLabelProps={{
              shrink: true,
            }} />
          <TextField
            type="number"
            label="Number Submit"
            size="small"
            sx={{
              width: '80%',
            }}
          />
          {/* box phai */}
        </Box>
        <Box sx={{
          flex: '3',
          display: 'flex',
          gap: '20px',
          height: '800px',
          justifyContent: 'center',
          padding: '20px'

        }}>
          <Box className='QuestionArray' sx={{
            width: '65.667%',
            height: '500px',
            background: '#fff',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box className='Question' sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '85%',
              height: '85%',
              gap: '10px'
            }}>
              <TextField
                label='Question'
                sx={{
                  width: '100%',
                }} />
              <Box className='AnswerArrays' sx={{
                width: '100%',
                height: '40px',
                // background: 'red',
                display: 'flex',
                flexDirection: 'row',
                gap: '2%',
                alignItems: 'center'
              }} >
                <button style={{
                  height: '75%',
                  width: '5.215%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none'
                }}>
                  <CloseIcon style={{
                    fontSize: '30px',
                    color: 'red'
                  }} />
                </button>
                <Checkbox sx={{
                  height: '75%',
                  width: '5.215%',
                  '& .MuiSvgIcon-root': {
                    fontSize: '35px', // Kích thước của checkbox
                  },
                }} />
                <TextField
                  label='Answer'
                  size='small'
                  sx={{
                    width: '85.57%',
                  }} />
              </Box>
              <Box className='QuestionButton' sx={{
                width: '100%',
                height: '30px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
                // background: 'red'
              }}>
                <button className='btnCreateAns' style={{
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'none',
                  border: '2px solid',
                  borderRadius: '10px',
                  borderColor: '#435EBE',
                  color: '#435EBE'
                }}>
                  + Create New Answer
                </button>
                <button className='btnDelQues' style={{
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'none',
                  border: '2px solid',
                  borderRadius: '10px',
                  borderColor: '#E05151',
                  color: '#E05151'
                }}>
                  - Delete Question
                </button>
              </Box>
            </Box>

          </Box>
          <Box className='UploadFile' sx={{
            width: '33.333%',
            height: '200px',
            background: '#fff',
            borderRadius: '20px'
          }}
          >
          </Box>
        </Box>
      </Box>
    </div >
  )
}

export default ExamDetail