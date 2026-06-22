package com.swinglab.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.SwingAnalysisDAO;
import com.swinglab.model.SwingAnalysisSaveDTO;

@WebServlet("/historyList")
public class HistoryListService extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final Gson gson = new Gson();
    private final SwingAnalysisDAO dao = new SwingAnalysisDAO();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String userIdStr = request.getParameter("userId");

            if (userIdStr == null || userIdStr.trim().isEmpty()) {
                resultMap.put("success", false);
                resultMap.put("message", "회원 정보가 없습니다.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            int userId = Integer.parseInt(userIdStr);

            List<SwingAnalysisSaveDTO> list = dao.selectHistoryList(userId);

            resultMap.put("success", true);
            resultMap.put("data", list);

        } catch (Exception e) {
            e.printStackTrace();

            resultMap.put("success", false);
            resultMap.put("message", "분석 기록 조회 중 오류가 발생했습니다.");
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