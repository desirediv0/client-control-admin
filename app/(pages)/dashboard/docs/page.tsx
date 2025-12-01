import React from "react";
import Docs from "./Docs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Documentation for the website",
};
const Doc = () => {
  return <Docs />;
};

export default Doc;
