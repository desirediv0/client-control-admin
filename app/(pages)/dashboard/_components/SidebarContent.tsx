import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  CreditCard,
  Settings,
  LogOut,
  FileText,
  RefreshCcw,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function SidebarContent({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-center h-14 border-b">
        <span
          className={`text-xl font-bold text-gray-800 ${
            collapsed ? "hidden" : ""
          }`}
        >
          Dashboard
        </span>
      </div>
      <nav className="flex-1 space-y-2 py-4">
        <Link href="/dashboard">
          <Button variant="ghost" className={`w-full justify-start `}>
            <Home className="h-5 w-5" />
            {<span className="ml-2">Home</span>}
          </Button>
        </Link>
        <Link href="/dashboard/users">
          <Button variant="ghost" className={`w-full justify-start `}>
            <Users className="h-5 w-5" />
            {<span className="ml-2">Users</span>}
          </Button>
        </Link>
        <Link href="/dashboard/payment">
          <Button variant="ghost" className={`w-full justify-start `}>
            <CreditCard className="h-5 w-5" />
            {<span className="ml-2">Payment</span>}
          </Button>
        </Link>
        <Link href="/dashboard/docs">
          <Button variant="ghost" className={`w-full justify-start `}>
            <FileText className="h-5 w-5" />
            {<span className="ml-2">Docs</span>}
          </Button>
        </Link>
        <Link href="/dashboard/update">
          <Button variant="ghost" className={`w-full justify-start `}>
            <RefreshCcw className="h-5 w-5" />
            {<span className="ml-2">Update</span>}
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="ghost" className={`w-full justify-start `}>
            <Settings className="h-5 w-5" />
            {<span className="ml-2">Settings</span>}
          </Button>
        </Link>
      </nav>

      <Button
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
        variant="ghost"
        className={`w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 `}
      >
        <LogOut className="h-5 w-5" />
        {<span className="ml-2">Logout</span>}
      </Button>
    </div>
  );
}
