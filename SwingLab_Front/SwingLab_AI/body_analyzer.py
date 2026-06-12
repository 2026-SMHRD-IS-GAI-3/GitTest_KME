import cv2
import mediapipe as mp
import numpy as np
import os

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# ===== 거리 계산 =====
def dist(p1, p2, w, h):
    return np.sqrt(((p1.x - p2.x) * w) ** 2 + ((p1.y - p2.y) * h) ** 2)

# ===== 체형 분석 (이미지용) =====
def analyze_body(lm, w, h):
    shoulder_w = dist(lm[11], lm[12], w, h)
    hip_w = dist(lm[23], lm[24], w, h)

    sh_hip_ratio = shoulder_w / hip_w if hip_w > 0 else 1

    if sh_hip_ratio >= 1.15:
        body_type = 'V-SHAPE'
        body_color = (0, 200, 255)
    elif sh_hip_ratio <= 0.87:
        body_type = 'A-SHAPE'
        body_color = (0, 100, 255)
    elif 0.95 <= sh_hip_ratio <= 1.05:
        body_type = 'RECTANGLE'
        body_color = (0, 255, 150)
    else:
        body_type = 'OVAL'
        body_color = (200, 200, 0)

    return {
        'body_type':    body_type,
        'body_color':   body_color,
        'shoulder_w':   round(shoulder_w, 1),
        'hip_w':        round(hip_w, 1),
        'sh_hip_ratio': round(sh_hip_ratio, 2),
    }

# ===== 윙스팬 분석 =====
# lm[19] = 왼쪽 검지 끝, lm[20] = 오른쪽 검지 끝
# visibility > 0.7 이면 검지 끝 사용, 아니면 손목(lm[15,16])으로 fallback
# 검지 끝 기준 임계값: 긴팔 >= 4.0 / 짧은팔 <= 3.6
# 손목 기준 임계값:    긴팔 >= 3.6 / 짧은팔 <= 3.2
def analyze_wingspan(lm, w, h, shoulder_w_fixed=None):
    shoulder_w = shoulder_w_fixed if shoulder_w_fixed is not None else dist(lm[11], lm[12], w, h)

    use_fingertip = lm[19].visibility > 0.7 and lm[20].visibility > 0.7

    if use_fingertip:
        wingspan     = dist(lm[19], lm[20], w, h)
        measure_type = '검지끝 기준'
        long_threshold  = 4.0
        short_threshold = 3.6
    else:
        wingspan     = dist(lm[15], lm[16], w, h)
        measure_type = '손목 기준 (fallback)'
        long_threshold  = 3.6
        short_threshold = 3.2

    wingspan_ratio = wingspan / shoulder_w if shoulder_w > 0 else 1

    if wingspan_ratio >= long_threshold:
        arm_type = '긴 팔 (Long)'
    elif wingspan_ratio <= short_threshold:
        arm_type = '짧은 팔 (Short)'
    else:
        arm_type = '평균 팔 (Average)'

    return {
        'arm_type':       arm_type,
        'measure_type':   measure_type,
        'wingspan':       round(wingspan, 1),
        'shoulder_w':     round(shoulder_w, 1),
        'wingspan_ratio': round(wingspan_ratio, 2),
        'use_fingertip':  use_fingertip,
    }

def resize_frame(frame, max_w=1200, max_h=900):
    h, w = frame.shape[:2]
    scale = min(max_w/w, max_h/h)
    if scale < 1:
        frame = cv2.resize(frame, (int(w*scale), int(h*scale)))
    return frame

# ===== 이미지 시각화 (체형) =====
def draw_body(frame, result, lm, w, h):
    mp_drawing.draw_landmarks(
        frame, lm, mp_pose.POSE_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(0,255,0), thickness=2, circle_radius=3),
        mp_drawing.DrawingSpec(color=(255,255,255), thickness=2)
    )
    sh_l = (int(lm.landmark[11].x * w), int(lm.landmark[11].y * h))
    sh_r = (int(lm.landmark[12].x * w), int(lm.landmark[12].y * h))
    cv2.line(frame, sh_l, sh_r, (0, 255, 255), 3)
    cv2.putText(frame, f'S:{result["shoulder_w"]:.0f}',
                ((sh_l[0]+sh_r[0])//2, sh_l[1]-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,255), 1)

    hp_l = (int(lm.landmark[23].x * w), int(lm.landmark[23].y * h))
    hp_r = (int(lm.landmark[24].x * w), int(lm.landmark[24].y * h))
    cv2.line(frame, hp_l, hp_r, (255, 100, 0), 3)
    cv2.putText(frame, f'H:{result["hip_w"]:.0f}',
                ((hp_l[0]+hp_r[0])//2, hp_l[1]-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,100,0), 1)

    lines = [
        (f'Body Type: {result["body_type"]}',          result['body_color']),
        (f'Shoulder/Hip Ratio: {result["sh_hip_ratio"]}', (255,255,255)),
    ]
    cv2.rectangle(frame, (5, 5), (380, len(lines)*28+15), (0,0,0), -1)
    for i, (text, color) in enumerate(lines):
        cv2.putText(frame, text, (10, i*28+25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)
    return frame

# ===== 윙스팬 시각화 =====
def draw_wingspan(frame, result, lm, w, h):
    mp_drawing.draw_landmarks(
        frame, lm, mp_pose.POSE_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(0,255,0), thickness=2, circle_radius=3),
        mp_drawing.DrawingSpec(color=(255,255,255), thickness=2)
    )

    # 사용한 랜드마크에 따라 시각화 포인트 결정
    if result['use_fingertip']:
        pl = (int(lm.landmark[19].x * w), int(lm.landmark[19].y * h))
        pr = (int(lm.landmark[20].x * w), int(lm.landmark[20].y * h))
        line_color = (0, 255, 0)      # 초록 = 검지 끝
    else:
        pl = (int(lm.landmark[15].x * w), int(lm.landmark[15].y * h))
        pr = (int(lm.landmark[16].x * w), int(lm.landmark[16].y * h))
        line_color = (0, 165, 255)    # 주황 = 손목 fallback

    cv2.line(frame, pl, pr, line_color, 3)
    cv2.putText(frame, f'Wingspan:{result["wingspan"]:.0f}',
                ((pl[0]+pr[0])//2, pl[1]-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, line_color, 1)

    arm_color = (0,200,255) if 'Long'    in result['arm_type'] else \
                (0,100,255) if 'Short'   in result['arm_type'] else (0,255,150)

    lines = [
        (f'Arm Length: {result["arm_type"]}',              arm_color),
        (f'Measure: {result["measure_type"]}',             (200,200,0)),
        (f'Wingspan/Shoulder: {result["wingspan_ratio"]}', (255,255,255)),
        (f'Wingspan px: {result["wingspan"]}',             (200,200,200)),
        (f'Shoulder px: {result["shoulder_w"]}',           (200,200,200)),
    ]
    cv2.rectangle(frame, (5, 5), (380, len(lines)*28+15), (0,0,0), -1)
    for i, (text, c) in enumerate(lines):
        cv2.putText(frame, text, (10, i*28+25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, c, 2)
    return frame

# ===== 이미지 처리 (체형) =====
def process_image(path):
    frame = cv2.imread(path)
    if frame is None:
        print(f'Cannot open image: {path}')
        return
    frame = resize_frame(frame)
    h, w = frame.shape[:2]
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
        result = pose.process(rgb)
        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark
            body = analyze_body(lm, w, h)
            frame = draw_body(frame, body, result.pose_landmarks, w, h)
            print('\n===== 체형 분석 결과 =====')
            print(f'체형 코드:      {body["body_type"]}')
            print(f'어깨/골반 비율:  {body["sh_hip_ratio"]}')
        else:
            print('사람을 감지하지 못했습니다!')

    out_path = os.path.splitext(path)[0] + '_result.jpg'
    cv2.imwrite(out_path, frame)
    print(f'저장 완료: {out_path}')
    cv2.imshow('Body Analyzer - Body Type', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# ===== 이미지 처리 (윙스팬) =====
def process_wingspan_image(path):
    frame = cv2.imread(path)
    if frame is None:
        print(f'Cannot open image: {path}')
        return
    frame = resize_frame(frame)
    h, w = frame.shape[:2]
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
        result = pose.process(rgb)
        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark
            ws = analyze_wingspan(lm, w, h, shoulder_w_fixed=None)
            frame = draw_wingspan(frame, ws, result.pose_landmarks, w, h)

            print('\n===== 윙스팬 분석 결과 =====')
            print(f'팔 길이 판정:    {ws["arm_type"]}')
            print(f'측정 방식:       {ws["measure_type"]}')
            print(f'어깨 대비 윙스팬: {ws["wingspan_ratio"]}')
            print(f'윙스팬 픽셀 수:   {ws["wingspan"]}')
            print(f'어깨 너비 픽셀 수: {ws["shoulder_w"]}')
        else:
            print('사람을 감지하지 못했습니다!')

    out_path = os.path.splitext(path)[0] + '_wingspan_result.jpg'
    cv2.imwrite(out_path, frame)
    print(f'저장 완료: {out_path}')
    cv2.imshow('Body Analyzer - Wingspan', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# ===== 실행 =====
files = [
    ('body_type.jpg',     'body'),
    ('body_wingspan.jpg', 'wingspan'),
]

for path, mode in files:
    if not os.path.exists(path):
        print(f'파일을 찾을 수 없습니다: {path}')
        continue
    print(f'\n========== {path} ({mode}) ==========')
    if mode == 'body':
        process_image(path)
    else:
        process_wingspan_image(path)