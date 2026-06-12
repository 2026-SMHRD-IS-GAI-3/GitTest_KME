export function DocsExport() {
  const pages = [
    {
      category: "인증",
      color: "#1D9E75",
      bg: "#E1F5EE",
      items: [
        {
          route: "/",
          name: "홈 (랜딩)",
          desc: "서비스 소개 및 시작 페이지. 로그인·회원가입 버튼 제공.",
          features: ["서비스 브랜딩", "로그인 / 회원가입 진입"],
        },
        {
          route: "/login",
          name: "로그인",
          desc: "이메일·비밀번호로 로그인. 세션 기반 인증.",
          features: ["이메일 / 비밀번호 입력", "로그인 상태 유지", "회원가입 페이지 이동"],
        },
        {
          route: "/signup/terms",
          name: "회원가입 – 약관 동의",
          desc: "서비스 이용약관, 개인정보 처리방침 동의 화면.",
          features: ["전체 동의 / 개별 동의", "필수·선택 항목 구분", "동의 후 다음 단계 진행"],
        },
        {
          route: "/signup/form",
          name: "회원가입 – 정보 입력",
          desc: "이름, 이메일, 닉네임, 비밀번호, 성별, 키·몸무게, 휴대폰 인증 입력.",
          features: [
            "이메일·닉네임 중복 확인",
            "휴대폰 인증 (통신사 선택 포함)",
            "비밀번호 확인",
            "키 / 몸무게 입력",
          ],
        },
      ],
    },
    {
      category: "체형 진단",
      color: "#3B82F6",
      bg: "#E6F1FB",
      items: [
        {
          route: "/body-info",
          name: "체형 진단 – 신체 정보 입력 & 카메라 스캔",
          desc: "키·몸무게 입력 후 카메라로 신체 비율을 스캔. BT01~BT05 체형 코드 도출.",
          features: [
            "키 / 몸무게 입력",
            "스마트폰 카메라 연동 (팔 벌린 자세)",
            "카운트다운 + 스캔 라인 애니메이션",
            "팔길이/키, 어깨/골반 비율 측정",
            "BT01~BT05 체형 코드 분류",
            "스펙트럼 바 + 골프 스윙 맞춤 팁 표시",
          ],
        },
        {
          route: "/survey",
          name: "체형 설문",
          desc: "추가 체형 관련 설문 조사 화면.",
          features: ["체형 관련 질문 응답", "설문 결과 저장"],
        },
        {
          route: "/survey/result",
          name: "설문 결과",
          desc: "설문 응답 기반 체형 분류 결과 표시.",
          features: ["체형 분류 결과 (외배엽·중배엽·내배엽)", "골프 스윙 추천"],
        },
      ],
    },
    {
      category: "스윙 분석",
      color: "#8B5CF6",
      bg: "#EDE9FE",
      items: [
        {
          route: "/upload",
          name: "스윙 영상 업로드",
          desc: "클럽 선택 → 구질 선택 → 영상 업로드 3단계 위저드.",
          features: [
            "클럽 선택: 드라이버 / 아이언",
            "구질 선택 5종: 스트레이트·드로·페이드·훅·슬라이스",
            "정면·측면 영상 모두 필수 업로드",
            "영상 미리보기",
            "AI 분석 시작",
          ],
        },
        {
          route: "/analysis/result",
          name: "분석 결과",
          desc: "8단계 스윙 분석 결과, 등급, 클럽·구질별 피드백 표시.",
          features: [
            "8단계 스윙 점수 (어드레스~피니시)",
            "종합 점수 및 등급 (루키·아마추어·세미프로·프로·마스터)",
            "등급 엠블럼 이미지",
            "클럽 맞춤 피드백 (드라이버/아이언)",
            "훅·슬라이스 선택 시 구질 교정 피드백",
            "레이더 차트 (recharts)",
          ],
        },
        {
          route: "/history",
          name: "분석 히스토리",
          desc: "과거 스윙 분석 기록 조회 및 비교.",
          features: [
            "클럽·구질 필터링",
            "날짜·점수 정렬",
            "카드 펼치기로 8단계 세부 점수 확인",
            "총 분석 횟수·최고점·평균점·추세 통계",
          ],
        },
      ],
    },
    {
      category: "대시보드",
      color: "#F59E0B",
      bg: "#FEF3C7",
      items: [
        {
          route: "/dashboard",
          name: "대시보드",
          desc: "스윙 성과 종합 현황판. 주간·월간 통계와 8단계 4주 평균 표시.",
          features: [
            "주간 스윙 횟수 바 차트",
            "단계별 4주 평균 라인 차트 (세로 나열)",
            "최근 분석 등급 및 점수",
            "성과 추적 통계",
          ],
        },
      ],
    },
    {
      category: "커뮤니티",
      color: "#EC4899",
      bg: "#FCE7F3",
      items: [
        {
          route: "/community",
          name: "커뮤니티 목록",
          desc: "사용자 게시글 목록. 카테고리 필터, 인기 게시글 표시.",
          features: ["게시글 목록", "카테고리 필터", "좋아요·댓글 수 표시", "글 작성 버튼"],
        },
        {
          route: "/community/post/:id",
          name: "게시글 상세",
          desc: "게시글 전체 내용, 태그, 좋아요, 댓글 섹션.",
          features: ["게시글 본문", "태그", "좋아요 버튼", "댓글 목록 및 작성"],
        },
        {
          route: "/community/write",
          name: "글 작성",
          desc: "새 게시글 작성 폼.",
          features: ["제목·내용 입력", "카테고리 선택", "태그 추가"],
        },
      ],
    },
    {
      category: "마이페이지",
      color: "#6B7280",
      bg: "#F3F4F6",
      items: [
        {
          route: "/mypage",
          name: "마이페이지",
          desc: "사용자 프로필, 등급, 구독 상태, 메뉴 목록.",
          features: [
            "프로필 정보 (닉네임·이메일·체형)",
            "현재 등급 엠블럼",
            "구독 플랜 표시",
            "프로필 편집·비밀번호 변경·구독 관리 진입",
          ],
        },
        {
          route: "/profile/edit",
          name: "프로필 편집",
          desc: "닉네임, 성별, 키·몸무게 수정.",
          features: ["닉네임·성별·신체 정보 수정", "저장 후 마이페이지 반환"],
        },
        {
          route: "/password/confirm",
          name: "비밀번호 확인",
          desc: "비밀번호 변경 전 현재 비밀번호 인증.",
          features: ["현재 비밀번호 입력", "인증 통과 후 변경 페이지 이동"],
        },
        {
          route: "/password/change",
          name: "비밀번호 변경",
          desc: "새 비밀번호 설정.",
          features: ["새 비밀번호 입력·확인", "변경 완료 안내"],
        },
        {
          route: "/subscription",
          name: "구독 플랜",
          desc: "스탠다드(무료)·프리미엄(월 9,900원) 플랜 비교 및 선택.",
          features: [
            "플랜 기능 비교표",
            "현재 플랜 표시",
            "플랜 업그레이드 / 해지",
          ],
        },
      ],
    },
  ];

  const gradeSystem = [
    { grade: "루키", range: "0 – 39점", color: "#9CA3AF" },
    { grade: "아마추어", range: "40 – 59점", color: "#F59E0B" },
    { grade: "세미프로", range: "60 – 74점", color: "#3B82F6" },
    { grade: "프로", range: "75 – 89점", color: "#8B5CF6" },
    { grade: "마스터", range: "90 – 100점", color: "#1D9E75" },
  ];

  const swingStages = [
    "어드레스", "백스윙", "다운스윙", "임팩트/피니시",
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "sans-serif" }}>
      {/* 인쇄 스타일 */}
      <style>{`
        @media print {
          @page { margin: 15mm; size: A4; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* 인쇄 버튼 */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-[#1D9E75] text-white rounded-xl font-bold shadow-lg hover:bg-[#0F6E56] border-none text-sm"
        >
          🖨️ PDF로 저장
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* 표지 */}
        <div className="text-center mb-16 pb-12 border-b border-[#E5E5E5]">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-xs font-bold mb-6">
            SwingLab — 페이지 설계 문서
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A", marginBottom: 12 }}>
            SwingLab
          </h1>
          <p style={{ fontSize: 16, color: "#888780", marginBottom: 8 }}>
            골프 스윙 AI 분석 모바일 웹 애플리케이션
          </p>
          <p style={{ fontSize: 13, color: "#AAAAAA" }}>작성일: 2026년 6월 8일</p>

          <div className="grid grid-cols-3 gap-4 mt-10 text-center">
            {[
              { label: "총 페이지 수", value: `${pages.reduce((a, c) => a + c.items.length, 0)}개` },
              { label: "카테고리", value: `${pages.length}개` },
              { label: "기술 스택", value: "React + Tailwind" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1D9E75" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#888780", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 등급 시스템 */}
        <div className="mb-12">
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 16 }}>
            📊 등급 시스템
          </h2>
          <div className="flex gap-2">
            {gradeSystem.map((g) => (
              <div key={g.grade} className="flex-1 p-3 rounded-xl text-center border border-[#E5E5E5]">
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: g.color, margin: "0 auto 6px" }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{g.grade}</div>
                <div style={{ fontSize: 10, color: "#888780", marginTop: 2 }}>{g.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8단계 스윙 */}
        <div className="mb-12">
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 16 }}>
            🏌️ 스윙 분석 4단계
          </h2>
          <div className="flex gap-2 flex-wrap">
            {swingStages.map((s, i) => (
              <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5FAF8] border border-[#E5E5E5]">
                <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, color: "#1A1A1A" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 체형 코드 */}
        <div className="mb-14">
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 16 }}>
            🧬 BT 체형 코드 분류
          </h2>
          <div className="space-y-2">
            {[
              { code: "BT01", name: "장팔·넓은어깨형", desc: "팔이 길고 어깨가 골반보다 넓음", color: "#1D9E75" },
              { code: "BT02", name: "장팔·좁은어깨형", desc: "팔이 길고 골반이 어깨보다 넓음", color: "#3B82F6" },
              { code: "BT03", name: "단팔·넓은어깨형", desc: "팔이 짧고 어깨가 골반보다 넓음", color: "#8B5CF6" },
              { code: "BT04", name: "단팔·좁은어깨형", desc: "팔이 짧고 골반이 어깨보다 넓음", color: "#F59E0B" },
              { code: "BT05", name: "평균형", desc: "팔 길이와 어깨 너비가 평균 범위", color: "#6B7280" },
            ].map((bt) => (
              <div key={bt.code} className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E5E5]">
                <span style={{ padding: "2px 8px", borderRadius: 6, backgroundColor: bt.color, color: "white", fontSize: 11, fontWeight: 700 }}>{bt.code}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", flex: 1 }}>{bt.name}</span>
                <span style={{ fontSize: 12, color: "#888780" }}>{bt.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지별 상세 */}
        {pages.map((cat, ci) => (
          <div key={cat.category} className={ci > 0 ? "page-break" : ""}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 6, height: 24, borderRadius: 3, backgroundColor: cat.color }} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A" }}>{cat.category}</h2>
              <span style={{ padding: "2px 10px", borderRadius: 20, backgroundColor: cat.bg, color: cat.color, fontSize: 11, fontWeight: 700 }}>
                {cat.items.length}개 페이지
              </span>
            </div>

            <div className="space-y-5 mb-12">
              {cat.items.map((page) => (
                <div key={page.route} className="border border-[#E5E5E5] rounded-2xl overflow-hidden">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: cat.bg }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{page.name}</span>
                    </div>
                    <code style={{ fontSize: 11, color: cat.color, backgroundColor: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: 6, fontFamily: "monospace" }}>
                      {page.route}
                    </code>
                  </div>
                  {/* 설명 */}
                  <div className="px-5 py-4 bg-white">
                    <p style={{ fontSize: 13, color: "#555555", marginBottom: 12, lineHeight: 1.6 }}>{page.desc}</p>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                      주요 기능
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {page.features.map((f) => (
                        <span key={f} style={{ padding: "3px 10px", borderRadius: 20, backgroundColor: "#F5FAF8", border: `1px solid ${cat.color}30`, color: "#555555", fontSize: 11 }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 플로우 */}
        <div className="page-break">
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", marginBottom: 20 }}>🔁 사용자 주요 플로우</h2>
          <div className="space-y-6">
            {[
              {
                title: "신규 가입 플로우",
                color: "#1D9E75",
                steps: ["홈", "약관 동의", "회원가입 폼", "로그인", "체형 진단", "대시보드"],
              },
              {
                title: "스윙 분석 플로우",
                color: "#8B5CF6",
                steps: ["대시보드", "클럽 선택", "구질 선택", "정면·측면 영상 업로드", "AI 분석", "분석 결과"],
              },
              {
                title: "히스토리 조회 플로우",
                color: "#F59E0B",
                steps: ["대시보드", "분석 히스토리", "필터·정렬", "상세 점수 확인"],
              },
            ].map((flow) => (
              <div key={flow.title} className="p-5 rounded-2xl border border-[#E5E5E5]">
                <div style={{ fontSize: 13, fontWeight: 700, color: flow.color, marginBottom: 12 }}>{flow.title}</div>
                <div className="flex items-center flex-wrap gap-1">
                  {flow.steps.map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                      <span style={{ padding: "4px 12px", borderRadius: 20, backgroundColor: `${flow.color}15`, color: flow.color, fontSize: 12, fontWeight: 600 }}>
                        {step}
                      </span>
                      {i < flow.steps.length - 1 && (
                        <span style={{ color: "#CCCCCC", fontSize: 14 }}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-16 pt-8 border-t border-[#E5E5E5] text-center">
          <p style={{ fontSize: 12, color: "#AAAAAA" }}>
            SwingLab · 골프 스윙 AI 분석 · React + Tailwind CSS v4 · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
