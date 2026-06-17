import { useState } from "react";
import { useParams, useNavigate } from "react-router";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  grade: string;
  content: string;
  likes: number;
  timestamp: string;
}

const mockPosts = [
  {
    id: 1,
    author: "김프로",
    avatar: "👨‍💼",
    grade: "프로",
    title: "드라이버 비거리 20m 늘린 후기 공유합니다",
    content: `안녕하세요! 최근 3개월간 스윙 교정으로 드라이버 비거리를 20m 늘렸어요. 제가 사용한 방법을 공유합니다.

처음에는 그립부터 다시 잡았습니다. 많은 분들이 너무 강하게 쥐시는데, 그립압을 7에서 4 정도로 줄이는 것만으로도 클럽헤드 스피드가 올라갔어요.

두 번째로는 백스윙 시 어깨 회전을 충분히 하는 것입니다. 오버스윙보다는 오히려 완전한 어깨 회전이 중요합니다.

세 번째는 임팩트 시 체중 이동인데, SwingLab AI 분석으로 제 임팩트 자세를 보니 체중이 오른발에 너무 많이 남아있더라구요. 교정 후 비거리가 확 늘었습니다.

모두 도움이 되셨으면 좋겠어요!`,
    category: "스윙분석",
    likes: 47,
    comments: 23,
    views: 892,
    timestamp: "2시간 전",
    tags: ["드라이버", "비거리", "스윙교정"],
  },
  {
    id: 2,
    author: "이골퍼",
    avatar: "👩",
    grade: "세미프로",
    title: "초보자를 위한 아이언 추천 좀 해주세요",
    content: `골프 시작한지 3개월 됐는데 아이언을 새로 사려고 합니다. 예산은 100만원 정도인데 추천 부탁드려요!

현재는 연습장에서 빌려쓰는 클럽을 쓰고 있는데, 슬슬 제 클럽이 필요할 것 같아서요.

초보자에게 맞는 캐비티백 아이언 위주로 보고 있는데, 어떤 브랜드/모델이 좋을까요?

피팅을 먼저 받아보는 게 좋을까요?`,
    category: "장비추천",
    likes: 15,
    comments: 31,
    views: 456,
    timestamp: "4시간 전",
    tags: ["아이언", "초보", "장비추천"],
  },
  {
    id: 3,
    author: "박버디",
    avatar: "👨",
    grade: "마스터",
    title: "백스윙 톱 자세 점검 방법 공유합니다",
    content: `많은 분들이 백스윙 톱에서 오버스윙 문제를 겪으시더라구요. 제가 교정했던 방법을 알려드릴게요.

먼저 거울 앞에서 슬로우 스윙을 해보세요. 클럽 샤프트가 지면과 평행이 되는 지점에서 멈추고 자세를 확인합니다.

왼손 엄지가 클럽 무게를 받치고 있는지, 왼쪽 어깨가 턱 아래까지 회전했는지 체크하세요.

이 두 가지만 잘 지켜도 오버스윙이 많이 줄어듭니다!`,
    category: "스윙분석",
    likes: 89,
    comments: 42,
    views: 1523,
    timestamp: "5시간 전",
    tags: ["백스윙", "톱", "자세교정"],
  },
  {
    id: 4,
    author: "최파",
    avatar: "👴",
    grade: "프로",
    title: "남양주 골프장 후기 - 가성비 최고!",
    content: `주말에 남양주 OO컨트리클럽 다녀왔는데 정말 좋았어요. 가격대비 코스 관리 상태도 훌륭하고, 캐디분들도 친절하셨습니다.

그린 상태가 특히 좋았는데, 최근에 보수 공사를 했다고 하더라구요. 페어웨이도 잔디 상태가 매우 좋았습니다.

식당 음식도 맛있었고, 클럽하우스 시설도 깔끔했어요. 다음에 또 가고 싶습니다!`,
    category: "코스정보",
    likes: 34,
    comments: 18,
    views: 678,
    timestamp: "1일 전",
    tags: ["골프장", "남양주", "후기"],
  },
  {
    id: 5,
    author: "정언더",
    avatar: "🧑",
    grade: "아마추어",
    title: "오늘 처음으로 90타 깼어요!",
    content: `시작한지 1년만에 드디어 90타를 깼습니다! 너무 기쁘네요. 모두 SwingLab 덕분입니다 ㅎㅎ

특히 AI 스윙 분석으로 임팩트 자세를 교정한 것이 가장 큰 도움이 됐어요. 전에는 임팩트 점수가 55점이었는데 지금은 78점까지 올라왔습니다.

앞으로 목표는 80타 진입입니다! 열심히 하겠습니다!`,
    category: "자유게시판",
    likes: 126,
    comments: 67,
    views: 2341,
    timestamp: "1일 전",
    tags: ["90타", "달성", "감사"],
  },
  {
    id: 6,
    author: "송스윙",
    avatar: "👩‍🦰",
    grade: "세미프로",
    title: "다운스윙 구간 점수가 계속 낮게 나와요",
    content: `AI 분석 결과를 보면 다른 구간은 괜찮은데 다운스윙만 계속 60점 이하가 나옵니다. 어떻게 개선해야 할까요?

특히 다운스윙 시작 시 오른쪽 팔꿈치가 몸에서 너무 멀어진다는 피드백을 받았는데, 교정 방법이 있을까요?

아니면 레슨을 받아야 할까요?`,
    category: "스윙분석",
    likes: 28,
    comments: 15,
    views: 534,
    timestamp: "2일 전",
    tags: ["다운스윙", "점수개선", "질문"],
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    author: "골프왕",
    avatar: "🏌️",
    grade: "마스터",
    content: "정말 유익한 정보 감사합니다! 저도 비슷한 방법으로 비거리 늘렸어요.",
    likes: 12,
    timestamp: "1시간 전",
  },
  {
    id: 2,
    author: "스윙초보",
    avatar: "🧑‍🎓",
    grade: "루키",
    content: "그립압 조절이 그렇게 중요한지 몰랐네요. 오늘 연습장에서 꼭 해볼게요!",
    likes: 8,
    timestamp: "1시간 30분 전",
  },
  {
    id: 3,
    author: "프로지망생",
    avatar: "👨‍💻",
    grade: "아마추어",
    content: "SwingLab AI 분석 정말 도움되죠. 저도 체중 이동 문제를 발견하고 교정했어요.",
    likes: 15,
    timestamp: "2시간 전",
  },
];

const gradeColors: Record<string, { bg: string; text: string }> = {
  마스터: { bg: "#FEF3E7", text: "#F59E0B" },
  프로: { bg: "#E6F1FB", text: "#3B82F6" },
  세미프로: { bg: "#E1F5EE", text: "#1D9E75" },
  아마추어: { bg: "#FAEEDA", text: "#854F0B" },
  루키: { bg: "#F5F5F5", text: "#888780" },
};

export function CommunityPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);

  const post = mockPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5FAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#888780] text-lg mb-4">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/community")}
            className="px-6 py-3 bg-[#1D9E75] text-white rounded-lg font-medium hover:bg-[#0F6E56]"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const gradeColor = gradeColors[post.grade] ?? gradeColors["루키"];
  const likeCount = post.likes + (liked ? 1 : 0);

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    setComments([
      {
        id: comments.length + 1,
        author: "나",
        avatar: "😊",
        grade: "아마추어",
        content: commentText,
        likes: 0,
        timestamp: "방금 전",
      },
      ...comments,
    ]);
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#F5FAF8] py-20">
      <div className="max-w-[800px] mx-auto px-8">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate("/community")}
          className="flex items-center gap-2 text-[#888780] hover:text-[#1D9E75] mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          커뮤니티로 돌아가기
        </button>

        {/* 게시글 */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 mb-6">
          {/* 카테고리 & 태그 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#E1F5EE] text-[#1D9E75] text-sm rounded-full font-medium">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-[#F5F5F5] text-[#888780] text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">{post.title}</h1>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-xl">
                {post.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1A1A1A]">{post.author}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: gradeColor.bg, color: gradeColor.text }}
                  >
                    {post.grade}
                  </span>
                </div>
                <span className="text-sm text-[#888780]">{post.timestamp}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#888780]">
            <span>조회 {post.views.toLocaleString()}</span>
            <span>댓글 {post.comments}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="text-[#1A1A1A] leading-relaxed whitespace-pre-line mb-8">
            {post.content}
          </div>

          {/* 좋아요 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${
                liked
                  ? "bg-[#E1F5EE] border-[#1D9E75] text-[#1D9E75]"
                  : "bg-white border-[#E5E5E5] text-[#888780] hover:border-[#1D9E75] hover:text-[#1D9E75]"
              }`}
            >
              <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              좋아요 {likeCount}
            </button>
          </div>
        </div>

        {/* 댓글 */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
          <h2 className="font-bold text-[#1A1A1A] mb-6">댓글 {comments.length}</h2>

          {/* 댓글 작성 */}
          <div className="mb-6 pb-6 border-b border-[#F0F0F0]">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1A1A1A] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="px-5 py-2 bg-[#1D9E75] text-white rounded-lg text-sm font-medium hover:bg-[#0F6E56] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                등록
              </button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.map((comment) => {
              const cGrade = gradeColors[comment.grade] ?? gradeColors["루키"];
              return (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center text-lg flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#1A1A1A] text-sm">{comment.author}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: cGrade.bg, color: cGrade.text }}
                      >
                        {comment.grade}
                      </span>
                      <span className="text-xs text-[#888780]">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">{comment.content}</p>
                    <button className="flex items-center gap-1 mt-2 text-xs text-[#888780] hover:text-[#1D9E75] transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {comment.likes}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
