import {
    Box, Button, IconButton, Input,
    List,
    ListItem, ListItemSecondaryAction,
    ListItemText,
    Snackbar, Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import {useEffect, useRef, useState} from "react";
import styles from "./UploadExam.module.scss"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import mammoth from 'mammoth';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import not_file from '~/assets/file_empty.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertSuccess from "~/utils/alertSuccess.jsx";
import AlertError from "~/utils/alertError.jsx";
import AlertWarning from "~/utils/alertWarning.jsx";
import api from "../../config/api.js"
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

function UploadExam() {
    const [selectFile, setSelectFile] = useState(null)
    const inputRef = useRef()
    const [fileData, setFileData] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [openAlertError, setOpenAlertError] = useState(false)
    const [openAlertWarning, setOpenAlertWarning] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [stateSwitch, setStateSwitch] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState()
    const {id} = useParams();
    const [openEdit, setOpenEdit] = useState(false);
    const [indexEdit, setIndexEdit] = useState(false);
    const [onChangeText, setOnChangeText] = useState(false);
    let [newQuestion, setNewQuestion] = useState(null);
    const [isExam, setIsExam] = useState(false);
    // const history = userHistory();

    let questionObject = null;
    let answerRow = null;
    const [questions, setQuestions] = useState([])
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    useEffect(() => {
        const checkExam = async () => {
            const response = await api.get(`exam/${id}`);
            if (response.status === 200) {
                setIsExam(response.data);
            }
        }
        checkExam();
    }, []);

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

    const handleEditQuestion = async () => {
        if (newQuestion.questionText === '' || newQuestion.answers.some(value => value.answerText === '')) {
            setMessage("Data must not be empty!");
            setOpenAlertWarning(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlertWarning(false);
        } else {
            questions[indexEdit] = newQuestion;
            setOnChangeText(false);
            setOpenEdit(false);
        }
    }

    const editQuestion = (event) => {
        const updatedQuestion = {...questions[indexEdit]};
        updatedQuestion.questionText = event.target.value;
        setOnChangeText(event.target.value !== questions[indexEdit].questionText);
        setNewQuestion(updatedQuestion);
    }

    const editAnswer = (index, event) => {
        const updatedAnswers = [...newQuestion.answers];
        updatedAnswers[index] = {...updatedAnswers[index], answerText: event.target.value};
        setOnChangeText(event.target.value !== newQuestion.answers[index].answerText);
        setNewQuestion({...newQuestion, answers: updatedAnswers});
    };

    const removeAnswer = (index) => {
        const updatedAnswers = [...newQuestion.answers];
        updatedAnswers.splice(index, 1);
        setOnChangeText(updatedAnswers !== newQuestion.answers);
        setNewQuestion({...newQuestion, answers: updatedAnswers});
    }

    const addNewAnswer = async () => {
        if (newQuestion.answers.length !== 20) {
            const updatedAnswers = [...newQuestion.answers];
            updatedAnswers.push({
                answerText: '',
                isCorrect: false
            });
            setOnChangeText(updatedAnswers !== newQuestion.answers);
            setNewQuestion({...newQuestion, answers: updatedAnswers});
        } else {
            setMessage("Maximum number of answers reached!");
            setOpenAlertWarning(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlertWarning(false);
        }
    }

    const addNewQuestion = async () => {
        if(!openEdit) {
            let question = {
                questionText: '',
                answers: [{
                    answerText: '',
                    isCorrect: false
                }]
            }
            setNewQuestion(question);
            setQuestions([...questions, question]);
            setOpenEdit(true);
            setIndexEdit(questions.length);
        } else {
            setMessage("You are in the editing process, please complete it!");
            setOpenAlertWarning(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlertWarning(false);
        }
    };


    const handleSubmitExam = async () => {
        let isCheck = true;
        for (const value of questions) {
            if (!value.answers.some((correct) => correct.isCorrect === true)) {
                isCheck = false;
            }
        }
        if (isCheck && !openEdit) {
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
                if (response.data === false) {
                    setMessage("This assignment already has data, please do not add new ones!");
                    setOpenAlertWarning(true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setOpenAlertWarning(false);
                    setSubmitDisabled(false);
                } else if (response.status === 200) {
                    // if(true) {
                    removeFile();
                    setOpenAlert(true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setOpenAlert(false);
                    setSubmitDisabled(false);
                    navigate({
                        pathname: "/exams",
                        // search: createSearchParams({
                        //     keyCode: a
                        // }).toString()
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
        } else if (openEdit) {
            setMessage("You are in the editing process, please complete it!");
            setOpenAlertWarning(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlertWarning(false);
        } else {
            setMessage('A question must have at least one answer, please try again.')
            setOpenAlertError(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlertError(false);
            setSubmitDisabled(false);
        }
    }

    function endEdit(index) {
        return async () => {
            if (newQuestion.questionText === '' || newQuestion.answers.some(value => value.answerText === '')) {
                setMessage("Data must not be empty!");
                setOpenAlertWarning(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setOpenAlertWarning(false);
            } else {
                setOpenEdit(!openEdit)
                setIndexEdit(-1);
                setNewQuestion(questions[index]);
            }
        };
    }

    const removeQuestion = (async (index) => {
        if(openEdit) {
            setMessage("You are in the editing process, please complete it!");
            setOpenAlertWarning(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlertWarning(false);
        } else {
            setQuestions((prev) => prev.filter((_, indexValue) => indexValue !== index));
            if(questions.filter((_, indexValue) => indexValue !== index).length === 0) {
                removeFile()
            }
        }
    })

    return (
        <>
            <Box
                className="set-time-container animate__animated animate__backInRight"
                sx={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    margin: '40px',
                    height: {
                        xs: 'auto',
                        sm: 'calc(100vh - var(--header-height) - 80px)'
                    },
                }}>
                {(isExam)
                    ? <Grid container columnSpacing={2} sx={{
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
                                        <Box sx={{
                                            height: {
                                                xs: 'auto',
                                                sm: "calc(100vh - var(--header-height) - 170px)"
                                            },
                                            overflow: 'auto',
                                            scrollbarWidth: "none"
                                        }}>
                                            <List>
                                                {questions.map((value, index) => (
                                                    <ListItem key={index} sx={{
                                                        display: {
                                                            xs: 'flex',
                                                            md: 'flex'
                                                        },
                                                        flexDirection: "column",
                                                        alignItems: "start",
                                                    }}>
                                                        {(openEdit && index === indexEdit)
                                                            ? <ListItemText>{`${index + 1}. `}<Input
                                                                value={newQuestion.questionText}
                                                                onChange={editQuestion}/>
                                                            </ListItemText>
                                                            : <ListItemText
                                                                primary={<span
                                                                    style={{
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >{`${index + 1}. ${value.questionText}`}</span>
                                                                }/>
                                                        }
                                                        <ListItemSecondaryAction
                                                            style={{top: 43, display: "flex", flexDirection: "column"}}>
                                                            {(onChangeText && index === indexEdit)
                                                                ?
                                                                <IconButton><CheckRoundedIcon
                                                                    onClick={handleEditQuestion}/></IconButton>
                                                                : ((openEdit && index === indexEdit)
                                                                    ? <IconButton edge="end" aria-label="edit"
                                                                                  onClick={endEdit(index)}>
                                                                        <CloseRoundedIcon/>
                                                                    </IconButton>
                                                                    : <IconButton edge="end" aria-label="edit"
                                                                                  onClick={async () => {
                                                                                      if (indexEdit !== index && openEdit) {
                                                                                          setMessage("You are in the editing process, please complete it!");
                                                                                          setOpenAlertWarning(true);
                                                                                          await new Promise(resolve => setTimeout(resolve, 1000));
                                                                                          setOpenAlertWarning(false);
                                                                                      } else {
                                                                                          setOpenEdit(!openEdit)
                                                                                          setIndexEdit(index);
                                                                                          setNewQuestion(questions[index]);
                                                                                      }
                                                                                  }}>
                                                                        <EditIcon/>
                                                                    </IconButton>)
                                                            }
                                                            <IconButton edge="end" aria-label="edit"
                                                                        onClick={() => removeQuestion(index)}>
                                                                <RemoveIcon/>
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                        <div style={{display: "flex", flexDirection: 'column'}}>
                                                            <List style={{padding: 0}}>
                                                                {((openEdit && index === indexEdit)
                                                                    ? (newQuestion.answers.map((answer, indexA) => (
                                                                        <ListItem key={indexA}>
                                                                            {`${alphabet[indexA]}. `}
                                                                            <Input value={answer.answerText}
                                                                                   onChange={(event) => editAnswer(indexA, event)}/>
                                                                            <IconButton
                                                                                onClick={() => removeAnswer(indexA)}><RemoveIcon/></IconButton>
                                                                        </ListItem>
                                                                    )))
                                                                    : (value.answers.map((answer, indexA) => (
                                                                            <ListItem
                                                                                key={indexA}
                                                                                className={styles['answer']}
                                                                                sx={{backgroundColor: answer.isCorrect ? "#CDFFC8 !important" : "white"}}
                                                                                onClick={() => handleChooseAnswer(index, indexA)}
                                                                            >
                                                                                <ListItemText
                                                                                    primary={`${alphabet[indexA]}. ${answer.answerText}`}/>
                                                                            </ListItem>
                                                                        ))
                                                                    ))}
                                                            </List>
                                                            {(openEdit && index === indexEdit) && (
                                                                <ListItem style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    alignItems: 'flex-end',
                                                                    width: '95%',
                                                                    padding: 0,
                                                                    marginRight: '30px',
                                                                }}>
                                                                    <div style={{
                                                                        flex: 1,
                                                                        marginLeft: '30px',
                                                                        height: .5,
                                                                        backgroundColor: "#757575"
                                                                    }}></div>
                                                                    <IconButton
                                                                        onClick={addNewAnswer}><AddIcon/></IconButton>
                                                                </ListItem>)}

                                                        </div>
                                                    </ListItem>
                                                ))}
                                                <ListItem style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'flex-end',
                                                    width: '100%',
                                                    padding: 0,
                                                    marginRight: '30px',
                                                }}>
                                                    <div style={{
                                                        flex: 1,
                                                        marginLeft: '30px',
                                                        height: .5,
                                                        backgroundColor: "#757575"
                                                    }}></div>
                                                    <IconButton
                                                        onClick={addNewQuestion}><AddIcon/></IconButton>
                                                </ListItem>
                                            </List>
                                        </Box>
                                    </Box>
                                    <Box sx={{margin: 0, padding: '0 10px 10px 10px'}}
                                         style={{
                                             display: "flex",
                                             justifyContent: "center",
                                             alignItems: "center",
                                             justifyItems: "center"
                                         }}>
                                        <button
                                            type={"submit"}
                                            disabled={submitDisabled}
                                            onClick={handleSubmitExam}
                                            className={styles['btn-submit']}>Finish
                                        </button>
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
                    : (<Box sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        justifyItems: "center",
                        alignItems: "center"
                    }}>
                        <img src={not_file} alt={"img empty"} style={{width: '30%', marginBottom: "10px"}}/>
                        <Typography variant={"h5"} style={{marginBottom: "10px", color: "#757575"}}>This test does not exist!</Typography>
                        <Button
                            className={styles['search-form']}
                            style={{
                                padding: "10px",
                                borderRadius: 30,
                                color: '#757575',
                                display: "flex",
                                alignItems: "center",
                                justifyItems: "center",
                                justifyContent: "center"
                            }}
                            onClick={() => {
                                navigate({pathname: "/exams"})
                            }}
                        >
                            <ArrowBackIosIcon/>
                            {'Back'}
                        </Button>
                    </Box>)}
            </Box>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                style={{marginTop: '40px'}}
                open={openAlert} autoHideDuration={6000} onClose={() => {
            }}>
                <div>
                    <AlertSuccess message = {'Upload successful.'}/>
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
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                style={{marginTop: '40px'}}
                open={openAlertWarning} autoHideDuration={6000} onClose={() => {
            }}>
                <div>
                    <AlertWarning message={message}/>
                </div>
            </Snackbar>
        </>

    );
}

export default UploadExam;