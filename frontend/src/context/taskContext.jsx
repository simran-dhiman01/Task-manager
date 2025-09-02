import { createContext, useEffect, useState } from "react";
import api from '../utils/Api';
import toast from "react-hot-toast";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetched, setFetched] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/tasks');
            setAllTasks(res.data.tasks || []);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch tasks");
            console.log(error)
        }
        finally {
            setLoading(false);
            setFetched(true);
        }
    }

    const addTask = async (newTask) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/tasks/add", newTask);
            setAllTasks((prev) => [res.data.task, ...prev]);
            toast.success("Task added successfully");
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Failed to add task");
            toast.error("Failed to add task");
        } finally {
            setLoading(false);
        }
    };
    const updateTask = async (id, updatedTask) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.put(`/tasks/update/${id}`, updatedTask);
            setAllTasks((prev) =>
                prev.map((task) => (task._id === id ? res.data.updated : task))
            );
            toast.success("Task updated successfully ");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update task");
            toast.error("Failed to update task");
        } finally {
            setLoading(false);
        }
    };
    const deleteTask = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/tasks/delete/${id}`);
            setAllTasks((prev) => prev.filter((task) => task._id !== id));
            toast.success("Task deleted successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete task");
            toast.error("Failed to delete task ");
        } finally {
            setLoading(false);
        }
    };
    const value = {
        allTasks,
        loading,
        fetched,
        error,
        //actions
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
    }

    return <TaskContext.Provider value={value}> {children} </TaskContext.Provider>
}