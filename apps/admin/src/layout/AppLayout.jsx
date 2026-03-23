import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout({ user, onLogout }) {
  return (
    <div className="app">
      <Sidebar user={user} onLogout={onLogout} />

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}