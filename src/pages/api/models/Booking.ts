export interface IBooking {
    _id?: string;
    carId: string;
    userId: string;
    pickUpLocation: string;
    dropOffLocation: string;
    pickUpDate: string;
    dropOffDate: string;
    totalPrice: number;
    status?: "Pending" | "Confirmed" | "Cancelled" | "Completed";
    paymentStatus?: "Unpaid" | "Paid" | "Refunded";
    createdAt?: string;
}