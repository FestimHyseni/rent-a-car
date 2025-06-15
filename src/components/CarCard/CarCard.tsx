import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { CarType, LocationType } from "@/types/carTypes";
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";

interface CarCardProps {
    car: CarType;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
    const { data: session } = useSession();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        pickUpDate: "",
        dropOffDate: "",
        pickUpLocation: car.location || "",
        dropOffLocation: car.location || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { postData } = useFetch("/api/bookings");

    // Fetch locations with proper typing
    const { data: locations, loading: locationsLoading, error: locationsError } =
        useFetch<LocationType[]>("/api/cars");

    const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingData({ ...bookingData, [name]: value });
    };

    const handleRentNow = async () => {
        if (!session?.user?.id) {
            setError("Please sign in to make a booking");
            return;
        }

        if (!bookingData.pickUpLocation || !bookingData.dropOffLocation) {
            setError("Please select both pick-up and drop-off locations");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const pickUpDate = new Date(bookingData.pickUpDate);
            const dropOffDate = new Date(bookingData.dropOffDate);

            if (dropOffDate <= pickUpDate) {
                setError("Drop-off date must be after pick-up date");
                return;
            }

            const days = Math.ceil((dropOffDate.getTime() - pickUpDate.getTime()) / (1000 * 60 * 60 * 24));
            const totalPrice = days * car.dailyPrice;

            await postData({
                carId: car.id,
                userId: session.user.id,
                pickUpLocation: bookingData.pickUpLocation,
                dropOffLocation: bookingData.dropOffLocation,
                pickUpDate: bookingData.pickUpDate,
                dropOffDate: bookingData.dropOffDate,
                totalPrice: totalPrice.toFixed(2),
            });

            setShowBookingModal(false);
            alert(`Booking confirmed for ${car.name}! Total: $${totalPrice.toFixed(2)}`);
        } catch (err) {
            console.error("Booking failed:", err);
            setError(err instanceof Error ? err.message : "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    const renderLocationSelect = (name: "pickUpLocation" | "dropOffLocation") => (
        <select
            name={name}
            value={bookingData[name]}
            onChange={handleBookingChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
            required
            disabled={locationsLoading}
        >
            <option value="">Select {name === "pickUpLocation" ? "Pick-up" : "Drop-off"} Location</option>
            {locations?.map((location) => (
                <option key={location._id} value={location._id}>
                    {location.city}, {location.address}
                </option>
            ))}
        </select>
    );

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row mb-6 hover:shadow-xl transition-shadow duration-300">
                <div className="md:w-1/3 relative">
                    <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-56 md:h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/777777?text=Image+Not+Found")}
                    />
                    {car.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                            {car.discount}
                        </div>
                    )}
                </div>

                <div className="md:w-2/3 p-5 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {car.make} {car.makeModel || car.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                            {car.rating && car.reviews ? (
                                <>
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                    {car.rating} ({car.reviews} reviews)
                                </>
                            ) : (
                                <span className="text-xs">No reviews yet</span>
                            )}
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
                            {car.originalPrice && (
                                <p className="text-sm text-gray-400 line-through">
                                    ${car.originalPrice.toFixed(2)}
                                </p>
                            )}
                            <p className="text-2xl font-bold text-blue-600">
                                ${car.discountedPrice.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                                ${car.dailyPrice.toFixed(2)}/day
                            </p>
                        </div>
                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm"
                        >
                            Rent Now!
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Book {car.make} {car.makeModel || car.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowBookingModal(false);
                                    setError(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-2xl transition-all"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {(error || locationsError) && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                                {error || "Failed to load locations. Please try again."}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pick-up Date
                                </label>
                                <input
                                    type="date"
                                    name="pickUpDate"
                                    value={bookingData.pickUpDate}
                                    onChange={handleBookingChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Drop-off Date
                                </label>
                                <input
                                    type="date"
                                    name="dropOffDate"
                                    value={bookingData.dropOffDate}
                                    onChange={handleBookingChange}
                                    min={bookingData.pickUpDate || new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pick-up Location
                                </label>
                                {renderLocationSelect("pickUpLocation")}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Drop-off Location
                                </label>
                                {renderLocationSelect("dropOffLocation")}
                            </div>

                            {bookingData.pickUpDate && bookingData.dropOffDate && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Estimated Total:</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        ${(
                                            (new Date(bookingData.dropOffDate).getTime() -
                                                new Date(bookingData.pickUpDate).getTime()) /
                                            (1000 * 60 * 60 * 24) * car.dailyPrice
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3 pt-6">
                            <button
                                onClick={() => {
                                    setShowBookingModal(false);
                                    setError(null);
                                }}
                                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRentNow}
                                disabled={
                                    !bookingData.pickUpDate ||
                                    !bookingData.dropOffDate ||
                                    !bookingData.pickUpLocation ||
                                    !bookingData.dropOffLocation ||
                                    loading ||
                                    locationsLoading
                                }
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CarCard;