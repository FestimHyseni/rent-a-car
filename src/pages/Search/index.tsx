import React, { useState, useMemo } from "react";
import {
  Search,
  CalendarDays,
  Users,
  Zap,
  Fuel,
  Settings,
  Filter,
  List,
  LayoutGrid,
} from "lucide-react";

import CarCard from "@/components/CarCard/CarCard";
import {
  CarType,
  GearTypeLabel,
  FuelTypeLabel,
  PersonsLabel,
  FilterOptions,
  ActiveFilters,
  SortKey,
  SortDirection,
  SortConfig,
} from "@/types/carTypes";
import { GetServerSidePropsContext } from "next";

// --- Filter Data ---
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

// --- Filter Checkbox Component ---
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

interface CarSearchPageProps {
  initialCars: CarType[];
  error?: string | null;
  brand?: string | null;
}
export default function CarSearchPage({
  initialCars,
  error: initialError,
  brand,
}: CarSearchPageProps) {
  const [cars, setCars] = useState<CarType[]>(initialCars);
  const [error, setError] = useState<string | null>(initialError || null);

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
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="text-sm text-gray-500 mb-2">
          <a href="#" className="hover:text-blue-600">
            Search
          </a>{" "}
          &gt; <span className="font-semibold text-blue-600">Choose Car</span>{" "}
          &gt; Personal Informations and Pay
        </div>
        {brand && (
          <div className="mb-4 text-sm text-gray-600">
            Showing results for brand:{" "}
            <span className="font-semibold text-blue-600 capitalize">
              {brand}
            </span>
          </div>
        )}
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
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {!error && (
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
              {/* Pagination Placeholder */}
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
              {/* Example Content */}
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
                    {filterOptions[categoryKey]?.map((option) => (
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // 1. Get the brand from the URL query, if it exists
    const { brand } = context.query;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cars`);

    if (!res.ok) {
      throw new Error(`Failed to fetch cars: ${res.status}`);
    }

    const apiData = await res.json();
    let carsToProcess = apiData;

    // 2. If a brand is provided, filter the car list on the server
    if (brand && typeof brand === "string") {
      carsToProcess = carsToProcess.filter(
        (car: any) => car.make && car.make.toLowerCase() === brand.toLowerCase()
      );
    }

    // 3. Transform the (now filtered) car list
    const transformedCars: CarType[] = carsToProcess.map((car: any) => {
      // All your existing transformation logic remains here...
      const gearTypeLabel = car.transmission as GearTypeLabel;
      const fuelTypeLabel = car.fuelType as FuelTypeLabel;
      const personsLabel = `${car.seats} Persons` as PersonsLabel;

      const getFuelIconName = (fuel: FuelTypeLabel) => {
        if (["Electrical", "Electric", "Hybrid"].includes(fuel)) return "zap";
        return "fuel";
      };

      const specs = [
        { icon: getFuelIconName(fuelTypeLabel), label: fuelTypeLabel },
        { icon: "settings", label: gearTypeLabel },
        { icon: "users", label: personsLabel },
      ];

      return {
        id: car._id,
        make: car.make, // Ensure you have a 'make' or 'make_id' field
        name: `${car.make} ${car.makeModel}`,
        image: car.imageUrl,
        // specs, // Assuming you've fixed the serialization issue
        originalPrice: car.originalPrice || null,
        discountedPrice: car.price || 0,
        dailyPrice: (car.price || 0) / 5,
        discount: car.discount || null,
        pickupDate: "Date from search",
        dropoffDate: "Date from search",
        location: car.pickUpLocation,
        pickUpLocation: car.pickUpLocation,
        dropOffLocation: car.dropOffLocation || "",
        rating: car.rating || null,
        reviews: car.reviews || null,
        // gearTypeLabel,
        fuelTypeLabel,
        personsLabel,
        modelYear: car.year ? new Date(car.year).getFullYear() : null, // Safely get year
      };
    });

    return {
      props: {
        initialCars: transformedCars,
        // 4. Pass the brand down as a prop
        brand: brand || null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps for CarSearchPage:", error);
    return {
      props: {
        initialCars: [],
        error: "Could not load car data. Please try again later.",
        brand: null,
      },
    };
  }
}
