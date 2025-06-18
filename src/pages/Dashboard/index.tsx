import React, { useState, useEffect } from "react";
import {
  Car,
  Users,
  Key,
  TrendingUp,
  Activity,
  ArrowUp,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoaded, setIsLoaded] = useState(false);

  // State for cars
  const [carCount, setCarCount] = useState<number | null>(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState<string | null>(null);

  // State for active reservations
  const [activeReservations, setActiveReservations] = useState<number | null>(null);
  const [reservationLoading, setReservationLoading] = useState(true);
  const [reservationError, setReservationError] = useState<string | null>(null);

  // State for new clients
  const [newClients, setNewClients] = useState<number | null>(null);
  const [newClientsLoading, setNewClientsLoading] = useState(true);
  const [newClientsError, setNewClientsError] = useState<string | null>(null);

  // State for total income
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [incomeLoading, setIncomeLoading] = useState(true);
  const [incomeError, setIncomeError] = useState<string | null>(null);

  // State for last bookings
  const [lastBookings, setLastBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Fetch car count on component mount
  useEffect(() => {
    const fetchCarCount = async () => {
      try {
        setCarLoading(true);
        const response = await fetch("/api/cars?count=true");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCarCount(data.count);
        setCarError(null);
      } catch (err) {
        console.error("Failed to fetch car count:", err);
        setCarError("Failed to load car data");
      } finally {
        setCarLoading(false);
        setIsLoaded(true);
      }
    };

    fetchCarCount();
  }, []);

  // Fetch active reservations count
  useEffect(() => {
    const fetchActiveReservations = async () => {
      try {
        setReservationLoading(true);
        const response = await fetch("/api/bookings?count=true&status=active");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setActiveReservations(data.count);
        setReservationError(null);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setReservationError("Failed to load reservation data");
      } finally {
        setReservationLoading(false);
      }
    };

    fetchActiveReservations();
  }, []);

  // Fetch new clients count
  useEffect(() => {
    const fetchNewClients = async () => {
      try {
        setNewClientsLoading(true);
        const response = await fetch("/api/users?count=true&role=user");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNewClients(data.count);
        setNewClientsError(null);
      } catch (err) {
        console.error("Failed to fetch new clients:", err);
        setNewClientsError("Failed to load client data");
      } finally {
        setNewClientsLoading(false);
      }
    };

    fetchNewClients();
  }, []);

  // Fetch total income from bookings
  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        setIncomeLoading(true);
        const response = await fetch("/api/bookings?totalIncome=true");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTotalIncome(data.totalIncome);
        setIncomeError(null);
      } catch (err) {
        console.error("Failed to fetch total income:", err);
        setIncomeError("Failed to load income data");
      } finally {
        setIncomeLoading(false);
      }
    };

    fetchTotalIncome();
  }, []);

  // Fetch last 4 bookings
  useEffect(() => {
    const fetchLastBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await fetch("/api/bookings?lastBookings=true");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLastBookings(data);
        setBookingsError(null);
      } catch (err) {
        console.error("Failed to fetch last bookings:", err);
        setBookingsError("Failed to load booking data");
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchLastBookings();
  }, []);

  // Format currency function
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "€0";
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const stats = [
    {
      name: "Makinat Totale",
      value: carLoading ? "..." : carError ? "Error" : carCount?.toString() || "0",
      change: "+12%",
      icon: Car,
      gradient: "from-blue-600 to-cyan-500",
      bgGradient: "from-blue-50/90 to-cyan-50/90",
      description: "Flota jonë e kompletë",
      loading: carLoading,
      error: carError,
    },
    {
      name: "Reserve Aktive",
      value: reservationLoading ? "..." : reservationError ? "Error" : activeReservations?.toString() || "0",
      change: "+8%",
      icon: Key,
      gradient: "from-green-600 to-teal-500",
      bgGradient: "from-emerald-50/90 to-teal-50/90",
      description: "Në përdorim aktualisht",
      loading: reservationLoading,
      error: reservationError,
    },
    {
      name: "Klientë të Rinj",
      value: newClientsLoading ? "..." : newClientsError ? "Error" : newClients?.toString() || "0",
      change: "+15%",
      icon: Users,
      gradient: "from-purple-600 to-fuchsia-500",
      bgGradient: "from-purple-50/90 to-fuchsia-50/90",
      description: "Këtë muaj",
      loading: newClientsLoading,
      error: newClientsError,
    },
    {
      name: "Të Ardhura",
      value: incomeLoading ? "..." : incomeError ? "Error" : formatCurrency(totalIncome),
      change: "+23%",
      icon: TrendingUp,
      gradient: "from-orange-600 to-amber-500",
      bgGradient: "from-orange-50/90 to-amber-50/90",
      description: "Totali i të ardhurave",
      loading: incomeLoading,
      error: incomeError,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/95 via-indigo-50/95 to-purple-50/95 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-purple-300/40 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-200/40 to-orange-300/40 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-blue-300/30 rounded-full opacity-20 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
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
                    animation: isLoaded
                      ? "fadeInUp 0.8s ease-out forwards"
                      : "",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 text-lg font-bold">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">
                      {stat.value}
                      {stat.loading && !stat.error && (
                        <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                      )}
                    </h3>
                    <p className="text-gray-600 font-semibold text-lg mb-1">
                      {stat.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {stat.error ? (
                        <span className="text-red-500">{stat.error}</span>
                      ) : (
                        stat.description
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent bookings container */}
          <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            <div className="p-8 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Rezervimet e Fundit
                  </h2>
                  <p className="text-blue-600">
                    4 rezervimet më të reja nga klientët
                  </p>
                </div>
                <Activity className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <div className="p-8">
              {bookingsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-600">Duke ngarkuar rezervimet...</p>
                </div>
              ) : bookingsError ? (
                <div className="text-center py-12">
                  <p className="text-red-500 text-lg">{bookingsError}</p>
                </div>
              ) : lastBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Nuk ka rezervime të reja
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {lastBookings.map((booking, index) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-6 hover:bg-white/10 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 bg-white/50 backdrop-blur-sm"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isLoaded
                          ? "slideInRight 0.6s ease-out forwards"
                          : "",
                      }}
                    >
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {getInitials(booking.userId || "U")}
                            </span>
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${booking.status === "active"
                              ? "bg-green-400"
                              : booking.status === "completed"
                                ? "bg-blue-400"
                                : "bg-yellow-400"
                              }`}
                          ></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {booking.pickupLocation?.city || 'Vendi i nisjes'} → {booking.dropoffLocation?.city || 'Vendi i mbërritjes'}
                          </h3>
                          <p className="text-blue-600 mb-1">
                            {formatDate(booking.pickUpDate)} - {formatDate(booking.dropOffDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-xl mb-2">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg ${booking.status === "active"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : booking.status === "completed"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                            }`}
                        >
                          {booking.status === "active"
                            ? "✨ Aktive"
                            : booking.status === "completed"
                              ? "✅ Përfunduar"
                              : "⏳ Në pritje"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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