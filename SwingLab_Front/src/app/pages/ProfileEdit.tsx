import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
  height: string;
  weight: string;
  bodyType: string;
};

export function ProfileEdit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    height: "",
    weight: "",
    bodyType: "BT01",
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userEmail = sessionStorage.getItem("userEmail");

    if (!isLoggedIn || !userEmail) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8090/SwingLab/mypageInfo", {
        params: {
          email: userEmail,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("프로필 수정 조회:", res.data);

        if (!res.data.success) {
          alert(res.data.message || "회원 정보를 불러오지 못했습니다.");
          return;
        }

        const data = res.data.data;

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          height: data.height ? String(data.height) : "",
          weight: data.weight ? String(data.weight) : "",
          bodyType: data.bodyCode || "BT01",
        });

        setIsChanged(false);
      })
      .catch((err) => {
        console.error("프로필 정보 조회 실패:", err);
        alert("회원 정보를 불러오지 못했습니다.");
      });
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsChanged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentEmail = sessionStorage.getItem("userEmail");

    if (!currentEmail) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8090/SwingLab/updateProfile",
        {
          currentEmail: currentEmail,
          phone: formData.phone,
          height: Number(formData.height),
          weight: Number(formData.weight),
          bodyCode: formData.bodyType,
        },
        {
          withCredentials: true,
        }
      );

      console.log("프로필 수정 결과:", res.data);

      if (res.data.success === true) {

        alert("프로필이 성공적으로 수정되었습니다!");
        navigate("/mypage");
      } else {
        alert(res.data.message || "프로필 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("프로필 수정 오류:", err);
      alert("서버 연결 실패");
    }
  };

  const bodyTypeInfo = {
    BT01: { name: "BT01", sub: "장팔·넓은어깨형" },
    BT02: { name: "BT02", sub: "장팔·좁은어깨형" },
    BT03: { name: "BT03", sub: "단팔·넓은어깨형" },
    BT04: { name: "BT04", sub: "단팔·좁은어깨형" },
    BT05: { name: "BT05", sub: "균형형" },
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4">
      <div className="max-w-[430px] mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-5">
          <p className="text-xs text-[#1D9E75] font-medium mb-1">
            ✦ 내 정보 수정
          </p>
          <h1 className="text-xl font-bold text-[#1A1A1A]">
            <span className="text-[#1D9E75]">프로필</span> 수정
          </h1>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E5E5E5] p-5"
        >
          {/* 이름 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              이름
            </label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-[#F5FAF8] text-[#888780] cursor-not-allowed"
            />
            <p className="text-xs text-[#888780] mt-1.5">
              이름은 수정할 수 없습니다
            </p>
          </div>

          {/* 이메일 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              이메일 (ID) <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-[#F5FAF8] text-[#888780] cursor-not-allowed"
            />
            <p className="text-xs text-[#888780] mt-1.5">
              이메일은 수정할 수 없습니다
            </p>
          </div>

          {/* 휴대폰번호 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              휴대폰번호 <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
            />
          </div>

          {/* 키 / 몸무게 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              신체 정보 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="키 (cm)"
                  required
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="몸무게 (kg)"
                  required
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 체형 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              체형 코드 <span className="text-[#D85A30]">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(bodyTypeInfo).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, bodyType: key });
                    setIsChanged(true);
                  }}
                  className={`px-4 py-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    formData.bodyType === key
                      ? "border-[#1D9E75] bg-[#E1F5EE]"
                      : "border-[#E5E5E5] bg-white hover:border-[#1D9E75]"
                  }`}
                >
                  <span
                    className={`font-bold text-sm ${
                      formData.bodyType === key
                        ? "text-[#1D9E75]"
                        : "text-[#1A1A1A]"
                    }`}
                  >
                    {info.name}
                  </span>
                  <span className="text-sm text-[#888780]">{info.sub}</span>
                  {formData.bodyType === key && (
                    <svg
                      className="w-4 h-4 text-[#1D9E75] ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 비밀번호 변경 안내 */}
          <div className="mb-8 p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔐</span>
              <div className="flex-1">
                <div className="font-bold text-[#1A1A1A] mb-1">
                  비밀번호 변경
                </div>
                <div className="text-sm text-[#888780] mb-3">
                  비밀번호를 변경하시려면 별도 페이지에서 진행하세요
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/password/change")}
                  className="px-4 py-2 rounded-lg border border-[#CCCCCC] text-[#1A1A1A] text-sm font-medium hover:bg-white"
                >
                  비밀번호 변경하기
                </button>
              </div>
            </div>
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
              disabled={!isChanged}
              className={`flex-1 px-6 py-3.5 rounded-lg font-medium border-none ${
                isChanged
                  ? "bg-[#1D9E75] text-white cursor-pointer hover:bg-[#0F6E56]"
                  : "bg-[#CCCCCC] text-[#888780] cursor-not-allowed"
              }`}
            >
              저장하기
            </button>
          </div>
        </form>

        {/* 회원 탈퇴 */}
        <div className="mt-6 text-center">
          <button className="text-sm text-[#D85A30] hover:underline">
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}