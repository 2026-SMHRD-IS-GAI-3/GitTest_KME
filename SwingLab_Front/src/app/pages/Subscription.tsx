import { useState } from "react";
import { useNavigate } from "react-router";

type BillingCycle = "monthly" | "yearly";
type PlanType = "standard" | "pro" | "prestige";

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  id: PlanType;
  name: string;
  icon: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  features: PlanFeature[];
}

const plans: Plan[] = [
  {
    id: "standard",
    name: "Standard",
    icon: "🍃",
    description: "골프를 막 시작한 분들을 위한 기본 플랜",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: "월 10회 스윙 분석", included: true },
      { text: "8단계 구간별 점수", included: true },
      { text: "기본 코칭 메시지", included: true },
      { text: "주간 성장 히스토리", included: true },
      { text: "프로 비교 영상", included: false },
      { text: "체형별 심화 코칭", included: false },
      { text: "우선순위 분석", included: false },
      { text: "1:1 전문가 피드백", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: "🏆",
    description: "실력 향상을 원하는 골퍼를 위한 프리미엄 플랜",
    monthlyPrice: 19900,
    yearlyPrice: 199000,
    badge: "가장 인기",
    features: [
      { text: "무제한 스윙 분석", included: true },
      { text: "8단계 구간별 점수", included: true },
      { text: "체형별 심화 코칭 메시지", included: true },
      { text: "프로 비교 영상", included: true },
      { text: "월간 성장 리포트", included: true },
      { text: "커뮤니티 공유 기능", included: true },
      { text: "1:1 전문가 피드백", included: false },
      { text: "맞춤 훈련 프로그램", included: false },
    ],
  },
  {
    id: "prestige",
    name: "Prestige",
    icon: "💎",
    description: "최상의 퍼포먼스를 원하는 골퍼를 위한 프리미엄",
    monthlyPrice: 39900,
    yearlyPrice: 399000,
    features: [
      { text: "무제한 스윙 분석", included: true },
      { text: "8단계 구간별 점수", included: true },
      { text: "체형별 심화 코칭 메시지", included: true },
      { text: "프로 비교 영상", included: true },
      { text: "월간 + 심층 성장 리포트", included: true, highlight: true },
      { text: "월 2회 1:1 전문가 피드백", included: true, highlight: true },
      { text: "맞춤 훈련 프로그램", included: true },
      { text: "우선 고객 지원", included: true },
    ],
  },
];

export function Subscription() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showComparison, setShowComparison] = useState(false);

  const handleSubscribe = (planId: PlanType) => {
    if (planId === "standard") {
      alert("Standard 플랜이 적용되었습니다!");
    } else {
      alert(`${planId.charAt(0).toUpperCase() + planId.slice(1)} 플랜 구독 페이지로 이동합니다.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4">
      <div className="max-w-[430px] mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-4 font-medium">
            ✨ 구독 플랜
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
            나에게 맞는 <span className="text-[#1D9E75]">플랜</span>을 선택하세요
          </h1>
          <p className="text-base text-[#888780]">
            언제든지 업그레이드하거나 취소할 수 있어요
          </p>
        </div>

        {/* 결제 주기 토글 */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-[#1D9E75] text-white"
                : "bg-white text-[#888780] border border-[#E5E5E5]"
            }`}
          >
            월간 결제
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
              billingCycle === "yearly"
                ? "bg-[#1D9E75] text-white"
                : "bg-white text-[#888780] border border-[#E5E5E5]"
            }`}
          >
            연간 결제
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#F59E0B] text-white text-xs rounded-full">
              2개월 무료
            </span>
          </button>
        </div>

        {/* 플랜 카드 */}
        <div className="flex flex-col gap-4 mb-5">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const isPro = plan.id === "pro";

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-5 relative ${
                  isPro
                    ? "border-2 border-[#1D9E75] shadow-xl"
                    : "border border-[#E5E5E5]"
                }`}
              >
                {/* 뱃지 */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1D9E75] text-white text-xs font-bold rounded-full">
                    {plan.badge}
                  </div>
                )}

                {/* 플랜 헤더 */}
                <div className="text-center mb-4">
                  <div className="text-sm text-[#888780] mb-1">{plan.name}</div>
                  <div className="text-3xl mb-2">{plan.icon}</div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{plan.name}</h3>
                  <p className="text-xs text-[#888780] leading-relaxed mb-3">
                    {plan.description}
                  </p>

                  {/* 가격 */}
                  <div className="mb-4">
                    {price === 0 ? (
                      <div className="text-3xl font-bold text-[#1D9E75]">무료</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-[#1A1A1A]">
                          {price.toLocaleString()}
                          <span className="text-lg font-normal text-[#888780]">원</span>
                        </div>
                        <div className="text-sm text-[#888780]">
                          / {billingCycle === "monthly" ? "월" : "년"}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 기능 목록 */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${
                        !feature.included ? "opacity-40" : ""
                      }`}
                    >
                      {feature.included ? (
                        <svg
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            feature.highlight ? "text-[#F59E0B]" : "text-[#1D9E75]"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#CCCCCC]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span
                        className={`text-sm ${
                          feature.highlight
                            ? "text-[#F59E0B] font-medium"
                            : "text-[#1A1A1A]"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 버튼 */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    isPro
                      ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
                      : "bg-white border border-[#CCCCCC] text-[#1A1A1A] hover:bg-[#F5FAF8]"
                  }`}
                >
                  시작하기
                </button>
              </div>
            );
          })}
        </div>

        {/* 플랜 상세 비교 버튼 */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E5E5E5] text-[#1A1A1A] font-medium hover:bg-[#F5FAF8]"
          >
            <span>플랜 상세 비교</span>
            <svg
              className={`w-5 h-5 transition-transform ${showComparison ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* 플랜 비교 표 */}
        {showComparison && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-5">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">플랜 상세 비교</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    <th className="text-left py-4 px-4 font-medium text-[#1A1A1A]">기능</th>
                    <th className="text-center py-4 px-4 font-medium text-[#1A1A1A]">Standard</th>
                    <th className="text-center py-4 px-4 font-medium text-[#1D9E75] bg-[#E1F5EE]">
                      Pro
                    </th>
                    <th className="text-center py-4 px-4 font-medium text-[#6B46C1] bg-[#F3E8FF]">
                      Prestige
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#E5E5E5]">
                    <td className="py-4 px-4 text-[#1A1A1A]">월 분석 횟수</td>
                    <td className="py-4 px-4 text-center text-[#888780]">10회</td>
                    <td className="py-4 px-4 text-center text-[#1D9E75] bg-[#E1F5EE]">무제한</td>
                    <td className="py-4 px-4 text-center text-[#6B46C1] bg-[#F3E8FF]">무제한</td>
                  </tr>
                  <tr className="border-b border-[#E5E5E5]">
                    <td className="py-4 px-4 text-[#1A1A1A]">8단계 구간 점수</td>
                    <td className="py-4 px-4 text-center">
                      <svg className="w-5 h-5 mx-auto text-[#1D9E75]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-4 text-center bg-[#E1F5EE]">
                      <svg className="w-5 h-5 mx-auto text-[#1D9E75]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-4 text-center bg-[#F3E8FF]">
                      <svg className="w-5 h-5 mx-auto text-[#1D9E75]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="border-b border-[#E5E5E5]">
                    <td className="py-4 px-4 text-[#1A1A1A]">코칭 메시지</td>
                    <td className="py-4 px-4 text-center text-[#888780]">기본</td>
                    <td className="py-4 px-4 text-center text-[#1D9E75] bg-[#E1F5EE]">체형별 심화</td>
                    <td className="py-4 px-4 text-center text-[#6B46C1] bg-[#F3E8FF]">체형별 심화</td>
                  </tr>
                  <tr className="border-b border-[#E5E5E5]">
                    <td className="py-4 px-4 text-[#1A1A1A]">프로 비교 영상</td>
                    <td className="py-4 px-4 text-center text-[#888780]">-</td>
                    <td className="py-4 px-4 text-center bg-[#E1F5EE]">
                      <svg className="w-5 h-5 mx-auto text-[#1D9E75]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-4 text-center bg-[#F3E8FF]">
                      <svg className="w-5 h-5 mx-auto text-[#1D9E75]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="border-b border-[#E5E5E5]">
                    <td className="py-4 px-4 text-[#1A1A1A]">성장 리포트</td>
                    <td className="py-4 px-4 text-center text-[#888780]">주간</td>
                    <td className="py-4 px-4 text-center text-[#1D9E75] bg-[#E1F5EE]">월간</td>
                    <td className="py-4 px-4 text-center text-[#6B46C1] bg-[#F3E8FF]">월간 + 심층</td>
                  </tr>
                  <tr className="border-b border-[#E5E5E5]">
                    <td className="py-4 px-4 text-[#1A1A1A]">1:1 전문가 피드백</td>
                    <td className="py-4 px-4 text-center text-[#888780]">-</td>
                    <td className="py-4 px-4 text-center text-[#888780] bg-[#E1F5EE]">-</td>
                    <td className="py-4 px-4 text-center text-[#6B46C1] bg-[#F3E8FF]">월 2회</td>
                  </tr>
                  <tr className="border-b border-[#E5E5E5]">
                    <td className="py-4 px-4 text-[#1A1A1A]">맞춤 훈련 프로그램</td>
                    <td className="py-4 px-4 text-center text-[#888780]">-</td>
                    <td className="py-4 px-4 text-center text-[#888780] bg-[#E1F5EE]">-</td>
                    <td className="py-4 px-4 text-center bg-[#F3E8FF]">
                      <svg className="w-5 h-5 mx-auto text-[#1D9E75]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-[#1A1A1A]">고객 지원</td>
                    <td className="py-4 px-4 text-center text-[#888780]">이메일</td>
                    <td className="py-4 px-4 text-center text-[#1D9E75] bg-[#E1F5EE]">이메일 + 채팅</td>
                    <td className="py-4 px-4 text-center text-[#6B46C1] bg-[#F3E8FF]">우선 전담 지원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">자주 묻는 질문</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F5FAF8]">
              <div className="font-medium text-[#1A1A1A] mb-2">Q. 플랜을 변경할 수 있나요?</div>
              <div className="text-sm text-[#888780]">
                A. 네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 즉시 적용됩니다.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#F5FAF8]">
              <div className="font-medium text-[#1A1A1A] mb-2">Q. 연간 결제 시 환불이 가능한가요?</div>
              <div className="text-sm text-[#888780]">
                A. 구독 후 7일 이내 전액 환불이 가능합니다. 그 이후에는 남은 기간에 대해 일할 계산하여 환불해드립니다.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#F5FAF8]">
              <div className="font-medium text-[#1A1A1A] mb-2">Q. Standard 플랜으로도 충분한가요?</div>
              <div className="text-sm text-[#888780]">
                A. 골프를 시작하는 단계라면 Standard 플랜으로 충분합니다. 실력 향상을 위해서는 Pro 이상을 추천드립니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
