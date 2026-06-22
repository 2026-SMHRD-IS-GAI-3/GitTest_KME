package com.swinglab.model;

import org.apache.ibatis.session.SqlSession;
import com.swinglab.database.SqlSessionManager;

public class UserDAO {

    // 이메일 중복 체크
    public boolean checkEmail(String email) {
        SqlSession session = null;

        try {
            session = SqlSessionManager.getSqlSession();

            String existEmail = session.selectOne(
                    "com.swinglab.database.UserMapper.checkEmail",
                    email
            );

            return existEmail == null;

        } catch (Exception e) {
            System.err.println("UserDAO 이메일 중복 체크 오류");
            e.printStackTrace();
            return false;

        } finally {
            if (session != null) session.close();
        }
    }

    // 닉네임 중복 체크
    public boolean checkNickname(String nickname) {
        SqlSession session = null;

        try {
            session = SqlSessionManager.getSqlSession();

            String existNickname = session.selectOne(
                    "com.swinglab.database.UserMapper.checkNickname",
                    nickname
            );

            return existNickname == null;

        } catch (Exception e) {
            System.err.println("UserDAO 닉네임 중복 체크 오류");
            e.printStackTrace();
            return false;

        } finally {
            if (session != null) session.close();
        }
    }

    // 회원가입
    public int insertUser(UserDTO dto) {
        SqlSession session = null;

        try {
            session = SqlSessionManager.getSqlSession();

            int result = session.insert(
                    "com.swinglab.database.UserMapper.joinUser",
                    dto
            );

            session.commit();
            return result;

        } catch (Exception e) {
            System.err.println("UserDAO 회원가입 오류");
            e.printStackTrace();

            if (session != null) session.rollback();

            return 0;

        } finally {
            if (session != null) session.close();
        }
    }

    // 로그인
    public UserDTO login(UserDTO dto) {
        SqlSession session = null;

        try {
            session = SqlSessionManager.getSqlSession();

            UserDTO result = session.selectOne(
                    "com.swinglab.database.UserMapper.login",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("UserDAO 로그인 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) session.close();
        }
    }

    // 아이디 찾기
    public String findEmail(UserDTO dto) {
        SqlSession session = null;

        try {
            session = SqlSessionManager.getSqlSession();

            String email = session.selectOne(
                    "com.swinglab.database.UserMapper.findEmail",
                    dto
            );

            return email;

        } catch (Exception e) {
            System.err.println("UserDAO 아이디 찾기 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) session.close();
        }
    }

    // 비밀번호 찾기 사용자 확인
    public UserDTO findPasswordUser(UserDTO dto) {
        SqlSession session = null;

        try {
            session = SqlSessionManager.getSqlSession();

            UserDTO result = session.selectOne(
                    "com.swinglab.database.UserMapper.findPasswordUser",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("UserDAO 비밀번호 찾기 사용자 확인 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) session.close();
        }
    }

    // 비밀번호 재설정
    public int resetPassword(UserDTO dto) {
        SqlSession session = null;

        try {
            session = SqlSessionManager.getSqlSession();

            int result = session.update(
                    "com.swinglab.database.UserMapper.updatePasswordByEmail",
                    dto
            );

            session.commit();
            return result;

        } catch (Exception e) {
            System.err.println("UserDAO 비밀번호 재설정 오류");
            e.printStackTrace();

            if (session != null) session.rollback();

            return 0;

        } finally {
            if (session != null) session.close();
        }
    }
}