"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GET_CHILDREN_BY_PARENT_ID,
  UPDATE_CHILD_STATUS,
} from "@/app/GraphQL/Queries";
import { CustomSession, User } from "@/types/type";
import SearchComponent from "./SearchComponent";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

// Types

interface DashboardHeaderProps {
  totalUsers: number;
}

interface UserTableProps {
  users: User[];
  onUpdateStatus: (id: number, status: boolean) => void;
}

interface ViewUserButtonProps {
  userId: number;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface ErrorDisplayProps {
  message: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ totalUsers }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center ">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
      Users List
    </h1>
    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <p className="text-sm text-gray-600">Total Users: {totalUsers}</p>
      <SearchComponent />
    </div>
  </div>
);

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [connectionStatus, setConnectionStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [connectionErrors, setConnectionErrors] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const checkConnections = async () => {
      const statuses: { [key: number]: boolean } = {};
      const errors: { [key: number]: string } = {};
      for (const user of users) {
        try {
          const response = await fetch("/api/check-db", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ databaseUrl: user.databaseUrl }),
          });
          const data = await response.json();
          statuses[user.id] = data.success;
          if (!data.success && data.message) {
            errors[user.id] = data.message;
          }
        } catch (error) {
          statuses[user.id] = false;
          errors[user.id] = "Failed to check database connection";
        }
      }
      setConnectionStatus(statuses);
      setConnectionErrors(errors);
    };

    checkConnections();
  }, [users]);

  return (
    <Card className="overflow-hidden bg-white">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Email
              </TableHead>
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Domain
              </TableHead>
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Join Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Connect
              </TableHead>
              <TableHead className="font-semibold text-gray-700 px-4 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3">{user.name}</TableCell>
                <TableCell className="px-4 py-3">{user.email}</TableCell>
                <TableCell className="px-4 py-3">{user.phone}</TableCell>
                <TableCell className="px-4 py-3">{user.domain}</TableCell>
                <TableCell className="px-4 py-3">
                  ₹{user.totalAmt.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {new Date(user.joinDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          {connectionStatus[user.id] ? (
                            <span className="flex items-center bg-green-500 w-4 h-4 rounded-full"></span>
                          ) : (
                            <span className="flex items-center bg-red-500 w-4 h-4 rounded-full"></span>
                          )}
                        </div>
                      </TooltipTrigger>
                      {connectionErrors[user.id] && (
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">{connectionErrors[user.id]}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <ViewUserButton userId={user.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border-b last:border-b-0 hover:bg-gray-50"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Domain:</span>
                <span>{user.domain}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Amount:</span>
                <span>₹{user.totalAmt.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Join Date:</span>
                <span>{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Connect:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        {connectionStatus[user.id] ? (
                          <span className="flex items-center bg-green-500 w-4 h-4 rounded-full"></span>
                        ) : (
                          <span className="flex items-center bg-red-500 w-4 h-4 rounded-full"></span>
                        )}
                      </div>
                    </TooltipTrigger>
                    {connectionErrors[user.id] && (
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">{connectionErrors[user.id]}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-end">
                <ViewUserButton userId={user.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const ViewUserButton: React.FC<ViewUserButtonProps> = ({ userId }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/dashboard/users/${userId}`} className="hover:bg-gray-100">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View user</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent>View user details</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
    <p className="text-sm text-gray-600">
      Page {currentPage} of {totalPages}
    </p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
    <p className="text-gray-500 text-lg font-semibold">No users found</p>
  </div>
);

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
    <p className="text-red-500 text-lg">Error: {message}</p>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

// Main Dashboard Component
const UsersDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const sessionData = session as CustomSession;

  const parentId = sessionData?.user?.id ? sessionData.user.id : null;

  const { loading, error, data, fetchMore, refetch } = useQuery(
    GET_CHILDREN_BY_PARENT_ID,
    {
      variables: {
        parentId: parentId || "",
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
      },
      skip: !parentId,
      fetchPolicy: "network-only",
    }
  );

  const [updateChildStatus] = useMutation(UPDATE_CHILD_STATUS, {
    onCompleted: () => {
      toast.success("User status updated successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleUpdateStatus = (id: number, status: boolean) => {
    if (!sessionData?.user?.id) {
      toast.error("User not available. Please login again.");
      return;
    }
    updateChildStatus({ variables: { updateChildStatusId: id, status } });
  };

  const handlePageChange = (newPage: number) => {
    if (!sessionData?.user?.id) {
      toast.error("Please login again.");
      return;
    }

    setCurrentPage(newPage);
    fetchMore({
      variables: { page: newPage, pageSize: ITEMS_PER_PAGE },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error.message} />;
  if (!data?.getChildrenByParentId) return <LoadingSkeleton />;

  const {
    children: users,
    pageInfo,
    totalChildren,
  } = data.getChildrenByParentId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader totalUsers={totalChildren} />
      <UserTable users={users} onUpdateStatus={handleUpdateStatus} />
      {users.length === 0 ? (
        <EmptyState />
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={pageInfo.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UsersDashboard;
