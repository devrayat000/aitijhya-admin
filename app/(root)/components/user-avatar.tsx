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
import { auth } from "@/lib/auth";
import { getAvatarLetters } from "@/lib/utils";
import Link from "next/link";
import { use } from "react";
import LogoutButton from "./logout";

export default function UserAvatar() {
  const session = use(auth());

  if (!session) {
    // redirect("/signin");
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 md:h-12 w-10 md:w-12 rounded-full"
        >
          <Avatar className="h-10 md:h-12 w-10 md:w-12">
            {session.user.image && (
              <AvatarImage
                src={session.user.image}
                alt={getAvatarLetters(session.user.name!)}
              />
            )}
            <AvatarFallback>
              {getAvatarLetters(session.user.name!)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/bookmarks">Bookmarks</Link>
        </DropdownMenuItem>
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
