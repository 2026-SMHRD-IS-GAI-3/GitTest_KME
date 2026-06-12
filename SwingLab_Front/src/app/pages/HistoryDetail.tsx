import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import semiproImage from "../../imports/semipro.PNG";
import amateurImage from "../../imports/amateur.PNG";
import masterImage from "../../imports/master.PNG";
import proImage from "../../imports/pro.PNG";
import rookieImage from "../../imports/rookie.PNG";

type DetailData = {
  analysisId: number;
  userId: number;
  clubType: string;
  bodyCode: string;
  armLengthType: string;
  handType: string;
  totalScore: number;
  xFactor: number;
  frontVideoUrl: string;
  sideVideoUrl: string;
  createdAt: string;
};

type SectionScore = {
  sectionName?: string;
  sectionScore?: number;
  SECTIONNAME?: string;
  SECTIONSCORE?: number;
};

export function HistoryDetail() {
  const navigate = useNavigate();
  const { analysisId } = useParams();

  const [detail, setDetail] = useState<DetailData | null>(null);
  const [sectionScores, setSectionScores] = useState<SectionScore[]>([]);
  const [videoTab, setVideoTab] = useState<"front" | "side">("front");
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!analysisId) {
      navigate("/history");
      return;
    }

    loadDetail(analysisId);
  }, [analysisId, navigate]);

  const loadDetail = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:8090/SwingLab/historyDetail?analysisId=${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      console.log("기록 상세 결과:", result);

      if (result.success === true) {
        setDetail(result.data);
        setSectionScores(result.sectionScores || []);
      } else {
        alert(result.message || "상세 기록을 불러오지 못했습니다.");
        navigate("/history");
      }
    } catch (error) {
      console.error("상세 기록 조회 오류:", error);
      alert("상세 기록 조회 중 오류가 발생했습니다.");
      navigate("/history");
    } finally {
      setIsLoading(false);
    }
  };

  const getClubName = (clubType: string) => {
    if (clubType === "DRIVER") return "드라이버";
    if (clubType === "IRON") return "아이언";
    return clubType;
  };

  const getScoreBySection = (target: string) => {
    const found = sectionScores.find((section) => {
      const name = section.sectionName || section.SECTIONNAME || "";
      return name === target;
    });

    const score = found?.sectionScore ?? found?.SECTIONSCORE ?? 0;

    return Math.round(Number(score || 0));
  };

  const getGrade = (score: number) => {
    if (score >= 90) {
      return { name: "마스터", image: masterImage, color: "#3C3489" };
    }

    if (score >= 75) {
      return { name: "프로", image: proImage, color: "#0C447C" };
    }

    if (score >= 60) {
      return { name: "세미프로", image: semiproImage, color: "#1D9E75" };
    }

    if (score >= 40) {
      return { name: "아마추어", image: amateurImage, color: "#854F0B" };
    }

    return { name: "루키", image: rookieImage, color: "#888780" };
  };

  const getLevel = (score: number) => {
    if (score >= 85) return "우수";
    if (score >= 70) return "양호";
    if (score >= 55) return "보완 필요";
    return "집중 개선";
  };

  const getPdfFeedback = (
    sectionName: string,
    score: number,
    bodyCode: string,
    armLengthType: string
  ) => {
    const bodyType = bodyCode === "BT01" ? "V-SHAPE" : "ALL";
    const armType = armLengthType === "LONG" ? "LONG" : "ALL";

    if (bodyType === "V-SHAPE" && armType === "LONG") {
      if (sectionName === "BACKSWING") {
        if (score < 60) {
          return "넓은 어깨와 긴 팔로 인해 백스윙 과회전이 쉽습니다. 코어를 조여 척추 축을 단단히 유지하세요.";
        }
        if (score < 80) {
          return "어깨 너비가 넓어 회전 범위가 큰 편입니다. 상체 회전 시 척추가 따라 일어서지 않도록 의식하세요.";
        }
      }

      if (sectionName === "DOWNSWING") {
        if (score < 60) {
          return "긴 팔의 원심력으로 상체가 앞으로 쏠리기 쉽습니다. 오른 어깨를 낮게 유지하며 내려오세요.";
        }
        if (score < 80) {
          return "팔이 길수록 클럽 원심력이 강해집니다. 상체를 뒤에 남기는 느낌으로 내려오세요.";
        }
      }

      if (sectionName === "IMPACT_FINISH") {
        if (score < 60) {
          return "긴 팔과 강한 상체 회전력이 골반 전진을 유발합니다. 오른 엉덩이를 뒤로 밀어내는 느낌으로 회전하세요.";
        }
        if (score < 80) {
          return "어깨 너비가 넓을수록 골반이 밀려나기 쉽습니다. 하체를 고정하고 상체 회전으로만 임팩트를 만드세요.";
        }
      }
    }

    if (sectionName === "ADDRESS") {
      if (score < 60) {
        return "무릎을 살짝 구부려 체중을 앞쪽에 실어주세요.";
      }
      if (score < 80) {
        return "무릎을 조금 더 구부려 안정적인 자세를 만드세요.";
      }
    }

    if (sectionName === "BACKSWING") {
      if (score < 60) {
        return "백스윙 시 오른 무릎 각도를 어드레스와 동일하게 유지하세요.";
      }
      if (score < 80) {
        return "오른 무릎이 안쪽으로 무너지지 않도록 주의하세요.";
      }
    }

    if (sectionName === "DOWNSWING") {
      if (score < 60) {
        return "다운스윙 시 무릎을 낮게 유지하며 임팩트까지 버티세요.";
      }
      if (score < 80) {
        return "왼 무릎이 목표 방향으로 자연스럽게 이동하게 하세요.";
      }
    }

    if (sectionName === "IMPACT_FINISH") {
      if (score < 60) {
        return "임팩트까지 무릎 각도를 유지하고 조기에 일어서지 마세요.";
      }
      if (score < 80) {
        return "임팩트 순간 왼 무릎이 안정적으로 버티도록 하세요.";
      }
    }

    return "현재 구간은 안정적으로 분석되었습니다. 현재 자세를 유지하면서 반복 연습하세요.";
  };

  if (isLoading || !detail) {
    return (
      <div className="min-h-screen bg-[#F5FAF8] flex items-center justify-center">
        <div className="text-[#888780]">분석 기록을 불러오는 중...</div>
      </div>
    );
  }

  const totalScore = Math.round(Number(detail.totalScore || 0));
  const grade = getGrade(totalScore);

  const currentVideoUrl =
    videoTab === "front" ? detail.frontVideoUrl : detail.sideVideoUrl;

  const swingStages = [
    {
      id: 1,
      sectionKey: "ADDRESS",
      name: "Address",
      nameKo: "어드레스",
      score: getScoreBySection("ADDRESS"),
    },
    {
      id: 2,
      sectionKey: "BACKSWING",
      name: "Backswing",
      nameKo: "백스윙",
      score: getScoreBySection("BACKSWING"),
    },
    {
      id: 3,
      sectionKey: "DOWNSWING",
      name: "Downswing",
      nameKo: "다운스윙",
      score: getScoreBySection("DOWNSWING"),
    },
    {
      id: 4,
      sectionKey: "IMPACT_FINISH",
      name: "Impact/Finish",
      nameKo: "임팩트/피니시",
      score: getScoreBySection("IMPACT_FINISH"),
    },
  ];

  const selectedStageData =
    swingStages.find((stage) => stage.id === selectedStage) || null;

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4 pb-20">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="text-center mb-5">
          <button
            onClick={() => navigate("/history")}
            className="text-sm text-[#888780] mb-3"
          >
            ← 기록으로 돌아가기
          </button>

          <div className="inline-block text-xs px-3 py-1 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-3 font-medium">
            ✦ 분석 상세
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1 tracking-tight">
            <span className="text-[#1D9E75]">
              {getClubName(detail.clubType)}
            </span>{" "}
            스윙 분석
          </h1>

          <p className="text-sm text-[#888780]">{detail.createdAt}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img
                src={grade.image}
                alt={grade.name}
                className="h-16 w-auto object-contain"
              />
            </div>

            <div className="flex-1">
              <div className="text-xs text-[#888780]">
                분석 ID · {detail.analysisId}
              </div>

              <h2 className="text-xl font-bold text-[#1A1A1A]">
                {grade.name} 등급
              </h2>

              <p className="text-sm text-[#888780]">
                평균{" "}
                <span className="font-bold text-[#1D9E75]">
                  {totalScore}점
                </span>
              </p>
            </div>
          </div>

          <div className="h-3 bg-[#F5FAF8] rounded-full border border-[#E5E5E5]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalScore}%`,
                backgroundColor: grade.color,
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-[#888780] mt-1">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E6F1FB] flex items-center justify-center text-base">
                🎥
              </div>

              <h3 className="font-bold text-[#1A1A1A]">분석 결과 영상</h3>
            </div>

            <div className="flex rounded-lg bg-[#F0F0F0] p-0.5 gap-0.5">
              <button
                onClick={() => setVideoTab("front")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border-none ${
                  videoTab === "front"
                    ? "bg-white text-[#1D9E75] shadow-sm"
                    : "text-[#888780]"
                }`}
              >
                📹 정면
              </button>

              <button
                onClick={() => setVideoTab("side")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border-none ${
                  videoTab === "side"
                    ? "bg-white text-[#1D9E75] shadow-sm"
                    : "text-[#888780]"
                }`}
              >
                🎬 측면
              </button>
            </div>
          </div>

          <div className="aspect-video bg-[#F5FAF8] rounded-xl border-2 border-[#E5E5E5] flex items-center justify-center overflow-hidden">
            {currentVideoUrl ? (
              <video
                key={currentVideoUrl}
                src={currentVideoUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="text-center text-sm text-[#888780]">
                {videoTab === "front" ? "정면" : "측면"} 분석 영상이 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-base">
              📊
            </div>

            <h3 className="font-bold text-[#1A1A1A]">구간별 상세 점수</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {swingStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() =>
                  setSelectedStage(selectedStage === stage.id ? null : stage.id)
                }
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  selectedStage === stage.id
                    ? "border-[#1D9E75] bg-[#E1F5EE]"
                    : "border-[#E5E5E5] bg-[#F5FAF8]"
                }`}
              >
                <div className="text-xs text-[#888780] mb-0.5">
                  {stage.name}
                </div>

                <div className="text-xs font-medium text-[#1A1A1A] mb-2">
                  {stage.nameKo}
                </div>

                <div className="text-xl font-bold mb-2 text-[#1D9E75]">
                  {stage.score}점
                </div>

                <div className="h-1.5 bg-white rounded-full border border-[#E5E5E5]">
                  <div
                    className="h-full rounded-full bg-[#1D9E75]"
                    style={{
                      width: `${stage.score}%`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          {selectedStageData && (
            <div className="p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs text-[#888780]">
                    {selectedStageData.name}
                  </div>

                  <div className="font-bold text-[#1A1A1A]">
                    {selectedStageData.nameKo} 피드백
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-[#E1F5EE] text-[#0F6E56] text-xs font-bold">
                  {getLevel(selectedStageData.score)}
                </span>
              </div>

              <p className="text-sm text-[#555555] leading-relaxed">
                {getPdfFeedback(
                  selectedStageData.sectionKey,
                  selectedStageData.score,
                  detail.bodyCode,
                  detail.armLengthType
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pb-4">
          <button
            onClick={() => navigate("/history")}
            className="w-full py-4 rounded-xl bg-[#1D9E75] text-white font-bold cursor-pointer hover:bg-[#0F6E56] border-none"
          >
            기록으로 돌아가기
          </button>

          <button
            onClick={() => navigate("/upload")}
            className="w-full py-3 rounded-xl bg-white border border-[#CCCCCC] text-[#1A1A1A] font-medium cursor-pointer hover:bg-[#F5FAF8]"
          >
            다시 분석하기
          </button>
        </div>
      </div>
    </div>
  );
}