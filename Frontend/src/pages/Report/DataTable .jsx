import React, {useEffect, useState} from 'react';
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
import {Typography} from "@mui/material";
import {CircularProgressbar,buildStyles} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {red} from "@mui/material/colors";
function DataTable  ({data})  {
    const [anchorEl, setAnchorEl] = useState(null);
    const percentage = 66;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <table className={'table-content'}>
            <thead>
            <tr className="table-header" >
                <th>Type</th>
                <th className={'table-name'} >Exam Name</th>
                <th className={'split-text'}>Total Participants</th>
                <th>Accuracy</th>
                <th>Start time</th>
                <th>End Time</th>
                <th></th>

            </tr>
            </thead>
            <tbody  style={{width:'100%',textAlign:"center",}}>
            {data.map((row, index) => (
                <tr key={index} className={'row-content'} >
                        <td>
                            <div className={'btn-live'}>
                                <div className={'btn-live btn-live-in'} style={{width:"50%",backgroundColor:'rgba(123,107,234,0.27)'}}><PlaylistAddCheckIcon fontSize={"small"}/>Live</div>
                        </div></td>
                    <td className={'table-name'}>
                        <div >
                            {row.examName}
                        </div>
                        <div className={'row-date'}>{parseDateString(row.examStartTime)}</div>
                    </td>
                    <td className={'split-text'}>{row.numberSubmit}</td>
                    <td >
                        <div className={'cricularprogressbar'} >
                            <div style={{width: 30}} >
                                <CircularProgressbar
                                    styles={buildStyles({
                                        pathColor: "#d6a13c"
                                    })}
                                    strokeWidth={14} value={percentage}/>

                            </div>
                            <div style={{marginLeft:8}}>{`${percentage}%`}</div>
                        </div>

                    </td>
                    <td>{parseTimeString(row.examStartTime)}</td>
                    <td>{parseTimeString(row.examEndTime)}</td>
                    <td className={'dropdown'}><MoreVertIcon fontSize={"small"} aria-controls="simple-menu"  aria-haspopup="true" onClick={handleClick}
                                                              sx={{":hover":{
                                                                  borderRadius:1,
                                                                    backgroundColor:'#e5e5e5'
                                                                  }

                        }}/>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            sx={{
                                left:'-50px',fontSize:'5px'
                            }}
                        >
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <DownloadIcon fontSize="inherit" sx={{color:'#090909'}} />
                                </ListItemIcon>
                                <ListItemText><Typography  sx={{fontSize:'13px'}}>Download Excel</Typography></ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <EditIcon fontSize="inherit" sx={{color:'#090909'}} />
                                </ListItemIcon>
                                <ListItemText><Typography  sx={{fontSize:'13px'}}>Rename report</Typography></ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <DeleteIcon fontSize="inherit" sx={{color:'#090909',}} />
                                </ListItemIcon>
                                <ListItemText><Typography  sx={{fontSize:'13px'}}>Delete report</Typography></ListItemText>
                            </MenuItem>
                        </Menu></td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DataTable;
