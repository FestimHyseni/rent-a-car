import React from 'react';
import { Menu, Search, Bell, Zap } from 'lucide-react';

const Navbar = ({ setSidebarOpen }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-8 py-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-3 hover:bg-gray-100 rounded-xl"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Welcome back, Admin! Everything looks amazing today.</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-12 pr-6 py-3 bg-white/90 border border-gray-200 rounded-2xl w-80"
            />
          </div>
          <button className="relative p-3 hover:bg-gray-100 rounded-2xl group">
            <Bell className="w-6 h-6 text-gray-600 group-hover:animate-bounce" />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">3</span>
          </button>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
