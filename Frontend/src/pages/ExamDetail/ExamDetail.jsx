import React, { useEffect, useState, useRef } from 'react'
import {
    Box,
    Snackbar,
    Button,
    Alert,
    IconButton
} from "@mui/material";
import { KeyboardArrowRight } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { createQuestionManually, getExamAndTime, update } from '../../services/examService';
import Question from '~/components/Question';
import ExamInformation from '~/components/ExamInformation';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import styles from './ExamDetails.module.scss';
import { ddMMyyyy } from '~/utils/timeUtils';
import { useTheme } from '@mui/material';
const ExamDetail = () => {
    const { id } = useParams();
    const [questionsTime, setQuestionsTime] = useState({});
    const [questions, setQuestions] = useState([]);
    const [time, setTime] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [severity, setSeverity] = useState('error');
    const [content, setContent] = useState('');
    const [panelActive, setPanelActive] = useState(true);
    const examTimeRef = useRef();
    const questionRefs = useRef([]);
    const theme = useTheme();

    const handleShowSnackBar = (content, severity = "error") => {
        setSeverity(severity);
        setContent(content);
        setSnackbarOpen(true);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (questionsTime?.questions?.length > 0) {
            let newList = questionsTime.questions;
            newList.forEach(item => { delete item.exam });
            setQuestions(newList)
        }
        setTime({
            examName: questionsTime?.exam?.examName,
            duration: Number(questionsTime?.exam?.duration) / 60,
            openDate: ddMMyyyy(questionsTime?.exam?.examStartTime) ? format(ddMMyyyy(questionsTime?.exam?.examStartTime), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            openTime: ddMMyyyy(questionsTime?.exam?.examStartTime) ? format(ddMMyyyy(questionsTime?.exam?.examStartTime), 'HH:mm') : format(new Date(), 'HH:mm'),
            closeDate: ddMMyyyy(questionsTime?.exam?.examEndTime) ? format(ddMMyyyy(questionsTime?.exam?.examEndTime), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            closeTime: ddMMyyyy(questionsTime?.exam?.examEndTime) ? format(ddMMyyyy(questionsTime?.exam?.examEndTime), 'HH:mm') : format(new Date(), 'HH:mm'),
            numberSubmit: questionsTime?.exam?.numberSubmit,
            examCode: questionsTime?.exam?.keyCode,
            isPublic: questionsTime?.exam?.isPublic,
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
    const handleAddNewQuestion = () => {
        setQuestions([...questions, {
            questionId: uuidv4(),
            questionText: '',
            questionType: 'SINGLE_CHOICE',
            answers: [
                {
                    answerId: uuidv4(),
                    answerText: '',
                    isCorrect: true,
                },
                {
                    answerId: uuidv4(),
                    answerText: '',
                    isCorrect: false,
                }
            ],
        }]);
    }
    const onValidateQuestion = (questions) => {
        for (let i = 0; i < questions.length; i += 1) {
            if (questions[i].questionText.trim() === '') {
                handleShowSnackBar('Question Text Is Not Null !');
                return false;
            }
            for (let j = 0; j < questions[i].answers.length; j += 1) {
                if (questions[i].answers[j].answerText.trim() === '') {
                    handleShowSnackBar('Answer Text Is Not Null !');
                    return false;
                }
            }
        }
        return true;
    }
    const onUpdateExam = async () => {
        const examTime = examTimeRef.current.getData();
        const user = localStorage.getItem('user');
        const examData = {
            examId: id,
            examName: examTime.examName,
            examStartTime: format(new Date(examTime.openDate + ' ' + examTime.openTime), 'dd/MM/yyyy HH:mm:ss'),
            examEndTime: format(new Date(examTime.closeDate + ' ' + examTime.closeTime), 'dd/MM/yyyy HH:mm:ss'),
            numberSubmit: examTime.numberSubmit,
            keyCode: examTime.keyCode,
            isPublic: examTime.isPublic,
            duration: examTime.duration * 60,
            user: JSON.parse(user),
        }

        const examRes = await update(examData);
        if (examRes?.status === 200) {
            handleShowSnackBar('Update exam success !', 'success');
        }
        else {
            handleShowSnackBar('Update exam failed !');
            return
        }

        let newQuestionRef = questionRefs.current.filter(item => {
            if (item !== null) {
                return item;
            }
        });
        const listQuestion = newQuestionRef.map((ref) => {
            let question = ref.getData();
            return { ...question, exam: { examId: id } };
        });
        //validate question
        if (onValidateQuestion(listQuestion)) {
            const questionRes = await createQuestionManually({ questions: listQuestion, examId: id });
            if (questionRes && questionRes.length > 0) {
                handleShowSnackBar('Update question success !', 'success');
            } else {
                handleShowSnackBar('Update question failed !');
                return
            }
        }
    };
    const onTurnOff = () => {
        const examInfo = document.querySelector(`.${styles.ExamInfoIn}`);
        const questionsComponent = document.getElementsByClassName('QuestionArray')[0];
        const arrowRight = document.getElementsByClassName('ArrowRight')[0];
        examInfo.classList.remove(`${styles.ExamInfoIn}`);
        examInfo.classList.add(`${styles.ExamInfoOut}`);
        arrowRight.style.visibility = 'visible';
        setTimeout(() => {
            examInfo.style.display = 'none';
            questionsComponent.style.paddingLeft = '0px';
        }, 300);
    }
    const onTurnOn = () => {
        const examInfo = document.querySelector(`.${styles.ExamInfoOut}`);
        const questionsComponent = document.getElementsByClassName('QuestionArray')[0];
        const arrowRight = document.getElementsByClassName('ArrowRight')[0];
        examInfo.classList.remove(`${styles.ExamInfoOut}`);
        examInfo.classList.add(`${styles.ExamInfoIn}`);
        arrowRight.style.visibility = 'hidden';
        examInfo.style.display = 'flex';
        questionsComponent.style.paddingLeft = '300px';
    }

    return (
        <div>
            <Box sx={{
                display: 'flex',
                flexDirection: {
                    xs: 'column-reverse',
                    md: 'row'
                },
                height: 'auto',
                minHeight: '100vh',
                gap: '20px',

            }}>
                <Box className='QuestionArray' sx={{
                    paddingLeft: {
                        xs: '0',
                        md: '300px'
                    },
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',

                }}>
                    <Box sx={{
                        background: theme.palette.cardBackground,
                        borderRadius: '20px',
                        width: '100%',
                        display: 'flex',
                        gap: '20px',
                        padding: '30px 20px 20px 20px',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {questions?.map((question, questionIndex) => (
                            <Question key={question?.questionId} ref={(ref) => (questionRefs.current[questionIndex] = ref)} listQuestion={questions} index={questionIndex} setQuestions={setQuestions} question={question} questionText={question.questionText} answers={question.answers} questionType={question.questionType} />
                        ))}

                        <Button variant='contained' onClick={handleAddNewQuestion} >
                            Add new question
                        </Button>
                    </Box>
                </Box>
                <Box
                    className={`${styles.ExamInfoIn}`}
                    sx={{
                        width: {
                            xs: '100%',
                            md: '300px'
                        },
                        background: theme.palette.cardBackground,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        position: {
                            xs: 'static',
                            md: 'fixed'
                        },
                        top: '0',
                        left: 'var(--sidebar-size)',
                        height: {
                            xs: 'auto',
                            md: '100vh'
                        },
                        borderRadius: {
                            xs: '20px',
                            md: '0'
                        },
                        padding: '20px 0',
                        overflow: 'auto'
                    }}>
                    <ExamInformation timeOfExam={time} onTurnOff={onTurnOff} ref={examTimeRef} />
                    <Button
                        onClick={() => onUpdateExam()}
                        variant='contained'
                        size='large'
                    >
                        Update
                    </Button>
                </Box>

                <IconButton
                    className='ArrowRight'
                    sx={{
                        position: 'fixed',
                        top: 'calc(50% - 50px)',
                        marginLeft: '-20px',
                        height: '100px',
                        width: '15px',
                        visibility: 'hidden',
                        borderRadius: '0 5px 5px 0',
                        backgroundColor: '#fff',
                        '&:hover': {
                            backgroundColor: '#efefef'
                        }
                    }}
                    onClick={onTurnOn}
                >
                    <KeyboardArrowRight sx={{ fontSize: '25px' }} />
                </IconButton>


            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar} >
                <Alert
                    onClose={handleCloseSnackBar}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {content ? content : 'Invalid input'}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ExamDetail