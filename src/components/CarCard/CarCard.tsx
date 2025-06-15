import React from "react";
import { Star } from "lucide-react";

interface CarSpec {
    icon: React.ReactNode;
    label: string;
}

interface CarType {
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
    gearTypeLabel: string;
    fuelTypeLabel: string;
    personsLabel: string;
    modelYear: number;
}

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

export default CarCard;