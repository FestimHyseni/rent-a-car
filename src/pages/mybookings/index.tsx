// pages/mybookings/index.tsx
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Calendar,
    MapPin,
    CheckCircle2,
    Clock,
    XCircle,
    Car,
    ChevronRight,
    CreditCard,
    Check,
    X
} from "lucide-react";
import Link from "next/link";
import Nav from "../../components/Nav/Index";
import dayjs from "dayjs";

interface Booking {
    _id: string;
    carId?: {  // Changed from 'car' to 'carId' to match API
        _id?: string;
        make?: string;  // This is just the ID in API
        makeModel?: {
            name?: string;
        };
        imageUrl?: string;
    } | null;
    pickUpLocation?: {
        city?: string;
        address?: string;
    } | null;
    dropOffLocation?: {
        city?: string;
        address?: string;
    } | null;
    pickUpDate: string;
    dropOffDate: string;
    totalPrice: number;
    status: "Confirmed" | "Pending" | "Cancelled" | string;
    paymentStatus: "Paid" | "Unpaid" | "Refunded" | string;
    createdAt: string;
}

const MyBookings = () => {
    const { data: session, status } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "authenticated") {
            fetchBookings();
        }
    }, [session, status]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/mybooking");

            if (!res.ok) {
                // Try to get error message from response
                const errorData = await res.json().catch(() => null);
                const errorMsg = errorData?.message || res.statusText;
                throw new Error(`Failed to fetch bookings: ${res.status} ${errorMsg}`);
            }

            const data = await res.json();
            setBookings(data);
        } catch (err: any) {
            setError(err.message || "Failed to load bookings. Please try again later.");
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format("MMM D, YYYY h:mm A");
    };

    const getStatusDetails = (status: string) => {
        switch (status) {
            case "Confirmed":
                return { color: "text-green-600", icon: CheckCircle2, label: "Confirmed" };
            case "Pending":
                return { color: "text-yellow-600", icon: Clock, label: "Pending" };
            case "Cancelled":
                return { color: "text-red-600", icon: XCircle, label: "Cancelled" };
            default:
                return { color: "text-gray-600", icon: Clock, label: status || "Unknown" };
        }
    };

    const getPaymentStatusDetails = (status: string) => {
        switch (status) {
            case "Paid":
                return { color: "text-green-600", icon: Check, label: "Paid" };
            case "Unpaid":
                return { color: "text-yellow-600", icon: Clock, label: "Unpaid" };
            case "Refunded":
                return { color: "text-blue-600", icon: CreditCard, label: "Refunded" };
            default:
                return { color: "text-gray-600", icon: CreditCard, label: status || "Unknown" };
        }
    };

    // Safely get values with fallbacks
    const getValue = (value: any, fallback: any = "") => value || fallback;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* <Nav /> */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
                    <p className="text-gray-600 mt-2">
                        View and manage your rental reservations
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                        <button
                            onClick={fetchBookings}
                            className="ml-2 text-blue-600 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No Bookings Found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You haven't made any bookings yet. Start exploring our cars!
                        </p>
                        <Link
                            href="/search"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                        >
                            Browse Cars
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookings.map((booking) => {
                        // Safe property access with fallbacks
                      const carMake = getValue(booking.carId?.make, "Unknown Car");  // Note: This will still show "Unknown Car" because 'make' is just an ID
                    const carModel = getValue(booking.carId?.makeModel?.name, "");

                        const pickupCity = getValue(booking.pickUpLocation?.city, "Unknown City");
                        const pickupAddress = getValue(booking.pickUpLocation?.address, "Address not available");
                        const dropoffCity = getValue(booking.dropOffLocation?.city, "Unknown City");
                        const dropoffAddress = getValue(booking.dropOffLocation?.address, "Address not available");
                        const status = getValue(booking.status, "Unknown");
                        const paymentStatus = getValue(booking.paymentStatus, "Unknown");

                        const StatusIcon = getStatusDetails(status).icon;
                        const statusColor = getStatusDetails(status).color;
                        const PaymentIcon = getPaymentStatusDetails(paymentStatus).icon;
                        const paymentColor = getPaymentStatusDetails(paymentStatus).color;

                        return (
                            <div
                                key={booking._id}
                                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {/* {carMake} */}
                                         {carModel}
                                    </h3>
                                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {pickupCity}, {pickupAddress} →{" "}
                                            {dropoffCity}, {dropoffAddress}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 text-sm flex items-center space-x-2 mt-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {formatDate(booking.pickUpDate)} -{" "}
                                            {formatDate(booking.dropOffDate)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-lg font-bold text-gray-800">
                                        €{booking.totalPrice.toFixed(2)}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                                        <span className={`text-sm ${statusColor}`}>
                                            {getStatusDetails(status).label}
                                        </span>
                                        <div className="flex items-center ml-2">
                                            <PaymentIcon className={`w-4 h-4 ${paymentColor}`} />
                                            <span className={`text-sm ${paymentColor} ml-1`}>
                                                {getPaymentStatusDetails(paymentStatus).label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;