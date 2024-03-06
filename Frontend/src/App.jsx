
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Fragment } from 'react';
import './App.css'
import DefaultLayout from '~/layouts/DefaultLayout'
import { publicRoutes } from '~/routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, createContext, useEffect } from 'react';
import LoadingTopBar from './components/LoadingTopBar';

export const ThemeContext = createContext();

function App() {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => {
    // Lấy giá trị từ localStorage, nếu không có thì sử dụng giá trị mặc định từ prefersDarkMode
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? storedTheme === 'dark' : prefersDarkMode;
  });

  useEffect(() => {
    localStorage.setItem('theme', mode ? 'dark' : 'light');
  }, [mode]);

  const theme =
    createTheme({
      palette: {
        mode: mode ? 'dark' : 'light',
        white: '#fff',
        textBlack: mode ? '#fff' : '#000',
        textWhite: mode ? '#000' : '#fff',
        defaultBackground: mode ? '#252525' : '#F2F7FF',
        cardBackground: mode ? '#202020' : '#fff',
        cardSecondaryBackground: mode ? '#3a3a3a' : '#f5f5f5',
        textColor: mode ? '#fff' : '#000',
        textColorSecondary: mode ? '#fff' : '#000',
        lineColor: mode ? '#3a3a3a' : '#C1C1C1',
        scoreExam: mode? '#747474' : '#F2F7FF',
        primaryCard: mode ? '#333' : '#435EBE',
        
      },
    })

  const handleChange = () => {
    setMode((prevMode) => !prevMode);
  };

  return (
    <div>
      <ThemeContext.Provider value={{ mode, handleChange }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          


            <Router>
              <div className="App">
              <LoadingTopBar>
                <Routes>
                  {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;

                    if (route.layout) {
                      Layout = route.layout;
                    } else if (route.layout === null) {
                      Layout = Fragment;
                    }

                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={
                          <Layout>
                            <Page />
                          </Layout>
                        }
                      />
                    );
                  })}
                </Routes>
                </LoadingTopBar>
              </div>
            </Router>
          
        </ThemeProvider>
      </ThemeContext.Provider>
    </div>
  )
}

export default App
