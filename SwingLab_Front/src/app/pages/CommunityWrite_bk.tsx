import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";

export function CommunityWrite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category");
  const mode = searchParams.get("mode");
  const postId = searchParams.get("postId");

  const isEditMode = mode === "edit" && !!postId;

  const [formData, setFormData] = useState({
    category: categoryFromUrl || "자유게시판",
    title: "",
    content: "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "스윙분석", name: "스윙분석", icon: "⛳" },
    { id: "장비추천", name: "장비추천", icon: "🏌️" },
    { id: "코스정보", name: "코스정보", icon: "🌳" },
    { id: "자유게시판", name: "자유게시판", icon: "💬" },
  ];

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userId = sessionStorage.getItem("userId");

    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    if (isEditMode) {
      loadEditPost();
    }
  }, [navigate]);

  const loadEditPost = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8090/SwingLab/communityList",
        {
          withCredentials: true,
        }
      );

      if (res.data.success === true) {
        const foundPost = res.data.data.find(
          (item: any) => String(item.postId) === String(postId)
        );

        if (!foundPost) {
          alert("수정할 게시글을 찾을 수 없습니다.");
          navigate("/community");
          return;
        }

        setFormData({
          category: foundPost.category || "자유게시판",
          title: foundPost.title || "",
          content: foundPost.content || "",
          tags: foundPost.tags || "",
        });
      } else {
        alert(res.data.message || "게시글 정보를 불러오지 못했습니다.");
        navigate("/community");
      }
    } catch (error) {
      console.error("수정 게시글 조회 오류:", error);
      alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      navigate("/community");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    if (
      !formData.category ||
      !formData.title.trim() ||
      !formData.content.trim()
    ) {
      alert("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const url = isEditMode
        ? "http://localhost:8090/SwingLab/communityUpdate"
        : "http://localhost:8090/SwingLab/communityWrite";

      const body = isEditMode
        ? {
            postId: postId,
            userId: Number(userId),
            title: formData.title.trim(),
            content: formData.content.trim(),
          }
        : {
            userId: Number(userId),
            title: formData.title.trim(),
            content: formData.content.trim(),
            category: formData.category,
            tags: formData.tags,
          };

      const res = await axios.post(url, body, {
        withCredentials: true,
      });

      console.log(isEditMode ? "게시글 수정 결과:" : "게시글 작성 결과:", res.data);

      if (res.data.success === true) {
        alert(isEditMode ? "게시글이 수정되었습니다!" : "게시글이 작성되었습니다!");
        navigate("/community");
      } else {
        alert(
          res.data.message ||
            (isEditMode ? "게시글 수정에 실패했습니다." : "게시글 작성에 실패했습니다.")
        );
      }
    } catch (error) {
      console.error(isEditMode ? "게시글 수정 오류:" : "게시글 작성 오류:", error);
      alert(
        isEditMode
          ? "게시글 수정 중 오류가 발생했습니다."
          : "게시글 작성 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.category &&
    formData.title.trim() &&
    formData.content.trim() &&
    !isSubmitting;

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[1000px] mx-auto px-8">
        <div className="mb-10">
          <h1 className="text-[40px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            <span className="text-[#1D9E75]">
              {isEditMode ? "글수정" : "글쓰기"}
            </span>
          </h1>
          <p className="text-base text-[#888780]">
            {isEditMode
              ? "작성한 게시글을 수정해보세요"
              : "다른 골퍼들과 정보를 공유해보세요"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E5E5E5] p-10"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              카테고리 <span className="text-[#D85A30]">*</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isEditMode}
              className={`w-full px-4 py-3 border border-[#E5E5E5] rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent ${
                isEditMode
                  ? "bg-[#F5FAF8] text-[#888780] cursor-not-allowed"
                  : "bg-white"
              }`}
            >
              <option value="">카테고리를 선택하세요</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              제목 <span className="text-[#D85A30]">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              maxLength={100}
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
            />

            <div className="text-xs text-[#888780] mt-2 text-right">
              {formData.title.length} / 100
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              내용 <span className="text-[#D85A30]">*</span>
            </label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              rows={15}
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent resize-none"
            />

            <div className="text-xs text-[#888780] mt-2 text-right">
              {formData.content.length}자
            </div>
          </div>

          {!isEditMode && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                태그 (선택)
              </label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="태그를 쉼표(,)로 구분하여 입력하세요 (예: 드라이버, 스윙교정, 비거리)"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg bg-white text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
              />

              <div className="text-xs text-[#888780] mt-2">
                💡 태그를 추가하면 다른 사용자들이 게시글을 더 쉽게 찾을 수 있습니다
              </div>
            </div>
          )}

          <div className="mb-8 p-4 rounded-xl bg-[#F5FAF8] border border-[#E5E5E5]">
            <div className="flex items-start gap-3">
              <span className="text-xl">📌</span>

              <div className="flex-1">
                <div className="font-bold text-[#1A1A1A] mb-2">
                  {isEditMode ? "수정 안내" : "작성 가이드"}
                </div>

                <div className="text-sm text-[#888780] space-y-1">
                  {isEditMode ? (
                    <>
                      <div>• 제목과 내용을 수정할 수 있습니다</div>
                      <div>• 수정 후 기존 댓글은 그대로 유지됩니다</div>
                    </>
                  ) : (
                    <>
                      <div>• 다른 사용자를 존중하는 내용으로 작성해주세요</div>
                      <div>• 개인정보나 연락처는 공개하지 마세요</div>
                      <div>
                        • 구체적이고 명확한 제목을 작성하면 더 많은 답변을 받을 수 있습니다
                      </div>
                      <div>• 관련 없는 광고나 홍보글은 삭제될 수 있습니다</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/community")}
              className="flex-1 px-6 py-3.5 rounded-lg font-medium border border-[#E5E5E5] bg-white text-[#888780] hover:bg-[#F5FAF8]"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 px-6 py-3.5 rounded-lg font-medium border-none ${
                isFormValid
                  ? "bg-[#1D9E75] text-white cursor-pointer hover:bg-[#0F6E56]"
                  : "bg-[#CCCCCC] text-[#888780] cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? isEditMode
                  ? "수정 중..."
                  : "작성 중..."
                : isEditMode
                ? "수정 완료"
                : "작성 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}