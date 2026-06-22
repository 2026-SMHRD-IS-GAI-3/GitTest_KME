package com.swinglab.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.CommunityDAO;

@WebServlet("/communityViewCount")
public class CommunityViewCountService extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final Gson gson = new Gson();
    private final CommunityDAO dao = new CommunityDAO();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setContentType("application/json;charset=UTF-8");

        String postId = request.getParameter("postId");

        Map<String, Object> resultMap = new HashMap<>();

        if (postId == null || postId.trim().isEmpty()) {
            resultMap.put("success", false);
            resultMap.put("message", "postId가 없습니다.");
            response.getWriter().print(gson.toJson(resultMap));
            return;
        }

        int result = dao.increaseViewCount(postId);

        resultMap.put("success", result > 0);
        response.getWriter().print(gson.toJson(resultMap));
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}