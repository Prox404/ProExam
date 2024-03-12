import {
    Box,
    TextField,
    Snackbar,
    Alert,
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import Answer from "../Answer";
import { v4 as uuidv4 } from "uuid";

const Question = forwardRef(({ question, index, setQuestions, listQuestion },ref) => {

    const [content, setContent] = useState();
    const [detailQuestion, setDetailQuestion] = useState(question);
    const [isOpenA, setIsOpenA] = useState(false);
    const [statusA, setStatusA] = useState('success');
    const [messageA, setMessageA] = useState('');
    const answerRefs = useRef([]);

    const showAlert = (status, message) => {
        setStatusA(status);
        setMessageA(message);
        setIsOpenA(true);
    };

    useEffect(() => {
        setContent(detailQuestion.questionText);
    }, [detailQuestion]);
    const getAnswers = () => {
        let newAnswerRefs = answerRefs.current.filter(item => {
            if(item !== null){
              return item;
            }
          });
          const listAnswer = newAnswerRefs.map((ref) => ref.getData());
          return listAnswer;
    }
    useImperativeHandle(ref, () => ({
        getData: () => {
          return {
                ...detailQuestion,
                questionText: content,
                answers: getAnswers()
            };
        },
      }));
    const onCreateAnswer = () => {
        const newAnswer = {
            answerId: uuidv4(),
            answerText: "",
            isCorrect: false
        }
        const newQuestion = {
            ...detailQuestion,
            answers: [
                ...detailQuestion.answers,
                newAnswer
            ]
        }
        setDetailQuestion(newQuestion);
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
                    width: '85%',
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
                    {detailQuestion.answers?.map((answer, answerIndex) => (
                        <Answer key={answer.answerId} index={answerIndex} contentQ={content} ref={(ref) => (answerRefs.current[answerIndex] = ref)} detailQuestion={detailQuestion} setDetailQuestion={setDetailQuestion} answer={answer} />
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
                    <button className='btnCreateAns'
                        onClick={() => onCreateAnswer()}
                        style={{
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
                    <button className='btnDelQues'
                        onClick={() => onDeleteQuestion(question.questionId)}
                        style={{
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