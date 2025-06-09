import React from "react";
import { X, Mail, Phone, MapPin, Crown, Calendar } from "lucide-react";

type DetailsClientProps = {
  client: {
    name: string;
    email: string;
    number?: string;
    address?: string;
    city?: string;
    country?: string;
    role?: string;
    createdAt: string | Date;
  } | null;
  setShowDetailsModal: (show: boolean) => void;
};

const DetailsClient: React.FC<DetailsClientProps> = ({ client, setShowDetailsModal }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Detajet e Klientit</h3>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="p-2 hover:bg-gray-100 rounded-2xl"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <div>
            <span className="font-semibold">Emri:</span> {client.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {client.email}
          </div>
          <div>
            <span className="font-semibold">Telefoni:</span> {client.number || "-"}
          </div>
          <div>
            <span className="font-semibold">Adresa:</span> {client.address || "-"}
          </div>
          <div>
            <span className="font-semibold">Qyteti:</span> {client.city || "-"}
          </div>
          <div>
            <span className="font-semibold">Shteti:</span> {client.country || "-"}
          </div>
          <div>
            <span className="font-semibold">Roli:</span> {client.role || "-"}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(client.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsClient;
