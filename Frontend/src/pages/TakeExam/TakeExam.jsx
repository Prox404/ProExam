import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import AntiCopy from "~/components/AntiCopy";
import FaceDetectionCam from "~/components/FaceDetectionCam";
import NoiseAlert from "~/components/NoiseAlert";
import take_exam_timing from "~/assets/take_exam_timing.svg";
import styles from './TakeExam.module.scss';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useContext, useMemo } from "react";
import AnswerItem from "~/components/AnswerItem";
import { useTheme } from "@emotion/react";
import { ThemeContext } from "~/App";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Loading from "~/components/Loading";

function QuestionPanelItem({ label = '', selected = false, onClick, onChange, value, ...props }) {

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'calc(100% / var(--number-panel-item))',
        }}
            onClick={onClick}
        >
            <Checkbox {...props} sx={{
                padding: '0',
            }}
                selected={selected}
                value={value}
                onChange={onChange}
            />
            <Typography variant='p' sx={{
                fontWeight: '500',
                textAlign: 'center',
                width: '100%',
            }}>{label}</Typography>
        </Box>

    );
}

function TakeExam() {
    const [state, setState] = useState({
        left: false,
    });
    const theme = useTheme();
    const { mode, handleChange } = useContext(ThemeContext);
    const questionsData = [
        {
            "questionId": "f339e08c-4241-4ff0-9ea0-98b8f96577a3",
            "questionText": "What is 2 + 2?",
            "questionType": "MULTIPLE_CHOICE",
            "exam": {
                "examId": "c30ea8d7-9fc0-4951-af6c-f17c5aa1884a",
                "examName": "Siuuu",
                "examStartTime": "2023-02-20T17:00:00.000+00:00",
                "examEndTime": null,
                "numberSubmit": 0,
                "keyCode": 123456,
                "isPublic": 0,
                "duration": 0,
                "user": {
                    "userId": "8b366c8c-57f1-4571-9c47-abf7493e9085",
                    "userName": "prox",
                    "userPassword": "$2a$10$Q3UHWpMK5m.xl.984mzqtu2qpm/NsqGqk6hOyht8YVrW1dzccdybC",
                    "userEmail": "pro3@gmail.com"
                }
            },
            "answers": [
                {
                    "answerId": "a75e1aa5-40d5-4a87-a9eb-ca627ac81ae0",
                    "answerText": "4",
                    "isCorrect": false
                },
                {
                    "answerId": "298c5969-f0cd-43b8-86d1-aa5e69ff0af1",
                    "answerText": "1",
                    "isCorrect": false
                },
                {
                    "answerId": "ab4091b4-bbd8-4661-8cf8-5a18ef5c8446",
                    "answerText": "3",
                    "isCorrect": false
                },
                {
                    "answerId": "27bc58ce-79c6-4645-bfa7-cd151d91e6d7",
                    "answerText": "2",
                    "isCorrect": false
                }
            ]
        },
        {
            "questionId": "3ce6c66d-d269-435d-afe2-1184cc837e84",
            "questionText": "What is the capital of France?",
            "questionType": "SINGLE_CHOICE",
            "exam": {
                "examId": "c30ea8d7-9fc0-4951-af6c-f17c5aa1884a",
                "examName": "Siuuu",
                "examStartTime": "2023-02-20T17:00:00.000+00:00",
                "examEndTime": null,
                "numberSubmit": 0,
                "keyCode": 123456,
                "isPublic": 0,
                "duration": 0,
                "user": {
                    "userId": "8b366c8c-57f1-4571-9c47-abf7493e9085",
                    "userName": "prox",
                    "userPassword": "$2a$10$Q3UHWpMK5m.xl.984mzqtu2qpm/NsqGqk6hOyht8YVrW1dzccdybC",
                    "userEmail": "pro3@gmail.com"
                }
            },
            "answers": [
                {
                    "answerId": "436d505a-295f-47d2-a7da-11692257aaed",
                    "answerText": "Madrid",
                    "isCorrect": false
                },
                {
                    "answerId": "355b822e-7f52-4491-903b-0b6181e553c3",
                    "answerText": "Paris",
                    "isCorrect": false
                },
                {
                    "answerId": "3bd8a000-66c3-41e7-b152-e5c769be16f1",
                    "answerText": "Berlin",
                    "isCorrect": false
                },
                {
                    "answerId": "d72d94f8-9b23-434d-92f7-1c0ef04984c4",
                    "answerText": "London",
                    "isCorrect": false
                }
            ]
        },
    ]

    const [questions, setQuestions] = useState(questionsData);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleAnswerSelect = (questionId, answerId, questionType) => {
        setSelectedAnswers(prevState => {
            if (questionType === 'MULTIPLE_CHOICE') {
                const selectedAnswers = prevState[questionId] || [];
                const newSelectedAnswers = selectedAnswers.includes(answerId)
                    ? selectedAnswers.filter(id => id !== answerId)
                    : [...selectedAnswers, answerId];
                return { ...prevState, [questionId]: newSelectedAnswers };
            } else {
                return { ...prevState, [questionId]: [answerId] };
            }
        });
    };
    console.log(selectedAnswers);

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const renderQuestions = () => {
        const question = questionsData[currentQuestionIndex];
        return (
            <Box key={question.questionId} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h4' sx={{ textAlign: 'center', margin: { xs: '20px 0', md: '40px 0' }, fontWeight: '500' }}>{question.questionText}</Typography>
                <Box className={styles['answer-list']} sx={{ padding: { xs: '0px', md: '20px' } }}>
                    {question.answers.map(answer => (
                        <AnswerItem
                            className={styles['answer-item']}
                            key={answer.answerId}
                            answer={answer.answerText}
                            value={answer.answerId}
                            selected={selectedAnswers[question.questionId]?.includes(answer.answerId)}
                            onChange={() => handleAnswerSelect(question.questionId, answer.answerId, question.questionType)}
                        />
                    ))}
                </Box>
            </Box>
        );
    };



    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    // eslint-disable-next-line react/display-name
    const list = useMemo(() => anchor => (
        <Box
            sx={{
                minWidth: 250,
                maxWidth: {
                    xs: '300px',

                },
                padding: '10px',
            }}
            role="presentation"
            // onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Typography variant='body1' sx={{
                fontWeight: '500',
            }}>Question Panel</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexWrap: 'wrap',
                overflow: 'auto',
                marginTop: '10px',
            }}>
                {/* question list here , check completed question or not, click for go to question */}
                {/* <QuestionPanelItem label='1' selected={true} />example */}
                {questions.map((question, index) => (
                    <QuestionPanelItem
                        key={question.questionId}
                        label={index + 1}
                        checked={selectedAnswers[question.questionId] ? true : false}
                        onClick={() => setCurrentQuestionIndex(index)}
                        disabled
                    />
                ))}

            </Box>
        </Box>
    ), [questions, selectedAnswers, setCurrentQuestionIndex]);

    return (
        <Box sx={{
            padding: {
                xs: '10px',
                md: '15px',
            },
            height: '100%',
        }} className={styles['take-exam']}>
            <AntiCopy>
                {/* exam header */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Box sx={{
                            flex: 1,
                        }}>
                            <Typography variant='h5' sx={{
                                display: {
                                    xs: 'none',
                                    md: 'block',
                                },
                                fontWeight: '500',
                                textAlign: 'left',
                            }}>Username</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                            <img src={take_exam_timing} alt='timing' className={`${styles['timing-img']}`} />
                            <Typography variant='h5' sx={{
                                fontWeight: '500',
                                color: 'var(--primary-color)',
                            }}>00:00</Typography>
                        </Box>
                        <Box sx={{
                            flex: 1,
                        }}>
                            <Typography variant='h5' sx={{
                                display: {
                                    xs: 'none',
                                    md: 'block',
                                },
                                fontWeight: '500',
                                textAlign: 'right',
                            }}>Exam Name</Typography>
                        </Box>
                    </Box>
                    {/* question panel */}
                    {renderQuestions()}
                    {
                        currentQuestionIndex === questions.length - 1 && <>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '20px 0',
                            }}>
                                <Button variant='contained' sx={{
                                    padding: '10px 20px',
                                }}>Submit</Button>
                            </Box>
                        </> 
                    }
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Button sx={{
                            flex: 1,
                            justifyContent: 'flex-start',
                        }} onClick={toggleDrawer('left', true)}>Question Panel</Button>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',

                            flexDirection: 'row',
                            flex: 1,
                        }}>
                            <IconButton onClick={handlePreviousQuestion} aria-label="delete" size="large"
                                disabled={currentQuestionIndex === 0 ? true : false}
                            >
                                <ArrowBackIos fontSize="small" />
                            </IconButton>
                            <Box sx={{
                                borderRadius: '5px',
                                padding: '5px 10px',
                                margin: '0 10px',
                                border: `2px solid ${theme.palette.lineColor}`,
                            }}>

                                <Typography variant='p' >
                                    {currentQuestionIndex + 1}
                                </Typography>
                                <Typography variant='p' >
                                    /
                                </Typography>
                                <Typography variant='p' >
                                    {questions.length}
                                </Typography>

                            </Box>
                            <IconButton onClick={handleNextQuestion} aria-label="delete" size="large"
                                disabled={currentQuestionIndex === questions.length - 1 ? true : false}
                            >
                                <ArrowForwardIos fontSize="small" />
                            </IconButton>
                        </Box>
                        <Button sx={{
                            flex: 1,
                            justifyContent: 'flex-end',
                        }} onClick={handleChange}>{mode ? 'Dark' : 'Light'}</Button>
                    </Box>
                </Box>
                {/* <NoiseAlert /> */}
                {/* <FaceDetectionCam /> */}

                <SwipeableDrawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                    onOpen={toggleDrawer('left', true)}
                >
                    {list('left')}
                </SwipeableDrawer>

            </AntiCopy>
            <Loading isOpen={false}/>
        </Box>
    );
}

export default TakeExam;