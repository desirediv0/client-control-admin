import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function UserAvatar() {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-gray-300"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://img.freepik.com/free-photo/3d-illustration-business-man-with-glasses-grey-background-clipping-path_1142-58140.jpg?t=st=1725268440~exp=1725272040~hmac=4d5f3206a7bd4546c5ce2b6137bb2ce8d88ad690f0c1e2fdc48a18ffab124261&w=740"
              alt="@user"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session ? session?.user?.name : "Guest"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session ? session?.user?.email : "guest@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="w-full cursor-pointer">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/", redirect: true })}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
