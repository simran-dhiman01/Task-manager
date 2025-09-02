import { Calendar, CheckCircle2, Clock, Edit2, MoreVertical, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { TaskContext } from '../context/taskContext';
import { format, isToday } from 'date-fns'

const TaskItem = ({ task, onEdit, showCompleteCheckbox = true }) => {
    const { updateTask, deleteTask } = useContext(TaskContext);
    const [showMenu, setShowMenu] = useState(false);
    const [isCompleted, setIsCompleted] = useState(
        [true, 1, 'yes'].includes(
            typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
        )
    );

    useEffect(() => {
        setIsCompleted(
            [true, 1, 'yes'].includes(
                typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
            ))
    }, [task.completed])

    const handleComplete = async () => {
        const newStatus = !isCompleted;
        await updateTask(task._id, { completed: newStatus });
    }
    const handleAction = (action) => {
        setShowMenu(false);
        if (action === 'edit') onEdit();
        if (action === 'delete') handleDelete()

    }
    const handleDelete = async () => {
        await deleteTask(task._id);
    }

    const MENU_OPTIONS = [
        { action: "edit", label: "Edit task", icon: <Edit2 size={14} className='text-blue-600' /> },
        { action: "delete", label: "Delete task", icon: <Trash2 size={14} className='text-red-600' /> },
    ]
    const getPriorityBadgeColor = (priority) => {
        const colors = {
            low: "bg-green-100 text-green-900",
            medium: "bg-yellow-100 text-amber-600",
            high: "bg-red-100 text-red-600",
        }
        return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-700"
    }
    const borderColor = isCompleted ? "border-green-500" : "border-purple-100"


    return (
        <>
        <div className={`group p-4 sm:p-5 min-h-48 relative shadow-sm rounded-xl bg-white border-l-4 hover:shadow-md transition-all duration-300 ${borderColor}`}>
            <div className='flex items-center justify-between'>
                <div className='flex items-start gap-2 sm:gap-3 flex-1 min-w-0'>
                    {showCompleteCheckbox && (
                        <button onClick={handleComplete}
                            className={` mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-purple-100 transition-colors duration-300 ${isCompleted ? "text-green-500" : "text-gray-300"} `}>
                            <CheckCircle2 size={18} className={` w-4 h-4 sm:w-5 sm:h-5 ${isCompleted ? "fill-green-500" : ""}`} />
                        </button>
                    )}
                    <div className='flex-1 min-w-0'>
                        <div className='flex items-baseline gap-2 mb-1 flex-wrap'>
                            <h3 className={` text-base sm:text-lg font-medium truncate ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {task.title}
                            </h3>
                            <span className={`${getPriorityBadgeColor(task.priority)} text-xs px-2 py-1 rounded-lg shrink-0`}>
                                {task.priority}
                            </span>
                        </div>
                        {task.description && (
                            <p className='text-sm text-gray-500 mt-1 truncate'> {task.description}</p>
                        )}
                    </div>
                </div>

                <div className='relative'>
                    <button onClick={() => setShowMenu(!showMenu)}
                        className='p-1 sm:p-1.5 hover:bg-purple-100 rounded-lg text-gray-500 hover:text-orange-700 transition-colors duration-200'>
                        <MoreVertical className='w-4 h-4 sm:w-5 sm:h-5 ' size={18} />
                    </button>
                    {showMenu && (
                        <div className='absolute right-0 mt-1 w-40 sm:w-48 bg-white border border-purple-100 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn'>
                            {MENU_OPTIONS.map((opt) => (
                                <button key={opt.action} onClick={() => { handleAction(opt.action) }}
                                    className='w-full px-3 sm:px-4 py-2 text-left text-sm sm:text-lg hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200'>
                                    {opt.icon}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className='absolute bottom-5 right-6'>
                <div className={`flex items-center  gap-1.5 text-sm font-medium whitespace-nowrap ${task.dueDate && isToday(new Date(task.dueDate)) ? "text-red-600" : "text-gray-500"}`}>
                    <Calendar className='w-3.5 h-3.5' />
                    {task.dueDate ? (isToday(new Date(task.dueDate)) ?
                        'Today' : format(new Date(task.dueDate), 'MMM dd')) : '-'}
                </div>
                <div className='flex items-center gap-1.5 text-sm text-gray-400 whitespace-nowrap'>
                    <Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5'/>
                        {task.createdAt ? 
                        `Created ${format(new Date(task.createdAt) ,'MMM dd')}` : 'No Date'}
                </div>
            </div>
        </div>

        </>
    )
}

export default TaskItem
