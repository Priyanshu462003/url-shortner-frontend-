import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import API_URL from '../api/Config'

const Analytics = () => {
  const { shortUrl } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const today = new Date().toISOString().split('T')[0]

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/urls/analytics/${shortUrl}`, {
        params: {
          startDate: `${startDate}T00:00:00`,
          endDate: `${endDate}T23:59:59`
        },
        headers: { Authorization: `Bearer ${token}` }
      })

      // ✅ backend already returns aggregated data
      setData(
        res.data.map(i => ({
          date: i.clickDate,
          clicks: i.count
        }))
      )

    } catch {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const totalClicks = data.reduce((a, d) => a + d.clicks, 0)

  const peakDay = data.length
    ? data.reduce((m, d) => d.clicks > m.clicks ? d : m, data[0])
    : null

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-black transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="text-gray-500 text-sm font-mono">/{shortUrl}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Total clicks</p>
            <p className="text-2xl font-semibold">{totalClicks}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Active days</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Peak</p>
            <p className="text-2xl font-semibold">
              {peakDay ? peakDay.clicks : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {peakDay ? peakDay.date : ''}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Apply'}
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm font-medium mb-6">
            Clicks over time
          </p>

          {loading ? (
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ) : data.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data} barSize={28}>
                <CartesianGrid stroke="#e5e7eb" vertical={false} />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />

                <Tooltip />

                <Bar
                  dataKey="clicks"
                  fill="#111827"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default Analytics