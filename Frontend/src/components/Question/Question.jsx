import {
    Box,
    TextField,
    Snackbar,
    Alert,
    Button,
    Typography,
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import Answer from "../Answer";
import { v4 as uuidv4 } from "uuid";
import { Add, Delete } from "@mui/icons-material";

// eslint-disable-next-line react/display-name
const Question = forwardRef(({ question, index, setQuestions, listQuestion, questionText, answers, questionType:type }, ref) => {
    const [content, setContent] = useState(questionText);
    const [listAnswers, setListAnswers] = useState(answers);
    const [questionType, setQuestionType] = useState(type);
    const [isOpenA, setIsOpenA] = useState(false);
    const [statusA, setStatusA] = useState('success');
    const [messageA, setMessageA] = useState('');
    const answerRefs = useRef([]);
    const showAlert = (status, message) => {
        setStatusA(status);
        setMessageA(message);
        setIsOpenA(true);
    };
    const updateQuestion = (content,answers,type) => {
        setContent(content);
        setListAnswers(answers);
        setQuestionType(type);
    }
    const getQuestion = () => {
        return {
            questionId: question.questionId,
            questionText: content,
            questionType,
            answers: getAnswers()
        }
    }
    const getAnswers = () => {
        let newAnswerRefs = answerRefs.current.filter(item => {
            if (item !== null) {
                return item;
            }
        });
        const listAnswer = newAnswerRefs.map((ref) => ref.getData());
        return listAnswer;
    }
    useImperativeHandle(ref, () => ({
        getData: () => {
            return {
                questionId: question.questionId,
                questionText: content,
                questionType,
                answers: getAnswers()
            };
        },
    }));
    const onCreateAnswer = () => {
        setListAnswers([
            ...listAnswers,
            {
                answerId: uuidv4(),
                answerText: "",
                isCorrect: false
            }
        ]);
    }
    const onDeleteQuestion = (id) => {
        if (listQuestion.length > 1) {
            setQuestions(listQuestion.filter(item => item.questionId !== id));
        } else {
            showAlert('error', 'There must be at least 2 ')
        }

    }

    return (
        <>
            <Box className='Question'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: 'auto',
                    gap: '10px'
                }}>
                <TextField
                    label={`Question ${index + 1}`}
                    onChange={(e) => {
                        setContent(e.target.value)
                    }}
                    value={`${content}`}
                    InputProps={{

                        readOnly: false,
                    }}
                    sx={{
                        width: '100%',
                    }} />
                <Box className='AnswerArrays'
                    sx={{
                        width: '100%',
                        // background: 'red',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center'
                    }} >
                    {listAnswers.map((answer, answerIndex) => (
                        <Answer key={answer.answerId } index={answerIndex} ref={(ref) => (answerRefs.current[answerIndex] = ref)} answer={answer} answerText={answer.answerText} isCorrect={answer.isCorrect} getQuestion={getQuestion} updateQuestion={updateQuestion} />
                    ))}

                </Box>
                <Box className='QuestionButton'
                    sx={{
                        width: '100%',
                        height: '30px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                        // background: 'red'
                    }}>
                    <Button className='btnCreateAns'
                        onClick={() => onCreateAnswer()}
                        variant="outlined" startIcon={<Add />}
                        color="primary" size="small" sx={{
                            height: '30px', textTransform: 'none', '& span': {
                                marginRight: {
                                    xs: '0px',
                                    md: '8px'
                                }
                            }
                        }}
                    >
                        <Typography variant="body1" sx={{
                            fontSize: '12px',
                            display: { xs: 'none', md: 'block' }
                        }}>Create Answer</Typography>
                    </Button>
                    <Button className='btnDelQues'
                        onClick={() => onDeleteQuestion(question?.questionId)}
                        variant="outlined" startIcon={<Delete />}
                        color="error" size="small" sx={{
                            height: '30px', textTransform: 'none', '& span': {
                                marginRight: {
                                    xs: '0px',
                                    md: '8px'
                                }
                            }
                        }}
                    >
                        <Typography variant="body1" sx={{
                            fontSize: '12px',
                            display: {
                                xs: 'none',
                                md: 'block'
                            }
                        }}>Delete Question</Typography>
                    </Button>
                </Box>
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
})

export default Question