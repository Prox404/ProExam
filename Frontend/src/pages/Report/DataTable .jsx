import React, { useEffect, useState } from 'react';
import './DataTable.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { parseTimeString } from './until.js';
import { parseDateString } from './until.js';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Typography } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import axios from "axios";
import * as XLSX from 'xlsx';
const removeSpaces= (str)=> {
    return str.replace(/\s/g, '');
}
function DataTable({ data }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);

    const handleClick = (event, index) => {
        setMenuOpen(menuOpen === index ? null : index);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setMenuOpen(null);
        setAnchorEl(null);
    };

    const [averageScores, setAverageScores] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = data.map(row => getAverageScoreByExamId(row.examId));
                const responses = await Promise.all(requests);
                setAverageScores(responses);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data]);

    const getAverageScoreByExamId = async (examId) => {
        try {
            const response = await axios.get(`http://localhost:8080/exam/getAverageScoreByExamId/${examId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };
    const readataExamResult = async (examId) => {
        try {
            const response = await axios.get(`http://localhost:8080/history/numbercorrect/${examId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };
    const XLSX = require('xlsx-style');
    const handleExportExcel = async (exam) => {
        const data123 = await  readataExamResult(exam.examId);
        if(data123===null)
            return
        const dataArray = data123.map(item => {
            return [
                item.userAnswerName,
                item.userAnswerEmail,
                item.correctAnswerCount,
                item.incorrectAnswerCount,
                item.startTime,
                item.endTime
            ];
        });
        // // Tạo một workbook và một worksheet
        const wb = XLSX.utils.book_new();
        const columnWidths = [{wch: 20}, {wch: 20}, {wch: 10}, {wch: 10}, {wch: 25}, {wch: 25}];
        const ws = XLSX.utils.aoa_to_sheet([['User name', 'User Email', 'Correct','Incorrect', 'Start at', 'End at', ], ...dataArray]);
        ws["!cols"] = columnWidths;


        const headerStyle = {
            fill: {
                fgColor: { rgb: "FF000000" },
            },
            font: {
                color: { rgb: "FFFFFFFF" },
                sz: 14,
                bold: true,
            },
        };
        const headerStyleCell = {
            s: headerStyle,
            e: headerStyle,
        };
        ws["A1"].s = headerStyleCell;
        ws["B1"].s = headerStyleCell;
        ws["C1"].s = headerStyleCell;
        ws["D1"].s = headerStyleCell;
        ws["E1"].s = headerStyleCell;
        ws["F1"].s = headerStyleCell;
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        const nameFile = 'ProExam_'+removeSpaces(exam.examName)+'Report.xlsx';
        // Xuất workbook thành tệp Excel
        XLSX.writeFile(wb, nameFile);
    };
    return (
        <table className={'table-content'}>
            <thead>
            <tr className="table-header">
                <th>Type</th>
                <th className={'table-name'}>Exam Name</th>
                <th className={'split-text'}>Total Participants</th>
                <th>Accuracy</th>
                <th>Start time</th>
                <th>End Time</th>
                <th></th>
            </tr>
            </thead>
            <tbody style={{ width: '100%', textAlign: "center", }}>
            {data.map((row, index) => (
                <tr key={index} className={'row-content'}>
                    <td>
                        <div className={'btn-live'}>
                            <div className={'btn-live btn-live-in'} style={{ width: "50%", backgroundColor: 'rgba(123,107,234,0.27)' }}><PlaylistAddCheckIcon fontSize={"small"} />Live</div>
                        </div></td>
                    <td className={'table-name'}>
                        <div>
                            {row.examName}
                        </div>
                        <div className={'row-date'}>{parseDateString(row.examStartTime)}</div>
                    </td>
                    <td className={'split-text'}>{row.numberSubmit}</td>
                    <td >
                        <div key={index} className={'cricularprogressbar'}>
                            <div style={{ width: 30 }}>
                                <CircularProgressbar
                                    styles={buildStyles({
                                        pathColor: "#d6a13c"
                                    })}
                                    strokeWidth={14} value={averageScores[index] * 10} />
                            </div>
                            <div style={{ marginLeft: 8 }}>
                                {averageScores[index] * 10}
                            </div>
                        </div>
                    </td>
                    <td>{parseTimeString(row.examStartTime)}</td>
                    <td>{parseTimeString(row.examEndTime)}</td>
                    <td onClick={(event) => handleClick(event, index)} className={'dropdown'}>
                        <div>
                            <MoreVertIcon fontSize={"small"} aria-controls="simple-menu"
                                          aria-haspopup="true" onClick={handleClick}
                                          sx={{
                                              ":hover": {
                                                  borderRadius: 1,
                                                  backgroundColor: '#e5e5e5'
                                              }
                                          }} />
                            <Menu
                                id="simple-menu"
                                anchorEl={menuOpen === index ? anchorEl : null}
                                open={menuOpen === index}
                                onClose={handleClose}
                                sx={{
                                    left: '-50px', fontSize: '5px'
                                }}
                            >
                                <MenuItem onClick={() => handleExportExcel(row)}>
                                    <ListItemIcon>
                                        <DownloadIcon fontSize="inherit" sx={{ color: '#090909' }} />
                                    </ListItemIcon>
                                    <ListItemText><Typography sx={{ fontSize: '13px' }}>Download Excel</Typography></ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <EditIcon fontSize="inherit" sx={{ color: '#090909' }} />
                                    </ListItemIcon>
                                    <ListItemText><Typography sx={{ fontSize: '13px' }}>Rename report</Typography></ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <DeleteIcon fontSize="inherit" sx={{ color: '#090909', }} />
                                    </ListItemIcon>
                                    <ListItemText><Typography sx={{ fontSize: '13px' }}>Delete report</Typography></ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DataTable;
