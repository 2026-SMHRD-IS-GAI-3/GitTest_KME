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

// @WebServlet("/communityWrite")
public class CommunityWriteService_BK extends HttpServlet {

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

            Map<String, Object> reqMap =
                    gson.fromJson(sb.toString(), Map.class);

            int userId =
                    ((Double) reqMap.get("userId")).intValue();

            String title =
                    String.valueOf(reqMap.get("title"));

            String content =
                    String.valueOf(reqMap.get("content"));

            if (title == null || title.trim().isEmpty()) {
                resultMap.put("success", false);
                resultMap.put("message", "제목을 입력해주세요.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            if (content == null || content.trim().isEmpty()) {
                resultMap.put("success", false);
                resultMap.put("message", "내용을 입력해주세요.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            CommunityDTO dto = new CommunityDTO();

            dto.setUserId(userId);
            dto.setTitle(title);
            dto.setContent(content);

            int result = dao.insertPost(dto);

            if (result > 0) {

                resultMap.put("success", true);
                resultMap.put("message", "게시글 등록 성공");

            } else {

                resultMap.put("success", false);
                resultMap.put("message", "게시글 등록 실패");
            }

        } catch (Exception e) {

            e.printStackTrace();

            resultMap.put("success", false);
            resultMap.put("message", "게시글 등록 중 오류가 발생했습니다.");
        }

        response.getWriter().print(gson.toJson(resultMap));
    }

    private void setCorsHeaders(HttpServletResponse response) {

        response.setHeader(
                "Access-Control-Allow-Origin",
                "http://localhost:5173"
        );

        response.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        response.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        response.setHeader(
                "Access-Control-Allow-Credentials",
                "true"
        );
    }
}