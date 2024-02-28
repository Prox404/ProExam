import {useRef, useState, useEffect} from "react";
import api from "../../config/api.js";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {format} from 'date-fns';
import {
    Box, IconButton,
    List,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import Grid from "@mui/material/Grid";

function ExamList() {
    const [examList, setExamList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get('/exam/exams');
            if (response.status === 200) {
                setExamList(response.data);
            }
        };

        fetchData();
    }, []);

    const formatDate = (date) => {
        const nDate = new Date(date);
        return format(nDate, 'HH:mm dd/MM/yyyy');
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return <>
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
                overflow: "auto",
                scrollbarWidth: "none"
            }}>
            {
                (examList.length === 0)
                    ? <p>empty</p>
                    : <Box style={{height: '100%', borderRadius: 30}}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"><b>Exam name</b></TableCell>
                                        <TableCell align="center"><b>Start time</b></TableCell>
                                        <TableCell align="center"><b>End time</b></TableCell>
                                        <TableCell align="center"><b>Key Exam</b></TableCell>
                                        <TableCell align="center"><b></b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        examList.map((exam, index) => (
                                            <TableRow key={exam.examId} sx={{
                                                '&:hover': {
                                                    backgroundColor: "#c6d2fc",
                                                    cursor: "pointer"
                                                }
                                            }}>
                                                <TableCell align="center">{exam.examName}</TableCell>
                                                <TableCell
                                                    align="center">{formatDate(exam.examStartTime)}</TableCell>
                                                <TableCell align="center">{formatDate(exam.examEndTime)}</TableCell>
                                                <TableCell align="center"><b>{exam.keyCode}</b></TableCell>
                                                <TableCell
                                                    align="center"><IconButton><MoreVertIcon/></IconButton></TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 15, 20]}
                            component={"div"}
                            count={examList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                '& p': {
                                    marginBottom: 0
                                }
                            }}
                        />
                    </Box>
            }
        </Box>
    </>;
}

export default ExamList;
