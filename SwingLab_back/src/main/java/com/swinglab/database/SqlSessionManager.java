package com.swinglab.database;

import java.io.Reader;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class SqlSessionManager {

    private static SqlSessionFactory factory;

    static {
        try {
            String resource = "com/swinglab/database/mybatis-config.xml";
            Reader reader = Resources.getResourceAsReader(resource);
            factory = new SqlSessionFactoryBuilder().build(reader);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static SqlSession getSqlSession() {
        return factory.openSession(true);
    }

    public static SqlSessionFactory getSqlSessionFactory() {
        return factory;
    }
}