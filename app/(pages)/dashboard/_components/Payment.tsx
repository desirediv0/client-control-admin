"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { format, differenceInDays, addMonths } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Clock } from "lucide-react";
import { GET_CHILDREN_BY_PARENT_ID } from "@/app/GraphQL/Queries";
import { CustomSession, User } from "@/types/type";

export default function Payment() {
  const { data: session } = useSession();
  const sessionData = session as CustomSession;

  const parentId = sessionData?.user?.id ? sessionData.user.id : null;

  const { loading, error, data } = useQuery(GET_CHILDREN_BY_PARENT_ID, {
    variables: {
      parentId: parentId || "",
      page: 1,
      pageSize: 1000000,
    },
    skip: !parentId,
    fetchPolicy: "network-only",
  });

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.getChildrenByParentId) return <LoadingSkeleton />;

  const { children: users } = data.getChildrenByParentId;

  const filteredUsers = users.filter((user: User) => {
    const joinDate = new Date(user.joinDate);
    const nextPaymentDate = addMonths(joinDate, 1);
    const daysUntilPayment = differenceInDays(nextPaymentDate, new Date());
    return daysUntilPayment <= 15 && daysUntilPayment >= -5;
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Payment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Days Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: User) => (
                <UserRow key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function UserRow({ user }: { user: User }) {
  const joinDate = new Date(user.joinDate);
  const nextPaymentDate = addMonths(joinDate, 1);
  const daysUntilPayment = differenceInDays(nextPaymentDate, new Date());

  let rowColor = "";
  let statusIcon;

  if (daysUntilPayment <= 0) {
    rowColor = "bg-red-100 dark:bg-red-900";
    statusIcon = <AlertCircle className="w-4 h-4 text-red-500" />;
  } else if (daysUntilPayment <= 7) {
    rowColor = "bg-orange-300 dark:bg-orange-900";
    statusIcon = <Clock className="w-4 h-4 text-orange-500" />;
  } else if (daysUntilPayment <= 15) {
    rowColor = "bg-yellow-100 dark:bg-yellow-900";
    statusIcon = <Clock className="w-4 h-4 text-yellow-500" />;
  }

  return (
    <TableRow className={rowColor}>
      <TableCell className="font-medium">
        {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{format(joinDate, "dd/MM/yyyy")}</TableCell>
      <TableCell>{format(nextPaymentDate, "dd/MM/yyyy")}</TableCell>
      <TableCell>{Math.max(daysUntilPayment, 0)}</TableCell>
    </TableRow>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-red-100 border-red-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-600">{message}</p>
      </CardContent>
    </Card>
  );
}
