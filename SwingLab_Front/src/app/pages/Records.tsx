import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type HistoryItem = {
  analysisId: number;
  userId: number;
  clubType: string;
  totalScore: number;
  xFactor: number;
  analysisStatus: string;
  createdAt: string;
};

type ClubKo = "드라이버" | "아이언";

export function Records() {
  const navigate = useNavigate();

  const [scoreClub, setScoreClub] = useState<ClubKo>("드라이버");
  const [averageClub, setAverageClub] = useState<ClubKo>("드라이버");
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    loadHistory(userId);
  }, [navigate]);

  const loadHistory = async (userId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:8090/SwingLab/historyList?userId=${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      console.log("기록 페이지 조회 결과:", result);

      if (result.success === true) {
        setHistoryList(result.data || []);
      } else {
        alert(result.message || "기록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("기록 조회 오류:", error);
      alert("기록 조회 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getClubKo = (clubType: string): ClubKo | string => {
    if (
      clubType === "DRIVER" ||
      clubType === "driver" ||
      clubType === "드라이버"
    ) {
      return "드라이버";
    }

    if (
      clubType === "IRON" ||
      clubType === "iron" ||
      clubType === "아이언"
    ) {
      return "아이언";
    }

    return clubType;
  };

  const getStatusKo = (status: string) => {
    if (status === "DONE") return "완료";
    return status || "완료";
  };

  const sortByRecent = (list: HistoryItem[]) => {
    return [...list].sort((a, b) => {
      const timeA = new Date(a.createdAt.replace(" ", "T")).getTime();
      const timeB = new Date(b.createdAt.replace(" ", "T")).getTime();

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      return Number(b.analysisId) - Number(a.analysisId);
    });
  };

  const scoreRecords = historyList.filter(
    (record) => getClubKo(record.clubType) === scoreClub
  );

  const averageRecords = historyList.filter(
    (record) => getClubKo(record.clubType) === averageClub
  );

  const recentRecords = sortByRecent(historyList).slice(0, 3);

  const avgScore = scoreRecords.length
    ? Math.round(
        scoreRecords.reduce(
          (sum, record) => sum + Number(record.totalScore || 0),
          0
        ) / scoreRecords.length
      )
    : 0;

  const highScore = scoreRecords.length
    ? Math.max(
        ...scoreRecords.map((record) =>
          Math.round(Number(record.totalScore || 0))
        )
      )
    : 0;

  const lowScore = scoreRecords.length
    ? Math.min(
        ...scoreRecords.map((record) =>
          Math.round(Number(record.totalScore || 0))
        )
      )
    : 0;

  const averageScore = averageRecords.length
    ? Math.round(
        averageRecords.reduce(
          (sum, record) => sum + Number(record.totalScore || 0),
          0
        ) / averageRecords.length
      )
    : 0;

  const todayStageScores = [
    {
      name: "Address",
      nameKo: "어드레스",
      avgScore: averageScore,
    },
    {
      name: "Backswing",
      nameKo: "백스윙",
      avgScore: averageScore,
    },
    {
      name: "Down Swing",
      nameKo: "다운스윙",
      avgScore: averageScore,
    },
    {
      name: "Impact/Finish",
      nameKo: "임팩트/피니시",
      avgScore: averageScore,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="mb-5">
          <p className="text-xs text-[#1D9E75] font-medium mb-1">
            ✦ 나의 기록
          </p>
          <h1 className="text-xl font-bold text-[#1A1A1A]">기록</h1>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-xl">
                📊
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A]">
                오늘의 점수
              </h3>
            </div>

            <div className="flex rounded-lg border border-[#E5E5E5] overflow-hidden">
              {(["드라이버", "아이언"] as const).map((club) => (
                <button
                  key={club}
                  onClick={() => setScoreClub(club)}
                  className={`px-2.5 py-1 text-xs font-medium transition-all ${
                    scoreClub === club
                      ? "bg-[#1D9E75] text-white"
                      : "bg-white text-[#888780]"
                  }`}
                >
                  {club}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "최고 점수",
                value: scoreRecords.length ? `${highScore}점` : "-",
                color: "#1D9E75",
              },
              {
                label: "최저 점수",
                value: scoreRecords.length ? `${lowScore}점` : "-",
                color: "#D85A30",
              },
              {
                label: "평균 점수",
                value: scoreRecords.length ? `${avgScore}점` : "-",
                color: "#3B82F6",
              },
              {
                label: "분석 횟수",
                value: `${scoreRecords.length}회`,
                color: "#1A1A1A",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-[#888780]">{item.label}</span>
                <span className="text-lg font-bold" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F1FB] flex items-center justify-center text-xl">
                📈
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A]">
                오늘의 점수 평균
              </h3>
            </div>

            <div className="flex rounded-lg border border-[#E5E5E5] overflow-hidden">
              {(["드라이버", "아이언"] as const).map((club) => (
                <button
                  key={club}
                  onClick={() => setAverageClub(club)}
                  className={`px-2.5 py-1 text-xs font-medium transition-all ${
                    averageClub === club
                      ? "bg-[#1D9E75] text-white"
                      : "bg-white text-[#888780]"
                  }`}
                >
                  {club}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {todayStageScores.map((stage, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-[#F5FAF8] border border-[#E5E5E5]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <div className="font-bold text-[#1A1A1A] text-sm">
                      {stage.nameKo}
                    </div>
                    <div className="text-xs text-[#888780]">{stage.name}</div>
                  </div>
                  <div className="text-base font-bold text-[#1D9E75]">
                    {averageRecords.length ? `${stage.avgScore}점` : "-"}
                  </div>
                </div>

                <div className="h-1.5 bg-white rounded-full">
                  <div
                    className="h-full bg-[#1D9E75] rounded-full"
                    style={{
                      width: averageRecords.length
                        ? `${stage.avgScore}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-xl">
                📝
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A]">
                최근 분석 기록
              </h3>
            </div>

            <button
              onClick={() => navigate("/history/all")}
              className="text-[#1D9E75] font-medium text-sm"
            >
              전체 보기 →
            </button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-[#888780]">
                기록을 불러오는 중...
              </div>
            ) : recentRecords.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#888780]">
                분석 기록이 없습니다.
              </div>
            ) : (
              recentRecords.map((record) => (
                <div
                  key={record.analysisId}
                  onClick={() => navigate(`/history/${record.analysisId}`)}
                  className="p-4 rounded-lg bg-[#F5FAF8] border border-[#E5E5E5] active:bg-[#E1F5EE] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#1A1A1A] text-sm">
                      {record.createdAt}
                    </span>
                    <span className="text-xs text-[#888780]">
                      {getClubKo(record.clubType)}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#888780]">평균</span>
                      <strong className="text-[#1A1A1A]">
                        {Math.round(Number(record.totalScore || 0))}점
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#888780]">X-Factor</span>
                      <strong className="text-[#1A1A1A]">
                        {Number(record.xFactor || 0).toFixed(2)}
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#888780]">상태</span>
                      <strong className="text-[#1A1A1A]">
                        {getStatusKo(record.analysisStatus)}
                      </strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}