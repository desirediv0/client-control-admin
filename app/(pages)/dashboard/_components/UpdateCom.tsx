"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface Update {
  id: string;
  title: string;
  link: string;
  show: boolean;
}

interface FormData {
  title: string;
  link: string;
  show: boolean;
}

const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export default function UpdateManager() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      link: "",
      show: false,
    },
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await fetch("/api/update");
      if (res.ok) {
        const data = await res.json();
        setUpdates(data);
      } else {
        toast.error("Failed to fetch updates");
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
      toast.error("Failed to fetch updates");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const url = isEditing ? `/api/update/${editId}` : "/api/update";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(
          isEditing
            ? "Update edited successfully"
            : "Update created successfully"
        );
        reset();
        setIsEditing(false);
        setEditId("");
        fetchUpdates();
      } else {
        toast.error(
          isEditing ? "Failed to edit update" : "Failed to create update"
        );
      }
    } catch (error) {
      console.error("Error submitting update:", error);
      toast.error(
        isEditing ? "Failed to edit update" : "Failed to create update"
      );
    }
  };

  const handleEdit = (update: Update) => {
    reset(update);
    setIsEditing(true);
    setEditId(update.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/update/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Update deleted successfully");
        fetchUpdates();
      } else {
        toast.error("Failed to delete update");
      }
    } catch (error) {
      console.error("Error deleting update:", error);
      toast.error("Failed to delete update");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Update" : "Create New Update"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                }}
                render={({ field }) => (
                  <Input id="title" placeholder="Enter the title" {...field} />
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="link">Link</Label>
              <Controller
                name="link"
                control={control}
                rules={{
                  required: "Link is required",
                  pattern: {
                    value: urlRegex,
                    message: "Please enter a valid URL",
                  },
                }}
                render={({ field }) => (
                  <Input id="link" placeholder="Enter the link" {...field} />
                )}
              />
              {errors.link && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.link.message}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <Controller
                name="show"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="show"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="show" className="ml-2">
                Show
              </Label>
            </div>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create"}
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsEditing(false);
                  setEditId("");
                }}
              >
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {updates.map((update) => (
              <Card key={update.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{update.title}</h3>
                    <a
                      href={update.link}
                      className="text-blue-500 text-sm hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {update.link}
                    </a>
                    <p className="text-sm text-gray-500">
                      Show: {update.show ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(update)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(update.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
