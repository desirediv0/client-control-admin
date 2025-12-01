"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_DATA } from "@/app/GraphQL/Queries";
import { CustomSession, DashboardData } from "@/types/type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import SearchComponent from "./SearchComponent";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
];

type ChartProps = {
  data: Array<{ name: string; value: number }>;
};

const UserStatusChart: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data.length > 0 ? data : [{ name: "No Data", value: 1 }]}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

type BarChartProps = {
  data: Array<{ name: string; users: number }>;
};

const UsersByParentChart: React.FC<BarChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data.length > 0 ? data : [{ name: "No Data", users: 0 }]}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="users" fill={COLORS[0]}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default function Dashboard() {
  const { data: session } = useSession();
  const sessionData = session as CustomSession;

  const parentId = sessionData?.user?.id ? sessionData.user.id : null;

  const { data, loading, error } = useQuery<{
    getDashboardData: DashboardData;
  }>(GET_DASHBOARD_DATA, {
    variables: {
      parentId: parentId || "",
    },
    skip: !parentId,
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-background">
        <div className="md:flex justify-between items-center w-full mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Error: {error.message}
      </div>
    );

  const dashboardData = data?.getDashboardData || {
    userStatusData: [{ name: "No Data", value: 1 }],
    usersByParentData: [{ name: "No Data", users: 0 }],
    totalChildren: 0,
    activeChildren: 0,
    totalAmount: 0,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-background">
      <div className="md:flex justify-between items-center w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
          Dashboard
        </h1>
        <SearchComponent />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
            <CardDescription>Active vs. Inactive Users</CardDescription>
          </CardHeader>
          <CardContent>
            <UserStatusChart data={dashboardData.userStatusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by Parent</CardTitle>
            <CardDescription>Number of users per parent</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersByParentChart data={dashboardData.usersByParentData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Total Children: {dashboardData.totalChildren}</p>
              <p>Active Children: {dashboardData.activeChildren}</p>
              <p>
                Total Amount:
                {dashboardData.totalAmount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
