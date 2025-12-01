import React from "react";
import UserDetailsPage from "./UserDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Details",
  description: "View and manage user information",
  openGraph: {
    title: "User Details | Dashboard",
    description: "Detailed information about the user",
    type: "website",
  },
  robots: "noindex, nofollow",
};
const page = () => {
  return <UserDetailsPage />;
};

export default page;
