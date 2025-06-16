import React from 'react';
import {
  Car, Users, Calendar, DollarSign, Settings, MapPin, ChevronRight, Sparkles, Award, Crown, X, BarChart3
} from 'lucide-react';
import { useRouter } from 'next/router';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isLoaded }) => {
  const router = useRouter();

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, gradient: 'from-indigo-600 to-blue-500', path: '/dashboard' },
    { id: 'cars', name: 'Makinat', icon: Car, gradient: 'from-purple-600 to-fuchsia-500', path: '/dashboard/cars' },
    { id: 'bookings', name: 'Rezervimet', icon: Calendar, gradient: 'from-emerald-600 to-teal-500', path: '/dashboard/bookings' },
    { id: 'customers', name: 'Klientët', icon: Users, gradient: 'from-rose-600 to-pink-500', path: '/dashboard/client' },
    { id: 'locations', name: 'Lokacionet', icon: MapPin, gradient: 'from-violet-600 to-purple-500', path: '/lokacionet' },
    { id: 'contactus', name: 'ContactUs', icon: Settings, gradient: 'from-slate-600 to-gray-500', path: '/dashboard/contactus' },
  ];

  const handleItemClick = (item) => {
    setActiveTab(item.id);
    router.push(item.path); 
    setSidebarOpen(false);  
  };

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-2xl transform transition-all duration-500 ease-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">RentCar</h2>
              <p className="text-xs text-blue-600 font-medium">Premium Experience</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-8 px-6">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl mb-3 transition-all duration-300 transform hover:scale-105 ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isLoaded ? 'slideInLeft 0.6s ease-out forwards' : ''
                }}
              >
                <Icon className="w-6 h-6" />
                <span className="font-semibold">{item.name}</span>
                {activeTab === item.id && (
                  <div className="ml-auto flex items-center">
                    <ChevronRight className="w-5 h-5" />
                    <Sparkles className="w-4 h-4 ml-1" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Promo */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 text-white shadow-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <Award className="w-6 h-6" />
              <span className="font-bold text-lg">Premium Pro</span>
            </div>
            <p className="text-sm mb-4">Unlock advanced analytics & unlimited cars</p>
            <button className="w-full bg-white/20 hover:bg-white/30 rounded-xl py-3 text-sm font-bold border border-white/30">
              Upgrade Now ✨
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
