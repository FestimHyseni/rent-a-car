import React, { useState, useMemo } from "react";
import {
  Car,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Star,
  Filter,
  Download,
  Sparkles,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  Wrench,
  GaugeCircle,
  TrendingUp,
  Users,
  Fuel,
  Tag,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import useFetch from "@/hooks/useFetch";
import { ICar } from "@/models/Car";
import AddCar from "../create/car";
// const carBrands = {
//   BMW: ["Series 3", "Series 5", "Series 7", "X3", "X5", "X7"],
//   "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLE", "GLC"],
//   Audi: ["A3", "A4", "A6", "A8", "Q5", "Q7", "Q8"],
//   Volkswagen: ["Golf", "Passat", "Tiguan", "Touareg", "Polo"],
//   Ford: ["Fiesta", "Focus", "Mustang", "Explorer"],
//   Toyota: ["Corolla", "Camry", "RAV4", "Land Cruiser"],
// };
const categories = [
  "Hatchback",
  "Luxury Car",
  "Van",
  "Sports Car",
  "Sedan",
  "SUV",
  "Coupe",
  "Wagon",
  "Off-Road",
  "Pickup Truck",
  "Crossover",
  "Convertible",
];

const CarManagement = () => {
  const { data: fetchedCars, loading, error } = useFetch<ICar[]>("/api/cars");
  const { data: locations } = useFetch<any[]>("/api/locations");
  const { postData } = useFetch("/api/cars");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const locationsMap = useMemo(() => {
    // If locations haven't loaded, return an empty map
    if (!locations) return new Map();

    // The new Map() constructor can take an array of [key, value] pairs
    return new Map(locations.map((loc) => [loc._id, loc]));
  }, [locations]);

  const cars = useMemo(() => {
    // Return an empty array if cars or the map aren't ready
    if (!fetchedCars || locationsMap.size === 0) return [];

    return fetchedCars.map((car) => ({
      ...car, // Copy all original car properties
      // Add a new property 'locationDetails' containing the full location object
      locationDetails: locationsMap.get(car.pickUpLocation),
    }));
  }, [fetchedCars, locationsMap]);
  // State for the feature input field
  const [currentFeature, setCurrentFeature] = useState("");

  const [newCar, setNewCar] = useState({
    make: "",
    makeModel: "",
    category: "",
    pickUpLocation: "",
    dropOffLocation: "",
    year: new Date().getFullYear(),
    price: 50,
    licensePlate: "",
    imageUrl: "",
    features: [] as string[], // Initialize features as an empty array
  });

  const [activeTab, setActiveTab] = useState("cars");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  type LocalCar = {
    id?: number;
    make: string;
    makeModel: string;
    category: string;
    year: number;
    price: number;
    location: string;
    status: "Available" | "Rented" | "Maintenance";
    rating: number;
    totalBookings: number;
    imageUrl: string;
    licensePlate: string;
    features: string[];
    createdAt: Date;
    updatedAt: Date;
    _id: string;
  };

  const filteredCars = (cars || []).filter((car) => {
    const carName = car.makeModel
      ? `${car.make_id} ${car.makeModel}`
      : car.make_id;
    const matchesSearch = String(carName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || car.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSaveCar = async (newCar: any) => {
    try {
      console.log(newCar);

      const response = await postData(newCar);
      setShowAddModal(false);
      // Reset state after saving
      setNewCar({
        make: "",
        makeModel: "",
        category: "",
        pickUpLocation: "",
        dropOffLocation: "",
        year: new Date().getFullYear(),
        price: 50,
        licensePlate: "",
        imageUrl: "",
        features: [],
      });
      setCurrentFeature(""); // Reset feature input as well
      window.location.reload();
    } catch (error) {
      console.error("Failed to save client", error);
    }
  };

  function getStatusProps(status: "Available" | "Rented" | "Maintenance") {
    switch (status) {
      case "Available":
        return {
          color: "from-green-500 to-emerald-500",
          icon: CheckCircle2,
          label: "E disponueshme",
        };
      case "Rented":
        return {
          color: "from-blue-500 to-cyan-500",
          icon: Clock,
          label: "E marrë me qira",
        };
      case "Maintenance":
        return {
          color: "from-amber-500 to-orange-500",
          icon: Wrench,
          label: "Në mirëmbajtje",
        };
      default:
        return {
          color: "from-gray-400 to-gray-500",
          icon: Car,
          label: "E panjohur",
        };
    }
  }

  const carData = cars || [];
  const stats = [
    {
      title: "Total Makina",
      value: carData.length,
      icon: Car,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Të Disponueshme",
      value: carData.filter((c) => c.status === "Available").length,
      icon: CheckCircle2,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Rating Mesatar",
      value: (
        carData.reduce((sum, c) => sum + (c.rating ?? 0), 0) / carData.length
      ).toFixed(1),
      icon: Star,
      gradient: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-[82rem] mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isLoaded={isLoaded}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Menaxhimi i Makinave
              </h1>
              <p className="text-gray-600 mt-1">
                Shfleto, menaxho dhe monitoro të gjithë flotën tënde
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
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
                  placeholder="Kërko makinë (marka, modeli)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none w-full sm:w-auto bg-white/80 border border-gray-200 rounded-2xl px-6 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="all">Të gjitha</option>
                  <option value="Available">E disponueshme</option>
                  <option value="Rented">E marrë me qira</option>
                  <option value="Maintenance">Në mirëmbajtje</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 text-gray-700">
                <Download className="w-5 h-5" />
                <span className="font-medium">Eksporto</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Shto Makinë</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            const status = getStatusProps(car.status);
            const StatusIcon = status.icon;
            return (
              <div
                key={car._id as string}
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={car.imageUrl}
                    alt={`${car.imageUrl}`}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-4 right-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${status.color} text-white text-xs font-bold shadow-lg`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{status.label}</span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800">
                      {String(car.make_id)} {String(car.makeModel)}
                      <span className="text-gray-500 font-medium">
                        ({new Date(car.year).getFullYear()})
                      </span>
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {car.locationDetails?.city || "Unknown Location"},
                        {car.locationDetails?.address}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center my-6 border-y border-gray-100 py-4">
                      <div>
                        <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-700">
                          {car.rating?.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <GaugeCircle className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-700">
                          {car.price} $
                        </p>
                        <p className="text-xs text-gray-500">Per Day</p>
                      </div>
                      <div>
                        <Fuel className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-700">
                          {car.features?.[0] || "Ekonomike"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-800">
                      €{car.price}
                      <span className="text-sm font-normal text-gray-500">
                        /ditë
                      </span>
                    </p>
                    <div className="flex space-x-2">
                      <button className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl transition-all duration-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl transition-all duration-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Car Modal */}
      {showAddModal && (
        <AddCar
          setShowAddModal={setShowAddModal}
          handleSaveCar={handleSaveCar}
        />
      )}
    </div>
  );
};

export default CarManagement;
