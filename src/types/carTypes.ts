import { ReactNode } from "react";

export type GearTypeLabel = "Automatic" | "Manual";
export type FuelTypeLabel =
  | "Electric"
  | "Hydrogen"
  | "Diesel"
  | "Petrol"
  | "Hybrid";
export type PersonsLabel = string;

export interface LocationType {
  _id: string;
  city: string;
  address: string;
}

export interface CarType {
  id: string;
  name: string;
  image: string;
  features: string[];
  originalPrice: number | null;
  discountedPrice: number;
  dailyPrice: number;
  discount: string | null;
  pickupDate: string;
  dropoffDate: string;
  pickUpLocation: LocationType;
  dropOffLocation: LocationType;
  rating: number | null;
  reviews: number | null;
  gearTypeLabel: GearTypeLabel;
  fuelTypeLabel: FuelTypeLabel;
  personsLabel: PersonsLabel;
  modelYear: number;
  make?: string;
  makeModel?: string;
  seats?: number;
  transmission?: GearTypeLabel;
  fuelType?: FuelTypeLabel;
}

export interface BookingType {
  id: string;
  carId: string;
  userId: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  dropOffDate: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  createdAt: string;
  car?: CarType; // Expanded car details
  user?: {
    // Basic user info
    id: string;
    name: string;
    email: string;
  };
  pickupLocation?: LocationType; // Expanded location info
  dropoffLocation?: LocationType; // Expanded location info
}

export interface FilterOptionItem {
  id: string;
  label: string;
}

export interface FilterOptions {
  gearType: FilterOptionItem[];
  fuelType: FilterOptionItem[];
  persons: FilterOptionItem[];
  locations?: FilterOptionItem[]; // Added for location filtering
}

export interface ActiveFilters {
  gearType: GearTypeLabel[];
  fuelType: FuelTypeLabel[];
  persons: PersonsLabel[];
  locations?: string[]; // Added for location filtering
}

export type SortKey =
  | "name"
  | "discountedPrice"
  | "rating"
  | "modelYear"
  | "dailyPrice";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}
