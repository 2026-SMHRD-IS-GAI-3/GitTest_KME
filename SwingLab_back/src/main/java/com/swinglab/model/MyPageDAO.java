package com.swinglab.model;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.swinglab.database.SqlSessionManager;

public class MyPageDAO {

    private SqlSessionFactory sqlSessionFactory =
            SqlSessionManager.getSqlSessionFactory();

    public MyPageDTO getMyPageInfo(int userId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            MyPageDTO dto = session.selectOne(
                    "com.swinglab.database.UserMapper.getMyPageInfo",
                    userId
            );

            return dto;

        } catch (Exception e) {
            System.err.println("MyPageDAO 마이페이지 정보 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public int checkPassword(Map<String, String> paramMap) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            int count = session.selectOne(
                    "com.swinglab.database.UserMapper.checkPassword",
                    paramMap
            );

            return count;

        } catch (Exception e) {
            System.err.println("MyPageDAO 비밀번호 확인 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public int updateProfile(Map<String, Object> paramMap) {

        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(false);

            int userResult = session.update(
                    "com.swinglab.database.UserMapper.updateUserProfile",
                    paramMap
            );

            int bodyResult = session.update(
                    "com.swinglab.database.UserMapper.updateBodyProfile",
                    paramMap
            );

            session.commit();

            return userResult + bodyResult;

        } catch (Exception e) {

            if (session != null) {
                session.rollback();
            }

            System.err.println("MyPageDAO 프로필 수정 오류");
            e.printStackTrace();

            return 0;

        } finally {

            if (session != null) {
                session.close();
            }
        }
    }
}