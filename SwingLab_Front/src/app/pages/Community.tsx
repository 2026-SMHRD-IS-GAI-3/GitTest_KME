import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

interface Comment {
  id: string;
  userId: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  grade: string;
  title: string;
  content: string;
  category: string;
  comments: Comment[];
  commentCount: number;
  views: number;
  timestamp: string;
  tags: string[];
  image?: string;
  isSample?: boolean;
}

const GOLF_IMAGES = [
  "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
  "https://images.unsplash.com/photo-1593282153762-a41e3cceb06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
  "https://images.unsplash.com/photo-1592919505780-303950717480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
  "https://images.unsplash.com/photo-1611374243147-44a702c2d44c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
];

const SAMPLE_POSTS: Post[] = [
  {
    id: "sample-1",
    author: "김프로",
    avatar: "🏌️",
    grade: "프로",
    title: "드라이버 비거리 20m 늘린 후기",
    content:
      "안녕하세요! 최근 3개월간 스윙 교정으로 드라이버 비거리를 20m 늘렸어요. SwingLab AI 피드백 덕분에 제 폼의 문제점을 정확히 파악할 수 있었습니다.",
    category: "스윙분석",
    comments: [
      {
        id: "sample-c1",
        userId: 0,
        author: "이골퍼",
        avatar: "👩",
        text: "대단하네요! 어떤 연습을 하셨나요?",
        timestamp: "1시간 전",
      },
      {
        id: "sample-c2",
        userId: 0,
        author: "박버디",
        avatar: "👨",
        text: "저도 하체 리드 연습 중인데 참고하겠습니다.",
        timestamp: "30분 전",
      },
    ],
    commentCount: 2,
    views: 892,
    timestamp: "2시간 전",
    tags: ["드라이버", "비거리", "스윙교정"],
    image: GOLF_IMAGES[0],
    isSample: true,
  },
  {
    id: "sample-2",
    author: "이골퍼",
    avatar: "👩",
    grade: "세미프로",
    title: "초보자를 위한 아이언 추천 부탁해요",
    content:
      "골프 시작한 지 3개월 됐는데 아이언을 새로 사려고 합니다. 예산은 100만원 정도인데 추천 부탁드려요!",
    category: "장비추천",
    comments: [
      {
        id: "sample-c3",
        userId: 0,
        author: "최파",
        avatar: "👴",
        text: "미즈노 JPX 시리즈 추천드립니다.",
        timestamp: "3시간 전",
      },
    ],
    commentCount: 1,
    views: 456,
    timestamp: "4시간 전",
    tags: ["아이언", "초보", "장비추천"],
    image: GOLF_IMAGES[2],
    isSample: true,
  },
  {
    id: "sample-3",
    author: "박버디",
    avatar: "👨",
    grade: "마스터",
    title: "백스윙 탑 자세 체크포인트 공유합니다",
    content:
      "백스윙 탑에서 오버스윙 문제를 겪는 분들이 많습니다. 왼팔이 지면과 평행이 될 때 멈추는 연습이 가장 효과적이었습니다.",
    category: "스윙분석",
    comments: [],
    commentCount: 0,
    views: 1523,
    timestamp: "5시간 전",
    tags: ["백스윙", "탑", "자세교정"],
    image: GOLF_IMAGES[1],
    isSample: true,
  },
  {
    id: "sample-4",
    author: "정언더",
    avatar: "🧑",
    grade: "아마추어",
    title: "오늘 처음으로 90타 깼어요! 🎉",
    content:
      "시작한 지 1년 만에 드디어 90타를 깼습니다. SwingLab으로 꾸준히 스윙 분석하고 교정한 보람이 있네요.",
    category: "자유게시판",
    comments: [],
    commentCount: 0,
    views: 2341,
    timestamp: "1일 전",
    tags: ["90타", "달성", "감사"],
    image: GOLF_IMAGES[3],
    isSample: true,
  },
];

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  마스터: { bg: "#FEF3E7", text: "#F59E0B" },
  프로: { bg: "#E6F1FB", text: "#3B82F6" },
  세미프로: { bg: "#E1F5EE", text: "#1D9E75" },
  아마추어: { bg: "#FAEEDA", text: "#854F0B" },
  루키: { bg: "#F5F5F5", text: "#888780" },
};

export function Community() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");

  const [editingCommentId, setEditingCommentId] = useState("");
  const [editingCommentText, setEditingCommentText] = useState("");

  const categories = [
    { id: "전체", icon: "📋" },
    { id: "스윙분석", icon: "⛳" },
    { id: "장비추천", icon: "🏌️" },
    { id: "코스정보", icon: "🌳" },
    { id: "자유게시판", icon: "💬" },
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const getLoginUserId = () => {
    const userId = sessionStorage.getItem("userId");
    return userId ? Number(userId) : 0;
  };

  const loadPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8090/SwingLab/communityList",
        { withCredentials: true }
      );

      if (res.data.success === true) {
        const dbPosts: Post[] = res.data.data.map((item: any) => ({
          id: String(item.postId),
          author: item.writerName || "익명",
          avatar: "🏌️",
          grade: "세미프로",
          title: item.title,
          content: item.content,
          category: item.category || "자유게시판",
          comments: [],
          commentCount: Number(item.commentCount || 0),
          views: 0,
          timestamp: item.createdAt || "",
          tags: [],
          image: item.imageUrl || "",
          isSample: false,
        }));

        if (dbPosts.length > 0) {
          setPosts(dbPosts);
        } else {
          setPosts(SAMPLE_POSTS);
        }
      } else {
        setPosts(SAMPLE_POSTS);
      }
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      setPosts(SAMPLE_POSTS);
    }
  };

  const loadComments = async (post: Post) => {
    if (post.isSample) {
      setSelectedPost(post);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8090/SwingLab/commentList", {
        params: { postId: post.id },
        withCredentials: true,
      });

      if (res.data.success === true) {
        const dbComments: Comment[] = res.data.data.map((item: any) => ({
          id: String(item.commentId),
          userId: Number(item.userId),
          author: item.writerName || "익명",
          avatar: "😊",
          text: item.content,
          timestamp: item.createdAt || "",
        }));

        const updatedPost = {
          ...post,
          comments: dbComments,
          commentCount: dbComments.length,
        };

        setSelectedPost(updatedPost);

        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? updatedPost : p))
        );
      } else {
        setSelectedPost(post);
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
      setSelectedPost(post);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost) return;

    if (selectedPost.isSample) {
      const newComment: Comment = {
        id: String(Date.now()),
        userId: getLoginUserId(),
        author: "나",
        avatar: "😊",
        text: commentText.trim(),
        timestamp: "방금",
      };

      const updatedPost = {
        ...selectedPost,
        comments: [...selectedPost.comments, newComment],
        commentCount: selectedPost.commentCount + 1,
      };

      setSelectedPost(updatedPost);
      setPosts((prev) =>
        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
      setCommentText("");
      return;
    }

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8090/SwingLab/commentWrite",
        {
          postId: selectedPost.id,
          userId: Number(userId),
          content: commentText.trim(),
        },
        { withCredentials: true }
      );

      if (res.data.success === true) {
        setCommentText("");
        await loadComments(selectedPost);
      } else {
        alert(res.data.message || "댓글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editingCommentText.trim() || !selectedPost) {
      return;
    }

    if (selectedPost.isSample) {
      const updatedComments = selectedPost.comments.map((comment) =>
        comment.id === editingCommentId
          ? { ...comment, text: editingCommentText.trim() }
          : comment
      );

      const updatedPost = {
        ...selectedPost,
        comments: updatedComments,
      };

      setSelectedPost(updatedPost);
      setPosts((prev) =>
        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
      setEditingCommentId("");
      setEditingCommentText("");
      return;
    }

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8090/SwingLab/commentUpdate",
        {
          commentId: editingCommentId,
          userId: Number(userId),
          content: editingCommentText.trim(),
        },
        { withCredentials: true }
      );

      if (res.data.success === true) {
        setEditingCommentId("");
        setEditingCommentText("");
        await loadComments(selectedPost);
      } else {
        alert(res.data.message || "댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPost) return;

    if (selectedPost.isSample) {
      const updatedComments = selectedPost.comments.filter(
        (comment) => comment.id !== commentId
      );

      const updatedPost = {
        ...selectedPost,
        comments: updatedComments,
        commentCount: updatedComments.length,
      };

      setSelectedPost(updatedPost);
      setPosts((prev) =>
        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
      return;
    }

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const ok = window.confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const res = await axios.post(
        "http://localhost:8090/SwingLab/commentDelete",
        {
          commentId,
          userId: Number(userId),
        },
        { withCredentials: true }
      );

      if (res.data.success === true) {
        setEditingCommentId("");
        setEditingCommentText("");
        await loadComments(selectedPost);
        await loadPosts();
      } else {
        alert(res.data.message || "댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    if (selectedPost.isSample) {
      alert("예시 게시글은 삭제할 수 없습니다.");
      return;
    }

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const ok = window.confirm("게시글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const res = await axios.post(
        "http://localhost:8090/SwingLab/communityDelete",
        {
          postId: selectedPost.id,
          userId: Number(userId),
        },
        { withCredentials: true }
      );

      if (res.data.success === true) {
        setSelectedPost(null);
        await loadPosts();
      } else {
        alert(res.data.message || "게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const filteredPosts =
    selectedCategory === "전체"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  if (selectedPost) {
    const gradeColor =
      GRADE_COLORS[selectedPost.grade] ?? GRADE_COLORS["루키"];

    return (
      <div className="min-h-screen bg-[#F5FAF8]">
        <div className="sticky top-0 z-10 bg-white border-b border-[#E5E5E5] flex items-center px-4 py-3 gap-3">
          <button
            onClick={() => {
              setSelectedPost(null);
              setEditingCommentId("");
              setEditingCommentText("");
              loadPosts();
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F5FAF8]"
          >
            ←
          </button>

          <span className="font-bold text-[#1A1A1A]">게시글</span>
        </div>

        <div className="max-w-[430px] mx-auto">
          <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5FAF8] flex items-center justify-center text-xl flex-shrink-0">
              {selectedPost.avatar}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A1A1A] text-sm">
                  {selectedPost.author}
                </span>

                <span
                  className="px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: gradeColor.bg,
                    color: gradeColor.text,
                  }}
                >
                  {selectedPost.grade}
                </span>
              </div>

              <div className="text-xs text-[#888780]">
                {selectedPost.timestamp} · {selectedPost.category}
              </div>
            </div>
          </div>

          {selectedPost.image && (
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full object-cover max-h-[320px]"
            />
          )}

          <div className="bg-white px-4 py-4">
            {!selectedPost.isSample && (
              <div className="flex justify-end gap-2 mb-3">
                <button
                  onClick={() =>
                    navigate(
                      `/community/write?mode=edit&postId=${selectedPost.id}`
                    )
                  }
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F5FAF8] text-[#1D9E75]"
                >
                  수정
                </button>

                <button
                  onClick={handleDeletePost}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#FEE2E2] text-red-600"
                >
                  삭제
                </button>
              </div>
            )}

            <h2 className="font-bold text-[#1A1A1A] mb-2">
              {selectedPost.title}
            </h2>

            <p className="text-sm text-[#555555] leading-relaxed">
              {selectedPost.content}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#F5FAF8] text-[#888780] rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border-t border-[#F0F0F0] px-4 py-3">
            <button className="w-full flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#888780] bg-white border border-[#E5E5E5] justify-center">
              <span>💬</span>
              <span>댓글 {selectedPost.commentCount}개</span>
            </button>
          </div>

          <div className="bg-white mt-2 px-4 py-4">
            <p className="font-bold text-[#1A1A1A] text-sm mb-4">
              댓글 {selectedPost.commentCount}개
            </p>

            {selectedPost.comments.length === 0 ? (
              <p className="text-sm text-[#CCCCCC] text-center py-4">
                첫 댓글을 남겨보세요!
              </p>
            ) : (
              <div className="space-y-4">
                {selectedPost.comments.map((comment) => {
                  const isMyComment = getLoginUserId() === comment.userId;
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5FAF8] flex items-center justify-center text-base flex-shrink-0">
                        {comment.avatar}
                      </div>

                      <div className="flex-1">
                        <div className="bg-[#F5FAF8] rounded-2xl rounded-tl-none px-3 py-2.5">
                          <span className="font-bold text-[#1A1A1A] text-xs">
                            {comment.author}
                          </span>

                          {isEditing ? (
                            <div className="mt-2">
                              <input
                                value={editingCommentText}
                                onChange={(e) =>
                                  setEditingCommentText(e.target.value)
                                }
                                className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm bg-white text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#1D9E75]"
                              />

                              <div className="flex gap-3 mt-2">
                                <button
                                  onClick={handleUpdateComment}
                                  className="text-xs text-[#1D9E75] font-bold"
                                >
                                  저장
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingCommentId("");
                                    setEditingCommentText("");
                                  }}
                                  className="text-xs text-[#888780]"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-[#555555] mt-0.5">
                                {comment.text}
                              </p>

                              {isMyComment && (
                                <div className="flex gap-3 mt-2">
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditingCommentText(comment.text);
                                    }}
                                    className="text-xs text-[#1D9E75]"
                                  >
                                    수정
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="text-xs text-red-500"
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 px-1">
                          <span className="text-xs text-[#CCCCCC]">
                            {comment.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[#E5E5E5] px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5FAF8] flex items-center justify-center text-base flex-shrink-0">
              😊
            </div>

            <div className="flex-1 flex items-center gap-2 bg-[#F5FAF8] rounded-full px-4 py-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="댓글을 입력하세요..."
                className="flex-1 bg-transparent text-sm text-[#1A1A1A] placeholder-[#CCCCCC] outline-none"
              />

              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className={`text-sm font-bold transition-colors ${
                  commentText.trim() ? "text-[#1D9E75]" : "text-[#CCCCCC]"
                }`}
              >
                게시
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="max-w-[430px] mx-auto">
        <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-[#E5E5E5]">
          <h1 className="font-bold text-[#1D9E75]">골프 커뮤니티</h1>

          <button
            onClick={() => navigate("/community/write")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1D9E75] text-white rounded-full text-xs font-medium"
          >
            + 글쓰기
          </button>
        </div>

        <div className="bg-white border-b border-[#E5E5E5] flex overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${
                selectedCategory === category.id
                  ? "border-[#1D9E75] text-[#1D9E75]"
                  : "border-transparent text-[#888780]"
              }`}
            >
              {category.icon} {category.id}
            </button>
          ))}
        </div>

        <div className="space-y-2 pt-2 pb-6">
          {filteredPosts.map((post) => {
            const gradeColor =
              GRADE_COLORS[post.grade] ?? GRADE_COLORS["루키"];

            return (
              <div
                key={post.id}
                className="bg-white"
                onClick={() => loadComments(post)}
              >
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#F5FAF8] flex items-center justify-center text-lg flex-shrink-0">
                      {post.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1A1A1A] text-sm">
                          {post.author}
                        </span>

                        <span
                          className="px-1.5 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: gradeColor.bg,
                            color: gradeColor.text,
                          }}
                        >
                          {post.grade}
                        </span>
                      </div>

                      <div className="text-xs text-[#888780]">
                        {post.timestamp} · {post.category}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-2">
                  <p className="font-bold text-[#1A1A1A] text-sm mb-0.5">
                    {post.title}
                  </p>

                  <p className="text-xs text-[#888780] line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full object-cover max-h-[260px]"
                  />
                )}

                <div className="flex items-center justify-between px-4 pt-2 pb-1">
                  <span className="text-xs text-[#888780]">
                    👀 {post.views}
                  </span>

                  <span className="text-xs text-[#888780]">
                    댓글 {post.commentCount}개
                  </span>
                </div>

                <div className="flex items-center border-t border-[#F0F0F0] mx-4">
                  <button
                    className="flex items-center justify-center gap-1.5 flex-1 py-2.5 text-sm font-medium text-[#888780]"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadComments(post);
                    }}
                  >
                    <span>💬</span>
                    <span>댓글</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}