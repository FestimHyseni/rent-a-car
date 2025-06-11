import React, { useState, ReactNode, useMemo, useEffect } from "react";
import {
  Search,
  CalendarDays,
  Users,
  Zap,
  Fuel,
  Settings,
  Gauge,
  Filter,
  List,
  LayoutGrid,
  Star,
} from "lucide-react";

import useFetch from "@/hooks/useFetch";

interface CarSpec {
  icon: ReactNode;
  label: string;
}

type GearTypeLabel = "Automatic" | "Manual";
// Extended to include API variations
type FuelTypeLabel = "Electric" | "Hydrogen" | "Diesel" | "Petrol" | "Hybrid";
// Flexible to handle any number of persons from the API
type PersonsLabel = string;

interface CarType {
  id: string; // Changed from number to string for MongoDB _id
  name: string;
  image: string;
  specs: CarSpec[];
  originalPrice: number | null;
  discountedPrice: number;
  dailyPrice: number;
  discount: string | null;
  pickupDate: string;
  dropoffDate: string;
  location: string;
  rating: number | null; // Made nullable
  reviews: number | null; // Made nullable
  gearTypeLabel: GearTypeLabel;
  fuelTypeLabel: FuelTypeLabel;
  personsLabel: PersonsLabel;
  modelYear: number; // Added for sorting
}

interface FilterOptionItem {
  id: string;
  label: string;
}

interface FilterOptions {
  gearType: FilterOptionItem[];
  fuelType: FilterOptionItem[];
  persons: FilterOptionItem[];
}

interface ActiveFilters {
  gearType: GearTypeLabel[];
  fuelType: FuelTypeLabel[];
  persons: PersonsLabel[];
}

type SortKey = "name" | "discountedPrice" | "rating" | "modelYear";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}
// --- Filter Data (Updated) ---
const filterOptions: FilterOptions = {
  gearType: [
    { id: "Automatic", label: "Automatic" },
    { id: "Manual", label: "Manual" },
  ],
  fuelType: [
    { id: "Electric", label: "Electric" },
    { id: "Hydrogen", label: "Hydrogen" },
    { id: "Diesel", label: "Diesel" },
    { id: "Petrol", label: "Petrol" },
    { id: "Hybrid", label: "Hybrid" },
  ],
  persons: [
    { id: "2 Persons", label: "2 Persons" },
    { id: "3 Persons", label: "3 Persons" },
    { id: "4 Persons", label: "4 Persons" },
    { id: "5 Persons", label: "5 Persons" },
    { id: "7 Persons", label: "7 Persons" },
    { id: "7+ Persons", label: "7+ Persons" },
  ],
};

// --- Car Card Component (Updated for nullable properties) ---
interface CarCardProps {
  car: CarType;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="md:w-1/3 relative">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-56 md:h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
            (e.currentTarget.src =
              "https://placehold.co/600x400/CCCCCC/777777?text=Image+Not+Found")
          }
        />
        {car.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {car.discount}
          </div>
        )}
      </div>

      <div className="md:w-2/3 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{car.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            {car.rating && car.reviews ? (
              <>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                {car.rating} ({car.reviews} reviews)
              </>
            ) : (
              <span className="text-xs">No reviews yet</span>
            )}
            <a href="#" className="text-blue-600 hover:underline ml-2 text-xs">
              View vehicle specifications
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
            {car.specs.map((spec, index) => (
              <div key={index} className="flex items-center space-x-1.5">
                {spec.icon}
                <span>{spec.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-4">
          <div className="mb-3 sm:mb-0">
            <p className="text-xs text-gray-500">
              Total {car.originalPrice ? "5 Days" : ""}
            </p>{" "}
            {car.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                ${car.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-2xl font-bold text-blue-600">
              ${(car.discountedPrice || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              ${(car.dailyPrice || 0).toFixed(2)}/Daily
            </p>
          </div>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm">
            Rent Now!
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Filter Checkbox Component (No changes) ---
interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
}) => (
  <label
    htmlFor={id}
    className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600"
  >
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span>{label}</span>
  </label>
);

// --- Main Search Page Component (Refactored) ---
export default function CarSearchPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    gearType: [],
    fuelType: [],
    persons: [],
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Use the useFetch hook to fetch car data
  const {
    data: apiData,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch("/api/cars");

  useEffect(() => {
    if (fetchLoading) {
      setLoading(true);
      return;
    }
    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }
    if (apiData && Array.isArray(apiData)) {
      // Transform API data into CarType format
      const transformedCars: CarType[] = apiData.map((car: any) => {
        const gearTypeLabel = car.transmission as GearTypeLabel;
        const fuelTypeLabel = car.fuelType as FuelTypeLabel;
        const personsLabel = `${car.seats} Persons` as PersonsLabel;

        const getFuelIcon = (fuel: FuelTypeLabel) => {
          if (["Electrical", "Electric", "Hybrid"].includes(fuel)) {
            return <Zap className="w-4 h-4 text-gray-500" />;
          }
          return <Fuel className="w-4 h-4 text-gray-500" />;
        };

        const specs: CarSpec[] = [
          { icon: getFuelIcon(fuelTypeLabel), label: fuelTypeLabel },
          {
            icon: <Settings className="w-4 h-4 text-gray-500" />,
            label: gearTypeLabel,
          },
          {
            icon: <Users className="w-4 h-4 text-gray-500" />,
            label: personsLabel,
          },
        ];

        return {
          id: car._id,
          name: `${car.make_id} ${car.makeModel}`,
          image: car.imageUrl,
          specs,
          originalPrice: null, // Not in API
          discountedPrice: car.price || 0,
          dailyPrice: (car.price || 0) / 5, // Assuming 5 days rental for calculation
          discount: null, // Not in API
          pickupDate: "Date from search", // Placeholder
          dropoffDate: "Date from search", // Placeholder
          location: car.pickUpLocation,
          rating: car.rating || null, // Not in API, defaulting to null
          reviews: car.reviews || null, // Not in API, defaulting to null
          gearTypeLabel,
          fuelTypeLabel,
          personsLabel,
          modelYear: car.year,
        };
      });
      setCars(transformedCars);
      setError(null);
      setLoading(false);
    }
  }, [apiData, fetchLoading, fetchError]);

  const handleFilterChange = (category: keyof ActiveFilters, value: string) => {
    setActiveFilters((prev) => {
      const currentCategoryFilters = prev[category] as string[];
      const typedValue = value as any;
      if (currentCategoryFilters.includes(typedValue)) {
        return {
          ...prev,
          [category]: currentCategoryFilters.filter(
            (item) => item !== typedValue
          ),
        };
      } else {
        return { ...prev, [category]: [...currentCategoryFilters, typedValue] };
      }
    });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let key: SortKey = "name";
    let direction: SortDirection = "asc";
    if (value.includes("_desc")) {
      direction = "desc";
      key = value.replace("_desc", "") as SortKey;
    } else {
      key = value as SortKey;
    }
    setSortConfig({ key, direction });
  };

  const processedCars = useMemo(() => {
    let carsToDisplay = [...cars];

    // Filtering
    carsToDisplay = carsToDisplay.filter((car) => {
      return (Object.keys(activeFilters) as Array<keyof ActiveFilters>).every(
        (categoryKey) => {
          const selectedOptions = activeFilters[categoryKey] as string[];
          if (selectedOptions.length === 0) return true;
          switch (categoryKey) {
            case "gearType":
              return selectedOptions.includes(car.gearTypeLabel);
            case "fuelType":
              return selectedOptions.includes(car.fuelTypeLabel);
            case "persons":
              return selectedOptions.includes(car.personsLabel);
            default:
              return true;
          }
        }
      );
    });

    // Sorting
    if (sortConfig.key) {
      carsToDisplay.sort((a, b) => {
        let valA: string | number = "";
        let valB: string | number = "";
        switch (sortConfig.key) {
          case "name":
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
          case "discountedPrice":
            valA = a.discountedPrice ?? 0;
            valB = b.discountedPrice ?? 0;
            break;
          case "rating":
            valA = a.rating ?? 0;
            valB = b.rating ?? 0;
            break;
          case "modelYear":
            valA = a.modelYear ?? 0;
            valB = b.modelYear ?? 0;
            break;
          default:
            break;
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return carsToDisplay;
  }, [cars, activeFilters, sortConfig]);

  return (
    <div className="bg-gray-50 min-h-screen text-black">
      {/* <SiteHeader /> */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="text-sm text-gray-500 mb-2">
          <a href="#" className="hover:text-blue-600">
            Search
          </a>{" "}
          &gt; <span className="font-semibold text-blue-600">Choose Car</span>{" "}
          &gt; Personal Informations and Pay
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Search Result</h1>
      </div>
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-wrap justify-between items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Currency:</span>
            <select className="border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500">
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort result by:</span>
            <select
              onChange={handleSortChange}
              value={`${sortConfig.key}${
                sortConfig.direction === "desc" ? "_desc" : ""
              }`}
              className="border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="discountedPrice">Price: Low to High</option>
              <option value="discountedPrice_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="rating">Rating: Low to High</option>
              <option value="modelYear_desc">Model Year: Newest</option>
              <option value="modelYear">Model Year: Oldest</option>
            </select>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 mr-1">Change List View:</span>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          {loading && <div className="text-center p-8">Loading cars...</div>}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {!loading && !error && (
            <>
              {processedCars.length > 0 ? (
                processedCars.map((car) => <CarCard key={car.id} car={car} />)
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">
                    No cars match your criteria
                  </h3>
                  <p>
                    Try adjusting your filters or searching for a different
                    location/date.
                  </p>
                </div>
              )}
              {/* Pagination (Placeholder) */}
              <div className="mt-8 flex justify-center items-center space-x-2">
                {/* ... pagination buttons ... */}
              </div>
            </>
          )}
        </div>

        <aside className="lg:w-1/4 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
              Booking Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-700">Pick-up (Example):</p>
                <p className="text-gray-600">30.10.2024 08:00 PM</p>
                <p className="text-gray-500 text-xs">Airport XYZ</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Drop-off (Example):</p>
                <p className="text-gray-600">03.11.2024 08:00 PM</p>
                <p className="text-gray-500 text-xs">Airport XYZ</p>
              </div>
              <button className="w-full mt-3 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 text-sm font-semibold">
                Change Search
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filter Vehicles
            </h3>

            {(Object.keys(filterOptions) as Array<keyof FilterOptions>).map(
              (categoryKey) => (
                <div key={categoryKey} className="mb-5">
                  <h4 className="font-semibold text-gray-700 mb-2 capitalize text-sm">
                    {categoryKey
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h4>
                  <div className="space-y-1.5">
                    {filterOptions[categoryKey].map((option) => (
                      <FilterCheckbox
                        key={option.id}
                        id={`${categoryKey}-${option.id}`}
                        label={option.label}
                        checked={(
                          activeFilters[categoryKey] as string[]
                        ).includes(option.id)}
                        onChange={() =>
                          handleFilterChange(categoryKey, option.id)
                        }
                      />
                    ))}
                  </div>
                </div>
              )
            )}
            <button
              onClick={() =>
                setActiveFilters({
                  gearType: [],
                  fuelType: [],
                  persons: [],
                })
              }
              className="w-full mt-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-100 text-sm"
            >
              Reset Filters
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
