import React, { useContext, useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { AuthContext } from '../../context/authContext';
import { Lock, Mail, User } from 'lucide-react'
import { Link } from 'react-router-dom';


const INITIAL_FORM = { name: "", email: "", password: "" }
const Signup = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const { register, loading, error } = useContext(AuthContext);

  const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
  ]
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await register(formData.name, formData.email, formData.password);
    if (user) {
      setFormData(INITIAL_FORM); // reset form 
    }
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className='max-w-lg w-full bg-white shadow-lg border border-purple-100 rounded-xl mx-2 p-8'>
      <div className='flex items-center flex-col justify-center gap-3'>
        <div className='w-16 h-16 rounded-full text-3xl text-white font-bold flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500'>
          <FiUserPlus />
        </div>
        <div className='flex flex-col items-center justify-center gap-0.5'>
          <h3 className='text-xl sm:text-3xl font-bold text-gray-800'>Create Account</h3>
          <p className='text-base sm:text-lg text-gray-500 text-center font-medium'>
            Join
            <span className='text-orange-400'> iiTask </span>
            to manage your tasks
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4 mt-8'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <>
            <div key={name}
              className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500'>
              <Icon className='w-5 h-5 mr-2 text-orange-500' />
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
                className='w-full outline-none text-gray-700' />
            </div>
          </>
        ))}
       {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded-lg w-full text-base mt-1 text-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 cursor-pointer text-lg text-white font-medium py-2.5 rounded-lg transition">
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="text-center text-sm sm:text-base">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login
          </Link>
        </div>
      </form >

    </div >
  )
}

export default Signup
