import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginState = () => {
      const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    checkLoginState();

    window.addEventListener("loginStateChange", checkLoginState);

    return () => {
      window.removeEventListener("loginStateChange", checkLoginState);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("loginStateChange"));
    navigate("/");
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const showBackButton = () => {
    const path = location.pathname;
    const pagesWithBackButton = [
      "/upload",
      "/body-info",
      "/survey",
      "/analysis/result",
      "/community",
      "/mypage",
      "/subscription",
      "/profile/edit",
      "/password/confirm",
      "/password/change",
      "/history",
    ];

    if (path.startsWith("/community/") || path.startsWith("/password/")) {
      return true;
    }

    return pagesWithBackButton.includes(path);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="flex items-center justify-between px-20 py-3.5 border-b border-[#E5E5E5] bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {showBackButton() && (
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F5FAF8] flex items-center justify-center transition-all"
            aria-label="뒤로가기"
          >
            <svg
              className="w-5 h-5 text-[#1A1A1A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          className="text-xl font-bold text-[#1D9E75]"
        >
          SwingLab
        </Link>
      </div>

      {isLoggedIn ? (
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/subscription")}
            className="text-[13px] px-[18px] py-[7px] border border-[#1D9E75] rounded-lg bg-transparent text-[#1D9E75] cursor-pointer font-medium hover:bg-[#E1F5EE]"
          >
            구독
          </button>

          <button
            onClick={() => navigate("/mypage")}
            className="text-[13px] px-[18px] py-[7px] border-none rounded-lg bg-[#1D9E75] text-white cursor-pointer font-medium hover:bg-[#0F6E56]"
          >
            마이페이지
          </button>

          <button
            onClick={handleLogout}
            className="text-[13px] px-[18px] py-[7px] border border-[#CCCCCC] rounded-lg bg-transparent text-[#1A1A1A] cursor-pointer hover:bg-[#F5FAF8]"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex gap-7 items-center">
          <a
            onClick={() => scrollToSection("service-intro")}
            className="text-sm text-[#888780] cursor-pointer hover:text-[#1A1A1A] transition-colors"
          >
            서비스 소개
          </a>

          <a
            onClick={() => scrollToSection("analysis-method")}
            className="text-sm text-[#888780] cursor-pointer hover:text-[#1A1A1A] transition-colors"
          >
            분석 방법
          </a>

          <a
            onClick={() => scrollToSection("grade-system")}
            className="text-sm text-[#888780] cursor-pointer hover:text-[#1A1A1A] transition-colors"
          >
            등급 시스템
          </a>

          <button
            onClick={() => navigate("/login")}
            className="text-[13px] px-[18px] py-[7px] border border-[#CCCCCC] rounded-lg bg-transparent text-[#1A1A1A] cursor-pointer hover:bg-[#F5FAF8]"
          >
            로그인
          </button>

          <button
            onClick={() => navigate("/signup/terms")}
            className="text-[13px] px-[18px] py-[7px] border-none rounded-lg bg-[#1D9E75] text-white cursor-pointer font-medium hover:bg-[#0F6E56]"
          >
            회원가입
          </button>
        </div>
      )}
    </nav>
  );
}