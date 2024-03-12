
import 'animate.css';
import { Box, Autocomplete, Typography, Button, TextField } from "@mui/material";
import DataTable from './DataTable .jsx';
import style from './Report.module.scss';
import reportempty from '/src/assets/reportempty.svg';
import { useEffect, useState } from "react";
import { getExamList } from "~/services/examService";
import { useNavigate } from "react-router-dom";
import Loading from '~/components/Loading';
import { useTheme } from '@mui/material';
function Report() {
    const [isListEmpty, setIsListEmpty] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const theme = useTheme();

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            let res = await getExamList(user.userId);
            setIsListEmpty(res.data);
            setLoading(false);
        }

        fetchData();

    }, []);

    // const filterExam  = useMemo((examName) => {
    //     const filter = isListEmpty.filter((exam) => {
    //         return exam.examName.toLowerCase().includes(examName.toLowerCase());
    //     });
    //     setFilterData(filter);
    // }, [isListEmpty]);

    useEffect(() => {
        setFilterData(isListEmpty);
    }, [isListEmpty]);

    const handleRowClick = (examId) => {
        console.log('examId', examId);
        navigate(`/report/exam-detail/${examId}`);
    }

    console.log(isListEmpty.length)
    // const theme = useTheme();
    return <>
        <Box height={'100%'} sx={{}}>
            <Box sx={{ color: 'white', letterSpacing: -0.14 }} display="flex" flexDirection="row" alignItems="center">
                <Autocomplete
                    disablePortal
                    id="combo-box-exam-name"
                    options={isListEmpty}
                    getOptionLabel={(option) => option.examName}
                    sx={{
                        width: 300, marginLeft: 2,
                        '& .MuiAutocomplete-inputRoot': {
                            backgroundColor: theme.palette.cardSecondaryBackground,
                            
                        },
                        '& .Mui-focused': {
                            color: theme.palette.textBlack,
                            backgroundColor: theme.palette.cardSecondaryBackground,
                            padding: '3px 5px',
                            borderRadius: '5px',
                        }
                    }}
                    size='small'
                    onChange={(event, newValue) => {
                        console.log(newValue);
                        if (newValue) {
                            setFilterData([newValue]);
                        } else {
                            setFilterData(isListEmpty);
                        }

                    }}
                    renderInput={(params) => <TextField {...params} label="Exam Name" />}
                />

            </Box>
            <Box className={style['box_content']} sx={{
                height: "90%", flexGrow: 1,
                transition: 'height 0.3s',
            }}>
                {isListEmpty === null || isListEmpty.length === 0 ? (
                    <Box id={"isEmpty"} className={style['box_content-empty']}  >
                        <img className={style['img_emtpy']} src={reportempty} />
                        <Typography margin={1}>It’s all about the data!</Typography>
                        <Typography color={'grey'}>Conduct your first game and you’ll see a report here.</Typography>
                        <Button margin={8} >Go to library</Button>
                    </Box>
                ) : (
                    <Box id={"notEmpty"} >
                        <DataTable data={filterData} handleRowClick={handleRowClick} />
                    </Box>

                )
                }
            </Box>
        </Box>
        <Loading isOpen={loading} />

    </>;
}
export default Report;