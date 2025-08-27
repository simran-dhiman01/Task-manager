import React, { useContext } from 'react'
import { AuthContext } from '../context/authContext';

const Sidebar = () => {
  const {currentUser } = useContext(AuthContext);
  return (
    <div className='w-[17%] p-4 shadow-md fixed min-h-screen bg-white'>
      <h1 className='font-semibold text-center text-2xl'> Hey, <span>Username</span></h1>
    </div>
  )
}

export default Sidebar
