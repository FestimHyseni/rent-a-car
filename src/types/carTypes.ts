import { ReactNode } from "react";

export interface CarSpec {
    icon: ReactNode;
    label: string;
}

export type GearTypeLabel = "Automatic" | "Manual";
export type FuelTypeLabel = "Electric" | "Hydrogen" | "Diesel" | "Petrol" | "Hybrid";
export type PersonsLabel = string;

export interface CarType {
    id: string;
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
    rating: number | null;
    reviews: number | null;
    gearTypeLabel: GearTypeLabel;
    fuelTypeLabel: FuelTypeLabel;
    personsLabel: PersonsLabel;
    modelYear: number;
}

export interface FilterOptionItem {
    id: string;
    label: string;
}

export interface FilterOptions {
    gearType: FilterOptionItem[];
    fuelType: FilterOptionItem[];
    persons: FilterOptionItem[];
}

export interface ActiveFilters {
    gearType: GearTypeLabel[];
    fuelType: FuelTypeLabel[];
    persons: PersonsLabel[];
}

export type SortKey = "name" | "discountedPrice" | "rating" | "modelYear";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}