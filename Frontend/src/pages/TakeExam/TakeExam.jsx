import { Box, Button, Checkbox, IconButton, Typography, Alert, Snackbar } from "@mui/material";
import AntiCopy from "~/components/AntiCopy";
import FaceDetectionCam from "~/components/FaceDetectionCam";
import NoiseAlert from "~/components/NoiseAlert";
import take_exam_timing from "~/assets/take_exam_timing.svg";
import styles from './TakeExam.module.scss';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useContext, useMemo, useEffect, useCallback } from "react";
import AnswerItem from "~/components/AnswerItem";
import { useTheme } from "@emotion/react";
import { ThemeContext } from "~/App";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import CountdownTimer from "./CountdownTimer";
import * as examServices from '~/services/examService';
import CheatingAlert from "~/components/CheatingAlert";
import DevtoolsDetected from "~/components/DevtoolsDetected/DevtoolsDetected";
import ShortCutDetected from "~/components/ShortCutDetected";
import { useNavigate } from "react-router-dom";
import LeaveTabDetected from "~/components/LeaveTabDetected";

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
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [content, setContent] = useState('');
    const [examInfo, setExamInfo] = useState({});
    const [severity, setSeverity] = useState('error');
    const [isCurrentQuestionChanged, setIsCurrentQuestionChanged] = useState(false);
    const [cheatingCode, setCheatingCode] = useState(1000);
    const [isCheatingOpen, setIsCheatingOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const examData = JSON.parse(localStorage.getItem('exam')) || {};
        if (examData?.questions?.length) {
            setQuestions(examData?.questions);
            setExamInfo({
                ...examData,
                ...examData?.questions[0].exam,
            });

        } else {
            navigate('/')
        }
    }, [])

    console.info('examInfo', examInfo);

    console.log(examInfo);
    const handleShowSnackBar = (content, severity = 'error') => {
        setContent(content);
        setSnackbarOpen(true);
        setSeverity(severity);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const handleAnswerSelect = useCallback((questionId, answerId, questionType) => {
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

        setIsCurrentQuestionChanged(true);
    }, [setSelectedAnswers, setIsCurrentQuestionChanged]);

    console.log(selectedAnswers);
    console.log(examInfo?.duration, examInfo?.ExamResultId);

    const onCountdownFinish = async () => {
        console.log('countdown finish');
        if (examInfo?.duration != 0 && examInfo?.ExamResultId) {
            
            let res = await examServices.submitExam(examInfo.ExamResultId);
            if (res?.status === 200) {
                handleShowSnackBar('Submit exam successfully', 'success');
                if (selectedAnswers[questions[currentQuestionIndex].questionId] && isCurrentQuestionChanged) {
                    await examServices.chooseAnwser(examInfo.ExamResultId, {
                        questionId: questions[currentQuestionIndex].questionId,
                        answerIds: selectedAnswers[questions[currentQuestionIndex].questionId],
                    })
                }
                localStorage.removeItem('exam');
                navigate('/exam-result/' + examInfo.ExamResultId);
            } else {
                handleShowSnackBar('Submit exam failed');
                
            }
        }
    };

    const handleNextQuestion = async () => {
        // kiểm tra đáp án có thay đổi không, nếu có thì cập nhật
        if (selectedAnswers[questions[currentQuestionIndex].questionId] && isCurrentQuestionChanged) {
            const res = await examServices.chooseAnwser(examInfo.ExamResultId, {
                questionId: questions[currentQuestionIndex].questionId,
                answerIds: selectedAnswers[questions[currentQuestionIndex].questionId],
            })
            if (res?.status === 200) {
                handleShowSnackBar('Choose answer successfully', 'success');
            } else {
                handleShowSnackBar('Choose answer failed');
            }
        }
        setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
        setIsCurrentQuestionChanged(false);
    };

    const handlePreviousQuestion = async () => {
        if (selectedAnswers[questions[currentQuestionIndex].questionId] && isCurrentQuestionChanged) {
            const res = await examServices.chooseAnwser(examInfo.ExamResultId, {
                questionId: questions[currentQuestionIndex].questionId,
                answerIds: selectedAnswers[questions[currentQuestionIndex].questionId],
            })
            if (res?.status === 200) {
                handleShowSnackBar('Choose answer successfully', 'success');
            } else {
                handleShowSnackBar('Choose answer failed');
            }
        }
        setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
        setIsCurrentQuestionChanged(false);
    };

    const handleSubmit = async () => {
        const isAllQuestionAnswered = questions.every(question => selectedAnswers[question.questionId] && selectedAnswers[question.questionId].length > 0);
        if (!isAllQuestionAnswered) {
            handleShowSnackBar('Please answer all questions');
            return;
        }
        // check if current question is choose answer, if yes, update to server
        if (selectedAnswers[questions[currentQuestionIndex].questionId] && isCurrentQuestionChanged) {
            const res = await examServices.chooseAnwser(examInfo.ExamResultId, {
                questionId: questions[currentQuestionIndex].questionId,
                answerIds: selectedAnswers[questions[currentQuestionIndex].questionId],
            })
            if (!res?.status === 200) {
                handleShowSnackBar('Submit failed, please try again later', 'error');
                return
            }

        }
        
        let res = await examServices.submitExam(examInfo.ExamResultId);
        if (res?.status === 200) {
            handleShowSnackBar('Submit exam successfully', 'success');
            localStorage.removeItem('exam');
            navigate('/exam-result/' + examInfo.ExamResultId);
        } else {
            handleShowSnackBar('Submit exam failed');
        }
    }

    console.log(examInfo);

    const renderQuestions = useCallback(() => {
        const question = questions[currentQuestionIndex];
        return (
            <>
                {
                    question && <>
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
                    </>
                }
            </>


        );
    }, [questions, selectedAnswers, currentQuestionIndex, handleAnswerSelect]);

    const toggleDrawer = useCallback((anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    }, [state]);

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
    ), [questions, selectedAnswers, setCurrentQuestionIndex, toggleDrawer]);

    let timeoutId;

    const handleNoiseDetection = async () => {
        if (!isCheatingOpen && examInfo?.ExamResultId) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                await handleCheatingDetection(1004);
                console.log('noise detected');
            }, 3000);
        }

    }

    

    const handleMultipleFaces = async () => {
        console.log(examInfo);
        if (!isCheatingOpen && examInfo?.ExamResultId) {
            await handleCheatingDetection(1005);
            console.log('multiple faces detected');
        }
    }

    const handleDevtoolsDetected = async () => {
        if (!isCheatingOpen && examInfo?.ExamResultId) {
            await handleCheatingDetection(1003);
            console.log('devtools detected');
        }
    }

    const handleCopyDetection = async () => {
        if (!isCheatingOpen && examInfo?.ExamResultId) {
            await handleCheatingDetection(1000);
            console.log('copy detected');
        }
    }

    const handleLeaveTabDetected = async () => {
        if (!isCheatingOpen && examInfo?.ExamResultId) {
            await handleCheatingDetection(1002);
            console.log('tab change detected' + isCheatingOpen);
        }
    }

    const handlesCreenshotDetected = async () => {
        if (!isCheatingOpen && examInfo?.ExamResultId) {
            await handleCheatingDetection(1001);
            console.log('screenshot detected');
        }
    }

    const handleCheatingDetection = async (cheatingCode) => {
        await examServices.cheatingDetection({
            cheatingCode: cheatingCode,
            examResultId: examInfo.ExamResultId
        });
        setCheatingCode(cheatingCode);
        setIsCheatingOpen(true);
    }

    return (
        <Box sx={{
            padding: {
                xs: '10px',
                md: '15px',
            },
            height: '100%',
        }} className={styles['take-exam']}>
            <AntiCopy handleCopyDetection={handleCopyDetection}>
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
                            }}>
                                {examInfo?.examName ? examInfo.examName : 'Exam Name'}
                            </Typography>
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
                            }}>
                                <CountdownTimer examStartTime={examInfo?.ExamResultStartTime} duration={examInfo?.duration} onCountdownFinish={onCountdownFinish} />
                            </Typography>
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
                            }}>
                                {examInfo?.userAnswer?.userAnswerName ? examInfo?.userAnswer.userAnswerName : 'User Name'}
                            </Typography>
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
                                }}
                                    onClick={handleSubmit}
                                >Submit</Button>
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
                <ShortCutDetected handleCopyDetection={handleCopyDetection} handlesCreenshotDetected={handlesCreenshotDetected}/>
                <DevtoolsDetected handleDevtoolsDetected={handleDevtoolsDetected} />
                <NoiseAlert handleNoiseDetection={handleNoiseDetection} />
                <LeaveTabDetected onLeaveTabDetected={handleLeaveTabDetected} />
                <FaceDetectionCam handleMultipleFaces={handleMultipleFaces} />
                <CheatingAlert cheatingCode={cheatingCode} isOpen={isCheatingOpen} handleClose={() => setIsCheatingOpen(false)} />
                <SwipeableDrawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                    onOpen={toggleDrawer('left', true)}
                >
                    {list('left')}
                </SwipeableDrawer>

            </AntiCopy>
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
        </Box>
    );
}

export default TakeExam;
