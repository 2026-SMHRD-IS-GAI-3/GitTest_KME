package com.swinglab.model;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.swinglab.database.SqlSessionManager;

public class BodyAnalysisDAO {

    private SqlSessionFactory sqlSessionFactory =
            SqlSessionManager.getSqlSessionFactory();

    public int saveBodyAnalysis(BodyAnalysisDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            int result = session.insert(
                    "com.swinglab.database.UserMapper.saveBodyAnalysis",
                    dto
            );

            session.commit();
            return result;

        } catch (Exception e) {
            System.err.println("BodyAnalysisDAO 체형 분석 저장 오류");
            e.printStackTrace();

            if (session != null) {
                session.rollback();
            }

            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    public boolean existsBodyProfile(int userId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            Integer count = session.selectOne(
                    "com.swinglab.database.UserMapper.existsBodyProfile",
                    userId
            );

            return count != null && count > 0;

        } catch (Exception e) {
            System.err.println("BodyAnalysisDAO 체형 프로필 존재 확인 오류");
            e.printStackTrace();
            return false;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}