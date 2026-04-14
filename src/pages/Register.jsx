import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import API_URL from '../api/Config'
import Footer from '../Components/Footer'
import { Link2 } from 'lucide-react'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!username || !email || !password) {
      toast.error('All fields are required')
      return
    }
    if (!email.includes('@')) {
      toast.error('Enter a valid email')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/users/register`, {
        username,
        email,
        password
      })
      toast.success('Account created!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col text-gray-900">

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <Link2 size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm">snipify</span>
          </Link>

          {/* Heading */}
          <h1 className="text-2xl font-semibold mb-1">
            Create your account
          </h1>

          <p className="text-gray-500 text-sm mb-8">
            Free forever. No credit card needed.
          </p>

          {/* Form */}
          <div className="flex flex-col gap-5">

            {/* Username */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="priyanshu"
                className="w-full bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                placeholder="at least 6 characters"
                className="w-full bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </div>

          {/* Footer text */}
          <p className="text-gray-500 text-xs mt-5 leading-relaxed">
            By signing up you agree to our terms. We don't sell your data or spam you.
          </p>

          <p className="text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-black hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Register