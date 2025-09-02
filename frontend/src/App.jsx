import { Navigate, Outlet, Route, Routes, } from 'react-router'
import Layout from './components/Layout';
import Login from './components/Auth/Login';
import { Toaster } from 'react-hot-toast'
import Signup from './components/Auth/Signup';
import { useContext, } from 'react';
import { AuthContext } from './context/authContext';
import Dashboard from './pages/Dashboard';
import Pending from './pages/Pending';
import Complete from './pages/Complete';
import Profile from './pages/Profile';


const App = () => {
  const { currentUser  } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route path='/login' element={
          <div className='fixed inset-0 bg-gray-300 flex items-center justify-center'>
            <Login />
          </div>  } />
        <Route path='/SignUp' element={
          <div className='fixed inset-0 bg-gray-300 flex items-center justify-center'>
            <Signup />
          </div>  } />


        {/* Protected Routes */}
        <Route element={currentUser ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} /> 
          {/* add children */}
          <Route path="/pending" element={<Pending />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>



      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px",
          },
          success: {
            style: {
              border: "1px solid #22c55e", 
              background: "#dcfce7",      
              color: "#22c55e",
              fontWeight: 500,
              fontSize: "1rem",
            },
          },
          error: {
            style: {
              border: "1px solid #ef4444", 
              background: "#fee2e2",    
              color: "#ef4444",
              fontWeight: 500,
              fontSize: "1rem",
            },
          },
        }} />

    </>

  )
}

export default App
