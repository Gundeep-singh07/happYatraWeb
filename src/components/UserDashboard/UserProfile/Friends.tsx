// src/components/UserProfile/Friends.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FriendReference } from "../../../constants/constants";
import apiService from "../../../services/apiService";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FriendsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<FriendReference[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendReference[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendReference[]>(
    []
  );
  const [suggestions, setSuggestions] = useState<FriendReference[]>([]);
  const [searchResults, setSearchResults] = useState<FriendReference[] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  // ++ NEW STATE to track in-progress actions ++
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchConnections = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiService.getConnections();
      if (res.success) {
        setFriends(res.data.friends || []);
        setSentRequests(res.data.sentRequests || []);
        setReceivedRequests(res.data.receivedRequests || []);
        setSuggestions(res.data.suggestions || []);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await apiService.searchUsers(query);
      if (res.success) {
        setSearchResults(res.data.users);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search remains the same
  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setSearchLoading(true);
      debouncedSearch(query);
    } else {
      setSearchResults(null);
      setSearchLoading(false);
      debouncedSearch.cancel();
    }
  };

  // --- MODIFIED Action Handler ---
  const handleAction = async (
    actionFn: (id: string) => Promise<any>,
    userId: string
  ) => {
    setActionLoading(userId); // Set loading for this specific user
    try {
      await actionFn(userId);
      // Refetch data without the main page loader for a smoother experience
      await fetchConnections(false);
      // If we were searching, refetch search results as well
      if (searchQuery) {
        await handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null); // Clear loading state
    }
  };

  // --- MODIFIED UserCard Component ---
  const UserCard = ({ user }: { user: FriendReference }) => {
    const isFriend = friends.some((f) => f._id === user._id);
    const isSent = sentRequests.some((r) => r._id === user._id);
    const isReceived = receivedRequests.some((r) => r._id === user._id);
    const isLoading = actionLoading === user._id; // Is this the user being acted upon?

    return (
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          {user.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <UserIcon size={20} className="text-gray-400" />
            </div>
          )}
          <span className="font-medium text-white">{user.fullName}</span>
        </div>
        <div className="flex space-x-2">
          {isFriend ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleAction(apiService.removeFriend, user._id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <UserX size={16} className="mr-1" /> Remove
                </>
              )}
            </Button>
          ) : isSent ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleAction(apiService.declineFriendRequest, user._id)
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Cancel"
              )}
            </Button>
          ) : isReceived ? (
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() =>
                  handleAction(apiService.acceptFriendRequest, user._id)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UserCheck size={16} />
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleAction(apiService.declineFriendRequest, user._id)
                }
                disabled={isLoading}
              >
                <UserX size={16} />
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                handleAction(apiService.sendFriendRequest, user._id)
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} className="mr-1" /> Add
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  const UserList = ({
    users,
    emptyMessage,
  }: {
    users: FriendReference[];
    emptyMessage: string;
  }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      );
    }
    if (users.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">{emptyMessage}</div>
      );
    }
    return (
      <div className="space-y-3">
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white"
    >
      <header className="sticky top-0 z-10 bg-gradient-to-b from-gray-900/95 to-gray-900/85 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Manage Connections</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Users className="mr-3 text-blue-400" /> Find & Connect with Users
            </CardTitle>
            <div className="relative mt-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search by name, email, or user ID..."
                className="w-full bg-gray-800/50 border-gray-600 pl-10 focus:border-blue-500 focus:ring-blue-500/20"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchLoading && (
                <Loader2
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin"
                  size={20}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {searchResults ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">
                  Search Results
                </h3>
                <UserList
                  users={searchResults}
                  emptyMessage="No users found matching your search."
                />
              </div>
            ) : (
              <Tabs defaultValue="friends" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="friends">
                    Friends ({friends.length})
                  </TabsTrigger>
                  <TabsTrigger value="requests">
                    Requests ({receivedRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>
                <TabsContent value="friends" className="pt-4">
                  <UserList
                    users={friends}
                    emptyMessage="You haven't added any friends yet. Find some in suggestions!"
                  />
                </TabsContent>
                <TabsContent value="requests" className="pt-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">
                    Received Requests
                  </h3>
                  <UserList
                    users={receivedRequests}
                    emptyMessage="No pending friend requests."
                  />
                  <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-300">
                    Sent Requests
                  </h3>
                  <UserList
                    users={sentRequests}
                    emptyMessage="You haven't sent any requests."
                  />
                </TabsContent>
                <TabsContent value="suggestions" className="pt-4">
                  <UserList
                    users={suggestions}
                    emptyMessage="No suggestions at the moment. Try searching for users!"
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>
    </motion.div>
  );
};

export default FriendsPage;
