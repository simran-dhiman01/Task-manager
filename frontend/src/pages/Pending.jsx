import { Award, Clock, ListChecks, Plus, SortAsc, SortDesc } from 'lucide-react'
import React, { useMemo, useEffect, useState, useContext } from 'react'
import { TaskContext } from '../context/taskContext'
import { IoFilterSharp } from "react-icons/io5";
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

const Pending = () => {
  const { allTasks, fetchTasks, fetched, loading: taskLoading } = useContext(TaskContext);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();   // fetch tasks on mount
  }, []);

  const sortedPendingTasks = useMemo(() => {
    const filtered = allTasks.filter((t) =>
      !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no'));
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()];
    })
  }, [allTasks, sortBy])

  const SORT_OPTIONS = [
    { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
    { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
    { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
  ]

  const showEmpty =
    !taskLoading &&
    fetched &&
    sortedPendingTasks.length === 0;
  return (
    <div className='p-6 overflow-hidden'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4'>
        <div className='min-w-0'>
          <h1 className='text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 '>
            <ListChecks className='text-orange-500 shrink-0' />
            <span>Pending Tasks</span>
          </h1>
          <p className='text-gray-500 ml-10 mt-1 truncate text-sm'>{sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'} needs your attention</p>
        </div>

        <div className='flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto'>
          <div className='flex items-center gap-2 text-gray-700 font-medium'>
            <IoFilterSharp className='text-base text-orange-500' />
            <span className='text-sm'>Sort by:</span>
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className='px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-orange-500 md:hidden text-sm'>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
          <div className='hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-3'>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setSortBy(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs text-gray-600 font-medium transition-all duration-200 flex items-center gap-1.5 ${sortBy === opt.id
                  ? "bg-white border border-orange-400"
                  : "  hover:bg-purple-100"
                  }`}>
                {opt.icon}{opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div onClick={() => setShowModal(true)}
        className='hidden md:block p-5 border-2 border-dashed border-purple-200 rounded-xl hover:border-gray-400 transition-colors cursor-pointer mb-6 bg-purple-50/50 group'>
        <div className='flex items-center justify-center gap-3 text-gray-500 group-hover:text-orange-600 transition-colors'>
          <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200'>
            <Plus className='text-orange-600' size={18} />
          </div>
          <span className='font-medium text-lg'>Add New Task</span>
        </div>
      </div>

      <div className='space-y-4'>
        {showEmpty ? (
          <div className='p-8 bg-white rounded-xl shadow-sm border border-purple-100 text-center'>
            <div className='max-w-xs mx-auto py-6'>
              <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Clock className='w-8 h-8 text-orange-600' />
              </div>
              <h3 className='text-lg font-semibold mb-2 text-gray-800'>
                All caught up!
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                No Pending task - good job!
              </p>
              <button onClick={() => setShowModal(true)}
                className='px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg text-sm font-medium transition-colors'>
                Create new task
              </button>
            </div>
          </div>
        ) : (
          sortedPendingTasks.map(task => (
            <TaskItem key={task._id}
              task={task}
              showCompleteCheckbox
              onEdit={() => { setSelectedTask(task); setShowModal(true) }}
            />
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

    </div>
  )
}

export default Pending
