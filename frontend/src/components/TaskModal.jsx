import React, { useContext, useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { TaskContext } from '../context/taskContext';
import { FaEdit } from "react-icons/fa";



const TaskModal = ({ isOpen, onClose, taskToEdit, }) => {
  if(!isOpen) return null;

  const { loading, error, setError, updateTask, addTask } = useContext(TaskContext);
  const today = new Date().toISOString().split('T')[0];
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    completed: false,
    id: null

  })
  useEffect(() => {
    if (taskToEdit) {
      setTaskData({
        ...taskData,
        title: taskToEdit?.title || "",
        description: taskToEdit?.description || "",
        priority: taskToEdit?.priority || "Low",
        dueDate: taskToEdit?.dueDate?.split('T')[0] || "",
        completed: !!taskToEdit?.completed,
        id: taskToEdit._id
      })
    }
  }, [isOpen, taskToEdit])

  const inputHandler = (e) => {
    const {name ,type ,value} = e.target
    setTaskData({
      ...taskData,
      [name]: type === "radio" ? value === "true" : value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(taskData.id);
    if (taskData.dueDate < today) {
      setError("Due date cannot be in the past")
    }
    if (isEdit) {
      await updateTask(taskData.id, taskData);
    }
    else {
      await addTask(taskData);
    }
    onClose();
  }


  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-black/20  z-50 flex items-center justify-center p-4'>
      <div className="bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex text-2xl font-semibold text-gray-800 items-center gap-2">
            {taskData.id ? <FaEdit className='text-3xl text-orange-500' /> : <IoAddCircle className='text-3xl text-orange-500' />}
            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-red-500">
            <IoMdClose className='text-2xl' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className='text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100'>{error}</div>
          )}
          {/* Task Title */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={inputHandler}
              required
              placeholder='Enter task title'
              className="w-full border border-purple-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="2"
              name='description'
              value={taskData.description}
              onChange={inputHandler}
              placeholder='Add some details about the task'
              className="w-full border border-purple-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300" ></textarea>
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name='priority'
                value={taskData.priority}
                onChange={inputHandler}
                className="w-full border border-purple-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                name="dueDate"
                value={taskData.dueDate}
                onChange={inputHandler}
                type="date"
                required
                min={today}
                className="w-full border border-purple-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>

          {/* Status (Radio buttons) */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="completed"
                  value="true"
                  checked={taskData.completed === true}
                  onChange={inputHandler} />
                <span className="text-gray-700">Completed</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="completed"
                  value="false"
                  checked={taskData.completed === false}
                  onChange={inputHandler} />
                <span className="text-gray-700">In Progress</span>
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition" >
           {loading ? "Saving task" : (taskData.id ? "Update Task" :"Create Task")}
          </button>
        </form>
      </div>

    </div>
  )
}

export default TaskModal
