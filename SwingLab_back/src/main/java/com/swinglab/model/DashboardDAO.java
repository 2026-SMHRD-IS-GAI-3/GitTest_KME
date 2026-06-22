package com.swinglab.model;

import org.apache.ibatis.session.SqlSession;

import com.swinglab.database.SqlSessionManager;

public class DashboardDAO {

    public DashboardDTO getDashboard() {

        SqlSession sqlSession = SqlSessionManager.getSqlSession();

        DashboardDTO dto = sqlSession.selectOne("dashboard.getDashboard");

        sqlSession.close();

        return dto;
    }
}