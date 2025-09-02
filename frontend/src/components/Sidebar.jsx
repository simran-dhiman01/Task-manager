import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
import { TaskContext } from '../context/taskContext';
import { CircleCheck,  Home,  ListChecks, Menu, X, } from 'lucide-react'
import { NavLink } from 'react-router';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { allTasks } = useContext(TaskContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totaltasks = allTasks?.length || 0
  const completedTasks = allTasks?.filter((t) => t.completed).length || 0;
  const productivity = totaltasks > 0
    ? Math.round((completedTasks / totaltasks) * 100)
    : 0
  const username = currentUser?.name || "User"
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [mobileOpen])

  const menuItems = [
    { text: "Dashboard", path: '/', icon: <Home className="w-6 h-6" /> },
    { text: "Pending Tasks", path: '/pending', icon: <ListChecks className='w-6 h-6' /> },
    { text: "Completed Tasks", path: '/complete', icon: <CircleCheck className='w-6 h-6' /> },
  ]

  const renderMenuItems = (isMobile = false) => (
    <ul className='space-y-2'>
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink to={path} className={({ isActive }) => [
            "group flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-75",
            isActive ? "bg-orange-50 border-l-4 border-orange-500 font-medium shadow-sm text-orange-500" : "hover:bg-orange-50/50 text-gray-600 hover:text-orange-500",
            isMobile ? "justify-start" : "lg:justify-start"
          ].join(" ")} onClick={() => setMobileOpen(false)}>

            <span className='transition-transform duration-300 group-hover:scale-110 text-orange-500'>
              {icon}
            </span>
            <span className={` ${isMobile ? "block" : "hidden lg:block"} text-base font-medium ml-2`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className='hidden md:flex flex-col fixed  h-full w-20 lg:w-64 bg-white/90 backdrop-blur-sm border-r border-purple-100 shadow-md'>
        <div className='p-5 border-b border-purple-100 lg:block hidden'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold shadow-md'>
              {initial}
            </div>

            <div>
              <h2 className='font-bold text-lg text-gray-800'>Hey, {username}</h2>
            </div>
          </div>
        </div>

        <div className='p-4 space-y-6 overflow-y-auto flex-1'>
          <div className='bg-purple-50/50 hidden lg:block rounded-xl p-3 border border-purple-100'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-semibold text-orange-500'>PRODUCTIVITY</h3>
              <span className='text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full'>{productivity}%</span>
            </div>
            <div className='w-full h-2 bg-purple-100 rounded-full overflow-hidden'>
              <div className='h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse'
                style={{ width: `${productivity}%` }} >
              </div>
            </div>
          </div>
          {renderMenuItems()}
        </div>
      </div>

      {/* Mobile Menu */}
      {!mobileOpen && (
        <button onClick={() => setMobileOpen(true)} className='rounded-full bg-orange-400 text-white md:hidden flex items-center justify-center mt-5 ml-4 w-8 h-8'>
          <Menu className='w-6 h-6' />
        </button>
      )}
      {mobileOpen && (
        <div className='fixed inset-0 z-40 transition-transform duration-300 '>
          <div onClick={() => setMobileOpen(false)}
            className='fixed inset-0 bg-black/40 backdrop-blur-sm' />

          <div onClick={(e) => e.stopPropagation()}
            className='absolute mt-16 top-0 flex flex-col gap-4 left-0 w-64 h-full bg-white/90 backdrop-blur-md border-r border-purple-100 shadow-lg z-50 p-4'>
            <div className='flex justify-between items-center mb-8 relative pb-2'>
              <button onClick={() => setMobileOpen(false)} className='text-gray-700 cursor-pointer absolute right-3 top-5 hover:text-orange-500'>
                <X className='w-6 h-6' />
              </button>
            </div>

            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-full bg-gradient-to-r from-orange-300 to-orange-400 flex items-center justify-center text-white font-bold shadow-md'>
                {initial}
              </div>
              <div>
                <h2 className='font-bold text-lg text-gray-800'>Hey, {username}</h2>
              </div>
            </div>
            {renderMenuItems(true)}
          </div>

        </div>
      )}
    </>
  )
}

export default Sidebar
