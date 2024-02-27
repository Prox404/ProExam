import {
    Box, IconButton,
    List,
    ListItem, ListItemSecondaryAction,
    ListItemText,
    Paper,
    Snackbar,
    Switch,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import {useRef, useState} from "react";
import styles from "./UploadExam.module.scss"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import mammoth from 'mammoth';
import not_file from '~/assets/file_empty.svg';
import ic_many from '~/assets/ic_many.svg';
import ic_one from '~/assets/ic_one.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertSuccess from "~/utils/alertSuccess.jsx";
import AlertError from "~/utils/alertError.jsx";
import api from "../../config/api.js"
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate, createSearchParams}  from "react-router-dom";
import {useParams} from "react-router-dom";

function UploadExam() {
    const [selectFile, setSelectFile] = useState(null)
    const inputRef = useRef()
    const [fileData, setFileData] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [openAlertError, setOpenAlertError] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [stateSwitch, setStateSwitch] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState()
    const {id} = useParams();
    // const history = userHistory();

    let questionObject = null;
    let answerRow = null;
    const [questions, setQuestions] = useState([])
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    const handleOnChange = async (event) => {
        const listTemp = [];
        if (event.target.files && event.target.files.length > 0) {
            setSelectFile(event.target.files[0]);
            const file = event.target.files[0];

            const fileReader = new FileReader();
            fileReader.onload = async (data) => {
                const content = data.target.result;
                const result = await mammoth.extractRawText({arrayBuffer: content});
                const lines = result.value.split('\n');
                for (const value of lines) {
                    const index = lines.indexOf(value);
                    const question = value.match(/^Question:(.+)/);
                    const answer = value.match(/^Answer:(.+)/);
                    if (question) {
                        if (questionObject)
                            listTemp.push(questionObject)
                        questionObject = {
                            questionText: question[1].trim(),
                            answers: []
                        }
                        // console.log(questionObject.title);
                    } else if (answer) {
                        if (questionObject && questionObject.answers) {
                            const cleanedAnswerText = answer[1].replace('*', '').trim().toLowerCase();
                            if (!questionObject.answers.find((a) => (a.answerText.toLowerCase() === cleanedAnswerText))) {
                                const isCorrect = answer[1].trim().endsWith('*');
                                answer[1] = answer[1].replace('*', '').trim();
                                answerRow = {
                                    // answerId: `${new Date().getTime()}`,
                                    answerText: answer[1],
                                    isCorrect: isCorrect
                                }
                                questionObject.answers.push(answerRow);
                                await new Promise(resolve => setTimeout(resolve, 1));
                            }
                        }
                        // console.log(questionObject.answer);
                    }

                    if (index === lines.length - 1 && questionObject)
                        listTemp.push(questionObject)
                }
                setQuestions(listTemp)
            }
            fileReader.readAsArrayBuffer(file);
        }
    }

    const chooseFile = () => {
        inputRef.current.click();
    }

    const removeFile = () => {
        setSelectFile(null);
        setFileData('');
        setQuestions([]);
        inputRef.current.value = null;
    }

    const handleChooseAnswer = (index, indexA) => {
        // stateSwitch
        const updatedQuestions = [...questions];
        // if(!stateSwitch) {
        //     for (const value of updatedQuestions[index].answers) {
        //         const indexARow = updatedQuestions[index].answers.indexOf(value);
        //         updatedQuestions[index].answers[indexARow].isCorrect = false;
        //     }
        //     updatedQuestions[index].answers[indexA].isCorrect = true;
        // } else {
            updatedQuestions[index].answers[indexA].isCorrect = !updatedQuestions[index].answers[indexA].isCorrect;
        // }
        setQuestions(updatedQuestions);
    }

    const handleSubmitExam = async () => {
        let isCheck = true;
        for (const value of questions) {
            if (!value.answers.some((correct) => correct.isCorrect === true)) {
                isCheck = false;
            }
        }
        if(isCheck) {
            setSubmitDisabled(true);
            try {
                const response = await api.post(
                    `/exam/uploadQuestions/${id}`,
                    questions,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                if(response.status === 200) {
                // if(true) {
                    removeFile();
                    setOpenAlert(true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setOpenAlert(false);
                    let a = 'asdfbsjdafasd';
                    setSubmitDisabled(false);
                    navigate({
                        pathname: "/code-exam",
                        search: createSearchParams({
                            keyCode: a
                        }).toString()
                    })
                } else {
                    setOpenAlertError(true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setOpenAlertError(false);
                    setSubmitDisabled(false);
                }
            } catch (e) {
                setMessage(e.response?.data);
                setOpenAlertError(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setOpenAlertError(false);
                setSubmitDisabled(false);
            }
        } else {
            setMessage('A question must have at least one answer, please try again.')
            setOpenAlertError(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlertError(false);
            setSubmitDisabled(false);
        }
    }

    return (
        <Box sx={{
            backgroundColor: "white",
            borderRadius: 10,
            margin: '40px',
            height: {
                xs: 'auto',
                sm: 'calc(100vh - var(--header-height) - 80px)'
            },
        }}>
            <Grid container columnSpacing={2} sx={{
                height: '100%',
                display: {
                    xs: 'flex',
                    md: 'flex'
                },
            }}>
                <Grid item xs={12} sm={6} md={4}
                      style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center"
                      }}>
                    <Item>
                        <div
                            className={styles['file']}
                            style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column"
                        }}>
                            <input
                                type={"file"}
                                ref={inputRef}
                                onChange={handleOnChange}
                                style={{display: "none"}}
                                accept=".docx"/>

                            <button className={styles['file-btn']} onClick={chooseFile}>
                                <UploadFileIcon/> Upload File
                            </button>

                            {selectFile && (
                                <div className={styles["selected-file"]}>
                                    <p>{selectFile.name}</p>
                                    <button onClick={removeFile}>
                                        <DeleteIcon/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </Item>
                </Grid>

                <Grid item xs={12} sm={6} md={8}>
                    <Item>{questions.length != 0
                        ? (<Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                            <Box
                                className={styles['img-empty']}
                                sx={{flex: '1', padding: '10px'}}>
                                <Paper sx={{
                                    height: {
                                        xs: 'auto',
                                        sm: "calc(100vh - var(--header-height) - 170px)"
                                    },
                                    overflow: 'auto',
                                    scrollbarWidth: "none"
                                }}>
                                    <List>
                                        {questions.map((value, index) => (
                                            <ListItem key={value.answerId} sx={{
                                                display: {
                                                    xs: 'flex',
                                                    md: 'flex'
                                                },
                                                flexDirection: "column",
                                                alignItems: "start",
                                            }}>
                                                <ListItemText
                                                    primary={<span
                                                    style={{
                                                        fontWeight: 'bold'
                                                    }}
                                                    >{`${index + 1}. ${value.questionText}`}</span>
                                                }/>
                                                <ListItemSecondaryAction style={{top: 23}}>
                                                <IconButton edge="end" aria-label="edit" onClick={() => {
                                                    }}>
                                                        <EditIcon/>
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                                <List>
                                                    {
                                                        value.answers.map((answer, indexA) => (
                                                            <ListItem className={styles['answer']}
                                                                      key={answer.answerText} sx={
                                                                {backgroundColor: answer.isCorrect ? "#CDFFC8 !important" : "white",}}
                                                                      onClick={() => handleChooseAnswer(index, indexA)}
                                                            >
                                                                <ListItemText
                                                                    primary={`${alphabet[indexA]}. ${answer.answerText}`}/>
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                            <Box sx={{margin: 0, padding: '0 10px 10px 10px'}}
                                 style={{
                                     display: "flex",
                                     justifyContent: "space-between",
                                     alignItems: "center",
                                     justifyItems: "center"
                                 }}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Switch
                                        checkedIcon={<img src={ic_many} alt="Checked Icon" style={{
                                            width: 20,
                                            margin: 0,
                                            filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))'
                                        }}/>}
                                        uncheckedIcon={<img src={ic_one} alt="Unchecked Icon" style={{
                                            width: 20,
                                            margin: 0,
                                            filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))'
                                        }}/>}
                                        checked={stateSwitch}
                                        onChange={() => {
                                            setStateSwitch(!stateSwitch);
                                        }}
                                    />
                                    <span
                                        style={{marginLeft: 5, width: '40px'}}>{stateSwitch ? 'Multiple answers' : 'One answer'}</span>
                                </div>
                                <button
                                    type={"submit"}
                                    disabled={submitDisabled}
                                    onClick={handleSubmitExam}
                                    className={styles['btn-submit']}>Finish
                                </button>
                                <div/>
                            </Box>
                        </Box>)
                        : <div
                            className={styles['img-empty']}
                            style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <img className={styles['file-empty']} src={not_file} alt="My SVG Image"/>
                        </div>
                    }
                    </Item>
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                style={{marginTop: '40px'}}
                open={openAlert} autoHideDuration={6000} onClose={() => {
            }}>
                <div>
                    <AlertSuccess/>
                </div>
            </Snackbar>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                style={{marginTop: '40px'}}
                open={openAlertError} autoHideDuration={6000} onClose={() => {
            }}>
                <div>
                    <AlertError message={message}/>
                </div>
            </Snackbar>
        </Box>
    );
}

export default UploadExam;