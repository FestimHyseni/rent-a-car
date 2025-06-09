import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Car,
  Star,
  Filter,
  Download,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Activity,
  Award,
  Crown,
  Sparkles,
  ChevronDown,
  X,
  CheckSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import useFetch from "@/hooks/useFetch";
import { IUser } from "@/models/User";
import AddClient from "../create/client";
import router from "next/router";
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
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
  });

  // Sidebar state (add these lines)
  const [activeTab, setActiveTab] = useState("clients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  // Sample data
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Arjan Berisha",
      email: "arjan.berisha@email.com",
      phone: "+355 69 123 4567",
      location: "Tiranë",
      joinDate: "2024-01-15",
      totalBookings: 12,
      totalSpent: 2400,
      rating: 4.8,
      status: "active",
      lastBooking: "2024-05-20",
      avatar: "AB",
    },
    {
      id: 2,
      name: "Elona Kastrati",
      email: "elona.kastrati@email.com",
      phone: "+355 68 987 6543",
      location: "Durrës",
      joinDate: "2024-02-10",
      totalBookings: 8,
      totalSpent: 1800,
      rating: 4.9,
      status: "premium",
      lastBooking: "2024-05-18",
      avatar: "EK",
    },
    {
      id: 3,
      name: "Fatmir Hoxha",
      email: "fatmir.hoxha@email.com",
      phone: "+355 67 555 1234",
      location: "Vlorë",
      joinDate: "2024-03-05",
      totalBookings: 3,
      totalSpent: 650,
      rating: 4.5,
      status: "active",
      lastBooking: "2024-04-12",
      avatar: "FH",
    },
    {
      id: 4,
      name: "Gentiana Leka",
      email: "gentiana.leka@email.com",
      phone: "+355 69 777 8888",
      location: "Shkodër",
      joinDate: "2023-11-20",
      totalBookings: 25,
      totalSpent: 4200,
      rating: 5.0,
      status: "vip",
      lastBooking: "2024-05-22",
      avatar: "GL",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "from-yellow-400 to-orange-500";
      case "premium":
        return "from-purple-500 to-pink-500";
      case "active":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

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
      value: clients.length,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      title: "Klientë VIP",
      value: clients.filter((c) => c.status === "vip").length,
      icon: Crown,
      gradient: "from-yellow-500 to-orange-500",
      change: "+25%",
    },
    {
      title: "Të Ardhura Mesatare",
      value:
        "€" +
        Math.round(
          clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length
        ),
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      change: "+8%",
    },
    {
      title: "Rating Mesatar",
      value: (
        clients.reduce((sum, c) => sum + c.rating, 0) / clients.length
      ).toFixed(1),
      icon: Star,
      gradient: "from-purple-500 to-pink-500",
      change: "+0.2",
    },
  ];

  const deleteClient = async (id: string) => {
    try {
      await deleteData("/api/users", {
        id,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isLoaded={isLoaded}
      />
      <div className="w-full max-w-[90rem] px-4 md:px-8 xl:px-12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Menaxhimi i Klientëve
              </h1>
              <p className="text-gray-600 mt-1">
                Menaxho dhe monitoroni të gjithë klientët tuaj
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Kërko klientë..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white/80 border border-gray-200 rounded-2xl px-6 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="all">Të gjithë</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                  <option value="active">Aktiv</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => exportClientsToCSV(users || [])}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 text-gray-700"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Eksporto</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Shto Klient</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            console.log(client);

            const initials = client.name
              ? client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "US";
            const StatusIcon = getStatusIcon(String(client.role)); // përdor `role` në vend të `status`
            let roleLabel;
            let statusColor;
            if (String(client.role) === "admin") {
              roleLabel = "Administrator";
              statusColor = "from-amber-500 to-orange-500";
            } else if (String(client.role) === "staff") {
              roleLabel = "Staff";
              statusColor = "from-sky-500 to-cyan-500"; // Changed
            } else {
              // This handles "user" and any other potential values
              roleLabel = "Përdorues";
              statusColor = "from-blue-500 to-indigo-500";
            }

            return (
              <div
                key={String(client._id ?? client.email ?? client.name)}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {client.name}
                      </h3>
                      <div
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r ${statusColor} text-white text-xs font-bold`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{roleLabel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  {client.image && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <img
                        src={client.image}
                        alt="Client"
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="text-sm truncate">{client.image}</span>
                    </div>
                  )}
                  {client.emailVerified && (
                    <div className="flex items-center space-x-3 text-green-600">
                      <CheckSquare className="w-4 h-4" />
                      <span className="text-sm">Email verifikuar</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Detaje</span>
                  </button>

                  <button
                    onClick={() => {
                      setClientToUpdate(client);
                      setShowUpdateModal(true);
                    }}
                    className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl transition-all duration-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteClient(String(client._id))}
                    className="flex items-center justify-center p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              Nuk u gjetën klientë
            </h3>
            <p className="text-gray-500 mb-8">
              Provo të ndryshosh filtrat ose shto klientë të rinj
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Shto Klientin e Parë</span>
            </button>
          </div>
        )}
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
