"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ClipboardIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  XCircleIcon,
  DatabaseIcon,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  GET_CHILD,
  DELETE_CHILD,
  UPDATE_CHILD_FIELD,
} from "@/app/GraphQL/Queries";
import { CustomSession, UserDetails } from "@/types/type";

export default function UserDetailsPage() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editField, setEditField] = useState<keyof UserDetails | null>(null);
  const [editValue, setEditValue] = useState<string | number | Date | boolean>(
    ""
  );
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState<boolean>(false);
  const [isCheckingApiStatus, setIsCheckingApiStatus] = useState(false);
  const [newUserDetails, setNewUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();

  const parentId = (session as CustomSession)?.user?.id
    ? (session as CustomSession).user.id
    : null;

  const { data, loading, error } = useQuery(GET_CHILD, {
    variables: {
      id: Array.isArray(id) ? id[0] : id,
      parentId: parentId?.toString() || null,
    },
    skip: parentId === null,
  });

  useEffect(() => {
    if (data?.getChild) {
      const { __typename, ...childData } = data.getChild;
      setUserDetails(childData);
    }
  }, [data]);

  useEffect(() => {
    const checkConnection = async () => {
      if (userDetails?.databaseUrl) {
        try {
          const response = await fetch("/api/check-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ databaseUrl: userDetails?.databaseUrl }),
          });
          const data = await response.json();
          setConnectionStatus(data.success);
          if (!data.success) {
            setConnectionError(data.message || "Failed to connect to database");
          } else {
            setConnectionError(null);
          }
        } catch (error) {
          setConnectionStatus(false);
          setConnectionError("Failed to check database connection");
        }
      }
    };
    checkConnection();
  }, [userDetails?.databaseUrl]);

  const checkApiStatus = async () => {
    if (userDetails?.databaseUrl) {
      setIsCheckingApiStatus(true);
      try {
        const response = await fetch("/api/check-api-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ databaseUrl: userDetails?.databaseUrl }),
        });
        const data = await response.json();
        if (response.ok) {
          setApiStatus(data.status);
        } else {
          throw new Error(data.message || "Failed to check API status");
        }
      } catch (error) {
        console.error("Error checking API status:", error);
        toast.error(`Failed to check API status: ${(error as Error).message}`);
      } finally {
        setIsCheckingApiStatus(false);
      }
    }
  };

  const [deleteChild] = useMutation(DELETE_CHILD, {
    onCompleted: () => {
      toast.success("User deleted successfully");
      router.push("/dashboard/users");
    },
    onError: (error) => toast.error(`Error deleting user: ${error.message}`),
  });

  const [updateChildField] = useMutation(UPDATE_CHILD_FIELD, {
    onCompleted: () => {
      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
    },
    onError: (error) => toast.error(`Error updating user: ${error.message}`),
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleEditUser = (field: keyof UserDetails) => {
    setEditField(field);
    setEditValue(userDetails?.[field] ?? "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (editField && userDetails) {
      updateChildField({
        variables: {
          childId: userDetails?.id,
          field: editField,
          value: editValue.toString(),
        },
        update: (cache, { data }) => {
          if (data?.updateChildField) setUserDetails(data.updateChildField);
        },
      });
    }
  };

  const handleApiStatusToggle = async () => {
    try {
      const response = await fetch("/api/check-api-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ databaseUrl: userDetails?.databaseUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle API status");
      }

      const data = await response.json();
      setApiStatus(data.status);
      toast.success("API status toggled successfully");
    } catch (error) {
      console.error("Error toggling API status:", error);
      toast.error("Failed to toggle API status");
    }
  };

  const handleOpenApiDialog = () => {
    setIsApiDialogOpen(true);
    checkApiStatus();
  };

  const truncateUrl = (url: string) => {
    const maxLength = 30;
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + "...";
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password } = newUserDetails;

    if (!userDetails?.databaseUrl) {
      toast.error("Database URL is not available");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          databaseUrl: userDetails?.databaseUrl,
        }),
      });

      if (response.ok) {
        toast.success("User created successfully");
        setIsCreateDialogOpen(false);
        // Refetch user list or update local state
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  const handleOpenCreateDialog = () => {
    setNewUserDetails({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      password: "",
    });
    setIsCreateDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">
          Loading user details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-500">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            An error occurred while fetching user details:
          </p>
          <p className="text-red-500 mt-2">{error.message}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/dashboard/users")}>
            Back to Users
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!userDetails) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-yellow-500">
            No Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">No user data is available.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/dashboard/users")}>
            Back to Users
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 rounded-t-lg">
          <div>
            <CardTitle className="text-2xl font-bold capitalize">
              {userDetails?.name}
            </CardTitle>
            <CardDescription className="text-gray-600">
              User ID: {userDetails?.id}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleEditUser("name")}
              variant="outline"
              size="sm"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              size="sm"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleOpenApiDialog}
              variant="outline"
              size="sm"
              disabled={!connectionStatus}
            >
              <DatabaseIcon className="h-4 w-4 mr-2" />
              API Access
            </Button>
            {connectionStatus && (
              <Button
                onClick={handleOpenCreateDialog}
                variant="default"
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create User
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(userDetails).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm font-medium text-gray-500 uppercase">
                  {key}
                </Label>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <span className="text-sm font-medium">
                    {key === "password"
                      ? showPassword
                        ? value.toString()
                        : "••••••••"
                      : key === "joinDate"
                      ? format(new Date(value as string), "PPP")
                      : key === "databaseUrl"
                      ? truncateUrl(value.toString())
                      : value.toString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {key === "password" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-8 hover:bg-gray-300"
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {showPassword ? "Hide" : "Show"} password
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleCopy(value.toString())}
                            variant="ghost"
                            size="sm"
                            className="p-0 h-8 w-8 hover:bg-gray-300"
                          >
                            <ClipboardIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              handleEditUser(key as keyof UserDetails)
                            }
                            variant="ghost"
                            size="sm"
                            className="p-0 h-8 w-8 hover:bg-gray-300"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit {key}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700 uppercase">
                Connection Status
              </Label>
              <Badge
                variant={connectionStatus ? "success" : "destructive"}
                className="text-sm font-medium"
              >
                {connectionStatus ? (
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                ) : (
                  <XCircleIcon className="h-4 w-4 mr-1" />
                )}
                {connectionStatus ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            {connectionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 font-medium">Connection Error:</p>
                <p className="text-sm text-red-600 mt-1">{connectionError}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-500">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (userDetails) {
                  deleteChild({
                    variables: { deleteChildId: userDetails?.id },
                  });
                }
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-500">
              Edit {editField}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={editValue.toString()}
            onChange={(e) => setEditValue(e.target.value)}
            type={
              editField === "password" && !showPassword ? "password" : "text"
            }
            className="mt-4"
          />
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-500">
              API Access Management
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between py-4">
            <Label
              htmlFor="api-status"
              className="text-sm font-medium text-gray-700"
            >
              API Status
            </Label>
            <Switch
              id="api-status"
              checked={apiStatus}
              onCheckedChange={handleApiStatusToggle}
              disabled={isCheckingApiStatus}
            />
          </div>
          <p className="text-sm text-gray-500">
            Current API Status:{" "}
            {isCheckingApiStatus ? (
              <span className="flex items-center">
                <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                Checking...
              </span>
            ) : (
              <Badge variant={apiStatus ? "success" : "destructive"}>
                {apiStatus ? "Active" : "Inactive"}
              </Badge>
            )}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newUserDetails?.name}
                onChange={(e) =>
                  setNewUserDetails({ ...newUserDetails, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newUserDetails?.email}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={newUserDetails?.password}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
