import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Copy, BarChart2, QrCode, Shield, Zap } from 'lucide-react'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import API_URL from '../api/Config'

const Home = () => {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleShorten = async () => {
    if (!url.startsWith('http')) {
      toast.error('Enter a valid URL')
      return
    }

    if (!token) {
      toast.error('Login required')
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(
        `${API_URL}/api/urls/shorten`,
        { originalUrl: url },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setShortUrl(`${API_URL}/${res.data.shortUrl}`)
      toast.success('Short link created')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(shortUrl)
    toast.success('Copied')
  }

  const features = [
    { icon: <Zap size={18} />, title: 'Fast', desc: 'Shorten links instantly with zero friction.' },
    { icon: <BarChart2 size={18} />, title: 'Analytics', desc: 'Track clicks and performance in real-time.' },
    { icon: <QrCode size={18} />, title: 'QR Codes', desc: 'Generate QR codes automatically.' },
    { icon: <Shield size={18} />, title: 'Secure', desc: 'Protected with modern authentication.' },
  ]

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex flex-col">

      <Navbar />

      {/* HERO */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-24 text-center">

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5 leading-tight">
          Shorten links <br /> without the noise
        </h1>

        <p className="text-gray-500 max-w-md mb-10 text-base">
          Clean URLs. Real-time analytics. QR codes — all in one minimal tool.
        </p>

        {/* INPUT */}
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-2 flex items-center gap-2 mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL..."
            className="flex-1 px-3 py-2 text-sm outline-none"
          />

          <button
            onClick={handleShorten}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition"
          >
            {loading ? '...' : 'Shorten'}
          </button>
        </div>

        {/* RESULT */}
        {shortUrl && (
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-center">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm text-black truncate">
              {shortUrl}
            </a>
            <button onClick={copy}>
              <Copy size={16} />
            </button>
          </div>
        )}

      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto px-6 pb-24 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="mb-3 text-gray-600">{f.icon}</div>
              <p className="font-medium text-sm mb-1">{f.title}</p>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home