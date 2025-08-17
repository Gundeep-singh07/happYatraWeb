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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showMissingFields, setShowMissingFields] = useState(false);
  const navigate = useNavigate();
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
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
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getMissingFields = () => {
    const missing = [];
    if (!user?.phone) missing.push("Phone Number");
    if (!user?.address?.street) missing.push("Street Address");
    if (!user?.address?.city) missing.push("City");
    if (!user?.address?.country) missing.push("Country");
    return missing;
  };

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
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        setIsEditing(false);
        setSaveStatus("success");

        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000);

        // Recheck missing fields
        const hasMissingFields =
          !data.user?.phone ||
          !data.user?.address?.street ||
          !data.user?.address?.city ||
          !data.user?.address?.country;
        setShowMissingFields(hasMissingFields);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
      // Reset status after 3 seconds
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
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon size={32} className="text-white" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Sign in required
          </h2>
          <p className="text-gray-400 mb-6">
            Please sign in to view your profile
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2"
          >
            Sign In
          </Button>
        </div>
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
      {/* Header with Navigation */}
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

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader className="relative pb-0">
                {/* Progress bar - Keep only this one */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${getCompletionPercentage()}%` }}
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
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    {
                      label: "Member Since",
                      value: new Date(user?.createdAt).getFullYear(),
                    },
                    {
                      label: "Total Trips",
                      value: "0",
                    },
                    {
                      label: "Reviews",
                      value: "0",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-gray-800/50 p-4 rounded-lg text-center"
                    >
                      <p className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Profile Content */}
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Basic Info */}
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

                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-gray-300 text-sm font-medium"
                          >
                            Phone Number{" "}
                            {!editForm.phone && (
                              <span className="text-amber-400">*</span>
                            )}
                          </Label>
                          <div className="relative mt-2">
                            <Phone
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <Input
                              id="phone"
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm({ ...editForm, phone: e.target.value })
                              }
                              className="bg-gray-800/50 border-gray-600 text-white pl-10 focus:border-purple-500 focus:ring-purple-500/20"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg flex items-center">
                        <MapPin size={20} className="mr-2 text-purple-400" />
                        Address Information
                      </h3>

                      <div className="space-y-4">
                        <Input
                          value={editForm.address.street}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: {
                                ...editForm.address,
                                street: e.target.value,
                              },
                            })
                          }
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                          placeholder="Street Address *"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={editForm.address.city}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                address: {
                                  ...editForm.address,
                                  city: e.target.value,
                                },
                              })
                            }
                            className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="City *"
                          />
                          <Input
                            value={editForm.address.state}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                address: {
                                  ...editForm.address,
                                  state: e.target.value,
                                },
                              })
                            }
                            className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="State / Province"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={editForm.address.zipCode}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                address: {
                                  ...editForm.address,
                                  zipCode: e.target.value,
                                },
                              })
                            }
                            className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="ZIP / Postal Code"
                          />
                          <Input
                            value={editForm.address.country}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                address: {
                                  ...editForm.address,
                                  country: e.target.value,
                                },
                              })
                            }
                            className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="Country *"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6">
                      <Button
                        onClick={handleUpdateProfile}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-semibold"
                      >
                        <Save size={20} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg flex items-center">
                        <Mail size={20} className="mr-2 text-purple-400" />
                        Contact Information
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                          <Mail
                            size={18}
                            className="text-purple-400 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="text-white">{user.email}</p>
                          </div>
                        </div>

                        {user.phone ? (
                          <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                            <Phone
                              size={18}
                              className="text-purple-400 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-gray-400">Phone</p>
                              <p className="text-white">{user.phone}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border border-amber-500/30">
                            <Phone
                              size={18}
                              className="text-amber-400 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-amber-400">
                                Phone number not added
                              </p>
                              <p className="text-xs text-gray-500">
                                Add your phone for better experience
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address Information */}
                    {user.address?.street ||
                    user.address?.city ||
                    user.address?.country ? (
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg flex items-center">
                          <MapPin size={20} className="mr-2 text-purple-400" />
                          Address
                        </h3>

                        <div className="p-4 bg-gray-800/30 rounded-lg space-y-1">
                          {user.address?.street && (
                            <p className="text-white">{user.address.street}</p>
                          )}
                          {(user.address?.city ||
                            user.address?.state ||
                            user.address?.zipCode) && (
                            <p className="text-gray-300">
                              {[
                                user.address?.city,
                                user.address?.state,
                                user.address?.zipCode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                          {user.address?.country && (
                            <p className="text-gray-300">{user.address.country}</p>
                          )}
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
                              Address not completed
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Add your address information for location-based services
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Member Since */}
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg flex items-center">
                        <Calendar size={20} className="mr-2 text-purple-400" />
                        Account Information
                      </h3>

                      <div className="p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-400">Member since</p>
                            <p className="text-white font-medium">
                              {new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Last updated</p>
                            <p className="text-white font-medium">
                              {new Date(user.updatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Side Panel */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Account Status Card - Keep profile completion here */}
            <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Completion</span>
                    <span className="text-white font-medium">
                      {getCompletionPercentage()}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${getCompletionPercentage()}%` }}
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
                            <AlertCircle size={12} className="mr-2 text-amber-400" />
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
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
