import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  scoreToGrade,
  gradeImage,
  nextGradeInfo,
} from "../data/analysisData";

type HistoryItem = {
  analysisId: number;
  userId: number;
  clubType: string;
  totalScore: number;
  xFactor: number;
  analysisStatus: string;
  createdAt: string;
};

export function Dashboard() {
  const navigate = useNavigate();

  const [selectedClub, setSelectedClub] = useState<"드라이버" | "아이언">(
    "드라이버"
  );

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userId = sessionStorage.getItem("userId");

    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    loadHistory(userId);
  }, [navigate]);

  const loadHistory = async (userId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:8090/SwingLab/historyList?userId=${userId}`,
        {
          withCredentials: true,
        }
      );

      console.log("대시보드 기록 조회:", res.data);

      if (res.data.success === true) {
        setHistoryList(res.data.data || []);
      }
    } catch (error) {
      console.error("대시보드 기록 조회 실패:", error);
    }
  };

  const getClubDb = (club: "드라이버" | "아이언") => {
    return club === "드라이버" ? "DRIVER" : "IRON";
  };

  const calcDbAvgByClub = (club: "드라이버" | "아이언") => {
    const clubRecords = historyList.filter(
      (record) => record.clubType === getClubDb(club)
    );

    if (clubRecords.length === 0) {
      return 0;
    }

    return Math.round(
      clubRecords.reduce(
        (sum, record) => sum + Number(record.totalScore || 0),
        0
      ) / clubRecords.length
    );
  };

  const userName = sessionStorage.getItem("userName") || "회원";

  const avgScore = calcDbAvgByClub(selectedClub);
  const grade = scoreToGrade(avgScore);
  const gradeImg = gradeImage(grade);
  const next = nextGradeInfo(avgScore);

  const handleSwingAnalyzeClick = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8090/SwingLab/checkBodyProfile",
        {
          withCredentials: true,
        }
      );

      console.log("체형 분석 여부:", res.data);

      if (!res.data.success) {
        alert(res.data.message || "로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      if (res.data.exists) {
        navigate("/upload");
      } else {
        alert("스윙 분석 전 최초 1회 체형 분석이 필요합니다.");
        navigate("/body-info");
      }
    } catch (err) {
      console.error("체형 분석 여부 확인 실패:", err);
      alert("체형 분석 여부 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-[#F5FAF8]">
      <div className="max-w-[430px] mx-auto px-4 py-4 flex flex-col gap-3">
        {/* 헤더 */}
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] mb-0.5">
            안녕하세요, <span className="text-[#1D9E75]">{userName}</span> 님
          </h1>
          <p className="text-sm text-[#888780]">
            오늘도 스윙 연습을 시작해볼까요?
          </p>
        </div>

        {/* 현재 등급 */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-xl">
                🏆
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A]">
                현재 등급
              </h3>
            </div>

            <div className="flex rounded-lg border border-[#E5E5E5] overflow-hidden">
              {(["드라이버", "아이언"] as const).map((club) => (
                <button
                  key={club}
                  onClick={() => setSelectedClub(club)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedClub === club
                      ? "bg-[#1D9E75] text-white"
                      : "bg-white text-[#888780]"
                  }`}
                >
                  {club}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <img
                src={gradeImg}
                alt={grade}
                className="h-24 w-auto object-contain"
              />
            </div>

            <div className="text-xl font-bold text-[#1A1A1A] mb-1">
              {grade} 등급
            </div>

            <div className="text-sm text-[#888780]">
              최근 분석 평균 {avgScore}점
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#888780]">{next.label}</span>
              <span className="font-medium text-[#1A1A1A]">
                {next.remaining > 0
                  ? `${next.remaining}점 남음`
                  : "최고 등급"}
              </span>
            </div>

            <div className="h-2 bg-[#F5FAF8] rounded-full border border-[#E5E5E5]">
              <div
                className="h-full bg-[#1D9E75] rounded-full"
                style={{ width: `${next.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 스윙 분석하기 */}
        <button
          onClick={handleSwingAnalyzeClick}
          className="w-full bg-gradient-to-br from-[#1D9E75] to-[#0F6E56] text-white rounded-xl px-5 py-7 text-left active:scale-95 transition-all"
        >
          <div className="text-3xl mb-2">📹</div>
          <h3 className="text-lg font-bold mb-1">스윙 분석하기</h3>
          <p className="text-sm opacity-90">
            새로운 영상을 업로드하고 AI 분석을 받아보세요
          </p>
        </button>

        {/* 기록 */}
        <button
          onClick={() => navigate("/history")}
          className="w-full bg-white rounded-xl px-5 py-7 text-left border border-[#E5E5E5] active:bg-[#F5FAF8] transition-all"
        >
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-lg font-bold mb-1 text-[#1A1A1A]">기록</h3>
          <p className="text-sm text-[#888780]">
            지금까지의 스윙 분석 기록을 확인하세요
          </p>
        </button>

        {/* 커뮤니티 */}
        <button
          onClick={() => navigate("/community")}
          className="w-full bg-white rounded-xl px-5 py-7 text-left border border-[#E5E5E5] active:bg-[#F5FAF8] transition-all"
        >
          <div className="text-3xl mb-2">💬</div>
          <h3 className="text-lg font-bold mb-1 text-[#1A1A1A]">커뮤니티</h3>
          <p className="text-sm text-[#888780]">
            다른 골퍼들과 소통하고 정보를 공유하세요
          </p>
        </button>
      </div>
    </div>
  );
}