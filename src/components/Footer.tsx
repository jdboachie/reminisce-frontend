import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-reminisce-brand text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-inter font-semibold mb-4">Reminisce</h3>
            <p className="text-white text-sm font-inter font-medium">
              Capturing and preserving memories through beautiful photography and event management.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-inter font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-white font-inter font-medium">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@reminisce.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Memory Lane, City, State</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-inter font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm font-inter font-medium">
              <a href="/home" className="block text-white hover:text-reminisce-purple transition-colors duration-200">
                Home
              </a>
              <a href="/photos" className="block text-white hover:text-reminisce-purple transition-colors duration-200">
                Gallery
              </a>
              <a href="/events" className="block text-white hover:text-reminisce-purple transition-colors duration-200">
                Events
              </a>
              <a href="/admin" className="block text-white hover:text-reminisce-purple transition-colors duration-200">
                Admin
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white font-inter font-medium">
            © 2025 Reminisce. All rights reserved.
          </p>
          <p className="text-sm text-white font-inter font-medium flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-red-300" /> for our school community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 