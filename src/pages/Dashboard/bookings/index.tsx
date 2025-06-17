// pages/bookings/BookingManagement.tsx
import React, { useState, forwardRef, ElementType } from "react";
import {
    Calendar,
    MapPin,
    Plus,
    X,
    CheckCircle2,
    Clock,
    Trash2
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import useFetch from "@/hooks/useFetch";
import { LocationType } from "@/types/carTypes";
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

const BookingManagement = () => {
    const { data: bookings } = useFetch<any[]>("/api/bookings");
    const { data: cars } = useFetch<any[]>("/api/cars");
    const { data: users } = useFetch<any[]>("/api/users");
    const { data: locations } = useFetch<any[]>("/api/locations");
    const { postData } = useFetch("/api/bookings");

    const [activeTab, setActiveTab] = useState("bookings");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newBooking, setNewBooking] = useState({
        carId: "",
        userId: "",
        pickUpLocation: "",
        dropOffLocation: "",
        pickUpDate: "",
        dropOffDate: "",
        totalPrice: 0,
    });

    // Round date to nearest hour
    const roundToHour = (date: Date): Date => {
        const rounded = new Date(date);
        rounded.setMinutes(0, 0, 0);
        return rounded;
    };

    const handlePickUpDateChange = (date: Date | null) => {
        if (date) {
            const roundedDate = roundToHour(date);
            setNewBooking({
                ...newBooking,
                pickUpDate: roundedDate.toISOString()
            });
        }
    };

    const handleDropOffDateChange = (date: Date | null) => {
        if (date) {
            const roundedDate = roundToHour(date);
            setNewBooking({
                ...newBooking,
                dropOffDate: roundedDate.toISOString()
            });
        }
    };

    const handleNewBookingChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setNewBooking({ ...newBooking, [name]: value });
    };

    const handleSaveBooking = async () => {
        try {
            await postData(newBooking);
            setShowAddModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Failed to save booking", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
            <div className="max-w-[82rem] mx-auto">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isLoaded={isLoaded}
                />

                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Calendar className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Menaxhimi i Rezervimeve
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Shfleto dhe menaxho të gjitha rezervimet e klientëve
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Shto Rezervim</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookings?.map((b) => {
                        const car = cars?.find((c) => c._id === b.carId);
                        const user = users?.find((u) => u._id === b.userId);

                        // Get locations from booking data
                        const pickupLocation = b.pickupLocation as LocationType;
                        const dropoffLocation = b.dropoffLocation as LocationType;

                        const isConfirmed = b.status === "Confirmed";
                        const StatusIcon = isConfirmed ? CheckCircle2 : Clock; // Fixed variable name
                        const statusLabel = isConfirmed ? "Konfirmuar" : "Në pritje";
                        const statusColor = isConfirmed ? "text-green-600" : "text-yellow-600";

                        return (
                            <div
                                key={b._id}
                                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {user?.name} - {car?.make} {car?.makeModel}
                                    </h3>
                                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {pickupLocation?.city}, {pickupLocation?.address} →{" "}
                                            {dropoffLocation?.city}, {dropoffLocation?.address}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 text-sm flex items-center space-x-2 mt-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(b.pickUpDate).toLocaleString()} -{" "}
                                            {new Date(b.dropOffDate).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-lg font-bold text-gray-800">
                                        €{b.totalPrice.toFixed(2)}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        {/* Fixed component name */}
                                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                                        <span className={`text-sm ${statusColor}`}>{statusLabel}</span>
                                        <button className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Shto Rezervim</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-2xl transition-all"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <select
                                    name="carId"
                                    value={newBooking.carId}
                                    onChange={handleNewBookingChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                                >
                                    <option value="">Zgjidh Makinen</option>
                                    {cars?.map((car) => (
                                        <option key={car._id} value={car._id}>
                                            {car.make} {car.makeModel}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="userId"
                                    value={newBooking.userId}
                                    onChange={handleNewBookingChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                                >
                                    <option value="">Zgjidh Përdoruesin</option>
                                    {users?.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} {user.lastName}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="pickUpLocation"
                                    value={newBooking.pickUpLocation}
                                    onChange={handleNewBookingChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                                >
                                    <option value="">Lokacioni i marrjes</option>
                                    {locations?.map((l) => (
                                        <option key={l._id} value={l._id}>
                                            {l.city}, {l.address}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="dropOffLocation"
                                    value={newBooking.dropOffLocation}
                                    onChange={handleNewBookingChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                                >
                                    <option value="">Lokacioni i kthimit</option>
                                    {locations?.map((l) => (
                                        <option key={l._id} value={l._id}>
                                            {l.city}, {l.address}
                                        </option>
                                    ))}
                                </select>

                                {/* Pick-up Date & Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pick-up Date & Time
                                    </label>
                                    <DatePicker
                                        selected={newBooking.pickUpDate ? new Date(newBooking.pickUpDate) : null}
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
                                        timeIntervals={60}
                                    />
                                </div>

                                {/* Drop-off Date & Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Drop-off Date & Time
                                    </label>
                                    <DatePicker
                                        selected={newBooking.dropOffDate ? new Date(newBooking.dropOffDate) : null}
                                        onChange={handleDropOffDateChange}
                                        showTimeSelect
                                        dateFormat="MMM d, yyyy h:mm aa"
                                        placeholderText="Select date & time"
                                        minDate={newBooking.pickUpDate ? new Date(newBooking.pickUpDate) : new Date()}
                                        customInput={
                                            <CustomDatePickerInput
                                                icon={CalendarDays}
                                                placeholder="Drop-off date & time"
                                            />
                                        }
                                        timeIntervals={60}
                                    />
                                </div>

                                <input
                                    type="number"
                                    name="totalPrice"
                                    value={newBooking.totalPrice}
                                    onChange={handleNewBookingChange}
                                    placeholder="Çmimi total (€)"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                                />
                            </div>
                            <div className="flex space-x-3 pt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50"
                                >
                                    Anulo
                                </button>
                                <button
                                    onClick={handleSaveBooking}
                                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg"
                                >
                                    Ruaj Rezervimin
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingManagement;