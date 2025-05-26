import React, { useState, forwardRef, ReactElement, ElementType } from "react";
import { BadgeCheck, CalendarDays, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"; // Default styles FIRST

// Define props for the CustomDatePickerInput
interface CustomDatePickerInputProps {
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  placeholder?: string;
  icon: ElementType; // lucide-react icons are components (ElementType)
  id?: string;
}

// Custom input component for DatePicker to maintain your styling
const CustomDatePickerInput = forwardRef<
  HTMLButtonElement,
  CustomDatePickerInputProps
>(({ value, onClick, placeholder, icon: IconComponent, id }, ref) => (
  <button
    id={id}
    type="button"
    className="flex items-center w-full border border-gray-300 px-3 py-2 rounded-lg text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400 transition-colors"
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

const Hero: React.FC = () => {
  const [pickUpLocation, setPickUpLocation] = useState<string>("New York, USA");
  const [dropOffLocation, setDropOffLocation] =
    useState<string>("Delaware, USA");
  const [pickUpDate, setPickUpDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handlePickUpDateChange = (date: Date | null) => {
    if (date) {
      const now = new Date();
      // Check if the date part is today and time is midnight (common default for date-only selection)
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate() &&
        date.getHours() === 0 &&
        date.getMinutes() === 0
      ) {
        const nextHour = new Date();
        nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Set to current hour + 1, minutes to 0
        setPickUpDate(nextHour);
      } else {
        setPickUpDate(date);
      }

      if (returnDate && date >= returnDate) {
        setReturnDate(null); // Or set to a date after pickUpDate
      }
    } else {
      setPickUpDate(null);
    }
  };

  const handleReturnDateChange = (date: Date | null) => {
    setReturnDate(date);
  };

  const handlePickUpLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPickUpLocation(event.target.value);
  };

  const handleDropOffLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDropOffLocation(event.target.value);
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative text-left px-6 max-w-4xl">
        <p className="text-green-400 font-semibold text-sm mb-2">
          Find Your Perfect Car
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Looking for a vehicle?
          <br />
          You're in the perfect spot.
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-white">
          <span className="flex items-center gap-2">
            <BadgeCheck size={20} className="text-green-400" /> High quality at
            a low cost.
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck size={20} className="text-green-400" /> Premium services
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck size={20} className="text-green-400" /> 24/7 roadside
            support.
          </span>
        </div>
      </div>

      {/* Search Box */}
      <div className="absolute bottom-[-4rem] left-1/2 transform -translate-x-1/2 w-full max-w-5xl xl:max-w-6xl px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-6">
          <div className="flex gap-2 mb-6">
            <button className="bg-green-500 text-white rounded-full px-6 py-2 text-sm font-medium shadow-md hover:bg-green-600 transition-colors">
              All Cars
            </button>
            <button className="text-gray-600 hover:text-green-500 rounded-full px-6 py-2 text-sm font-medium hover:bg-green-50 transition-colors">
              New Cars
            </button>
            <button className="text-gray-600 hover:text-green-500 rounded-full px-6 py-2 text-sm font-medium hover:bg-green-50 transition-colors">
              Used Cars
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Pick Up Location */}
            <div className="lg:col-span-1">
              <label
                htmlFor="pickup-location"
                className="text-xs font-semibold mb-1 block text-gray-600"
              >
                Pick Up Location
              </label>
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-lg bg-white hover:border-gray-400 transition-colors">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  id="pickup-location"
                  value={pickUpLocation}
                  onChange={handlePickUpLocationChange}
                  placeholder="City, State or Airport"
                  className="w-full bg-transparent text-sm text-gray-700 focus:outline-none truncate"
                />
              </div>
            </div>

            {/* Drop Off Location */}
            <div className="lg:col-span-1">
              <label
                htmlFor="dropoff-location"
                className="text-xs font-semibold mb-1 block text-gray-600"
              >
                Drop Off Location
              </label>
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-lg bg-white hover:border-gray-400 transition-colors">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  id="dropoff-location"
                  value={dropOffLocation}
                  onChange={handleDropOffLocationChange}
                  placeholder="City, State or Airport"
                  className="w-full bg-transparent text-sm text-gray-700 focus:outline-none truncate"
                />
              </div>
            </div>

            {/* Pick Up Date & Time */}
            <div className="lg:col-span-1">
              <label
                htmlFor="pickup-date"
                className="text-xs font-semibold mb-1 block text-gray-600"
              >
                Pick Up Date & Time
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
                    id="pickup-date"
                    icon={CalendarDays}
                    placeholder="Pick-up date & time"
                  />
                }
                popperPlacement="bottom-start"
                // calendarClassName="font-sans"
                timeIntervals={15}
              />
            </div>

            {/* Return Date & Time */}
            <div className="lg:col-span-1">
              <label
                htmlFor="return-date"
                className="text-xs font-semibold mb-1 block text-gray-600"
              >
                Return Date & Time
              </label>
              <DatePicker
                selected={returnDate}
                onChange={handleReturnDateChange}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText="Select date & time"
                minDate={pickUpDate || new Date()}
                disabled={!pickUpDate}
                customInput={
                  <CustomDatePickerInput
                    id="return-date"
                    icon={CalendarDays}
                    placeholder="Return date & time"
                  />
                }
                popperPlacement="bottom-start"
                calendarClassName="font-sans"
                timeIntervals={15}
              />
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1">
              <button className="w-full bg-green-500 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm">
                Find a Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
