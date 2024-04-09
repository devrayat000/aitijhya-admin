import UserAvatar from "./user-avatar";

export default function Header() {
  return (
    <header className="flex justify-end px-6 py-4">
      <UserAvatar />
    </header>
  );
}
