import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router';
import { ChevronLeft, Shield } from 'lucide-react'
import { FaRegCircleUser, FaRegUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { AuthContext } from '../context/authContext';
import { LuShieldCheck } from "react-icons/lu";
import { IoLockClosedOutline } from "react-icons/io5";


const Profile = () => {
  const { updateProfile, updatePassword, currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: currentUser ? currentUser.name : "",
    email: currentUser ? currentUser.email : ""
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });

  const navigate = useNavigate()

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const userProfile = await updateProfile(profile);
      if (userProfile) {
        setProfile((prev) => ({
          ...prev,
          name: userProfile.name,
          email: userProfile.enmail
        }));
      }
    } catch (error) {
      console.log(error)
      setProfile({
        name: currentUser.name,
        email: currentUser.email,
      });
    }
    finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  }


  const savePasswords = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, password: true }));
    try {
      const res = await updatePassword(passwords);
    } catch (error) {
      console.error(error);
    } finally {
      setPasswords({ currentPassword: "", newPassword: "" });
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };


  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  const handlePasswordInput = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }
  return (
    <div className='bg-gray-50 xl:h-screen'>
      <div className='max-w-4xl mx-auto p-4 lg:p-6'>
        <button onClick={() => navigate('/')}
          className='text-gray-700 font-medium flex hover:text-orange-500 transition-colors duration-200 text-base justify-center items-center '>
          <ChevronLeft className='w-5 h-5 mr-1' />
          Back to Dashboard
        </button>
        <div className='flex flex-col gap-1 my-6 sm:my-8 items-center justify-center'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold '>Account Settings</h1>
          <p className='text-gray-500 text-xs sm:text-sm'>Manage your profile and security settings</p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 md:h-[50vh] items-stretch'>
          <section className='p-6 border border-purple-100 rounded-xl bg-white shadow-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <FaRegCircleUser className='text-xl text-orange-500' />
              <h2 className='text-xl font-semibold text-gray-800'>Personal Information</h2>
            </div>

            <form onSubmit={saveProfile} className='space-y-4 '>
              <div
                className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500'>
                <FaRegUser className='w-5 h-5 mr-2 text-orange-500' />
                <input
                  type='text'
                  name="name"
                  placeholder=""
                  value={profile.name}
                  onChange={handleInputChange}
                  className='w-full outline-none text-gray-700' />
              </div>

              <div
                className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500'>
                <MdOutlineEmail className='text-2xl mr-2 text-orange-500' />
                <input
                  type="email"
                  name="email"
                  placeholder=""
                  value={profile.email}
                  onChange={handleInputChange}
                  className='w-full outline-none text-gray-700' />
              </div>
              <button
                type="submit"
                disabled={loading.profile}
                className="w-full md:mt-10 bg-gradient-to-r from-amber-500 to-orange-500 cursor-pointer text-lg text-white font-medium py-2.5 rounded-lg transition">
                {loading.profile ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section className='p-6 border border-purple-100 rounded-xl bg-white shadow-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <LuShieldCheck className='text-xl text-orange-500' />
              <h2 className='text-xl font-semibold text-gray-800'>Security</h2>
            </div>

            <form onSubmit={savePasswords} className='space-y-4'>
              <div
                className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500'>
                <IoLockClosedOutline className='text-2xl mr-2 text-orange-500' />
                <input
                  type='password'
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordInput}
                  required
                  className='w-full outline-none text-gray-700' />
              </div>

              <div
                className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500'>
                <IoLockClosedOutline className='text-2xl mr-2 text-orange-500' />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={handlePasswordInput}
                  required
                  className='w-full outline-none text-gray-700' />
              </div>

              <button
                type="submit"
                disabled={loading.password}
                className="w-full md:mt-10 bg-gradient-to-r from-amber-500 to-orange-500 cursor-pointer text-lg text-white font-medium py-2.5 rounded-lg transition">
                {loading.password ? "Updating..." : "Change Password"}
              </button>
            </form>
            
          </section>

        </div>
      </div>
    </div>
  )
}

export default Profile
