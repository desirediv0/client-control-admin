import { Metadata } from "next";
import React from "react";
import Auth from "./Auth";

export const metadata: Metadata = {
  title: "Authenticate",
  description: "Authenticate",
};
const Authpage = () => {
  return <Auth />;
};

export default Authpage;
