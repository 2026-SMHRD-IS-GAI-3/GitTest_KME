package com.swinglab.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.CommunityDAO;
import com.swinglab.model.CommunityDTO;

@WebServlet("/communityDelete")
public class CommunityDeleteService extends HttpServlet {

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

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();

            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            Map<String, Object> reqMap = gson.fromJson(sb.toString(), Map.class);

            String postId = String.valueOf(reqMap.get("postId"));
            int userId = ((Double) reqMap.get("userId")).intValue();

            if (postId == null || postId.trim().isEmpty() || postId.equals("null")) {
                resultMap.put("success", false);
                resultMap.put("message", "게시글 번호가 없습니다.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            CommunityDTO dto = new CommunityDTO();
            dto.setPostId(postId);
            dto.setUserId(userId);

            dao.deleteCommentsByPost(postId);

            int result = dao.deletePost(dto);

            if (result > 0) {
                resultMap.put("success", true);
                resultMap.put("message", "게시글 삭제 성공");
            } else {
                resultMap.put("success", false);
                resultMap.put("message", "게시글 삭제 실패 또는 삭제 권한이 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("success", false);
            resultMap.put("message", "게시글 삭제 중 오류가 발생했습니다.");
        }

        response.getWriter().print(gson.toJson(resultMap));
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}