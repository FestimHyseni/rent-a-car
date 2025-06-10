import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Save,
  X,
  Shield,
  Calendar,
  Camera
} from "lucide-react";

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    country: "",
    city: "",
    address: "",
    image: ""
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Load user data when session is available
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        number: session.user.number || "",
        country: session.user.country || "",
        city: session.user.city || "",
        address: session.user.address || "",
        image: session.user.image || ""
      });
    }
  }, [session]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            ...formData
          }
        });
        
        setMessage({ type: "success", text: "Profili u përditësua me sukses!" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: data.message || "Gabim gjatë përditësimit" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Gabim në server. Provoni përsëri." });
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData for file upload
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setLoading(true);
      const response = await fetch("/api/user/upload-image", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          image: data.imageUrl
        }));
        setMessage({ type: "success", text: "Fotoja u ngarkua me sukses!" });
      } else {
        setMessage({ type: "error", text: data.message || "Gabim gjatë ngarkimit të fotos" });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ type: "error", text: "Gabim gjatë ngarkimit të fotos" });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="bg-slate-700/50 h-12 w-12 rounded-full"></div>
          <div className="space-y-2">
            <div className="bg-slate-700/50 h-4 w-32 rounded"></div>
            <div className="bg-slate-700/50 h-3 w-24 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profili Im</h1>
          <p className="text-slate-400">Menaxhoni informacionet tuaja personale</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-900/50 border border-green-500/50 text-green-300' 
              : 'bg-red-900/50 border border-red-500/50 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative mb-4 inline-block">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-green-500/50 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-green-500/50 bg-slate-700 flex items-center justify-center">
                      <UserCircle size={40} className="text-slate-400" />
                    </div>
                  )}
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 p-2 rounded-full cursor-pointer transition-colors">
                      <Camera size={16} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-white mb-1">
                  {formData.name || "Përdorues"}
                </h2>
                <p className="text-slate-400 text-sm mb-4">{formData.email}</p>
                
                {/* Role Badge */}
                <div className="inline-flex items-center gap-1 bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
                  <Shield size={14} />
                  {session.user.role === 'admin' ? 'Administrator' : 'Përdorues'}
                </div>

                {/* Created Date */}
                {session.user.createdAt && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} />
                    Anëtar që nga {new Date(session.user.createdAt).toLocaleDateString('sq-AL')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Informacione Personale</h3>
                <button
                  onClick={() => {
                    if (isEditing) {
                      // Reset form data if canceling edit
                      setFormData({
                        name: session.user.name || "",
                        email: session.user.email || "",
                        number: session.user.number || "",
                        country: session.user.country || "",
                        city: session.user.city || "",
                        address: session.user.address || "",
                        image: session.user.image || ""
                      });
                      setMessage({ type: "", text: "" });
                    }
                    setIsEditing(!isEditing);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isEditing 
                      ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  disabled={loading}
                >
                  {isEditing ? <X size={16} /> : <Edit size={16} />}
                  {isEditing ? 'Anulo' : 'Ndrysho'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Emri i plotë
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          isEditing 
                            ? 'border-slate-600 hover:border-slate-500' 
                            : 'border-slate-700 cursor-not-allowed'
                        }`}
                        placeholder="Shkruani emrin tuaj"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true} // Email usually shouldn't be editable
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-700 bg-slate-700/30 text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Numri i telefonit
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          isEditing 
                            ? 'border-slate-600 hover:border-slate-500' 
                            : 'border-slate-700 cursor-not-allowed'
                        }`}
                        placeholder="Numri i telefonit"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Shteti
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          isEditing 
                            ? 'border-slate-600 hover:border-slate-500' 
                            : 'border-slate-700 cursor-not-allowed'
                        }`}
                        placeholder="Shteti"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Qyteti
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          isEditing 
                            ? 'border-slate-600 hover:border-slate-500' 
                            : 'border-slate-700 cursor-not-allowed'
                        }`}
                        placeholder="Qyteti"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Adresa
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${
                          isEditing 
                            ? 'border-slate-600 hover:border-slate-500' 
                            : 'border-slate-700 cursor-not-allowed'
                        }`}
                        placeholder="Adresa e plotë"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      {loading ? 'Po ruhet...' : 'Ruaj ndryshimet'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;