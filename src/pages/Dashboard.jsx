import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Copy,
  ExternalLink,
  BarChart2,
  QrCode,
  Share2,
  Download,
  MousePointerClick,
  Link2,
  TrendingUp
} from 'lucide-react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import API_URL from '../api/Config'

const Dashboard = () => {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrUrl, setQrUrl] = useState(null)

  const token = localStorage.getItem('token')

  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/urls/myurls`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUrls(res.data)
    } catch {
      toast.error('Failed to load URLs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  fetchUrls()

  const token = localStorage.getItem('token')
  const es = new EventSource(`${API_URL}/sse/connect?token=${token}`)

  es.onmessage = (event) => {
    const data = JSON.parse(event.data)

    setUrls((prev) =>
      prev.map((u) =>
        u.shortUrl === data.shortUrl
          ? { ...u, clickCount: data.clickCount }
          : u
      )
    )
  }

  return () => {
    es.close()
  }
}, [])

  const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0)
  const totalLinks = urls.length
  const mostClicked = urls.length
    ? urls.reduce(
        (max, u) =>
          (u.clickCount || 0) > (max.clickCount || 0) ? u : max,
        urls[0]
      )
    : null

  const copy = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('Copied')
  }

  const share = async (url) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Short Link', url })
      } else {
        copy(url)
      }
    } catch {
      toast.error('Share failed')
    }
  }

  const generateQR = (url) => {
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      url
    )}`
    setQrUrl(qr)
  }

  const downloadQR = async () => {
    if (!qrUrl) return
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `qr-code.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success('QR downloaded')
    } catch {
      toast.error('Download failed')
    }
  }

  const shareQR = async () => {
    if (!qrUrl) return
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const file = new File([blob], 'qr.jpg', { type: 'image/jpeg' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'QR Code', files: [file] })
      } else {
        copy(qrUrl)
      }
    } catch {
      toast.error('Share failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track your shortened links
          </p>
        </div>

        {!loading && urls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <MousePointerClick size={13} /> Total Clicks
              </div>
              <p className="text-2xl font-semibold">{totalClicks}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Link2 size={13} /> Total Links
              </div>
              <p className="text-2xl font-semibold">{totalLinks}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <TrendingUp size={13} /> Most Clicked
              </div>
              <p className="text-2xl font-semibold">
                {mostClicked?.clickCount || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1 truncate font-mono">
                {mostClicked?.shortUrl || '—'}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-white border border-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-2">No links created yet</p>
            <button
              onClick={() => (window.location.href = '/')}
              className="text-black underline text-sm"
            >
              create one
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 px-6 py-3 text-xs text-gray-500 border-b border-gray-200">
                <div className="col-span-5">Original URL</div>
                <div className="col-span-3">Short</div>
                <div className="col-span-2">Clicks</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {urls.map((u) => {
                const short = `${API_URL}/${u.shortUrl}`
                const clicks = Number(u.clickCount) || 0

                return (
                  <div
                    key={u.id}
                    className="grid grid-cols-12 px-6 py-4 items-center border-b border-gray-200 hover:bg-gray-50 transition last:border-b-0"
                  >
                    <div className="col-span-5 truncate text-sm text-gray-700">
                      {u.originalUrl}
                    </div>

                    {/* ✅ FIXED HERE */}
                    <div className="col-span-3 text-sm flex items-center gap-2">
                      <a
                        href={short}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline font-mono"
                      >
                        {u.shortUrl}
                      </a>

                      <button
                        onClick={() => copy(short)}
                        className="text-gray-400 hover:text-black"
                      >
                        <Copy size={14} />
                      </button>
                    </div>

                    <div className="col-span-2 text-sm">
                      {clicks > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          <MousePointerClick size={11} />
                          {clicks}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>

                    <div className="col-span-2 flex justify-end gap-3">
                      <a
                        href={`/analytics/${u.shortUrl}`}
                        className="text-gray-400 hover:text-black"
                      >
                        <BarChart2 size={16} />
                      </a>
                      <a
                        href={short}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-black"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => share(short)}
                        className="text-gray-400 hover:text-black"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        onClick={() => generateQR(short)}
                        className="text-gray-400 hover:text-black"
                      >
                        <QrCode size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => (window.location.href = '/')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-black rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
              >
                + Create new link
              </button>
            </div>
          </>
        )}

        {qrUrl && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <img src={qrUrl} alt="QR Code" className="mx-auto mb-4" />

              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 text-sm px-3 py-1 border rounded"
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={shareQR}
                  className="flex items-center gap-2 text-sm px-3 py-1 border rounded"
                >
                  <Share2 size={14} /> Share
                </button>
              </div>

              <button
                onClick={() => setQrUrl(null)}
                className="text-sm text-black underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard