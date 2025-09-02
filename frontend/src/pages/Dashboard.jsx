import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FiHome, FiPlus } from "react-icons/fi";
import { TaskContext } from '../context/taskContext';
import { IoFilterSharp } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';


const Dashboard = () => {
  const { loading: taskLoading, allTasks, fetchTasks, fetched } = useContext(TaskContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();   // fetch tasks on mount
  }, []);

  const stats = useMemo(() => ({
    total: allTasks.length,
    lowPriority: allTasks.filter((t) => t.priority?.toLowerCase() === 'low').length,
    mediumPriority: allTasks.filter((t) => t.priority?.toLowerCase() === 'medium').length,
    highPriority: allTasks.filter((t) => t.priority?.toLowerCase() === 'high').length,
    completed: allTasks.filter((t) => t.completed === true || t.completed === 1 || (
      typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes'
    )).length,
  }), [allTasks])

  const filteredTasks = useMemo(() => allTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    switch (filter) {
      case "today":
        return dueDate.toDateString() == today.toDateString()
      case "week":
        return dueDate >= today && dueDate <= nextWeek
      case "high":
      case "medium":
      case "low":
        return task.priority?.toLowerCase() === filter
      default:
        return true
    }
  }), [allTasks, filter])


  const summaryCards = [
    { key: "total", title: "Total Tasks", bg: "bg-blue-50 border border-blue-200", textColor: "text-blue-600" },
    { key: "lowPriority", title: "Low Priority", bg: "bg-green-50 border border-green-200", textColor: "text-green-600" },
    { key: "mediumPriority", title: "Medium Priority", bg: "bg-yellow-50 border border-yellow-200", textColor: "text-amber-400" },
    { key: "highPriority", title: "High Priority", bg: "bg-red-50 border border-red-200", textColor: "text-red-600" },
  ]
  const filterOptions = ["all", "today", "week", "high", "medium", "low"];
  const filterLabels = {
    all: "All Tasks",
    today: "Today's Tasks",
    week: "This Week",
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority"
  }

  const showEmpty =
    !taskLoading &&
    fetched &&
    filteredTasks.length === 0;

  return (
    <div className='p-4 md:p-6 overflow-hidden'>

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 md:mb-6'>
        <div className='min-w-0'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2 '>
            <FiHome className='text-orange-500 shrink-0' />
            <span className='truncate'>Task Overview</span>
          </h1>
          <p className='text-gray-500 ml-10 mt-1 truncate text-sm'>Manage your tasks efficiently</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className='bg-gradient-to-r w-full md:w-fit justify-center from-amber-500 to-orange-500 rounded-lg text-white shadow cursor-pointer flex items-center text-base sm:text-lg gap-2 font-medium py-2 px-4'>
          <FiPlus />
          Add New Task
        </button>
      </div>

      {/* Summary cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6'>
        {summaryCards.map(({ key, title, bg, textColor }) => (
          <div key={key} className={`${bg} rounded-xl shadow hover:shadow-md flex flex-row md:flex-col py-3 items-center md:justify-center px-4 gap-2`}>
            <h1 className={`${textColor} font-bold text-2xl md:text-3xl`}>
              {stats[key]}
            </h1>
            <h3 className='text-gray-600 font-medium'>{title}</h3>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className='space-y-4'>
        <div className='bg-white border border-purple-100 rounded-xl shadow p-4 flex flex-row md:items-center justify-between'>
          <div className='flex items-center gap-2 min-w-0'>
            <IoFilterSharp className='text-2xl sm:text-3xl text-orange-500' />
            <h2 className='md:text-xl text-lg lg:text-2xl font-semibold text-gray-800 truncate'>
              {filterLabels[filter]}
            </h2>
          </div>

          {/* Pills for md+ */}
          <ul className='hidden md:flex p-1 border border-purple-50 bg-purple-50 rounded-xl items-center gap-2'>
            {filterOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 text-sm text-gray-600 font-medium cursor-pointer rounded-xl ${filter === opt
                  ? "bg-white border-2 border-orange-400 py-1"
                  : "hover:bg-purple-100 py-2"
                  }`}  >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </li>
            ))}
          </ul>
          {/* Select dropdown for < md */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="md:hidden border border-purple-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-gray-700" >
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='space-y-4 my-6'>
        {showEmpty ? (
          <div className='bg-white p-6 rounded-xl shadow-sm border border-purple-100 flex flex-col items-center justify-center'>
            <div className='p-1.5 md:p-2 rounded-lg'>
              <CiCalendar className='w-8 h-8 text-orange-500' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-800'>No tasks found</h3>
            <p className='mb-4 text-sm text-gray-500'>{filter === "all" ?
              "Create your first task to get started" : "No task match this filter"}</p>
            <button onClick={() => setShowModal(true)}
              className='bg-gradient-to-r w-full md:w-fit justify-center from-amber-500 to-orange-500 rounded-lg text-white shadow cursor-pointer flex items-center text-base sm:text-lg gap-2 font-medium py-2 px-4'>Add New task</button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onEdit={() => { setSelectedTask(task); setShowModal(true) }} />
          ))
        )}
      </div>

      {
        (showModal || !!selectedTask) && (
          <TaskModal
            isOpen={showModal || !!selectedTask}
            onClose={() => { setShowModal(false); setSelectedTask(null) }}
            taskToEdit={selectedTask} />
        )
      }
    </div >
  )
}

export default Dashboard
