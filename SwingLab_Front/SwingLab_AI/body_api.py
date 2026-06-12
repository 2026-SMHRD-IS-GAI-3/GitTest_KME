from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import numpy as np
import tempfile
import os
import uuid

from golf_analyzer import run_analysis
from fastapi.staticfiles import StaticFiles

app = FastAPI()

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_pose = mp.solutions.pose


@app.get("/")
def home():
    return {"message": "SwingLab Python 서버 연결 성공"}


def dist(p1, p2, w, h):
    return np.sqrt(((p1.x - p2.x) * w) ** 2 + ((p1.y - p2.y) * h) ** 2)


def read_pose(file_path):
    frame = cv2.imread(file_path)

    if frame is None:
        return None

    h, w = frame.shape[:2]
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
        result = pose.process(rgb)

        if not result.pose_landmarks:
            return None

        return result.pose_landmarks.landmark, w, h


def analyze_body(lm, w, h):
    shoulder_w = dist(lm[11], lm[12], w, h)
    hip_w = dist(lm[23], lm[24], w, h)

    ratio = shoulder_w / hip_w if hip_w > 0 else 1

    if ratio > 1.05:
        shoulder_type = "넓은어깨"
    elif ratio < 0.95:
        shoulder_type = "좁은어깨"
    else:
        shoulder_type = "평균"

    return {
        "shoulderType": shoulder_type,
        "shoulderToHipRatio": round(ratio, 2),
        "shoulderWidth": round(shoulder_w, 1),
        "hipWidth": round(hip_w, 1),
    }


def analyze_wingspan(lm, w, h):
    shoulder_w = dist(lm[11], lm[12], w, h)

    use_fingertip = lm[19].visibility > 0.7 and lm[20].visibility > 0.7

    if use_fingertip:
        wingspan = dist(lm[19], lm[20], w, h)
        long_threshold = 4.0
        short_threshold = 3.6
    else:
        wingspan = dist(lm[15], lm[16], w, h)
        long_threshold = 3.6
        short_threshold = 3.2

    ratio = wingspan / shoulder_w if shoulder_w > 0 else 1

    if ratio >= long_threshold:
        arm_type = "장팔"
    elif ratio <= short_threshold:
        arm_type = "단팔"
    else:
        arm_type = "평균"

    return {
        "armType": arm_type,
        "wingspanRatio": round(ratio, 2),
        "wingspan": round(wingspan, 1),
        "useFingertip": use_fingertip,
    }


def decide_body_code(arm_type, shoulder_type):
    if arm_type == "평균" and shoulder_type == "평균":
        return "BT05"
    elif arm_type == "장팔" and shoulder_type == "넓은어깨":
        return "BT01"
    elif arm_type == "장팔":
        return "BT02"
    elif arm_type == "단팔" and shoulder_type == "넓은어깨":
        return "BT03"
    elif arm_type == "단팔":
        return "BT04"
    else:
        return "BT05"


@app.post("/analyze-body")
async def analyze_body_api(
    armsImage: UploadFile = File(...),
    attentionImage: UploadFile = File(...)
):
    arms_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    attention_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")

    try:
        arms_temp.write(await armsImage.read())
        attention_temp.write(await attentionImage.read())
        arms_temp.close()
        attention_temp.close()

        arms_pose = read_pose(arms_temp.name)
        attention_pose = read_pose(attention_temp.name)

        if arms_pose is None:
            return {
                "success": False,
                "message": "팔 벌린 자세 사진에서 사람을 감지하지 못했습니다.",
            }

        if attention_pose is None:
            return {
                "success": False,
                "message": "차렷 자세 사진에서 사람을 감지하지 못했습니다.",
            }

        arms_lm, arms_w, arms_h = arms_pose
        attention_lm, attention_w, attention_h = attention_pose

        body = analyze_body(attention_lm, attention_w, attention_h)
        wingspan = analyze_wingspan(arms_lm, arms_w, arms_h)

        body_code = decide_body_code(
            wingspan["armType"],
            body["shoulderType"],
        )

        return {
            "success": True,
            "bodyCode": body_code,
            "armType": wingspan["armType"],
            "shoulderType": body["shoulderType"],
            "wingspanRatio": wingspan["wingspanRatio"],
            "shoulderToHipRatio": body["shoulderToHipRatio"],
            "shoulderWidth": body["shoulderWidth"],
            "hipWidth": body["hipWidth"],
            "wingspan": wingspan["wingspan"],
        }

    finally:
        if os.path.exists(arms_temp.name):
            os.remove(arms_temp.name)

        if os.path.exists(attention_temp.name):
            os.remove(attention_temp.name)


def build_feedback_keys(result):
    keys = []

    score_map = {
        "ADDRESS": result.get("address_score"),
        "BACKSWING": result.get("backswing_score"),
        "DOWNSWING": result.get("downswing_score"),
        "IMPACT_FINISH": result.get("impact_score"),
    }

    for section, score in score_map.items():
        if score is None:
            continue

        if score < 80:
            keys.append({
                "sectionName": section,
                "itemName": "SPINE_ANGLE",
                "score": score,
                "measuredValue": None,
            })

            keys.append({
                "sectionName": section,
                "itemName": "KNEE_ANGLE",
                "score": score,
                "measuredValue": None,
            })

    avg_xf = result.get("avg_xf")

    if avg_xf is not None and avg_xf < 8.0:
        keys.append({
            "sectionName": "BACKSWING",
            "itemName": "X_FACTOR",
            "score": None,
            "measuredValue": avg_xf,
        })

    feedbacks = result.get("feedbacks", [])

    if any("스웨이" in f for f in feedbacks):
        keys.append({
            "sectionName": "BACKSWING",
            "itemName": "SWAY",
            "score": None,
            "measuredValue": 0.25,
        })

    if any("얼리 익스텐션" in f for f in feedbacks):
        severity = 0.10 if "심함" in " ".join(feedbacks) else 0.06

        keys.append({
            "sectionName": "IMPACT_FINISH",
            "itemName": "EARLY_EXTENSION",
            "score": None,
            "measuredValue": severity,
        })

    return keys


@app.post("/analyze-swing")
async def analyze_swing_api(
    sideVideo: UploadFile = File(...),
    frontVideo: UploadFile = File(...),
    club: str = Form("iron"),
    ballX: int = Form(0),
    ballY: int = Form(0)
):
    side_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    front_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")

    analysis_id = str(uuid.uuid4()).replace("-", "")[:12]

    try:
        side_temp.write(await sideVideo.read())
        front_temp.write(await frontVideo.read())
        side_temp.close()
        front_temp.close()

        os.makedirs("./uploads", exist_ok=True)

        result = run_analysis(
            side_path=side_temp.name,
            front_path=front_temp.name,
            club=club,
            ball_x=ballX,
            ball_y=ballY,
            analysis_id=analysis_id,
            output_dir="./uploads"
        )

        if "error" in result:
            return {
                "success": False,
                "message": result["error"],
            }

        feedback_keys = build_feedback_keys(result)

        return {
            "success": True,
            "analysisId": analysis_id,

            "totalScore": result.get("total_score", 0),
            "addressScore": result.get("address_score", 0),
            "backswingScore": result.get("backswing_score", 0),
            "downswingScore": result.get("downswing_score", 0),
            "impactScore": result.get("impact_score", 0),

            "flexibility": result.get("flexibility", ""),
            "avgXf": result.get("avg_xf", 0),
            "orbit": result.get("orbit", ""),

            "sideResultPath": result.get("side_result_path", ""),
            "frontResultPath": result.get("front_result_path", ""),

            "feedbackKeys": feedback_keys,
            "feedbacks": result.get("feedbacks", []),

            "section_details": result.get("section_details", {}),
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e),
        }

    finally:
        if os.path.exists(side_temp.name):
            os.remove(side_temp.name)

        if os.path.exists(front_temp.name):
            os.remove(front_temp.name)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "SwingLab FastAPI 서버 정상 동작 중",
    }