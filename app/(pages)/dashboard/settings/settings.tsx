"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { DELETE_USER, GET_USER, UPDATE_USER } from "@/app/GraphQL/Queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOut, useSession } from "next-auth/react";
import { CustomSession } from "@/types/type";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfile() {
  const { data: session } = useSession();
  const sessionData = session as CustomSession;
  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      getUserId: sessionData?.user?.id ? sessionData.user.id : null,
    },
  });
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [GET_USER],
  });
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [GET_USER],
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
  }, []);

  const user = data?.getUser;

  const handleUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingUser) return;

      const updateVariables: {
        updateUserId: number;
        name?: string;
        email?: string;
      } = {
        updateUserId: editingUser.id,
      };

      if (editingUser.name !== user.name) {
        updateVariables.name = editingUser.name;
      }

      if (editingUser.email !== user.email) {
        updateVariables.email = editingUser.email;
      }

      if (Object.keys(updateVariables).length === 1) {
        toast.error("No changes detected");
        return;
      }

      try {
        await updateUser({ variables: updateVariables });
        toast.success("Profile updated successfully");
        setEditingUser(null);
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to update profile: ${error.message}`);
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      }
    },
    [editingUser, updateUser, router, user]
  );

  const handleDelete = useCallback(async () => {
    if (!data?.getUser) return;
    try {
      await deleteUser({ variables: { deleteUserId: data.getUser.id } });
      toast.success("Profile deleted successfully");
      router.push("/");
      signOut();
    } catch (error) {
      toast.error("Failed to delete profile. Please try again.");
    }
    setIsDeleteDialogOpen(false);
  }, [deleteUser, data, router]);

  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (loading) return <Skeleton className="w-full h-[400px]" />;

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Name</Label>
              <p className="font-medium text-base">{user?.name}</p>
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <p className="text-base">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm">Created At</Label>
              <p className="text-base">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm">Updated At</Label>
              <p className="text-base">
                {new Date(user?.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        <span>Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editingUser?.name || ""}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser!,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editingUser?.email || ""}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser!,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button type="submit">Update Profile</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete your profile? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
