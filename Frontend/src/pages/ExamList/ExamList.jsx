import { useRef, useState, useEffect } from "react";
import { getExams, getQuestions, removeExam } from "~/services/examService";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import ListIcon from '@mui/icons-material/List';
import styles from "./ExamList.module.scss";
import img_create from '~/assets/img_lets_create.png';
import img_q from '~/assets/img_Q.png';
import {
    Alert,
    Avatar,
    Box, Button, IconButton, Menu, MenuItem, Snackbar,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as path from "path";
// import AlertSuccess from "~/utils/alertSuccess.jsx";
import imgEmptyData from "/src/assets/img_empty_data.svg";
import { ddMMyyyy } from "~/utils/timeUtils";
// import avatar from "/src/assets/avatar.png";

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
    const [user, setUser] = useState({});

    const colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA", "#ecd8f3", "#beb6f2", "#99d9f4", "#b2b9c1"];
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate({ pathname: '/login' });
        }
        setUser(user);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            console.log(user);
            const response = await getExams(user.userId);
            if (response.status === 200) {
                const updatedExams = await Promise.all(response.data.map(async (exam) => {
                    const response2 = await getQuestions(exam.examId);
                    if (response2.status === 200) {
                        return {
                            ...exam,
                            countQuestion: response2.data
                        };
                    }
                    return exam;
                }));
                setExamList(updatedExams);
                setExamListTemp(updatedExams);
            }
        };

        fetchData();
    }, [user]);

    const changeFocus = () => {
        focus.current.focus();
    }

    const formatDate = (date) => {

        const nDate = ddMMyyyy(date);

        return nDate ? format(nDate, 'HH:mm dd/MM/yyyy') : 'No limit';
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
        const response = await removeExam(examIdToDelete);
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
                pathname: `/exams/detail/${exam.examId}`
            });
        };
    }

    return (
        <Box>
            <Box className="set-time-container animate__animated animate__backInRight"
                sx={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: 4,
                    padding: '20px',
                    height: {
                        xs: 'auto',
                        sm: '100%'
                    }
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
                        <img src={imgEmptyData} alt={"img empty"} style={{ width: '30%', marginBottom: "10px" }} />
                        <Typography variant={"h5"} style={{ marginBottom: "10px", color: "#757575" }}>No test data
                            available, please click the create test button.</Typography>
                        <Button
                            className={styles['search-form']}
                            sx={{
                                padding: "10px",
                                borderRadius: 30,
                                color: '#757575',
                                display: "flex",
                                alignItems: "center",
                                justifyItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#ffffff"
                            }}
                            onClick={() => {
                                navigate({ pathname: "/create-exam" })
                            }}
                        >
                            <AddIcon />
                            {'Create question'}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{
                            margin: "15px 15px 15px 30px",
                            display: {
                                xs: 'none',
                                xl: 'flex'
                            },
                            flexDirection: "column",
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img src={img_create} alt={''} style={{ height: "200px", width: '200px' }} />
                            <Button
                                className={styles['search-form']}
                                sx={{
                                    padding: "10px",
                                    borderRadius: 30,
                                    color: '#757575',
                                    display: "flex",
                                    alignItems: "center",
                                    justifyItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#ffffff"
                                }}
                                onClick={() => {
                                    navigate({ pathname: "/create-exam" })
                                }}
                            >
                                <AddIcon />
                                {'Create question'}
                            </Button>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                        }}>
                            <Box className={styles['search-form']}
                                style={{
                                    margin: "15px 15px 15px 30px",
                                }}>
                                <input
                                    type={"text"}
                                    placeholder={"Search here"}
                                    onChange={handleSearch}
                                    value={searchInput}
                                    className={styles['search']}
                                    ref={focus}
                                />
                                <IconButton onClick={changeFocus}>
                                    <SearchIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{
                                height: {
                                    xs: 'auto',
                                    sm: 'calc(100vh - var(--header-height) - 160px)'
                                },
                                overflowY: "scroll",
                                scrollbarWidth: "none",
                            }}>
                                {examListTemp.map((exam, index) => (
                                    <Box key={index} sx={{
                                        margin: '0 15px 10px 15px',
                                        padding: '5px',
                                        display: 'flex',
                                        borderRadius: '5px',
                                        flexDirection: 'row',
                                        boxShadow: '3px 3px 3px #e4e4e4',
                                        backgroundColor: '#ffffff',
                                        '&:hover': {
                                            backgroundColor: "#f0f3ff",
                                            cursor: "pointer"
                                        },
                                    }}>
                                        <img src={img_q} alt={'img'} style={{
                                            width: '100px',
                                            backgroundColor: `${colors[exam.keyCode.toString().charAt(0)]}`
                                        }} onClick={detailExam(exam)} />
                                        <Box sx={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginLeft: '10px',
                                            '& p': {
                                                margin: 0
                                            }
                                        }}>
                                            <Box style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                            }}>
                                                <Box style={{ flex: 1 }}
                                                    onClick={detailExam(exam)}>
                                                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }} variant="h6" component="h6">{exam.examName}</Typography>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyItems: 'center'
                                                    }}>
                                                        <Typography sx={{ fontSize: 13 }}><CodeIcon />Key: {exam.keyCode}</Typography>
                                                        <Typography sx={{ fontSize: 13, marginLeft: '20px !important' }}><ListIcon />Questions: {exam.countQuestion}</Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: 12 }}>{formatDate(exam.examStartTime)} - {formatDate(exam.examEndTime)}</Typography>
                                                </Box>
                                                <Box>
                                                    <IconButton
                                                        onClick={(event) => {
                                                            setOpenMenu(index);
                                                            setAnchorEl(event.currentTarget);
                                                        }}><MoreVertIcon />
                                                    </IconButton>
                                                    <Menu open={(openMenu === index)}
                                                        anchorEl={anchorEl}
                                                        onClose={() => setOpenMenu(-1)}
                                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'basic-button',
                                                        }}>
                                                        <MenuItem onClick={detailExam(exam)}>Edit</MenuItem>
                                                        <MenuItem onClick={() => handleDelete(index)}>Delete</MenuItem>
                                                    </Menu>
                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                flex: 1
                                            }}
                                                onClick={detailExam(exam)}>
                                                {/* <Avatar src={avatar} sx={{width: '20px', height: '20px'}}/> */}
                                                <Typography sx={{ fontSize: 12, marginLeft: '10px !important' }}>{user?.userName}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            {/*<TableContainer sx={{*/}
                            {/*    boxShadow: '5px 3px 8px rgba(0, 0, 0, 0.15)'*/}
                            {/*}}>*/}
                            {/*    <Table>*/}
                            {/*        <TableHead>*/}
                            {/*            <TableRow sx={{backgroundColor: "#dae1fd"}}>*/}
                            {/*                <TableCell width="1%" align="center"><b>No.</b></TableCell>*/}
                            {/*                <TableCell align="center"><b>Exam name</b></TableCell>*/}
                            {/*                <TableCell align="center"><b>Start time</b></TableCell>*/}
                            {/*                <TableCell align="center"><b>End time</b></TableCell>*/}
                            {/*                <TableCell align="center"><b>Key Exam</b></TableCell>*/}
                            {/*                <TableCell width="1%" align="center"><b></b></TableCell>*/}
                            {/*            </TableRow>*/}
                            {/*        </TableHead>*/}
                            {/*        <TableBody>*/}
                            {/*            {examListTemp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exam, index) => (*/}
                            {/*                <TableRow key={exam.examId} sx={{*/}
                            {/*                    '&:hover': {*/}
                            {/*                        backgroundColor: "#f0f3ff",*/}
                            {/*                        cursor: "pointer"*/}
                            {/*                    },*/}
                            {/*                    '& .css-1yhpg23-MuiTableCell-root': {*/}
                            {/*                        padding: 0*/}
                            {/*                    }*/}
                            {/*                }}>*/}
                            {/*                    <TableCell onClick={detailExam(exam)} align="center">*/}
                            {/*                        <Box style={{backgroundColor: colors[exam.keyCode.toString().charAt(0)]}}>*/}
                            {/*                            <img src={img_q}  alt={'img'} style={{width: '80px'}}/>*/}
                            {/*                        </Box>*/}
                            {/*                    </TableCell>*/}
                            {/*                    <TableCell onClick={detailExam(exam)} align="center">{exam.examName}</TableCell>*/}
                            {/*                    <TableCell onClick={detailExam(exam)} align="center">{formatDate(exam.examStartTime)}</TableCell>*/}
                            {/*                    <TableCell onClick={detailExam(exam)} align="center">{formatDate(exam.examEndTime)}</TableCell>*/}
                            {/*                    <TableCell onClick={detailExam(exam)} align="center"><b>{exam.keyCode}</b></TableCell>*/}
                            {/*                    <TableCell width="1%" align="center">*/}
                            {/*                        <div>*/}
                            {/*                            <IconButton*/}
                            {/*                                onClick={(event) => {*/}
                            {/*                                    setOpenMenu(index);*/}
                            {/*                                    setAnchorEl(event.currentTarget);*/}
                            {/*                                }}><MoreVertIcon/>*/}
                            {/*                            </IconButton>*/}
                            {/*                            <Menu open={(openMenu === index)}*/}
                            {/*                                  anchorEl={anchorEl}*/}
                            {/*                                  onClose={() => setOpenMenu(-1)}*/}
                            {/*                                  transformOrigin={{horizontal: 'right', vertical: 'top'}}*/}
                            {/*                                  anchorOrigin={{horizontal: 'left', vertical: 'top'}}*/}
                            {/*                                  MenuListProps={{*/}
                            {/*                                      'aria-labelledby': 'basic-button',*/}
                            {/*                                  }}>*/}
                            {/*                                <MenuItem onClick={detailExam(exam)}>Edit</MenuItem>*/}
                            {/*                                <MenuItem onClick={() => handleDelete(index)}>Delete</MenuItem>*/}
                            {/*                            </Menu>*/}
                            {/*                        </div>*/}
                            {/*                    </TableCell>*/}
                            {/*                </TableRow>*/}
                            {/*            ))}*/}
                            {/*        </TableBody>*/}
                            {/*    </Table>*/}
                            {/*    <TablePagination*/}
                            {/*        rowsPerPageOptions={[5, 10, 15, 20]}*/}
                            {/*        component={"div"}*/}
                            {/*        colSpan={5}*/}
                            {/*        count={examListTemp.length}*/}
                            {/*        rowsPerPage={rowsPerPage}*/}
                            {/*        page={page}*/}
                            {/*        onPageChange={handleChangePage}*/}
                            {/*        onRowsPerPageChange={handleChangeRowsPerPage}*/}
                            {/*        sx={{*/}
                            {/*            '& p': {*/}
                            {/*                marginBottom: 0*/}
                            {/*            }*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</TableContainer>*/}
                        </Box>
                    </Box>
                )}
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                style={{ marginTop: '40px' }}
                open={openAlert} autoHideDuration={6000} onClose={() => {
                }}>
                <div>
                    <Alert variant="error" title={message} />
                </div>
            </Snackbar>
        </Box>
    );
}

export default ExamList;