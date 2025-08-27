import React, { useContext, useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { AuthContext } from '../../context/authContext';
import { Lock, Mail, User } from 'lucide-react'


const INITIAL_FORM = { name: "", email: "", password: "" }
const Signup = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const { register, loading } = useContext(AuthContext);

  const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
  ]
  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData.name, formData.email, formData.password);
    setFormData(INITIAL_FORM); // reset form 
  }
  const handleChange = (e)=>{
    setFormData( {...formData , [e.target.name]:e.target.value});
  }

  return (
    <div className='max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl mx-2 p-8'>
      <div className='flex items-center gap-3'>
        <div className='w-16 h-16 rounded-full text-3xl text-white font-bold flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500'>
          <FiUserPlus />
        </div>
        <h3 className='text-xl sm:text-3xl font-bold text-gray-800'>Create Account</h3>
      </div>
      

      <form onSubmit={handleSubmit} className='space-y-4 mt-8'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
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
        ))}
           <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition">
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

    </div>
  )
}

export default Signup
