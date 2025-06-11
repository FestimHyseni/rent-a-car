import React, { useState, useEffect, useMemo } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import useFetch from "@/hooks/useFetch";

// --- Type Definitions ---
type AddCarProps = {
  setShowAddModal: (show: boolean) => void;
  handleSaveCar: (car: {
    make: string;
    makeModel: string;
    category: string;
    pickUpLocation: string;
    dropOffLocation: string;
    fuelType: string;
    transmission: string;
    year: Date;
    price: number;
    licensePlate: string;
    imageUrl: string;
    features: string[];
  }) => void;
};

type Location = { _id: string; city: string; address: string };
type Brand = {
  _id: string;
  name: string;
  models: { _id: string; name: string }[];
};

// --- Component ---
const AddCar: React.FC<AddCarProps> = ({ setShowAddModal, handleSaveCar }) => {
  const [newCar, setNewCar] = useState({
    make: "",
    makeModel: "",
    category: "",
    pickUpLocation: "",
    dropOffLocation: "",
    fuelType: "",
    transmission: "",
    year: new Date().getFullYear(),
    price: 50,
    licensePlate: "", // Initial state
    imageUrl: "",
    features: [] as string[],
  });

  const [imageError, setImageError] = useState(false);
  const fuelTypes = ["Diesel", "Hydrogen", "Electric", "Petrol", "Hybrid"];
  const transmissionTypes = ["Automatic", "Manual"];
  const [currentFeature, setCurrentFeature] = useState("");

  const { data: locations } = useFetch<Location[]>("/api/locations");
  const { data: brands } = useFetch<Brand[]>("/api/brands");

  // Memoize sorted brands to prevent re-sorting on every render
  const sortedBrands = useMemo(() => {
    if (!brands) return [];
    return [...brands].sort((a, b) => a.name.localeCompare(b.name));
  }, [brands]);

  // Memoize sorted models based on the selected brand
  const sortedModels = useMemo(() => {
    if (!newCar.make || !brands) return [];
    const selectedBrand = brands.find((brand) => brand._id === newCar.make);
    if (!selectedBrand?.models) return [];
    return [...selectedBrand.models].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [newCar.make, brands]);

  const handleAddFeature = () => {
    if (currentFeature && !newCar.features.includes(currentFeature)) {
      setNewCar({ ...newCar, features: [...newCar.features, currentFeature] });
      setCurrentFeature("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setNewCar({
      ...newCar,
      features: newCar.features.filter(
        (feature) => feature !== featureToRemove
      ),
    });
  };

  // --- MODIFIED: handleChange function with license plate formatting ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle license plate formatting
    if (name === "licensePlate") {
      const rawValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      let formattedValue = "";

      // Part 1: First 2 digits
      // Part 1: Handle the first two digits (0 followed by 1-7)
      if (rawValue.length > 0) {
        // The first character is always '0'
        formattedValue = "0";

        // Check the second character
        if (rawValue.length > 1) {
          const secondDigit = rawValue.charAt(1);
          // Only add the second digit if it is between 1 and 7
          if (/[1-7]/.test(secondDigit)) {
            formattedValue += secondDigit;
          }
        }
      }
      // Part 2: Hyphen and next 3 digits
      if (rawValue.length > 2) {
        formattedValue += "-" + rawValue.substring(2, 5).replace(/[^0-9]/g, "");
      }
      // Part 3: Hyphen and last 2 letters
      if (rawValue.length > 5) {
        formattedValue +=
          "-" + rawValue.substring(5, 7).replace(/[^A-Z]/g, "XX");
      }

      setNewCar({ ...newCar, licensePlate: formattedValue });

      // Handle make change to reset model
    } else if (name === "make") {
      setNewCar({ ...newCar, make: value, makeModel: "" });

      // Handle all other inputs
    } else {
      let finalValue: string | number = value;
      if (name === "year" || name === "price") {
        finalValue = Number(value);
      }
      if (name === "imageUrl") {
        setImageError(false);
      }
      setNewCar({ ...newCar, [name]: finalValue });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-5xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Shto Makinë të Re
          </h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-h-[85vh] overflow-y-auto pr-4">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-4">
            {/* ... Image URL and Preview ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL e fotos
              </label>
              <input
                name="imageUrl"
                type="text"
                value={newCar.imageUrl}
                placeholder="https://example.com/foto.png"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
              {newCar.imageUrl && !imageError ? (
                <img
                  src={newCar.imageUrl}
                  alt="Car Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="mx-auto h-12 w-12" />
                  <p className="mt-2 text-sm">Parashikimi i imazhit</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marka
                </label>
                <select
                  name="make"
                  value={newCar.make}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Zgjidh Markën
                  </option>
                  {sortedBrands.map((make) => (
                    <option key={make._id} value={make._id}>
                      {make.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modeli
                </label>
                <select
                  name="makeModel"
                  value={newCar.makeModel}
                  onChange={handleChange}
                  disabled={!newCar.make}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="" disabled>
                    Zgjidh Modelin
                  </option>
                  {sortedModels.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pick-up Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pick up Lokacioni
                </label>
                <select
                  name="pickUpLocation"
                  value={newCar.pickUpLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Zgjidh Lokacionin
                  </option>
                  {Array.isArray(locations) &&
                    locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.city}, {location.address}
                      </option>
                    ))}
                </select>
              </div>

              {/* Drop-off Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop off Lokacioni
                </label>
                <select
                  name="dropOffLocation"
                  value={newCar.dropOffLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Zgjidh Lokacionin
                  </option>
                  {Array.isArray(locations) &&
                    locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.city}, {location.address}
                      </option>
                    ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lloji i Karburantit
                </label>
                <select
                  name="fuelType"
                  value={newCar.fuelType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Zgjidh Karburantin
                  </option>
                  {fuelTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmisioni
                </label>
                <select
                  name="transmission"
                  value={newCar.transmission}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Zgjidh Transmisionin
                  </option>
                  {transmissionTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Viti
                </label>
                <input
                  name="year"
                  type="number"
                  value={newCar.year}
                  placeholder="Viti"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* --- MODIFIED: License Plate input --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Targa
                </label>
                <input
                  name="licensePlate"
                  type="text"
                  value={newCar.licensePlate}
                  placeholder="00-000-XX"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Price */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çmimi / Ditë (€)
                </label>
                <input
                  name="price"
                  type="number"
                  value={newCar.price}
                  placeholder="Çmimi / Ditë (€)"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiparet e Makinës
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Shto një tipar (p.sh. GPS)"
                    className="flex-grow px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-3 bg-blue-100 text-blue-700 rounded-2xl hover:bg-blue-200 transition-colors font-medium"
                  >
                    Shto
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {newCar.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-gray-500 hover:text-gray-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex space-x-3 pt-6 mt-4 border-t">
          <button
            onClick={() => setShowAddModal(false)}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 font-semibold transition-all"
          >
            Anulo
          </button>
          <button
            onClick={() =>
              handleSaveCar({ ...newCar, year: new Date(newCar.year, 0, 1) })
            }
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Ruaj Makinën
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
