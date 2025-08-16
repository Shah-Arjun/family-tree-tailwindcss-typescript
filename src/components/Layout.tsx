import DarkModeToggle from "./ui/toggle";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DarkModeToggle />
    </>
  );
}
