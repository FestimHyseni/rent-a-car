export interface Car {
  id: number;
  make: string;
  makeModel: string;
  category: string;
  year: number;
  pricePerDay: number;
  pickUpLocation: string;
  dropOffLocation: string;
  status: "Available" | "Rented" | "Maintenance";
  rating: number;
  totalBookings: number;
  lastBooking: string;
  imageUrl: string;
  licensePlate: string;
  features: string[];
}
