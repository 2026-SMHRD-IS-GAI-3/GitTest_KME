import { useRef, useState } from "react";
import domtoimage from "dom-to-image-more";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import semiproImage from "../../imports/semipro.PNG";
import amateurImage from "../../imports/amateur.PNG";
import proImage from "../../imports/pro.PNG";

const GREEN = "#1D9E75";
const DARK = "#1A1A1A";
const GRAY = "#888780";
const LIGHT = "#F5FAF8";
const BORDER = "#E5E5E5";
const GREEN_BG = "#E1F5EE";


function NavBar({ title }: { title?: string }) {
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
      <span style={{ fontSize: 8, fontWeight: 700, color: DARK }}>{title ?? "SwingLab"}</span>
    </div>
  );
}

function BottomNav() {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${BORDER}`, display: "flex", padding: "4px 0" }}>
      {[["🏠","홈"],["📊","대시보드"],["📹","분석"],["👤","마이"]].map(([icon, label]) => (
        <div key={label} style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 10 }}>{icon}</div>
          <div style={{ fontSize: 6, color: GRAY }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function Input({ placeholder }: { placeholder: string }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 8px", marginBottom: 5, background: "#fff" }}>
      <span style={{ fontSize: 7, color: "#CCCCCC" }}>{placeholder}</span>
    </div>
  );
}

function Btn({ label, small }: { label: string; small?: boolean }) {
  return (
    <div style={{ background: GREEN, borderRadius: 6, padding: small ? "3px 8px" : "5px 0", textAlign: "center", color: "#fff", fontSize: small ? 7 : 8, fontWeight: 700, marginBottom: 5 }}>
      {label}
    </div>
  );
}

function ScoreBar({ score, color = GREEN }: { score: number; color?: string }) {
  return (
    <div style={{ height: 4, background: "#F0F0F0", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 2 }} />
    </div>
  );
}

// ── 각 화면 ─────────────────────────────────────────────────────────────────

const HomeScreen = () => (
  <div style={{ height: "100%", background: `linear-gradient(160deg, #0F6E56 0%, #1D9E75 60%, #2DC98B 100%)`, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
    <div style={{ fontSize: 20, marginBottom: 2 }}>⛳</div>
    <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>SwingLab</div>
    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: 8 }}>AI 골프 스윙 분석 플랫폼</div>
    <div style={{ background: "#fff", borderRadius: 6, padding: "5px 20px", fontSize: 8, fontWeight: 700, color: GREEN }}>로그인</div>
    <div style={{ border: "1px solid rgba(255,255,255,0.5)", borderRadius: 6, padding: "5px 16px", fontSize: 8, fontWeight: 700, color: "#fff" }}>회원가입</div>
  </div>
);

const LoginScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "14px 12px" }}>
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: DARK }}>로그인</div>
      <div style={{ fontSize: 7, color: GRAY }}>SwingLab에 오신 것을 환영합니다</div>
    </div>
    <div style={{ background: "#fff", borderRadius: 10, padding: 10, border: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: 7, fontWeight: 600, color: DARK, marginBottom: 3 }}>이메일</div>
      <Input placeholder="email@example.com" />
      <div style={{ fontSize: 7, fontWeight: 600, color: DARK, marginBottom: 3 }}>비밀번호</div>
      <Input placeholder="••••••••" />
      <Btn label="로그인" />
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 6, color: GRAY }}>회원가입</span>
        <span style={{ fontSize: 6, color: "#ddd" }}>|</span>
        <span style={{ fontSize: 6, color: GRAY }}>ID·PW 찾기</span>
      </div>
    </div>
  </div>
);

const TermsScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "14px 12px" }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: DARK, marginBottom: 4 }}>이용약관 동의</div>
    <div style={{ fontSize: 7, color: GRAY, marginBottom: 10 }}>서비스 이용을 위해 약관에 동의해주세요</div>
    {["[필수] 서비스 이용약관","[필수] 개인정보 처리방침","[선택] 마케팅 정보 수신"].map((t, i) => (
      <div key={i} style={{ background: "#fff", borderRadius: 6, padding: "6px 8px", border: `1px solid ${BORDER}`, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${i < 2 ? GREEN : BORDER}`, background: i < 2 ? GREEN_BG : "#fff", flexShrink: 0 }} />
        <span style={{ fontSize: 7, color: DARK }}>{t}</span>
      </div>
    ))}
    <div style={{ marginTop: 8 }}><Btn label="다음" /></div>
  </div>
);

const SignupScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "10px 12px", overflowY: "hidden" }}>
    <div style={{ fontSize: 10, fontWeight: 800, color: DARK, marginBottom: 8 }}>회원가입</div>
    <div style={{ background: "#fff", borderRadius: 10, padding: 10, border: `1px solid ${BORDER}` }}>
      {["이름","이메일","닉네임","비밀번호","성별","키 (cm)","몸무게 (kg)"].map((f) => (
        <div key={f}>
          <div style={{ fontSize: 6, fontWeight: 600, color: DARK, marginBottom: 2 }}>{f}</div>
          <Input placeholder={f === "성별" ? "선택" : `${f} 입력`} />
        </div>
      ))}
      <Btn label="회원가입" />
    </div>
  </div>
);

const DashboardScreen = () => (
  <div style={{ height: "100%", background: LIGHT, paddingBottom: 28 }}>
    <NavBar title="대시보드" />
    <div style={{ padding: "8px 10px", overflowY: "hidden" }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: DARK, marginBottom: 6 }}>안녕하세요, <span style={{ color: GREEN }}>홍길동</span> 님</div>
      <div style={{ background: `linear-gradient(135deg,${GREEN},#0F6E56)`, borderRadius: 8, padding: "8px 10px", marginBottom: 6, color: "#fff" }}>
        <div style={{ fontSize: 8 }}>📹</div>
        <div style={{ fontSize: 8, fontWeight: 700 }}>스윙 분석하기</div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 8, border: `1px solid ${BORDER}`, marginBottom: 6 }}>
        <div style={{ fontSize: 7, fontWeight: 700, color: DARK, marginBottom: 4 }}>현재 등급</div>
        <div style={{ textAlign: "center" }}>
          <img src={semiproImage} style={{ height: 28, objectFit: "contain" }} />
          <div style={{ fontSize: 7, fontWeight: 700, color: DARK }}>세미프로</div>
          <div style={{ fontSize: 6, color: GRAY }}>평균 74점</div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 8, border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 7, fontWeight: 700, color: DARK, marginBottom: 4 }}>4단계 4주 평균</div>
        {["어드레스","백스윙","다운스윙","임팩트/피니시"].map((s, i) => (
          <div key={s} style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ fontSize: 6, color: DARK }}>{s}</span>
              <span style={{ fontSize: 6, color: GREEN, fontWeight: 700 }}>{[75,67,70,74][i]}점</span>
            </div>
            <ScoreBar score={[75,67,70,74][i]} />
          </div>
        ))}
      </div>
    </div>
    <BottomNav />
  </div>
);

const BodyInfoScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "10px 12px" }}>
    <div style={{ fontSize: 10, fontWeight: 800, color: DARK, marginBottom: 2 }}>체형 진단</div>
    <div style={{ fontSize: 7, color: GRAY, marginBottom: 8 }}>카메라로 신체 비율을 분석합니다</div>
    <div style={{ background: "#fff", borderRadius: 10, padding: 10, border: `1px solid ${BORDER}`, marginBottom: 6 }}>
      <div style={{ fontSize: 7, fontWeight: 600, color: DARK, marginBottom: 3 }}>키 (cm)</div>
      <Input placeholder="175" />
      <div style={{ fontSize: 7, fontWeight: 600, color: DARK, marginBottom: 3 }}>몸무게 (kg)</div>
      <Input placeholder="70" />
      <Btn label="카메라로 체형 분석 시작 →" />
    </div>
    <div style={{ background: "#000", borderRadius: 10, height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 7, textAlign: "center" }}>📷<br />카메라 스캔</div>
      <div style={{ position: "absolute", top: "40%", left: 0, right: 0, height: 1, background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
    </div>
  </div>
);

const BodyResultScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "10px 12px" }}>
    <div style={{ fontSize: 8, fontWeight: 700, color: GREEN, marginBottom: 2 }}>✦ 체형 코드 분석 완료</div>
    <div style={{ background: GREEN_BG, border: `2px solid #9FE1CB`, borderRadius: 10, padding: 8, marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 18 }}>🏋️</div>
        <div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ background: GREEN, color: "#fff", fontSize: 6, fontWeight: 700, borderRadius: 4, padding: "1px 5px" }}>BT01</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: DARK }}>장팔·넓은어깨형</span>
          </div>
          <div style={{ fontSize: 6, color: GRAY }}>팔이 길고 어깨가 골반보다 넓음</div>
        </div>
      </div>
    </div>
    {[["팔 길이 유형","43.8%","장팔",GREEN],[" 어깨 너비 유형","1.07x","넓은어깨",GREEN],["다리 길이","49.2%","평균",GRAY]].map(([label,val,type,c], i) => (
      <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "6px 8px", border: `1px solid ${BORDER}`, marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 7, color: DARK }}>{label}</span>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <span style={{ fontSize: 6, color: GRAY }}>{val}</span>
            <span style={{ fontSize: 6, fontWeight: 700, color: c as string, background: `${c as string}20`, borderRadius: 4, padding: "1px 4px" }}>{type}</span>
          </div>
        </div>
        <ScoreBar score={[70, 60, 50][i]} color={c as string} />
      </div>
    ))}
    <Btn label="대시보드로 이동 →" />
  </div>
);

const UploadScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "10px 12px" }}>
    <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
      {["클럽선택","구질선택","영상업로드"].map((s, i) => (
        <div key={s} style={{ flex: 1, textAlign: "center", fontSize: 6, fontWeight: 700, color: i === 2 ? GREEN : GRAY, borderBottom: `2px solid ${i === 2 ? GREEN : BORDER}`, paddingBottom: 3 }}>{s}</div>
      ))}
    </div>
    <div style={{ fontSize: 9, fontWeight: 800, color: DARK, marginBottom: 6 }}>영상 업로드</div>
    {[["정면 영상","📹"],["측면 영상","🎬"]].map(([label, icon]) => (
      <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "6px 10px", marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 7, fontWeight: 700, color: DARK }}>{label}</div>
          <div style={{ fontSize: 6, color: "#EF4444", fontWeight: 600 }}>필수</div>
        </div>
      </div>
    ))}
    <Btn label="AI 분석 시작" />
  </div>
);

const AnalysisScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "8px 10px", overflowY: "hidden" }}>
    <div style={{ textAlign: "center", marginBottom: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: DARK }}><span style={{ color: GREEN }}>스윙 분석</span> 결과</div>
    </div>
    <div style={{ background: "#fff", borderRadius: 8, padding: "6px 8px", border: `1px solid ${BORDER}`, marginBottom: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <img src={semiproImage} style={{ height: 24, objectFit: "contain" }} />
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, color: DARK }}>세미프로 등급</div>
          <div style={{ fontSize: 7, color: GRAY }}>평균 <span style={{ color: GREEN, fontWeight: 700 }}>74점</span></div>
        </div>
      </div>
      <ScoreBar score={74} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 5 }}>
      {[["어드레스",78],["백스윙",69],["다운스윙",81],["임팩트/피니시",74]].map(([name, score]) => (
        <div key={name as string} style={{ background: "#fff", borderRadius: 6, padding: "5px 6px", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 6, color: GRAY }}>{name}</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: GREEN }}>{score}점</div>
          <ScoreBar score={score as number} />
        </div>
      ))}
    </div>
    <div style={{ background: "#fff", borderRadius: 8, padding: "6px 8px", border: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: 7, fontWeight: 700, color: DARK, marginBottom: 4 }}>업로드한 스윙 영상</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[["📹","정면"],["🎬","측면"]].map(([icon, label]) => (
          <div key={label as string} style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", borderRadius: 6, border: `1px solid ${BORDER}`, background: LIGHT }}>
            <span style={{ fontSize: 12 }}>{icon}</span>
            <span style={{ fontSize: 6, color: GRAY }}>{label} 영상</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HistoryScreen = () => (
  <div style={{ height: "100%", background: LIGHT, paddingBottom: 28 }}>
    <NavBar title="분석 히스토리" />
    <div style={{ padding: "8px 10px" }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
        {["전체","드라이버","아이언"].map((f, i) => (
          <div key={f} style={{ fontSize: 6, fontWeight: 700, padding: "2px 6px", borderRadius: 10, background: i === 0 ? GREEN : "#fff", color: i === 0 ? "#fff" : GRAY, border: `1px solid ${i === 0 ? GREEN : BORDER}` }}>{f}</div>
        ))}
      </div>
      {[{date:"06.08",grade:"세미프로",img:semiproImage,avg:72},{date:"06.05",grade:"세미프로",img:semiproImage,avg:65},{date:"06.01",grade:"아마추어",img:amateurImage,avg:55}].map((h) => (
        <div key={h.date} style={{ background: "#fff", borderRadius: 8, padding: "7px 8px", border: `1px solid ${BORDER}`, marginBottom: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <img src={h.img} style={{ height: 24, objectFit: "contain" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: DARK }}>2026.{h.date}</div>
              <div style={{ fontSize: 6, color: GRAY }}>{h.grade} · 평균 {h.avg}점</div>
            </div>
            <div style={{ fontSize: 7, color: GRAY }}>›</div>
          </div>
        </div>
      ))}
    </div>
    <BottomNav />
  </div>
);

const MyPageScreen = () => (
  <div style={{ height: "100%", background: LIGHT, paddingBottom: 28 }}>
    <NavBar title="마이페이지" />
    <div style={{ padding: "8px 10px" }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: 10, border: `1px solid ${BORDER}`, marginBottom: 6, textAlign: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: GREEN_BG, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: DARK }}>홍길동</div>
        <div style={{ fontSize: 7, color: GRAY }}>hong@swinglab.com</div>
        <img src={semiproImage} style={{ height: 24, objectFit: "contain", margin: "4px auto 0", display: "block" }} />
        <div style={{ fontSize: 7, fontWeight: 700, color: GREEN }}>세미프로</div>
      </div>
      {["프로필 편집","비밀번호 변경","구독 플랜","분석 히스토리","로그아웃"].map((m) => (
        <div key={m} style={{ background: "#fff", borderRadius: 8, padding: "7px 10px", border: `1px solid ${BORDER}`, marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 8, color: DARK }}>{m}</span>
          <span style={{ fontSize: 8, color: GRAY }}>›</span>
        </div>
      ))}
    </div>
    <BottomNav />
  </div>
);

const SubscriptionScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "10px 12px" }}>
    <div style={{ fontSize: 10, fontWeight: 800, color: DARK, marginBottom: 2 }}>구독 플랜</div>
    <div style={{ fontSize: 7, color: GRAY, marginBottom: 8 }}>나에게 맞는 플랜을 선택하세요</div>
    <div style={{ background: "#fff", borderRadius: 10, border: `1px solid ${BORDER}`, padding: 8, marginBottom: 6 }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: DARK }}>스탠다드</div>
      <div style={{ fontSize: 12, fontWeight: 800, color: DARK }}>0<span style={{ fontSize: 7 }}>원</span></div>
      {["월 3회 스윙 분석","기본 피드백","커뮤니티 이용"].map((f) => (
        <div key={f} style={{ fontSize: 6, color: GRAY, display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
          <span style={{ color: GREEN }}>✓</span>{f}
        </div>
      ))}
    </div>
    <div style={{ background: GREEN_BG, borderRadius: 10, border: `2px solid ${GREEN}`, padding: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: GREEN }}>프리미엄</div>
        <div style={{ fontSize: 6, background: GREEN, color: "#fff", borderRadius: 4, padding: "1px 5px" }}>추천</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: GREEN }}>9,900<span style={{ fontSize: 7 }}>원/월</span></div>
      {["무제한 스윙 분석","AI 심층 피드백","체형 맞춤 코칭","히스토리 무제한"].map((f) => (
        <div key={f} style={{ fontSize: 6, color: GRAY, display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
          <span style={{ color: GREEN }}>✓</span>{f}
        </div>
      ))}
      <div style={{ marginTop: 6 }}><Btn label="프리미엄 시작하기" /></div>
    </div>
  </div>
);

const CommunityScreen = () => (
  <div style={{ height: "100%", background: LIGHT, paddingBottom: 28 }}>
    <NavBar title="커뮤니티" />
    <div style={{ padding: "8px 10px" }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
        {["전체","팁","질문","후기"].map((c, i) => (
          <div key={c} style={{ fontSize: 6, padding: "2px 6px", borderRadius: 10, background: i === 0 ? GREEN : "#fff", color: i === 0 ? "#fff" : GRAY, border: `1px solid ${i === 0 ? GREEN : BORDER}` }}>{c}</div>
        ))}
      </div>
      {["드라이버 슬라이스 교정 팁","다운스윙 자세 질문","레슨 후기 공유합니다"].map((title) => (
        <div key={title} style={{ background: "#fff", borderRadius: 8, padding: "7px 8px", border: `1px solid ${BORDER}`, marginBottom: 5 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: DARK, marginBottom: 2 }}>{title}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 6, color: GRAY }}>❤️ 12</span>
            <span style={{ fontSize: 6, color: GRAY }}>💬 5</span>
          </div>
        </div>
      ))}
    </div>
    <BottomNav />
  </div>
);

const FindAccountScreen = () => (
  <div style={{ height: "100%", background: LIGHT, padding: "10px 12px" }}>
    <div style={{ fontSize: 10, fontWeight: 800, color: DARK, marginBottom: 6 }}>계정 찾기</div>
    <div style={{ display: "flex", background: "#E5E5E5", borderRadius: 8, padding: 3, marginBottom: 8 }}>
      <div style={{ flex: 1, textAlign: "center", background: "#fff", borderRadius: 6, padding: "3px 0", fontSize: 7, fontWeight: 700, color: GREEN }}>아이디 찾기</div>
      <div style={{ flex: 1, textAlign: "center", padding: "3px 0", fontSize: 7, fontWeight: 700, color: GRAY }}>비밀번호 찾기</div>
    </div>
    <div style={{ background: "#fff", borderRadius: 10, padding: 10, border: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: 7, fontWeight: 600, color: DARK, marginBottom: 3 }}>이름</div>
      <Input placeholder="홍길동" />
      <div style={{ fontSize: 7, fontWeight: 600, color: DARK, marginBottom: 3 }}>휴대폰번호</div>
      <Input placeholder="01012345678" />
      <Btn label="아이디 찾기" />
      <div style={{ background: GREEN_BG, border: `1px solid #9FE1CB`, borderRadius: 6, padding: "5px 8px", marginTop: 4 }}>
        <div style={{ fontSize: 6, color: "#0F6E56", fontWeight: 700 }}>찾은 아이디</div>
        <div style={{ fontSize: 8, fontWeight: 800, color: GREEN }}>ho***@swinglab.com</div>
      </div>
    </div>
  </div>
);

const screens = [
  { title: "01 홈",          component: <HomeScreen /> },
  { title: "02 로그인",      component: <LoginScreen /> },
  { title: "03 약관 동의",   component: <TermsScreen /> },
  { title: "04 회원가입",    component: <SignupScreen /> },
  { title: "05 계정 찾기",   component: <FindAccountScreen /> },
  { title: "06 대시보드",    component: <DashboardScreen /> },
  { title: "07 체형 진단",   component: <BodyInfoScreen /> },
  { title: "08 체형 결과",   component: <BodyResultScreen /> },
  { title: "09 영상 업로드", component: <UploadScreen /> },
  { title: "10 분석 결과",   component: <AnalysisScreen /> },
  { title: "11 히스토리",    component: <HistoryScreen /> },
  { title: "12 마이페이지",  component: <MyPageScreen /> },
  { title: "13 구독 플랜",   component: <SubscriptionScreen /> },
  { title: "14 커뮤니티",    component: <CommunityScreen /> },
];

export function Storyboard() {
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExportZip = async () => {
    setExporting(true);
    setProgress(0);

    // @font-face 제거 (CORS 방지)
    const removedRules: { sheet: CSSStyleSheet; index: number; text: string }[] = [];
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules ?? []);
        for (let i = rules.length - 1; i >= 0; i--) {
          if (rules[i].constructor.name === "CSSFontFaceRule") {
            removedRules.push({ sheet, index: i, text: rules[i].cssText });
            sheet.deleteRule(i);
          }
        }
      } catch { /* cross-origin 무시 */ }
    });

    try {
      const zip = new JSZip();
      const folder = zip.folder("SwingLab_screens")!;

      for (let i = 0; i < screens.length; i++) {
        const el = frameRefs.current[i];
        if (!el) continue;
        setProgress(i + 1);

        const dataUrl = await domtoimage.toPng(el, {
          width: el.offsetWidth * 2,
          height: el.offsetHeight * 2,
          style: { transform: "scale(2)", transformOrigin: "top left" },
        });

        const base64 = dataUrl.split(",")[1];
        const filename = `${screens[i].title.replace(/\s/g, "_")}.png`;
        folder.file(filename, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "SwingLab_screens.zip");
    } finally {
      // @font-face 복원
      removedRules.forEach(({ sheet, index, text }) => {
        try { sheet.insertRule(text, index); } catch { /* ignore */ }
      });
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <div style={{ background: "#F0F0F0", minHeight: "100vh", padding: 24 }}>
      <style>{`
        @media print {
          @page { margin: 10mm; size: A4 landscape; }
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: 24 }} className="no-print">
        <div style={{ fontSize: 22, fontWeight: 900, color: DARK }}>SwingLab — 화면 스토리보드</div>
        <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>총 {screens.length}개 화면 · 2026년 6월</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>
          <button
            onClick={() => window.print()}
            style={{ padding: "8px 20px", background: "#fff", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
          >
            🖨️ PDF로 저장
          </button>
          <button
            onClick={handleExportZip}
            disabled={exporting}
            style={{ padding: "8px 20px", background: exporting ? "#9FE1CB" : GREEN, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: exporting ? "not-allowed" : "pointer", fontSize: 13, minWidth: 180 }}
          >
            {exporting
              ? `⏳ 내보내는 중... (${progress}/${screens.length})`
              : "📦 PNG ZIP으로 내보내기"}
          </button>
        </div>
        {exporting && (
          <div style={{ marginTop: 10, maxWidth: 300, margin: "10px auto 0" }}>
            <div style={{ height: 6, background: BORDER, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", background: GREEN, borderRadius: 3, transition: "width 0.3s", width: `${(progress / screens.length) * 100}%` }} />
            </div>
            <div style={{ fontSize: 11, color: GRAY, marginTop: 4 }}>{screens[progress - 1]?.title ?? ""} 캡처 중...</div>
          </div>
        )}
      </div>

      {/* 화면 그리드 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        {screens.map((s, i) => (
          <div key={s.title} className="flex flex-col items-center gap-2" style={{ breakInside: "avoid" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GRAY }}>{s.title}</div>
            <div
              ref={(el) => { frameRefs.current[i] = el; }}
              style={{
                width: 180, height: 360, borderRadius: 20, border: "3px solid #1A1A1A",
                background: "#fff", overflow: "hidden", position: "relative",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)", flexShrink: 0,
              }}
            >
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 8, background: "#1A1A1A", borderRadius: "0 0 8px 8px", zIndex: 10 }} />
              <div style={{ width: "100%", height: "100%", overflow: "hidden", paddingTop: 10 }}>
                {s.component}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#AAAAAA" }}>
        SwingLab · AI 골프 스윙 분석 · React + Tailwind CSS v4
      </div>
    </div>
  );
}
