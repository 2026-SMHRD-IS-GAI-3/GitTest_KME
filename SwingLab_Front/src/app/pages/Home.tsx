import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import backgroundVideo from "../../imports/_________.mp4";

export function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const handleStartClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6">
          <div className="inline-block text-xs px-4 py-2 rounded-lg bg-white/20 text-white mb-5 font-medium backdrop-blur-sm">
            ✦ AI 기반 골프 스윙 분석
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            SwingLab
          </h1>

          <p className="text-lg text-white/90 leading-relaxed">
            AI가 분석하는 나만의 골프 스윙
            <br />
            더 정확한 자세, 더 나은 실력
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={handleStartClick}
            className="w-full py-4 rounded-xl bg-[#1D9E75] text-white font-bold text-base shadow-lg hover:bg-[#0F6E56] active:scale-95 transition-all"
          >
            {isLoggedIn ? "대시보드로 이동" : "시작하기"}
          </button>

          {!isLoggedIn && (
            <button
              type="button"
              onClick={() => navigate("/signup/terms")}
              className="w-full py-4 rounded-xl bg-white/90 text-[#1A1A1A] font-bold text-base shadow-lg hover:bg-white active:scale-95 transition-all"
            >
              회원가입
            </button>
          )}
        </div>
      </div>
    </div>
  );
}