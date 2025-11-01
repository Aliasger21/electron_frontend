import React from 'react'
import AdminRoutes from './routes/adminRoute'
import UserRoutes from "./routes/userRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";

const App = () => {
  return (
    <>
      <AdminRoutes />
      <UserRoutes />
    </>
  )
}

export default App
