import React from 'react'
import { createContext, useState, useEffect } from "react";
import api from '../utils/Api';
import { useNavigate } from 'react-router';
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      //No token → redirect to login
      if (!token) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        navigate("/login");
        return;
      }

      // Cached user
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }

      try {
        // Validate token with backend
        const user = await fetchCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem("currentUser", JSON.stringify(user));
        }
      } catch {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




const register = async (name, email, password) => {
  try {
    setLoading(true);
    const res = await api.post('/user/register', { name, email, password });
    if (res.data.success) {
      setCurrentUser(res?.data?.user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setError(null);
      navigate('/login');
      toast.success("Account Created Successfully.")
      return res.data.user;
    }
  } catch (error) {
    setError(error.response?.data?.message || "Registration failed");
    console.log(error)
  } finally {
    setLoading(false);
  }
}
const login = async (email, password) => {
  try {
    setLoading(true);
    const res = await api.post('/user/login', { email, password });
    if (res.data.success) {
      setCurrentUser(res?.data?.user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setError(null);
      navigate('/', { replace: true });
      toast.success(`Welcome Back ${res.data.user.name}`);
      return res.data.user;
    }
  } catch (error) {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    setError(error.response?.data?.message || "Login Failed");
    console.log(error)
  }
  finally {
    setLoading(false);
  }
}
const logout = async () => {
  try {
    await api.post("/user/logout");
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate('/login');
  } catch (error) {
    console.error("Logout failed", error);
  }
}
const fetchCurrentUser = async () => {
  try {
    setLoading(true);
    const res = await api.get('/user/me');
    setCurrentUser(res.data.user);
    setIsAuthenticated(true);
    localStorage.setItem("currentUser", JSON.stringify(res.data.user));
    setError(null);
    return res.data.user;
  } catch (error) {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    setError(error.response?.data?.message || "Failed to fetch user");
    console.log(error)
  } finally {
    setLoading(false);
  }
}
const updateProfile = async (profileData) => {
  try {
    setLoading(true);
    const res = await api.put("/user/updateProfile", profileData);
    if (res.data.success) {
      setCurrentUser(res.data.user);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setError(null);
      toast.success("Profile updated successfully");
    }
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error Updating Profile");
    setError(error.response?.data?.message || "Profile update failed");
    throw error;
  } finally {
    setLoading(false);
  }
}
const updatePassword = async (passwordData) => {
  try {
    setLoading(true);
    const res = await api.put("/user/updatePassword", passwordData);
    if (res.data.success) {
      toast.success("Password updated");
      setError(null);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error updating password");
    setError(error.response?.data?.message || "Password update failed");
    throw error;
  } finally {
    setLoading(false);
  }
}
const value = {
  currentUser,
  isAuthenticated,
  loading,
  error,
  // actions
  login,
  register,
  logout,
  fetchCurrentUser,
  updateProfile,
  updatePassword,
  // setters 
  setCurrentUser,
  setIsAuthenticated,
  setError,
};


return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

