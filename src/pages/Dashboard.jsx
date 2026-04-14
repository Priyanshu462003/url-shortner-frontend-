import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Copy,
  ExternalLink,
  BarChart2,
  QrCode,
  Share2,
  Download
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
  }, [])

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
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
    setQrUrl(qr)
  }

  // ✅ Download QR as JPG
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

  // ✅ Share QR image or fallback link
  const shareQR = async () => {
    if (!qrUrl) return

    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const file = new File([blob], 'qr.jpg', { type: 'image/jpeg' })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'QR Code',
          files: [file]
        })
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

        <div className="mb-10">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track your shortened links
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white border border-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-2">No links created yet</p>
            <button
              onClick={() => window.location.href = '/'}
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

                return (
                  <div
                    key={u.id}
                    className="grid grid-cols-12 px-6 py-4 items-center border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <div className="col-span-5 truncate text-sm text-gray-700">
                      {u.originalUrl}
                    </div>

                    <div className="col-span-3 text-sm flex items-center gap-2">
                      <a
                        href={short}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {u.shortUrl}
                      </a>
                      <button onClick={() => copy(short)} className="text-gray-400 hover:text-black">
                        <Copy size={14} />
                      </button>
                    </div>

                    <div className="col-span-2 text-sm text-gray-500">
                      {u.clickCount ?? 0}
                    </div>

                    <div className="col-span-2 flex justify-end gap-3">

                      <a href={`/analytics/${u.shortUrl}`} className="text-gray-400 hover:text-black">
                        <BarChart2 size={16} />
                      </a>

                      <a href={short} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black">
                        <ExternalLink size={16} />
                      </a>

                      <button onClick={() => share(short)} className="text-gray-400 hover:text-black">
                        <Share2 size={16} />
                      </button>

                      <button onClick={() => generateQR(short)} className="text-gray-400 hover:text-black">
                        <QrCode size={16} />
                      </button>

                    </div>
                  </div>
                )
              })}
            </div>
{/* Create new CTA */}
<div className="mt-6 text-center">
  <button
    onClick={() => window.location.href = '/'}
    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white 
               bg-black rounded-xl shadow-md 
               hover:bg-gray-800 hover:shadow-lg 
               active:scale-[0.98] transition-all duration-200"
  >
    + Create new link
  </button>
</div>
</>
        )}

        {/* QR Modal */}
        {qrUrl && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
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