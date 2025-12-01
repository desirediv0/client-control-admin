import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface Email {
  email: string;
  message: string;
  emailType: string;
}

export interface PaymentDetails {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  email: string;
  phone?: string;
  themeColor?: string;
}

export interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
    provider?: string | null;
  };
}

export interface CustomJWT extends JWT {
  userId?: string;
}

export type FormData = {
  name: string;
  email: string;
  phone: string;
  domain: string;
  password: string;
  joiningDate: string;
  totalAmount: string;
  databaseUrl: string;
};

export interface UserDetail {
  name: string;
  domain: string;
  amount: string;
  status: boolean;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  domain: string;
  totalAmt: number;
  status: boolean;
  joinDate: string;
  password: string;
  databaseUrl: string;
}

export type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export interface StarProps {
  id: number;
  top: number;
  left: number;
  size: string;
  delay: number;
}
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  domain: string;
  totalAmt: number;
  status: boolean;
  joinDate: string;
  parentId: number;
  databaseUrl: string;
  databaseType: string;
}

export interface ApiDialogProps {
  databaseType: string;
  databaseUrl: string;

  isDisabled: boolean;
}

export interface SearchResult {
  id: number;
  name: string;
  email: string;
  phone: string;
  domain: string;
}

export interface DashboardData {
  userStatusData: StatusData[];
  usersByParentData: ParentData[];
  totalChildren: number;
  activeChildren: number;
  totalAmount: number;
}

export interface StatusData {
  name: string;
  value: number;
}

export interface ParentData {
  name: string;
  users: number;
}
