import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import "../App.css";

export default function AppLayout({ user, onLogout }) {
  return (
    <div className="app-shell">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="app-content">
        <Header user={user} onLogout={onLogout} />

        <main className="main">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}