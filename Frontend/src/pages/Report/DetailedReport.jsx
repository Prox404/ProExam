import {Box, Typography,Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@mui/material";
import styles from './DetailedReport.module.scss'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import React, {useEffect, useState} from "react";
import {setBackend} from "@tensorflow/tfjs-core";
import axios from "axios";
import QuestionBoxes from './QuestionBoxes.jsx';
import {convertDateFormat} from './until.js'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
function DetailedReport({examId}) {
    const [data,setData] = useState([]);
    const [averageScores, setAverageScores] = useState([]);
    const [resultData,setresultData] = useState([]);
    const [result_question,setresult_question] = useState([]);
    const [openDialog, setOpenDialog] = useState(false); // Trạng thái cho biết xem dialog có mở hay không
    const [selectedResult, setSelectedResult] = useState(null); // Kết quả được chọn
    const [index_selected,set_index_selected] = useState(null);
    const [listAnswer, setListAnswer] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:8080/exam/getExamId/${examId}`)
            .then(response => {
                setData(response.data);
            })

        getAverageScoreByExamId(examId)
        readataExamResult(examId);
        read_box_list_question(examId);

    }, []);
    const read_list_answer_user = async (examId,uid)=>{
        try {
            const response = await axios.get(`http://localhost:8080/history/getListAnswer/${examId}/${uid}`);
            setListAnswer(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
    const read_box_list_question = async (examId) =>{
        try {
            const response = await axios.get(`http://localhost:8080/history/listQuestion/${examId}`);
            setresult_question(convertToResult1Array(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
    function convertToResult1Array(data) {
        let result1Array = [];
        data.forEach(item => {
            result1Array.push(item.result1);
        });
        return result1Array;
    }
    const readataExamResult = async (examId) => {
        try {
            const response = await axios.get(`http://localhost:8080/history/numbercorrect/${examId}`);
            console.log(response.data);
            setresultData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };
    const getAverageScoreByExamId = async (examId) => {
        try {
            const response = await axios.get(`http://localhost:8080/exam/getAverageScoreByExamId/${examId}`);
            setAverageScores(response.data *10)
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };
    const handleResultClick = (result,index) => {
        setSelectedResult(result);
        setOpenDialog(true);
        set_index_selected(index);
        read_list_answer_user(examId,result.userAnswerId);
        console.log(listAnswer);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    return (
        <div >
            {data.map(item =>(
                <div>
                    <Box className={styles['detailedReport']}>
                        <Typography className={styles['item_name_exam']} fontSize={14}>{item.examName}</Typography>
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
                                            <Typography className={styles['item_row_1_number']} fontSize={17} fontWeight={"bold"}>{item.numberSubmit}</Typography>
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
                                            <Typography  className={styles['item_row_1_number']} fontSize={17} fontWeight={"bold"}>{result_question.length !== 0 ? result_question.at(0).length : 0}</Typography>
                                        </div>

                                    </div>
                                </th>
                            </tr>
                        </table>
                    </Box>
                    <Box className={styles['item_row_2']}>
                        <Typography className={styles['item_name_exam']} fontSize={14}>Participants</Typography>
                        <Box>
                            <div style={{fontSize:'13px',display:"flex",float:"right",marginBottom:12}}>
                                <Box className={styles['box_4x4']}></Box>
                                Correct
                                <Box className={styles['box_4x4']} sx={{backgroundColor:'#ec0b43'}}></Box>
                                Incorrect
                            </div>
                            <table className={styles['table-header12']}>
                                <thead>
                                <tr style={{fontSize:"11px"}}>
                                    <th className={styles['item_row_title_2']} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>Name</th>
                                    <th>Result</th>
                                    <th>Accuracy</th>
                                    <th>Score</th>

                                </tr>
                                </thead>
                                <tbody  style={{ width: '100%', textAlign: "center" }}>
                                {resultData.map((row, index) => (
                                    <tr key={index} className={styles['item_row']}>
                                        <td className={styles['item_row_title_2']} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>{row.userAnswerName}</td>
                                        <td className={styles['scrollable']}  onClick={() => handleResultClick(row,index)}>
                                            <QuestionBoxes questions={result_question.at(index)} />
                                        </td>
                                        <td>{row.correctAnswerCount}</td>
                                        <td>{row.score}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                        </Box>
                    </Box>
                </div>

            ))}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={false}>
                <DialogContent>
                    {/* Hiển thị thông tin chi tiết của kết quả được chọn */}
                    {selectedResult && (
                        <div className={styles['dialog']}>
                            <p className={styles['dialogcontent_name']} style={{fontSize:'14px'}}>{selectedResult.userAnswerName}</p>
                            <p className={styles['dialogcontent_name']} style={{fontWeight:"normal",fontSize:"12px"}}>{convertDateFormat(selectedResult.endTime)}</p>
                            <div className={styles['dialog_content']}>
                                <QuestionBoxes questions={result_question.at(index_selected)} />
                                <div className={styles['box_infor_correct']}>
                                    <div className={styles['box_number_correct']}>
                                        <CheckIcon fontSize={"12px"}/>{selectedResult.correctAnswerCount} Correct
                                    </div>
                                    <div className={`${styles['box_number_correct']} ${styles['box_number_incorrect']}`}>
                                        <CloseIcon fontSize={"12px"}/>{selectedResult.incorrectAnswerCount} Incorrect
                                    </div>
                                </div>
                                {listAnswer.map((row,index)=> (
                                    <div key={index} className={styles['box_answer_user']}>
                                        <div className={styles['box_infor_correct']}
                                             style={{float: "left", justifyContent: "start", padding: 0}}>
                                            {
                                                row.is_correct === true ? (
                                                        <div className={styles['box_number_correct']}>
                                                            <CheckIcon fontSize={"12px"}/>Correct
                                                        </div>) :
                                                    (<div
                                                        className={`${styles['box_number_correct']} ${styles['box_number_incorrect']}`}>
                                                        <CloseIcon fontSize={"12px"}/>Incorrect
                                                    </div>)
                                            }
                                        </div>
                                        <div className={styles['question_title']}>{row.question_text}</div>
                                        <div className={styles['box_answer_selected']}>
                                            <div className={styles['response_answer']}>
                                                <div className={styles['title_answer']}>Answer</div>
                                                <div className={styles['content_answer']}>
                                                    {
                                                        row.is_correct === true ?(
                                                            <CheckIcon fontSize={"12px"}
                                                                       style={{
                                                                           marginRight: '4px',
                                                                           color: '#5ee3b6'
                                                                       }}/>
                                                        ):(
                                                            <CloseIcon fontSize={"12px"}
                                                                       style={{
                                                                           marginRight: '4px',
                                                                           color: '#bc0835'
                                                                       }}/>
                                                        )
                                                    }
                                                    {row.answer_text}
                                                </div>
                                            </div>
                                            <div className={styles['response_answer']}>
                                                <div className={styles['title_correct_answer']}>Correct Answer</div>
                                                <div className={styles['content_answer']}>{row.answer_correct.answerText}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DetailedReport;