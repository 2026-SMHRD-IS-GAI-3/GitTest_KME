import { Outlet, useLocation } from "react-router";
import { MobileNavigation } from "./MobileNavigation";
import { MobileBottomNav } from "./MobileBottomNav";

export function Layout() {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const hideBottomNav = [
    "/",
    "/login",
    "/signup/terms",
    "/signup/form",
    "/body-info",
    "/survey",
    "/survey/result",
    "/password/confirm",
    "/password/change",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FAF8]">
      {!isHomePage && <MobileNavigation />}
      <main className={`flex-1 ${!hideBottomNav ? 'pb-16' : ''}`}>
        <Outlet />
      </main>
      {!hideBottomNav && <MobileBottomNav />}
    </div>
  );
}
