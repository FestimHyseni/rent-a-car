import React, { useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import useFetch from "@/hooks/useFetch";

const ContactManagement = () => {
  const { data: initialContacts, deleteData } = useFetch<any[]>("/api/contact");
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("contacts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  // Përditësojmë kontaktet kur të dhënat nga useFetch ndryshojnë
  React.useEffect(() => {
    if (initialContacts) {
      setContacts(initialContacts);
    }
  }, [initialContacts]);

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteData(id);
      // Përditësojmë listën lokale duke hequr kontaktin e fshirë
      setContacts(prevContacts => prevContacts.filter(contact => contact._id !== id));
    } catch (error) {
      console.error("Failed to delete contact", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isLoaded={isLoaded}
        />
      </aside>
  
      {/* Main content */}
      <main className="flex-1 px-10 py-6 overflow-x-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Menaxhimi i Kontakteve
              </h1>
              <p className="text-gray-600 mt-1">
                Shfleto dhe menaxho të gjitha mesazhet e klientëve
              </p>
            </div>
          </div>
        </div>
  
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contacts?.map((contact) => {
            const isRead = contact.status === "read";
            const StatusIcon = isRead ? CheckCircle2 : Clock;
            const statusLabel = isRead ? "Lexuar" : "E re";
            const statusColor = isRead ? "text-green-600" : "text-yellow-600";
  
            return (
              <div
                key={contact._id}
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {contact.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                      <span className={`text-xs ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
  
                  <div className="text-gray-500 text-sm flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
  
                  <h4 className="font-medium mt-3 text-gray-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    {contact.subject}
                  </h4>
  
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                    <MessageSquare className="w-4 h-4 inline mr-1 text-gray-400" />
                    <span className="text-gray-600">{contact.message}</span>
                  </div>
                </div>
  
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
  
  
};

export default ContactManagement;