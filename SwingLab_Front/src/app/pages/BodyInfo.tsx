import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type Step = "input" | "upload" | "result";

type BodyTypeCode = "BT01" | "BT02" | "BT03" | "BT04" | "BT05";
type ArmType = "장팔" | "단팔" | "평균";
type ShoulderType = "넓은어깨" | "좁은어깨" | "평균";
type DominantHand = "RIGHT" | "LEFT";

interface BodyMetrics {
  height: number;
  weight: number;
  dominantHand: DominantHand;
  armToHeightRatio: number;
  shoulderToHipRatio: number;
  legToHeightRatio: number;
  armType: ArmType;
  shoulderType: ShoulderType;
  bodyCode: BodyTypeCode;
}

const BT_INFO: Record<
  BodyTypeCode,
  {
    name: string;
    nameShort: string;
    feature: string;
    color: string;
    bg: string;
    borderColor: string;
    emoji: string;
    golfTips: string[];
    swingNote: string;
  }
> = {
  BT01: {
    name: "장팔·넓은어깨형",
    nameShort: "BT01",
    feature: "팔이 길고 어깨가 골반보다 넓음",
    color: "#1D9E75",
    bg: "#E1F5EE",
    borderColor: "#9FE1CB",
    emoji: "🏋️",
    golfTips: [
      "긴 팔과 넓은 어깨를 활용해 스윙 아크를 최대화하세요.",
      "백스윙 탑에서 과회전이 생기지 않도록 어깨 회전을 체크하세요.",
      "어드레스 시 볼과의 거리를 평균보다 조금 더 멀게 설정하세요.",
      "하체 리드를 의식해 상체 파워와 밸런스를 맞추세요.",
    ],
    swingNote: "장타에 유리한 체형입니다. 비거리보다 방향성 안정화에 집중하세요.",
  },
  BT02: {
    name: "장팔·좁은어깨형",
    nameShort: "BT02",
    feature: "팔이 길고 골반이 어깨보다 넓음",
    color: "#3B82F6",
    bg: "#E6F1FB",
    borderColor: "#93C5FD",
    emoji: "🤸",
    golfTips: [
      "긴 팔의 장점을 살려 스윙 아크를 크게 가져가세요.",
      "흉추 회전 범위를 늘려 백스윙 완성도를 높이세요.",
      "임팩트 시 손이 몸 가까이 지나가도록 의식하세요.",
      "하체 안정성을 활용해 일관된 스윙을 만들어가세요.",
    ],
    swingNote: "하체 안정성이 좋아 정확성 위주의 플레이에 유리합니다.",
  },
  BT03: {
    name: "단팔·넓은어깨형",
    nameShort: "BT03",
    feature: "팔이 짧고 어깨가 골반보다 넓음",
    color: "#8B5CF6",
    bg: "#EDE9FE",
    borderColor: "#C4B5FD",
    emoji: "💪",
    golfTips: [
      "짧은 팔을 보완하기 위해 상체 회전을 충분히 활용하세요.",
      "어드레스 시 볼과의 거리를 평균보다 조금 가깝게 설정하세요.",
      "넓은 어깨의 파워를 살려 임팩트 존에서 가속하세요.",
      "팔로우스루 시 팔을 충분히 펴는 연습을 하세요.",
    ],
    swingNote: "상체 파워가 강한 체형입니다. 근력을 활용한 파워 스윙에 유리합니다.",
  },
  BT04: {
    name: "단팔·좁은어깨형",
    nameShort: "BT04",
    feature: "팔이 짧고 골반이 어깨보다 넓음",
    color: "#F59E0B",
    bg: "#FEF3C7",
    borderColor: "#FCD34D",
    emoji: "🎯",
    golfTips: [
      "템포와 타이밍을 최우선으로 연습하세요.",
      "어깨 유연성 스트레칭으로 상체 회전 범위를 늘리세요.",
      "하체 안정성을 기반으로 정확성 위주 플레이를 추구하세요.",
      "용서성이 높은 클럽을 활용하면 효과적입니다.",
    ],
    swingNote: "정확성과 일관성에 집중하는 플레이 스타일이 잘 맞습니다.",
  },
  BT05: {
    name: "평균형",
    nameShort: "BT05",
    feature: "팔 길이와 어깨 너비가 평균 범위",
    color: "#1D9E75",
    bg: "#F0FDF4",
    borderColor: "#86EFAC",
    emoji: "⚖️",
    golfTips: [
      "균형 잡힌 체형으로 기본기에 충실하면 좋습니다.",
      "어드레스 자세와 그립을 표준적으로 맞추세요.",
      "드라이버와 아이언 모두 표준 세팅으로 시작하세요.",
      "멘탈 훈련과 코스 매니지먼트에 시간을 투자하세요.",
    ],
    swingNote: "어떤 스윙 스타일로도 발전 가능한 균형형 체형입니다.",
  },
};

export function BodyInfo() {
  const navigate = useNavigate();

  const armsFileInputRef = useRef<HTMLInputElement>(null);
  const attentionFileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("input");

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dominantHand, setDominantHand] = useState<DominantHand>("RIGHT");

  const [armsPhoto, setArmsPhoto] = useState<string | null>(null);
  const [attentionPhoto, setAttentionPhoto] = useState<string | null>(null);

  const [armsFile, setArmsFile] = useState<File | null>(null);
  const [attentionFile, setAttentionFile] = useState<File | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<BodyMetrics | null>(null);

  const handlePhotoSelect =
    (type: "arms" | "attention") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);

      if (type === "arms") {
        setArmsPhoto(url);
        setArmsFile(file);
      } else {
        setAttentionPhoto(url);
        setAttentionFile(file);
      }
    };

  const handleAnalyze = async () => {
    if (!armsFile || !attentionFile) {
      alert("사진 2장을 모두 업로드해주세요.");
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("armsImage", armsFile);
      formData.append("attentionImage", attentionFile);

      const res = await axios.post(
        "http://localhost:5000/analyze-body",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Python 분석 결과:", res.data);

      if (!res.data.success) {
        alert(res.data.message || "체형 분석에 실패했습니다.");
        return;
      }

      const h = Number(height);
      const w = Number(weight);

      const result: BodyMetrics = {
        height: h,
        weight: w,
        dominantHand: dominantHand,
        armToHeightRatio: Number(res.data.wingspanRatio),
        shoulderToHipRatio: Number(res.data.shoulderToHipRatio),
        legToHeightRatio: 0.5,
        armType: res.data.armType,
        shoulderType: res.data.shoulderType,
        bodyCode: res.data.bodyCode,
      };

      setMetrics(result);

localStorage.setItem(
  "bodyInfo",
  JSON.stringify({
    height: h,
    weight: w,
    dominantHand: dominantHand,
  })
);

localStorage.setItem("bodyMetrics", JSON.stringify(result));
localStorage.setItem("bodyTypeCompleted", "true");

const saveRes = await axios.post(
  "http://localhost:8090/SwingLab/saveBodyAnalysis",
  {
    height: h,
    weight: w,
    shoulderHipRatio: Number(res.data.shoulderToHipRatio),
    armLengthRatio: Number(res.data.wingspanRatio),
    armLengthType:
      res.data.armType === "장팔"
        ? "LONG"
        : res.data.armType === "단팔"
        ? "SHORT"
        : "NORMAL",
    handType: dominantHand,
    bodyCode: res.data.bodyCode,
  },
  {
    withCredentials: true,
  }
);

console.log("체형 분석 DB 저장 결과:", saveRes.data);

setStep("result");
    } catch (err) {
      console.error("체형 분석 실패:", err);
      alert("Python 분석 서버 연결 실패");
    } finally {
      setAnalyzing(false);
    }
  };

  if (step === "input") {
    return (
      <div className="min-h-screen bg-[#F5FAF8] flex flex-col py-16 px-5">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-4 font-medium">
              ✦ 1단계 · 신체 정보 입력
            </div>

            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
              <span className="text-[#1D9E75]">신체 정보</span>를 입력하세요
            </h1>

            <p className="text-sm text-[#888780]">
              입력 후 사진으로 신체 비율을 자동 분석합니다
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-7">
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                키 (cm) <span className="text-[#D85A30]">*</span>
              </label>

              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                min="100"
                max="250"
                className="w-full px-4 py-3.5 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent text-lg"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                몸무게 (kg) <span className="text-[#D85A30]">*</span>
              </label>

              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                min="30"
                max="200"
                className="w-full px-4 py-3.5 border border-[#E5E5E5] rounded-xl bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent text-lg"
              />
            </div>

            <div className="mb-7">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                주 사용손 <span className="text-[#D85A30]">*</span>
              </label>

              <div className="flex gap-4">
                <label
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 cursor-pointer ${
                    dominantHand === "RIGHT"
                      ? "border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56]"
                      : "border-[#E5E5E5] bg-white text-[#888780]"
                  }`}
                >
                  <input
                    type="radio"
                    name="dominantHand"
                    value="RIGHT"
                    checked={dominantHand === "RIGHT"}
                    onChange={() => setDominantHand("RIGHT")}
                    className="hidden"
                  />
                  <span className="font-bold">오른손</span>
                </label>

                <label
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 cursor-pointer ${
                    dominantHand === "LEFT"
                      ? "border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56]"
                      : "border-[#E5E5E5] bg-white text-[#888780]"
                  }`}
                >
                  <input
                    type="radio"
                    name="dominantHand"
                    value="LEFT"
                    checked={dominantHand === "LEFT"}
                    onChange={() => setDominantHand("LEFT")}
                    className="hidden"
                  />
                  <span className="font-bold">왼손</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              disabled={!height || !weight}
              onClick={() => setStep("upload")}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all border-none ${
                height && weight
                  ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56] shadow-lg"
                  : "bg-[#E5E5E5] text-[#888780] cursor-not-allowed"
              }`}
            >
              사진 업로드로 체형 분석 시작 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "upload") {
    const bothUploaded = armsPhoto && attentionPhoto;

    const PhotoSlot = ({
      label,
      desc,
      icon,
      preview,
      inputRef,
      onClear,
      onChange,
    }: {
      label: string;
      desc: string;
      icon: string;
      preview: string | null;
      inputRef: React.RefObject<HTMLInputElement | null>;
      onClear: () => void;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{icon}</span>
          <div>
            <p className="font-bold text-[#1A1A1A] text-sm">{label}</p>
            <p className="text-xs text-[#888780]">{desc}</p>
          </div>

          {preview && (
            <div className="ml-auto flex items-center gap-1 text-xs text-[#1D9E75] font-medium">
              <span>✓</span>
              <span>완료</span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onChange}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={label}
              className="w-full rounded-xl object-cover max-h-48"
            />

            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full py-7 border-2 border-dashed border-[#D0EDE4] rounded-xl flex flex-col items-center gap-2 bg-[#F5FAF8] hover:bg-[#E8F7F1] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E1F5EE] flex items-center justify-center text-xl">
              📸
            </div>
            <p className="text-xs font-bold text-[#1D9E75]">
              사진 선택 또는 촬영
            </p>
          </button>
        )}
      </div>
    );

    return (
      <div className="min-h-screen bg-[#F5FAF8] flex flex-col py-4 px-4">
        <div className="max-w-[430px] w-full mx-auto">
          <button
            type="button"
            onClick={() => {
              setArmsPhoto(null);
              setAttentionPhoto(null);
              setArmsFile(null);
              setAttentionFile(null);
              setStep("input");
            }}
            className="flex items-center gap-1 text-[#888780] text-sm mb-5"
          >
            ← 이전으로
          </button>

          <div className="text-center mb-5">
            <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-3 font-medium">
              ✦ 2단계 · 사진 업로드
            </div>

            <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">
              <span className="text-[#1D9E75]">2장의 사진</span>을 업로드하세요
            </h1>

            <p className="text-xs text-[#888780]">
              두 자세 모두 업로드해야 분석이 시작됩니다
            </p>
          </div>

          <div className="bg-[#E1F5EE] rounded-xl p-3 mb-4 flex items-start gap-2">
            <span>💡</span>
            <p className="text-xs text-[#0F6E56] leading-relaxed">
              밝은 환경에서 정면을 바라보고, 몸에 맞는 옷을 입은 상태로 머리부터
              골반까지 전신이 나오도록 촬영해 주세요.
            </p>
          </div>

          <PhotoSlot
            label="① 팔 벌린 자세"
            desc="양팔을 어깨 높이로 양옆으로 쭉 벌려주세요"
            icon="🙌"
            preview={armsPhoto}
            inputRef={armsFileInputRef}
            onClear={() => {
              setArmsPhoto(null);
              setArmsFile(null);
              if (armsFileInputRef.current) {
                armsFileInputRef.current.value = "";
              }
            }}
            onChange={handlePhotoSelect("arms")}
          />

          <PhotoSlot
            label="② 차렷 자세"
            desc="팔을 몸에 붙이고 똑바로 서주세요"
            icon="🧍"
            preview={attentionPhoto}
            inputRef={attentionFileInputRef}
            onClear={() => {
              setAttentionPhoto(null);
              setAttentionFile(null);
              if (attentionFileInputRef.current) {
                attentionFileInputRef.current.value = "";
              }
            }}
            onChange={handlePhotoSelect("attention")}
          />

          <div className="flex items-center gap-2 mb-4">
            <div
              className={`flex-1 h-1.5 rounded-full ${
                armsPhoto ? "bg-[#1D9E75]" : "bg-[#E5E5E5]"
              }`}
            />

            <div
              className={`flex-1 h-1.5 rounded-full ${
                attentionPhoto ? "bg-[#1D9E75]" : "bg-[#E5E5E5]"
              }`}
            />
          </div>

          <p className="text-center text-xs text-[#888780] mb-4">
            {!armsPhoto && !attentionPhoto
              ? "0 / 2장 업로드됨"
              : !bothUploaded
              ? "1 / 2장 업로드됨"
              : "2 / 2장 업로드 완료 ✓"}
          </p>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!bothUploaded || analyzing}
            className={`w-full py-4 rounded-2xl font-bold text-base border-none transition-all ${
              bothUploaded && !analyzing
                ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56] shadow-lg"
                : "bg-[#E5E5E5] text-[#888780] cursor-not-allowed"
            }`}
          >
            {analyzing ? "분석 중..." : "체형 분석 시작 →"}
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const bt = BT_INFO[metrics.bodyCode];

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-16 px-5">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block text-xs px-3.5 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] mb-4 font-medium">
            ✦ 체형 코드 분석 완료
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1 tracking-tight">
            <span className="text-[#1D9E75]">분석 결과</span>가 나왔어요
          </h1>

          <p className="text-sm text-[#888780]">
            {metrics.height}cm · {metrics.weight}kg ·{" "}
            {metrics.dominantHand === "RIGHT" ? "오른손" : "왼손"}
          </p>
        </div>

        <div
          className="rounded-2xl border-2 p-5 mb-4"
          style={{
            backgroundColor: bt.bg,
            borderColor: bt.borderColor,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{bt.emoji}</div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: bt.color }}
                >
                  {bt.nameShort}
                </span>

                <span className="font-bold text-[#1A1A1A] text-lg">
                  {bt.name}
                </span>
              </div>

              <p className="text-sm text-[#555555]">{bt.feature}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-black/10">
            <p className="text-xs" style={{ color: bt.color }}>
              💡 {bt.swingNote}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <h3 className="font-bold text-[#1A1A1A] mb-4">분석된 신체 비율</h3>

          <div className="space-y-2 text-sm text-[#555555]">
            <p>주 사용손: {metrics.dominantHand === "RIGHT" ? "오른손" : "왼손"}</p>
            <p>팔 유형: {metrics.armType}</p>
            <p>어깨 유형: {metrics.shoulderType}</p>
            <p>윙스팬/어깨 비율: {metrics.armToHeightRatio}</p>
            <p>어깨/골반 비율: {metrics.shoulderToHipRatio}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#E1F5EE] flex items-center justify-center text-base">
              ⛳
            </div>

            <h3 className="font-bold text-[#1A1A1A]">
              {bt.name} 골프 스윙 팁
            </h3>
          </div>

          <div className="space-y-3">
            {bt.golfTips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: bt.color }}
                >
                  {i + 1}
                </div>

                <p className="text-sm text-[#555555] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="w-full py-4 bg-[#1D9E75] text-white rounded-2xl font-bold text-base shadow-lg hover:bg-[#0F6E56] border-none"
          >
            스윙 분석 시작하기 →
          </button>

          <button
            type="button"
            onClick={() => {
              setArmsPhoto(null);
              setAttentionPhoto(null);
              setArmsFile(null);
              setAttentionFile(null);
              setMetrics(null);
              setStep("upload");
            }}
            className="w-full py-3 bg-white border border-[#E5E5E5] text-[#888780] rounded-2xl font-medium text-sm hover:bg-[#F5FAF8]"
          >
            다시 업로드하기
          </button>
        </div>
      </div>
    </div>
  );
}