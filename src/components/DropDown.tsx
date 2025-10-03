"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, LogOutIcon } from "lucide-react";

const DropDown = () => {
  const router = useRouter();

  const handleLogout = async () => {
    router.push("/sign-in");
  };



  const user= {Name: "John Doe", Email: "john.doe@example.com", Image: "https://via.placeholder.com/150"};
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        
        <Button variant="ghost" className="hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 rounded-full" onClick={handleLogout}>
            <Avatar>
                <AvatarImage src={user.Image} />
                <AvatarFallback>
                    {user.Name.charAt(0)}
                </AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.Name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{user.Email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center ">
            <LogOut className="w-4 h-4" color="red"/>
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">Logout</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
