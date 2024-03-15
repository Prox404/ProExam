import {
    Box, Button, IconButton, Input,
    List,
    ListItem, ListItemSecondaryAction,
    ListItemText,
    Snackbar, Typography,
    Alert
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
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import {upLoadQuestion, getExamById} from "~/services/examService";
import Download from "@mui/icons-material/Download";

// import template from "~/assets/files/TEMPLATE.docx";

function UploadExam() {
    const [selectFile, setSelectFile] = useState(null)
    const inputRef = useRef()
    const [fileData, setFileData] = useState('')
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [content, setContent] = useState('');
    const [severity, setSeverity] = useState('error');
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const [openEdit, setOpenEdit] = useState(false);
    const [indexEdit, setIndexEdit] = useState(false);
    const [onChangeText, setOnChangeText] = useState(false);
    let [newQuestion, setNewQuestion] = useState(null);
    const [isExam, setIsExam] = useState(false);

    let questionObject = null;
    let answerRow = null;
    const [questions, setQuestions] = useState([])
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    useEffect(() => {
        console.log(id);
        const checkExam = async () => {
            const response = await getExamById(id);
            if (response.status === 200) {
                setIsExam(response.data);
            }
        }
        checkExam();
    }, [id]);

    const handleOnChange = async (event) => {
        const listTemp = [];
        if (event.target.files && event.target.files.length > 0) {
            setSelectFile(event.target.files[0]);
            const file = event.target.files[0];

            // Kiểm tra định dạng của file
            if (!file.name.toLowerCase().endsWith('.docx')) {
                removeFile();
                handleShowSnackBar('File format is incorrect, please try again!', 'error');
                return;
            }

            const fileReader = new FileReader();
            fileReader.onload = async (data) => {
                const content = data.target.result;
                const result = await mammoth.extractRawText({arrayBuffer: content});
                const lines = result.value.split('\n');
                var key = -1;
                var indexAnswer = -1;
                for (const value of lines) {
                    const index = lines.indexOf(value);
                    const question = value.match(/^Question:(.+)/);
                    const answer = value.match(/^Answer:(.+)/);
                    const text = value.trim();
                    if (question) {
                        if (questionObject)
                            listTemp.push(questionObject)
                        key = 0;
                        indexAnswer = -1;
                        questionObject = {
                            questionText: question[1].trim(),
                            answers: []
                        }
                    } else if (answer) {
                        if (questionObject && questionObject.answers) {
                            key = 1;
                            const cleanedAnswerText = answer[1].replace('*', '').trim().toLowerCase();
                            if (!questionObject.answers.find((a) => (a.answerText.toLowerCase() === cleanedAnswerText))) {
                                const isCorrect = answer[1].trim().endsWith('*');
                                answer[1] = answer[1].replace('*', '').trim();
                                answerRow = {
                                    answerText: answer[1],
                                    isCorrect: isCorrect
                                }
                                questionObject.answers.push(answerRow);
                                indexAnswer += 1;
                                await new Promise(resolve => setTimeout(resolve, 1));
                            }
                        }
                    } else {
                        if (key === 0 && text !== '') {
                            questionObject.questionText += `\n${text}`;
                        } else if (key === 1 && text !== '') {
                            if (questionObject.answers[indexAnswer]) {
                                questionObject.answers[indexAnswer].answerText += `\n${text}`;
                            }
                        }
                    }

                    if (index === lines.length - 1 && questionObject)
                        listTemp.push(questionObject)
                }
                if (listTemp.length != 0)
                    setQuestions(listTemp)
                else {
                    removeFile();
                    handleShowSnackBar('File has no data or is invalid, please enter again!', 'warning');
                }
            }
            fileReader.readAsArrayBuffer(file);
        } else {
            handleShowSnackBar('Data must not be empty!', 'warning');
        }
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Xử lý các sự kiện kéo và thả ở đây (nếu cần)
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = e.dataTransfer.files;
        // event.target.files = a;
        if (droppedFiles.length > 0) {
            const file = droppedFiles[0];
            // Thêm một đối tượng sự kiện giả mạo với thuộc tính target.files để truyền vào handleOnChange
            const fakeEvent = {
                target: {
                    files: [file]
                }
            };
            handleOnChange(fakeEvent);
            setSelectFile(file);
        }
    };


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
        const updatedQuestions = [...questions];
        updatedQuestions[index].answers[indexA].isCorrect = !updatedQuestions[index].answers[indexA].isCorrect;
        setQuestions(updatedQuestions);
    }

    const handleEditQuestion = async () => {
        if (newQuestion.questionText === '' || newQuestion.answers.some(value => value.answerText === '')) {
            handleShowSnackBar('Data must not be empty!', 'warning');
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
            handleShowSnackBar('Maximum number of answers reached!', 'warning');
        }
    }

    const addNewQuestion = async () => {
        if (!openEdit) {
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
            handleShowSnackBar('You are in the editing process, please complete it!', 'warning');
        }
    };

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
                const response = await upLoadQuestion(id, questions);
                if (response.status === 400) {
                    handleShowSnackBar('This assignment already has data, please do not add new ones!');
                    setSubmitDisabled(false);
                } else if (response.status === 200) {
                    // if(true) {
                    removeFile();
                    handleShowSnackBar('Upload successfully', 'success');
                    setSubmitDisabled(false);
                    navigate('/exams');
                } else {
                    handleShowSnackBar('Upload failed, please try again!');
                    setSubmitDisabled(false);
                }
            } catch (e) {
                handleShowSnackBar(e.response?.data);
                setSubmitDisabled(false);
            }
        } else if (openEdit) {
            handleShowSnackBar('You are in the editing process, please complete it!');
        } else {
            handleShowSnackBar('A question must have at least one answer, please try again.');
            setSubmitDisabled(false);
        }
    }

    function endEdit(index) {
        return async () => {
            if (newQuestion.questionText === '' || newQuestion.answers.some(value => value.answerText === '')) {
                handleShowSnackBar('Data must not be empty!', 'warning');
            } else {
                setOpenEdit(!openEdit)
                setIndexEdit(-1);
                setNewQuestion(questions[index]);
            }
        };
    }

    const removeQuestion = (async (index) => {
        if ((newQuestion.questionText !== '' || newQuestion.answers.some(value => value.answerText !== '')) && openEdit) {
            console.log(indexEdit, index);
            handleShowSnackBar('You are in the editing process, please complete it!');
        } else {
            setQuestions((prev) => prev.filter((_, indexValue) => indexValue !== index));
            if (questions.filter((_, indexValue) => indexValue !== index).length === 0) {
                removeFile()
            }
            setOpenEdit(false)
        }
    })

    return (
        <>
            <Box
                className="set-time-container animate__animated animate__backInRight"
                sx={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    margin: {
                        xs: '20px',
                        sm: '40px'
                    },
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
                        marginLeft: 0,
                        width: "100%",
                        flexDirection: {
                            xs: 'column-reverse',
                            sm: 'row'
                        }
                    }}>
                        <Grid item xs={12} sm={5} md={4}
                              style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  padding: "20px",

                              }}>
                            <Item sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}>
                                <Box sx={{
                                    flex: 1,
                                }}></Box>
                                <div
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onDragLeave={handleDrag}
                                    className={styles['file']}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        width: "100%",
                                        flex: 1
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
                                <Box sx={{
                                    width: "100%",
                                    textAlign: "center",
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "end",
                                    alignItems: "center",
                                    marginTop: {
                                        xs: '20px',
                                        sm: '0'
                                    }
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                    }}>
                                        <Box sx={{
                                            height: '2px',
                                            width: '100%',
                                            flex: 1,
                                            backgroundColor: "#6f6f6f7d"
                                        }}></Box>
                                        <Box sx={{
                                            margin: '0 10px',
                                            textAlign: 'center',
                                        }}>
                                            Don't have a template?
                                        </Box>
                                        <Box sx={{
                                            height: '2px',
                                            width: '100%',
                                            flex: 1,
                                            backgroundColor: "#6f6f6f7d"
                                        }}></Box>
                                    </Box>
                                    <Button variant="contained" sx={{
                                        textTransform: 'none',
                                        marginTop: '10px',
                                    }} startIcon={<Download/>}
                                            href={new URL(`~/assets/files/template.docx`, import.meta.url).href}
                                            download="template.docx"
                                    >
                                        Download template
                                    </Button>
                                </Box>
                            </Item>
                        </Grid>

                        <Grid item xs={12} sm={7} md={8}>
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
                                                                multiline={true}
                                                                onChange={editQuestion}/>
                                                            </ListItemText>
                                                            : <ListItemText
                                                                primary={<span
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                        maxWidth: '600px',
                                                                        overflow: "hidden"
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
                                                                                          handleShowSnackBar('You are in the editing process, please complete it!', 'warning');
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
                                                                                   multiline={true}
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
                                                                                    sx={{
                                                                                        maxWidth: '600px',
                                                                                        overflow: "hidden",
                                                                                        whiteSpace: "pre-line"
                                                                                    }}
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
                        <Typography variant={"h5"} style={{marginBottom: "10px", color: "#757575"}}>This test does not
                            exist!</Typography>
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
            <Snackbar open={snackbarOpen} autoHideDuration={1000} onClose={handleCloseSnackBar}>
                <Alert
                    onClose={handleCloseSnackBar}
                    severity={severity}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {content ? content : 'Invalid input'}
                </Alert>
            </Snackbar>
        </>

    );
}

export default UploadExam;