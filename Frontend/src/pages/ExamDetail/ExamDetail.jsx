import React, { useEffect, useState, useRef } from 'react'
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
import { getExamAndTime } from '../../services/examService';
import Question from '~/components/Question';
import ExamInformation from '~/components/ExamInformation';
const ExamDetail = () => {

  const { id } = useParams();
  const [questionsTime, setQuestionsTime] = useState({});
  const [questions, setQuestions] = useState([]);
  const [time, setTime] = useState({});
  const examTimeRef = useRef();
  const questionRefs = useRef([]);

  useEffect(() => {
    if (questionsTime?.questions?.length > 0) {
      let newList = questionsTime.questions;
      newList.forEach(item => { delete item.exam });
      setQuestions(newList)
    }
    setTime({
      examName: questionsTime?.exam?.examName,
      duration: Number(questionsTime?.exam?.duration) / 60,
      openDate: new Date(questionsTime?.exam?.examStartTime).getFullYear()
        + '-' +
        ((new Date(questionsTime?.exam?.examStartTime).getMonth() > 8) ? (new Date(questionsTime?.exam?.examStartTime).getMonth() + 1) : '0' + (new Date(questionsTime?.exam?.examStartTime).getMonth() + 1))
        + '-' + ((new Date(questionsTime?.exam?.examStartTime).getDate() > 9) ? (new Date(questionsTime?.exam?.examStartTime).getDate()) : '0' + (new Date(questionsTime?.exam?.examStartTime).getDate())),
      openTime: ((new Date(questionsTime?.exam?.examStartTime).getHours() > 9) ? new Date(questionsTime?.exam?.examStartTime).getHours() : '0' + new Date(questionsTime?.exam?.examStartTime).getHours())
        + ':' + ((new Date(questionsTime?.exam?.examStartTime).getMinutes() > 9) ? new Date(questionsTime?.exam?.examStartTime).getMinutes() : '0' + new Date(questionsTime?.exam?.examStartTime).getMinutes()),
      closeDate: new Date(questionsTime?.exam?.examEndTime).getFullYear()
        + '-' +
        ((new Date(questionsTime?.exam?.examEndTime).getMonth() > 8) ? (new Date(questionsTime?.exam?.examEndTime).getMonth() + 1) : '0' + (new Date(questionsTime?.exam?.examEndTime).getMonth() + 1))
        + '-' + ((new Date(questionsTime?.exam?.examEndTime).getDate() > 9) ? (new Date(questionsTime?.exam?.examEndTime).getDate()) : '0' + (new Date(questionsTime?.exam?.examEndTime).getDate())),
      closeTime: ((new Date(questionsTime?.exam?.examEndTime).getHours() > 9) ? new Date(questionsTime?.exam?.examEndTime).getHours() : '0' + new Date(questionsTime?.exam?.examEndTime).getHours())
        + ':' + ((new Date(questionsTime?.exam?.examEndTime).getMinutes() > 9) ? new Date(questionsTime?.exam?.examEndTime).getMinutes() : '0' + new Date(questionsTime?.exam?.examEndTime).getMinutes()),
      numberSubmit: questionsTime?.exam?.numberSubmit,
      examCode: questionsTime?.exam?.keyCode,
    });
  }, [questionsTime]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsTime = await getExamAndTime({ idExam: id });
        setQuestionsTime(questionsTime);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchData();
  }, [])

  const onUpdateExam = () => {
    const examTime = examTimeRef.current.getData();
    console.log(examTime);

    let newQuestionRef = questionRefs.current.filter(item => {
      if (item !== null) {
        return item;
      }
    });
    const listQuestion = newQuestionRef.map((ref) => ref.getData());
    console.log(listQuestion);
  };
  return (
    <div>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        height: 'auto',
        minHeight: '100vh',
        background: '#D3E4FF',
        padding: '20px'
      }}>
        <Box className='QuestionArray' sx={{
          width: '70%',
          height: 'fit-content',
          background: '#fff',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}>
          {questions?.map((question, questionIndex) => (
            <Question key={`${question.questionId}`} ref={(ref) => (questionRefs.current[questionIndex] = ref)} listQuestion={questions} index={questionIndex} setQuestions={setQuestions} question={question} />
          ))}
        </Box>
        <Box sx={{
          width: '25%',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          position: 'fixed',
          top: '0',
          right: '0',
          height: '100vh',
        }}>
          <ExamInformation timeOfExam={time} ref={examTimeRef} />
          <Button
            onClick={() => onUpdateExam()}
            sx={{
              background: '#4285F4',
              color: '#fff',
              width: '50%',
              borderRadius: '10px',
              fontSize: '20px',
              '&:hover': {
                background: '#fff',
                color: '#4285F4',
                border: '2px solid #999'
              },
            }}>
            Update
          </Button>
        </Box>
      </Box>
    </div>
  )
}

export default ExamDetail