import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-reminisce-purple-800 to-reminisce-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-sm">R</span>
              </div>
              <h3 className="text-lg font-poppins font-semibold">Reminisce</h3>
            </div>
            <p className="text-white/80 text-sm font-poppins leading-relaxed">
              Capturing and preserving memories through beautiful photography and event management. 
              Every moment matters, every memory counts.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-poppins font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-white/80 font-poppins">
              <div className="flex items-center group">
                <Mail className="h-4 w-4 mr-3 text-reminisce-purple-200 group-hover:text-white transition-colors duration-300" />
                <span>info@reminisce.com</span>
              </div>
              <div className="flex items-center group">
                <Phone className="h-4 w-4 mr-3 text-reminisce-purple-200 group-hover:text-white transition-colors duration-300" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center group">
                <MapPin className="h-4 w-4 mr-3 text-reminisce-purple-200 group-hover:text-white transition-colors duration-300" />
                <span>123 Memory Lane, City, State</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-poppins font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm font-poppins">
              <Link href="/" className="block text-white/80 hover:text-white transition-colors duration-300">
                Home
              </Link>
              <Link href="/photos" className="block text-white/80 hover:text-white transition-colors duration-300">
                Albums
              </Link>
              <Link href="/events" className="block text-white/80 hover:text-white transition-colors duration-300">
                Events
              </Link>
              <Link href="/profiles" className="block text-white/80 hover:text-white transition-colors duration-300">
                Class
              </Link>
              <Link href="/department" className="block text-white/80 hover:text-white transition-colors duration-300">
                Department
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/60 font-poppins">
            © 2025 Reminisce. All rights reserved.
          </p>
          <p className="text-sm text-white/60 font-poppins flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-red-300 animate-pulse" /> for our school community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 