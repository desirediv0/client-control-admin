"use client";
import AddUserDialog from "./_components/AddUserDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  FileText,
  Home,
  LogOut,
  Menu,
  RefreshCcw,
  Settings,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarContent from "./_components/SidebarContent";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "./_components/UserAvatar";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col bg-white shadow-md transition-all duration-300 ease-in-out lg:w-64 ">
          <SidebarContent collapsed={sidebarCollapsed} />
        </aside>

        {/* Mobile menu button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-5 z-50 lg:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Menu</TooltipContent>
        </Tooltip>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-16 right-4 bg-white shadow-lg rounded-lg p-4 z-50 lg:hidden"
            >
              <div className="flex flex-col space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Dashboard Home</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/users"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <Users className="h-5 w-5" />
                      <span>Users</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Manage Users</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/payment"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Payment</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Payment Settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/docs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <FileText className="h-5 w-5" />
                      <span>Documentation</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>View Documentation</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/update"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <RefreshCcw className="h-5 w-5" />
                      <span>Update</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Update Content</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Account Settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="flex items-center space-x-2 w-full justify-start p-2 hover:bg-gray-100 rounded"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign Out</TooltipContent>
                </Tooltip>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-200">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-3xl font-bold text-gray-800"
            >
              Dashboard
            </Link>
            <UserAvatar />
          </div>
          {children}
          <AddUserDialog />
        </main>
      </div>
    </TooltipProvider>
  );
}
