import { Box, Typography, Dialog, DialogContent, DialogActions, Button, Chip } from "@mui/material";
import styles from './DetailedReport.module.scss'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useEffect, useState } from "react";
import axios from "axios";
import QuestionBoxes from './QuestionBoxes.jsx';
import { convertDateFormat } from './until.js'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from "react-router-dom";
import { getExamById, getExamDetail } from "~/services/examService";
import Loading from "~/components/Loading";
import { getCheatingType } from "~/utils/cheatingUtils";
function DetailedReport() {
    const [data, setData] = useState({});
    const [averageScores, setAverageScores] = useState([]);
    const [resultData, setresultData] = useState([]);
    const [result_question, setresult_question] = useState([]);
    const [openDialog, setOpenDialog] = useState(false); // Trạng thái cho biết xem dialog có mở hay không
    const [selectedResult, setSelectedResult] = useState(null); // Kết quả được chọn
    const [index_selected, set_index_selected] = useState(null);
    const [listAnswer, setListAnswer] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("data", data.length);

    const { examId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getExamDetail(examId);
            if (res.status === 200) {
                console.log("fetch data success", res.data);
                setData(res.data.exam);
                let average = res?.data?.examResultHistories?.reduce(
                    (accumulator, currentValue) => accumulator + currentValue?.examResult?.score, 0
                ) / res?.data?.examResultHistories?.length * 10 || 0;
                setAverageScores(average.toFixed(2));
                setQuestions(res.data.questions);
                let examResults = res?.data?.examResultHistories || [];
                let examResult = examResults.map(result => {
                    return {
                        name: result.examResult.userAnswer.userAnswerName,
                        result: checkAnswers(res.data.questions, result.histories),
                        endTime: result.examResult.endTime,
                        accuracy: getTotalCorrectAnswers(res.data.questions, result.histories),
                        score: result.examResult.score,
                        cheating: result.examResult.examResultCheatings,
                        cheatingCodes: getDistinctCheatingCodes(result.examResult.examResultCheatings)
                    };
                });
                setresultData(examResult);
            }
            setLoading(false);
        }
        fetchData();
    }, [examId]);

    function getDistinctCheatingCodes(examResultCheatings) {
        const uniqueCheatingCodes = new Set();

        examResultCheatings.forEach(cheating => {
            uniqueCheatingCodes.add(cheating.cheating.cheatingCode);
        });

        return [...uniqueCheatingCodes];
    }

    function getTotalCorrectAnswers(questions, examResultHistories) {
        let checkedAnswers = checkAnswers(questions, examResultHistories);

        let totalCorrect = checkedAnswers.reduce((total, current) => {
            if (current.status) {
                return total + 1;
            }
            return total;
        }, 0);

        return totalCorrect;
    }

    function checkAnswers(questions, examResultHistories) {
        let results = [];

        questions.forEach(question => {
            let correctAnswers = question.answers.filter(answer => answer.isCorrect).map(answer => answer.answerId);
            let answeredCorrectly = false;

            examResultHistories.forEach(userAnswer => {
                if (userAnswer.questionId === question.questionId) {
                    if (correctAnswers.includes(userAnswer.selectedAnswerId) && correctAnswers.length === examResultHistories.filter(h => h.questionId === question.questionId).length) {
                        answeredCorrectly = true;
                    }
                }
            });

            results.push({
                questionId: question.questionId,
                answers: examResultHistories.filter(h => h.questionId === question.questionId),
                status: answeredCorrectly
            });
        });

        return results;
    }


    const handleResultClick = (result, index) => {
        setSelectedResult(result);
        setOpenDialog(true);
        set_index_selected(index);
        const listAnswer = result.result.map((item, index) => {
            let question = questions.find(question => question.questionId === item.questionId);
            console.log("item", item);
            let answer = item.answers.map(answer => question.answers.filter(a => a.answerId === answer.selectedAnswerId)).flat();
            console.log("answer", answer);
            let correctAnswer = question.answers.filter(answer => answer.isCorrect);
            console.log("correctAnswer", correctAnswer);
            return {
                question_text: question.questionText,
                answer_text: answer,
                answer_correct: correctAnswer,
                is_correct: item.status
            };
        });

        setListAnswer(listAnswer);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    return (
        <div >
            {data && (
                <div>
                    <Box className={styles['detailedReport']}>
                        <Typography className={styles['item_name_exam']} fontSize={14}>{data?.examName}</Typography>
                        <table className={styles['table-header12']}>
                            <tr>
                                <th className={styles['table_row']}>
                                    <div className={styles['item_row_1']}>
                                        <div className={styles['item_row_1_icon']}>
                                            <CheckCircleOutlineIcon fontSize={"small"} ></CheckCircleOutlineIcon>
                                        </div>
                                        <div>
                                            <Typography className={styles['item_row_1_letter']} fontSize={13} fontWeight={"bold"} color={"#6d6d6d"}>Accuracy</Typography>
                                            <Typography className={styles['item_row_1_number']} fontSize={17} fontWeight={"bold"}>{averageScores}%</Typography>
                                        </div>

                                    </div>
                                </th>
                                <th className={styles['table_row']}>
                                    <div className={styles['item_row_1']}>
                                        <div className={styles['item_row_1_icon']}>
                                            <GroupsIcon fontSize={"small"}></GroupsIcon>
                                        </div>
                                        <div>
                                            <Typography className={styles['item_row_1_letter']} fontSize={13} fontWeight={"bold"}>Total Students</Typography>
                                            <Typography className={styles['item_row_1_number']} fontSize={17} fontWeight={"bold"}>{data?.totalParticipants}</Typography>
                                        </div>

                                    </div>
                                </th>
                                <th className={styles['table_row']}>
                                    <div className={styles['item_row_1']}>
                                        <div className={styles['item_row_1_icon']}>
                                            <HelpOutlineIcon fontSize={"small"}></HelpOutlineIcon>
                                        </div>
                                        <div>
                                            <Typography className={styles['item_row_1_letter']} fontSize={13} fontWeight={"bold"}>Questions</Typography>
                                            <Typography className={styles['item_row_1_number']} fontSize={17} fontWeight={"bold"}>{questions?.length || 0}</Typography>
                                        </div>

                                    </div>
                                </th>
                            </tr>
                        </table>
                    </Box>
                    <Box className={styles['item_row_2']}>
                        <Typography className={styles['item_name_exam']} fontSize={14}>Participants</Typography>
                        <Box>
                            <div style={{ fontSize: '13px', display: "flex", float: "right", marginBottom: 12 }}>
                                <Box className={styles['box_4x4']}></Box>
                                Correct
                                <Box className={styles['box_4x4']} sx={{ backgroundColor: '#ec0b43' }}></Box>
                                Incorrect
                            </div>
                            <table className={styles['table-header12']}>
                                <thead>
                                    <tr style={{ fontSize: "11px" }}>
                                        <th className={styles['item_row_title_2']} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>Name</th>
                                        <th>Result</th>
                                        <th>Accuracy</th>
                                        <th>Cheating</th>
                                        <th>Score</th>

                                    </tr>
                                </thead>
                                <tbody style={{ width: '100%', textAlign: "center" }}>
                                    {resultData.map((row, index) => (
                                        <tr key={index} className={styles['item_row']}>
                                            <td className={styles['item_row_title_2']} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>{row.name}</td>
                                            <td className={styles['scrollable']} onClick={() => handleResultClick(row, index)}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    gap: '2px',
                                                }}>
                                                    {
                                                        row.result.map((item, index) => {
                                                            return (
                                                                <Box key={index} className={styles['box_4x4']} sx={{ backgroundColor: item.status ? '#00c985' : '#ec0b43' }}></Box>
                                                            )
                                                        })
                                                    }
                                                </Box>
                                            </td>
                                            <td>{row.accuracy}</td>
                                            <td>{
                                                row?.cheatingCodes?.length > 0 && row?.cheatingCodes?.map(cheatingCode => {
                                                    return <Chip key={cheatingCode} size="small" label={getCheatingType(cheatingCode).replace('detected', '')} color="error" />
                                                }
                                                )}</td>
                                            <td>{row.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </Box>
                    </Box>
                </div>

            )}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={false}>
                <DialogContent>
                    {/* Hiển thị thông tin chi tiết của kết quả được chọn */}
                    {selectedResult && (
                        <div className={styles['dialog']}>
                            <p className={styles['dialogcontent_name']} style={{ fontSize: '14px' }}>{selectedResult.name}</p>
                            <p className={styles['dialogcontent_name']} style={{ fontWeight: "normal", fontSize: "12px" }}>{convertDateFormat(selectedResult.endTime)}</p>
                            <div className={styles['dialog_content']}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '2px',
                                }}>
                                    {/* <div style={{ fontSize: '13px', display: "flex", float: "right", marginBottom: 12 }}> */}
                                    {
                                        selectedResult.result.map((item, index) => {
                                            return (
                                                <Box key={index} className={styles['box_4x4']} sx={{ backgroundColor: item.status ? '#00c985' : '#ec0b43' }}></Box>
                                            )
                                        })
                                    }
                                    {/* </div> */}
                                </Box>
                                <div className={styles['box_infor_correct']}>
                                    <div className={styles['box_number_correct']}>
                                        <CheckIcon fontSize={"12px"} />{selectedResult.accuracy} Correct
                                    </div>
                                    <div className={`${styles['box_number_correct']} ${styles['box_number_incorrect']}`}>
                                        <CloseIcon fontSize={"12px"} />{questions.length - selectedResult.accuracy} Incorrect
                                    </div>
                                </div>
                                {listAnswer?.map((row, index) => (
                                    <div key={index} className={styles['box_answer_user']}>
                                        <div className={styles['box_infor_correct']}
                                            style={{ float: "left", justifyContent: "start", padding: 0 }}>
                                            {
                                                row.is_correct === true ? (
                                                    <div className={styles['box_number_correct']}>
                                                        <CheckIcon fontSize={"12px"} />Correct
                                                    </div>) :
                                                    (<div
                                                        className={`${styles['box_number_correct']} ${styles['box_number_incorrect']}`}>
                                                        <CloseIcon fontSize={"12px"} />Incorrect
                                                    </div>)
                                            }
                                        </div>
                                        <div className={styles['question_title']}>{row.question_text}</div>
                                        <div className={styles['box_answer_selected']}>
                                            <div className={styles['response_answer']}>
                                                <div className={styles['title_answer']}>Answer</div>
                                                <div style={{
                                                    whiteSpace: 'pre-wrap'
                                                }} className={styles['content_answer']}><CheckIcon fontSize={"12px"}
                                                    style={{
                                                        marginRight: '4px',
                                                        color: '#5ee3b6'

                                                    }} />
                                                    {row?.answer_text?.map(answer => answer.answerText).join('\n') || "No answer"}
                                                </div>
                                            </div>
                                            <div className={styles['response_answer']}>
                                                <div className={styles['title_correct_answer']}>Correct Answer</div>
                                                <div style={{ whiteSpace: 'pre-wrap' }} className={styles['content_answer']}>{row?.answer_correct?.map(answer => answer.answerText).join('\n')}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {
                                    selectedResult.cheating?.length > 0 && (
                                        <Box>
                                            <Typography variant="h6" sx={{
                                                marginBottom: 0,
                                                fontWeight: '500'
                                            }}>
                                                <Typography variant="span" sx={{
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                }}>
                                                    Cheating
                                                </Typography>
                                            </Typography>
                                            <ul style={{
                                                listStyleType: 'none',
                                                padding: 0,
                                                margin: 0
                                            }}>
                                                {selectedResult.cheating.map(cheating => (
                                                    <li key={cheating.examResultCheatingId} style={{
                                                        display: 'flex',
                                                        alignItems: 'start',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        padding: '10px',
                                                        border: '0.1px solid rgba(128, 128, 128, 0.3)',
                                                        borderRadius: '4px',
                                                        marginTop: '12px',

                                                    }}>
                                                        <Typography variant="span" sx={{
                                                            marginRight: '5px',
                                                            color: 'red'
                                                        }}>
                                                            {getCheatingType(cheating.cheating.cheatingCode)}
                                                        </Typography>
                                                        <Typography variant="span" sx={{
                                                            color: 'red'
                                                        }}>
                                                            {cheating.cheatingTime}
                                                        </Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Box>
                                    )
                                }
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
            <Loading isOpen={loading} />
        </div >
    );
}

export default DetailedReport;