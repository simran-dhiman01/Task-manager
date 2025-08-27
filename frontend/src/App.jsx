import { Outlet, Route, Routes, } from 'react-router'
import Layout from './components/Layout';
import Login from './components/Auth/Login';
import { Toaster } from 'react-hot-toast'
import Signup from './components/Auth/Signup';


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/login' element={
          <div className='fixed inset-0 bg-gray-300 flex items-center justify-center'>
            <Login />
          </div>
        } />
        <Route path='/signup' element={
          <div className='fixed inset-0 bg-gray-300 flex items-center justify-center'>
            <Signup />
          </div>
        } />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px",
          },
          success: {
            style: { background: "green", color: "white" },
          },
          error: {
            style: { background: "red", color: "white" },
          },
        }} />

    </>

  )
}

export default App
