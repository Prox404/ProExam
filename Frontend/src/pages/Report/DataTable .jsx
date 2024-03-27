import { useEffect, useState } from 'react';
import './DataTable.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
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
import { getAverageScore } from '~/services/examService';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { numberCorrect } from '~/services/historyService';
import Loading from '~/components/Loading';
const removeSpaces = (str) => {
    return str.replace(/\s/g, '');
}
// eslint-disable-next-line react/prop-types
function DataTable({ data, handleRowClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [loading, setLoading] = useState(false);

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
                setLoading(true);
                // eslint-disable-next-line react/prop-types
                const res = data.map(row => getAverageScoreByExamId(row.examId));
                setLoading(false);
                const responses = await Promise.all(res);
                setAverageScores(responses);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data]);

    const getAverageScoreByExamId = async (examId) => {
        try {
            setLoading(true);
            const res = await getAverageScore(examId);
            setLoading(false);
            return res;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    const handleExportExcel = async (exam) => {
        console.log(exam);
        const res = await numberCorrect(exam.examId);
        console.log(res.data);
        if (res?.status !== 200) {
            return;
        }
        const data123 = res?.data;
        if (data123 === null)
            return
        const dataArray = data123?.map(item => {
            return [
                item.examName,
                item.keyCode,
                item.numberQuestion,
                item.userAnswerName,
                item.userAnswerEmail,
                format(item.startTime, 'dd-MM-yyyy hh:mm:ss'),
                item.endTime ? format(item.endTime, 'dd-MM-yyyy hh:mm:ss') : 'No Submit',
                item.score
            ];
        });

        const wb = XLSX.utils.book_new();
        const columnWidths = [{ wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 25 }, { wch: 25 }];
        const ws = XLSX.utils.aoa_to_sheet([['Exam name','Keycode','Number question', 'User name', 'User Email', 'Start at', 'End at', 'Score' ], ...dataArray]);
        ws["!cols"] = columnWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'Exam Result');

        const nameFile = 'ProExam_' + removeSpaces(exam.examName) + 'Report.xlsx';
        // Xuất workbook thành tệp Excel
        XLSX.writeFile(wb, nameFile);
    };
    return (
        <div>
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
                        <tr key={index} className={'row-content'} onClick={() => handleRowClick(row.examId)}>
                            <td>
                                <div className={'btn-live'}>
                                    <div className={'btn-live btn-live-in'} style={{ width: "50%", backgroundColor: 'rgba(123,107,234,0.27)' }}><PlaylistAddCheckIcon fontSize={"small"} />Live</div>
                                </div></td>
                            <td className={'table-name'}>
                                <div>
                                    {row?.examName}
                                </div>
                                <div className={'row-date'}>{parseDateString(row?.examStartTime)}</div>
                            </td>
                            <td className={'split-text'}>{row?.totalParticipants}</td>
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
                                        {(averageScores[index] * 10).toFixed(2) + '%'}
                                    </div>
                                </div>
                            </td>
                            <td>{format(row?.examStartTime, 'hh:mm')}</td>
                            <td>{row?.examEndTime ? format(row?.examEndTime || new Date(), 'hh:mm') : 'No limit' }</td>
                            <td onClick={(event) => { event.stopPropagation(); handleClick(event, index) }} className={'dropdown'}>
                                <div>
                                    <MoreVertIcon fontSize={"small"} aria-controls="simple-menu"
                                        aria-haspopup="true"
                                        onClick={(event) => { event.stopPropagation(); handleClick(event, index) }}
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
                                                <DownloadIcon fontSize="inherit" />
                                            </ListItemIcon>
                                            <ListItemText><Typography sx={{ fontSize: '13px' }}>Export Excel</Typography></ListItemText>
                                        </MenuItem>
                                        
                                    </Menu>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            <Loading isOpen={loading}/>
        </div>
    );
}


export default DataTable;
