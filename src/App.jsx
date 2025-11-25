import React from 'react'
import AdminRoutes from './routes/adminRoute'
import UserRoutes from "./routes/userRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <>
      <AdminRoutes />
      <UserRoutes />
      <ToastContainer position="top-right" />
    </>
  )
}

export default App
