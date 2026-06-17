import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import masterImage from "../../imports/master.PNG";
import proImage from "../../imports/pro.PNG";
import semiproImage from "../../imports/semipro.PNG";
import amateurImage from "../../imports/amateur.PNG";
import rookieImage from "../../imports/rookie.PNG";

const GRADES = [
  { grade: "마스터", range: "90 ~ 100점", bg: "#EDE9FE", text: "#3C3489", img: masterImage },
  { grade: "프로", range: "75 ~ 89점", bg: "#E6F1FB", text: "#0C447C", img: proImage },
  { grade: "세미프로", range: "60 ~ 74점", bg: "#E1F5EE", text: "#1D9E75", img: semiproImage },
  { grade: "아마추어", range: "40 ~ 59점", bg: "#FAEEDA", text: "#854F0B", img: amateurImage },
  { grade: "루키", range: "0 ~ 39점", bg: "#F5F5F5", text: "#888780", img: rookieImage },
];

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGradeTable, setShowGradeTable] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    handleStorageChange();

    window.addEventListener("loginStateChange", handleStorageChange);

    return () => {
      window.removeEventListener("loginStateChange", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("loginStateChange"));
    setShowMenu(false);
    navigate("/");
  };

  const showBackButton = () => {
    const path = location.pathname;
    return path !== "/" && path !== "/dashboard";
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {showBackButton() && (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              aria-label="뒤로가기"
            >
              <svg
                className="w-6 h-6 text-[#1A1A1A]"
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
            className="flex items-center"
          >
            <span
              className="text-xl text-[#0F6E56] tracking-wide"
              style={{
                fontFamily: "Nasalization, sans-serif",
                fontWeight: "700",
              }}
            >
              SwingLab
            </span>
          </Link>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          aria-label="메뉴"
        >
          <svg
            className="w-6 h-6 text-[#1A1A1A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          style={{
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onClick={() => setShowMenu(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">

              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
                <span className="text-lg font-bold text-[#1D9E75]">
                  메뉴
                </span>

                <button
                  onClick={() => setShowMenu(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                >
                  <svg
                    className="w-6 h-6 text-[#1A1A1A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col">
                {isLoggedIn ? (
                  <>
                    <div className="py-2">

                      <button
                        onClick={() => {
                          navigate("/body-info");
                          setShowMenu(false);
                        }}
                        className="w-full h-16 px-5 flex items-center text-left text-base text-[#1A1A1A] hover:bg-[#F5FAF8] border-b border-[#F0F0F0]"
                      >
                        체형 진단
                      </button>

                      <button
                        onClick={() => {
                          navigate("/community");
                          setShowMenu(false);
                        }}
                        className="w-full h-16 px-5 flex items-center text-left text-base text-[#1A1A1A] hover:bg-[#F5FAF8] border-b border-[#F0F0F0]"
                      >
                        커뮤니티
                      </button>

                      <button
                        onClick={() => {
                          setShowGradeTable(true);
                          setShowMenu(false);
                        }}
                        className="w-full h-16 px-5 flex items-center text-left text-base text-[#1A1A1A] hover:bg-[#F5FAF8] border-b border-[#F0F0F0]"
                      >
                        전체 등급표
                      </button>

                    </div>

                    <div className="mt-auto border-t border-[#E5E5E5] py-2 pb-20">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-4 text-base text-red-600 hover:bg-[#FEE2E2]"
                      >
                        로그아웃
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-base text-[#1A1A1A] hover:bg-[#F5FAF8]"
                    >
                      로그인
                    </button>

                    <button
                      onClick={() => {
                        navigate("/signup/terms");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-base text-[#1A1A1A] hover:bg-[#F5FAF8]"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {showGradeTable && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowGradeTable(false)}
          />

          <div className="relative w-full max-w-[430px] bg-white rounded-t-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-[#1A1A1A]">
                전체 등급표
              </h2>

              <button
                onClick={() => setShowGradeTable(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F5] text-[#888780]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#888780] mb-4">
              최근 분석 평균 점수를 기준으로 등급이 결정됩니다.
            </p>

            <div className="space-y-3">
              {GRADES.map((g) => (
                <div
                  key={g.grade}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{
                    backgroundColor: g.bg,
                    borderColor: g.text + "30",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={g.img}
                      alt={g.grade}
                      className="w-10 h-10 object-contain"
                    />

                    <span
                      className="font-bold"
                      style={{ color: g.text }}
                    >
                      {g.grade}
                    </span>
                  </div>

                  <span
                    className="font-medium text-sm"
                    style={{ color: g.text }}
                  >
                    {g.range}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}