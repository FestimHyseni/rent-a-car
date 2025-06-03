import React, { useState, useEffect } from 'react';

import { 
  Car, 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  BarChart3,
  MapPin,
  Key,
  Star,
  TrendingUp,
  ChevronRight,
  Zap,
  Award,
  Activity,
  Crown,
  Sparkles,
  ArrowUp
} from 'lucide-react';
import Sidebar from "../../components/Sidebar/Sidebar"; 
import Navbar from "../../components/Navbar/Navbar"; 

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);



  const stats = [
    { 
      name: 'Makinat Totale', 
      value: '145', 
      change: '+12%', 
      icon: Car, 
      gradient: 'from-blue-600 to-cyan-500',
      bgGradient: 'from-blue-50/90 to-cyan-50/90',
      description: 'Flota jonë e kompletë'
    },
    { 
      name: 'Reserve Aktive', 
      value: '89', 
      change: '+8%', 
      icon: Key, 
      gradient: 'from-green-600 to-teal-500',
      bgGradient: 'from-emerald-50/90 to-teal-50/90',
      description: 'Në përdorim aktualisht'
    },
    { 
      name: 'Klientë të Rinj', 
      value: '24', 
      change: '+15%', 
      icon: Users, 
      gradient: 'from-purple-600 to-fuchsia-500',
      bgGradient: 'from-purple-50/90 to-fuchsia-50/90',
      description: 'Këtë muaj'
    },
    { 
      name: 'Të Ardhura', 
      value: '€12,450', 
      change: '+23%', 
      icon: TrendingUp, 
      gradient: 'from-orange-600 to-amber-500',
      bgGradient: 'from-orange-50/90 to-amber-50/90',
      description: 'Muaji i kaluar'
    },
  ];

  const recentBookings = [
    { id: 1, customer: 'Shaban Buja', car: 'BMW X5 2024', date: '2025-05-30', status: 'active', amount: '€120', avatar: 'A', rating: 5 },
    { id: 2, customer: 'Dior Hyseni', car: 'Mercedes C-Class', date: '2025-05-29', status: 'completed', amount: '€95', avatar: 'E', rating: 4.8 },
    { id: 3, customer: 'Arion Rexhepki', car: 'Audi A4 Sport', date: '2025-05-28', status: 'pending', amount: '€85', avatar: 'D', rating: 4.9 },
    { id: 4, customer: 'Festim Hyseni', car: 'Tesla Model 3', date: '2025-05-27', status: 'active', amount: '€150', avatar: 'L', rating: 5 },
  ];

  const popularCars = [
    { name: 'BMW X5 2024', bookings: 45, rating: 4.9, image: '🏎️', revenue: '€5,400', trend: '+15%' },
    { name: 'Mercedes C-Class', bookings: 38, rating: 4.8, image: '🚘', revenue: '€3,610', trend: '+12%' },
    { name: 'Audi A4 Sport', bookings: 32, rating: 4.7, image: '🚗', revenue: '€2,720', trend: '+8%' },
    { name: 'Tesla Model 3', bookings: 28, rating: 4.9, image: '⚡', revenue: '€4,200', trend: '+25%' },
  ];

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50/95 via-indigo-50/95 to-purple-50/95 relative overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-purple-300/40 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-200/40 to-orange-300/40 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-blue-300/30 rounded-full opacity-20 animate-spin" style={{ animationDuration: '20s' }}></div>
    </div>

    {/* Sidebar */}
    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      isLoaded={isLoaded}
    />

    {/* Main content */}
    <div className="lg:ml-72">
      {/* Navbar */}
      <Navbar setSidebarOpen={setSidebarOpen} />

      {/* Dashboard Content */}
      <div className="p-8">
        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-white/20 relative overflow-hidden group`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: isLoaded ? 'fadeInUp 0.8s ease-out forwards' : ''
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-lg font-bold">{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-semibold text-lg mb-1">{stat.name}</p>
                  <p className="text-gray-500 text-sm">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Main dashboard content */}
        

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent bookings */}
            <div className="xl:col-span-2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
              <div className="p-8 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Rezervimet e Fundit</h2>
                    <p className="text-blue-600">Live updates from your customers</p>
                  </div>
                  <Activity className="w-8 h-8 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {recentBookings.map((booking, index) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center justify-between p-6 hover:bg-white/10 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 bg-white/50 backdrop-blur-sm"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isLoaded ? 'slideInRight 0.6s ease-out forwards' : ''
                      }}
                    >
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">{booking.avatar}</span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                            booking.status === 'active' ? 'bg-green-400' : 
                            booking.status === 'completed' ? 'bg-blue-400' : 'bg-yellow-400'
                          }`}></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{booking.customer}</h3>
                          <p className="text-blue-600 mb-1">{booking.car}</p>
                          <div className="flex items-center space-x-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < booking.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-xl mb-2">{booking.amount}</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                          booking.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                          booking.status === 'completed' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                          'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        }`}>
                          {booking.status === 'active' ? '✨ Aktive' : 
                           booking.status === 'completed' ? '✅ Përfunduar' : '⏳ Në pritje'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular cars */}
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
              <div className="p-8 border-b border-white/20">
                <div className="flex items-center space-x-3 mb-2">
                  <Crown className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Top Performers</h2>
                </div>
                <p className="text-orange-600">Most popular rental cars</p>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {popularCars.map((car, index) => (
                    <div 
                      key={index} 
                      className="p-6 hover:bg-white/50 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 bg-white/30 backdrop-blur-sm"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isLoaded ? 'fadeIn 0.8s ease-out forwards' : ''
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{car.image}</span>
                          <div>
                            <h3 className="font-bold text-gray-800">{car.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-orange-600 text-sm font-semibold">{car.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-lg">{car.bookings}</p>
                          <p className="text-orange-600 text-sm">bookings</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-bold">{car.revenue}</span>
                        <span className="text-green-600 text-sm font-semibold">{car.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;