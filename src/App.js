import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Otp from './pages/Otp';
import Error from './pages/Error';
import Headers from './components/Headers';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ProtectedRoutes from './ProtectedRoutes';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
    {/* <BrowserRouter> */}
      {/* <Headers /> */}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/adminLogin' element={<AdminLogin />} />
        {/* <Route element={<ProtectedRoutes />}  */}
        <Route path='/' element={<Dashboard />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
        {/* </Route> */}
        <Route path='/user/otp' element={<Otp />} />
        
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
