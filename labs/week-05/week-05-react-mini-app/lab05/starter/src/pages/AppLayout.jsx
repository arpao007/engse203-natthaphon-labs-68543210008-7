import AppHeader from "../components/AppHeader.jsx";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div data-testid="app-layout">
      <AppHeader />

      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;