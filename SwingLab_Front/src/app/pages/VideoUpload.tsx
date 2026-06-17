import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

interface VideoFile {
  file: File | null;
  preview: string | null;
  error: string | null;
}

type ClubType = "driver" | "iron";

const CLUBS: {
  id: ClubType;
  name: string;
  nameEn: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: "driver",
    name: "드라이버",
    nameEn: "Driver",
    icon: "🏌️",
    desc: "",
  },
  {
    id: "iron",
    name: "아이언",
    nameEn: "Iron",
    icon: "⛳",
    desc: "",
  },
];

export function VideoUpload() {
  const navigate = useNavigate();
  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);

  const [frontVideo, setFrontVideo] = useState<VideoFile>({
    file: null,
    preview: null,
    error: null,
  });

  const [sideVideo, setSideVideo] = useState<VideoFile>({
    file: null,
    preview: null,
    error: null,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "side"
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      const error = "파일 크기는 100MB 이하여야 합니다.";

      type === "front"
        ? setFrontVideo({ file: null, preview: null, error })
        : setSideVideo({ file: null, preview: null, error });

      return;
    }

    if (!file.type.startsWith("video/")) {
      const error = "비디오 파일만 업로드 가능합니다.";

      type === "front"
        ? setFrontVideo({ file: null, preview: null, error })
        : setSideVideo({ file: null, preview: null, error });

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    type === "front"
      ? setFrontVideo({ file, preview: previewUrl, error: null })
      : setSideVideo({ file, preview: previewUrl, error: null });
  };

  const removeVideo = (type: "front" | "side") => {
    if (type === "front") {
      if (frontVideo.preview) URL.revokeObjectURL(frontVideo.preview);

      setFrontVideo({ file: null, preview: null, error: null });

      if (frontInputRef.current) {
        frontInputRef.current.value = "";
      }
    } else {
      if (sideVideo.preview) URL.revokeObjectURL(sideVideo.preview);

      setSideVideo({ file: null, preview: null, error: null });

      if (sideInputRef.current) {
        sideInputRef.current.value = "";
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedClub) {
      alert("클럽을 선택해주세요.");
      return;
    }

    if (!frontVideo.file) {
      alert("정면 영상을 업로드해주세요.");
      return;
    }

    if (!sideVideo.file) {
      alert("측면 영상을 업로드해주세요.");
      return;
    }

    try {
      setIsAnalyzing(true);

      const formData = new FormData();

      formData.append("frontVideo", frontVideo.file);
      formData.append("sideVideo", sideVideo.file);
      formData.append("club", selectedClub);

      formData.append("ballX", "0");
      formData.append("ballY", "0");

      const res = await axios.post(
        "http://localhost:8000/analyze-swing",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("스윙 분석 결과:", res.data);

      if (res.data.success === true) {
        sessionStorage.setItem("swingClub", selectedClub);
        sessionStorage.setItem("swingAnalysisResult", JSON.stringify(res.data));

        navigate("/analysis/result");
      } else {
        alert(res.data.message || "스윙 분석에 실패했습니다.");
      }
    } catch (error) {
      console.error("스윙 분석 요청 실패:", error);
      alert("스윙 분석 서버 연결 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze =
    !!frontVideo.file && !!sideVideo.file && !!selectedClub && !isAnalyzing;

  const StepBar = () => (
    <div className="flex items-center justify-center gap-0 mb-10">
      {[
        { n: 1, label: "클럽 선택" },
        { n: 2, label: "영상 업로드" },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > s.n
                  ? "bg-[#1D9E75] text-white"
                  : step === s.n
                  ? "bg-[#1D9E75] text-white ring-4 ring-[#9FE1CB]"
                  : "bg-[#E5E5E5] text-[#888780]"
              }`}
            >
              {step > s.n ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                s.n
              )}
            </div>

            <span
              className={`text-xs mt-1.5 font-medium ${
                step === s.n ? "text-[#1D9E75]" : "text-[#888780]"
              }`}
            >
              {s.label}
            </span>
          </div>

          {i < 1 && (
            <div
              className={`w-20 h-0.5 mx-2 mb-4 ${
                step > s.n ? "bg-[#1D9E75]" : "bg-[#E5E5E5]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#F5FAF8] py-4">
        <div className="max-w-[430px] mx-auto px-4">
          <div className="text-center mb-5">
            <div className="inline-block text-xs px-3 py-1 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-3 font-medium">
              ✦ AI 기반 골프 스윙 분석
            </div>

            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1 tracking-tight">
              어떤 클럽으로 <span className="text-[#1D9E75]">분석</span>
              할까요?
            </h1>

            <p className="text-sm text-[#888780]">
              클럽 종류에 따라 최적화된 스윙 분석이 제공됩니다
            </p>
          </div>

          <StepBar />

          <div className="grid grid-cols-2 gap-3">
            {CLUBS.map((club) => (
              <button
                key={club.id}
                onClick={() => setSelectedClub(club.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  selectedClub === club.id
                    ? "border-[#1D9E75] bg-[#E1F5EE]"
                    : "border-[#E5E5E5] bg-white"
                }`}
              >
                <div className="text-4xl mb-3">{club.icon}</div>

                <div className="font-bold text-[#1A1A1A] mb-0.5">
                  {club.name}
                </div>

                <div className="text-xs text-[#888780]">{club.nameEn}</div>

                {selectedClub === club.id && (
                  <div className="mt-3 flex items-center gap-1 text-[#1D9E75] text-xs font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    선택됨
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedClub}
              className={`w-full py-4 rounded-xl font-bold transition-all border-none ${
                selectedClub
                  ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56] shadow-lg"
                  : "bg-[#CCCCCC] text-[#888780] cursor-not-allowed"
              }`}
            >
              다음 단계 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const clubData = CLUBS.find((c) => c.id === selectedClub);

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-4">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="text-center mb-5">
          <div className="inline-block text-xs px-3 py-1 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-3 font-medium">
            ✦ AI 기반 골프 스윙 분석
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1 tracking-tight">
            <span className="text-[#1D9E75]">스윙 영상</span>을 업로드하세요
          </h1>

          <p className="text-sm text-[#888780]">
            선택한 클럽을 바탕으로 AI가 맞춤 분석을 제공합니다
          </p>
        </div>

        <StepBar />

        <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#E5E5E5] text-sm">
            <span>{clubData?.icon}</span>
            <span className="font-medium text-[#1A1A1A]">
              {clubData?.name}
            </span>
          </div>

          <button
            onClick={() => setStep(1)}
            className="text-xs text-[#888780] underline"
          >
            변경
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-5">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-base">
                📹
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[#1A1A1A]">정면 영상</h3>
                  <span className="px-1.5 py-0.5 bg-[#D85A30] text-white rounded text-xs font-medium">
                    필수
                  </span>
                </div>

                <p className="text-xs text-[#888780]">Front View</p>
              </div>
            </div>

            {!frontVideo.preview ? (
              <div
                onClick={() => frontInputRef.current?.click()}
                className="border-2 border-dashed border-[#CCCCCC] rounded-xl p-8 text-center cursor-pointer hover:border-[#1D9E75] hover:bg-[#F5FAF8] transition-all"
              >
                <div className="text-4xl mb-2">📤</div>

                <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                  탭하여 영상 업로드
                </p>

                <p className="text-xs text-[#888780]">
                  MP4, MOV, AVI (최대 100MB)
                </p>

                <input
                  ref={frontInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "front")}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <video
                  src={frontVideo.preview}
                  controls
                  className="w-full rounded-xl bg-black"
                  style={{ maxHeight: "220px" }}
                />

                <button
                  onClick={() => removeVideo("front")}
                  className="absolute top-2 right-2 w-7 h-7 bg-[#D85A30] text-white rounded-full flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <p className="mt-2 text-xs text-[#0F6E56] font-medium">
                  ✓ 정면 영상 업로드 완료
                </p>
              </div>
            )}

            {frontVideo.error && (
              <p className="mt-2 text-xs text-[#D85A30]">
                {frontVideo.error}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-base">
                📹
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[#1A1A1A]">측면 영상</h3>
                  <span className="px-1.5 py-0.5 bg-[#D85A30] text-white rounded text-xs font-medium">
                    필수
                  </span>
                </div>

                <p className="text-xs text-[#888780]">Side View</p>
              </div>
            </div>

            {!sideVideo.preview ? (
              <div
                onClick={() => sideInputRef.current?.click()}
                className="border-2 border-dashed border-[#CCCCCC] rounded-xl p-8 text-center cursor-pointer hover:border-[#1D9E75] hover:bg-[#F5FAF8] transition-all"
              >
                <div className="text-4xl mb-2">📤</div>

                <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                  탭하여 영상 업로드
                </p>

                <p className="text-xs text-[#888780]">
                  MP4, MOV, AVI (최대 100MB)
                </p>

                <input
                  ref={sideInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "side")}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <video
                  src={sideVideo.preview}
                  controls
                  className="w-full rounded-xl bg-black"
                  style={{ maxHeight: "220px" }}
                />

                <button
                  onClick={() => removeVideo("side")}
                  className="absolute top-2 right-2 w-7 h-7 bg-[#D85A30] text-white rounded-full flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <p className="mt-2 text-xs text-[#0F6E56] font-medium">
                  ✓ 측면 영상 업로드 완료
                </p>
              </div>
            )}

            {sideVideo.error && (
              <p className="mt-2 text-xs text-[#D85A30]">
                {sideVideo.error}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={`w-full py-4 rounded-xl font-bold transition-all border-none ${
              canAnalyze
                ? "bg-[#1D9E75] text-white shadow-lg"
                : "bg-[#CCCCCC] text-[#888780] cursor-not-allowed"
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                AI 분석 중...
              </span>
            ) : (
              "스윙 분석 시작"
            )}
          </button>

          {(!frontVideo.file || !sideVideo.file) && (
            <p className="text-xs text-[#D85A30] mt-2 text-center">
              ⚠️ {!frontVideo.file ? "정면 영상" : "측면 영상"}을
              업로드해주세요
            </p>
          )}

          <button
            onClick={() => setStep(1)}
            className="w-full mt-2 py-3 rounded-xl bg-white border border-[#CCCCCC] text-[#1A1A1A] font-medium text-sm"
          >
            ← 이전
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-base">
              💡
            </div>

            <h3 className="font-bold text-[#1A1A1A]">촬영 가이드</h3>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                icon: "💡",
                title: "조명",
                tips: [
                  "밝은 자연광이나 실내 조명 사용",
                  "역광 피하기",
                  "그림자가 적게 생기도록",
                ],
              },
              {
                icon: "📐",
                title: "각도",
                tips: [
                  "정면: 몸의 정면에서 촬영",
                  "측면: 왼쪽 또는 오른쪽에서",
                  "카메라 높이는 가슴~허리 높이",
                ],
              },
              {
                icon: "📏",
                title: "거리 및 구도",
                tips: [
                  "전신이 화면에 모두 들어오도록",
                  "카메라로부터 3~5미터 거리",
                  "클럽 끝까지 보이도록",
                ],
              },
            ].map((g) => (
              <div
                key={g.title}
                className="p-3 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{g.icon}</span>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">
                    {g.title}
                  </h4>
                </div>

                <ul className="text-xs text-[#555555] space-y-1">
                  {g.tips.map((t, i) => (
                    <li key={i}>• {t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}