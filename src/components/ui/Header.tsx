// components/Header.tsx
import React from 'react';
import { Share2, Copy } from 'lucide-react';
import { DepartmentInfo } from '@/types';

interface HeaderProps {
  departmentInfo: DepartmentInfo;
  copyToClipboard: (text: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ departmentInfo, copyToClipboard }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg text-center justify-center font-bold text-[24px]">R</div>
            <h1 className="text-xl font-semibold text-slate-800">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-lg px-3 py-1">
              <Share2 className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600 truncate max-w-xs">
                {departmentInfo.shareableLink}
              </span>
              <button
                onClick={() => copyToClipboard(departmentInfo.shareableLink)}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                <Copy className="h-3 w-3 text-slate-500" />
              </button>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};