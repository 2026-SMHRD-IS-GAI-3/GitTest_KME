import { useState } from "react";
import { useNavigate } from "react-router";

type BodyType = "ectomorph" | "mesomorph" | "endomorph";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    scores: {
      ectomorph: number;
      mesomorph: number;
      endomorph: number;
    };
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "평소 체중 변화는 어떤 편인가요?",
    options: [
      { text: "체중이 잘 늘지 않고 마른 편이다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "체중이 안정적이고 근육이 잘 붙는다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "체중이 쉽게 늘고 빼기 어렵다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 2,
    question: "팔다리 길이와 골격은 어떤가요?",
    options: [
      { text: "팔다리가 길고 가는 편이다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "골격이 탄탄하고 어깨가 넓다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "골격이 작고 둥근 체형이다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 3,
    question: "근육 발달은 어떤 편인가요?",
    options: [
      { text: "운동해도 근육이 잘 안 붙는다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "운동하면 근육이 빠르게 발달한다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "근육보다 지방이 먼저 쌓인다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 4,
    question: "신진대사는 어떤 편인가요?",
    options: [
      { text: "신진대사가 빠르고 많이 먹어도 살이 안 찐다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "신진대사가 적당하고 운동으로 조절 가능하다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "신진대사가 느리고 조금만 먹어도 살이 찐다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 5,
    question: "어깨와 허리 비율은 어떤가요?",
    options: [
      { text: "어깨와 허리가 비슷하게 좁다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "어깨가 넓고 허리가 잘록하다 (V자 체형)", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "어깨와 허리 차이가 적고 전체적으로 둥글다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 6,
    question: "운동 후 회복 속도는 어떤가요?",
    options: [
      { text: "회복이 느리고 쉽게 지친다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "회복이 빠르고 체력이 좋다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "회복은 보통이지만 관절에 부담을 느낀다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 7,
    question: "체지방 분포는 어떤 편인가요?",
    options: [
      { text: "체지방이 거의 없고 뼈가 드러난다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "체지방이 적당하고 근육 라인이 보인다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "복부와 엉덩이에 체지방이 쌓인다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 8,
    question: "손목 둘레는 어떤가요?",
    options: [
      { text: "손목이 얇고 가늘다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "손목이 적당히 두껍고 튼튼하다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "손목이 두껍고 통통하다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 9,
    question: "운동 없이 평소 체형은 어떤가요?",
    options: [
      { text: "마르고 근육이 없다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "운동 안 해도 어느 정도 탄탄하다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "부드럽고 둥근 체형이다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
  {
    id: 10,
    question: "식사량과 식욕은 어떤가요?",
    options: [
      { text: "식욕이 적고 조금만 먹어도 배부르다", scores: { ectomorph: 3, mesomorph: 0, endomorph: 0 } },
      { text: "식욕이 좋고 단백질 위주로 잘 먹는다", scores: { ectomorph: 0, mesomorph: 3, endomorph: 0 } },
      { text: "식욕이 왕성하고 자주 배고프다", scores: { ectomorph: 0, mesomorph: 0, endomorph: 3 } },
    ],
  },
];

export function BodyTypeSurvey() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [bodyInfo, setBodyInfo] = useState<{ height: string; weight: string; bmi: number | null } | null>(null);

  // 신체 정보 가져오기
  useState(() => {
    const savedBodyInfo = localStorage.getItem("bodyInfo");
    if (savedBodyInfo) {
      setBodyInfo(JSON.parse(savedBodyInfo));
    }
  });

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 결과 계산
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const scores = {
      ectomorph: 0,
      mesomorph: 0,
      endomorph: 0,
    };

    answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== -1) {
        const question = questions[questionIndex];
        const option = question.options[answerIndex];
        scores.ectomorph += option.scores.ectomorph;
        scores.mesomorph += option.scores.mesomorph;
        scores.endomorph += option.scores.endomorph;
      }
    });

    // BMI 기반 가중치 추가
    if (bodyInfo && bodyInfo.bmi) {
      const bmi = bodyInfo.bmi;

      // BMI가 낮을수록 외배엽 가중치 증가
      if (bmi < 18.5) {
        scores.ectomorph += 6;
      } else if (bmi < 20) {
        scores.ectomorph += 3;
      }

      // BMI가 정상 범위일 때 중배엽 가중치 증가
      if (bmi >= 20 && bmi < 23) {
        scores.mesomorph += 4;
      } else if (bmi >= 23 && bmi < 25) {
        scores.mesomorph += 2;
      }

      // BMI가 높을수록 내배엽 가중치 증가
      if (bmi >= 25 && bmi < 30) {
        scores.endomorph += 4;
      } else if (bmi >= 30) {
        scores.endomorph += 6;
      }
    }

    // 가장 높은 점수의 체형 결정
    let bodyType: BodyType = "mesomorph";
    let maxScore = scores.mesomorph;

    if (scores.ectomorph > maxScore) {
      bodyType = "ectomorph";
      maxScore = scores.ectomorph;
    }
    if (scores.endomorph > maxScore) {
      bodyType = "endomorph";
    }

    // 결과 페이지로 이동 (BMI 정보 포함)
    navigate("/survey/result", { state: { bodyType, scores, bodyInfo } });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQuestion] !== -1;

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[800px] mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-5 font-medium">
            ✦ 2단계: 체형 자가진단
          </div>
          <h1 className="text-[40px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            나의 <span className="text-[#1D9E75]">체형</span>을 알아보세요
          </h1>
          <p className="text-base text-[#888780]">
            10개의 질문으로 내배엽, 중배엽, 외배엽 체형을 판단합니다
          </p>
          {bodyInfo && bodyInfo.bmi && (
            <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-white border border-[#E5E5E5]">
              <span className="text-sm text-[#888780]">
                입력된 정보: 키 {bodyInfo.height}cm, 몸무게 {bodyInfo.weight}kg (BMI {bodyInfo.bmi.toFixed(1)})
              </span>
            </div>
          )}
        </div>

        {/* 진행률 바 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#1A1A1A]">
              질문 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm text-[#888780]">{Math.round(progress)}% 완료</span>
          </div>
          <div className="h-2 bg-white rounded-full border border-[#E5E5E5]">
            <div
              className="h-full bg-[#1D9E75] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                  answers[currentQuestion] === index
                    ? "border-[#1D9E75] bg-[#E1F5EE]"
                    : "border-[#E5E5E5] bg-white hover:border-[#1D9E75] hover:bg-[#F5FAF8]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[currentQuestion] === index
                        ? "border-[#1D9E75] bg-[#1D9E75]"
                        : "border-[#CCCCCC]"
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-base ${
                      answers[currentQuestion] === index
                        ? "text-[#0F6E56] font-medium"
                        : "text-[#1A1A1A]"
                    }`}
                  >
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`flex-1 px-6 py-3.5 rounded-lg border font-medium transition-all ${
              currentQuestion === 0
                ? "border-[#E5E5E5] bg-[#F5FAF8] text-[#CCCCCC] cursor-not-allowed"
                : "border-[#CCCCCC] bg-white text-[#1A1A1A] hover:bg-[#F5FAF8] cursor-pointer"
            }`}
          >
            이전
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex-1 px-6 py-3.5 rounded-lg font-medium transition-all border-none ${
              isAnswered
                ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56] cursor-pointer"
                : "bg-[#CCCCCC] text-[#888780] cursor-not-allowed"
            }`}
          >
            {currentQuestion === questions.length - 1 ? "결과 보기" : "다음"}
          </button>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#888780]">
            모든 질문에 답변해야 정확한 체형 분석이 가능합니다
          </p>
        </div>
      </div>
    </div>
  );
}
