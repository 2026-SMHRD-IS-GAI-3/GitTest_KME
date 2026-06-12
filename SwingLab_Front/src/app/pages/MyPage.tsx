import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import semiproImage from "../../imports/semipro.PNG";
import amateurImage from "../../imports/amateur.PNG";
import defaultProfileImage from "../../imports/amateur.PNG";

type MyPageInfo = {
  name: string;
  email: string;
  bodyCode: string;
  armLengthType: string;
  handType: string;
};

export function MyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<string>(defaultProfileImage);
  const [myPageInfo, setMyPageInfo] = useState<MyPageInfo | null>(null);

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
        console.log("마이페이지 정보:", res.data);

        if (!res.data.success) {
          alert(res.data.message || "마이페이지 정보를 불러오지 못했습니다.");
          return;
        }

        setMyPageInfo(res.data.data);
      })
      .catch((err) => {
        console.error("마이페이지 정보 조회 실패:", err);
        alert("마이페이지 정보를 불러오지 못했습니다.");
      });
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setProfileImage(URL.createObjectURL(file));
  };

  const convertBodyCode = (code: string) => {
    switch (code) {
      case "BT01":
        return "장팔·넓은어깨형";
      case "BT02":
        return "장팔·좁은어깨형";
      case "BT03":
        return "단팔·넓은어깨형";
      case "BT04":
        return "단팔·좁은어깨형";
      case "BT05":
        return "균형형";
      default:
        return "체형정보 없음";
    }
  };

  const convertHandType = (type: string) => {
    if (type === "RIGHT") return "오른손잡이";
    if (type === "LEFT") return "왼손잡이";
    if (type === "오른손") return "오른손잡이";
    if (type === "왼손") return "왼손잡이";
    return type;
  };

  const quickMenus = [
    { icon: "📹", label: "스윙 분석", sub: "영상 업로드", path: "/upload" },
    { icon: "📊", label: "분석 기록", sub: "과거 결과 보기", path: "/history" },
  ];

  const stats = [
    { icon: "📈", value: "+16점", label: "지난달 대비", color: "#1D9E75" },
    { icon: "🎯", value: "12회", label: "총 분석 횟수", color: "#1A1A1A" },
    { icon: "⭐", value: "83점", label: "최고 점수", color: "#1A1A1A" },
    { icon: "🔥", value: "7일", label: "연속 연습", color: "#D85A30" },
  ];

  const recentAnalyses = [
    {
      date: "2026년 5월 15일",
      grade: "세미프로",
      score: 74,
      img: semiproImage,
      badgeBg: "#E1F5EE",
      badgeText: "#0F6E56",
    },
    {
      date: "2026년 5월 8일",
      grade: "아마추어",
      score: 58,
      img: amateurImage,
      badgeBg: "#FAEEDA",
      badgeText: "#854F0B",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="mb-5">
          <p className="text-xs text-[#1D9E75] font-medium mb-1">✦ 내 정보</p>
          <h1 className="text-xl font-bold text-[#1A1A1A]">마이페이지</h1>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={profileImage}
                alt="프로필 사진"
                className="w-20 h-20 rounded-full object-cover bg-[#E1F5EE]"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#1D9E75] text-white rounded-full flex items-center justify-center hover:bg-[#0F6E56] border-2 border-white"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-[#1A1A1A] mb-0.5">
                {myPageInfo ? `${myPageInfo.name} 님` : "불러오는 중..."}
              </h2>

              <p className="text-xs text-[#888780] mb-2">
                {myPageInfo ? myPageInfo.email : ""}
              </p>

              <span className="inline-block px-2.5 py-1 bg-[#E1F5EE] text-[#0F6E56] rounded-lg text-xs font-medium leading-5">
                {myPageInfo ? (
                  <>
                    {convertBodyCode(myPageInfo.bodyCode)}
                    <br />
                    {convertHandType(myPageInfo.handType)}
                  </>
                ) : (
                  "정보 조회 중"
                )}
              </span>
            </div>

            <button
              onClick={() => navigate("/password/confirm")}
              className="flex-shrink-0 px-3 py-2 border border-[#CCCCCC] rounded-lg text-xs text-[#1A1A1A] font-medium hover:bg-[#F5FAF8]"
            >
              프로필 수정
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {quickMenus.map((m) => (
            <button
              key={m.label}
              onClick={() => navigate(m.path)}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-5 hover:border-[#1D9E75] hover:bg-[#F5FAF8] transition-all text-left"
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <p className="font-bold text-[#1A1A1A] text-base leading-tight mb-1">
                {m.label}
              </p>
              <p className="text-sm text-[#888780] leading-tight">{m.sub}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <h3 className="font-bold text-[#1A1A1A] mb-4">나의 성장 통계</h3>

          <div className="grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#F5FAF8] rounded-xl p-3 text-center"
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div
                  className="font-bold text-sm mb-0.5"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-[10px] text-[#888780] leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1A1A1A]">최근 스윙 분석</h3>
            <button
              onClick={() => navigate("/history")}
              className="text-xs text-[#1D9E75] font-medium"
            >
              전체 보기 →
            </button>
          </div>

          <div className="space-y-3">
            {recentAnalyses.map((item) => (
              <div
                key={item.date}
                className="flex items-center gap-3 p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]"
              >
                <img
                  src={item.img}
                  alt={item.grade}
                  className="w-12 h-12 object-contain flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#888780] mb-1">{item.date}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.badgeText,
                      }}
                    >
                      {item.grade}
                    </span>
                    <span className="text-xs text-[#888780]">
                      평균 {item.score}점
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/analysis/result")}
                  className="flex-shrink-0 px-3 py-1.5 border border-[#1D9E75] text-[#1D9E75] rounded-lg text-xs font-medium hover:bg-[#E1F5EE]"
                >
                  결과 보기
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.clear();
            window.dispatchEvent(new Event("loginStateChange"));
            navigate("/login");
          }}
          className="w-full py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#888780] font-medium hover:bg-[#F5F5F5] mb-6"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}