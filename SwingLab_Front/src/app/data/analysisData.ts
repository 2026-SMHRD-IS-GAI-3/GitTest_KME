import semiproImage from "../../imports/semipro.PNG";
import amateurImage from "../../imports/amateur.PNG";
import proImage from "../../imports/pro.PNG";
import rookieImage from "../../imports/rookie.PNG";

export const RECENT_RECORDS = [
  { date: "5월 20일", time: "오후 3:30", club: "드라이버", grade: "세미프로", badgeBg: "#E1F5EE", badgeText: "#0F6E56", img: semiproImage, avg: 74, high: 81, low: 58 },
  { date: "5월 18일", time: "오전 10:15", club: "아이언", grade: "세미프로", badgeBg: "#E1F5EE", badgeText: "#0F6E56", img: semiproImage, avg: 72, high: 79, low: 55 },
  { date: "5월 15일", time: "오후 2:20", club: "드라이버", grade: "아마추어", badgeBg: "#FAEEDA", badgeText: "#854F0B", img: amateurImage, avg: 58, high: 71, low: 45 },
];

export function calcAvgByClub(club: "드라이버" | "아이언" | "전체"): number {
  const records = club === "전체" ? RECENT_RECORDS : RECENT_RECORDS.filter((r) => r.club === club);
  if (records.length === 0) return 0;
  return Math.round(records.reduce((s, r) => s + r.avg, 0) / records.length);
}

export function calcOverallAvg(): number {
  return calcAvgByClub("전체");
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "마스터";
  if (score >= 75) return "프로";
  if (score >= 60) return "세미프로";
  if (score >= 40) return "아마추어";
  return "루키";
}

export function gradeImage(grade: string): string {
  if (grade === "마스터" || grade === "프로") return proImage;
  if (grade === "세미프로") return semiproImage;
  if (grade === "아마추어") return amateurImage;
  return rookieImage;
}

export function nextGradeInfo(score: number): { label: string; remaining: number; progress: number } {
  if (score >= 90) return { label: "최고 등급", remaining: 0, progress: 100 };
  if (score >= 75) return { label: "마스터까지", remaining: 90 - score, progress: ((score - 75) / 15) * 100 };
  if (score >= 60) return { label: "프로까지", remaining: 75 - score, progress: ((score - 60) / 15) * 100 };
  if (score >= 40) return { label: "세미프로까지", remaining: 60 - score, progress: ((score - 40) / 20) * 100 };
  return { label: "아마추어까지", remaining: 40 - score, progress: (score / 40) * 100 };
}
