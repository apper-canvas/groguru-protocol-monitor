import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routeArray } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            {routeArray.map(route => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          toastClassName="bg-white border border-surface-200 rounded-lg shadow-lg"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;