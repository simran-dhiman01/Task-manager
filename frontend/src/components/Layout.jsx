import { useContext, useMemo, } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router';
import { AuthContext } from '../context/authContext';
import { TaskContext } from '../context/taskContext';
import { BsArrowUpRightCircle, BsCircleFill } from "react-icons/bs";
import { FaArrowTrendUp, FaRegCircle, FaRegClock } from "react-icons/fa6";



const Layout = () => {
    const { currentUser } = useContext(AuthContext);
    // const { allTasks , fetchTasks } = useContext(TaskContext);
    const allTasks = [];
    const fetchTasks = () => {

    }

    const stats = useMemo(() => {
        //creating an array of tasks which are completed and counting the length of the array.
        const completedTasks = allTasks.filter(t =>
            t.completed === true || t.completed === 1 ||
            (typeof t.completed === "string" && t.completed.toLowerCase() === 'yes')
        ).length
        const totalCount = allTasks.length
        const pendingTasks = totalCount - completedTasks;
        const completionPercentage = totalCount ?
            Math.round((completedTasks / totalCount) * 100) : 0
        return {
            completedTasks,
            totalCount,
            pendingTasks,
            completionPercentage,
        }
    }, [allTasks]);

    const StatsCard = ({ title, value, icon }) => (
        <div className='p-2 sm:p-3 rounded-xl bg-white shadow-sm  border border-purple-100 hover:shadow-md transition-all duration-300 hover:border-purple-200 group'>
            <div className='flex items-center gap-2'>
                <div className='p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/10'>
                    {icon}
                </div>
                <div className='min-w-0'>
                    <p className='text-lg sm:text-xl font-bold text-orange-400'> {value} </p>
                    <p className='text-sm text-gray-500 font-medium'>{title}</p>
                </div>
            </div>
        </div>
    )
    // if (loading) return (
    //     <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
    //         <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600' />
    //     </div>
    // )
    // if (error) return (
    //     <div className='min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
    //         <div className='bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md'>
    //             <p className='mb-2 font-medium'>Error Loading Tasks</p>
    //             <p className='text-sm'>{error}</p>
    //             <button
    //                 onClick={fetchTasks}
    //                 className='mt-4 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors'>
    //                 Try Again
    //             </button>
    //         </div>
    //     </div>
    // )


    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <Sidebar />
            <div className='ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 transition-all duration-300'>
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
                    <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
                        {/* <Outlet context={{tasks, refreshTasks:fetchTasks}}/>  */}
                        <Outlet />
                    </div>

                    {/* Task Statistics    */}
                    <div className='xl:col-span-1 space-y-4 sm:space-y-6'>
                        <div className='bg-white rounded-xl p-4  sm:p-5 shadow-sm border border-purple-100'>
                            <h3 className='text-base sm:text-lg md:text-xl text-gray-800 font-semibold mb-3 sm:mb-4 flex items-center gap-2'>
                                <FaArrowTrendUp className='text-orange-400 text-xl' />
                                Task Statistics
                            </h3>
                            <div className='grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6'>
                                <StatsCard title="Total Tasks" value={stats.totalCount} icon={<FaRegCircle className='text-orange-400' />} />
                                <StatsCard title="Completed" value={stats.completedTasks} icon={<FaRegCircle className='text-green-500' />} />
                                <StatsCard title="Pending" value={stats.pendingTasks} icon={<FaRegCircle className='text-red-500' />} />
                                <StatsCard title="Completion Rate" value={stats.completionPercentage} icon={<BsArrowUpRightCircle className='text-orange-400 text-lg' />} />
                            </div>
                            <hr className='my-3 sm:my-4 border border-purple-100' />
                            <div className='space-y-2 sm:space-y-3'>
                                <div className='flex items-center justify-between text-gray-700'>
                                    <span className='text-xs sm:text-lg font-medium flex items-center gap-1.5'>
                                        <BsCircleFill className='text-lg text-orange-400 p-0.5' />
                                        Task Progress
                                    </span>
                                    <span className='text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 sm:px-2 rounded-full'>
                                        {stats.completedTasks} / {stats.totalCount}
                                    </span>
                                </div>
                                <div className='pt-1 relative'>
                                    <div className='flex gap-1.5 items-center'>
                                        <div className='flex-1 h-2 sm:h-3 bg-purple-100 rounded-full overflow-hidden'>
                                            <div className='h-full bg-gradient-to-r from-orange-300 to-orange-400 transition-all duration-500'
                                                style={{ width: `${stats.completionPercentage}%` }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className='bg-white rounded-xl p-4 sm:p-5 shadow-sm  border border-purple-100'>
                            <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2'>
                                <FaRegClock className='text-2xl text-orange-400 font-bold' />
                                Recent Activity
                            </h3>
                            <div className='space-y-2 sm:space-y-3'>
                                {allTasks.slice(0, 3).map((task) => (
                                    <div key={task._id || task.id}
                                        className='flex items-center justify-between p-2 sm:p-3 hover:bg-purple-50/50 rounded-lg transition-colors duration-200 border border-transparent hover:border-purple-100'>
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-gray-700 break-words whitespace-normal'>
                                                {task.title}
                                            </p>
                                            <p className='text-xs text-gray-500 mt-0.5'>
                                                {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "No Date"}
                                            </p>
                                        </div>
                                        <span className={` px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${task.completed ? "bg-green-100 text-green-700" : "bg-fuchsia-100 text-fuchsia-700"}`}>
                                            {task.completed ? "Done" : "Pending"}
                                        </span>
                                    </div>
                                ))}
                                {allTasks.length === 0 && (
                                    <div className='text-center py-4 sm:py-6 px-2'>
                                        <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 mx-auto sm:mb-4 flex items-center justify-center'>
                                            <FaRegClock className='text-3xl text-orange-400 font-bold' />
                                        </div>
                                        <p className='text-base text-gray-500'>No recent activity</p>
                                        <p className='text-sm text-gray-500 mt-1'>Tasks will appear here</p>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
