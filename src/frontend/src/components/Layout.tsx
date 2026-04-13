import { Outlet } from "@tanstack/react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
