import React, { useState, ReactNode, useMemo } from "react";
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

// Type Definitions

interface CarSpec {
  icon: ReactNode;
  label: string;
}

type VehicleClass = "Economic" | "Middle Class" | "Top Grade" | "Luxury";
type VehicleType = "Sedan" | "Hatchback" | "Stationwagon" | "SUV" | "VAN";
type GearTypeLabel = "Automatic" | "Manual";
type FuelTypeLabel =
  | "Diesel"
  | "Gasoline"
  | "Hybrid"
  | "Electrical"
  | "Autogas";
type PersonsLabel =
  | "2 Persons"
  | "3 Persons"
  | "4 Persons"
  | "5 Persons"
  | "7 Persons"
  | "7+ Persons";

interface CarType {
  id: number;
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
  rating: number;
  reviews: number;
  vehicleClass: VehicleClass;
  vehicleType: VehicleType;
  // Derived properties for easier filtering
  gearTypeLabel: GearTypeLabel;
  fuelTypeLabel: FuelTypeLabel;
  personsLabel: PersonsLabel;
}

interface FilterOptionItem {
  id: string;
  label: string;
}

interface FilterOptions {
  vehicleClass: FilterOptionItem[];
  vehicleType: FilterOptionItem[];
  gearType: FilterOptionItem[];
  fuelType: FilterOptionItem[];
  persons: FilterOptionItem[];
}

interface ActiveFilters {
  vehicleClass: VehicleClass[];
  vehicleType: VehicleType[];
  gearType: GearTypeLabel[];
  fuelType: FuelTypeLabel[];
  persons: PersonsLabel[];
}

type SortKey = "name" | "discountedPrice" | "rating" | "modelYear"; // modelYear is a placeholder
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

// Helper function to extract spec labels for filtering
const getSpecLabel = (
  specs: CarSpec[],
  type:
    | "Automatic"
    | "Manual"
    | "Diesel"
    | "Gasoline"
    | "Hybrid"
    | "Electrical"
    | "Autogas"
    | "Persons"
): string | undefined => {
  if (type === "Automatic" || type === "Manual") {
    return specs.find(
      (spec) => spec.label === "Automatic" || spec.label === "Manual"
    )?.label;
  }
  if (
    ["Diesel", "Gasoline", "Hybrid", "Electrical", "Autogas"].includes(type)
  ) {
    return specs.find((spec) =>
      ["Diesel", "Gasoline", "Hybrid", "Electrical", "Autogas"].includes(
        spec.label
      )
    )?.label;
  }
  if (type === "Persons") {
    return specs.find((spec) => spec.label.includes("Persons"))?.label;
  }
  return undefined;
};

// Mock Data for Cars
const mockCarsData: Omit<
  CarType,
  "gearTypeLabel" | "fuelTypeLabel" | "personsLabel"
>[] = [
  {
    id: 1,
    name: "Volvo XC90",
    image: "https://placehold.co/600x400/E2E8F0/4A5568?text=Volvo+XC90",
    specs: [
      { icon: <Fuel className="w-4 h-4 text-gray-500" />, label: "Diesel" },
      {
        icon: <Settings className="w-4 h-4 text-gray-500" />,
        label: "Automatic",
      },
      {
        icon: <Gauge className="w-4 h-4 text-gray-500" />,
        label: "6.5L/100km",
      },
      { icon: <Users className="w-4 h-4 text-gray-500" />, label: "5 Persons" },
    ],
    originalPrice: 406,
    discountedPrice: 324.95,
    dailyPrice: 64.99,
    discount: "25% OFF",
    pickupDate: "30.10.2024 08:00 PM",
    dropoffDate: "03.11.2024 08:00 PM",
    location: "Airport XYZ",
    rating: 4.5,
    reviews: 120,
    vehicleClass: "Luxury",
    vehicleType: "SUV",
  },
  {
    id: 2,
    name: "Audi A7 Sportback",
    image: "https://placehold.co/600x400/E2E8F0/4A5568?text=Audi+A7",
    specs: [
      { icon: <Fuel className="w-4 h-4 text-gray-500" />, label: "Gasoline" },
      {
        icon: <Settings className="w-4 h-4 text-gray-500" />,
        label: "Automatic",
      },
      {
        icon: <Gauge className="w-4 h-4 text-gray-500" />,
        label: "7.2L/100km",
      },
      { icon: <Users className="w-4 h-4 text-gray-500" />, label: "4 Persons" },
    ],
    originalPrice: null,
    discountedPrice: 263.0,
    dailyPrice: 52.6,
    discount: null,
    pickupDate: "30.10.2024 09:00 PM",
    dropoffDate: "03.11.2024 09:00 PM",
    location: "Downtown Central",
    rating: 4.8,
    reviews: 95,
    vehicleClass: "Top Grade",
    vehicleType: "Sedan",
  },
  {
    id: 3,
    name: "Volkswagen Transporter",
    image: "https://placehold.co/600x400/E2E8F0/4A5568?text=VW+Transporter",
    specs: [
      { icon: <Fuel className="w-4 h-4 text-gray-500" />, label: "Diesel" },
      { icon: <Settings className="w-4 h-4 text-gray-500" />, label: "Manual" },
      {
        icon: <Gauge className="w-4 h-4 text-gray-500" />,
        label: "8.0L/100km",
      },
      { icon: <Users className="w-4 h-4 text-gray-500" />, label: "7 Persons" },
    ],
    originalPrice: null,
    discountedPrice: 374.0,
    dailyPrice: 74.8,
    discount: null,
    pickupDate: "31.10.2024 10:00 AM",
    dropoffDate: "04.11.2024 10:00 AM",
    location: "North Station",
    rating: 4.2,
    reviews: 78,
    vehicleClass: "Middle Class",
    vehicleType: "VAN",
  },
  {
    id: 4,
    name: "Mercedes E-Class",
    image: "https://placehold.co/600x400/E2E8F0/4A5568?text=Mercedes+E-Class",
    specs: [
      { icon: <Zap className="w-4 h-4 text-gray-500" />, label: "Electrical" },
      {
        icon: <Settings className="w-4 h-4 text-gray-500" />,
        label: "Automatic",
      },
      { icon: <Gauge className="w-4 h-4 text-gray-500" />, label: "N/A" },
      { icon: <Users className="w-4 h-4 text-gray-500" />, label: "5 Persons" },
    ],
    originalPrice: null,
    discountedPrice: 247.5,
    dailyPrice: 49.5,
    discount: null,
    pickupDate: "01.11.2024 12:00 PM",
    dropoffDate: "05.11.2024 12:00 PM",
    location: "City Center Mall",
    rating: 4.6,
    reviews: 150,
    vehicleClass: "Top Grade",
    vehicleType: "Sedan",
  },
  {
    id: 5,
    name: "BMW 3 Series",
    image: "https://placehold.co/600x400/E2E8F0/4A5568?text=BMW+3+Series",
    specs: [
      { icon: <Fuel className="w-4 h-4 text-gray-500" />, label: "Gasoline" },
      {
        icon: <Settings className="w-4 h-4 text-gray-500" />,
        label: "Automatic",
      },
      {
        icon: <Gauge className="w-4 h-4 text-gray-500" />,
        label: "7.0L/100km",
      },
      { icon: <Users className="w-4 h-4 text-gray-500" />, label: "5 Persons" },
    ],
    originalPrice: 300,
    discountedPrice: 280.0,
    dailyPrice: 56.0,
    discount: "10% OFF",
    pickupDate: "02.11.2024 10:00 AM",
    dropoffDate: "06.11.2024 10:00 AM",
    location: "Westside Rentals",
    rating: 4.7,
    reviews: 110,
    vehicleClass: "Top Grade",
    vehicleType: "Sedan",
  },
  {
    id: 6,
    name: "Ford Focus",
    image: "https://placehold.co/600x400/E2E8F0/4A5568?text=Ford+Focus",
    specs: [
      { icon: <Fuel className="w-4 h-4 text-gray-500" />, label: "Gasoline" },
      { icon: <Settings className="w-4 h-4 text-gray-500" />, label: "Manual" },
      {
        icon: <Gauge className="w-4 h-4 text-gray-500" />,
        label: "6.0L/100km",
      },
      { icon: <Users className="w-4 h-4 text-gray-500" />, label: "5 Persons" },
    ],
    originalPrice: null,
    discountedPrice: 180.0,
    dailyPrice: 36.0,
    discount: null,
    pickupDate: "03.11.2024 11:00 AM",
    dropoffDate: "07.11.2024 11:00 AM",
    location: "South Suburbs",
    rating: 4.1,
    reviews: 65,
    vehicleClass: "Economic",
    vehicleType: "Hatchback",
  },
];

const mockCars: CarType[] = mockCarsData.map((car) => ({
  ...car,
  gearTypeLabel:
    (getSpecLabel(car.specs, "Automatic") as GearTypeLabel) ||
    (getSpecLabel(car.specs, "Manual") as GearTypeLabel),
  fuelTypeLabel:
    (getSpecLabel(car.specs, "Diesel") as FuelTypeLabel) ||
    (getSpecLabel(car.specs, "Gasoline") as FuelTypeLabel) ||
    (getSpecLabel(car.specs, "Hybrid") as FuelTypeLabel) ||
    (getSpecLabel(car.specs, "Electrical") as FuelTypeLabel) ||
    (getSpecLabel(car.specs, "Autogas") as FuelTypeLabel),
  personsLabel: getSpecLabel(car.specs, "Persons") as PersonsLabel,
}));

// Filter Data
const filterOptions: FilterOptions = {
  vehicleClass: [
    { id: "Economic", label: "Economic" },
    { id: "Middle Class", label: "Middle Class" },
    { id: "Top Grade", label: "Top Grade" },
    { id: "Luxury", label: "Luxury" },
  ],
  vehicleType: [
    { id: "Sedan", label: "Sedan" },
    { id: "Hatchback", label: "Hatchback" },
    { id: "Stationwagon", label: "Stationwagon" },
    { id: "SUV", label: "SUV" },
    { id: "VAN", label: "VAN" },
  ],
  gearType: [
    { id: "Automatic", label: "Automatic" },
    { id: "Manual", label: "Manual" },
  ],
  fuelType: [
    { id: "Diesel", label: "Diesel" },
    { id: "Gasoline", label: "Gasoline" },
    { id: "Autogas", label: "Autogas" },
    { id: "Hybrid", label: "Hybrid" },
    { id: "Electrical", label: "Electrical" },
  ],
  persons: [
    // Assuming these are the exact labels in car.specs
    { id: "2 Persons", label: "2 Persons" },
    { id: "3 Persons", label: "3 Persons" },
    { id: "4 Persons", label: "4 Persons" },
    { id: "5 Persons", label: "5 Persons" },
    { id: "7 Persons", label: "7 Persons" }, // For "7 Persons"
    { id: "7+ Persons", label: "7+ Persons" }, // For "7+ Persons"
  ],
};

interface CarCardProps {
  car: CarType;
}

// Car Card Component
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
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />{" "}
            {car.rating} ({car.reviews} reviews)
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
              ${car.discountedPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              ${car.dailyPrice.toFixed(2)}/Daily
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

interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Checkbox Component for Filters
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

// Main Search Page Component
export default function CarSearchPage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    vehicleClass: [],
    vehicleType: [],
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
      const currentCategoryFilters = prev[category] as string[]; // Type assertion
      const typedValue = value as any; // Allow string for value, types will match category

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
    let carsToDisplay = [...mockCars];

    // Filtering
    carsToDisplay = carsToDisplay.filter((car) => {
      return (Object.keys(activeFilters) as Array<keyof ActiveFilters>).every(
        (categoryKey) => {
          const selectedOptions = activeFilters[categoryKey] as (
            | string
            | number
          )[];
          if (selectedOptions.length === 0) {
            return true; // No filter for this category, so car passes
          }

          switch (categoryKey) {
            case "vehicleClass":
              return selectedOptions.includes(car.vehicleClass);
            case "vehicleType":
              return selectedOptions.includes(car.vehicleType);
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

        if (sortConfig.key === "name") {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (sortConfig.key === "discountedPrice") {
          valA = a.discountedPrice ?? 0;
          valB = b.discountedPrice ?? 0;
        } else if (sortConfig.key === "rating") {
          valA = a.rating ?? 0;
          valB = b.rating ?? 0;
        } else {
          // fallback for unknown keys (should not happen)
          valA = "";
          valB = "";
        }

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return carsToDisplay;
  }, [activeFilters, sortConfig]);

  return (
    <div className="bg-gray-50 min-h-screen text-black">
      {/* <SiteHeader /> */}{" "}
      {/* Assuming SiteHeader is defined elsewhere or not needed for this snippet */}
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
              {/* <option value="modelYear_desc">Model Year: Newest</option> */}
              {/* <option value="modelYear">Model Year: Oldest</option> */}
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
          {/* Pagination (Placeholder - would need more logic for filtered/sorted list) */}
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-sm">
              Previous
            </button>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`px-4 py-2 border rounded-md text-sm ${
                  num === 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-sm">
              Next
            </button>
          </div>
        </div>

        <aside className="lg:w-1/4 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
              Booking Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-700">Pick-up:</p>
                <p className="text-gray-600">{mockCars[0].pickupDate}</p>
                <p className="text-gray-500 text-xs">{mockCars[0].location}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Drop-off:</p>
                <p className="text-gray-600">{mockCars[0].dropoffDate}</p>
                <p className="text-gray-500 text-xs">{mockCars[0].location}</p>
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
                      .replace(/^./, (str) => str.toUpperCase())}{" "}
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
            {/* Apply Filters button is not strictly necessary with dynamic updates, but kept for consistency if desired */}
            {/* <button className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 text-sm font-semibold">
              Apply Filters 
            </button> */}
            <button
              onClick={() =>
                setActiveFilters({
                  vehicleClass: [],
                  vehicleType: [],
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
