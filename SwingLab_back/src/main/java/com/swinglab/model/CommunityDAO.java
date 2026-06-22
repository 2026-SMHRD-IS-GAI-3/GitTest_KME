package com.swinglab.model;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.swinglab.database.SqlSessionManager;

public class CommunityDAO {

    private SqlSessionFactory sqlSessionFactory =
            SqlSessionManager.getSqlSessionFactory();

    // 1. 게시글 등록
    public int insertPost(CommunityDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.insert(
                    "com.swinglab.database.CommunityMapper.insertPost",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 게시글 등록 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    // 2. 전체 게시글 목록 조회
    public List<CommunityDTO> selectAllPosts() {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            List<CommunityDTO> list = session.selectList(
                    "com.swinglab.database.CommunityMapper.selectAllPosts"
            );

            return list;

        } catch (Exception e) {
            System.err.println("CommunityDAO 게시글 목록 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    // 3. 게시글 상세 조회
    public CommunityDTO selectPostById(String postId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            CommunityDTO dto = session.selectOne(
                    "com.swinglab.database.CommunityMapper.selectPostById",
                    postId
            );

            return dto;

        } catch (Exception e) {
            System.err.println("CommunityDAO 게시글 상세 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    // 4. 게시글 수정
    public int updatePost(CommunityDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.update(
                    "com.swinglab.database.CommunityMapper.updatePost",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 게시글 수정 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    // 5. 댓글 등록
    public int insertComment(CommentDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.insert(
                    "com.swinglab.database.CommunityMapper.insertComment",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 댓글 등록 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    // 6. 특정 게시글 댓글 목록 조회
    public List<CommentDTO> selectCommentsByPost(String postId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession();

            List<CommentDTO> list = session.selectList(
                    "com.swinglab.database.CommunityMapper.selectCommentsByPost",
                    postId
            );

            return list;

        } catch (Exception e) {
            System.err.println("CommunityDAO 댓글 목록 조회 오류");
            e.printStackTrace();
            return null;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    // 7. 댓글 수정
    public int updateComment(CommentDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.update(
                    "com.swinglab.database.CommunityMapper.updateComment",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 댓글 수정 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    public int deleteCommentsByPost(String postId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.delete(
                    "com.swinglab.database.CommunityMapper.deleteCommentsByPost",
                    postId
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 게시글 댓글 삭제 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    

    // 9. 게시글 삭제
    public int deletePost(CommunityDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.delete(
                    "com.swinglab.database.CommunityMapper.deletePost",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 게시글 삭제 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    // 10. 댓글 삭제
    public int deleteComment(CommentDTO dto) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.delete(
                    "com.swinglab.database.CommunityMapper.deleteComment",
                    dto
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 댓글 삭제 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    // 11. 게시판 파일 업로드
    public int insertCommunityFile(CommunityFileDTO dto) {
        SqlSession session = SqlSessionManager.getSqlSession();

        try {
            int result = session.insert(
                "com.swinglab.database.CommunityMapper.insertCommunityFile",
                dto
            );

            session.commit();
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            session.rollback();
            return 0;

        } finally {
            session.close();
        }
    }
    
    // 12. 게시판 조회수 증가 
    public int increaseViewCount(String postId) {
        SqlSession session = null;

        try {
            session = sqlSessionFactory.openSession(true);

            int result = session.update(
                "com.swinglab.database.CommunityMapper.increaseViewCount",
                postId
            );

            return result;

        } catch (Exception e) {
            System.err.println("CommunityDAO 조회수 증가 오류");
            e.printStackTrace();
            return 0;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
}