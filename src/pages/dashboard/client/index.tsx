import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  CheckSquare,
  ChevronDown,
  X,
  Crown,
  TrendingUp,
  Star,
  Download,
  UserCheck,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import useFetch from "@/hooks/useFetch";
import { IUser } from "@/models/User";
import AddClient from "../create/client";
import UpdateClient from "../update/client";
import DetailsClient from "../details/client";
import { exportClientsToCSV } from "../utils/client/exportClient";

const ClientManagement = () => {
  const { data: users, loading, error } = useFetch<IUser[]>("/api/users");
  const { postData } = useFetch("/api/users");
  const { deleteData } = useFetch("/api/users");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [clientToUpdate, setClientToUpdate] = useState<IUser | null>(null);
  const [selectedClient, setSelectedClient] = useState<IUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 6;

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
  });

  // Sidebar state
  const [activeTab, setActiveTab] = useState("clients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  // Sample data
  // const [clients, setClients] = useState([
  //   {
  //     id: 1,
  //     name: "Arjan Berisha",
  //     email: "arjan.berisha@email.com",
  //     phone: "+355 69 123 4567",
  //     location: "Tiranë",
  //     joinDate: "2024-01-15",
  //     totalBookings: 12,
  //     totalSpent: 2400,
  //     rating: 4.8,
  //     status: "active",
  //     lastBooking: "2024-05-20",
  //     avatar: "AB",
  //   },
  //   {
  //     id: 2,
  //     name: "Elona Kastrati",
  //     email: "elona.kastrati@email.com",
  //     phone: "+355 68 987 6543",
  //     location: "Durrës",
  //     joinDate: "2024-02-10",
  //     totalBookings: 8,
  //     totalSpent: 1800,
  //     rating: 4.9,
  //     status: "premium",
  //     lastBooking: "2024-05-18",
  //     avatar: "EK",
  //   },
  //   {
  //     id: 3,
  //     name: "Fatmir Hoxha",
  //     email: "fatmir.hoxha@email.com",
  //     phone: "+355 67 555 1234",
  //     location: "Vlorë",
  //     joinDate: "2024-03-05",
  //     totalBookings: 3,
  //     totalSpent: 650,
  //     rating: 4.5,
  //     status: "active",
  //     lastBooking: "2024-04-12",
  //     avatar: "FH",
  //   },
  //   {
  //     id: 4,
  //     name: "Gentiana Leka",
  //     email: "gentiana.leka@email.com",
  //     phone: "+355 69 777 8888",
  //     location: "Shkodër",
  //     joinDate: "2023-11-20",
  //     totalBookings: 25,
  //     totalSpent: 4200,
  //     rating: 5.0,
  //     status: "vip",
  //     lastBooking: "2024-05-22",
  //     avatar: "GL",
  //   },
  // ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vip":
        return Crown;
      case "premium":
        return Award;
      case "active":
        return UserCheck;
      default:
        return Users;
    }
  };

  const filteredClients = (users || []).filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesFilter = filterStatus === "all";
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSaveClient = async (client: any) => {
    try {
      const response = await postData(client);
      setShowAddModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to save client", error);
    }
  };

  const stats = [
    {
      title: "Total Klientë",
      value: (users || []).length,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      title: "Adminstrator & Staff",
  value: (users || []).filter(
      (u) => String(u.role) === "staff" || String(u.role) === "admin"
    ).length,      icon: Crown,
      gradient: "from-yellow-500 to-orange-500",
      change: "+25%",
    },
    
  ];

  const deleteClient = async (id: string) => {
    try {
      await deleteData(id);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

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

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
        }`}
      >
        <div className="w-[70rem] ml-[19rem] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 mx-auto mt-[2rem]">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
              <div className="w-10 h-10  sm:w-12 sm:h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Menaxhimi i Klientëve
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Menaxho dhe monitoroni të gjithë klientët tuaj
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-white/50 hover:shadow-md sm:hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r ${stat.gradient} rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-xs sm:text-sm font-bold bg-green-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-white/50 mb-6 sm:mb-8 mt-6 sm:mt-8">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col xs:flex-row space-y-4 xs:space-y-0 xs:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Kërko klientë..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-white/80 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={() => exportClientsToCSV(users || [])}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl transition-all duration-300 text-gray-700 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Eksporto</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-[1.03] text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Shto Klient</span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentClients.map((client) => {
              const initials = client.name
                ? client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "US";
              const StatusIcon = getStatusIcon(String(client.role));
              let roleLabel;
              let statusColor;
              if (String(client.role) === "admin") {
                roleLabel = "Administrator";
                statusColor = "from-amber-500 to-orange-500";
              } else if (String(client.role) === "staff") {
                roleLabel = "Staff";
                statusColor = "from-sky-500 to-cyan-500";
              } else {
                roleLabel = "Përdorues";
                statusColor = "from-blue-500 to-indigo-500";
              }

              return (
                <div
                  key={String(client._id ?? client.email ?? client.name)}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] min-h-[250px]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 line-clamp-1">
                          {client.name}
                        </h3>
                        <div
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r ${statusColor} text-white text-xs font-bold`}
                        >
                          <StatusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="text-xs sm:text-sm">
                            {roleLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm line-clamp-1">
                        {client.email}
                      </span>
                    </div>
                    {client.image && (
                      <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600">
                        <img
                          src={client.image}
                          alt="Client"
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full object-cover"
                        />
                        <span className="text-xs sm:text-sm truncate">
                          {client.image}
                        </span>
                      </div>
                    )}
                    {client.emailVerified && (
                      <div className="flex items-center space-x-2 sm:space-x-3 text-green-600">
                        <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">
                          Email verifikuar
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1.5 sm:space-x-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">Detaje</span>
                    </button>

                    <button
                      onClick={() => {
                        setClientToUpdate(client);
                        setShowUpdateModal(true);
                      }}
                      className="flex items-center justify-center p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg sm:rounded-xl transition-all duration-300"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    <button
                      onClick={() => deleteClient(String(client._id))}
                      className="flex items-center justify-center p-2 sm:p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg sm:rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {filteredClients.length > clientsPerPage && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => {
                      setCurrentPage(number);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      currentPage === number
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600 mb-1 sm:mb-2">
                Nuk u gjetën klientë
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
                Provo të ndryshosh filtrat ose shto klientë të rinj
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">Shto Klientin e Parë</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClient
          setShowAddModal={setShowAddModal}
          handleSaveClient={handleSaveClient}
        />
      )}

      {showUpdateModal && clientToUpdate && (
        <UpdateClient
          client={clientToUpdate}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}

      {showDetailsModal && selectedClient && (
        <DetailsClient
          client={
            selectedClient
              ? {
                  name: selectedClient.name ?? "",
                  email: selectedClient.email ?? "",
                  number: selectedClient.number,
                  address: selectedClient.address,
                  city: selectedClient.city,
                  country: selectedClient.country,
                  role: selectedClient.role
                    ? String(selectedClient.role)
                    : undefined,
                  createdAt: selectedClient.createdAt,
                }
              : null
          }
          setShowDetailsModal={setShowDetailsModal}
        />
      )}
    </div>
  );
};

export default ClientManagement;
