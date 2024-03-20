import { useState, useEffect } from 'react';
import { getBankList, deleteAnwser, storeQuestions, deleteQuestions, deleteBank, addNewBank, updateBankName } from '~/services/bankService';
import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    IconButton,
    Typography,
    TextField,
    Button,
    Checkbox,
    Snackbar,
    Alert,
    Dialog,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useTheme } from '@mui/material';
import { Delete, Close, Add, Edit } from '@mui/icons-material';
import Loading from '~/components/Loading';
import { LoadingButton } from '@mui/lab';

function QuestionBank() {
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [fetchinng, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [content, setContent] = useState('');
    const [severity, setSeverity] = useState('error');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('addBank');
    const [newBankName, setNewBankName] = useState('');
    const [editBankName, setEditBankName] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const theme = useTheme();
    const debounceSelectedBank = useDebounce(selectedBank, 1000);

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
        // Gửi yêu cầu API để lấy danh sách bank
        if (!user?.userId) {
            console.log('User not found');
            return;
        }

        async function fetch() {
            setFetching(true);
            const res = await getBankList(user?.userId);
            if (res.status === 200) {
                setBanks(res?.data);
                setSelectedBank(res?.data[0]);
            } else {
                console.log(res);
            }
            setFetching(false);
        }
        fetch();
    }, []);

    const handleBankClick = (bank) => {
        console.log(bank);
        setSelectedBank(bank);

    };

    const handleQuestionChange = (index, value) => {
        let newSelectedBank = { ...selectedBank };
        newSelectedBank.question[index].questionText = value;
        setSelectedBank(newSelectedBank);

    }

    const handleDeleteAnswer = async (questionIndex, answerIndex, answerId) => {
        if (selectedBank.question[questionIndex].answers.length <= 2) {
            handleShowSnackBar('The question requires at least two answers !', 'error');
            return;
        } else {
            if (answerId) {
                const res = await deleteAnwser(answerId);
                if (res.status === 200) {
                    let newSelectedBank = { ...selectedBank };
                    newSelectedBank.question[questionIndex].answers.splice(answerIndex, 1);
                    setSelectedBank(newSelectedBank);
                } else {
                    console.log(res);
                }
            } else {
                let newSelectedBank = { ...selectedBank };
                newSelectedBank.question[questionIndex].answers.splice(answerIndex, 1);
                setSelectedBank(newSelectedBank);

            }
        }
    }

    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        if (selectedBank.question[questionIndex].answers.filter(answer => answer.isCorrect).length <= 1) {
            handleShowSnackBar('The question requires at least one correct answer !', 'error');
            return;
        } else {
            let newSelectedBank = { ...selectedBank };
            newSelectedBank.question[questionIndex].answers[answerIndex].isCorrect = !newSelectedBank.question[questionIndex].answers[answerIndex].isCorrect;
            setSelectedBank(newSelectedBank);
        }

    }

    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        let newSelectedBank = { ...selectedBank };
        newSelectedBank.question[questionIndex].answers[answerIndex].answerText = value;
        setSelectedBank(newSelectedBank);

    }

    const handleDeleteQuestion = async (questionId, index) => {
        if (selectedBank.question.length <= 1) {
            handleShowSnackBar('The bank requires at least one question !', 'error');
            return;
        }
        if (questionId) {
            const res = await deleteQuestions(questionId);
            if (res.status === 200) {
                const updatedQuestions = selectedBank.question.filter(question => question.questionId !== questionId);
                setSelectedBank(prevState => ({
                    ...prevState,
                    question: updatedQuestions
                }));
            } else {
                handleShowSnackBar(res?.message || 'Delete failed !', 'error');
            }
        } else {
            let newSelectedBank = { ...selectedBank };
            newSelectedBank.question.splice(index, 1);
            setSelectedBank(newSelectedBank);
        }

    };

    const handleAddAnswer = (questionIndex) => {
        let newSelectedBank = { ...selectedBank };
        newSelectedBank.question[questionIndex].answers.push({ answerText: '', isCorrect: false });
        setSelectedBank(newSelectedBank);


    }

    const handleAddQuestion = () => {
        let newSelectedBank = { ...selectedBank };
        newSelectedBank.question.push({
            questionText: '', answers: [
                { answerText: '', isCorrect: true },
                { answerText: '', isCorrect: false }
            ]
        });
        setSelectedBank(newSelectedBank);
    }

    const handleSaveBank = async () => {
        setLoading(true);
        const questionStore = selectedBank.question;
        const res = await storeQuestions(selectedBank.bank.bankId, questionStore);
        if (res?.length > 0) {
            handleShowSnackBar('Save success !', 'success');
            setSelectedBank({ ...selectedBank, question: res });
            setLoading(false);
        } else {
            handleShowSnackBar(res?.message || 'Save failed !', 'error');
            setLoading(false);
        }
    }

    const handleDeleteBank = async (bankId) => {
        const res = await deleteBank(bankId);
        if (res.status === 200) {
            setBanks(banks.filter(bank => bank.bank.bankId !== bankId));
            setSelectedBank(banks[0] || null);
            handleShowSnackBar('Delete success !', 'success');
        } else {
            handleShowSnackBar(res?.message || 'Delete failed !', 'error');
        }
    }

    const handleAddNewBank = async () => {
        if (!user?.userId) {
            handleShowSnackBar('User not found, please re-login !', 'error');
            return;
        }
        if (!newBankName) {
            handleShowSnackBar('Bank name is required !', 'error');
            return;
        }
        const data = {
            bankName: newBankName,
            user: {
                userId: user.userId
            }
        }

        const res = await addNewBank(data);
        if (res.status === 200) {
            setBanks([...banks, { bank: res?.data, question: [] }]);
            setDialogOpen(false);
            handleShowSnackBar('Add bank success !', 'success');
            setSelectedBank({ bank: res?.data, question: [] });
        } else {
            handleShowSnackBar(res?.message || 'Add bank failed !', 'error');
        }

    }

    const handleShowDialog = (type) => {
        setDialogType(type);
        setDialogOpen(true);
    }

    const renderDialog = (dialogType) => {
        switch (dialogType) {
            case 'addBank':
                return renderAddBankDialog();
            case 'editBank':
                return renderEditBankName();
            default:
                return null;
        }
    }

    const renderAddBankDialog = () => {
        return <>
            <Box sx={{
                padding: '10px 10px 0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
            }}>Add new bank !
            </Box>
            <Box sx={{
                paddingY: '15px',
                paddingX: '10px',
                minWidth: '300px',
            }}>
                <TextField size='small'
                    label="Bank name"
                    variant="outlined" fullWidth
                    onBlur={(e) => setNewBankName(e.target.value)} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button sx={{
                        textTransform: "none",
                        marginRight: '10px',
                    }}
                        onClick={() => setDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant='contained' color='primary' sx={{ textTransform: 'none' }} onClick={handleAddNewBank}>Add</Button>
                </Box>
            </Box>
        </>
    }

    const handleUpdateBankName = async () => {
        if (!editBankName) {
            handleShowSnackBar('Bank name is required !', 'error');
            return;
        }
        const res = await updateBankName(selectedBank.bank.bankId, editBankName);
        if (res.status === 200) {
            setBanks(banks.map(bank => bank.bank.bankId === selectedBank.bank.bankId ? { ...bank, bank: { ...bank.bank, bankName: editBankName } } : bank));
            setSelectedBank({ ...selectedBank, bank: { ...selectedBank.bank, bankName: editBankName } });
            setDialogOpen(false);
            handleShowSnackBar('Update bank name success !', 'success');
        } else {
            handleShowSnackBar(res?.message || 'Update bank name failed !', 'error');
        }
    }

    const renderEditBankName = () => {
        return <>
            <Box sx={{
                padding: '10px 10px 0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
            }}>Edit bank name !
            </Box>
            <Box sx={{
                paddingY: '15px',
                paddingX: '10px',
                minWidth: '300px',
            }}>
                <TextField size='small'
                    label="Bank name"
                    variant="outlined" fullWidth
                    onBlur={(e) => setEditBankName(e.target.value)} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button sx={{
                        textTransform: "none",
                        marginRight: '10px',
                    }}
                        onClick={() => setDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant='contained' color='primary' sx={{ textTransform: 'none' }} onClick={handleUpdateBankName}>Add</Button>
                </Box>
            </Box>
        </>
    }

    console.log('re-render');

    return (
        <Box sx={{
            display: 'flex',
            background: theme.palette.cardBackground,
            // padding: '20px 0 20px 20px',
            paddingLeft: '15px',
            borderRadius: '20px',
            overflow: 'hidden',
            height: 'calc(100vh - 40px)',
        }}>
            <Box sx={{ minWidth: {
                xs: '200px',
                md: '250px',
            }, paddingRight: '15px', paddingY: '15px', borderRight: `1px solid ${theme.palette.lineColor}` }}>
                <Typography variant="h5">Banks</Typography>
                <Button variant='contained'
                    color='primary' startIcon={<Add />}
                    onClick={() => handleShowDialog('addBank')}
                    fullWidth sx={{ textTransform: 'none', marginTop: '15px', marginBottom: '5px' }}
                    disableElevation>Add bank</Button>
                <List>
                    {banks.map((bank, index) => (
                        <ListItemButton
                            key={bank?.bank?.bankId}
                            selected={selectedBank && selectedBank?.bank?.bankId === bank?.bank?.bankId}
                            onClick={() => handleBankClick(bank)}
                        >
                            <ListItemText primary={bank?.bank?.bankName} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            <Box sx={{ flex: '2 1 0', overflow: 'auto', paddingY: '15px', paddingLeft: '15px' }}>
                {selectedBank && (
                    <>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingRight: '15px',
                        }}>
                            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                                <Typography variant="h5">{selectedBank.bank.bankName}</Typography>
                                <IconButton size='small' sx={{
                                    marginLeft: '10px',
                                }}
                                    onClick={() => handleShowDialog('editBank')}
                                >
                                    <Edit fontSize='small' />
                                </IconButton>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}>

                                <Button variant='contained' color='error' size='small' startIcon={<Delete />} sx={{
                                    textTransform: 'none',
                                }}
                                    onClick={() => handleDeleteBank(selectedBank.bank.bankId)}
                                >
                                    Delete bank
                                </Button>
                            </Box>
                        </Box>
                        <List>
                            {selectedBank?.question?.map((question, index) => (


                                <Box
                                    className={`${question.questionId}`}
                                    key={question.questionId}
                                    sx={{
                                        backgroundColor: theme.palette.cardBackground,
                                        borderRadius: "10px",
                                        position: "relative",
                                        justifyContent: "flex-end",
                                        alignItems: "flex-start",
                                        padding: {
                                            xs: "15px",
                                            sm: "20px",
                                        },
                                        height: "auto",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            label={`Question ${index + 1}:`}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            defaultValue={question.questionText}
                                            onBlur={(e) => handleQuestionChange(index, e.target.value)}
                                            sx={{
                                                marginBottom: "10px",
                                            }}
                                        />
                                    </Box>

                                    {question.answers.map((answer, answerIndex) => (
                                        <Box
                                            key={answerIndex}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <IconButton
                                                sx={{
                                                    color: theme.palette.trashColor,
                                                    marginRight: "5px",
                                                    "&:hover": {
                                                        color: "#435ebe",
                                                    },
                                                }}
                                                onClick={() => {
                                                    handleDeleteAnswer(index, answerIndex, answer?.answerId);
                                                }}
                                            >
                                                <Close />
                                            </IconButton>
                                            <Checkbox
                                                color="info"
                                                checked={answer.isCorrect}
                                                onChange={() => handleCorrectAnswerChange(index, answerIndex)}
                                            />

                                            <TextField
                                                label={`Answer ${answerIndex + 1}`}
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                defaultValue={question.answers[answerIndex].answerText}
                                                onBlur={(e) =>
                                                    handleAnswerChange(index, answerIndex, e.target.value)
                                                }
                                                sx={{ marginLeft: "5px" }}
                                            />
                                        </Box>
                                    ))}
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginTop: "15px",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}>

                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddAnswer(index)}
                                            sx={{
                                                color: theme.palette.textColorSecondary,
                                                textTransform: "none",
                                            }}
                                        >
                                            Add answer
                                        </Button>

                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteQuestion(question?.questionId, index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Box>


                            ))}
                            <center>

                                <Button onClick={handleAddQuestion}
                                    size='small'
                                    variant='contained'
                                    disableElevation sx={{
                                        textTransform: 'none',
                                    }}>
                                    <Add /> Add question
                                </Button>
                            </center>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "end",
                                paddingRight: '20px',
                            }}>
                                <LoadingButton loading={loading}
                                    onClick={handleSaveBank}
                                    variant='contained'
                                    disableElevation sx={{
                                        textTransform: 'none',
                                    }}>
                                    Save
                                </LoadingButton>
                            </Box>
                        </List>
                    </>
                )}
            </Box>
            <Dialog open={dialogOpen} sx={{
            }} onClose={() => setDialogOpen(false)}>
                {renderDialog(dialogType)}
            </Dialog>
            <Loading isOpen={fetchinng} />
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
    );
}

export default QuestionBank;