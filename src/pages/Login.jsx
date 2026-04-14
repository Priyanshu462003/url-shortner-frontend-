
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import API_URL from '../api/Config'
import Footer from '../Components/Footer'
import { Link2 } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Fill in both fields')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/authenticate`, { email, password })
      localStorage.setItem('token', res.data.token)
      toast.success('Welcome back')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid credentials')
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
            Welcome back
          </h1>

          <p className="text-gray-500 text-sm mb-8">
            Sign in to continue managing your links
          </p>

          {/* Form */}
          <div className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-500">
                  Password
                </label>

                <span className="text-xs text-gray-400 cursor-not-allowed">
                  Forgot?
                </span>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </div>

          {/* Footer text */}
          <p className="text-gray-500 text-sm mt-6">
            Don’t have an account?{' '}
            <Link to="/register" className="text-black hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Login

