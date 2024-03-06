import React, { useEffect, useState } from 'react'
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
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import CloseIcon from '@mui/icons-material/Close';
import { getQuestion } from '../../services/examService';

const ExamDetail = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [time, setTime] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        // Gọi các hàm asynchronous ở đây
        const questions = await getQuestion({ idExam: id });
        setQuestions(questions);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchData();
  }, [])
  console.log(questions)

  return (
    <div>
      <Header />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        height: 'auto',
        width: '100%',
        minHeight: 'calc(100vh - var(--header-height))',
        background: '#D3E4FF',
      }}>
        <Box sx={{
          alignItems: 'left',
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
          height: 'auto',
          justifyContent: 'center',
          padding: '20px'

        }}>
          <Box className='QuestionArray' sx={{
            width: '65.667%',
            height: 'fit-content',
            background: '#fff',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            paddingTop: '20px',
            paddingBottom: '20px'

          }}>
            {questions.map(question => (
              <Box key={`${question.questionId}`} className='Question' sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '85%',
                height: 'auto',
                gap: '10px'
              }}>
                <TextField
                  label='Question'
                  value={`${question.questionText}`}
                  sx={{
                    width: '100%',
                  }} />
                <Box className='AnswerArrays' sx={{
                  width: '100%',
                  // background: 'red',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'center'
                }} >
                  {question.answers?.map(answer =>(
                  <Box className='Answer' key={answer.answerId} sx={{
                    width: '100%',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center'
                  }}>
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
                    <Checkbox checked={(answer.isCorrect)?true:false} sx={{
                      height: '75%',
                      width: '5.215%',
                      '& .MuiSvgIcon-root': {
                        fontSize: '35px', // Kích thước của checkbox
                      },
                    }} />
                    <TextField
                      label='Answer'
                      size='small'
                      value={answer.answerText}
                      sx={{
                        width: '85.57%',
                      }} />
                  </Box>
                  ))}

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
            ))}



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