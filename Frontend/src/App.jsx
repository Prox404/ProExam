
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Fragment } from 'react';
import './App.css'
import DefaultLayout from '~/layouts/DefaultLayout'
import { publicRoutes } from '~/routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, createContext, useEffect } from 'react';

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
          defaultBackground: mode ? '#121212' : '#fff',
          cardBackground: mode ? '#202020' : '#fff',
          textColor: mode ? '#fff' : '#000',
          textColorSecondary: mode ? '#fff' : '#000',
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
            </div>
          </Router>
        </ThemeProvider>
      </ThemeContext.Provider>
    </div>
  )
}

export default App
