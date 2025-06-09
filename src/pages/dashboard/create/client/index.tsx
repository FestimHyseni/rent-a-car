import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import useFetch from "@/hooks/useFetch";

type AddClientProps = {
  setShowAddModal: (show: boolean) => void;
  handleSaveClient: (client: {
    name: string;
    email: string;
    number: string;
    country: string;
    city: string;
    address: string;
    role: string;
  }) => void;
};

const AddClient: React.FC<AddClientProps> = ({ setShowAddModal, handleSaveClient }) => {
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    number: "",
    country: "",
    city: "",
    address: "",
    role: ""
  });

  const { data: roles, loading: loadingRoles } = useFetch("/api/roles");

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Shto Klient të Ri</h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Emri i plotë"
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Numri i telefonit"
            onChange={(e) => setNewClient({ ...newClient, number: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Shteti"
            onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Qyteti"
            onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Adresa"
            onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <select
            onChange={(e) => setNewClient({ ...newClient, role: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">Zgjidh rolin</option>
            {(Array.isArray(roles) ? roles : []).map((role) => (
              <option key={role._id || role.name} value={role.name}>
                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all"
            >
              Anulo
            </button>
            <button
              onClick={() => handleSaveClient(newClient)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all"
            >
              Ruaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
