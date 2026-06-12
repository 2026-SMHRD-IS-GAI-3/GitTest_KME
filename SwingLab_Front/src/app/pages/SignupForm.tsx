import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    residentNumber1: "",
    residentNumber2: "",
    gender: "",
    carrier: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email: "",
    password: "",
    passwordConfirm: "",
    experience: "",
  });

  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);

  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "residentNumber2") {
      const genderDigit = value.charAt(0);

      if (genderDigit === "1" || genderDigit === "3") {
        updatedData.gender = "male";
      } else if (genderDigit === "2" || genderDigit === "4") {
        updatedData.gender = "female";
      }
    }

    if (name === "phone1" && value.length === 3) {
      phone2Ref.current?.focus();
    } else if (name === "phone2" && value.length === 4) {
      phone3Ref.current?.focus();
    }

    setFormData(updatedData);

    if (name === "email") {
      setEmailChecked(false);
      setEmailAvailable(false);
    }

    if (name === "nickname") {
      setNicknameChecked(false);
      setNicknameAvailable(false);
    }
  };

  const checkEmailDuplicate = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:8090/SwingLab/EmailCheckServlet",
        {
          params: {
            email: formData.email,
          },
        }
      );

      setEmailChecked(true);

      if (res.data === "available") {
        setEmailAvailable(true);
        alert("사용 가능한 이메일입니다.");
      } else {
        setEmailAvailable(false);
        alert("이미 사용 중인 이메일입니다.");
      }
    } catch (err) {
      console.error("이메일 중복확인 실패:", err);
      alert("이메일 중복확인 실패");
    }
  };

  const checkNicknameDuplicate = async () => {
    if (!formData.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (formData.nickname.length < 2 || formData.nickname.length > 6) {
      alert("닉네임은 2~6자 이내로 입력해주세요.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:8090/SwingLab/NicknameCheckServlet",
        {
          params: {
            nickname: formData.nickname,
          },
        }
      );

      setNicknameChecked(true);

      if (res.data === "available") {
        setNicknameAvailable(true);
        alert("사용 가능한 닉네임입니다.");
      } else {
        setNicknameAvailable(false);
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (err) {
      console.error("닉네임 중복확인 실패:", err);
      alert("닉네임 중복확인 실패");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailChecked || !emailAvailable) {
      alert("이메일 중복확인을 완료해주세요.");
      return;
    }

    if (!nicknameChecked || !nicknameAvailable) {
      alert("닉네임 중복확인을 완료해주세요.");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.gender) {
      alert("성별을 선택해주세요.");
      return;
    }

    try {
      const params = new URLSearchParams();

      params.append("name", formData.name);
      params.append("email", formData.email);
      params.append("password", formData.password);
      params.append("nickname", formData.nickname);
      params.append("phone", `${formData.phone1}-${formData.phone2}-${formData.phone3}`);
      params.append("gender", formData.gender);

      const res = await axios.post(
        "http://localhost:8090/SwingLab/ConnectServlet",
        params
      );

      console.log("회원가입 결과:", res.data);

      if (res.data.status === "success") {
        alert("회원가입 성공");
        navigate("/login");
      } else {
        alert("회원가입 실패");
      }
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert("서버 연결 실패");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[600px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-5 font-medium">
            ✦ AI 기반 골프 스윙 분석
          </div>
          <h1 className="text-[40px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            SwingLab <span className="text-[#1D9E75]">회원가입</span>
          </h1>
          <p className="text-sm text-[#888780]">
            체형 정보와 골프 경력을 입력하고 맞춤 분석을 시작하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E5E5] p-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              이메일 (ID) <span className="text-[#D85A30]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
                className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-lg"
              />
              <button type="button" onClick={checkEmailDuplicate} className="px-5 py-3 bg-[#1D9E75] text-white rounded-lg">
                중복확인
              </button>
            </div>
            {emailChecked && (
              <p className={`text-xs mt-1.5 ${emailAvailable ? "text-[#1D9E75]" : "text-[#D85A30]"}`}>
                {emailAvailable ? "✓ 사용 가능한 이메일입니다" : "✗ 이미 사용 중인 이메일입니다"}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              닉네임 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="2~6자 이내"
                minLength={2}
                maxLength={6}
                required
                className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-lg"
              />
              <button type="button" onClick={checkNicknameDuplicate} className="px-5 py-3 bg-[#1D9E75] text-white rounded-lg">
                중복확인
              </button>
            </div>
            {nicknameChecked && (
              <p className={`text-xs mt-1.5 ${nicknameAvailable ? "text-[#1D9E75]" : "text-[#D85A30]"}`}>
                {nicknameAvailable ? "✓ 사용 가능한 닉네임입니다" : "✗ 이미 사용 중인 닉네임입니다"}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              비밀번호 <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상 입력해주세요"
              minLength={8}
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              비밀번호 재확인 <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg"
            />
            {formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
              <p className="text-xs text-[#D85A30] mt-1.5">비밀번호가 일치하지 않습니다</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              이름 <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              주민등록번호 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="residentNumber1"
                value={formData.residentNumber1}
                onChange={handleChange}
                placeholder="900101"
                maxLength={6}
                required
                className="w-32 px-4 py-3 border border-[#E5E5E5] rounded-lg text-center"
              />
              <span>-</span>
              <input
                type="text"
                name="residentNumber2"
                value={formData.residentNumber2}
                onChange={handleChange}
                placeholder="1"
                maxLength={1}
                required
                className="w-12 px-3 py-3 border border-[#E5E5E5] rounded-lg text-center"
              />
              <span className="text-[#888780]">******</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              성별
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} />
                <span className="ml-2 text-sm">남성</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} />
                <span className="ml-2 text-sm">여성</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              휴대폰번호 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input type="tel" name="phone1" value={formData.phone1} onChange={handleChange} placeholder="010" maxLength={3} required className="w-20 px-3 py-3 border border-[#E5E5E5] rounded-lg text-center" />
              <span>-</span>
              <input type="tel" name="phone2" value={formData.phone2} onChange={handleChange} placeholder="1234" maxLength={4} required ref={phone2Ref} className="w-24 px-3 py-3 border border-[#E5E5E5] rounded-lg text-center" />
              <span>-</span>
              <input type="tel" name="phone3" value={formData.phone3} onChange={handleChange} placeholder="5678" maxLength={4} required ref={phone3Ref} className="w-24 px-3 py-3 border border-[#E5E5E5] rounded-lg text-center" />
            </div>

            <select
              name="carrier"
              value={formData.carrier}
              onChange={handleChange}
              required
              className="w-fit px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white text-sm"
            >
              <option value="">통신사 선택</option>
              <option value="SKT">SKT</option>
              <option value="KT">KT</option>
              <option value="LG">LG</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/signup/terms")}
              className="flex-1 px-6 py-3.5 rounded-lg bg-transparent border border-[#CCCCCC]"
            >
              이전
            </button>

            <button
              type="submit"
              className="flex-1 px-6 py-3.5 rounded-lg bg-[#1D9E75] text-white"
            >
              회원가입
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-[#888780]">
            이미 계정이 있으신가요?{" "}
            <button onClick={() => navigate("/login")} className="text-[#1D9E75] font-medium hover:underline">
              로그인하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}