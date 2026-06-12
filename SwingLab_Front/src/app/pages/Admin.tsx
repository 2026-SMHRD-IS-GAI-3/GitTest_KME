import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface User {
  id: number;
  name: string;
  email: string;
  grade: string;
  bodyType: string;
  analysisCount: number;
  joinDate: string;
  plan: string;
  phone: string;
  recentScore: number;
}

const MOCK_USERS: User[] = [
  { id: 1, name: "홍길동", email: "hong@example.com", grade: "세미프로", bodyType: "BT01", analysisCount: 12, joinDate: "2026.03.15", plan: "Pro", phone: "010-1234-5678", recentScore: 74 },
  { id: 2, name: "김철수", email: "kim@example.com", grade: "아마추어", bodyType: "BT03", analysisCount: 5, joinDate: "2026.04.02", plan: "Standard", phone: "010-2345-6789", recentScore: 55 },
  { id: 3, name: "이영희", email: "lee@example.com", grade: "프로", bodyType: "BT02", analysisCount: 28, joinDate: "2026.02.20", plan: "Prestige", phone: "010-3456-7890", recentScore: 82 },
  { id: 4, name: "박민준", email: "park@example.com", grade: "루키", bodyType: "BT04", analysisCount: 2, joinDate: "2026.05.30", plan: "Standard", phone: "010-4567-8901", recentScore: 38 },
  { id: 5, name: "최수진", email: "choi@example.com", grade: "세미프로", bodyType: "BT01", analysisCount: 9, joinDate: "2026.04.18", plan: "Pro", phone: "010-5678-9012", recentScore: 71 },
];

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  마스터:   { bg: "#EDE9FE", text: "#3C3489" },
  프로:     { bg: "#E6F1FB", text: "#0C447C" },
  세미프로: { bg: "#E1F5EE", text: "#1D9E75" },
  아마추어: { bg: "#FAEEDA", text: "#854F0B" },
  루키:     { bg: "#F5F5F5", text: "#888780" },
};

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  Standard: { bg: "#F5F5F5", text: "#555555" },
  Pro:      { bg: "#E6F1FB", text: "#0C447C" },
  Prestige: { bg: "#EDE9FE", text: "#3C3489" },
};

type ModalType = "totalUsers" | "totalAnalysis" | "paidUsers" | "newUsers" | "userDetail" | null;

export function Admin() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    window.dispatchEvent(new Event("loginStateChange"));
    navigate("/login");
  };

  const filtered = MOCK_USERS.filter((u) =>
    u.name.includes(searchQuery) || u.email.includes(searchQuery)
  );

  const paidUsers = MOCK_USERS.filter((u) => u.plan !== "Standard");
  const newUsers = MOCK_USERS.filter((u) => u.joinDate.startsWith("2026.05") || u.joinDate.startsWith("2026.06"));

  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setModalType("userDetail");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  const stats = [
    { label: "총 회원수", value: `${MOCK_USERS.length}명`, icon: "👥", bg: "#E1F5EE", color: "#1D9E75", type: "totalUsers" as ModalType },
    { label: "총 분석 횟수", value: `${MOCK_USERS.reduce((s, u) => s + u.analysisCount, 0)}회`, icon: "📊", bg: "#E6F1FB", color: "#3B82F6", type: "totalAnalysis" as ModalType },
    { label: "유료 구독자", value: `${paidUsers.length}명`, icon: "💎", bg: "#EDE9FE", color: "#6B46C1", type: "paidUsers" as ModalType },
    { label: "이번 달 가입", value: `${newUsers.length}명`, icon: "🆕", bg: "#FEF3C7", color: "#F59E0B", type: "newUsers" as ModalType },
  ];

  const renderModalContent = () => {
    if (modalType === "userDetail" && selectedUser) {
      const gradeColor = GRADE_COLORS[selectedUser.grade] ?? GRADE_COLORS["루키"];
      const planColor = PLAN_COLORS[selectedUser.plan] ?? PLAN_COLORS["Standard"];
      return (
        <>
          <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">회원 상세 정보</h2>
          <div className="flex items-center gap-3 mb-5 p-4 bg-[#F5FAF8] rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center text-2xl">👤</div>
            <div>
              <p className="font-bold text-[#1A1A1A]">{selectedUser.name}</p>
              <p className="text-xs text-[#888780]">{selectedUser.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "휴대폰", value: selectedUser.phone },
              { label: "가입일", value: selectedUser.joinDate },
              { label: "체형 코드", value: selectedUser.bodyType },
              { label: "최근 점수", value: `${selectedUser.recentScore}점` },
              { label: "총 분석 횟수", value: `${selectedUser.analysisCount}회` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#F0F0F0]">
                <span className="text-sm text-[#888780]">{item.label}</span>
                <span className="text-sm font-medium text-[#1A1A1A]">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-b border-[#F0F0F0]">
              <span className="text-sm text-[#888780]">등급</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: gradeColor.bg, color: gradeColor.text }}>{selectedUser.grade}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#F0F0F0]">
              <span className="text-sm text-[#888780]">구독 플랜</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: planColor.bg, color: planColor.text }}>{selectedUser.plan}</span>
            </div>
          </div>
        </>
      );
    }

    if (modalType === "totalUsers") {
      return (
        <>
          <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">전체 회원 목록</h2>
          <div className="space-y-3">
            {MOCK_USERS.map((u) => {
              const gc = GRADE_COLORS[u.grade] ?? GRADE_COLORS["루키"];
              return (
                <div key={u.id} className="flex items-center justify-between p-3 bg-[#F5FAF8] rounded-xl">
                  <div>
                    <p className="font-medium text-sm text-[#1A1A1A]">{u.name}</p>
                    <p className="text-xs text-[#888780]">{u.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: gc.bg, color: gc.text }}>{u.grade}</span>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    if (modalType === "totalAnalysis") {
      return (
        <>
          <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">분석 횟수 통계</h2>
          <div className="space-y-3">
            {[...MOCK_USERS].sort((a, b) => b.analysisCount - a.analysisCount).map((u) => (
              <div key={u.id} className="p-3 bg-[#F5FAF8] rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-medium text-sm text-[#1A1A1A]">{u.name}</span>
                  <span className="text-sm font-bold text-[#1D9E75]">{u.analysisCount}회</span>
                </div>
                <div className="h-1.5 bg-white rounded-full">
                  <div className="h-full bg-[#1D9E75] rounded-full" style={{ width: `${(u.analysisCount / 28) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-[#E1F5EE] rounded-xl text-center">
              <p className="text-sm text-[#888780]">총 분석 횟수</p>
              <p className="text-2xl font-bold text-[#1D9E75]">{MOCK_USERS.reduce((s, u) => s + u.analysisCount, 0)}회</p>
            </div>
          </div>
        </>
      );
    }

    if (modalType === "paidUsers") {
      return (
        <>
          <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">유료 구독자 목록</h2>
          <div className="space-y-3">
            {paidUsers.map((u) => {
              const pc = PLAN_COLORS[u.plan];
              return (
                <div key={u.id} className="flex items-center justify-between p-3 bg-[#F5FAF8] rounded-xl">
                  <div>
                    <p className="font-medium text-sm text-[#1A1A1A]">{u.name}</p>
                    <p className="text-xs text-[#888780]">{u.email}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: pc.bg, color: pc.text }}>{u.plan}</span>
                </div>
              );
            })}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {["Pro", "Prestige"].map((plan) => {
                const count = MOCK_USERS.filter((u) => u.plan === plan).length;
                const pc = PLAN_COLORS[plan];
                return (
                  <div key={plan} className="p-3 rounded-xl text-center" style={{ backgroundColor: pc.bg }}>
                    <p className="text-xs mb-1" style={{ color: pc.text }}>{plan}</p>
                    <p className="text-xl font-bold" style={{ color: pc.text }}>{count}명</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    }

    if (modalType === "newUsers") {
      return (
        <>
          <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">이번 달 신규 가입</h2>
          <div className="space-y-3">
            {newUsers.map((u) => {
              const gc = GRADE_COLORS[u.grade] ?? GRADE_COLORS["루키"];
              return (
                <div key={u.id} className="p-3 bg-[#F5FAF8] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-[#1A1A1A]">{u.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: gc.bg, color: gc.text }}>{u.grade}</span>
                  </div>
                  <p className="text-xs text-[#888780]">{u.email}</p>
                  <p className="text-xs text-[#888780] mt-0.5">가입일: {u.joinDate}</p>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4">
      <div className="max-w-[430px] mx-auto px-4">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-[#D85A30] font-medium mb-0.5">🔐 관리자 페이지</p>
            <h1 className="text-xl font-bold text-[#1A1A1A]">SwingLab Admin</h1>
          </div>
          <button onClick={handleLogout} className="px-3 py-2 text-xs border border-[#E5E5E5] rounded-lg text-[#888780] bg-white hover:bg-[#F5F5F5]">
            로그아웃
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => setModalType(s.type)}
              className="bg-white rounded-xl border border-[#E5E5E5] p-4 text-left hover:border-[#1D9E75] hover:shadow-sm transition-all active:scale-95"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2" style={{ backgroundColor: s.bg }}>
                {s.icon}
              </div>
              <div className="font-bold text-lg" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[#888780] mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* 회원 목록 */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#1A1A1A]">회원 목록</h3>
            <span className="text-xs text-[#888780]">{filtered.length}명</span>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름 또는 이메일 검색"
              className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg bg-[#F5FAF8] text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888780]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="space-y-3">
            {filtered.map((user) => {
              const gradeColor = GRADE_COLORS[user.grade] ?? GRADE_COLORS["루키"];
              const planColor = PLAN_COLORS[user.plan] ?? PLAN_COLORS["Standard"];
              return (
                <button
                  key={user.id}
                  onClick={() => openUserDetail(user)}
                  className="w-full p-3 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5] text-left hover:border-[#1D9E75] transition-all active:scale-95"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-[#1A1A1A]">{user.name}</span>
                      <p className="text-xs text-[#888780]">{user.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: planColor.bg, color: planColor.text }}>
                      {user.plan}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: gradeColor.bg, color: gradeColor.text }}>{user.grade}</span>
                    <span className="text-xs text-[#888780]">{user.bodyType}</span>
                    <span className="text-xs text-[#888780]">분석 {user.analysisCount}회</span>
                    <span className="text-xs text-[#888780] ml-auto">가입 {user.joinDate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F5] text-[#888780] hover:bg-[#E5E5E5]">
              ✕
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}
