import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Camera,
  Edit2,
  Save,
  X,
  ArrowLeft,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ENDPOINTS, STORAGE_KEYS } from "../../../constants/constants";
import type { User } from "../../../constants/constants";
import { Shield, Bell, Lock } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ProfilePage = () => {
  // Add new state for animations and feedback
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  // -- OLD STATE (REMOVED) --
  // const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // -- OLD STATE (REMOVED) --
  // const [showMissingFields, setShowMissingFields] = useState(false);
  const navigate = useNavigate();

  // ++ NEW CODE: Simplified editForm state ++
  const [editForm, setEditForm] = useState({
    fullName: "",
  });

  // -- OLD CODE --
  /*
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  */

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // ++ NEW CODE: Update simplified edit form ++
        setEditForm({
          fullName: parsedUser?.fullName || "",
        });

        // -- OLD CODE --
        /*
        setEditForm({
          fullName: parsedUser?.fullName || "",
          phone: parsedUser?.phone || "",
          address: {
            street: parsedUser?.address?.street || "",
            city: parsedUser?.address?.city || "",
            state: parsedUser?.address?.state || "",
            zipCode: parsedUser?.address?.zipCode || "",
            country: parsedUser?.address?.country || "",
          },
        });

        // Check for missing fields
        const hasMissingFields =
          !parsedUser?.phone ||
          !parsedUser?.address?.street ||
          !parsedUser?.address?.city ||
          !parsedUser?.address?.country;
        setShowMissingFields(hasMissingFields);
        */
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // ++ NEW CODE: Updated logic for missing fields ++
  const getMissingFields = () => {
    const missing = [];
    if (!user?.phoneVerified) missing.push("Verified Phone Number");
    if (!user?.location?.address) missing.push("Address (from location)");
    return missing;
  };

  // -- OLD CODE --
  /*
  const getMissingFields = () => {
    const missing = [];
    if (!user?.phone) missing.push("Phone Number");
    if (!user?.address?.street) missing.push("Street Address");
    if (!user?.address?.city) missing.push("City");
    if (!user?.address?.country) missing.push("Country");
    return missing;
  };
  */

  // ++ NEW CODE: Updated logic for completion percentage ++
  const getCompletionPercentage = () => {
    if (!user) return 0;
    const fields = [
      user.fullName,
      user.email,
      user.phoneVerified,
      user.location?.address,
      user.profilePicture?.url,
    ];
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // -- OLD CODE --
  /*
  const getCompletionPercentage = () => {
    const fields = [
      user?.fullName,
      user?.email,
      user?.phone,
      user?.address?.street,
      user?.address?.city,
      user?.address?.state,
      user?.address?.zipCode,
      user?.address?.country,
      user?.profilePicture?.url,
    ];
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };
  */

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await fetch(API_ENDPOINTS.USER.UPLOAD_AVATAR, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success && user) {
        const updatedUser = {
          ...user,
          profilePicture: data.profilePicture,
        };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaveStatus("saving");
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await fetch(API_ENDPOINTS.USER.UPDATE_PROFILE, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // ++ NEW CODE: Simplified body for the request ++
        body: JSON.stringify({ fullName: editForm.fullName }),
      });
      // -- OLD CODE --
      // body: JSON.stringify(editForm),

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        setIsEditing(false);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);

        // -- OLD CODE (REMOVED) --
        /*
        // Recheck missing fields
        const hasMissingFields =
          !data.user?.phone ||
          !data.user?.address?.street ||
          !data.user?.address?.city ||
          !data.user?.address?.country;
        setShowMissingFields(hasMissingFields);
        */
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate("/auth");
  };

  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* ... Sign in required component ... */}
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();
  const missingFields = getMissingFields();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-10 bg-gradient-to-b from-gray-900/95 to-gray-900/85 backdrop-blur-sm border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBackToDashboard}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader className="relative pb-0">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <CardTitle className="text-2xl font-bold text-white">
                    {user.fullName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-gray-400 hover:text-white"
                  >
                    {isEditing ? (
                      <>
                        <X size={16} className="mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 size={16} className="mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {/* ... Stats Grid ... */}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg flex items-center">
                        <UserIcon size={20} className="mr-2 text-purple-400" />
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="fullName"
                            className="text-gray-300 text-sm font-medium"
                          >
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            value={editForm.fullName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fullName: e.target.value,
                              })
                            }
                            className="bg-gray-800/50 border-gray-600 text-white mt-2 focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-gray-300 text-sm font-medium"
                          >
                            Email Address
                          </Label>
                          <div className="relative mt-2">
                            <Mail
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <Input
                              id="email"
                              value={user.email}
                              disabled
                              className="bg-gray-700/30 border-gray-600 text-gray-400 pl-10"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Email cannot be changed
                          </p>
                        </div>

                        {/* ++ NEW CODE: Phone input is now disabled ++ */}
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-gray-300 text-sm font-medium"
                          >
                            Phone Number
                          </Label>
                          <div className="relative mt-2">
                            <Phone
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <Input
                              id="phone"
                              value={user.phone || ""}
                              disabled
                              className="bg-gray-700/30 border-gray-600 text-gray-400 pl-10"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Phone number is verified and cannot be changed here.
                          </p>
                        </div>
                        {/* -- OLD CODE --
                        <div>
                          <Label htmlFor="phone" className="text-gray-300 text-sm font-medium">Phone Number{" "}{!editForm.phone && (<span className="text-amber-400">*</span>)}</Label>
                          <div className="relative mt-2">
                            <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <Input id="phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="bg-gray-800/50 border-gray-600 text-white pl-10 focus:border-purple-500 focus:ring-purple-500/20" placeholder="Enter your phone number"/>
                          </div>
                        </div>
                        */}
                      </div>
                    </div>

                    {/* ++ NEW CODE: Address section is a non-editable info block ++ */}
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg flex items-center">
                        <MapPin size={20} className="mr-2 text-purple-400" />
                        Address Information
                      </h3>
                      <div className="p-4 bg-gray-800/30 rounded-lg border border-purple-500/30">
                        <p className="text-sm text-purple-300">
                          Your address is automatically updated from your
                          location.
                        </p>
                        <p className="text-white mt-2 text-sm">
                          {user.location?.address || "No address detected."}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Update your location on the dashboard to refresh your
                          address.
                        </p>
                      </div>
                    </div>
                    {/* -- OLD CODE --
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg flex items-center"><MapPin size={20} className="mr-2 text-purple-400" />Address Information</h3>
                      <div className="space-y-4">
                        <Input value={editForm.address.street} ... />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input value={editForm.address.city} ... />
                          <Input value={editForm.address.state} ... />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input value={editForm.address.zipCode} ... />
                          <Input value={editForm.address.country} ... />
                        </div>
                      </div>
                    </div>
                    */}

                    <div className="pt-6">
                      <Button
                        onClick={handleUpdateProfile}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-semibold"
                      >
                        <Save size={20} className="mr-2" /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* ... Contact Information (unchanged) ... */}
                    </div>

                    {/* ++ NEW CODE: Display address from user.location.address ++ */}
                    {user.location?.address ? (
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg flex items-center">
                          <MapPin size={20} className="mr-2 text-purple-400" />
                          Address
                        </h3>
                        <div className="p-4 bg-gray-800/30 rounded-lg space-y-1">
                          <p className="text-white">{user.location.address}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg flex items-center">
                          <MapPin size={20} className="mr-2 text-purple-400" />
                          Address
                        </h3>
                        <div className="p-4 bg-gray-800/30 rounded-lg border border-amber-500/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle size={18} className="text-amber-400" />
                            <p className="text-sm text-amber-400">
                              Address not set
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Enable location on the dashboard to set your
                            address.
                          </p>
                        </div>
                      </div>
                    )}
                    {/* -- OLD CODE --
                    {user.address?.street || user.address?.city || user.address?.country ? (
                      <div className="space-y-4"> ... </div>
                    ) : (
                      <div className="space-y-4"> ... </div>
                    )}
                    */}

                    <div className="space-y-4">
                      {/* ... Account Information section (unchanged) ... */}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Profile Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Completion</span>
                    <span className="text-white font-medium">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  {missingFields.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-amber-400 mb-2">
                        Missing Information:
                      </p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {missingFields.map((field) => (
                          <li key={field} className="flex items-center">
                            <AlertCircle
                              size={12}
                              className="mr-2 text-amber-400"
                            />
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Change Password", icon: Lock },
                  { label: "Notification Settings", icon: Bell },
                  { label: "Privacy Settings", icon: Shield },
                ].map((action) => (
                  <Button
                    key={action.label}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    <action.icon size={16} className="mr-2" />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
