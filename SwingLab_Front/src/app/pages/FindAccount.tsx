import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type Tab = "id" | "pw";
type PwStep = "verify" | "reset" | "done";

export function FindAccount() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("id");

  const [idName, setIdName] = useState("");
  const [idPhone, setIdPhone] = useState("");
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [idError, setIdError] = useState("");

  const [pwStep, setPwStep] = useState<PwStep>("verify");
  const [pwEmail, setPwEmail] = useState("");
  const [pwName, setPwName] = useState("");
  const [pwPhone, setPwPhone] = useState("");
  const [pwError, setPwError] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [pwResetError, setPwResetError] = useState("");

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");

    if (numbers.length < 4) {
      return numbers;
    }

    if (numbers.length < 8) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const maskEmail = (email: string) => {
    return email.replace(
      /(.{2})(.*)(@.*)/,
      (_, a, b, c) => a + "*".repeat(b.length) + c
    );
  };

  const handleFindId = async () => {
    setIdError("");
    setFoundEmail(null);

    try {
      const res = await axios.get(
        "http://localhost:8090/SwingLab/FindEmailService",
        {
          params: {
            name: idName.trim(),
            phone: idPhone,
          },
        }
      );

      console.log("아이디 찾기 결과:", res.data);

      if (res.data === "fail") {
        setIdError("입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
        return;
      }

      setFoundEmail(maskEmail(String(res.data)));
    } catch (err) {
      console.error("아이디 찾기 오류:", err);
      setIdError("서버 연결 실패");
    }
  };

  const handleVerifyPw = async () => {
    setPwError("");

    try {
      const res = await axios.get(
        "http://localhost:8090/SwingLab/FindPasswordService",
        {
          params: {
            email: pwEmail.trim(),
            name: pwName.trim(),
            phone: pwPhone,
          },
        }
      );

      console.log("비밀번호 찾기 본인확인 결과:", res.data);

      if (res.data === "success") {
        setPwStep("reset");
      } else {
        setPwError("입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("비밀번호 찾기 오류:", err);
      setPwError("서버 연결 실패");
    }
  };

  const handleResetPw = async () => {
    setPwResetError("");

    if (newPw.length < 8) {
      setPwResetError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (newPw !== newPwConfirm) {
      setPwResetError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const params = new URLSearchParams();

      params.append("email", pwEmail.trim());
      params.append("newPw", newPw);

      const res = await axios.post(
        "http://localhost:8090/SwingLab/ResetPasswordService",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("비밀번호 변경 결과:", res.data);

      if (res.data === "success") {
        setPwStep("done");
      } else {
        setPwResetError("비밀번호 변경 실패");
      }
    } catch (err) {
      console.error("비밀번호 변경 오류:", err);
      setPwResetError("서버 연결 실패");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] flex flex-col py-16 px-5">
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 text-[#888780] text-sm mb-8"
        >
          ← 로그인으로 돌아가기
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">
            <span className="text-[#1D9E75]">계정</span> 찾기
          </h1>
          <p className="text-sm text-[#888780]">
            가입 시 등록한 정보로 계정을 찾을 수 있습니다
          </p>
        </div>

        <div className="flex rounded-xl bg-[#E5E5E5] p-1 mb-6">
          <button
            onClick={() => setTab("id")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-none ${
              tab === "id"
                ? "bg-white text-[#1D9E75] shadow-sm"
                : "text-[#888780]"
            }`}
          >
            아이디 찾기
          </button>

          <button
            onClick={() => {
              setTab("pw");
              setPwStep("verify");
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-none ${
              tab === "pw"
                ? "bg-white text-[#1D9E75] shadow-sm"
                : "text-[#888780]"
            }`}
          >
            비밀번호 찾기
          </button>
        </div>

        {tab === "id" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                이름 <span className="text-[#D85A30]">*</span>
              </label>
              <input
                type="text"
                value={idName}
                onChange={(e) => setIdName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                휴대폰번호 <span className="text-[#D85A30]">*</span>
              </label>
              <input
                type="tel"
                value={idPhone}
                onChange={(e) =>
                  setIdPhone(formatPhoneNumber(e.target.value))
                }
                placeholder="010-1234-5678"
                maxLength={13}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
              />
            </div>

            {idError && (
              <p className="text-sm text-[#EF4444] mb-4">{idError}</p>
            )}

            {foundEmail && (
              <div className="mb-5 p-4 rounded-xl bg-[#E1F5EE] border border-[#9FE1CB]">
                <div className="text-xs text-[#0F6E56] mb-1 font-medium">
                  찾은 아이디
                </div>
                <div className="text-base font-bold text-[#1D9E75]">
                  {foundEmail}
                </div>
              </div>
            )}

            <button
              onClick={handleFindId}
              disabled={!idName || !idPhone}
              className={`w-full py-3.5 rounded-xl font-bold text-sm border-none ${
                idName && idPhone
                  ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
                  : "bg-[#E5E5E5] text-[#888780] cursor-not-allowed"
              }`}
            >
              아이디 찾기
            </button>
          </div>
        )}

        {tab === "pw" && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            {pwStep === "verify" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    이메일 <span className="text-[#D85A30]">*</span>
                  </label>
                  <input
                    type="email"
                    value={pwEmail}
                    onChange={(e) => setPwEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    이름 <span className="text-[#D85A30]">*</span>
                  </label>
                  <input
                    type="text"
                    value={pwName}
                    onChange={(e) => setPwName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    휴대폰번호 <span className="text-[#D85A30]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={pwPhone}
                    onChange={(e) =>
                      setPwPhone(formatPhoneNumber(e.target.value))
                    }
                    placeholder="010-1234-5678"
                    maxLength={13}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                  />
                </div>

                {pwError && (
                  <p className="text-sm text-[#EF4444] mb-4">{pwError}</p>
                )}

                <button
                  onClick={handleVerifyPw}
                  disabled={!pwEmail || !pwName || !pwPhone}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm border-none ${
                    pwEmail && pwName && pwPhone
                      ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
                      : "bg-[#E5E5E5] text-[#888780] cursor-not-allowed"
                  }`}
                >
                  본인 확인
                </button>
              </>
            )}

            {pwStep === "reset" && (
              <>
                <div className="mb-5 p-3 rounded-xl bg-[#E1F5EE] border border-[#9FE1CB]">
                  <span className="text-sm text-[#0F6E56] font-medium">
                    ✓ 본인 확인이 완료되었습니다
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    새 비밀번호 <span className="text-[#D85A30]">*</span>
                  </label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="8자 이상 입력"
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    새 비밀번호 확인{" "}
                    <span className="text-[#D85A30]">*</span>
                  </label>
                  <input
                    type="password"
                    value={newPwConfirm}
                    onChange={(e) => setNewPwConfirm(e.target.value)}
                    placeholder="비밀번호 재입력"
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                  />
                </div>

                {pwResetError && (
                  <p className="text-sm text-[#EF4444] mb-4">
                    {pwResetError}
                  </p>
                )}

                <button
                  onClick={handleResetPw}
                  disabled={!newPw || !newPwConfirm}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm border-none ${
                    newPw && newPwConfirm
                      ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
                      : "bg-[#E5E5E5] text-[#888780] cursor-not-allowed"
                  }`}
                >
                  비밀번호 변경
                </button>
              </>
            )}

            {pwStep === "done" && (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                  비밀번호 변경 완료!
                </h3>
                <p className="text-sm text-[#888780] mb-6">
                  새 비밀번호로 로그인해 주세요.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 rounded-xl bg-[#1D9E75] text-white font-bold text-sm border-none hover:bg-[#0F6E56]"
                >
                  로그인하러 가기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}