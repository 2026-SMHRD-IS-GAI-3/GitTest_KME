import { useState } from "react";
import { useLocation } from "react-router";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

const PAGE_LABELS: Record<string, string> = {
  "/":                  "홈",
  "/login":             "로그인",
  "/signup/terms":      "약관 동의",
  "/signup/form":       "회원가입",
  "/dashboard":         "대시보드",
  "/body-info":         "체형 진단",
  "/upload":            "스윙 업로드",
  "/analysis/result":   "분석 결과",
  "/history":           "히스토리",
  "/mypage":            "마이페이지",
  "/profile/edit":      "프로필 편집",
  "/subscription":      "구독 플랜",
  "/community":         "커뮤니티",
  "/community/write":   "글 작성",
};

export function PdfCapture() {
  const location = useLocation();
  const [pages, setPages] = useState<{ label: string; dataUrl: string }[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  // 숨길 경로 (docs 자체 등)
  const hidden = ["/docs", "/survey", "/survey/result", "/password/confirm", "/password/change"];
  if (hidden.includes(location.pathname)) return null;

  const pageLabel =
    PAGE_LABELS[location.pathname] ??
    (location.pathname.startsWith("/community/post") ? "게시글 상세" : location.pathname);

  const handleCapture = async () => {
    setCapturing(true);

    // @font-face 규칙을 일시 제거 (CORS 오류 방지)
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
      } catch {
        // cross-origin 시트는 접근 불가 — 무시
      }
    });

    try {
      const target = document.body;
      const dataUrl = await domtoimage.toPng(target, {
        width: target.scrollWidth,
        height: target.scrollHeight,
        style: { transform: "scale(1)", transformOrigin: "top left" },
      });
      setPages((prev) => {
        const filtered = prev.filter((p) => p.label !== pageLabel);
        return [...filtered, { label: pageLabel, dataUrl }];
      });
    } finally {
      // @font-face 규칙 복원
      removedRules.forEach(({ sheet, index, text }) => {
        try { sheet.insertRule(text, index); } catch { /* ignore */ }
      });
      setCapturing(false);
    }
  };

  const handleDownload = async () => {
    if (pages.length === 0) return;
    setGenerating(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const { label, dataUrl } = pages[i];

        // 페이지 번호 + 라벨 헤더
        pdf.setFillColor(29, 158, 117);
        pdf.rect(0, 0, pageW, 12, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(9);
        pdf.text(`${i + 1} / ${pages.length}  ·  SwingLab — ${label}`, 6, 8);

        // 이미지
        const img = new Image();
        img.src = dataUrl;
        await new Promise<void>((resolve) => { img.onload = () => resolve(); });
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const ratio = imgW / imgH;
        const drawW = pageW;
        const drawH = drawW / ratio;
        const maxH = pageH - 14;
        const finalH = Math.min(drawH, maxH);
        const finalW = finalH * ratio;
        const x = (pageW - finalW) / 2;
        pdf.addImage(dataUrl, "PNG", x, 13, finalW, finalH);
      }

      pdf.save("SwingLab_pages.pdf");
    } finally {
      setGenerating(false);
    }
  };

  const handleRemove = (label: string) => {
    setPages((prev) => prev.filter((p) => p.label !== label));
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
        {/* 목록 패널 */}
        {open && (
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] w-64 overflow-hidden">
            <div className="bg-[#1D9E75] px-4 py-3 flex items-center justify-between">
              <span className="text-white font-bold text-sm">PDF 캡처 목록</span>
              <span className="text-white/70 text-xs">{pages.length}페이지</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {pages.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-[#888780]">
                  캡처한 페이지가 없습니다.<br />
                  각 페이지에서 📷를 눌러주세요.
                </div>
              ) : (
                <ul className="divide-y divide-[#F0F0F0]">
                  {pages.map((p, i) => (
                    <li key={p.label} className="flex items-center gap-2 px-3 py-2">
                      <span className="w-5 h-5 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-[#1A1A1A] flex-1 truncate">{p.label}</span>
                      <button
                        onClick={() => handleRemove(p.label)}
                        className="text-[#CCCCCC] hover:text-[#EF4444] text-xs p-1"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {pages.length > 0 && (
              <div className="p-3 border-t border-[#E5E5E5]">
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className="w-full py-2.5 bg-[#1D9E75] text-white rounded-xl font-bold text-sm border-none disabled:opacity-60"
                >
                  {generating ? "PDF 생성 중..." : `📄 PDF 다운로드 (${pages.length}p)`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 캡처 버튼 */}
        <button
          onClick={handleCapture}
          disabled={capturing}
          title={`현재 페이지 캡처: ${pageLabel}`}
          className="w-12 h-12 rounded-full bg-[#1D9E75] text-white shadow-lg flex items-center justify-center text-xl border-none active:scale-95 transition-transform disabled:opacity-60"
        >
          {capturing ? "⏳" : "📷"}
        </button>

        {/* 목록 열기 버튼 */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] shadow-lg flex items-center justify-center text-sm font-bold text-[#1D9E75] border-solid active:scale-95 transition-transform relative"
        >
          📄
          {pages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-xs flex items-center justify-center font-bold">
              {pages.length}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
