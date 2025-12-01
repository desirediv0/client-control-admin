"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Link,
  Calendar,
  UserPlus,
  IndianRupee,
  Database,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomSession, FormData } from "@/types/type";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { CREATE_CHILD, GET_CHILDREN_BY_PARENT_ID } from "@/app/GraphQL/Queries";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddUserDialog() {
  const { data: session } = useSession();
  const sessionData = session as CustomSession;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [isOpen, setIsOpen] = useState(false);

  const parentId = sessionData?.user?.id ? sessionData.user.id : null;

  const [createChild, { loading }] = useMutation(CREATE_CHILD, {
    onError: (error) => {
      let errorMessage = "An error occurred while creating User";

      if (error.graphQLErrors?.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        if (
          graphQLError.message.includes(
            'Variable "$databaseType" of required type "String!" was not provided.'
          )
        ) {
          errorMessage = "Please select a database type.";
        } else {
          errorMessage = graphQLError.message;
        }
      }

      toast.error(errorMessage);
    },
    onCompleted: () => {
      toast.success("User created successfully");
      setIsOpen(false);
      reset();
    },
    refetchQueries: [
      {
        query: GET_CHILDREN_BY_PARENT_ID,
        variables: {
          parentId: parentId || "",
          page: 1,
          pageSize: 10,
        },
      },
    ],
  });

  const onSubmit = async (data: FormData) => {
    if (!parentId) {
      toast.error("User session not available. Please login again.");
      return;
    }

    try {
      const formattedData = {
        ...data,
        joinDate: new Date(data.joiningDate).toISOString(),
        parentId: parentId,
        totalAmt: parseFloat(data.totalAmount),
      };
      await createChild({
        variables: formattedData,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  const renderInput = (
    name: keyof FormData,
    label: string,
    type: string,
    icon: React.ReactNode,
    validation: any,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {icon}
        <Input
          id={name}
          type={type}
          className="pl-10 border-gray-300 focus:border-black placeholder-small"
          placeholder={placeholder}
          {...register(name, validation)}
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </div>
  );

  const renderSelect = (
    name: keyof FormData,
    label: string,
    icon: React.ReactNode,
    options: string[],
    validation: any,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {icon}
        <Select
          onValueChange={(value) => {
            register(name).onChange({ target: { name, value } });
          }}
        >
          <SelectTrigger className="w-full pl-10 border-gray-300 focus:border-black placeholder-small">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                className="fixed bottom-4 right-16 lg:bottom-4 lg:right-6 border border-gray-500 bg-black text-white hover:bg-gray-900 rounded-md shadow-md z-40"
                onClick={() => setIsOpen(true)}
              >
                <UserPlus className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Add User</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add User</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white text-black">
        <style jsx global>{`
          .placeholder-small::placeholder {
            font-size: 0.8em;
          }
        `}</style>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new user to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput(
              "name",
              "Name",
              "text",
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              },
              "John Doe"
            )}
            {renderInput(
              "email",
              "Email",
              "email",
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              },
              "johndoe@example.com"
            )}
            {renderInput(
              "phone",
              "Phone Number",
              "tel",
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be exactly 10 digits",
                },
              },
              "1234567890"
            )}
            {renderInput(
              "domain",
              "Domain Link",
              "url",
              <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Domain link is required",
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                  message: "Invalid URL format",
                },
              },
              "https://example.com"
            )}
            {renderInput(
              "joiningDate",
              "Joining Date",
              "date",
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Joining date is required",
              },
              "YYYY-MM-DD"
            )}
            {renderInput(
              "totalAmount",
              "Total Amount",
              "number",
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Total amount is required",
                validate: (value: string) =>
                  parseFloat(value) > 0 || "Amount must be greater than 0",
              },
              "10000"
            )}

            {renderInput(
              "databaseUrl",
              "Database URL",
              "text",
              <Database className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Database URL is required",
                validate: (value: string) => {
                  const postgresRegex =
                    /^postgresql:\/\/[^:]+:[^@]+@[^:]+(\.[^:]+)*:[0-9]+\/[^?]+(\?.*)?$/;

                  const isValid = postgresRegex.test(value);
                  return isValid || "Invalid database connection string format";
                },
              },
              "postgresql://user:password@host:5432/database"
            )}
            {renderInput(
              "password",
              "Password",
              "password",
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />,
              {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              },
              "Enter your password"
            )}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? "Adding User..." : "Add User"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
