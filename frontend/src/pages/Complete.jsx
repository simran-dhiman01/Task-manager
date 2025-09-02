import { Award, CircleCheck, Clock, SortAsc, SortDesc } from 'lucide-react'
import React, { useContext, useMemo, useState } from 'react'
import { IoFilterSharp } from 'react-icons/io5'
import { TaskContext } from '../context/taskContext';
import { useEffect } from 'react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

const Complete = () => {
  const { allTasks, fetchTasks, fetched, loading: taskLoading } = useContext(TaskContext);
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();   // fetch tasks on mount
  }, []);

  const SORT_OPTIONS = [
    { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
    { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
    { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
  ]
  const sortedCompletedTasks = useMemo(() => {
    return allTasks.filter(task => [true, 1, 'yes'].includes(
      typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
    ))
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'priority': {
            const order = { high: 3, medium: 2, low: 1 };
            return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
          }
          default:
            return 0;
        }
      })
  }, [allTasks, sortBy])

  const showEmpty =
    !taskLoading &&
    fetched &&
    sortedCompletedTasks.length === 0;
  return (
    <div className='p-6 overflow-hidden'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4'>
        <div className='min-w-0'>
          <h1 className='text-xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 '>
            <CircleCheck className='text-orange-500 shrink-0' />
            <span>Completed Tasks</span>
          </h1>
          <p className='text-gray-500 ml-10 mt-1 truncate text-sm'>{sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 && 's'} marked as completed</p>
        </div>

        <div className='flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto'>
          <div className='flex items-center gap-2 text-gray-700 font-medium'>
            <IoFilterSharp className='text-base text-orange-500' />
            <span className='text-sm'>Sort by:</span>
          </div>
          {/* mobile dropdown */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className='px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-orange-500 md:hidden text-sm'>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>

          {/* desktop buttons */}
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
          sortedCompletedTasks.map(task => (
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

export default Complete
