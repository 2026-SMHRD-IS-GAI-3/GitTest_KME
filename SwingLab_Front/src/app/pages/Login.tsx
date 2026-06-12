import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import backgroundVideo from "../../imports/____3.mp4";

export function Login() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.email === "admin@swinglab.com" &&
      formData.password === "admin1234"
    ) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("isAdmin", "true");

      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/admin");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8090/SwingLab/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("로그인 결과:", res.data);

      if (res.data.success === true) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.removeItem("isAdmin");

        sessionStorage.setItem("userId", String(res.data.userId));
        sessionStorage.setItem("userEmail", res.data.email);
        sessionStorage.setItem("userName", res.data.name);
        sessionStorage.setItem("userNickname", res.data.nickname);

        window.dispatchEvent(new Event("loginStateChange"));

        navigate("/dashboard");
      } else {
        alert(res.data.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("서버 연결 실패");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      <div className="relative h-full flex flex-col items-center justify-center px-6 z-10">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
          >
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6 text-center">
              로그인
            </h1>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                아이디
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                required
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#1D9E75] text-white font-bold hover:bg-[#0F6E56] active:scale-95 transition-all mb-4"
            >
              로그인
            </button>

            <div className="flex items-center justify-center gap-4 text-sm">
              <button
                type="button"
                onClick={() => navigate("/signup/terms")}
                className="text-[#1A1A1A] hover:text-[#1D9E75] font-medium"
              >
                회원가입
              </button>
              <span className="text-[#CCCCCC]">|</span>
              <button
                type="button"
                onClick={() => navigate("/find-account")}
                className="text-[#1A1A1A] hover:text-[#1D9E75] font-medium"
              >
                ID·PW 찾기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}