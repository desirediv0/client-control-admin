import React from "react";
import UsersDashboard from "../_components/UsersDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Dashboard",
  description: "View and manage users",
  openGraph: {
    title: "Users | Dashboard",
    description: "Detailed information about the users",
    type: "website",
  },
};
const Users = () => {
  return <UsersDashboard />;
};

export default Users;
