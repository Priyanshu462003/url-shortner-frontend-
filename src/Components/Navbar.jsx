import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Link2 } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="px-6 py-4 flex justify-between items-center max-w-5xl mx-auto w-full">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
          <Link2 size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm text-gray-900">snipify</span>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-3">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-black text-sm"
            >
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-500 hover:text-black text-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:opacity-80 transition"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar