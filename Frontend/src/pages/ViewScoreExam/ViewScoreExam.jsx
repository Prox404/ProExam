import 'animate.css';
import { Box, Button, Typography, Slider, SvgIcon, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Header from '../../components/Header'
import React from 'react'
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material';
import Check from '~/assets/Check.svg';
import Close from '~/assets/Close.svg';
import BoxSearch from '~/assets/BoxSearch.svg';
import styles from './ViewScoreExam.module.scss'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getExamResult } from '~/services/examService';
import { Avatar } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ExamResult from './ExamResult';

const ViewScoreExam = () => {
    const theme = useTheme();
    const [accuracy, setAccuracy] = useState(0);
    const [correctScore, setCorrectScore] = useState(0);
    const [incorrectScore, setIncorrectScore] = useState(0);
    const [unattempted, setUnattempted] = useState(0);
    const [examResult, setExamResult] = useState({});
    const [examData, setExamData] = useState({});
    const navigate = useNavigate();

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: '#673ab7',
                color: '#fff',
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1] && name.split(' ')[1][0]}`,
        };
    }

    const { id } = useParams();
    useEffect(() => {
        const fetchExamResult = async () => {
            if (!id) {
                navigate('/404');
            }
            const res = await getExamResult(id);
            if (res?.status === 200) {
                const correctAnswers = res?.histories.filter(history => {
                    const question = res?.questions.find(q => q.questionId === history.questionId);
                    return question.answers.some(answer => answer.answerId === history.selectedAnswerId && answer.isCorrect);
                }).length;

                const wrongAnswers = res?.histories.length - correctAnswers;
                const unattemptedQuestions = res?.questions.filter(question => !res?.histories.some(history => history.questionId === question.questionId)).length;
                const correctPercentage = res?.examResult?.score * 10;

                setAccuracy(correctPercentage);
                setCorrectScore(correctAnswers);
                setIncorrectScore(wrongAnswers);
                setUnattempted(unattemptedQuestions);
                setExamResult(res?.examResult);
                setExamData({
                    questions: res?.questions,
                    histories: res?.histories
                });
            }
        }
        fetchExamResult();
    }, [id]);
    console.log(accuracy);

    return (
        <div>
            <Header />
            <Grid sx={{
                background: theme.palette.defaultBackground,
                width: '100%',
                minHeight: 'calc(100vh - var(--header-height))',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '30px',
                    padding: '30px 0px ',
                }}>
                    {/* box dad 1 */}
                    <Box sx={{
                        backgroundColor: theme.palette.primaryCard,
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        padding: '20px',
                        color: '#fff'
                    }}>
                        {/* box th vang ngu lz */}

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '20px'
                        }}>
                            <Box textAlign={'center'}>
                                <Typography variant='h2' sx={{
                                    fontWeight: '400',
                                }}>
                                    {examResult?.score || '0'}
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '10px',
                                alignItems: 'center'
                            }}>
                                <Avatar {...stringAvatar(examResult?.userAnswer?.userAnswerName || 'Unknown')} />
                                <Typography sx={{
                                    fontWeight: 'bold',
                                    fontSize: {
                                        xs: '20px',
                                        sm: '20px'
                                    },
                                    color: '#fff',
                                    textAlign: 'left'
                                }}>
                                    {examResult?.userAnswer?.userAnswerName}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant='body1' sx={{
                            fontWeight: '500',
                        }}>
                            Result infomation
                        </Typography>
                        <Table>
                            <TableBody sx={{
                                '& tr:last-child td': {
                                    borderBottom: 'none'
                                },
                                '& tr td': {
                                    color: '#fff !important'
                                },
                                '& tr td:last-child': {
                                    textAlign: 'right'
                                }
                            }}>
                                <TableRow>
                                    <TableCell>
                                        Start time
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(examResult?.startTime || new Date()), 'dd/MM/yyyy HH:mm')}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        End time:
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(examResult?.startTime || new Date()), 'dd/MM/yyyy HH:mm')}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Typography variant='body1' sx={{
                            fontWeight: '500',
                        }}>
                            Exam infomation
                        </Typography>
                        <Table>
                            <TableBody sx={{
                                '& tr:last-child td': {
                                    borderBottom: 'none'
                                },
                                '& tr td': {
                                    color: '#fff !important'
                                },
                                '& tr td:last-child': {
                                    textAlign: 'right'
                                }
                            }}>
                                <TableRow>
                                    <TableCell>
                                        Exam name
                                    </TableCell>
                                    <TableCell>
                                        {examResult?.exam?.examName || 'Unknown'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Exam start time:
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(examResult?.exam?.examStartTime || new Date()), 'dd/MM/yyyy HH:mm')}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Exam end time:
                                    </TableCell>
                                    <TableCell>
                                        {examResult?.exam?.examEndTime ? format(new Date(examResult?.exam?.examEndTime), 'dd/MM/yyyy HH:mm') : 'Infinity'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Keycode:
                                    </TableCell>
                                    <TableCell>
                                        {examResult?.exam?.keyCode || 'Unknown'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Duration:
                                    </TableCell>
                                    <TableCell>
                                        {examResult?.exam?.duration === 0 ? 'No Limit' : Math.floor(examResult?.exam?.duration / 60) + 'minutes'}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                    {/* box dad 2 */}
                    <Box sx={{
                        background: theme.palette.primaryCard,
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        padding: '10px 20px',
                    }}>
                        <Box>
                            {/*accuracy number */}
                            <Typography sx={{
                                fontWeight: 'bold',
                                // lineHeight: '35px',
                                fontSize: '25px',
                                color: '#fff'
                            }}>
                                Accurary
                            </Typography>
                            <Box sx={{
                                padding: '0 25px'
                            }}>
                                <Slider color='primary'
                                    aria-label="accuracy"
                                    valueLabelDisplay="on" disabled defaultValue={0} value={accuracy} sx={{
                                        height: {
                                            xs: '15px',
                                            sm: '25px'
                                        },
                                        marginTop: '40px',
                                        color: 'red',
                                        '& .MuiSlider-thumb': {
                                            width: {
                                                xs: '25px',
                                                sm: '50px'
                                            },
                                            height: {
                                                xs: '25px',
                                                sm: '50px'
                                            },
                                            color: '#E05151'
                                            // Nguyễn Trần Anh Thắng
                                        },
                                        '& .MuiSlider-track': {
                                            backgroundColor: '#E05151',
                                            borderColor: '#E05151',
                                        },
                                        '& .MuiSlider-valueLabelOpen': {
                                            backgroundColor: '#fff',
                                            borderRadius: '5px',
                                            color: '#000'
                                        },
                                    }} />
                            </Box>
                        </Box>
                    </Box>

                    {/* box dad 3 */}
                    <Box sx={{
                        background: theme.palette.primaryCard,
                        width: '80%',
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        borderRadius: '10px',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                        padding: {
                            xs: '10px',
                            sm: '10px'
                        }
                    }}>
                        {/* box correct */}
                        <Box sx={{
                            width: {
                                xs: '80%',
                                sm: '30%'
                            },
                            minHeight: '90px',
                            background: '#8594ca',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            margin: {
                                xs: '10px',
                                sm: '10px'
                            }
                            // gap: '5px',
                        }}>
                            <Box className="boxTop">
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '20px',
                                    gap: '5px'
                                }}>
                                    <Box className="iconBox" sx={{
                                        marginTop: '5px'
                                    }}>
                                        <img src={Check} alt='check'></img>
                                    </Box>
                                    <Box className="correctScore">
                                        <Typography sx={{
                                            fontSize: '35px',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                        }}>{correctScore}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="boxBot">
                                <Typography fontSize={'20px'} color={'#fff'}>Correct</Typography>
                            </Box>
                        </Box>
                        {/* box incorrect */}
                        <Box sx={{
                            minHeight: '90px',
                            background: '#8594ca',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            // gap: '5px',
                            width: {
                                xs: '80%',
                                sm: '30%'
                            },
                            margin: {
                                xs: '10px',
                                sm: '10px'
                            }
                        }}>
                            <Box className="boxTop">
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '20px',
                                    gap: '5px'
                                }}>
                                    <Box className="iconBox" sx={{
                                        marginTop: '5px'
                                    }}>
                                        <img src={Close} alt='check'></img>
                                    </Box>
                                    <Box className="correctScore">
                                        <Typography sx={{
                                            fontSize: '35px',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                        }}>{incorrectScore}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="boxBot">
                                <Typography fontSize={'20px'} color={'#fff'}>Incorrect</Typography>
                            </Box>
                        </Box>

                        {/* box Unattempted */}
                        <Box sx={{
                            minHeight: '90px',
                            background: '#8594ca',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            // gap: '5px',
                            width: {
                                xs: '80%',
                                sm: '30%'
                            },
                            margin: {
                                xs: '10px',
                                sm: '10px'
                            }
                        }}>
                            <Box className="boxTop">
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '20px',
                                    gap: '5px'
                                }}>
                                    <Box className="iconBox" sx={{
                                        marginTop: '5px'
                                    }}>
                                        <img src={BoxSearch} alt='check'></img>
                                    </Box>
                                    <Box className="correctScore">
                                        <Typography sx={{
                                            fontSize: '35px',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                        }}>{unattempted}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="boxBot">
                                <Typography fontSize={'20px'} color={'#fff'}>Unattempted</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {
                        (examResult?.exam?.examEndTime == null || new Date(examResult?.exam?.examEndTime) < new Date()) && <>
                            <Box sx={{
                                background: theme.palette.cardBackground,
                                width: '80%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                padding: '20px',
                            }}>
                                <Typography variant='h5' sx={{
                                    textAlign: 'left',
                                    marginBottom: '10px',
                                    fontWeight: '600', 
                                    fontSize: '25px'
                                }}>
                                    Result
                                </Typography>
                                <ExamResult examData={examData} />
                            </Box>
                        </>
                    }

                    <Box sx={{ textAlign: 'center' }}>
                        <Button variant="contained" color="primary" size='large'
                            onClick={() => {
                                navigate('/')
                            }}
                        >
                            Back to home
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </div>
    )
}

export default ViewScoreExam