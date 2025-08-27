import React from 'react'
import { createContext, useState, useEffect } from "react";
import api from '../utils/Api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage OR backend
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await fetchCurrentUser(); // always fetch fresh
  //     } catch {
  //       const storedUser = localStorage.getItem("currentUser");
  //       if (storedUser) {
  //         setCurrentUser(JSON.parse(storedUser));
  //         setIsAuthenticated(true);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);


  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/user/register', {name, email, password});
      setCurrentUser(res?.data?.user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setError(null);
      return res.data.user;
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
      setCurrentUser(res?.data?.user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setError(null);
      return res.data.user;
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
      console.log(res);
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
      setCurrentUser(res.data.user);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setError(null);
      return res.data.user;
    } catch (error) {
      setError(error.response?.data?.message || "Profile update failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      await api.put("/user/updatePassword", passwordData);
      setError(null);
      return "Password updated successfully";
    } catch (error) {
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

