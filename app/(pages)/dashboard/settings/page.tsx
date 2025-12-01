import React from "react";
import Settings from "./settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page",
};

const Setting = () => {
  return <Settings />;
};

export default Setting;
