export function Footer() {
  return (
    <footer className="px-20 py-7 border-t border-[#E5E5E5] flex justify-between items-center bg-white">
      <div className="text-lg font-bold text-[#1D9E75]">SwingLab</div>
      <div className="text-[13px] text-[#888780]">
        © 2026 SwingLab. 체형별 골프 스윙 분석 서비스
      </div>
      <div className="flex gap-6">
        <a className="text-[13px] text-[#888780] cursor-pointer hover:text-[#1A1A1A]">
          이용약관
        </a>
        <a className="text-[13px] text-[#888780] cursor-pointer hover:text-[#1A1A1A]">
          개인정보처리방침
        </a>
        <a className="text-[13px] text-[#888780] cursor-pointer hover:text-[#1A1A1A]">
          고객센터
        </a>
      </div>
    </footer>
  );
}
