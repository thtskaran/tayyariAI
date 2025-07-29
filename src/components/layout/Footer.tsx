import Link from 'next/link';
import { PiTwitterLogoBold,PiGithubLogoBold,PiLinkedinLogoBold } from "react-icons/pi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-lg transform rotate-45 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm transform -rotate-45 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
              <span className="text-xl font-bold">Tayyari AI</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Create professional resumes with AI assistance. Get hired faster with our 
              intelligent resume builder and optimization tools.
            </p>
            <div className="flex space-x-4">
              <PiTwitterLogoBold className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <PiGithubLogoBold className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <PiLinkedinLogoBold className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Templates</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI Resume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}