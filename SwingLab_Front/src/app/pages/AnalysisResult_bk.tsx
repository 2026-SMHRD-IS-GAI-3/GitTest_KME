import { useNavigate } from "react-router";
import { useState } from "react";
import semiproImage from "../../imports/semipro.PNG";
import amateurImage from "../../imports/amateur.PNG";
import masterImage from "../../imports/master.PNG";
import proImage from "../../imports/pro.PNG";
import rookieImage from "../../imports/rookie.PNG";

type ClubType = "driver" | "iron";

type AnalysisData = {
  success?: boolean;
  analysisId?: string;
  totalScore?: number;
  addressScore?: number;
  backswingScore?: number;
  downswingScore?: number;
  impactScore?: number;
  flexibility?: string;
  avgXf?: number;
  orbit?: string;
  sideResultPath?: string;
  frontResultPath?: string;
  feedbacks?: string[];
  section_details?: any;
  sectionDetails?: any;
};

const API_BASE_URL = "http://localhost:8000";

const CLUB_TIPS: Record<
  ClubType,
  {
    name: string;
    icon: string;
    generalTips: string[];
    keyPoints: string[];
  }
> = {
  driver: {
    name: "드라이버",
    icon: "🏌️",
    generalTips: [
      "볼 포지션을 왼발 안쪽 뒤꿈치 선상에 위치시켜 어퍼블로우 임팩트 유도",
      "스윙 아크를 크게 가져가 헤드스피드 극대화",
      "티업 높이를 헤드의 절반 이상 되도록 설정",
    ],
    keyPoints: [
      "어퍼블로우 임팩트",
      "넓은 스탠스와 충분한 체중 이동",
      "다운스윙에서 완전한 어깨 회전",
    ],
  },
  iron: {
    name: "아이언",
    icon: "⛳",
    generalTips: [
      "볼 포지션을 스탠스 중앙~중앙 왼쪽에 위치시켜 다운블로우 임팩트 유도",
      "공을 압축하듯 찍어 치는 느낌으로 디봇 생성",
      "임팩트 후 클럽이 목표 방향으로 충분히 뻗도록",
    ],
    keyPoints: [
      "다운블로우 임팩트",
      "임팩트 시 손이 볼보다 앞에 위치",
      "체중의 70% 이상을 왼발로 전달",
    ],
  },
};

export function AnalysisResult() {
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [videoTab, setVideoTab] = useState<"front" | "side">("front");
  const [isSaving, setIsSaving] = useState(false);

  const club =
    (sessionStorage.getItem("swingClub") as ClubType | null) ?? "driver";

  const savedResult = sessionStorage.getItem("swingAnalysisResult");

  const analysisResult: AnalysisData = savedResult
    ? JSON.parse(savedResult)
    : {};

  const clubTips = CLUB_TIPS[club];

  const getVideoUrl = (path?: string) => {
    if (!path) return "";

    const fixedPath = path.replaceAll("\\", "/");

    if (fixedPath.startsWith("http")) {
      return fixedPath;
    }

    if (fixedPath.startsWith("/uploads")) {
      return `${API_BASE_URL}${fixedPath}`;
    }

    if (fixedPath.startsWith("uploads")) {
      return `${API_BASE_URL}/${fixedPath}`;
    }

    const fileName = fixedPath.split("/").pop();

    return `${API_BASE_URL}/uploads/${fileName}`;
  };

  const frontVideoUrl = getVideoUrl(analysisResult.frontResultPath);
  const sideVideoUrl = getVideoUrl(analysisResult.sideResultPath);
  const currentVideoUrl = videoTab === "front" ? frontVideoUrl : sideVideoUrl;

  console.log("analysisResult:", analysisResult);
  console.log("frontVideoUrl:", frontVideoUrl);
  console.log("sideVideoUrl:", sideVideoUrl);

  const totalScore = Math.round(Number(analysisResult.totalScore || 0));
  const addressScore = Math.round(Number(analysisResult.addressScore || 0));
  const backswingScore = Math.round(Number(analysisResult.backswingScore || 0));
  const downswingScore = Math.round(Number(analysisResult.downswingScore || 0));
  const impactScore = Math.round(Number(analysisResult.impactScore || 0));

  const getLevel = (score: number) => {
    if (score >= 85) return "우수";
    if (score >= 70) return "양호";
    if (score >= 55) return "보완 필요";
    return "집중 개선";
  };

  const getPdfFeedback = (sectionName: string, score: number) => {
    if (sectionName === "ADDRESS") {
      if (score < 60) return "무릎을 살짝 구부려 체중을 앞쪽에 실어주세요.";
      if (score < 80) return "무릎을 조금 더 구부려 안정적인 자세를 만드세요.";
    }

    if (sectionName === "BACKSWING") {
      if (score < 60) return "넓은 어깨와 긴 팔로 인해 백스윙 과회전이 쉽습니다. 코어를 조여 척추 축을 단단히 유지하세요.";
      if (score < 80) return "어깨 너비가 넓어 회전 범위가 큰 편입니다. 상체 회전 시 척추가 따라 일어서지 않도록 의식하세요.";
    }

    if (sectionName === "DOWNSWING") {
      if (score < 60) return "긴 팔의 원심력으로 상체가 앞으로 쏠리기 쉽습니다. 오른 어깨를 낮게 유지하며 내려오세요.";
      if (score < 80) return "팔이 길수록 클럽 원심력이 강해집니다. 상체를 뒤에 남기는 느낌으로 내려오세요.";
    }

    if (sectionName === "IMPACT_FINISH") {
      if (score < 60) return "긴 팔과 강한 상체 회전력이 골반 전진을 유발합니다. 오른 엉덩이를 뒤로 밀어내는 느낌으로 회전하세요.";
      if (score < 80) return "어깨 너비가 넓을수록 골반이 밀려나기 쉽습니다. 하체를 고정하고 상체 회전으로만 임팩트를 만드세요.";
    }

    return "현재 구간은 안정적으로 분석되었습니다. 현재 자세를 유지하면서 반복 연습하세요.";
  };

  const swingStages = [
    {
      id: 1,
      sectionKey: "ADDRESS",
      name: "Address",
      nameKo: "어드레스",
      score: addressScore,
      color: "#1D9E75",
      level: getLevel(addressScore),
    },
    {
      id: 2,
      sectionKey: "BACKSWING",
      name: "Backswing",
      nameKo: "백스윙",
      score: backswingScore,
      color: "#1D9E75",
      level: getLevel(backswingScore),
    },
    {
      id: 3,
      sectionKey: "DOWNSWING",
      name: "Downswing",
      nameKo: "다운스윙",
      score: downswingScore,
      color: "#1D9E75",
      level: getLevel(downswingScore),
    },
    {
      id: 4,
      sectionKey: "IMPACT_FINISH",
      name: "Impact/Finish",
      nameKo: "임팩트/피니시",
      score: impactScore,
      color: "#1D9E75",
      level: getLevel(impactScore),
    },
  ];

  const averageScore =
    totalScore > 0
      ? totalScore
      : Math.round(
          swingStages.reduce((sum, stage) => sum + stage.score, 0) /
            swingStages.length
        );

  const selectedStageData =
    swingStages.find((stage) => stage.id === selectedStage) ?? null;

  const getGrade = (score: number) => {
    if (score >= 90) return { name: "마스터", image: masterImage, color: "#3C3489" };
    if (score >= 75) return { name: "프로", image: proImage, color: "#0C447C" };
    if (score >= 60) return { name: "세미프로", image: semiproImage, color: "#1D9E75" };
    if (score >= 40) return { name: "아마추어", image: amateurImage, color: "#854F0B" };
    return { name: "루키", image: rookieImage, color: "#888780" };
  };

  const grade = getGrade(averageScore);

  const saveAnalysisResult = async () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!analysisResult || !analysisResult.analysisId) {
      alert("저장할 분석 결과가 없습니다.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        "http://localhost:8090/SwingLab/saveSwingAnalysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: Number(userId),
            clubType: club === "driver" ? "드라이버" : "아이언",
            totalScore: averageScore,
            addressScore,
            backswingScore,
            downswingScore,
            impactScore,
            xFactor: Number(analysisResult.avgXf || 0),
            orbit: analysisResult.orbit || "",
            flexibility: analysisResult.flexibility || "",
            frontVideoUrl,
            sideVideoUrl,
            feedbacks: analysisResult.feedbacks || [],
            sectionDetails:
              analysisResult.sectionDetails ||
              analysisResult.section_details ||
              {},
          }),
        }
      );

      const result = await response.json();

      if (result.success === true) {
        alert("분석 결과가 저장되었습니다.");
        navigate("/history");
      } else {
        alert(result.message || "분석 결과 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("분석 결과 저장 오류:", error);
      alert("분석 결과 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="text-center mb-5">
          <div className="inline-block text-xs px-3 py-1 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-3 font-medium">
            ✦ AI 분석 완료
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1 tracking-tight">
            <span className="text-[#1D9E75]">스윙 분석</span> 결과
          </h1>

          <p className="text-sm text-[#888780]">
            AI가 4단계 구간을 자동으로 분석했습니다
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#E1F5EE] flex items-center justify-center text-2xl flex-shrink-0">
              {clubTips.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#888780]">선택 클럽</div>
              <div className="font-bold text-[#1A1A1A]">{clubTips.name}</div>
            </div>
          </div>
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
                분석 ID · {analysisResult.analysisId || "-"}
              </div>

              <h2 className="text-xl font-bold text-[#1A1A1A]">
                {grade.name} 등급
              </h2>

              <p className="text-sm text-[#888780]">
                평균{" "}
                <span className="font-bold text-[#1D9E75]">
                  {averageScore}점
                </span>
              </p>
            </div>
          </div>

          <div className="h-3 bg-[#F5FAF8] rounded-full border border-[#E5E5E5]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${averageScore}%`,
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
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {videoTab === "front" ? "📹" : "🎬"}
                </div>

                <div className="font-bold text-[#1A1A1A] text-sm mb-0.5">
                  {videoTab === "front" ? "정면" : "측면"} 분석 영상
                </div>

                <div className="text-xs text-[#888780]">
                  분석 결과 영상이 없습니다
                </div>
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

                <div
                  className="text-xl font-bold mb-2"
                  style={{ color: stage.color }}
                >
                  {stage.score}점
                </div>

                <div className="h-1.5 bg-white rounded-full border border-[#E5E5E5]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${stage.score}%`,
                      backgroundColor: stage.color,
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
                  {selectedStageData.level}
                </span>
              </div>

              <p className="text-sm text-[#555555] leading-relaxed">
                {getPdfFeedback(
                  selectedStageData.sectionKey,
                  selectedStageData.score
                )}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-base">
              {clubTips.icon}
            </div>

            <h3 className="font-bold text-[#1A1A1A]">
              {clubTips.name} 스윙 핵심 포인트
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
              <div className="font-bold text-[#1A1A1A] mb-2 flex items-center gap-1.5 text-sm">
                <span>⚙️</span> 클럽 특성
              </div>

              <ul className="space-y-1.5">
                {clubTips.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[#555555]"
                  >
                    <span className="text-[#1D9E75] mt-0.5">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
              <div className="font-bold text-[#1A1A1A] mb-2 flex items-center gap-1.5 text-sm">
                <span>💡</span> 실전 팁
              </div>

              <ul className="space-y-1.5">
                {clubTips.generalTips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[#555555]"
                  >
                    <span className="text-[#1D9E75] mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-4">
          <button
            onClick={saveAnalysisResult}
            disabled={isSaving}
            className={`w-full py-4 rounded-xl text-white font-bold cursor-pointer border-none ${
              isSaving
                ? "bg-[#CCCCCC]"
                : "bg-[#1D9E75] hover:bg-[#0F6E56]"
            }`}
          >
            {isSaving ? "저장 중..." : "기록으로 이동"}
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