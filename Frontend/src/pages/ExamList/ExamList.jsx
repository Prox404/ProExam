import {useRef, useState, useEffect} from "react";
import api from "../../config/api.js";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {format} from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import styles from "./ExamList.module.scss"
import {
    Box, Button, IconButton, Menu, MenuItem, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import * as path from "path";
import AlertSuccess from "~/utils/alertSuccess.jsx";
import imgEmptyData from "/src/assets/img_empty_data.svg";

function ExamList() {
    const [examList, setExamList] = useState([]);
    const [examListTemp, setExamListTemp] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const focus = useRef(null);
    const [openMenu, setOpenMenu] = useState(-1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAlert, setOpenAlert] = useState(false)
    const [message, setMessage] = useState()
    const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('user'))?.userId);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get(`/exam/exams/${userId}`);
            if (response.status === 200) {
                setExamList(response.data);
                setExamListTemp(response.data);
            }
        };

        fetchData();
    }, []);

    const changeFocus = () => {
        focus.current.focus();
    }

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

    const handleSearch = (event) => {
        setSearchInput(event.target.value);
        setExamListTemp(
            examList.filter(
                (exam) =>
                    (exam.examName.toLowerCase().trim().includes(event.target.value.toLowerCase().trim())
                        || exam.keyCode.toString().includes(event.target.value.trim())))
        );
    }

    const handleDelete = async (index) => {
        setOpenMenu(false);
        const examIdToDelete = examListTemp[index].examId;
        const response = await api.delete(`exam/removeExam/${examIdToDelete}`);
        if (response.status === 200) {
            const updatedExamListTemp = examListTemp.filter((exam, idx) => idx !== index);
            setExamListTemp(updatedExamListTemp);

            const updatedExamList = examList.filter((exam) => exam.examId !== examIdToDelete);
            setExamList(updatedExamList);
            setMessage(response?.data);
            setOpenAlert(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOpenAlert(false);
        } else {
            console.log(response.status)
        }
    }

    function detailExam(exam) {
        return () => {
            navigate({
                pathname: `/exam-detail/${exam.examId}`
            });
        };
    }

    return (
        <>
            <Box className="set-time-container animate__animated animate__backInRight"
                 sx={{
                     backgroundColor: "white",
                     borderRadius: 10,
                     margin: '40px',
                     height: {
                         xs: 'auto',
                         sm: 'calc(100vh - var(--header-height) - 80px)'
                     },
                     overflowY: "scroll",
                     scrollbarWidth: "none",
                 }}
            >
                {examList.length === 0 ? (
                    <Box sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        justifyItems: "center",
                        alignItems: "center"
                    }}>
                        <img src={imgEmptyData} alt={"img empty"} style={{width: '30%', marginBottom: "10px"}}/>
                        <Typography variant={"h5"} style={{marginBottom: "10px", color: "#757575"}}>No test data available, please click the create test button.</Typography>
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
                                navigate({pathname: "/set-time"})
                            }}
                        >
                            <AddIcon/>
                            {'Create question'}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Box style={{
                            margin: "15px 15px 15px 30px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
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
                                    navigate({pathname: "/set-time"})
                                }}
                            >
                                <AddIcon/>
                                {'Create question'}
                            </Button>
                            <Box className={styles['search-form']}>
                                <input
                                    type={"text"}
                                    placeholder={"Search here"}
                                    onChange={handleSearch}
                                    value={searchInput}
                                    className={styles['search']}
                                    ref={focus}
                                />
                                <IconButton onClick={changeFocus}>
                                    <SearchIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                        <TableContainer sx={{
                            boxShadow: '5px 3px 8px rgba(0, 0, 0, 0.15)'
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: "#dae1fd"}}>
                                        <TableCell width="1%" align="center"><b>No.</b></TableCell>
                                        <TableCell align="center"><b>Exam name</b></TableCell>
                                        <TableCell align="center"><b>Start time</b></TableCell>
                                        <TableCell align="center"><b>End time</b></TableCell>
                                        <TableCell align="center"><b>Key Exam</b></TableCell>
                                        <TableCell width="1%" align="center"><b></b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {examListTemp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exam, index) => (
                                        <TableRow key={exam.examId} sx={{
                                            '&:hover': {
                                                backgroundColor: "#f0f3ff",
                                                cursor: "pointer"
                                            }
                                        }}>
                                            <TableCell onClick={detailExam(exam)} align="center">{index + 1}</TableCell>
                                            <TableCell onClick={detailExam(exam)} align="center">{exam.examName}</TableCell>
                                            <TableCell onClick={detailExam(exam)} align="center">{formatDate(exam.examStartTime)}</TableCell>
                                            <TableCell onClick={detailExam(exam)} align="center">{formatDate(exam.examEndTime)}</TableCell>
                                            <TableCell onClick={detailExam(exam)} align="center"><b>{exam.keyCode}</b></TableCell>
                                            <TableCell width="1%" align="center">
                                                <div>
                                                    <IconButton
                                                        onClick={(event) => {
                                                            setOpenMenu(index);
                                                            setAnchorEl(event.currentTarget);
                                                        }}><MoreVertIcon/>
                                                    </IconButton>
                                                    <Menu open={(openMenu === index)}
                                                          anchorEl={anchorEl}
                                                          onClose={() => setOpenMenu(-1)}
                                                          transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                                          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                                          MenuListProps={{
                                                              'aria-labelledby': 'basic-button',
                                                          }}>
                                                        <MenuItem onClick={detailExam(exam)}>Edit</MenuItem>
                                                        <MenuItem onClick={() => handleDelete(index)}>Delete</MenuItem>
                                                    </Menu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15, 20]}
                                component={"div"}
                                colSpan={5}
                                count={examListTemp.length}
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
                        </TableContainer>
                    </Box>

                )}
            </Box>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                style={{marginTop: '40px'}}
                open={openAlert} autoHideDuration={6000} onClose={() => {
            }}>
                <div>
                    <AlertSuccess message={message}/>
                </div>
            </Snackbar>
        </>
    );
}

export default ExamList;