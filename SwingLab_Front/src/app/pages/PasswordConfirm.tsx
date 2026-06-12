import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export function PasswordConfirm() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const userEmail = sessionStorage.getItem("userEmail");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    if (password.length < 1) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8090/SwingLab/passwordConfirm",
        {
          email: userEmail,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("비밀번호 확인 결과:", res.data);

      if (res.data.success === true) {
        navigate("/profile/edit");
      } else {
        setError(res.data.message || "비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("비밀번호 확인 오류:", err);
      setError("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[500px] mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-5 font-medium">
            ✦ 본인 확인
          </div>
          <h1 className="text-[40px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            <span className="text-[#1D9E75]">비밀번호</span> 확인
          </h1>
          <p className="text-base text-[#888780]">
            회원 정보를 안전하게 보호하기 위해 비밀번호를 다시 입력해주세요
          </p>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E5E5E5] p-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E1F5EE] mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <p className="text-sm text-[#888780]">
              로그인한 계정:{" "}
              <strong className="text-[#1A1A1A]">
                {userEmail || "로그인 정보 없음"}
              </strong>
            </p>
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              비밀번호 <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
              autoFocus
            />

            {error && (
              <p className="text-xs text-[#D85A30] mt-2 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/mypage")}
              className="flex-1 px-6 py-3.5 rounded-lg bg-white border border-[#CCCCCC] text-[#1A1A1A] font-medium cursor-pointer hover:bg-[#F5FAF8]"
            >
              취소
            </button>

            <button
              type="submit"
              className="flex-1 px-6 py-3.5 rounded-lg bg-[#1D9E75] text-white font-medium cursor-pointer hover:bg-[#0F6E56] border-none"
            >
              확인
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
            <p className="text-xs text-[#888780] leading-relaxed">
              💡 비밀번호를 잊으셨나요? 로그아웃 후 로그인 페이지에서 "비밀번호
              찾기"를 이용하세요.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}