import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Phone,
  MapPin,
  Globe,
  Edit,
  Save,
  X,
  Shield,
  Calendar,
  Camera,
  UserCircle,
  Mail,
} from "lucide-react";
import { useRouter } from "next/router";

// Extend the session user type to include additional fields
type ExtendedUser = {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  number?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  createdAt?: string | null;
};

// A list of countries for the dropdown
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const user = session?.user as ExtendedUser | undefined;
  const [role, setRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {}, [user]);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    number: string;
    country: string;
    city: string;
    address: string;
    image: string;
  }>({
    name: "",
    email: "",
    number: "",
    country: "",
    city: "",
    address: "",
    image: "",
  });

  // Load user data when session is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        number: user.number || "",
        country: user.country || "",
        city: user.city || "",
        address: user.address || "",
        image: user.image || "",
      });
      const fetchUserRole = async () => {
        if (user?.role) {
          try {
            const fetchRole = await fetch(`/api/roles/${user.role}`);
            const data = await fetchRole.json();
            console.log(data);

            setRole(data.name);
          } catch (error) {
            setRole(user.role);
          }
        }
      };
      fetchUserRole();
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (!user) {
        setMessage({ type: "error", text: "Nuk u gjet përdoruesi." });
        setLoading(false);
        return;
      }
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id, ...formData }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            ...formData,
          },
        });

        setMessage({
          type: "success",
          text: "Profili u përditësua me sukses!",
        });
        setIsEditing(false);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gabim gjatë përditësimit",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Gabim në server. Provoni përsëri." });
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Create FormData for file upload
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setLoading(true);
      const response = await fetch("/user/upload-image", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          image: data.imageUrl,
        }));
        setMessage({ type: "success", text: "Fotoja u ngarkua me sukses!" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gabim gjatë ngarkimit të fotos",
        });
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
          <p className="text-slate-400">
            Menaxhoni informacionet tuaja personale
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/50 border border-green-500/50 text-green-300"
                : "bg-red-900/50 border border-red-500/50 text-red-300"
            }`}
          >
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
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={loading}
                      />
                    </label>
                  )}
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <div className="inline-flex items-center gap-1 bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
                    <Shield size={14} />
                    {role === "admin" ? "Administrator" : "Përdorues"}
                  </div>
                  {/* Created Date */}
                  {user?.createdAt && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                      <Calendar size={14} />
                      Anëtar që nga{" "}
                      {new Date(user.createdAt).toLocaleDateString("sq-AL")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Informacione Personale
                </h3>
                <button
                  onClick={() => {
                    if (isEditing && user) {
                      // Reset form data if canceling edit
                      setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        number: user.number || "",
                        country: user.country || "",
                        city: user.city || "",
                        address: user.address || "",
                        image: user.image || "",
                      });
                      setMessage({ type: "", text: "" });
                    }
                    setIsEditing(!isEditing);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isEditing
                      ? "bg-slate-600 hover:bg-slate-700 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                  disabled={loading}
                >
                  {isEditing ? <X size={16} /> : <Edit size={16} />}
                  {isEditing ? "Anulo" : "Ndrysho"}
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
                      <UserCircle
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          isEditing
                            ? "border-slate-600 hover:border-slate-500"
                            : "border-slate-700 cursor-not-allowed"
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
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        size={18}
                      />
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
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="tel"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          isEditing
                            ? "border-slate-600 hover:border-slate-500"
                            : "border-slate-700 cursor-not-allowed"
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
                      <Globe
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <select
                        name="country"
                        value={
                          isEditing ? formData.country : user?.country ?? ""
                        }
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
                          isEditing
                            ? "border-slate-600 hover:border-slate-500"
                            : "border-slate-700 cursor-not-allowed"
                        }`}
                      >
                        <option value="" disabled>
                          Zgjidhni shtetin
                        </option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Qyteti
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          isEditing
                            ? "border-slate-600 hover:border-slate-500"
                            : "border-slate-700 cursor-not-allowed"
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
                      <MapPin
                        className="absolute left-3 top-3 text-slate-400"
                        size={18}
                      />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${
                          isEditing
                            ? "border-slate-600 hover:border-slate-500"
                            : "border-slate-700 cursor-not-allowed"
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
                      {loading ? "Po ruhet..." : "Ruaj ndryshimet"}
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
