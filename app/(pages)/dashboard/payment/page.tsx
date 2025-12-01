import React from "react";
import Payment from "../_components/Payment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "user upcoming payment",
  description: "user upcoming payment",
};
const PayUsers = () => {
  return <Payment />;
};

export default PayUsers;
