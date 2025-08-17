import { useState, useEffect, useRef } from "react";
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

const ProfilePage = () => {
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBackToDashboard}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              Dashboard
            </Button>
          </div>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Completion Alert */}
        {showMissingFields && !isEditing && (
          <Card className="mb-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle
                  className="text-amber-400 mt-1 flex-shrink-0"
                  size={20}
                />
                <div className="flex-1">
                  <h3 className="text-amber-400 font-medium mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Add the missing information to get the full experience.
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Missing: {missingFields.join(", ")}
                  </p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Plus size={14} className="mr-2" />
                    Complete Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Profile Card */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 overflow-hidden">
          <CardHeader className="relative">
            {/* Profile completion progress */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-white text-2xl font-bold">
                  {user.fullName}
                </CardTitle>
                {completionPercentage === 100 && (
                  <CheckCircle className="text-green-400" size={20} />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {completionPercentage}% complete
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                >
                  {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                  <span className="ml-2">{isEditing ? "Cancel" : "Edit"}</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                <div className="relative">
                  {user.profilePicture?.url ? (
                    <div className="relative">
                      <img
                        src={user.profilePicture.url}
                        alt={user.fullName}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 group-hover:border-purple-500 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <Camera size={24} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-4 border-gray-600 group-hover:border-purple-500 transition-all duration-300">
                      <UserIcon size={48} className="text-white" />
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full p-3 border-4 border-gray-900 transition-all duration-200 shadow-lg disabled:opacity-50 group-hover:scale-110"
                  >
                    {isUploading ? (
                      <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Camera size={20} className="text-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Profile Information */}
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
                          setEditForm({ ...editForm, fullName: e.target.value })
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
                {/* User Stats */}
                <div className="grid grid-cols-3 gap-4 text-center py-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-white">
                      {completionPercentage}%
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Complete
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-white">
                      {new Date(user.createdAt).getFullYear()}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Joined
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-purple-400">
                      {user.profilePicture ? "Yes" : "No"}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Avatar
                    </p>
                  </div>
                </div>

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
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Last updated</p>
                        <p className="text-white font-medium">
                          {new Date(user.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
