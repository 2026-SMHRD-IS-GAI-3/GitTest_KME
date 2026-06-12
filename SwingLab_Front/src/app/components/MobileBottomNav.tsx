import { useLocation, useNavigate } from "react-router";

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: "🏠",
      label: "홈",
      path: "/dashboard",
    },
    {
      icon: "🎥",
      label: "분석",
      path: "/upload",
    },
    {
      icon: "📊",
      label: "기록",
      path: "/history",
    },
    {
      icon: "💬",
      label: "커뮤니티",
      path: "/community",
    },
    {
      icon: "👤",
      label: "MY",
      path: "/password/confirm",
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#E5E5E5] z-50">
      <div className="grid grid-cols-5 h-14">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.label === "MY" &&
              (location.pathname === "/password/confirm" ||
                location.pathname === "/profile/edit"));

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <div className="text-xl">{item.icon}</div>
              <span
                className={`text-[11px] ${
                  isActive ? "text-[#1D9E75] font-bold" : "text-[#555555]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}