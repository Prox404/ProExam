import {
    Box,
    TextField,
    Checkbox,
    Snackbar,
    Alert,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState, forwardRef, useImperativeHandle } from "react";
import { deleteAnwser } from "~/services/examService";


// eslint-disable-next-line react/display-name
const Answer = forwardRef(({ answer, index, contentQ, detailQuestion, setDetailQuestion },ref) => {
    const [isOpenA, setIsOpenA] = useState(false);
    const [statusA, setStatusA] = useState('success');
    const [messageA, setMessageA] = useState('');
    const [content, setContent] = useState(answer.answerText);

    const showAlert = (status, message) => {
        setStatusA(status);
        setMessageA(message);
        setIsOpenA(true);
    };

    useImperativeHandle(ref, () => ({
        getData: () => {
          return {
                ...answer,
                answerText: content
            };
        },
      }));
    const onDeleteAnswer = async (id) => {
        if (answer.isCorrect) {
            if (detailQuestion.questionType === 'SINGLE_CHOICE') {
                showAlert('error', 'The answer requires at least one correct answer');
                return;
            }
        }
        if (detailQuestion.answers.length > 2) {
            let newAnswerList = detailQuestion?.answers;
            if(id) {
                const res = await deleteAnwser(id);
                if (res.status === 200) {
                    newAnswerList = detailQuestion.answers.filter(item => {
                        if (item.answerId !== id) {
                            return item;
                        }
                        
                    });
                }else{
                    showAlert('error', 'Delete failed');
                    return;
                }
            }else{
                //remove by index
                console.log(index);
                newAnswerList =  detailQuestion.answers.filter((item, answerIndex) => {
                    return answerIndex !== index - 1;
                });
            }
            
            setDetailQuestion({
                questionId: detailQuestion.questionId,
                questionText: contentQ,
                answers: newAnswerList,
                questionType: isType(newAnswerList)

            });
        } else {
            showAlert('error', 'There must be at least 2 answers')
        }
    }
    
    const isType = (answerList) => {
        let numberCorrect = 0;
        answerList.forEach(item => {
            if (item.isCorrect) { numberCorrect++ }
        })
        if (numberCorrect > 1) {
            return 'MULTIPLE_CHOICE';
        }
        return 'SINGLE_CHOICE';
    }

    const onChecked = (index) => {
        if (answer.isCorrect) {
            if (detailQuestion.questionType === 'SINGLE_CHOICE') {
                showAlert('error', 'The answer requires at least one correct answer');
                return;
            }
        }
        let newAnswerList = detailQuestion.answers.map((item, answerIndex) => {
            if (answerIndex === index -1) {
                return {
                    ...item,
                    isCorrect: !item.isCorrect,
                    answerText: content
                }
            }
            return item;
        });

        console.log(newAnswerList);

        const newQuestion = {
            questionId: detailQuestion.questionId,
            questionText: contentQ,
            answers: newAnswerList,
            questionType: isType(newAnswerList)
        }
        setDetailQuestion(newQuestion);
    }

    const handleAnwserChange = (value) => {
        setContent(value);
        const newAnswerList = detailQuestion.answers.map((item, answerIndex) => {
            if (answerIndex === index -1) {
                return {
                    ...item,
                    answerText: value
                }
            }
            return item;
        });
        const newQuestion = {
            questionId: detailQuestion.questionId,
            questionText: contentQ,
            answers: newAnswerList,
            questionType: isType(newAnswerList)
        }

        setDetailQuestion(newQuestion);
    }

    return (
        <>
            <Box className='Answer' sx={{
                width: '100%',
                height: '40px',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                alignItems: 'center'
            }}>
                <button
                    onClick={() => onDeleteAnswer(answer.answerId)}
                    style={{
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
                <Checkbox
                    checked={answer.isCorrect}
                    onChange={() => onChecked(index)}
                    sx={{
                        height: '75%',
                        width: '5.215%',
                        '& .MuiSvgIcon-root': {
                            fontSize: '35px',
                        },
                    }} />
                <TextField
                    label={`Answer ${++index}`}
                    size='small'
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value)
                    }}
                    onBlur={(e) => {
                        handleAnwserChange(e.target.value);
                    }}
                    sx={{
                        width: '85.57%',
                    }} />
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
    )
})

export default Answer