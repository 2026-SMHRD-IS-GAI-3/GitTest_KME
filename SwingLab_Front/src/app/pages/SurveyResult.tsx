import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

type BodyType = "ectomorph" | "mesomorph" | "endomorph";

interface LocationState {
  bodyType: BodyType;
  scores: {
    ectomorph: number;
    mesomorph: number;
    endomorph: number;
  };
  bodyInfo?: {
    height: string;
    weight: string;
    bmi: number;
  };
}

const bodyTypeInfo = {
  ectomorph: {
    name: "외배엽",
    emoji: "🦴",
    description: "마른 체형",
    characteristics: [
      "가늘고 긴 팔다리",
      "빠른 신진대사",
      "체중 증가 어려움",
      "근육 발달이 느림",
    ],
    golfTips: [
      "유연성을 활용한 스윙 폭 증대",
      "가벼운 클럽으로 스윙 속도 향상",
      "근력 운동으로 파워 보완",
      "긴 팔다리를 활용한 큰 스윙 아크",
    ],
    color: "#8B5CF6",
    bgColor: "#F3E8FF",
  },
  mesomorph: {
    name: "중배엽",
    emoji: "💪",
    description: "근육질 체형",
    characteristics: [
      "탄탄한 골격 구조",
      "근육 발달이 빠름",
      "운동형 체형",
      "체중 관리 용이",
    ],
    golfTips: [
      "강한 근력을 활용한 파워 스윙",
      "안정적인 하체로 밸런스 유지",
      "폭발적인 힘을 활용한 장타",
      "체력을 활용한 지속적인 연습",
    ],
    color: "#1D9E75",
    bgColor: "#E1F5EE",
  },
  endomorph: {
    name: "내배엽",
    emoji: "🧸",
    description: "통통한 체형",
    characteristics: [
      "둥근 체형",
      "체중 증가 쉬움",
      "느린 신진대사",
      "부드러운 근육",
    ],
    golfTips: [
      "안정적인 체중을 활용한 밸런스",
      "유연성 향상 스트레칭 중요",
      "짧고 정확한 스윙에 집중",
      "체중 이동을 활용한 파워 전달",
    ],
    color: "#F59E0B",
    bgColor: "#FEF3C7",
  },
};

export function SurveyResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state || !state.bodyType) {
      navigate("/survey");
    }
  }, [state, navigate]);

  if (!state || !state.bodyType) {
    return null;
  }

  const { bodyType, scores, bodyInfo } = state;
  const info = bodyTypeInfo[bodyType];
  const totalScore = scores.ectomorph + scores.mesomorph + scores.endomorph;

  // BMI 카테고리 가져오기
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return "저체중";
    if (bmi < 23) return "정상";
    if (bmi < 25) return "과체중";
    if (bmi < 30) return "비만";
    return "고도비만";
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[900px] mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-5 font-medium">
            ✦ AI 체형 진단 완료
          </div>
          <h1 className="text-[40px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            당신의 체형은 <span className="text-[#1D9E75]">{info.name}</span>입니다
          </h1>
          <p className="text-base text-[#888780]">
            BMI와 설문 응답을 종합하여 AI가 분석했습니다
          </p>
        </div>

        {/* 결과 카드 */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 mb-6">
          {/* 체형 아이콘 */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full text-6xl mb-4"
              style={{ backgroundColor: info.bgColor }}
            >
              {info.emoji}
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">{info.name}</h2>
            <p className="text-lg text-[#888780]">{info.description}</p>
          </div>

          {/* 점수 분포 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">체형 분포</h3>
            <div className="space-y-4">
              {Object.entries(scores).map(([type, score]) => {
                const percentage = (score / totalScore) * 100;
                const typeInfo = bodyTypeInfo[type as BodyType];
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#1A1A1A]">
                        {typeInfo.emoji} {typeInfo.name}
                      </span>
                      <span className="text-sm text-[#888780]">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-3 bg-[#F5FAF8] rounded-full border border-[#E5E5E5]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: typeInfo.color,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BMI 정보 */}
          {bodyInfo && (
            <div className="mb-8 p-5 rounded-xl bg-[#E1F5EE] border border-[#9FE1CB]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#0F6E56] mb-1">신체 정보</div>
                  <div className="text-lg font-bold text-[#0F6E56]">
                    키 {bodyInfo.height}cm | 몸무게 {bodyInfo.weight}kg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#0F6E56] mb-1">BMI</div>
                  <div className="text-2xl font-bold text-[#0F6E56]">
                    {bodyInfo.bmi.toFixed(1)}
                  </div>
                  <div className="text-xs text-[#0F6E56]">
                    ({getBmiCategory(bodyInfo.bmi)})
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-[#0F6E56]">
                💡 BMI와 설문 응답을 종합하여 체형을 분석했습니다
              </div>
            </div>
          )}

          {/* 체형 특징 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">주요 특징</h3>
            <div className="grid grid-cols-2 gap-3">
              {info.characteristics.map((char, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: info.bgColor }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: info.color }}
                  ></div>
                  <span className="text-sm text-[#1A1A1A]">{char}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 골프 팁 */}
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">
              {info.name} 체형에 맞는 골프 스윙 팁
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {info.golfTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold mt-0.5"
                    style={{ backgroundColor: info.color }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm text-[#1A1A1A] leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/survey")}
            className="flex-1 px-6 py-3.5 rounded-lg bg-white border border-[#CCCCCC] text-[#1A1A1A] font-medium cursor-pointer hover:bg-[#F5FAF8]"
          >
            다시 진단하기
          </button>
          <button
            onClick={() => navigate("/upload")}
            className="flex-1 px-6 py-3.5 rounded-lg bg-[#1D9E75] text-white font-medium cursor-pointer hover:bg-[#0F6E56] border-none"
          >
            스윙 영상 업로드하기
          </button>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center mt-6 p-4 bg-white rounded-xl border border-[#E5E5E5]">
          <p className="text-sm text-[#888780]">
            💡 이 결과는 자가진단 기반이며, 정확한 체형 분석은 전문가와 상담하시기 바랍니다.
            <br />
            체형 정보는 회원님의 맞춤 스윙 분석에 활용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
