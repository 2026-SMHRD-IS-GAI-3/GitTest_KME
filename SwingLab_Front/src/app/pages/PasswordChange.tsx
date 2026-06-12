import { useState } from "react";
import { useNavigate } from "react-router";

export function PasswordChange() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 에러 초기화
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "비밀번호는 영문을 포함해야 합니다.";
    }
    if (!/[0-9]/.test(password)) {
      return "비밀번호는 숫자를 포함해야 합니다.";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    };

    // 현재 비밀번호 확인
    if (!formData.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
      hasError = true;
    }

    // 새 비밀번호 검증
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
      hasError = true;
    }

    // 새 비밀번호 확인
    if (formData.newPassword !== formData.newPasswordConfirm) {
      newErrors.newPasswordConfirm = "비밀번호가 일치하지 않습니다.";
      hasError = true;
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "현재 비밀번호와 다른 비밀번호를 입력해주세요.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // 실제로는 서버로 데이터 전송
    console.log("비밀번호 변경 데이터:", formData);
    alert("비밀번호가 성공적으로 변경되었습니다!");
    navigate("/mypage");
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[600px] mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-5 font-medium">
            ✦ 보안 설정
          </div>
          <h1 className="text-[40px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            <span className="text-[#1D9E75]">비밀번호</span> 변경
          </h1>
          <p className="text-base text-[#888780]">
            새로운 비밀번호를 설정하세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E5E5] p-10">
          {/* 안내 메시지 */}
          <div className="mb-8 p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔐</span>
              <div className="flex-1">
                <div className="font-bold text-[#1A1A1A] mb-2">비밀번호 보안 요구사항</div>
                <ul className="text-sm text-[#888780] space-y-1">
                  <li>• 8자 이상 입력</li>
                  <li>• 영문 포함</li>
                  <li>• 숫자 포함</li>
                  <li>• 현재 비밀번호와 다른 비밀번호</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 현재 비밀번호 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              현재 비밀번호 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="현재 비밀번호를 입력하세요"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888780] hover:text-[#1A1A1A]"
              >
                {showPasswords.current ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-[#D85A30] mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* 새 비밀번호 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              새 비밀번호 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888780] hover:text-[#1A1A1A]"
              >
                {showPasswords.new ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-[#D85A30] mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              새 비밀번호 확인 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="newPasswordConfirm"
                value={formData.newPasswordConfirm}
                onChange={handleChange}
                placeholder="새 비밀번호를 다시 입력하세요"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888780] hover:text-[#1A1A1A]"
              >
                {showPasswords.confirm ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.newPasswordConfirm && (
              <p className="text-xs text-[#D85A30] mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.newPasswordConfirm}
              </p>
            )}
            {formData.newPassword &&
              formData.newPasswordConfirm &&
              formData.newPassword === formData.newPasswordConfirm &&
              !errors.newPasswordConfirm && (
                <p className="text-xs text-[#1D9E75] mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  비밀번호가 일치합니다
                </p>
              )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile/edit")}
              className="flex-1 px-6 py-3.5 rounded-lg bg-white border border-[#CCCCCC] text-[#1A1A1A] font-medium cursor-pointer hover:bg-[#F5FAF8]"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 rounded-lg bg-[#1D9E75] text-white font-medium cursor-pointer hover:bg-[#0F6E56] border-none"
            >
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
