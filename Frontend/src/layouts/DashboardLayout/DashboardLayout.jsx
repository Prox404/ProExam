import { Box } from "@mui/material";
import Sidebar from "~/components/Sidebar";
import styles from "./DashboardLayout.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {

    const [sidebarActice, setSidebarActive] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [])

    
    const toogleSidebar = () => {
        setSidebarActive(!sidebarActice);
    }

    return (<>
        <div className={styles['background']}></div>
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '100vh',
            width: '100%',
            '--sidebar-size': sidebarActice ? '250px' : '70px',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: {
                    xs: 'var(--sidebar-inactive)',
                    md: sidebarActice ? 'var(--sidebar-active)' : 'var(--sidebar-inactive)',
                },
                transition: 'width 0.3s',
                overflow: 'hidden',
                position: 'fixed',
            }}>
                <Sidebar isActive={sidebarActice} onActive={toogleSidebar} />
            </Box>
            <Box sx={{
                flex: 1,
                paddingLeft: {
                    xs: 'var(--sidebar-inactive)',
                    md: sidebarActice ? 'var(--sidebar-active)' : 'var(--sidebar-inactive)',
                },
            }}>
                <Box sx={{
                    padding: '20px',
                    width: '100%',
                    height: '100%', 
                }}>{children}</Box>
            </Box>
        </Box>
    </>)
}

export default DashboardLayout;