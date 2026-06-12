import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type ClubKo = "드라이버" | "아이언";

type HistoryItem = {
  analysisId: number;
  userId: number;
  clubType: string;
  totalScore: number;
  xFactor: number;
  analysisStatus: string;
  createdAt: string;
};

type SectionScore = {
  sectionName?: string;
  sectionScore?: number;
  SECTIONNAME?: string;
  SECTIONSCORE?: number;
};

type StageAvg = {
  name: string;
  nameKo: string;
  avgScore: number;
};

export function History() {
  const navigate = useNavigate();

  const [scoreClub, setScoreClub] = useState<ClubKo>("드라이버");
  const [averageClub, setAverageClub] = useState<ClubKo>("드라이버");
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [todayStageScores, setTodayStageScores] = useState<
    Record<ClubKo, StageAvg[]>
  >({
    드라이버: [
      { name: "Address", nameKo: "어드레스", avgScore: 0 },
      { name: "Backswing", nameKo: "백스윙", avgScore: 0 },
      { name: "Down Swing", nameKo: "다운스윙", avgScore: 0 },
      { name: "Impact/Finish", nameKo: "임팩트/피니시", avgScore: 0 },
    ],
    아이언: [
      { name: "Address", nameKo: "어드레스", avgScore: 0 },
      { name: "Backswing", nameKo: "백스윙", avgScore: 0 },
      { name: "Down Swing", nameKo: "다운스윙", avgScore: 0 },
      { name: "Impact/Finish", nameKo: "임팩트/피니시", avgScore: 0 },
    ],
  });

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

      if (result.success === true) {
        const list: HistoryItem[] = result.data || [];
        setHistoryList(list);
        await loadTodaySectionAverages(list);
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

  const loadTodaySectionAverages = async (list: HistoryItem[]) => {
    const today = getTodayString();

    const todayList = list.filter((item) =>
      String(item.createdAt || "").startsWith(today)
    );

    const driverToday = todayList.filter(
      (item) => getClubKo(item.clubType) === "드라이버"
    );

    const ironToday = todayList.filter(
      (item) => getClubKo(item.clubType) === "아이언"
    );

    const driverStages = await getAverageSectionScores(driverToday);
    const ironStages = await getAverageSectionScores(ironToday);

    setTodayStageScores({
      드라이버: driverStages,
      아이언: ironStages,
    });
  };

  const getAverageSectionScores = async (
    list: HistoryItem[]
  ): Promise<StageAvg[]> => {
    const baseStages: StageAvg[] = [
      { name: "Address", nameKo: "어드레스", avgScore: 0 },
      { name: "Backswing", nameKo: "백스윙", avgScore: 0 },
      { name: "Down Swing", nameKo: "다운스윙", avgScore: 0 },
      { name: "Impact/Finish", nameKo: "임팩트/피니시", avgScore: 0 },
    ];

    if (list.length === 0) {
      return baseStages;
    }

    const sectionMap: Record<string, number[]> = {
      ADDRESS: [],
      BACKSWING: [],
      DOWNSWING: [],
      IMPACT_FINISH: [],
    };

    for (const item of list) {
      try {
        const response = await fetch(
          `http://localhost:8090/SwingLab/historyDetail?analysisId=${item.analysisId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (result.success === true) {
          const sectionScores: SectionScore[] = result.sectionScores || [];

          sectionScores.forEach((section) => {
            const key = section.sectionName || section.SECTIONNAME || "";
            const score = section.sectionScore ?? section.SECTIONSCORE ?? 0;

            if (sectionMap[key]) {
              sectionMap[key].push(Number(score || 0));
            }
          });
        }
      } catch (error) {
        console.error("구간 점수 평균 조회 오류:", error);
      }
    }

    return [
      {
        name: "Address",
        nameKo: "어드레스",
        avgScore: average(sectionMap.ADDRESS),
      },
      {
        name: "Backswing",
        nameKo: "백스윙",
        avgScore: average(sectionMap.BACKSWING),
      },
      {
        name: "Down Swing",
        nameKo: "다운스윙",
        avgScore: average(sectionMap.DOWNSWING),
      },
      {
        name: "Impact/Finish",
        nameKo: "임팩트/피니시",
        avgScore: average(sectionMap.IMPACT_FINISH),
      },
    ];
  };

  const average = (arr: number[]) => {
    if (arr.length === 0) return 0;

    return Math.round(arr.reduce((sum, value) => sum + value, 0) / arr.length);
  };

  const getTodayString = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const getClubKo = (clubType: string): ClubKo => {
    if (
      clubType === "DRIVER" ||
      clubType === "driver" ||
      clubType === "드라이버"
    ) {
      return "드라이버";
    }

    return "아이언";
  };

  const getClubDb = (club: ClubKo) => {
    return club === "드라이버" ? "DRIVER" : "IRON";
  };

  const getStatusKo = (status: string) => {
    if (status === "DONE") return "완료";
    return status || "완료";
  };

  const sortByRecent = (list: HistoryItem[]) => {
    return [...list].sort((a, b) => {
      const timeA = new Date(String(a.createdAt).replace(" ", "T")).getTime();
      const timeB = new Date(String(b.createdAt).replace(" ", "T")).getTime();

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      return Number(b.analysisId) - Number(a.analysisId);
    });
  };

  const today = getTodayString();

  const todayRecords = historyList.filter((record) =>
    String(record.createdAt || "").startsWith(today)
  );

  const scoreRecords = todayRecords.filter(
    (record) => record.clubType === getClubDb(scoreClub)
  );

  const recentRecords = sortByRecent(historyList);

  const avgScore = scoreRecords.length
    ? Math.round(
        scoreRecords.reduce(
          (sum, record) => sum + Number(record.totalScore || 0),
          0
        ) / scoreRecords.length
      )
    : 0;

  const highScore = scoreRecords.length
    ? Math.max(...scoreRecords.map((record) => Number(record.totalScore || 0)))
    : 0;

  const lowScore = scoreRecords.length
    ? Math.min(...scoreRecords.map((record) => Number(record.totalScore || 0)))
    : 0;

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4 pb-20">
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

          {isLoading ? (
            <div className="py-6 text-center text-sm text-[#888780]">
              기록을 불러오는 중...
            </div>
          ) : (
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
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-[#888780]">{item.label}</span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
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
            {todayStageScores[averageClub].map((stage, index) => (
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
                    {stage.avgScore > 0 ? `${stage.avgScore}점` : "-"}
                  </div>
                </div>

                <div className="h-1.5 bg-white rounded-full">
                  <div
                    className="h-full bg-[#1D9E75] rounded-full"
                    style={{ width: `${stage.avgScore}%` }}
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
            {recentRecords.slice(0, 5).map((record) => (
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
            ))}

            {!isLoading && recentRecords.length === 0 && (
              <div className="p-8 text-center text-sm text-[#888780]">
                분석 기록이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}