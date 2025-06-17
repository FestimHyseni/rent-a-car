import { Zap, Fuel, Settings, Users, Star, X, MapPin } from "lucide-react";
import React, { useState, forwardRef, ElementType, useEffect } from "react";
import { CarType } from "@/types/carTypes";
import { useSession } from "next-auth/react";
import useFetch from "@/hooks/useFetch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

// Custom input component for DatePicker
const CustomDatePickerInput = forwardRef<
  HTMLButtonElement,
  {
    value?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    placeholder?: string;
    icon: ElementType;
    id?: string;
  }
>(({ value, onClick, placeholder, icon: IconComponent, id }, ref) => (
  <button
    id={id}
    type="button"
    className="flex items-center w-full border border-gray-300 px-4 py-3 rounded-2xl text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
    onClick={onClick}
    ref={ref}
  >
    <IconComponent className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
    {value ? (
      <span className="truncate">{value}</span>
    ) : (
      <span className="text-gray-400 truncate">{placeholder}</span>
    )}
  </button>
));
CustomDatePickerInput.displayName = "CustomDatePickerInput";

const CarCard = ({ car }: { car: CarType }) => {
  const { data: session } = useSession();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pickUpDate, setPickUpDate] = useState<Date | null>(null);
  const [dropOffDate, setDropOffDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { postData } = useFetch("/api/bookings");

  // Round date to nearest hour and set minutes to 0
  const roundToHour = (date: Date): Date => {
    const rounded = new Date(date);
    rounded.setMinutes(0, 0, 0);
    return rounded;
  };

  const handlePickUpDateChange = (date: Date | null) => {
    if (date) {
      const now = new Date();
      const roundedDate = roundToHour(date);

      // Adjust to next hour if selecting current date with past time
      if (roundedDate.getTime() < now.getTime()) {
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);
        setPickUpDate(nextHour);
      } else {
        setPickUpDate(roundedDate);
      }

      // Reset drop-off if invalid
      if (dropOffDate && roundedDate > dropOffDate) {
        setDropOffDate(null);
      }
    } else {
      setPickUpDate(null);
    }
  };

  const handleDropOffDateChange = (date: Date | null) => {
    if (date) {
      setDropOffDate(roundToHour(date));
    } else {
      setDropOffDate(null);
    }
  };

  // Function to check car availability
  const checkAvailability = async () => {
    if (!pickUpDate || !dropOffDate) {
      setIsAvailable(null);
      return;
    }

    try {
      setIsCheckingAvailability(true);
      setError(null);

      const response = await fetch("/api/cars/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          pickUpDate: pickUpDate.toISOString(),
          dropOffDate: dropOffDate.toISOString(),
        }),
      });

      const data = await response.json();
      setIsAvailable(data.available);

      if (!data.available) {
        setError("Car is not available for the selected dates. Please choose different dates.");
      }
    } catch (err) {
      console.error("Availability check failed:", err);
      setError("Failed to check availability. Please try again.");
      setIsAvailable(null);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Check availability when dates change
  useEffect(() => {
    if (pickUpDate && dropOffDate) {
      checkAvailability();
    } else {
      setIsAvailable(null);
    }
  }, [pickUpDate, dropOffDate]);

  // Check availability when modal opens
  useEffect(() => {
    if (showBookingModal && pickUpDate && dropOffDate) {
      checkAvailability();
    }
  }, [showBookingModal]);

  const handleRentNow = async () => {
    if (!session?.user?.id) {
      setError("Please sign in to make a booking");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!pickUpDate || !dropOffDate) {
        setError("Please select both pick-up and drop-off dates");
        return;
      }

      if (dropOffDate <= pickUpDate) {
        setError("Drop-off date must be after pick-up date");
        return;
      }

      // Recheck availability before final submission
      const response = await fetch("/api/cars/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          pickUpDate: pickUpDate.toISOString(),
          dropOffDate: dropOffDate.toISOString(),
        }),
      });

      const data = await response.json();
      if (!data.available) {
        setError("Car is no longer available for the selected dates. Please choose different dates.");
        return;
      }

      // Calculate total price based on time difference
      const totalHours = (dropOffDate.getTime() - pickUpDate.getTime()) / (1000 * 60 * 60);
      const totalDays = Math.ceil(totalHours / 24);
      const totalPrice = totalDays * car.dailyPrice;

      await postData({
        carId: car.id,
        userId: session.user.id,
        pickUpLocation: car.pickUpLocation._id,
        dropOffLocation: car.dropOffLocation._id,
        pickUpDate: pickUpDate.toISOString(),
        dropOffDate: dropOffDate.toISOString(),
        totalPrice: totalPrice.toFixed(2),
      });

      setShowBookingModal(false);
      alert(
        `Booking confirmed for ${car.name}! Total: $${totalPrice.toFixed(2)}`
      );
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row mb-6 hover:shadow-xl transition-shadow duration-300">
        <div className="md:w-1/3 relative">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-56 md:h-full object-cover"
            onError={(e) =>
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
              {car.features &&
                car.features.map((feature: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1.5 text-sm text-gray-600"
                  >
                    <span>{feature}</span>
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
                  setIsAvailable(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Pick-up Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pick-up Date & Time
                </label>
                <DatePicker
                  selected={pickUpDate}
                  onChange={handlePickUpDateChange}
                  showTimeSelect
                  dateFormat="MMM d, yyyy h:mm aa"
                  placeholderText="Select date & time"
                  minDate={new Date()}
                  customInput={
                    <CustomDatePickerInput
                      icon={CalendarDays}
                      placeholder="Pick-up date & time"
                    />
                  }
                  timeIntervals={60} // Hourly intervals
                />
              </div>

              {/* Drop-off Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop-off Date & Time
                </label>
                <DatePicker
                  selected={dropOffDate}
                  onChange={handleDropOffDateChange}
                  showTimeSelect
                  dateFormat="MMM d, yyyy h:mm aa"
                  placeholderText="Select date & time"
                  minDate={pickUpDate || new Date()}
                  customInput={
                    <CustomDatePickerInput
                      icon={CalendarDays}
                      placeholder="Drop-off date & time"
                    />
                  }
                  timeIntervals={60} // Hourly intervals
                />
              </div>

              {/* Availability indicator */}
              {pickUpDate && dropOffDate && (
                <div className="mt-2">
                  {isCheckingAvailability ? (
                    <div className="flex items-center text-blue-600">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Checking availability...
                    </div>
                  ) : isAvailable !== null && (
                    <div className={`p-3 rounded-lg ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                      {isAvailable ? (
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Car is available for these dates!
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Car is not available for these dates
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pick-up Location
                </label>
                <div className="flex items-center border border-gray-200 px-4 py-3 rounded-2xl">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  {car.pickUpLocation.city}, {car.pickUpLocation.address}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop-off Location
                </label>
                <div className="flex items-center border border-gray-200 px-4 py-3 rounded-2xl">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  {car.dropOffLocation.city}, {car.dropOffLocation.address}
                </div>
              </div>

              {pickUpDate && dropOffDate && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Estimated Total:</p>
                  <p className="text-xl font-bold text-blue-600">
                    $
                    {(
                      Math.ceil(
                        (dropOffDate.getTime() - pickUpDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                      ) * car.dailyPrice
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
                  setIsAvailable(null);
                }}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRentNow}
                disabled={!pickUpDate || !dropOffDate || loading || isAvailable === false}
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