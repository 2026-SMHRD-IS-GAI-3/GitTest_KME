package com.swinglab.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.swinglab.database.SqlSessionManager;

public class SwingAnalysisDAO {

    private SqlSessionFactory sqlSessionFactory =
            SqlSessionManager.getSqlSessionFactory();

    public int saveSwingAnalysis(SwingAnalysisSaveDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(false);

            String clubType = dto.getClubType();

            if ("driver".equalsIgnoreCase(clubType) || "드라이버".equals(clubType)) {
                dto.setClubType("DRIVER");
            } else if ("iron".equalsIgnoreCase(clubType) || "아이언".equals(clubType)) {
                dto.setClubType("IRON");
            }

            SwingAnalysisSaveDTO bodyProfile = session.selectOne(
                    "com.swinglab.database.SwingAnalysisMapper.selectBodyProfileByUserId",
                    dto.getUserId()
            );

            if (bodyProfile != null) {
                dto.setBodyCode(bodyProfile.getBodyCode());
                dto.setArmLengthType(bodyProfile.getArmLengthType());
                dto.setHandType(bodyProfile.getHandType());
            } else {
                dto.setBodyCode("BT05");
                dto.setArmLengthType("AVERAGE");
                dto.setHandType("RIGHT");
            }

            session.insert(
                    "com.swinglab.database.SwingAnalysisMapper.insertFrontSwingVideo",
                    dto
            );

            session.insert(
                    "com.swinglab.database.SwingAnalysisMapper.insertSideSwingVideo",
                    dto
            );

            session.insert(
                    "com.swinglab.database.SwingAnalysisMapper.insertSwingAnalysis",
                    dto
            );

            insertSectionScore(session, dto, "ADDRESS", dto.getAddressScore());
            insertSectionScore(session, dto, "BACKSWING", dto.getBackswingScore());
            insertSectionScore(session, dto, "DOWNSWING", dto.getDownswingScore());
            insertSectionScore(session, dto, "IMPACT_FINISH", dto.getImpactScore());

            List<String> feedbacks = dto.getFeedbacks();

            if (feedbacks != null && !feedbacks.isEmpty()) {
                for (String feedback : feedbacks) {
                    insertFeedback(session, dto.getAnalysisId(), feedback);
                }
            }

            session.commit();

            return 1;

        } catch (Exception e) {
            if (session != null) {
                session.rollback();
            }

            System.err.println("SwingAnalysisDAO 스윙 분석 저장 오류");
            e.printStackTrace();

            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public List<SwingAnalysisSaveDTO> selectHistoryList(int userId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            return session.selectList(
                    "com.swinglab.database.SwingAnalysisMapper.selectHistoryList",
                    userId
            );

        } catch (Exception e) {
            System.err.println("SwingAnalysisDAO 기록 목록 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public SwingAnalysisSaveDTO selectHistoryDetail(int analysisId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            return session.selectOne(
                    "com.swinglab.database.SwingAnalysisMapper.selectHistoryDetail",
                    analysisId
            );

        } catch (Exception e) {
            System.err.println("SwingAnalysisDAO 기록 상세 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public List<Map<String, Object>> selectSectionScores(int analysisId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            return session.selectList(
                    "com.swinglab.database.SwingAnalysisMapper.selectSectionScores",
                    analysisId
            );

        } catch (Exception e) {
            System.err.println("SwingAnalysisDAO 구간 점수 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public List<String> selectFeedbacks(int analysisId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            return session.selectList(
                    "com.swinglab.database.SwingAnalysisMapper.selectFeedbacks",
                    analysisId
            );

        } catch (Exception e) {
            System.err.println("SwingAnalysisDAO 피드백 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void insertSectionScore(
            SqlSession session,
            SwingAnalysisSaveDTO dto,
            String sectionName,
            double sectionScore) {

        Map<String, Object> sectionDetails =
                dto.getSectionDetails();

        Map<String, Object> detail = null;

        if (sectionDetails != null
                && sectionDetails.containsKey(sectionName)) {

            detail = (Map<String, Object>)
                    sectionDetails.get(sectionName);
        }

        Map<String, Object> map = new HashMap<>();

        map.put("analysisId", dto.getAnalysisId());
        map.put("sectionName", sectionName);

        map.put("spineAngle",
                getDoubleValue(detail, "spine_angle"));

        map.put("kneeAngle",
                getDoubleValue(detail, "knee_angle"));

        map.put("shoulderRotation",
                getDoubleValue(detail, "shoulder_rotation"));

        map.put("pelvisRotation",
                getDoubleValue(detail, "pelvis_rotation"));

        map.put("armPositionScore",
                getDoubleValue(detail, "arm_position_score"));

        map.put("shoulderDeviationRatio",
                getDoubleValue(detail, "shoulder_deviation_ratio"));

        map.put("sectionScore", sectionScore);

        session.insert(
                "com.swinglab.database.SwingAnalysisMapper.insertSectionScore",
                map
        );
    }

    private double getDoubleValue(Map<String, Object> detail, String key) {
        if (detail == null) {
            return 0;
        }

        Object value = detail.get(key);

        if (value == null) {
            return 0;
        }

        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }

        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (Exception e) {
            return 0;
        }
    }

    private void insertFeedback(SqlSession session, int analysisId, String feedbackText) {
        Map<String, Object> map = new HashMap<>();

        map.put("analysisId", analysisId);
        map.put("sectionName", "ADDRESS");
        map.put("problemType", "AI_FEEDBACK");
        map.put("feedbackText", feedbackText);
        map.put("correctionGuide", feedbackText);
        map.put("measuredValue", "");
        map.put("limitValue", "");

        session.insert(
                "com.swinglab.database.SwingAnalysisMapper.insertFeedback",
                map
        );
    }
    
    
    
}