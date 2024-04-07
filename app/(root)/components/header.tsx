import UserAvatar from "./user-avatar";

export default function Header() {
  return (
    <header className="flex justify-end px-12 py-4">
      <UserAvatar />
    </header>
  );
}
