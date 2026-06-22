<div align="center">
  
# 🏌️ SwingLab

### MediaPipe 기반 체형 반영 AI 골프 스윙 분석 서비스

> **체형이 다르면 스윙도 달라야 합니다.**
>
> 사용자의 체형과 팔 길이를 분석 및 반영하여 AI가 개인 맞춤형 골프 스윙 피드백을 제공합니다.

**팀명 : SwingLab**

</div>

---

# 📑 목차

- [프로젝트 소개](#프로젝트-소개)
- [서비스 소개](#서비스-소개)
- [프로젝트 기간](#프로젝트-기간)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [서비스 흐름도](#서비스-흐름도)
- [ER Diagram](#er-diagram)
- [화면 구성](#화면-구성)
- [팀원 소개](#팀원-소개)
- [Trouble Shooting](#trouble-shooting)
- [실행 방법](#실행-방법)

---

# 프로젝트 소개

|항목|내용|
|---|---|
|프로젝트명|SwingLab|
|개발기간|2026.08 ~ 2026.19|
|개발인원|5명|
|프로젝트 소개|체형을 반영한 AI 골프 스윙 분석 및 맞춤형 피드백 서비스|

### 📌 프로젝트 배경

기존 AI 골프 분석 서비스는 대부분 프로 선수의 스윙을 기준으로 비교하여 사용자의 체형 차이를 고려하지 못합니다.

SwingLab은 사용자의 **체형(어깨/골반 비율)** 과 **팔 길이**를 분석하여 개인에게 적합한 프로 선수와 매칭하여 맞춤형 스윙 피드백을 제공합니다.

---

# 서비스 소개

### 📐 체형 분석

- MediaPipe Pose 기반 체형 측정
- 어깨 / 골반 비율 분석
- 팔 길이 자동 측정
- 체형 유형 분류

### 🏌️ AI 스윙 분석

- 스윙 4구간 자동 분류
- 척추 기울기 분석
- 무릎 각도 분석
- 골반 회전 분석
- 어깨 회전 분석
- X-Factor 계산

### ⚠ 이상 동작 감지

- Early Extension
- Sway
- Head Movement

### 🤖 맞춤형 피드백

- 체형 기반 피드백
- 구간별 점수
- 종합 점수

---

# 주요 기능

## 📐 체형 분석
✔ 팔 길이 자동 측정((윙스팬/어깨비율)
- LONG —비율4.0이상
- NORMAL —비율3.6~4.0
- SHORT —비율3.6미만
  
✔ 체형 분류(어깨/골반비율)
- V Shape(역삼각형)
- A Shape(삼각형)
- Rectangle(직사각형)
- Oval(타원형)
---

## 🎥 스윙 분석

### 스윙 자동 분류

- Address
- Back Swing
- Down Swing
- Impact

### 자세 분석

- 척추 기울기
- 무릎 각도
- 어깨 회전
- 골반 회전
- X-Factor

### 이상 동작 감지

- Early Extension
- Sway
- Head Movement

---

## 👤 회원 기능

- 회원가입
- 로그인
- 마이페이지
- 분석 기록 조회

---

## 📊 분석 결과

- 종합 점수
- 구간별 점수
- 체형 맞춤 피드백
- 개선 가이드

---

# 기술 스택

<img width="643" height="311" alt="image" src="https://github.com/user-attachments/assets/012ddd1e-a78d-48a4-977d-8252bba88880" />


# 시스템 아키텍처

<img width="1232" height="666" alt="image" src="https://github.com/user-attachments/assets/ed422f07-7c9f-42f8-a8d1-92ac48a54e80" />


# 서비스 흐름도
<img width="1024" height="1536" alt="DSADSADDSD" src="https://github.com/user-attachments/assets/04da0aec-7a10-45ad-80ed-8d34350cf542" />

# ER Diagram
<img width="1870" height="1450" alt="KakaoTalk_20260617_091632583" src="https://github.com/user-attachments/assets/1907861d-4a04-4d70-9406-5e300c22522d" />


# 화면 구성

| 화면 | 설명 |
|------|------|
| **로그인** | 회원 인증 |
| **회원가입** | 새 사용자 등록 |
| **메인 대시보드** | 분석 현황, 등급, 주요 기능 |
| **체형 진단** | 신체 정보 입력 & 분석 |
| **스윙 분석** | 영상 업로드 & AI 분석 |
| **분석 결과** | 점수, 피드백, 영상 |
| **기록** | 분석 이력 조회 |
| **커뮤니티** | 게시물, 댓글, 공유 |
| **마이페이지** | 개인정보 수정 |

📸 **자세한 UI 설계는** [화면설계서_SwingLab_v1.2.pdf](https://github.com/user-attachments/files/29194178/_SwingLab_v1.2.pdf) **참조**


# 팀원 소개

|이름|담당|
|---|---|
|김명은|PM / Back-End|
|조호성|Front-End|
|남현욱|AI Modeling|
|김호근|Database|
|백영준|Back-End|

---

# Trouble Shooting
<table>
<tr>
<td width="30%"><b>🎯 Early Extension 오탐</b></td>
<td>

**문제** — 정상 스윙인데도 지속적으로 얼리 익스텐션이 감지되는 문제 발생

**원인** — 기준 좌표 설정 오류,  방향을 고려하지 않은 거리 계산

**해결** — 촬영 방향 고정 Address를 기준점으로 설정, 2단계 Threshol 적용
</td>
</tr>

<tr>
<td><b> 📦 Oracle DB 저장 오류</b></td>
<td>
  
**문제** — 게시글 등록 시 DB 저장 실패

**원인** — title, content 값이 null, NOT NULL 제약 조건 위반

**해결** — HTTP Body 수정, UTF-8 인코딩 적용, Servlet Validation 추가
</td>
</tr>
</table>

# 실행 방법

```bash
# Clone

git clone https://github.com/Repository.git

# Flask 실행

python app.py

# Tomcat 실행

Apache Tomcat 9

# Oracle 연결

db.properties 설정

# 실행

http://localhost:8080/
```

---

# 📷 시연 영상
https://github.com/2026-SMHRD-IS-GAI-3/Noblackboard/raw/main/docs/airnote-demo.mp4

> 영상이 보이지 않으면 ▶ [시연 영상 다운로드/재생](docs/airnote-demo.mp4)

### 🏌️ SwingLab

**체형을 이해하는 AI 골프 스윙 분석 서비스**

Made by Team SwingLab

</div>
