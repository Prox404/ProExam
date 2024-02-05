
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Fragment } from 'react';
import './App.css'
import DefaultLayout from '~/layouts/DefaultLayout'
import { publicRoutes } from '~/routes';

function App() {
  return (
    <div className="App">
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
    </div>
  )
}

export default App
