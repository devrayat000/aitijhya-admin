import UserAvatar from "./user-avatar";

export default function Header() {
  return (
    <header className="flex justify-end px-6 py-5 absolute right-0 z-50">
      <UserAvatar />
    </header>
  );
}
