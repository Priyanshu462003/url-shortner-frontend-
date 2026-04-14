import { Mail, Bug } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-[#1f2937]">

      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

        {/* Left */}
        <p className="text-xs text-gray-500">
          Made with <span className="text-red-400">♥</span> by Priyanshu Kashyap · v1.0
        </p>

        {/* Right */}
        <div className="flex items-center gap-6">

          <a
            href="https://instagram.com/wtf.priyanshu001"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            Instagram
          </a>

          <a
            href="https://linkedin.com/in/priyanshukashyap9897"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            LinkedIn
          </a>

          <a
            href="mailto:priyanshukashyap9897@gmail.com"
            className="hover:text-white transition flex items-center gap-1"
          >
            <Mail size={14} />
            <span className="hidden sm:inline">Email</span>
          </a>

          <a
            href="mailto:priyanshukashyap9897@gmail.com?subject=Bug%20Report&body=Describe%20the%20issue..."
            className="hover:text-white transition flex items-center gap-1"
          >
            <Bug size={14} />
            <span className="hidden sm:inline">Report bug</span>
          </a>

        </div>

      </div>
    </footer>
  )
}

export default Footer