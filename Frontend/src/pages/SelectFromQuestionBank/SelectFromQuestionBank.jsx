import {
    Box,
    ListItemButton,
    ListItemText,
    Card,
    CardHeader,
    Divider,
    List,
    ListItemIcon,
    Checkbox,
    Grid,
    Snackbar,
    Alert,
    Typography,
    Button,
} from "@mui/material";
import { useState, useEffect } from "react"
import { getBankList } from "~/services/bankService"
import { useTheme } from "@mui/material";
import { createQuestionManually } from "~/services/examService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function SelectAllTransferList() {
    const [bankList, setBankList] = useState([]);
    const [selectedBank, setSelectedBank] = useState();
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [checked, setChecked] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [content, setContent] = useState('');
    const [severity, setSeverity] = useState('error');
    let userId = JSON.parse(localStorage.getItem('user')).userId;
    const {examId} = useParams();
    const theme = useTheme();
    const navigate = useNavigate();

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

    useEffect(() => {
        async function fetch() {
            const res = await getBankList(userId);
            if (res.status === 200) {
                setBankList(res.data);
                setSelectedBank(res.data[0]);
                setQuestions(res.data[0]?.question);
            }
        }

        fetch();
    }, []);

    const questionsChecked = intersection(checked, questions);
    const selectedQuestionsChecked = intersection(checked, selectedQuestions);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setSelectedQuestions(selectedQuestions.concat(questionsChecked));
        setQuestions(not(questions, questionsChecked));
        setChecked(not(checked, questionsChecked));
    };

    const handleCheckedLeft = () => {
        setQuestions(questions.concat(selectedQuestionsChecked));
        setSelectedQuestions(not(selectedQuestions, selectedQuestionsChecked));
        setChecked(not(checked, selectedQuestionsChecked));
    };

    const handleBankClick = (bank) => {
        setSelectedBank(bank);
        setQuestions(bank.question.filter(question => !selectedQuestions.includes(question)));
    }

    const handleSaveToExam = async () => {
        //remove questionId and answerId from selectedQuestions
        let questions = selectedQuestions.map(question => {
            let answers = question.answers.map(answer => {
                delete answer.answerId;
                return answer;
            });
            delete question.questionId;
            question.answers = answers;
            return question;
        });

        //store to exam
        if (examId) {
            const res = await createQuestionManually({questions, examId});
            if (res.length > 0) {
                handleShowSnackBar('Save successfully', 'success');
                setTimeout(() => {
                    navigate(`/exams`);
                }, 1000);
            }else{
                handleShowSnackBar('Save failed');
            }
        }
    }

    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


    const customList = (title, items) => (
        <Box sx={{
            height: '100%',
        }}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: '100%',
                    bgcolor: theme.palette.cardBackground,
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value, index) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItemButton
                            key={value.questionId}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <Box>
                                <Typography sx={{
                                    fontWeight: 'bold',
                                }} variant="body1">{(index + 1) + '.' + value.questionText}</Typography>
                                {value?.answers?.map((answer, index__) => {
                                    return <Box key={answer.answerId} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{width: '25px'}}>
                                        {answer.isCorrect && '✔️'}
                                        </Box>
                                        <Typography variant="body2">{alphabet[index__] + '.' + answer.answerText}</Typography>
                                    </Box>
                                })}
                            </Box>
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );


    return <>
        <Box sx={{
            height: 'calc(100vh - 40px)',
            overflow: 'hidden',
            backgroundColor: theme.palette.cardBackground,
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'row',
        }}>
            <Box sx={{
                width: {
                    xs: '200px',
                    md: '250px'
                },
                borderRight: `1px solid ${theme.palette.lineColor}`,
            }}>
                {bankList.map((bank, index) => (
                    <ListItemButton
                        key={bank?.bank?.bankId}
                        selected={selectedBank && selectedBank?.bank?.bankId === bank?.bank?.bankId}
                        onClick={() => handleBankClick(bank)}
                    >
                        <ListItemText primary={bank?.bank?.bankName} />
                    </ListItemButton>
                ))}
            </Box>
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                
                height: 'calc(100vh - 40px)',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: 1,
                    // overflowY: 'auto',
                    paddingTop: '10px',
                }}>
                    <Box sx={{
                        flex: 1,
                        height: '100%',
                        borderRight: `1px solid ${theme.palette.lineColor}`,
                    }}>{customList('Choices', questions)}</Box>
                    <Box sx={{
                        height: '100%',
                        margin: '0 10px',
                    }}>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={questionsChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={selectedQuestionsChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                        </Grid>
                    </Box>
                    <Box sx={{
                        flex: 1,
                        height: '100%',
                        borderLeft: `1px solid ${theme.palette.lineColor}`,
                    }}>{customList('Chosen', selectedQuestions)}</Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: 'background.paper',
                    borderTop: `1px solid ${theme.palette.lineColor}`,
                    zIndex: 1,
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveToExam}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={1000} onClose={handleCloseSnackBar}>
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
    </>
}
