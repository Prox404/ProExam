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
const Answer = forwardRef(({ answer, index, answerText, isCorrect:status, getQuestion, updateQuestion },ref) => {
    const [isOpenA, setIsOpenA] = useState(false);
    const [statusA, setStatusA] = useState('success');
    const [messageA, setMessageA] = useState('');
    const [content, setContent] = useState(answerText);
    const [isCorrect, setIsCorrect] = useState(status);
    const showAlert = (status, message) => {
        setStatusA(status);
        setMessageA(message);
        setIsOpenA(true);
    };

    useImperativeHandle(ref, () => ({
        getData: () => {
          return {
                answerId: answer.answerId,
                answerText: content,
                isCorrect: isCorrect
            };
        },
      }));
    const onDeleteAnswer = async (id) => {
        const question = getQuestion();
        if (isCorrect) {
            if (question.questionType === 'SINGLE_CHOICE') {
                showAlert('error', 'The answer requires at least one correct answer');
                return;
            }
        }
        
        if (question.answers.length > 2) {
            const newListAnswer = question.answers.filter(item => item.answerId !== id);
            updateQuestion(question.questionText, newListAnswer, isType(newListAnswer));
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

    const onChecked = (id) => {
        const question = getQuestion();
        if (isCorrect) {
            if (question.questionType === 'SINGLE_CHOICE') {
                showAlert('error', 'The answer requires at least one correct answer');
                return;
            }
        }
        const newListAnswer = question.answers.filter(item => {
            if(item.answerId === id) {
                item.isCorrect = !item.isCorrect;
                return item;
            }
            return item;
        })
        updateQuestion(question.questionText, newListAnswer, isType(newListAnswer));
        setIsCorrect(!isCorrect);
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
                    checked={isCorrect}
                    onChange={() => onChecked(answer.answerId)}
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