import { useState } from "react";
import { useNavigate } from "react-router";

export function Terms() {
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleAllCheck = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  const handleIndividualCheck = (
    name: "terms" | "privacy" | "marketing",
    checked: boolean
  ) => {
    const newAgreements = {
      ...agreements,
      [name]: checked,
    };

    newAgreements.all =
      newAgreements.terms &&
      newAgreements.privacy &&
      newAgreements.marketing;

    setAgreements(newAgreements);
  };

  const handleNext = () => {
    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    navigate("/signup/form");
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[700px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-5 font-medium">
            ✦ AI 기반 골프 스윙 분석
          </div>
          <h1 className="text-[40px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            SwingLab <span className="text-[#1D9E75]">약관 동의</span>
          </h1>
          <p className="text-base text-[#888780]">
            서비스 이용을 위해 약관에 동의해주세요
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10">
          <div className="pb-6 mb-6 border-b border-[#E5E5E5]">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={agreements.all}
                onChange={(e) => handleAllCheck(e.target.checked)}
                className="w-6 h-6 text-[#1D9E75] border-2 border-[#CCCCCC] rounded focus:ring-[#1D9E75] cursor-pointer"
              />
              <span className="ml-3 text-lg font-bold text-[#1A1A1A] group-hover:text-[#1D9E75]">
                전체 동의
              </span>
            </label>
            <p className="text-sm text-[#888780] mt-2 ml-9">
              서비스 이용약관, 개인정보 수집 및 이용, 마케팅 정보 수신에 모두 동의합니다.
            </p>
          </div>

          <div className="space-y-5">
            <div className="border border-[#E5E5E5] rounded-xl p-5">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={(e) =>
                    handleIndividualCheck("terms", e.target.checked)
                  }
                  className="w-5 h-5 text-[#1D9E75] border-2 border-[#CCCCCC] rounded focus:ring-[#1D9E75] cursor-pointer mt-0.5"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1A1A1A] group-hover:text-[#1D9E75]">
                      서비스 이용약관 동의
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-[#D85A30] text-white rounded font-medium">
                      필수
                    </span>
                  </div>
                  <div className="mt-3 p-4 bg-[#F5FAF8] rounded-lg text-sm text-[#555555] leading-relaxed max-h-[150px] overflow-y-auto">
                    <p className="font-medium mb-2">제1조 (목적)</p>
                    <p className="mb-3">
                      본 약관은 SwingLab이 제공하는 AI 기반 골프 스윙 분석 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                    </p>
                    <p className="font-medium mb-2">제2조 (서비스의 제공)</p>
                    <p className="mb-3">
                      회사는 AI 기술을 활용한 골프 스윙 분석, 체형별 맞춤 코칭, 성장 추적 등의 서비스를 제공합니다.
                    </p>
                    <p className="font-medium mb-2">제3조 (회원가입)</p>
                    <p className="mb-3">
                      서비스 이용을 위해서는 회원가입이 필요하며, 가입 시 제공하는 정보는 정확하고 최신의 정보여야 합니다.
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div className="border border-[#E5E5E5] rounded-xl p-5">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={(e) =>
                    handleIndividualCheck("privacy", e.target.checked)
                  }
                  className="w-5 h-5 text-[#1D9E75] border-2 border-[#CCCCCC] rounded focus:ring-[#1D9E75] cursor-pointer mt-0.5"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1A1A1A] group-hover:text-[#1D9E75]">
                      개인정보 수집 및 이용 동의
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-[#D85A30] text-white rounded font-medium">
                      필수
                    </span>
                  </div>
                  <div className="mt-3 p-4 bg-[#F5FAF8] rounded-lg text-sm text-[#555555] leading-relaxed max-h-[150px] overflow-y-auto">
                    <p className="font-medium mb-2">1. 수집하는 개인정보 항목</p>
                    <p className="mb-3">
                      필수항목: 이름, 성별, 휴대폰번호, 이메일, 비밀번호
                    </p>
                    <p className="font-medium mb-2">2. 개인정보 이용 목적</p>
                    <p className="mb-3">
                      회원 가입 및 관리, 서비스 제공, AI 스윙 분석 서비스 제공
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div className="border border-[#E5E5E5] rounded-xl p-5">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(e) =>
                    handleIndividualCheck("marketing", e.target.checked)
                  }
                  className="w-5 h-5 text-[#1D9E75] border-2 border-[#CCCCCC] rounded focus:ring-[#1D9E75] cursor-pointer mt-0.5"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1A1A1A] group-hover:text-[#1D9E75]">
                      마케팅 정보 수신 동의
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-[#888780] text-white rounded font-medium">
                      선택
                    </span>
                  </div>
                  <div className="mt-3 p-4 bg-[#F5FAF8] rounded-lg text-sm text-[#555555] leading-relaxed">
                    새로운 서비스, 이벤트, 프로모션 정보를 이메일 및 SMS로 받아보실 수 있습니다.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3.5 rounded-lg bg-transparent border border-[#CCCCCC] text-[#1A1A1A] font-medium cursor-pointer hover:bg-[#F5FAF8]"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!agreements.terms || !agreements.privacy}
              className={`flex-1 px-6 py-3.5 rounded-lg font-medium border-none ${
                agreements.terms && agreements.privacy
                  ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56] cursor-pointer"
                  : "bg-[#CCCCCC] text-[#888780] cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-[#888780]">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#1D9E75] font-medium hover:underline"
            >
              로그인하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}