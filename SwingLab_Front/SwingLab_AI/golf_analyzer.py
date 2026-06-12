import cv2
import mediapipe as mp
import numpy as np
import json
import os
import subprocess
import shutil

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils


def calc_angle(a, b, c):
    a = np.array([a.x, a.y])
    b = np.array([b.x, b.y])
    c = np.array([c.x, c.y])

    ba = a - b
    bc = c - b

    denom = np.linalg.norm(ba) * np.linalg.norm(bc)

    if denom == 0:
        return 0

    return round(
        np.degrees(
            np.arccos(
                np.clip(np.dot(ba, bc) / denom, -1, 1)
            )
        ),
        2,
    )


def calc_rotation(p1, p2):
    return round(abs(np.degrees(np.arctan2(p2.y - p1.y, p2.x - p1.x))), 2)


def classify_stage(hist, key="_shoulder_raw", bs=1.5, ds=-1.5, ic=10, im=30, at=15):
    if len(hist) < 5:
        return "ADDRESS"

    recent = [a[key] for a in hist[-5:]]
    cur = recent[-1]
    prv = recent[0]
    diff = cur - prv
    all_v = [a[key] for a in hist]
    tc = cur - hist[0][key]

    if len(hist) < 10:
        return "ADDRESS"
    elif tc < ic and max(all_v) - cur > im:
        return "IMPACT"
    elif diff > bs:
        return "BACKSWING"
    elif diff < ds and max(all_v) - cur > 15:
        return "DOWNSWING"
    elif tc < at:
        return "ADDRESS"
    else:
        return "BACKSWING"


STAGE_COLORS = {
    "ADDRESS": (0, 255, 0),
    "BACKSWING": (0, 165, 255),
    "DOWNSWING": (0, 255, 255),
    "IMPACT": (0, 0, 255),
}


def get_std_mean(std_val):
    if isinstance(std_val, dict):
        return std_val.get("mean", 0)
    return std_val


def get_std_tol(std_val, default_tol):
    if isinstance(std_val, dict):
        std = std_val.get("std", 0)
        return max(std * 2, default_tol * 0.5)
    return default_tol


def create_video_writer(result_path, fps, size):
    """
    브라우저 재생 문제를 막기 위해:
    1순위: 임시 AVI(MJPG) 저장 후 ffmpeg로 H.264 MP4 변환
    2순위: ffmpeg가 없으면 mp4v로 바로 저장
    """
    ffmpeg_path = shutil.which("ffmpeg")

    if ffmpeg_path:
        raw_path = result_path.replace(".mp4", "_raw.avi")
        fourcc = cv2.VideoWriter_fourcc(*"MJPG")
        writer = cv2.VideoWriter(raw_path, fourcc, fps, size)
        return writer, raw_path, result_path, True

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(result_path, fourcc, fps, size)
    return writer, result_path, result_path, False


def finalize_video(raw_path, result_path, need_convert):
    if not need_convert:
        return result_path

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        raw_path,
        "-vcodec",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        result_path,
    ]

    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    if os.path.exists(raw_path):
        os.remove(raw_path)

    return result_path


def calc_spine_tilt(lm):
    sx = (lm[11].x + lm[12].x) / 2
    sy = (lm[11].y + lm[12].y) / 2
    hx = (lm[23].x + lm[24].x) / 2
    hy = (lm[23].y + lm[24].y) / 2

    return round(abs(np.degrees(np.arctan2(sx - hx, sy - hy))), 2)


def calc_line_angle(x1, y1, x2, y2):
    return round(np.degrees(np.arctan2(abs(x2 - x1), abs(y2 - y1))), 2)


def extend_top(x1, y1, x2, y2, w, h):
    if x2 == x1:
        return (x1, 0), (x2, y2)

    s = (y2 - y1) / (x2 - x1)
    return (0, int(y1 - s * x1)), (x2, y2)


def mid_line(a1, a2, b1, b2):
    return (
        ((a1[0] + b1[0]) // 2, (a1[1] + b1[1]) // 2),
        ((a2[0] + b2[0]) // 2, (a2[1] + b2[1]) // 2),
    )


def get_side_angles(lm):
    return {
        "knee": calc_angle(lm[23], lm[25], lm[27]),
        "spine": calc_spine_tilt(lm),
        "_shoulder_raw": calc_rotation(lm[11], lm[12]),
    }


def get_three_lines(lm, fw, fh, bp):
    bx = bp[0] / fw
    by = bp[1] / fh

    sx = (lm[11].x + lm[12].x) / 2
    sy = (lm[11].y + lm[12].y) / 2
    wx = (lm[15].x + lm[16].x) / 2
    wy = (lm[15].y + lm[16].y) / 2

    def px(x, y):
        return int(x * fw), int(y * fh)

    sp = px(sx, sy)
    wp = px(wx, wy)

    l1a, l1b = extend_top(*sp, *bp, fw, fh)
    l3a, l3b = extend_top(*wp, *bp, fw, fh)
    l2a, l2b = mid_line(l1a, l1b, l3a, l3b)

    return {
        "ball_px": bp,
        "line1_p1": l1a,
        "line1_p2": l1b,
        "line2_p1": l2a,
        "line2_p2": l2b,
        "line3_p1": l3a,
        "line3_p2": l3b,
        "line1_angle": calc_line_angle(sx, sy, bx, by),
        "line2_angle": calc_line_angle((sx + wx) / 2, (sy + wy) / 2, bx, by),
        "line3_angle": calc_line_angle(wx, wy, bx, by),
    }


SIDE_DEFAULT_TOL = {"knee": 20, "spine": 15}
SIDE_W = {
    "ADDRESS": {"knee": 5, "spine": 5},
    "BACKSWING": {"knee": 4, "spine": 6},
    "DOWNSWING": {"knee": 4, "spine": 6},
    "IMPACT": {"knee": 5, "spine": 5},
}
THREE_DEFAULT_TOL = {"line1_angle": 15, "line2_angle": 12, "line3_angle": 15}
THREE_W = {"line1_angle": 10, "line2_angle": 10, "line3_angle": 10}
SIDE_HEAD_THR = {
    "ADDRESS": 0.02,
    "BACKSWING": 0.03,
    "DOWNSWING": 0.05,
    "IMPACT": 0.07,
}


def score_side(stage, angles, std):
    s = std.get(stage, {})
    w = SIDE_W[stage]
    tw = sum(w.values())
    sc = 0.0
    fb = []

    for k, ww in w.items():
        if k not in s or k not in angles:
            continue

        mean = get_std_mean(s[k])
        tol = get_std_tol(s[k], SIDE_DEFAULT_TOL.get(k, 20))
        d = abs(angles[k] - mean)

        if d <= tol * 0.3:
            sc += ww
        elif d <= tol:
            sc += ww * (1 - (d - tol * 0.3) / (tol * 0.7))
        else:
            fb.append(f"{k} 조정필요")

    return round(sc / tw * 100, 1), fb


def score_three(fl, std):
    if not std:
        return 0, []

    tw = sum(THREE_W.values())
    sc = 0.0
    fb = []

    for k, w in THREE_W.items():
        if k not in std:
            continue

        mean = get_std_mean(std[k])
        tol = get_std_tol(std[k], THREE_DEFAULT_TOL.get(k, 15))
        d = abs(fl[k] - mean)

        if d <= tol * 0.3:
            sc += w
        elif d <= tol:
            sc += w * (1 - (d - tol * 0.3) / (tol * 0.7))
        else:
            fb.append(f"3선 {k} 차이")

    return round(sc / tw * 100, 1), fb


def head_score_side(dist, stage):
    t = SIDE_HEAD_THR.get(stage, 0.03)

    if dist <= t * 0.5:
        return 100
    elif dist <= t:
        return int((1 - (dist - t * 0.5) / (t * 0.5)) * 100)

    return 0


EE_THRESHOLD_WARN = 0.05
EE_THRESHOLD_FAIL = 0.09


def score_early_extension(ee_list):
    if not ee_list:
        return 100, []

    avg = sum(ee_list) / len(ee_list)

    if avg <= EE_THRESHOLD_WARN:
        sc = 100
    elif avg <= EE_THRESHOLD_FAIL:
        sc = int(
            (1 - (avg - EE_THRESHOLD_WARN) / (EE_THRESHOLD_FAIL - EE_THRESHOLD_WARN))
            * 100
        )
    else:
        sc = 0

    fb = []

    if avg > EE_THRESHOLD_WARN:
        severity = "심함" if avg > EE_THRESHOLD_FAIL else "경계"
        fb.append(f"얼리 익스텐션({severity}) — 골반 전진량: {avg:.3f}")

    return sc, fb


def calc_rot_front(p1, p2):
    return round(abs(np.degrees(np.arctan2(p2.y - p1.y, p2.x - p1.x))), 2)


def angle_diff(a, b):
    d = abs(a - b)
    return min(d, 180 - d)


def get_front_angles(lm, ash=None, ahp=None):
    sr = calc_rot_front(lm[11], lm[12])
    hr = calc_rot_front(lm[23], lm[24])

    srot = round(angle_diff(sr, ash), 2) if ash is not None else 0
    hrot = round(angle_diff(hr, ahp), 2) if ahp is not None else 0
    sr_norm = sr if sr <= 90 else 180 - sr

    return {
        "shoulder_rot": srot,
        "hip_rot": hrot,
        "x_factor": round(srot - hrot, 2),
        "hip_x": round((lm[23].x + lm[24].x) / 2, 4),
        "head_x": round((lm[7].x + lm[8].x) / 2, 4),
        "shoulder_mid_x": round((lm[11].x + lm[12].x) / 2, 4),
        "left_knee_x": round(lm[25].x, 4),
        "right_knee_x": round(lm[26].x, 4),
        "_shoulder_raw": sr_norm,
        "_hip_raw": hr,
    }


FRONT_DEFAULT_TOL = {"shoulder_rot": 8, "hip_rot": 6, "x_factor": 5}
FRONT_W = {
    "ADDRESS": {"shoulder_rot": 2, "hip_rot": 2, "x_factor": 0},
    "BACKSWING": {"shoulder_rot": 4, "hip_rot": 3, "x_factor": 3},
    "DOWNSWING": {"shoulder_rot": 2, "hip_rot": 3, "x_factor": 5},
    "IMPACT": {"shoulder_rot": 0, "hip_rot": 0, "x_factor": 0},
}
FRONT_HEAD_THR = {
    "ADDRESS": 0.01,
    "BACKSWING": 0.02,
    "DOWNSWING": 0.03,
    "IMPACT": 0.05,
}
KNEE_THR = 0.04


def score_front(stage, angles, std):
    s = std.get(stage, {})
    w = FRONT_W[stage]
    tw = sum(v for v in w.values() if v > 0)

    if tw == 0:
        return 0, []

    sc = 0.0
    fb = []

    for k, ww in w.items():
        if ww == 0 or k not in s or k not in angles:
            continue

        mean = get_std_mean(s[k])
        tol = get_std_tol(s[k], FRONT_DEFAULT_TOL.get(k, 8))
        d = abs(angles[k] - mean)

        if d <= tol * 0.3:
            sc += ww
        elif d <= tol:
            sc += ww * (1 - (d - tol * 0.3) / (tol * 0.7))
        else:
            fb.append(f"{k} 차이")

    return round(sc / tw * 100, 1), fb


def score_head_front(hl, ahx, sl):
    if not hl:
        return 100, []

    sc = []

    for hx, st in zip(hl, sl):
        t = FRONT_HEAD_THR.get(st, 0.02)
        d = abs(hx - ahx)

        if d <= t * 0.5:
            sc.append(100)
        elif d <= t:
            sc.append(int((1 - (d - t * 0.5) / (t * 0.5)) * 100))
        else:
            sc.append(0)

    avg = round(sum(sc) / len(sc), 1)

    return avg, [] if avg >= 70 else ["머리 좌우 흔들림 큼"]


def score_knee_front(kl):
    if not kl:
        return 100, []

    avg = sum(kl) / len(kl)

    if avg <= KNEE_THR * 0.5:
        sc = 100
    elif avg <= KNEE_THR:
        sc = int((1 - (avg - KNEE_THR * 0.5) / (KNEE_THR * 0.5)) * 100)
    else:
        sc = 0

    return sc, [] if sc >= 70 else ["무릎 좌우 흔들림 큼"]


def score_sway(hl, sl_list, lf, rf, stages):
    if not hl:
        return 100, []

    sw = 0
    sl = 0
    ln = 0
    tot = len(hl)

    for hx, sx, st in zip(hl, sl_list, stages):
        if st == "BACKSWING" and hx < rf:
            sw += 1
        if st == "IMPACT" and hx > lf:
            sl += 1
        if st == "IMPACT" and sx > (lf - 0.02):
            ln += 1

    sc = max(0, int(100 - (sw + sl + ln) / tot * 200))
    fb = []

    if sw / tot > 0.2:
        fb.append("스웨이 발생")
    if sl / tot > 0.2:
        fb.append("슬라이드 발생")
    if ln / tot > 0.2:
        fb.append("앞쏠림 발생")

    return sc, fb


def calc_flexibility(front_hist, front_stage_list):
    bs_xf = [
        a["x_factor"]
        for a, s in zip(front_hist, front_stage_list)
        if s == "BACKSWING"
    ]

    if not bs_xf:
        return 0, "N/A", []

    bs_xf = [x for x in bs_xf if 0 <= x <= 30]

    if not bs_xf:
        return 0, "N/A", []

    avg_xf = round(sum(bs_xf) / len(bs_xf), 2)

    if avg_xf >= 8.0:
        return avg_xf, "좋음", []
    elif avg_xf >= 5.0:
        return avg_xf, "보통", []
    else:
        return avg_xf, "부족", ["유연성 부족 - 상체 스트레칭 권장"]


def load_json_file(file_name):
    data = {}

    try:
        with open(file_name, "r", encoding="utf-8") as f:
            data.update(json.load(f))
        print(f"{file_name} 로드 완료")
    except Exception:
        print(f"{file_name} 없음 → 기준값 없이 진행")

    return data


def run_analysis(side_path, front_path, club, ball_x, ball_y, analysis_id, output_dir="./output"):
    side_std_file = f"standard_{club}.json"
    three_std_file = f"three_lines_{club}.json"
    front_std_file = f"front_standard_{club}.json"

    side_std = load_json_file(side_std_file)
    three_std = load_json_file(three_std_file)
    front_std = load_json_file(front_std_file)

    os.makedirs(output_dir, exist_ok=True)

    side_result_path = os.path.join(output_dir, f"side_result_{analysis_id}.mp4")
    front_result_path = os.path.join(output_dir, f"front_result_{analysis_id}.mp4")

    ball_pos_fixed = (ball_x, ball_y)

    side_hist = []
    side_scores = {"ADDRESS": [], "BACKSWING": [], "DOWNSWING": [], "IMPACT": []}
    fixed_lines = None
    wrist_path = []
    head_orig = None
    head_r = 0
    side_head_list = []
    hip_wall_x = None
    ee_dist_list = []

    cap = cv2.VideoCapture(side_path)
    ret, first_frame = cap.read()

    if not ret:
        cap.release()
        return {"error": "측면 영상을 읽을 수 없습니다."}

    h0, w0 = first_frame.shape[:2]
    scale = min(800 / w0, 700 / h0)
    out_w = int(w0 * scale) if scale < 1 else w0
    out_h = int(h0 * scale) if scale < 1 else h0
    fps = cap.get(cv2.CAP_PROP_FPS) or 30

    out_side, side_raw_path, side_final_path, side_convert = create_video_writer(
        side_result_path,
        fps,
        (out_w, out_h),
    )

    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

    with mp_pose.Pose(min_detection_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            h, w = frame.shape[:2]
            scale = min(800 / w, 700 / h)

            if scale < 1:
                frame = cv2.resize(frame, (int(w * scale), int(h * scale)))

            h, w = frame.shape[:2]
            result = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            if result.pose_landmarks:
                lm = result.pose_landmarks.landmark
                ang = get_side_angles(lm)
                side_hist.append(ang)

                stage = classify_stage(
                    side_hist,
                    bs=1.5,
                    ds=-1.5,
                    ic=10,
                    im=30,
                    at=15,
                )

                if fixed_lines is None:
                    fixed_lines = get_three_lines(lm, w, h, ball_pos_fixed)

                hx = int((lm[7].x + lm[8].x) / 2 * w)
                hy = int((lm[7].y + lm[8].y) / 2 * h)

                if head_orig is None and stage == "ADDRESS":
                    head_orig = (hx, hy)
                    head_r = max(int(abs(lm[11].x - lm[12].x) * w * 0.45), 35)

                if head_orig:
                    hd = np.sqrt(
                        ((hx - head_orig[0]) / w) ** 2
                        + ((hy - head_orig[1]) / h) ** 2
                    )

                    if stage in ["BACKSWING", "DOWNSWING", "IMPACT"]:
                        side_head_list.append((hd, stage))

                if stage in ["BACKSWING", "DOWNSWING", "IMPACT"]:
                    wrist_path.append(
                        {
                            "x": (lm[15].x + lm[16].x) / 2,
                            "y": (lm[15].y + lm[16].y) / 2,
                        }
                    )

                hip_x_cur = (lm[23].x + lm[24].x) / 2

                if stage == "ADDRESS" and hip_wall_x is None:
                    hip_wall_x = hip_x_cur

                if stage == "IMPACT" and hip_wall_x is not None:
                    forward_dist = hip_x_cur - hip_wall_x

                    if forward_dist > 0:
                        ee_dist_list.append(forward_dist)

                if side_std:
                    side_score, _ = score_side(stage, ang, side_std)
                    side_scores[stage].append(side_score)

                if fixed_lines:
                    for ln in ["line1", "line2", "line3"]:
                        cv2.line(
                            frame,
                            fixed_lines[f"{ln}_p1"],
                            fixed_lines[f"{ln}_p2"],
                            (148, 0, 211),
                            2,
                        )

                    cv2.circle(frame, fixed_lines["ball_px"], 6, (0, 200, 255), -1)

                if head_orig:
                    moved = (
                        np.sqrt(
                            ((hx - head_orig[0]) / w) ** 2
                            + ((hy - head_orig[1]) / h) ** 2
                        )
                        > SIDE_HEAD_THR.get(stage, 0.03)
                    )

                    cv2.circle(
                        frame,
                        (hx, hy),
                        head_r,
                        (0, 0, 255) if moved else (0, 255, 0),
                        2,
                    )

                if hip_wall_x is not None:
                    wall_px = int(hip_wall_x * w)
                    wall_color = (0, 255, 255)
                    warn_text = None

                    if stage == "IMPACT":
                        fd = hip_x_cur - hip_wall_x

                        if fd > EE_THRESHOLD_FAIL:
                            wall_color = (0, 0, 255)
                            warn_text = "! EARLY EXT"
                        elif fd > EE_THRESHOLD_WARN:
                            wall_color = (0, 165, 255)
                            warn_text = "! EE WARNING"

                    cv2.line(frame, (wall_px, 0), (wall_px, h), wall_color, 2)
                    cv2.putText(
                        frame,
                        "HIP WALL",
                        (wall_px + 5, 25),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.45,
                        wall_color,
                        1,
                    )

                    if warn_text:
                        cv2.putText(
                            frame,
                            warn_text,
                            (w // 2 - 90, 95),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.0,
                            wall_color,
                            3,
                        )

                cv2.putText(
                    frame,
                    stage,
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    STAGE_COLORS.get(stage, (255, 255, 255)),
                    2,
                )

                mp_drawing.draw_landmarks(
                    frame,
                    result.pose_landmarks,
                    mp_pose.POSE_CONNECTIONS,
                )

            out_side.write(frame)

    cap.release()
    out_side.release()
    finalize_video(side_raw_path, side_final_path, side_convert)

    print(f"측면 결과 영상 저장 완료: {side_final_path}")

    front_hist = []
    front_scores = {"ADDRESS": [], "BACKSWING": [], "DOWNSWING": [], "IMPACT": []}
    ash = None
    ahp = None
    ahx = None
    alk = None
    ark = None
    alf = None
    arf = None
    fhl = []
    fhipl = []
    fshl = []
    fstl = []
    fkl = []

    cap = cv2.VideoCapture(front_path)
    ret, first_frame = cap.read()

    if not ret:
        cap.release()
        return {"error": "정면 영상을 읽을 수 없습니다."}

    h0, w0 = first_frame.shape[:2]
    scale = min(800 / w0, 700 / h0)
    out_w = int(w0 * scale) if scale < 1 else w0
    out_h = int(h0 * scale) if scale < 1 else h0
    fps = cap.get(cv2.CAP_PROP_FPS) or 30

    out_front, front_raw_path, front_final_path, front_convert = create_video_writer(
        front_result_path,
        fps,
        (out_w, out_h),
    )

    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

    with mp_pose.Pose(min_detection_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            h, w = frame.shape[:2]
            scale = min(800 / w, 700 / h)

            if scale < 1:
                frame = cv2.resize(frame, (int(w * scale), int(h * scale)))

            h, w = frame.shape[:2]
            result = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            if result.pose_landmarks:
                lm = result.pose_landmarks.landmark

                if ash is None:
                    ash = calc_rot_front(lm[11], lm[12])
                    ahp = calc_rot_front(lm[23], lm[24])
                    ahx = (lm[7].x + lm[8].x) / 2
                    alk = lm[25].x
                    ark = lm[26].x
                    alf = lm[27].x + 0.03
                    arf = lm[28].x - 0.03

                ang = get_front_angles(lm, ash, ahp)
                front_hist.append(ang)

                stage = classify_stage(
                    front_hist,
                    bs=0.5,
                    ds=-0.5,
                    ic=2,
                    im=30,
                    at=4,
                )

                fstl.append(stage)

                lkd = round(abs(lm[25].x - alk), 4)
                rkd = round(abs(lm[26].x - ark), 4)

                hxn = ang["hip_x"]
                sxn = ang["shoulder_mid_x"]

                is_sway = stage == "BACKSWING" and hxn < arf
                is_slide = stage == "IMPACT" and hxn > alf
                is_lean = stage == "IMPACT" and sxn > (alf - 0.02)

                if stage in ["BACKSWING", "DOWNSWING", "IMPACT"]:
                    fhl.append(ang["head_x"])
                    fhipl.append(hxn)
                    fshl.append(sxn)
                    fkl.append((lkd + rkd) / 2)

                if front_std:
                    front_score, _ = score_front(stage, ang, front_std)
                    front_scores[stage].append(front_score)

                lf_px = int(alf * w)
                rf_px = int(arf * w)

                cv2.line(
                    frame,
                    (lf_px, 0),
                    (lf_px, h),
                    (0, 0, 255) if (is_slide or is_lean) else (148, 0, 211),
                    2,
                )

                cv2.line(
                    frame,
                    (rf_px, 0),
                    (rf_px, h),
                    (0, 0, 255) if is_sway else (148, 0, 211),
                    2,
                )

                if is_sway:
                    cv2.putText(
                        frame,
                        "! SWAY",
                        (w // 2 - 60, 65),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1.0,
                        (0, 0, 255),
                        3,
                    )

                if is_slide:
                    cv2.putText(
                        frame,
                        "! SLIDE",
                        (w // 2 - 70, 65),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1.0,
                        (0, 0, 255),
                        3,
                    )

                if is_lean:
                    cv2.putText(
                        frame,
                        "! LEAN",
                        (w // 2 - 60, 105),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1.0,
                        (0, 100, 255),
                        3,
                    )

                cv2.putText(
                    frame,
                    stage,
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    STAGE_COLORS.get(stage, (255, 255, 255)),
                    2,
                )

                mp_drawing.draw_landmarks(
                    frame,
                    result.pose_landmarks,
                    mp_pose.POSE_CONNECTIONS,
                )

            out_front.write(frame)

    cap.release()
    out_front.release()
    finalize_video(front_raw_path, front_final_path, front_convert)

    print(f"정면 결과 영상 저장 완료: {front_final_path}")

    def get_phase_avg(score_dict, stage_key):
        frames = score_dict.get(stage_key, [])
        return round(sum(frames) / len(frames), 1) if frames else 100.0

    side_add = get_phase_avg(side_scores, "ADDRESS")
    front_add = get_phase_avg(front_scores, "ADDRESS")
    side_bs = get_phase_avg(side_scores, "BACKSWING")
    front_bs = get_phase_avg(front_scores, "BACKSWING")
    side_ds = get_phase_avg(side_scores, "DOWNSWING")
    front_ds = get_phase_avg(front_scores, "DOWNSWING")
    side_im = get_phase_avg(side_scores, "IMPACT")
    front_im = get_phase_avg(front_scores, "IMPACT")

    t_sc = score_three(fixed_lines, three_std)[0] if fixed_lines and three_std else 0
    h_sc = (
        round(
            sum(head_score_side(d, s) for d, s in side_head_list)
            / len(side_head_list),
            1,
        )
        if side_head_list
        else 100
    )

    hs, hs_fb = score_head_front(fhl, ahx, fstl)
    ks, ks_fb = score_knee_front(fkl)
    ss, ss_fb = score_sway(fhipl, fshl, alf, arf, fstl)
    ee_sc, ee_fb = score_early_extension(ee_dist_list)

    address_final = round((side_add + front_add + t_sc + ks) / 4, 1)
    backswing_final = round((side_bs + front_bs + hs + ss) / 4, 1)
    downswing_final = round((side_ds * 0.45 + front_ds * 0.15 + h_sc * 0.40), 1)
    impact_final = round((side_im + front_im + ee_sc + ss) / 4, 1)

    combined = round(
        address_final * 0.20
        + backswing_final * 0.30
        + downswing_final * 0.25
        + impact_final * 0.25,
        1,
    )

    avg_xf, flex_level, flex_fb = calc_flexibility(front_hist, fstl)

    orbit = "SQUARE"

    if len(wrist_path) >= 10:
        bs_wp = wrist_path[: len(wrist_path) // 2]
        im_wp = wrist_path[len(wrist_path) // 2 :]

        diff = sum(p["x"] for p in im_wp) / len(im_wp) - sum(p["x"] for p in bs_wp) / len(bs_wp)

        if diff > 0.05:
            orbit = "OUT-IN"
        elif diff < -0.05:
            orbit = "IN-OUT"

    all_fb = ks_fb + ss_fb + ee_fb + flex_fb

    return {
            "total_score": combined,
            "address_score": address_final,
            "backswing_score": backswing_final,
            "downswing_score": downswing_final,
            "impact_score": impact_final,
            "flexibility": flex_level,
            "avg_xf": avg_xf,
            "orbit": orbit,
            "feedbacks": all_fb,

            "section_details": {
                "ADDRESS": {
                    "spine_angle": round(
                        sum([a["spine"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "knee_angle": round(
                        sum([a["knee"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "shoulder_rotation": 0,
                    "pelvis_rotation": 0,
                    "arm_position_score": t_sc,
                    "shoulder_deviation_ratio": 0,
                    "section_score": address_final,
                },
                "BACKSWING": {
                    "spine_angle": round(
                        sum([a["spine"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "knee_angle": round(
                        sum([a["knee"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "shoulder_rotation": round(
                        sum([a["shoulder_rot"] for a in front_hist]) / len(front_hist), 2
                    ) if front_hist else 0,
                    "pelvis_rotation": round(
                        sum([a["hip_rot"] for a in front_hist]) / len(front_hist), 2
                    ) if front_hist else 0,
                    "arm_position_score": 0,
                    "shoulder_deviation_ratio": avg_xf,
                    "section_score": backswing_final,
                },
                "DOWNSWING": {
                    "spine_angle": round(
                        sum([a["spine"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "knee_angle": round(
                        sum([a["knee"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "shoulder_rotation": round(
                        sum([a["shoulder_rot"] for a in front_hist]) / len(front_hist), 2
                    ) if front_hist else 0,
                    "pelvis_rotation": round(
                        sum([a["hip_rot"] for a in front_hist]) / len(front_hist), 2
                    ) if front_hist else 0,
                    "arm_position_score": 0,
                    "shoulder_deviation_ratio": h_sc,
                    "section_score": downswing_final,
                },
                "IMPACT_FINISH": {
                    "spine_angle": round(
                        sum([a["spine"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "knee_angle": round(
                        sum([a["knee"] for a in side_hist]) / len(side_hist), 2
                    ) if side_hist else 0,
                    "shoulder_rotation": 0,
                    "pelvis_rotation": 0,
                    "arm_position_score": ee_sc,
                    "shoulder_deviation_ratio": ss,
                    "section_score": impact_final,
                },
            },

            "section_scores": {
                "ADDRESS": address_final,
                "BACKSWING": backswing_final,
                "DOWNSWING": downswing_final,
                "IMPACT": impact_final,
            },
            "side_result_path": side_final_path,
            "front_result_path": front_final_path,
        }


if __name__ == "__main__":
    result = run_analysis(
        side_path="./videos/leedriverside.mp4",
        front_path="./videos/leedriverfront.mp4",
        club="driver",
        ball_x=277,
        ball_y=560,
        analysis_id="test_001",
        output_dir="./uploads",
    )

    print(result)