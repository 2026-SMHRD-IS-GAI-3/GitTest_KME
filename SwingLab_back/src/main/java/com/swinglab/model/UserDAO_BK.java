package com.swinglab.model;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.swinglab.database.SqlSessionManager;

public class UserDAO_BK {

    private SqlSessionFactory sqlSessionFactory =
            SqlSessionManager.getSqlSessionFactory();

    // 이메일 중복 체크
    public boolean checkEmail(String email) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

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
            if (session != null) {
                session.close();
            }
        }
    }

    // 닉네임 중복 체크
    public boolean checkNickname(String nickname) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

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
            if (session != null) {
                session.close();
            }
        }
    }

    // 회원가입
    public int insertUser(UserDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            int result = session.insert(
                    "com.swinglab.database.UserMapper.joinUser",
                    dto
            );

            session.commit();
            return result;

        } catch (Exception e) {
            System.err.println("UserDAO 회원가입 오류");
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

    // 로그인
    public UserDTO login(UserDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

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
            if (session != null) {
                session.close();
            }
        }
    }

    // 아이디 찾기
    public String findEmail(UserDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

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
            if (session != null) {
                session.close();
            }
        }
    }

    // 비밀번호 찾기 사용자 확인
    public UserDTO findPasswordUser(UserDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

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
            if (session != null) {
                session.close();
            }
        }
    }

    // 비밀번호 재설정
    public int resetPassword(UserDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            System.out.println("DAO email : [" + dto.getEmail() + "]");
            System.out.println("DAO password : [" + dto.getPassword() + "]");
            System.out.println("Mapper 실행 직전");

            int result = session.update(
                    "com.swinglab.database.UserMapper.updatePasswordByEmail",
                    dto
            );

            System.out.println("DAO update result : " + result);

            session.commit();
            return result;

        } catch (Exception e) {
            System.err.println("UserDAO 비밀번호 재설정 오류");
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
}