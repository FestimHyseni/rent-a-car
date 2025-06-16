import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import useFetch from "@/hooks/useFetch";

type UpdateClientProps = {
  client: any;
  setShowUpdateModal: (val: boolean) => void;
};

const UpdateClient: React.FC<UpdateClientProps> = ({ client, setShowUpdateModal }) => {
  const [formData, setFormData] = useState(client);
  const { putData } = useFetch("/api/users");
  const { data: roles } = useFetch("/api/roles");

  useEffect(() => {
    setFormData(client);
  }, [client]);

const handleUpdate = async () => {
  try {
    const { _id, ...dataToSend } = formData;
    await putData({ id: client._id, ...dataToSend });
    setShowUpdateModal(false);
    window.location.reload();
  } catch (error) {
    console.error("Error updating user:", error);
  }
};


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Përditëso Klientin</h3>
          <button
            onClick={() => setShowUpdateModal(false)}
            className="p-2 hover:bg-gray-100 rounded-2xl"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Input fushat e zakonshme */}
          {["name", "email", "number", "country", "city", "address"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={formData[field] || ""}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
            />
          ))}

          {/* Dropdown për rolet */}
          {Array.isArray(roles) && roles.length > 0 ? (
            <select
              value={formData.role || ""}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
            >
              <option value="" disabled>
                Zgjidh rolin
              </option>
              {roles.map((role: any) => (
                <option key={role._id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-500">Duke ngarkuar rolet...</p>
          )}

          {/* Butonat */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl"
            >
              Anulo
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 py-3 bg-blue-600 text-white rounded-2xl"
            >
              Ruaj Ndryshimet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateClient;
