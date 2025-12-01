import React from "react";
import { Metadata } from "next";
import Dashboard from "./_components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};
const DashboardPanel = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPanel;
