import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import useFetch from "@/hooks/useFetch";

type AddCarProps = {
  setShowAddModal: (show: boolean) => void;
  handleSaveCar: (car: {
    make: string;
    makeModel: string;
    category: string;
    pickUpLocation: string;
    dropOffLocation: string;
    fuelType: string;
    year: Date;
    price: 50;
    licensePlate: string;
    imageUrl: string;
    features: string[];
  }) => void;
};

const AddCar: React.FC<AddCarProps> = ({ setShowAddModal, handleSaveCar }) => {
  const [newCar, setNewCar] = useState({
    make: "",
    makeModel: "",
    category: "",
    pickUpLocation: "",
    dropOffLocation: "",
    fuelType: "",
    year: new Date().getFullYear(),
    price: 50,
    licensePlate: "",
    imageUrl: "",
    features: [] as string[],
  });
  const fuelTypes = ["Electric", "Hydrogen", "Diesel", "Petrol", "Hybrid"];
  const [currentFeature, setCurrentFeature] = useState("");
  const { data: locations } = useFetch<any[]>("/api/locations");

  const { data: brands } = useFetch<Record<any, any[]>>("/api/brands");

  const handleAddFeature = () => {
    if (currentFeature && !newCar.features.includes(currentFeature)) {
      setNewCar({ ...newCar, features: [...newCar.features, currentFeature] });
      setCurrentFeature(""); // Clear the input field
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
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
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
        {/* Modal Content */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marka
          </label>{" "}
          <select
            name="make"
            value={newCar.make}
            onChange={(e) => {
              // When changing the make, reset the model selection
              setNewCar({ ...newCar, make: e.target.value, makeModel: "" });
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="" disabled>
              Marka
            </option>
            {/* This part was already correct */}
            {brands &&
              Array.isArray(brands) &&
              brands.map((make) => (
                <option key={make._id} value={make._id}>
                  {make.name}
                </option>
              ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modeli
          </label>
          <select
            name="makeModel"
            value={newCar.makeModel}
            onChange={(e) =>
              setNewCar({ ...newCar, makeModel: e.target.value })
            }
            disabled={!newCar.make} // Disables the dropdown until a make is selected
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="" disabled>
              Modeli
            </option>
            {brands &&
              Array.isArray(brands) &&
              brands
                .find((brand: any) => brand._id === newCar.make)
                ?.models?.map((model: any) => (
                  <option key={model._id} value={model._id}>
                    {model.name}
                  </option>
                ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pick up Lokacioni
          </label>
          <select
            name="pickUpLocation"
            value={newCar.pickUpLocation}
            onChange={(e) =>
              setNewCar({ ...newCar, pickUpLocation: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="" disabled>
              Pick up Lokacioni
            </option>

            {Array.isArray(locations) &&
              locations.map((location, idx) => (
                <option key={idx} value={location._id}>
                  {location.city}, {location.address}
                </option>
              ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drop off Lokacioni
          </label>
          <select
            name="dropOffLocation"
            value={newCar.dropOffLocation}
            onChange={(e) =>
              setNewCar({ ...newCar, dropOffLocation: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="" disabled>
              Drop off Lokacioni
            </option>

            {Array.isArray(locations) &&
              locations.map((location, idx) => (
                <option key={idx} value={location._id}>
                  {location.city}, {location.address}
                </option>
              ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={newCar.fuelType}
            onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="" disabled>
              Fuel Type
            </option>

            {Array.isArray(fuelTypes) &&
              fuelTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Viti
          </label>
          <input
            name="year"
            type="number"
            value={newCar.year}
            placeholder="Viti"
            onChange={(e) =>
              setNewCar({ ...newCar, year: Number(e.target.value) })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Targa
          </label>
          <input
            name="licensePlate"
            type="text"
            value={newCar.licensePlate}
            placeholder="Targa"
            onChange={(e) =>
              setNewCar({ ...newCar, licensePlate: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Çmimi / Ditë (€)
          </label>
          <input
            name="price"
            type="number"
            value={newCar.price}
            placeholder="Çmimi / Ditë (€)"
            onChange={(e) =>
              setNewCar({ ...newCar, price: Number(e.target.value) })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL e fotos
          </label>
          <input
            name="imageUrl"
            type="text"
            value={newCar.imageUrl}
            placeholder="URL e fotos"
            onChange={(e) => setNewCar({ ...newCar, imageUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {/* Feature Management UI */}
          <div>
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
        {/* Modal Actions */}
        <div className="flex space-x-3 pt-6">
          <button
            onClick={() => setShowAddModal(false)}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all"
          >
            Anulo
          </button>
          <button
            onClick={() =>
              handleSaveCar({
                ...newCar,
                year: new Date(Number(newCar.year), 0, 1),
                price: 50,
              })
            }
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all"
          >
            Ruaj Makinën
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
