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

type SectionScore = {
  SECTIONNAME?: string;
  SECTIONSCORE?: number;
  sectionName?: string;
  sectionScore?: number;
};

type ClubFilter = "전체" | "드라이버" | "아이언";
type SortType = "latest" | "scoreHigh" | "scoreLow";

export function HistoryAll() {
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [sectionScoreMap, setSectionScoreMap] = useState<
    Record<number, Record<string, number>>
  >({});
  const [clubFilter, setClubFilter] = useState<ClubFilter>("전체");
  const [sortType, setSortType] = useState<SortType>("latest");
  const [openedId, setOpenedId] = useState<number | null>(null);
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

      console.log("전체 기록 조회 결과:", result);

      if (result.success === true) {
        const list: HistoryItem[] = result.data || [];
        setHistoryList(list);
        await loadSectionScores(list);
      } else {
        alert(result.message || "분석 기록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("전체 기록 조회 오류:", error);
      alert("분석 기록 조회 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSectionScores = async (list: HistoryItem[]) => {
    const newMap: Record<number, Record<string, number>> = {};

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
          const scoreObj: Record<string, number> = {};

          const sectionScores: SectionScore[] = result.sectionScores || [];

          sectionScores.forEach((section) => {
            const name = section.SECTIONNAME || section.sectionName || "";
            const score = section.SECTIONSCORE ?? section.sectionScore ?? 0;

            scoreObj[name] = Number(score || 0);
          });

          newMap[item.analysisId] = scoreObj;
        }
      } catch (error) {
        console.error("구간 점수 조회 오류:", error);
      }
    }

    setSectionScoreMap(newMap);
  };

  const getClubKo = (clubType: string) => {
    if (clubType === "DRIVER" || clubType === "driver" || clubType === "드라이버") {
      return "드라이버";
    }

    if (clubType === "IRON" || clubType === "iron" || clubType === "아이언") {
      return "아이언";
    }

    return clubType;
  };

  const getFilteredList = () => {
    let list = [...historyList];

    if (clubFilter !== "전체") {
      list = list.filter((item) => getClubKo(item.clubType) === clubFilter);
    }

    if (sortType === "scoreHigh") {
      list.sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
    } else if (sortType === "scoreLow") {
      list.sort((a, b) => Number(a.totalScore || 0) - Number(b.totalScore || 0));
    } else {
      list.sort((a, b) => Number(b.analysisId) - Number(a.analysisId));
    }

    return list;
  };

  const filteredList = getFilteredList();

  const totalCount = historyList.length;

  const highScore = historyList.length
    ? Math.max(...historyList.map((item) => Math.round(Number(item.totalScore || 0))))
    : 0;

  const avgScore = historyList.length
    ? Math.round(
        historyList.reduce(
          (sum, item) => sum + Number(item.totalScore || 0),
          0
        ) / historyList.length
      )
    : 0;

  const firstScore = historyList.length
    ? Number(historyList[historyList.length - 1].totalScore || 0)
    : 0;

  const lastScore = historyList.length
    ? Number(historyList[0].totalScore || 0)
    : 0;

  const scoreChange = Math.round(lastScore - firstScore);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "#1D9E75";
    if (score >= 60) return "#F59E0B";
    return "#D85A30";
  };

  const getStageScore = (analysisId: number, sectionName: string) => {
    return Math.round(Number(sectionScoreMap[analysisId]?.[sectionName] || 0));
  };

  const getStatusKo = (status: string) => {
    if (status === "DONE") return "분석 완료";
    return status || "분석 완료";
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4 pb-20">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="mb-5">
          <button
            onClick={() => navigate("/history")}
            className="text-sm text-[#888780] mb-4"
          >
            ← 기록으로 돌아가기
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block text-xs px-3 py-1 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-3 font-medium">
                ✦ 스윙 분석 히스토리
              </div>

              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                분석 <span className="text-[#1D9E75]">기록</span>
              </h1>
            </div>

            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-2 rounded-xl bg-[#1D9E75] text-white text-sm font-bold"
            >
              + 새 분석
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
            <div className="text-sm text-[#888780] mb-3">📊 총 분석 횟수</div>
            <div className="text-2xl font-bold text-[#1D9E75]">
              {totalCount}회
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
            <div className="text-sm text-[#888780] mb-3">🏆 최고 점수</div>
            <div className="text-2xl font-bold text-[#F59E0B]">
              {highScore}점
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
            <div className="text-sm text-[#888780] mb-3">📈 평균 점수</div>
            <div className="text-2xl font-bold text-[#3B82F6]">
              {avgScore}점
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
            <div className="text-sm text-[#888780] mb-3">↕ 점수 변화</div>
            <div
              className="text-2xl font-bold"
              style={{ color: scoreChange >= 0 ? "#1D9E75" : "#D85A30" }}
            >
              {scoreChange >= 0 ? `+${scoreChange}` : scoreChange}점
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4">
          <div className="mb-3">
            <span className="text-sm text-[#888780] mr-2">클럽</span>

            {(["전체", "드라이버", "아이언"] as const).map((club) => (
              <button
                key={club}
                onClick={() => setClubFilter(club)}
                className={`px-3 py-1 rounded-full text-xs font-bold mr-1 ${
                  clubFilter === club
                    ? "bg-[#1D9E75] text-white"
                    : "bg-[#F5FAF8] text-[#555555]"
                }`}
              >
                {club}
              </button>
            ))}
          </div>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
            className="px-4 py-2 rounded-lg border border-[#E5E5E5] bg-white text-sm"
          >
            <option value="latest">최신순</option>
            <option value="scoreHigh">점수 높은순</option>
            <option value="scoreLow">점수 낮은순</option>
          </select>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center text-[#888780]">
            분석 기록을 불러오는 중...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center text-[#888780]">
            분석 기록이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((item) => {
              const isOpen = openedId === item.analysisId;
              const score = Math.round(Number(item.totalScore || 0));

              const address = getStageScore(item.analysisId, "ADDRESS");
              const backswing = getStageScore(item.analysisId, "BACKSWING");
              const downswing = getStageScore(item.analysisId, "DOWNSWING");
              const impact = getStageScore(item.analysisId, "IMPACT_FINISH");

              return (
                <div
                  key={item.analysisId}
                  className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenedId(isOpen ? null : item.analysisId)
                    }
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm text-[#888780]">
                          {item.createdAt}
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-[#F5FAF8] text-xs text-[#1A1A1A]">
                            {getClubKo(item.clubType)}
                          </span>

                          <span className="px-2 py-1 rounded-full bg-[#E1F5EE] text-xs text-[#0F6E56]">
                            {getStatusKo(item.analysisStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className="text-2xl font-bold"
                          style={{ color: getScoreColor(score) }}
                        >
                          {score}
                        </div>
                        <div className="text-xs text-[#888780]">평균 점수</div>
                      </div>
                    </div>

                    <div className="h-2 bg-[#F5FAF8] rounded-full border border-[#E5E5E5]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${score}%`,
                          backgroundColor: getScoreColor(score),
                        }}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#E5E5E5] p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          ["어드레스", "Address", address],
                          ["백스윙", "Backswing", backswing],
                          ["다운스윙", "Downswing", downswing],
                          ["임팩트/피니시", "Impact/Finish", impact],
                        ].map(([ko, en, stageScore]) => (
                          <div
                            key={String(en)}
                            className="p-3 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]"
                          >
                            <div className="text-xs text-[#888780]">
                              {en}
                            </div>

                            <div className="text-sm font-bold text-[#1A1A1A]">
                              {ko}
                            </div>

                            <div
                              className="text-xl font-bold mt-1"
                              style={{
                                color: getScoreColor(Number(stageScore)),
                              }}
                            >
                              {Number(stageScore)}점
                            </div>

                            <div className="h-1.5 bg-white rounded-full mt-2">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Number(stageScore)}%`,
                                  backgroundColor: getScoreColor(
                                    Number(stageScore)
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate(`/history/${item.analysisId}`)}
                        className="w-full py-3 rounded-xl bg-[#1D9E75] text-white font-bold"
                      >
                        상세 결과 보기 →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}